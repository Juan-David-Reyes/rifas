'use client'

import { createRaffle } from './actions'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function CreateRafflePage() {
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slugPreview, setSlugPreview] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await createRaffle(formData)
      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.')
      setIsSubmitting(false)
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
          <p className="text-gray-500 text-sm">Llena los datos para generar tu sitio público.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

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
                name="ticket_price" type="number" required min="1000" defaultValue="10000"
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
              type="submit" disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Crear Rifa y Generar 100 Números
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
