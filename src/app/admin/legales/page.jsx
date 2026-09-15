import { getSiteSettings } from '../../../utils/settingsActions'
import LegalFormClient from './LegalFormClient'
import { Scale } from 'lucide-react'

// Fuerza que esta ruta sea dinámica (SSR) para que siempre traiga datos frescos del CMS
export const dynamic = 'force-dynamic'

export default async function LegalesAdminPage() {
  const initialSettings = await getSiteSettings()

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="md:sticky md:top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Scale className="w-8 h-8 text-purple-500" />
            Páginas Legales
          </h1>
          <p className="text-gray-500 text-[15px] font-normal">
            Redacta y formatea tus Términos y Condiciones. El contenido se actualizará automáticamente en la vista pública.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        <LegalFormClient initialSettings={initialSettings} />
      </div>
    </div>
  )
}
