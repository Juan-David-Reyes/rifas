import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Home, Ticket, Settings } from 'lucide-react'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-20 h-screen">
        <div className="p-6 border-b border-slate-800">
          <Link href="/dashboard" className="font-heading text-2xl font-extrabold text-primary-400">
            Rifas.io
          </Link>
          <p className="text-slate-400 text-xs mt-2 truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-xl font-medium transition-colors">
            <Home className="w-5 h-5" />
            Mis Rifas
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <form action="/auth/signout" method="POST">
            <button className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-xl font-medium transition-colors">
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
