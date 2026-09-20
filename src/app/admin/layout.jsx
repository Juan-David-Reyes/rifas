import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Ticket } from 'lucide-react'
import AdminSidebar from './AdminSidebar'

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
      <AdminSidebar userEmail={user.email} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:pl-64 min-h-screen pl-4">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="md:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-2xl flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <span className="font-heading font-black text-white">deBuenas Admin</span>
          </div>
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-2xl">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </header>

        {children}
      </main>
    </div>
  )
}
