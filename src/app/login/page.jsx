'use client'

import { createClient } from '../../utils/supabase/client'
import { login, signup } from './actions'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Ticket } from 'lucide-react'
import { Suspense } from 'react'

function LoginMessage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  
  if (!message) return null
  
  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium text-center border border-red-100 flex items-center justify-center gap-2">
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      {message}
    </div>
  )
}

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse bg-white relative">
      
      {/* Back Button (Global Absolute) */}
      <div className="absolute top-6 left-4 sm:top-8 sm:left-8 lg:left-12 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold transition-colors px-4 py-2 rounded-full border bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-900 lg:bg-white/10 lg:hover:bg-white/20 lg:border-white/10 lg:text-white/70 lg:hover:text-white backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </div>

      {/* Right Column (Desktop): Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative py-12">
        <div className="max-w-sm w-full mx-auto mt-12 lg:mt-0">
          {/* Logo / Branding Mobile */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <span className="font-heading text-2xl font-black text-gray-900">Rifas.io</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl lg:text-4xl font-black font-heading text-gray-900 mb-3 tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-gray-500 font-medium text-lg">Ingresa a tu panel para gestionar tus sorteos.</p>
          </div>

          <Suspense fallback={null}>
            <LoginMessage />
          </Suspense>

          {/* Botón de Google */}
          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all mb-8"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="relative flex items-center justify-center mb-8">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-4 text-xs text-gray-400 font-bold uppercase tracking-wider absolute">O usa tu email</span>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Correo electrónico</label>
              <input 
                name="email" type="email" required placeholder="tu@correo.com"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
              <input 
                name="password" type="password" required placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Link para recuperar clave */}
            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                className="text-sm font-bold text-primary-600 hover:text-primary-700"
                onClick={() => alert("El reseteo de clave será implementado pronto.")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button 
                formAction={login}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Iniciar Sesión
              </button>
              <button 
                formAction={signup}
                className="w-full bg-white border-2 border-primary-100 text-primary-700 hover:bg-primary-50 font-bold py-3.5 px-4 rounded-xl transition-all"
              >
                Crear Cuenta Nueva
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Left Column (Desktop): Decorative SaaS Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gray-900 rounded-r-[3rem] shadow-2xl p-12 items-center justify-center z-10">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary-900/40 via-gray-900 to-gray-900"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Ticket className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <span className="font-heading text-3xl font-black text-white">Rifas.io</span>
          </div>

          <h2 className="text-4xl font-black text-white font-heading leading-tight mb-6">
            La forma más inteligente de gestionar tus sorteos.
          </h2>
          <p className="text-xl text-gray-400 font-medium mb-12 leading-relaxed">
            Automatiza reservas, valida pagos vía WhatsApp y ten el control total de tu recaudo en tiempo real.
          </p>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-start gap-4">
            <div className="flex -space-x-3 shrink-0">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600 shadow-sm">
                  U{i}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold mb-1">Cientos de usuarios activos</p>
              <p className="text-gray-400 text-sm">Únete a los organizadores top de Latinoamérica.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
