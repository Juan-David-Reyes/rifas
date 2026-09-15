import { getSiteSettings } from '../../../utils/settingsActions'
import SistemaClient from './SistemaClient'
import { createAdminClient } from '../../../utils/supabase/admin'
import { Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SistemaPage() {
  const settings = await getSiteSettings()
  
  // Obtener logs de auditoría (Anti-Fraude)
  const supabaseAdmin = createAdminClient()
  let enrichedLogs = []
  try {
    const { data: logs } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      
    if (logs && logs.length > 0) {
      // Fetch users and raffles to enrich the logs
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
      const { data: raffles } = await supabaseAdmin.from('raffles').select('id, title')
      
      enrichedLogs = logs.map(log => {
        const raffle = raffles?.find(r => r.id === log.raffle_id)
        const user = usersData?.users?.find(u => u.id === log.organizer_id)
        return {
          ...log,
          raffle_title: raffle?.title || 'Rifa Desconocida',
          organizer_email: user?.email || log.organizer_id
        }
      })
    }
  } catch (err) {
    console.error("No se pudo cargar la auditoría", err)
  }
  
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="md:sticky md:top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl font-black font-heading text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            Sistema y Seguridad
          </h1>
          <p className="text-gray-500 text-[15px] font-normal">
            Control maestro de la plataforma. Usa estos interruptores con precaución para pausar operaciones de forma global.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <SistemaClient initialSettings={settings} auditLogs={enrichedLogs} />
      </div>
    </div>
  )
}
