'use client'

import { createRaffle } from './actions'
import { useState } from 'react'
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function CreateRafflePage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slugPreview, setSlugPreview] = useState('')
  const [raffleFormData, setRaffleFormData] = useState(null)
  const [ticketPrice, setTicketPrice] = useState(10000)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setRaffleFormData(formData)
    setStep(2) // Ir al pago
  }

  const handlePayment = async (method) => {
    setIsSubmitting(true)
    setError(null)
    
    // Aquí iría la integración real de MercadoPago o ePayco.
    // Por ahora, simulamos un pequeño delay de validación.
    await new Promise(r => setTimeout(r, 1000))

    try {
      const result = await createRaffle(raffleFormData)
      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
        setStep(1) // Volver al form si hay error (ej. slug duplicado)
      }
      // Si es exitoso, el action hace redirect a /dashboard/[id]
    } catch (err) {
      setError('Ocurrió un error inesperado.')
      setIsSubmitting(false)
      setStep(1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Rifa</h1>
          <p className="text-gray-500 text-sm">Paso {step} de 2: {step === 1 ? 'Configuración' : 'Pago de Activación'}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {error && (
          <div className="m-6 mb-0 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-start gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* URL personalizada */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Enlace Personalizado (URL)</label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl px-4 py-3 text-gray-500 text-sm font-medium">
                  rifas.io/
                </span>
                <input 
                  name="slug" type="text" required
                  placeholder="gran-rifa-bombillo"
                  onChange={(e) => setSlugPreview(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-bold text-gray-800"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">Tu rifa será visible en: <strong className="text-primary-600">rifas.io/{slugPreview || '...'}</strong></p>
            </div>

            <hr className="border-gray-100" />

            {/* Textos Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Título de la Rifa</label>
                <input 
                  name="title" type="text" required placeholder="Ej. Gran Rifa Solidaria por Bombillo"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción / Motivo</label>
                <textarea 
                  name="description" required rows={3} placeholder="Explica por qué estás haciendo esta rifa..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Premio Prometido</label>
                <input 
                  name="prize" type="text" required placeholder="Ej. $300.000 COP"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Precio por Número (Puesto)</label>
                <input 
                  name="ticket_price" type="number" required min="1000" 
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Precio unitario en tu moneda.</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sorteo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Lotería Asignada</label>
                <input 
                  name="lottery_name" type="text" required placeholder="Ej. Lotería de Boyacá"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fecha del Sorteo</label>
                <input 
                  name="draw_date" type="text" required placeholder="Ej. 15 de Septiembre"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
              >
                Continuar al Pago
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Pago de Activación</h2>
              <p className="text-gray-500 font-medium">Estás a un paso de publicar tu rifa.</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 text-center">
              <p className="text-gray-500 font-bold mb-1">Tarifa de Plataforma (1 Boleta)</p>
              <p className="text-4xl font-black text-gray-900">${ticketPrice.toLocaleString('es-CO')}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handlePayment('mercadopago')}
                disabled={isSubmitting}
                className="w-full bg-[#009ee3] hover:bg-[#0089c4] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                 {isSubmitting ? 'Procesando...' : 'Pagar con MercadoPago'}
              </button>
              <button 
                onClick={() => handlePayment('epayco')}
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                 {isSubmitting ? 'Procesando...' : 'Pagar con ePayco'}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-6 opacity-50 grayscale">
               <div className="font-black italic text-lg text-[#1a1f71]">VISA</div>
               <div className="flex items-center -space-x-1.5 ml-2">
                  <div className="w-4 h-4 rounded-full bg-[#eb001b]"></div>
                  <div className="w-4 h-4 rounded-full bg-[#f79e1b]"></div>
                </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
               <button 
                 onClick={() => setStep(1)} 
                 disabled={isSubmitting}
                 className="text-gray-500 hover:text-gray-900 font-bold disabled:opacity-50"
               >
                 Volver
               </button>
               <p className="text-xs text-gray-400">Pagos 100% seguros y encriptados.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
