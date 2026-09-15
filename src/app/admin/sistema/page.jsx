import { getSiteSettings } from '../../../utils/settingsActions'
import SistemaClient from './SistemaClient'

import { createAdminClient } from '../../../utils/supabase/admin'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black font-heading text-gray-900">Sistema y Seguridad</h1>
        <p className="text-gray-500 mt-2">
          Control maestro de la plataforma. Usa estos interruptores con precaución para pausar operaciones de forma global.
        </p>
      </div>

      <SistemaClient initialSettings={settings} auditLogs={enrichedLogs} />
    </div>
  )
}
