import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Globe, Settings, ArrowLeft, Ticket, FileText, DollarSign, Users, Shield } from 'lucide-react'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Seguridad: Obtener el email del admin desde variables de entorno
  const adminEmail = process.env.ADMIN_EMAIL

  if (!user || user.email !== adminEmail) {
    // Si no es admin, lo mandamos al dashboard normal
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-body">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col border-r border-gray-800 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-600/20">
              <Ticket className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <span className="font-heading text-xl font-black text-white block leading-none">Rifas.io</span>
            </div>
          </div>
          <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Super Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">Monitor</div>
          <Link 
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            Métricas y Auditoría
          </Link>
          <Link 
            href="/admin/usuarios"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Users className="w-5 h-5 text-orange-400" />
            Usuarios y Clientes
          </Link>

          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2 mt-6">Configuración CMS</div>
          <Link 
            href="/admin/seo"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Globe className="w-5 h-5 text-blue-400" />
            SEO y Landing Page
          </Link>
          <Link 
            href="/admin/legales"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <FileText className="w-5 h-5 text-purple-400" />
            Páginas Legales
          </Link>
          <Link 
            href="/admin/monetizacion"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <DollarSign className="w-5 h-5 text-green-400" />
            Monetización y Tarifas
          </Link>
          <Link 
            href="/admin/sistema"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Shield className="w-5 h-5 text-red-400" />
            Sistema y Seguridad
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-4 truncate" title={user.email}>
            Conectado como:<br/>
            <strong className="text-gray-300">{user.email}</strong>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white px-4 py-2.5 rounded-lg transition-colors border border-gray-700 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mi cuenta
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="md:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <span className="font-heading font-black text-white">Rifas.io Admin</span>
          </div>
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
