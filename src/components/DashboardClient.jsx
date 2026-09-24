'use client'

import { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { differenceInMinutes, parseISO } from 'date-fns';
import TabOverview from './dashboard/TabOverview';
import TabDetails from './dashboard/TabDetails';
import TabPayments from './dashboard/TabPayments';
import { approvePaymentAction, rejectPaymentAction } from '../utils/adminActions';
import TabWhatsApp from './dashboard/TabWhatsApp';

export default function DashboardClient({ raffle, initialTickets, user }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, details, payments, whatsapp
  const [tickets, setTickets] = useState(initialTickets);
  const supabase = createClient();
  const subscriptionRef = useRef(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isApproving, setIsApproving] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(new Date());

  // Lazy evaluation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState({
    title: raffle.title || '',
    description: raffle.description || '',
    prize: raffle.prize || '',
    lottery_name: raffle.lottery_name || '',
    draw_date: raffle.draw_date || '',
    winner_ticket_id: raffle.winner_ticket_id || '',
    payment_method_name: raffle.payment_method_name || 'Nequi',
    payment_account_number: raffle.payment_account_number || '',
    paymentMethods: (() => {
      try {
        if (raffle.payment_account_number && raffle.payment_account_number.startsWith('[')) {
          const parsed = JSON.parse(raffle.payment_account_number);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch(e) {}
      // Fallback
      return [{ bank: raffle.payment_method_name || 'Nequi', account: raffle.payment_account_number || '' }];
    })(),
    mercadopago_token: raffle.mercadopago_token || '',
    epayco_token: raffle.epayco_token || '',
    whatsapp_number: raffle.whatsapp_number || '',
    whatsapp_template: raffle.whatsapp_template || '¡Hola! Transfirí {{total}} por los números: {{boletas}}. Soy {{nombre}}.'
  });

  // Realtime subscription
  useEffect(() => {
    subscriptionRef.current = supabase.channel(`tickets_admin_${raffle.id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'tickets',
        filter: `raffle_id=eq.${raffle.id}`
      }, (payload) => {
        setTickets(current => current.map(t => t.id === payload.new.id ? payload.new : t));
      })
      .subscribe();

    return () => {
      if (subscriptionRef.current) supabase.removeChannel(subscriptionRef.current);
    };
  }, [raffle.id, supabase]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const dataToSave = {
        ...formData,
        payment_account_number: JSON.stringify(formData.paymentMethods),
        payment_method_name: 'Múltiples métodos',
        winner_ticket_id: formData.winner_ticket_id ? parseInt(formData.winner_ticket_id) : null
      };
      delete dataToSave.paymentMethods;

      const { error } = await supabase
        .from('raffles')
        .update(dataToSave)
        .eq('id', raffle.id);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Error al guardar la configuración: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprovePayment = async (buyerName) => {
    const ticketIdsToApprove = tickets
      .filter(t => t.buyer_name === buyerName && t.status === 'reservado')
      .map(t => t.id);

    if (ticketIdsToApprove.length === 0) return;

    setIsApproving(buyerName);
    try {
      await approvePaymentAction(ticketIdsToApprove);
      // Optimistic UI Update
      setTickets(current => current.map(t => 
        ticketIdsToApprove.includes(t.id) ? { ...t, status: 'comprado' } : t
      ));
    } catch (error) {
      alert("Error al aprobar pago: " + error.message);
    } finally {
      setIsApproving(null);
    }
  };

  const handleRejectPayment = async (buyerName) => {
    const reason = window.prompt(`¿Por qué vas a rechazar el pago de ${buyerName}? (Obligatorio para auditoría)`);
    if (!reason || !reason.trim()) {
      alert("Debes proporcionar un motivo para rechazar el pago.");
      return;
    }
    
    const ticketIdsToReject = tickets
      .filter(t => t.buyer_name === buyerName && t.status === 'reservado')
      .map(t => t.id);

    if (ticketIdsToReject.length === 0) return;

    setIsApproving(buyerName);
    try {
      await rejectPaymentAction(ticketIdsToReject, {
        raffleId: raffle.id,
        organizerId: user.id,
        buyerName: buyerName,
        actionType: 'RECHAZO',
        reason: reason.trim(),
        ticketCount: ticketIdsToReject.length
      });
      // Optimistic UI Update
      setTickets(current => current.map(t => 
        ticketIdsToReject.includes(t.id) 
          ? { ...t, status: 'disponible', reserved_at: null, buyer_name: null, receipt_url: null } 
          : t
      ));
    } catch (error) {
      alert("Error al rechazar pago: " + error.message);
    } finally {
      setIsApproving(null);
    }
  };

  const handleRevertPayment = async (buyerName) => {
    const reason = window.prompt(`¿Por qué vas a REVERTIR el pago ya aprobado de ${buyerName}? (Obligatorio para auditoría)`);
    if (!reason || !reason.trim()) {
      alert("Debes proporcionar un motivo para revertir el pago.");
      return;
    }
    
    const ticketIdsToRevert = tickets
      .filter(t => t.buyer_name === buyerName && t.status === 'comprado')
      .map(t => t.id);

    if (ticketIdsToRevert.length === 0) return;

    setIsApproving(buyerName);
    try {
      await rejectPaymentAction(ticketIdsToRevert, {
        raffleId: raffle.id,
        organizerId: user.id,
        buyerName: buyerName,
        actionType: 'REVERSION',
        reason: reason.trim(),
        ticketCount: ticketIdsToRevert.length
      });
      // Optimistic UI Update
      setTickets(current => current.map(t => 
        ticketIdsToRevert.includes(t.id) 
          ? { ...t, status: 'disponible', reserved_at: null, buyer_name: null, receipt_url: null } 
          : t
      ));
    } catch (error) {
      alert("Error al revertir pago: " + error.message);
    } finally {
      setIsApproving(null);
    }
  };

  const PRECIO_POR_TICKET = raffle.ticket_price || 10000;
  const totalTicketsCount = raffle.total_tickets || 100;
  
  // Filtrar y procesar tickets con Lazy Evaluation
  const validTickets = tickets.map(t => {
    if (t.status === 'reservado' && t.reserved_at) {
      const minutesPassed = differenceInMinutes(now, parseISO(t.reserved_at));
      if (minutesPassed >= 15) {
        return { ...t, status: 'disponible', buyer_name: null };
      }
    }
    return t;
  });

  const reservedTicketsCount = validTickets.filter(t => t.status === 'reservado').length;
  const boughtTicketsCount = validTickets.filter(t => t.status === 'comprado').length;
  const availableTicketsCount = totalTicketsCount - (reservedTicketsCount + boughtTicketsCount);

  const totalCollected = boughtTicketsCount * PRECIO_POR_TICKET;
  const totalReservedAmount = reservedTicketsCount * PRECIO_POR_TICKET;
  const expectedTotal = totalTicketsCount * PRECIO_POR_TICKET;

  // Agrupar Compradores usando validTickets
  const buyersGroup = {};
  validTickets.filter(t => t.status === 'comprado' || t.status === 'reservado').forEach(t => {
    const key = t.buyer_name ? t.buyer_name.trim().toLowerCase() : 'desconocido_' + t.ticket_number;
    if (!buyersGroup[key]) {
      buyersGroup[key] = {
        name: t.buyer_name || 'Sin Nombre',
        phone: t.buyer_phone || '',
        receipt_url: t.receipt_url || null,
        numbers: [],
        status: t.status 
      };
    }
    buyersGroup[key].numbers.push(String(t.ticket_number).padStart(2, '0'));
    // Si algún ticket tiene el receipt_url, lo actualizamos por si los anteriores eran nulos
    if (t.receipt_url && !buyersGroup[key].receipt_url) {
      buyersGroup[key].receipt_url = t.receipt_url;
    }
    if (t.status === 'comprado') buyersGroup[key].status = 'comprado';
  });

  let buyersList = Object.values(buyersGroup).map(buyer => ({
    ...buyer,
    amountToPay: buyer.numbers.length * PRECIO_POR_TICKET
  })).sort((a, b) => b.numbers.length - a.numbers.length);

  if (searchTerm) {
    buyersList = buyersList.filter(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.numbers.some(n => n.includes(searchTerm))
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Tabs Menu */}
      <div className="bg-white p-2 rounded-[32px] shadow-sm border border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Resumen', icon: '📊' },
          { id: 'details', label: 'Detalles', icon: '✏️' },
          { id: 'payments', label: 'Pagos', icon: '💳' },
          { id: 'whatsapp', label: 'WhatsApp', icon: '💬' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap flex items-center gap-2 py-2 px-4 rounded-3xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ----------------- TAB: OVERVIEW ----------------- */}
      {activeTab === 'overview' && (
        <TabOverview
          totalCollected={totalCollected}
          expectedTotal={expectedTotal}
          totalReservedAmount={totalReservedAmount}
          boughtTicketsCount={boughtTicketsCount}
          reservedTicketsCount={reservedTicketsCount}
          availableTicketsCount={availableTicketsCount}
          buyersList={buyersList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleApprovePayment={handleApprovePayment}
          handleRejectPayment={handleRejectPayment}
          handleRevertPayment={handleRevertPayment}
          isApproving={isApproving}
        />
      )}

      {/* ----------------- CONFIG TABS (FORM) ----------------- */}
      {activeTab !== 'overview' && (
        <form onSubmit={handleSaveConfig} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 mb-6 flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-bold border border-green-100 mb-6 flex items-start gap-2">
              <span>✅</span> Configuración actualizada correctamente.
            </div>
          )}

          {/* TAB: DETALLES */}
          <div className={activeTab === 'details' ? 'block' : 'hidden'}>
            <TabDetails 
              formData={formData} 
              handleChange={handleChange} 
              totalTicketsCount={totalTicketsCount} 
            />
          </div>

          {/* TAB: PAGOS */}
          <div className={activeTab === 'payments' ? 'block' : 'hidden'}>
            <TabPayments 
              formData={formData} 
              handleChange={handleChange}
              setFormData={setFormData}
            />
          </div>

          {/* TAB: WHATSAPP */}
          <div className={activeTab === 'whatsapp' ? 'block' : 'hidden'}>
            <TabWhatsApp 
              formData={formData} 
              handleChange={handleChange} 
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
