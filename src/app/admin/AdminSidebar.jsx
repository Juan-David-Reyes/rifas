'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Globe, Settings, ArrowLeft, Ticket, FileText, DollarSign, Users, Shield } from 'lucide-react'

export default function AdminSidebar({ userEmail }) {
  const pathname = usePathname()

  const isActive = (path) => {
    // Para rutas exactas como /admin
    if (path === '/admin') {
      return pathname === '/admin'
    }
    // Para sub-rutas como /admin/usuarios
    return pathname.startsWith(path)
  }

  const getLinkClassName = (path) => {
    const active = isActive(path)
    return `flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-medium transition-colors ${
      active 
        ? 'bg-gray-800 text-white' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`
  }

  return (
    <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col border-r border-gray-800 fixed inset-y-0 left-0 z-40 h-screen">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20">
            <Ticket className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div>
            <span className="font-heading text-xl font-black text-white block leading-none">deBuenas</span>
          </div>
        </div>
        <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Super Admin</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">Monitor</div>
        <Link href="/admin" className={getLinkClassName('/admin')}>
          <LayoutDashboard className={`w-5 h-5 ${isActive('/admin') ? 'text-gray-300' : 'text-gray-400'}`} />
          Métricas y auditoría
        </Link>
        <Link href="/admin/usuarios" className={getLinkClassName('/admin/usuarios')}>
          <Users className={`w-5 h-5 transition-colors ${isActive('/admin/usuarios') ? 'text-orange-400' : 'text-gray-400'}`} />
          Usuarios y clientes
        </Link>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2 mt-6">Configuración CMS</div>
        <Link href="/admin/seo" className={getLinkClassName('/admin/seo')}>
          <Globe className={`w-5 h-5 transition-colors ${isActive('/admin/seo') ? 'text-blue-400' : 'text-gray-400'}`} />
          SEO y Landing Page
        </Link>
        <Link href="/admin/legales" className={getLinkClassName('/admin/legales')}>
          <FileText className={`w-5 h-5 transition-colors ${isActive('/admin/legales') ? 'text-purple-400' : 'text-gray-400'}`} />
          Páginas legales
        </Link>
        <Link href="/admin/monetizacion" className={getLinkClassName('/admin/monetizacion')}>
          <DollarSign className={`w-5 h-5 transition-colors ${isActive('/admin/monetizacion') ? 'text-green-400' : 'text-gray-400'}`} />
          Monetización y tarifas
        </Link>
        <Link href="/admin/sistema" className={getLinkClassName('/admin/sistema')}>
          <Shield className={`w-5 h-5 transition-colors ${isActive('/admin/sistema') ? 'text-red-400' : 'text-gray-400'}`} />
          Sistema y seguridad
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-4 truncate" title={userEmail}>
          Conectado como:<br/>
          <strong className="text-gray-300">{userEmail}</strong>
        </div>
        <Link 
          href="/dashboard"
          className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white px-4 py-2.5 rounded-2xl transition-colors border border-gray-700 w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a mi cuenta
        </Link>
      </div>
    </aside>
  )
}
