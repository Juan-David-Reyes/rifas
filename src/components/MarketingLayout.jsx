'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

export default function MarketingLayout({ children }) {
  const pathname = usePathname()
  
  const marketingPaths = ['/', '/terminos-y-condiciones', '/politica-de-privacidad', '/politica-de-cookies']
  const isMarketing = marketingPaths.includes(pathname)

  return (
    <>
      {isMarketing && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-heading text-2xl font-extrabold text-primary-50">
              Rifas.io
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-primary-100 hover:text-primary-200 transition-colors px-4 py- rounded-lg">
                Inicio
              </Link>
              <Link href="/#como-funciona" className="text-sm font-medium text-primary-100 hover:text-primary-200 transition-colors px-4 py- rounded-lg">
                Cómo funciona
              </Link>
              <Link href="/login" className="text-sm font-medium text-primary-100 hover:text-primary-200 transition-colors px-6 py-2 rounded-lg border border-gray-200">
                Iniciar Sesión
              </Link>
              <Link href="/crear" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
                Crear mi rifa
              </Link>
            </nav>
          </div>
        </header>
      )}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {isMarketing && (
        <footer className="px-6 text-gray-700 py-4 text-center text-xs mt-auto">
          <div className='max-w-7xl mx-auto'>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 pt-4 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 font-semibold md:mr-4">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-sm">Pago 100% seguro mediante:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                {/* ePayco */}
                <div className="font-black tracking-tighter text-xl text-orange-500">ePayco</div>
                {/* MercadoPago */}
                <div className="font-bold tracking-tight text-xl text-blue-500 flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                  mercado<span className="font-normal text-blue-900">pago</span>
                </div>
                {/* Visa */}
                <div className="font-black italic text-2xl text-[#1a1f71]">VISA</div>
                {/* Mastercard */}
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#eb001b] mix-blend-multiply opacity-90"></div>
                    <div className="w-5 h-5 rounded-full bg-[#f79e1b] mix-blend-multiply opacity-90"></div>
                  </div>
                  <span className="font-bold text-sm text-gray-800 tracking-tight">mastercard</span>
                </div>
              </div>
            </div>

            <p className='text-left mb-6'><b>Aviso de Exención de Responsabilidad:</b> hazturifa es exclusivamente una herramienta tecnológica de software (SaaS) para la autogestión de rifas. No organizamos, patrocinamos ni operamos sorteos; no emitimos ni vendemos boletos directamente a los participantes, no custodiamos fondos de terceros y no entregamos premios. La legalidad del sorteo, la obtención de los permisos gubernamentales correspondientes en su país (como la autorización municipal o de entidades nacionales de juegos de azar) y la entrega final de los premios son de responsabilidad única y exclusiva de cada organizador. Al utilizar nuestro servicio, el organizador acepta cumplir con los <a href="/terminos-y-condiciones" className='text-primary-600 hover:underline font-semibold'>Términos y condiciones</a>, la <a href="/politica-de-privacidad" className='text-primary-600 hover:underline font-semibold'>Política de Privacidad y Uso Aceptable</a> y la <a href="/politica-de-cookies" className='text-primary-600 hover:underline font-semibold'>Política de Cookies</a>.
            </p>
            
            <div className='flex flex-row justify-between'>
              <p><b>© {new Date().getFullYear()} hazturifas.com</b>. Todos los derechos reservados. Hecho para organizadores de toda Latinoamérica</p>

              <p>Diseño y desarrollo por <a href="https://codigonativo.com/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Código Nativo</a></p>
            </div>
          </div>

        </footer>
      )}
    </>
  )
}
