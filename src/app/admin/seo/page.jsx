import { getSiteSettings } from '../../../utils/settingsActions'
import SeoFormClient from './SeoFormClient'
import { Globe } from 'lucide-react'

// Fuerza que esta ruta sea dinámica (SSR) para que siempre traiga datos frescos del CMS
export const dynamic = 'force-dynamic'

export default async function SeoAdminPage() {
  const initialSettings = await getSiteSettings()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-500" />
          SEO y Apariencia
        </h1>
        <p className="text-gray-500 font-medium mt-2">
          Gestiona los textos principales de la plataforma sin tocar el código. Los cambios aplican inmediatamente.
        </p>
      </div>

      <SeoFormClient initialSettings={initialSettings} />
    </div>
  )
}
