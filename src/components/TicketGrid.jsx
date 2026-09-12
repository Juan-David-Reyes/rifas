'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
import { differenceInMinutes, parseISO } from 'date-fns';
import { createClient } from '../utils/supabase/client';
import CheckoutModal from './CheckoutModal';
import TicketButton from './TicketButton';
import { formatMoney, formatTicketNumber } from '../utils/formatters';

export default function TicketGrid({ initialTickets, raffle, isAdmin }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [now, setNow] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concurrencyErrorNumbers, setConcurrencyErrorNumbers] = useState([]);
  const supabase = createClient();
  const subscriptionRef = useRef(null);

  // Lazy evaluation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Realtime subscription
  useEffect(() => {
    subscriptionRef.current = supabase.channel(`tickets_for_raffle_${raffle.id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'tickets',
        filter: `raffle_id=eq.${raffle.id}`
      }, (payload) => {
        setTickets(current => current.map(t => t.id === payload.new.id ? payload.new : t));
        
        // Remove from selection if someone else took it
        if (payload.new.status !== 'disponible') {
          setSelectedTickets(prev => prev.filter(num => num !== payload.new.ticket_number));
        }
      })
      .subscribe();

    return () => {
      if (subscriptionRef.current) supabase.removeChannel(subscriptionRef.current);
    };
  }, [raffle.id, supabase]);

  const allNumbers = useMemo(() => Array.from({ length: raffle.total_tickets }, (_, i) => i), [raffle.total_tickets]);

  const ticketMap = useMemo(() => {
    return tickets.reduce((acc, t) => {
      acc[t.ticket_number] = t;
      return acc;
    }, {});
  }, [tickets]);

  const toggleTicket = (num) => {
    if (selectedTickets.includes(num)) {
      setSelectedTickets(selectedTickets.filter(n => n !== num));
    } else {
      setSelectedTickets([...selectedTickets, num]);
    }
  };

  const handleAdminApproval = async (ticket_number) => {
    if (!isAdmin) return;
    const dbTicket = ticketMap[ticket_number];
    if (!dbTicket) return;
    
    // Toggle bought state for admin
    const newStatus = dbTicket.status === 'comprado' ? 'disponible' : 'comprado';
    
    await supabase
      .from('tickets')
      .update({ status: newStatus, buyer_name: newStatus === 'comprado' ? 'Admin Aprobado' : null })
      .eq('id', dbTicket.id);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {allNumbers.map((num) => {
            const dbTicket = ticketMap[num];
            let computedStatus = dbTicket ? dbTicket.status : 'disponible';

            if (computedStatus === 'reservado' && dbTicket?.reserved_at) {
              const minutesPassed = differenceInMinutes(now, parseISO(dbTicket.reserved_at));
              if (minutesPassed >= 15) {
                computedStatus = 'disponible';
              }
            }

            const isSelected = selectedTickets.includes(num);
            const isWinner = raffle.winner_ticket_id === dbTicket?.id;
            
            let isDisabled = false;
            if (raffle.winner_ticket_id !== null) {
              isDisabled = true;
            } else if (computedStatus === 'comprado' || computedStatus === 'reservado') {
              isDisabled = !isAdmin;
            } else if (!isAdmin && selectedTickets.length >= 100) {
              isDisabled = true;
            }

            return (
              <TicketButton
                key={num}
                num={num}
                computedStatus={computedStatus}
                isSelected={isSelected}
                isDisabled={isDisabled}
                isAdmin={isAdmin}
                isWinner={isWinner}
                onClick={(clickedNum) => {
                  if (isAdmin && (computedStatus === 'comprado' || computedStatus === 'reservado')) {
                    handleAdminApproval(clickedNum);
                  } else if (!isDisabled) {
                    toggleTicket(clickedNum);
                  }
                }}
              />
            );
          })}
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-2 text-sm text-gray-600 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white border border-[#777777] rounded-md"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary-600 rounded-md"></div>
            <span>Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-300 rounded-md border border-yellow-500"></div>
            <span>Reservado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-md border border-gray-300 relative overflow-hidden">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 transform -rotate-45 scale-150 opacity-60"></div>
            </div>
            <span>Comprado</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {selectedTickets.length > 0 && !isAdmin && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-bold">Números seleccionados</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-primary-700">
                  {selectedTickets.map(num => formatTicketNumber(num)).join(', ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-gray-500 text-xs font-bold uppercase">Total a pagar</p>
                <p className="text-xl font-black text-gray-900">
                  ${formatMoney(selectedTickets.length * raffle.ticket_price)}
                </p>
              </div>
              <button 
                disabled={selectedTickets.length === 0}
                onClick={() => setIsModalOpen(true)}
                className="bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary-700 text-white px-6 md:px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95"
              >
                Reservar y Pagar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <CheckoutModal 
          selectedTickets={selectedTickets} 
          ticketMap={ticketMap} // Pass the map to get DB UUIDs
          raffle={raffle}
          totalAPagar={selectedTickets.length * raffle.ticket_price}
          onClose={() => setIsModalOpen(false)}
          onConcurrencyError={(stolenNumbers) => {
            setConcurrencyErrorNumbers(stolenNumbers);
            setSelectedTickets(selectedTickets.filter(n => !stolenNumbers.includes(n)));
          }}
          onReset={() => {
            setSelectedTickets([]);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
