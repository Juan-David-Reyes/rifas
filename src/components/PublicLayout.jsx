'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function PublicLayout({ children }) {
  const pathname = usePathname()
  
  const publicPaths = ['/', '/terminos-y-condiciones', '/politica-de-privacidad', '/politica-de-cookies']
  const isPublic = publicPaths.includes(pathname)

  return (
    <>
      {isPublic && <Header />}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {isPublic && <Footer />}
    </>
  )
}
