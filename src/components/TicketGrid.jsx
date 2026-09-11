'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
import { differenceInMinutes, parseISO } from 'date-fns';
import { createClient } from '../utils/supabase/client';
import CheckoutModal from './CheckoutModal';

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
      if (selectedTickets.length < 2) {
        setSelectedTickets([...selectedTickets, num]);
      }
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
            let buttonClasses = "relative overflow-hidden h-14 w-full rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-sm flex justify-center items-center ";
            let isDisabled = false;
            let content = String(num).padStart(2, '0');

            if (raffle.winner_ticket_id !== null) {
              isDisabled = true;
              if (dbTicket?.id === raffle.winner_ticket_id) {
                buttonClasses += "bg-secondary-500 text-white border-b-4 border-secondary-700 shadow-xl ring-4 ring-secondary-300 scale-105 z-10";
                content = <span className="flex items-center gap-1 text-xl">🏆 {String(num).padStart(2, '0')}</span>;
              } else {
                buttonClasses += "bg-gray-100 text-gray-400 border border-gray-200 opacity-40 cursor-not-allowed";
              }
            } else {
              if (computedStatus === 'comprado') {
                buttonClasses += `bg-gray-200 text-gray-400 border border-gray-300 opacity-70 ${isAdmin ? 'cursor-pointer hover:border-gray-500 hover:opacity-100 hover:shadow-md' : 'cursor-not-allowed'}`;
                isDisabled = !isAdmin;
                content = (
                  <>
                    <span className="relative z-10">{String(num).padStart(2, '0')}</span>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-400 transform -rotate-45 scale-150 opacity-60"></div>
                  </>
                );
              } else if (computedStatus === 'reservado') {
                buttonClasses += `bg-yellow-300 text-yellow-800 border-b-4 border-yellow-500 ${isAdmin ? 'cursor-pointer hover:bg-yellow-400 hover:shadow-md' : 'cursor-not-allowed'}`;
                isDisabled = !isAdmin;
              } else {
                if (isSelected) {
                  buttonClasses += "bg-primary-600 text-white border-b-4 border-primary-800 shadow-md ring-2 ring-primary-300 ring-offset-2 z-10 scale-105";
                } else {
                  if (!isAdmin && selectedTickets.length >= 2) {
                    buttonClasses += "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60";
                    isDisabled = true;
                  } else {
                    buttonClasses += "bg-white text-gray-700 border border-[#777777] hover:border-primary-300 hover:bg-primary-50 hover:shadow-md";
                  }
                }
              }
            }

            return (
              <button
                key={num}
                onClick={() => {
                  if (isAdmin && (computedStatus === 'comprado' || computedStatus === 'reservado')) {
                    handleAdminApproval(num);
                  } else if (!isDisabled) {
                    toggleTicket(num);
                  }
                }}
                disabled={isDisabled}
                className={buttonClasses}
                title={`Número ${String(num).padStart(2, '0')} - ${computedStatus}`}
              >
                {content}
              </button>
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
                  {selectedTickets.map(num => String(num).padStart(2, '0')).join(', ')}
                </p>
                {selectedTickets.length === 1 && (
                  <span className="text-sm text-red-500 font-medium ml-2 animate-pulse">
                    Falta 1 número
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-gray-500 text-xs font-bold uppercase">Total a pagar</p>
                <p className="text-xl font-black text-gray-900">
                  ${((selectedTickets.length / 2) * (raffle.ticket_price * 2)).toLocaleString('es-CO')}
                </p>
              </div>
              <button 
                disabled={selectedTickets.length < 2}
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
          totalAPagar={(selectedTickets.length / 2) * (raffle.ticket_price * 2)}
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
