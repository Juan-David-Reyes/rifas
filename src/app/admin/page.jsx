import { getAdminDashboardStats } from '../../utils/superAdminActions'
import { Users, Ticket, DollarSign, Activity, AlertCircle, ShieldAlert, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { RaffleStatusButton, BanUserButton, DeleteRaffleButton } from './AdminControls'

// Fuerza que esta ruta sea dinámica (SSR) para que siempre traiga datos frescos
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  // Revisar si la service key está configurada
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="bg-red-50 border border-red-200 p-8 rounded-[32px] max-w-2xl mx-auto mt-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-red-900 mb-2">Falta la Service Role Key</h2>
        <p className="text-red-700 mb-6 font-medium">
          Para que el Super Admin Dashboard pueda leer los datos globales saltándose las reglas RLS, necesitas configurar la variable <code>SUPABASE_SERVICE_ROLE_KEY</code> en tu archivo <code>.env.local</code>.
        </p>
        <p className="text-red-700 text-sm">
          Puedes encontrarla en el panel de Supabase: Project Settings {'>'} API {'>'} service_role secret.
        </p>
      </div>
    )
  }

  // Obtener datos globales desde la caché optimizada
  const { totalUsers, totalRaffles, recentRaffles, usersData } = await getAdminDashboardStats()

  // Calcular Ingresos de la Plataforma (Costo de activación = 10,000 COP por rifa por ahora)
  const platformFee = 10000
  const totalRevenue = (totalRaffles || 0) * platformFee

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="md:sticky md:top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-gray-700" />
            Resumen Global
          </h1>
          <p className="text-gray-500 text-[15px] font-normal">Métricas en tiempo real de toda la plataforma deBuenas</p>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] border border-gray-200 flex flex-col justify-between transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">Organizadores</span>
            </div>
            <div>
              <h3 className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">Usuarios Registrados</h3>
              <p className="text-4xl font-black text-gray-900">{totalUsers}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-200 flex flex-col justify-between transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100">
                <Ticket className="w-6 h-6 text-purple-600" />
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">Activas</span>
            </div>
            <div>
              <h3 className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">Total de Rifas Creadas</h3>
              <p className="text-4xl font-black text-gray-900">{totalRaffles}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-200 flex flex-col justify-between transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] translate-x-8 -translate-y-8"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">Recaudo</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">Ingresos Plataforma</h3>
              <p className="text-4xl font-black text-green-600">${totalRevenue.toLocaleString('es-CO')}</p>
            </div>
          </div>
        </div>

        {/* Tabla Maestra de Rifas */}
        <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                <Activity className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
                <p className="text-gray-500 text-sm font-medium">Últimas rifas creadas en la plataforma.</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Rifa / Título</th>
                  <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Organizador</th>
                  <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Controles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!recentRaffles || recentRaffles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">No hay rifas registradas en la plataforma aún.</td>
                  </tr>
                ) : (
                  recentRaffles.map(raffle => {
                    const orgUser = usersData?.find(u => u.id === raffle.user_id)
                    const isBanned = orgUser?.banned_until != null
                    
                    return (
                    <tr key={raffle.id} className={`hover:bg-gray-50/50 transition-colors ${raffle.status === 'PAUSED' ? 'opacity-70' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{raffle.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{raffle.id}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(raffle.created_at).toLocaleDateString('es-CO', { 
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {orgUser?.email || 'Usuario Desconocido'}
                          </div>
                          <BanUserButton userId={raffle.user_id} isBanned={isBanned} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <RaffleStatusButton raffleId={raffle.id} currentStatus={raffle.status || 'ACTIVE'} />
                          <DeleteRaffleButton raffleId={raffle.id} />
                        </div>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
