'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function MarketingLayout({ children }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const marketingPaths = ['/', '/terminos-y-condiciones', '/politica-de-privacidad', '/politica-de-cookies']
  const isMarketing = marketingPaths.includes(pathname)

  return (
    <>
      {isMarketing && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="font-heading text-2xl font-extrabold text-primary-50">
              deBuenas
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-primary-100 hover:text-primary-200 transition-colors px-4 py-2 rounded-lg">
                Inicio
              </Link>
              <Link href="/#como-funciona" className="text-sm font-medium text-primary-100 hover:text-primary-200 transition-colors px-4 py-2 rounded-lg">
                Cómo funciona
              </Link>
              <Link href="/login" className="text-sm font-medium text-primary-100 hover:text-primary-200 transition-colors px-6 py-2 rounded-lg border border-gray-200">
                Iniciar Sesión
              </Link>
              <Link href="/crear-rifa" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
                Crear mi rifa
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-primary-100 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div 
            className={`md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 flex flex-col gap-4 shadow-xl transition-all duration-300 ease-in-out origin-top ${
              isMobileMenuOpen 
                ? 'opacity-100 scale-y-100' 
                : 'opacity-0 scale-y-0 pointer-events-none'
            }`}
          >
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-primary-100 font-medium px-2 py-2 hover:bg-gray-800 rounded-lg transition-colors">
              Inicio
            </Link>
            <Link href="/#como-funciona" onClick={() => setIsMobileMenuOpen(false)} className="text-primary-100 font-medium px-2 py-2 hover:bg-gray-800 rounded-lg transition-colors">
              Cómo funciona
            </Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-primary-100 font-medium px-2 py-2 hover:bg-gray-800 rounded-lg border border-gray-700 text-center transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/crear-rifa" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-center font-bold shadow-sm transition-all transform active:scale-95">
              Crear mi rifa
            </Link>
          </div>
        </header>
      )}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {isMarketing && (
        <footer className="px-6 text-gray-700 py-4 text-center text-xs mt-auto">
          <div className='max-w-7xl mx-auto'>
            
            <p className='text-left mb-6 mt-8'><b>Aviso de Exención de Responsabilidad:</b> deBuenas es exclusivamente una herramienta tecnológica de software (SaaS) para la autogestión de rifas. No organizamos, patrocinamos ni operamos sorteos; no emitimos ni vendemos boletos directamente a los participantes, no custodiamos fondos de terceros y no entregamos premios. La legalidad del sorteo, la obtención de los permisos gubernamentales correspondientes en su país (como la autorización municipal o de entidades nacionales de juegos de azar) y la entrega final de los premios son de responsabilidad única y exclusiva de cada organizador. Al utilizar nuestro servicio, el organizador acepta cumplir con los <a href="/terminos-y-condiciones" className='text-primary-600 hover:underline font-semibold'>Términos y condiciones</a>, la <a href="/politica-de-privacidad" className='text-primary-600 hover:underline font-semibold'>Política de privacidad y uso aceptable</a> y la <a href="/politica-de-cookies" className='text-primary-600 hover:underline font-semibold'>Política de cookies</a>.
            </p>
            
            <div className='flex flex-col lg:flex-row justify-between items-center gap-6 pb-6'>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <p><b>© {new Date().getFullYear()} debuenas.co</b>. Todos los derechos reservados. Hecho para organizadores de toda Latinoamérica</p>
                <p>Diseño y desarrollo por <a href="https://codigonativo.com/" className="text-primary-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer">Código Nativo</a></p>
              </div>

              <div className="bg-primary-50 border border-primary-100 px-6 py-2 flex items-center justify-center flex-wrap gap-4 shadow-sm" style={{ borderRadius: '8px' }}>
                <div className="flex items-center gap-2 text-primary-900 font-bold">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-4">
                  <Image src="/images/logo-mercado-pago.svg" alt="Mercado Pago" width={60} height={20} className="h-5 w-auto" />
                  <Image src="/images/logo-visa.svg" alt="Visa" width={40} height={16} className="h-4 w-auto" />
                  <Image src="/images/Mastercard-logo.svg" alt="Mastercard" width={40} height={20} className="h-5 w-auto" />
                </div>
              </div>
            </div>
          </div>

        </footer>
      )}
    </>
  )
}
