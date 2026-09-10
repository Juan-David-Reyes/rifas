import { createClient } from '../../utils/supabase/server'
import Link from 'next/link'
import { Plus, Ticket, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user's raffles
  const { data: raffles, error } = await supabase
    .from('raffles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Rifas</h1>
          <p className="text-gray-500 mt-1">Gestiona tus sorteos activos y pasados.</p>
        </div>
        <Link 
          href="/dashboard/create" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Rifa
        </Link>
      </div>

      {(!raffles || raffles.length === 0) ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Aún no tienes rifas</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Crea tu primera rifa en segundos. Solo necesitas un título, el premio y elegir un enlace personalizado.
          </p>
          <Link 
            href="/dashboard/create" 
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Crear mi primera rifa
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raffles.map((raffle) => (
            <div key={raffle.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1" title={raffle.title}>
                    {raffle.title}
                  </h3>
                  {raffle.winner_ticket_id !== null ? (
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">Finalizada</span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Activa</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{raffle.description}</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100 mb-6">
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Premio:</span>
                    <span className="font-bold text-gray-900">{raffle.prize}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tickets:</span>
                    <span className="font-bold text-gray-900">{raffle.total_tickets}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <Link 
                  href={`/dashboard/${raffle.id}`}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  Gestionar
                </Link>
                <Link 
                  href={`/${raffle.slug}`}
                  target="_blank"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2.5 rounded-lg font-bold transition-colors flex items-center justify-center"
                  title="Ver página pública"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
