'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MarketingLayout({ children }) {
  const pathname = usePathname()
  
  const isMarketing = pathname === '/' || pathname === '/login'

  return (
    <>
      {isMarketing && (
        <header className="bg-white border-b border-gray-200">
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
        <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm mt-auto">
          <p>© Todos los derechos reservados {new Date().getFullYear()}, diseño y desarrollo por <a href="https://codigonativo.com/" className="text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">Código Nativo</a></p>
        </footer>
      )}
    </>
  )
}
