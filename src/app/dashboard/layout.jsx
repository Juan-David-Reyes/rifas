import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from './DashboardSidebar'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Client Component para manejar active states) */}
      <DashboardSidebar userEmail={user.email} />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
