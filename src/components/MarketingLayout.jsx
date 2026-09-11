'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MarketingLayout({ children }) {
  const pathname = usePathname()
  
  const isMarketing = pathname === '/' || pathname === '/login'

  return (
    <>
      {isMarketing && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-heading text-2xl font-extrabold text-primary-600">
              Rifas.io
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
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
            
            <p className='text-left mb-6'><b>Aviso de Exención de Responsabilidad:</b> hazturifa es exclusivamente una herramienta tecnológica de software (SaaS) para la autogestión de rifas. No organizamos, patrocinamos ni operamos sorteos; no emitimos ni vendemos boletos directamente a los participantes, no custodiamos fondos de terceros y no entregamos premios. La legalidad del sorteo, la obtención de los permisos gubernamentales correspondientes en su país (como la autorización municipal o de entidades nacionales de juegos de azar) y la entrega final de los premios son de responsabilidad única y exclusiva de cada organizador. Al utilizar nuestro servicio, el organizador acepta cumplir con los <a href="/terminos-y-condiciones" className='text-primary-600 hover:underline'>Términos y condiciones</a> y la <a href="/politica-de-privacidad" className='text-primary-600 hover:underline'>Política de uso aceptable</a>.
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
