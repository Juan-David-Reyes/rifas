'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Ticket, ArrowRight, CheckCircle2, DollarSign, Calculator, Lock } from 'lucide-react'
import { createClient } from '../../utils/supabase/client'

export default function CrearRifaWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    prizeValue: '',
    ticketCount: 100,
    ticketPrice: 10000,
    paymentMethod: 'Nequi',
    paymentAccount: '',
  })
  
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => Math.max(1, s - 1))

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Cálculos financieros
  const totalRevenue = formData.ticketCount * formData.ticketPrice
  const platformFee = Math.max(10000, formData.ticketPrice)
  const netProfit = totalRevenue - platformFee

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirigir de vuelta al paso 5 (pago) después de auth
        redirectTo: `${window.location.origin}/auth/callback?next=/crear?step=5`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-body">
      {/* Header Minimalista */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-8 justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Cancelar
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
            <Ticket className="w-3 h-3 text-white transform -rotate-45" />
          </div>
          <span className="font-heading font-black text-gray-900 text-lg tracking-tight">Rifas.io</span>
        </div>
        <div className="w-20"></div> {/* Spacer for center alignment */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 relative">
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8 mt-4">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`w-full h-2 rounded-full mx-1 transition-colors duration-300 ${
                  step >= i ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          <p className="text-center text-sm font-bold text-gray-400 mt-4 uppercase tracking-wider">
            Paso {step} de 5
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          
          {/* STEP 1: Detalles del Sorteo */}
          {step === 1 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">¿Qué vas a rifar?</h2>
              <p className="text-gray-500 mb-8 font-medium">Dale un nombre atractivo a tu sorteo para enganchar a tus participantes.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Rifa</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Gran Rifa para la Cirugía de Bombillo 🐱"
                    value={formData.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Valor comercial del premio (COP)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      placeholder="300000"
                      value={formData.prizeValue}
                      onChange={(e) => updateForm('prizeValue', e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Este valor es opcional pero ayuda a dar confianza a tus compradores.</p>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!formData.title}
                  className="bg-gray-900 hover:bg-black disabled:opacity-50 disabled:hover:bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all"
                >
                  Continuar <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Estructura Financiera */}
          {step === 2 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Estructura de la Rifa</h2>
              <p className="text-gray-500 mb-8 font-medium">Configura la cantidad de números y el precio de cada uno.</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Cantidad de Números</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[50, 100, 200, 500, 1000].map(num => (
                      <button
                        key={num}
                        onClick={() => updateForm('ticketCount', num)}
                        className={`py-3 rounded-xl font-bold border-2 transition-all ${
                          formData.ticketCount === num 
                          ? 'border-primary-600 bg-primary-50 text-primary-700' 
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <input 
                      type="number"
                      placeholder="Otro"
                      className="py-3 px-4 rounded-xl font-bold border-2 border-gray-100 bg-white text-gray-600 outline-none focus:border-primary-500"
                      onChange={(e) => updateForm('ticketCount', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Valor de cada número (COP)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      placeholder="10000"
                      value={formData.ticketPrice}
                      onChange={(e) => updateForm('ticketPrice', parseInt(e.target.value) || '')}
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-xl text-gray-900"
                    />
                  </div>
                  {formData.ticketPrice > 0 && formData.ticketPrice < 10000 && (
                     <p className="text-sm text-amber-600 mt-2 font-medium">Nota: El valor mínimo de la boleta sugerido es $10.000 COP.</p>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    ¿A dónde te van a pagar?
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Banco o Billetera</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Nequi, Daviplata"
                        value={formData.paymentMethod}
                        onChange={(e) => updateForm('paymentMethod', e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Número de Cuenta</label>
                      <input 
                        type="text" 
                        placeholder="Ej. 3001234567"
                        value={formData.paymentAccount}
                        onChange={(e) => updateForm('paymentAccount', e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-bold px-4">Atrás</button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.ticketCount || !formData.ticketPrice || !formData.paymentMethod || !formData.paymentAccount}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                >
                  Ver Proyección <Calculator className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Proyección y Resumen */}
          {step === 3 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Tu Proyección</h2>
              <p className="text-gray-500 mb-8 font-medium">Así se ven los números de tu rifa. Total transparencia.</p>
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-500 font-medium">Recaudo Estimado ({formData.ticketCount} boletas)</span>
                  <span className="text-xl font-bold text-gray-900">{formatMoney(totalRevenue)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Costo de Plataforma (Único pago)</span>
                    <span className="text-xs text-gray-400">Equivalente a 1 boleta (Mín. $10,000)</span>
                  </div>
                  <span className="text-lg font-bold text-red-500">-{formatMoney(platformFee)}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-black text-lg">Tu Ganancia Neta Estimada</span>
                  <span className="text-3xl font-black text-green-500">{formatMoney(netProfit)}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                <div className="shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5 text-blue-500"/></div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>¡Cero comisiones por ventas!</strong> Solo pagas el costo de activación (1 boleta) y el 100% del dinero recaudado va directo a tu cuenta (Nequi/Daviplata/Banco).
                </p>
              </div>

              <div className="mt-10 flex justify-between">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-bold px-4">Modificar</button>
                <button 
                  onClick={handleNext}
                  className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all transform hover:-translate-y-1"
                >
                  ¡Excelente, Activar Rifa!
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Auth */}
          {step === 4 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-gray-700" />
              </div>
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Guarda tu progreso</h2>
              <p className="text-gray-500 mb-8 font-medium">Crea tu cuenta gratis para asociar esta rifa a tu perfil de organizador antes de pagar la activación.</p>
              
              <button 
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-4 px-4 rounded-xl shadow-sm transition-all mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isAuthenticating ? 'Conectando...' : 'Continuar con Google'}
              </button>
              
              <button onClick={() => setStep(5)} className="w-full text-center text-sm font-bold text-gray-400 hover:text-gray-600 mt-4">(Simular Login Exitoso para demo)</button>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-start">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-bold">Atrás</button>
              </div>
            </div>
          )}

          {/* STEP 5: Pasarela de Pagos (Simulada) */}
          {step === 5 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Pago de Activación</h2>
                <p className="text-gray-500 font-medium">Estás a un paso de publicar tu rifa.</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 text-center">
                <p className="text-gray-500 font-bold mb-1">Total a Pagar</p>
                <p className="text-4xl font-black text-gray-900">{formatMoney(platformFee)}</p>
              </div>

              <div className="space-y-3">
                <button onClick={handleNext} className="w-full bg-[#009ee3] hover:bg-[#0089c4] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                   Pagar con MercadoPago
                </button>
                <button onClick={handleNext} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                   Pagar con ePayco
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-6 opacity-50 grayscale">
                 <div className="font-black italic text-lg text-[#1a1f71]">VISA</div>
                 <div className="flex items-center -space-x-1.5 ml-2">
                    <div className="w-4 h-4 rounded-full bg-[#eb001b]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#f79e1b]"></div>
                  </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
                 <p className="text-xs text-gray-400">Pagos 100% seguros y encriptados.</p>
              </div>
            </div>
          )}

          {/* STEP 6: Éxito */}
          {step === 6 && (
            <div className="p-8 sm:p-12 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-4">¡Rifa Creada con Éxito!</h2>
              <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">El pago ha sido procesado. Tu plataforma ya está activa y lista para recibir a tus compradores.</p>
              
              <Link href="/dashboard" className="inline-block w-full bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1">
                Ir a mi Dashboard de Control
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
