import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import DashboardClient from '../../../components/DashboardClient'
import { cleanExpiredTickets } from '../../../utils/cleanup'
import { OrganizerRaffleControls } from './OrganizerControls'

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

  // JIT Cleanup before fetching tickets
  await cleanExpiredTickets(id)

  // Fetch all tickets for this raffle
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .eq('raffle_id', id)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{raffle.title}</h1>
            <p className="text-gray-500 text-sm">Panel de control de la rifa (debuenas.co/{raffle.slug})</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <OrganizerRaffleControls raffleId={raffle.id} currentStatus={raffle.status} />
          <Link 
            href={`/${raffle.slug}`} target="_blank"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all"
          >
            Ver Rifa Pública
          </Link>
        </div>
      </div>

      <DashboardClient raffle={raffle} initialTickets={tickets || []} user={user} />
    </div>
  )
}

