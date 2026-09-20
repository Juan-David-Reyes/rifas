import { getSiteSettings } from '../../../utils/settingsActions'
import { Globe } from 'lucide-react'
import nextDynamic from 'next/dynamic'

const SeoFormClient = nextDynamic(() => import('./SeoFormClient'), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400 font-medium">Cargando editor...</div>
})

// Fuerza que esta ruta sea dinámica (SSR) para que siempre traiga datos frescos del CMS
export const dynamic = 'force-dynamic'

export default async function SeoAdminPage() {
  const initialSettings = await getSiteSettings()

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="md:sticky md:top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-500" />
            SEO y Apariencia
          </h1>
          <p className="text-gray-500 text-[15px] font-normal">
            Gestiona los textos principales de la plataforma sin tocar el código. Los cambios aplican inmediatamente.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8 justify-center flex">
        <SeoFormClient initialSettings={initialSettings} />
      </div>
    </div>
  )
}
