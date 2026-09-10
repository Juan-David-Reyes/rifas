import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BarChart3, Users, DollarSign, Download, Trophy, Settings } from 'lucide-react'

export default async function RaffleDashboard({ params }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch the raffle
  const { data: raffle, error: raffleError } = await supabase
    .from('raffles')
    .select('*')
    .eq('id', id)
    .single()

  if (raffleError || raffle.user_id !== user.id) {
    redirect('/dashboard')
  }

  // Fetch all tickets for this raffle
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .eq('raffle_id', id)

  // Calculations (Ported from AdminStats)
  const PRECIO_POR_TICKET = raffle.ticket_price || 10000;
  const PRECIO_POR_PAR = PRECIO_POR_TICKET * 2; // Asumiendo que siguen vendiendo de a pares
  const totalTickets = raffle.total_tickets || 100;
  
  const reservedTickets = tickets?.filter(t => t.status === 'reservado').length || 0;
  const boughtTickets = tickets?.filter(t => t.status === 'comprado').length || 0;
  const availableTickets = totalTickets - (reservedTickets + boughtTickets);

  const totalCollected = (boughtTickets / 2) * PRECIO_POR_PAR;
  const totalReservedAmount = (reservedTickets / 2) * PRECIO_POR_PAR;
  const expectedTotal = (totalTickets / 2) * PRECIO_POR_PAR;

  // Group buyers
  const buyersGroup = {};
  tickets?.filter(t => t.status === 'comprado' || t.status === 'reservado').forEach(t => {
    const key = t.buyer_name ? t.buyer_name.trim().toLowerCase() : 'desconocido_key_' + t.ticket_number;
    if (!buyersGroup[key]) {
      buyersGroup[key] = {
        name: t.buyer_name || 'Sin Nombre',
        phone: t.buyer_phone || '',
        numbers: [],
        status: t.status 
      };
    }
    buyersGroup[key].numbers.push(String(t.ticket_number).padStart(2, '0'));
    if (t.status === 'comprado') buyersGroup[key].status = 'comprado';
  });

  const buyersList = Object.values(buyersGroup).map(buyer => ({
    ...buyer,
    amountToPay: (buyer.numbers.length / 2) * PRECIO_POR_PAR
  })).sort((a, b) => b.numbers.length - a.numbers.length);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{raffle.title}</h1>
            <p className="text-gray-500 text-sm">Panel de control de la rifa (rifas.io/{raffle.slug})</p>
          </div>
        </div>
        <Link 
          href={`/${raffle.slug}`} target="_blank"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all"
        >
          Ver Rifa Pública
        </Link>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
          <div className="text-gray-500 text-sm font-semibold mb-1 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" /> Recaudado (Pagado)
          </div>
          <div className="text-4xl font-black text-gray-900">
            ${totalCollected.toLocaleString('es-CO')}
          </div>
          <div className="text-sm text-gray-400 mt-1 font-medium">
            Meta: ${expectedTotal.toLocaleString('es-CO')}
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 flex flex-col justify-center">
          <div className="text-yellow-700 text-xs font-bold uppercase mb-1">Por Validar</div>
          <div className="text-2xl font-bold text-yellow-900">${totalReservedAmount.toLocaleString('es-CO')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estados de los números */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <BarChart3 className="w-5 h-5 text-blue-500" /> Estado de los números
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <span className="text-gray-600 font-medium">Disponibles</span>
              </div>
              <span className="font-bold text-gray-900">{availableTickets}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600 font-medium">Reservados (Pendientes)</span>
              </div>
              <span className="font-bold text-gray-900">{reservedTickets}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">Aprobados (Pagados)</span>
              </div>
              <span className="font-bold text-gray-900">{boughtTickets}</span>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Settings className="w-5 h-5 text-gray-500" /> Acciones
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Actualmente la gestión detallada de los números se realiza en la página pública de la rifa.
          </p>
          <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-medium border border-blue-100">
            Para aprobar pagos, dirígete a tu página pública como administrador.
          </div>
        </div>
      </div>

      {/* Lista de Compradores */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Users className="w-5 h-5 text-purple-500" /> Compradores Activos ({buyersList.length})
        </h3>
        
        <div className="space-y-4">
          {buyersList.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Aún no hay reservas registradas en esta rifa.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buyersList.map((buyer, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-gray-900">{buyer.name}</div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${buyer.status === 'comprado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {buyer.status === 'comprado' ? 'Pagado' : 'Pendiente'}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    Números: <span className="font-bold text-gray-900">{buyer.numbers.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-xs text-gray-400">{buyer.phone || 'Sin teléfono'}</div>
                    <div className="text-blue-700 font-black">
                      ${buyer.amountToPay.toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
