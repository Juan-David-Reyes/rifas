import { getSiteSettings } from '../../../utils/settingsActions'
import SistemaClient from './SistemaClient'

export const dynamic = 'force-dynamic'

export default async function SistemaPage() {
  const settings = await getSiteSettings()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black font-heading text-gray-900">Sistema y Seguridad</h1>
        <p className="text-gray-500 mt-2">
          Control maestro de la plataforma. Usa estos interruptores con precaución para pausar operaciones de forma global.
        </p>
      </div>

      <SistemaClient initialSettings={settings} />
    </div>
  )
}
