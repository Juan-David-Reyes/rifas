'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Settings, LogOut } from 'lucide-react'

export default function DashboardSidebar({ userEmail }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Mis Rifas', href: '/dashboard', icon: Home },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings }
  ]

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-20 h-screen">
      <div className="p-6 border-b border-slate-800">
        <Link href="/dashboard" className="font-heading text-2xl font-extrabold text-primary-400">
          deBuenas
        </Link>
        <p className="text-slate-400 text-xs mt-2 truncate">{userEmail}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          
          let isActive = false
          if (item.name === 'Mis Rifas') {
            isActive = pathname === '/dashboard' || (pathname.startsWith('/dashboard/') && !pathname.startsWith('/dashboard/settings'))
          } else if (item.name === 'Configuración') {
            isActive = pathname.startsWith('/dashboard/settings')
          }
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${
                isActive 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <form action="/auth/signout" method="POST">
          <button className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-2xl font-medium transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
