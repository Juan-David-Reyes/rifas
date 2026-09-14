import { getSiteSettings } from '../../../utils/settingsActions'
import MonetizacionClient from './MonetizacionClient'

export const dynamic = 'force-dynamic'

export default async function MonetizacionPage() {
  const settings = await getSiteSettings()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black font-heading text-gray-900">Monetización y Tarifas</h1>
        <p className="text-gray-500 mt-2">
          Configura el modelo de negocio de tu plataforma. Elige cómo y cuánto cobrar por la creación de cada rifa.
        </p>
      </div>

      <MonetizacionClient initialSettings={settings} />
    </div>
  )
}
