export const metadata = { title: 'Crear Rifa' };

import { getSiteSettings } from '../../utils/settingsActions'
import CrearClient from './CrearClient'

export const dynamic = 'force-dynamic'

import Link from 'next/link'

export default async function CrearPage() {
  const settings = await getSiteSettings()
  
  if (settings && settings.allow_new_raffles === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-body items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-8 mx-auto shadow-sm">
          <span className="text-4xl">⏳</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black font-heading text-gray-900 mb-4">
          ¡Estamos a capacidad máxima!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Actualmente tenemos un volumen altísimo de rifas activas en la plataforma. Para garantizar la estabilidad del sistema, hemos pausado temporalmente la creación de nuevas rifas.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-700 font-bold border border-gray-200 shadow-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Lista de espera activa
        </div>
        <div>
          <Link href="/" className="text-primary-600 font-bold hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <CrearClient initialSettings={settings} />
  )
}
