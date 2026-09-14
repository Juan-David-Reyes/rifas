import { getSiteSettings } from '../../../utils/settingsActions'
import LegalFormClient from './LegalFormClient'
import { Scale } from 'lucide-react'

// Fuerza que esta ruta sea dinámica (SSR) para que siempre traiga datos frescos del CMS
export const dynamic = 'force-dynamic'

export default async function LegalesAdminPage() {
  const initialSettings = await getSiteSettings()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Scale className="w-8 h-8 text-purple-500" />
          Páginas Legales
        </h1>
        <p className="text-gray-500 font-medium mt-2">
          Redacta y formatea tus Términos y Condiciones. El contenido se actualizará automáticamente en la vista pública.
        </p>
      </div>

      <LegalFormClient initialSettings={initialSettings} />
    </div>
  )
}
