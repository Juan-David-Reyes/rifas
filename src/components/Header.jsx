'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
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
  )
}
