import { getSiteSettings } from '../../../utils/settingsActions'
import { DollarSign } from 'lucide-react'
import nextDynamic from 'next/dynamic'

const MonetizacionClient = nextDynamic(() => import('./MonetizacionClient'), {
  loading: () => <div className="h-64 flex items-center justify-center text-gray-400 font-medium">Cargando panel...</div>
})

export const dynamic = 'force-dynamic'

export default async function MonetizacionPage() {
  const settings = await getSiteSettings()
  
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="md:sticky md:top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl font-black font-heading text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            Monetización y Tarifas
          </h1>
          <p className="text-gray-500 text-[15px] font-normal">
            Configura el modelo de negocio de tu plataforma. Elige cómo y cuánto cobrar por la creación de cada rifa.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <MonetizacionClient initialSettings={settings} />
      </div>
    </div>
  )
}
