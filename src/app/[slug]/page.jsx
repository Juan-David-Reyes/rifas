import { createClient } from '../../utils/supabase/server'
import { notFound } from 'next/navigation'
import TicketGrid from '../../components/TicketGrid'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: raffle } = await supabase
    .from('raffles')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!raffle) {
    return { title: 'Rifa no encontrada' }
  }

  return {
    title: `${raffle.title} | Rifas.io`,
    description: raffle.description,
  }
}

export default async function PublicRafflePage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Fetch Raffle Data
  const { data: raffle, error: raffleError } = await supabase
    .from('raffles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (raffleError || !raffle) {
    notFound()
  }

  // 2. Fetch Tickets for this specific raffle
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .eq('raffle_id', raffle.id)
    .order('ticket_number', { ascending: true })

  // 3. Check if user is admin (owner) of this raffle
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user && user.id === raffle.user_id

  return (
    <div className="min-h-screen bg-gray-50">
      {isAdmin && (
        <div className="bg-gray-900 text-white text-center py-2 text-sm font-bold">
          Estás viendo esta rifa como Administrador. <a href="/dashboard" className="underline text-blue-300 ml-2">Volver al Dashboard</a>
        </div>
      )}

      {/* Header Público */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 text-center font-heading">
            {raffle.title}
          </h1>
          <p className="text-gray-500 mt-2 text-center max-w-2xl text-sm md:text-base">
            {raffle.description}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Premio</p>
              <p className="text-xl font-black text-gray-900">{raffle.prize}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Sortea el</p>
              <p className="text-lg font-bold text-gray-900">{raffle.draw_date} con {raffle.lottery_name}</p>
            </div>
          </div>
        </div>

        {raffle.winner_ticket_id !== null ? (
          <div className="bg-secondary-600 text-white p-8 rounded-3xl text-center shadow-lg transform hover:scale-105 transition-transform duration-500 mb-10">
            <h2 className="text-2xl font-bold mb-2">¡Rifa Finalizada! 🎉</h2>
            <p className="text-secondary-100 mb-6">El número ganador oficial es:</p>
            <div className="text-8xl font-black font-heading drop-shadow-md">
              {String(raffle.winner_ticket_id).padStart(2, '0')}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Selecciona tus números</h2>
              <p className="text-gray-500">Valor del puesto (2 números): <strong className="text-secondary-600">${(raffle.ticket_price * 2).toLocaleString('es-CO')}</strong></p>
            </div>

            {/* Client Component for interactive Grid */}
            <TicketGrid 
              initialTickets={tickets || []} 
              raffle={raffle} 
              isAdmin={isAdmin} 
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-400 text-sm">
        <p>Impulsado por <a href="/" className="font-bold text-primary-600 hover:underline">Rifas.io</a></p>
      </footer>
    </div>
  )
}
