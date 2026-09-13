import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, Ticket, Settings, LogOut, ArrowLeft } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-body">
      {/* Navbar Superior */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                <Ticket className="w-6 h-6 text-white transform -rotate-45" />
              </div>
              <div>
                <span className="font-heading text-xl font-black text-white block leading-none">Rifas.io</span>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Centro de Comando</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-400 hidden md:block">
                Super Admin: <strong className="text-white">{user.email}</strong>
              </span>
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg transition-colors border border-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Salir a mi cuenta
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
