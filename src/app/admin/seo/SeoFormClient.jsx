'use client'

import { useState } from 'react'
import { Save, Globe, Type, Search, CheckCircle } from 'lucide-react'
import { updateSiteSettings } from '../../../utils/settingsActions'

export default function SeoFormClient({ initialSettings }) {
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    seo_title: initialSettings?.seo_title || 'deBuenas - Crea y administra tus rifas fácilmente',
    seo_description: initialSettings?.seo_description || 'La plataforma definitiva para crear y gestionar rifas solidarias, sorteos y loterías personales.',
    hero_title: initialSettings?.hero_title || 'Crea tu Rifa Virtual en 5 Minutos',
    hero_subtitle: initialSettings?.hero_subtitle || 'Organiza sorteos y recauda fondos de forma 100% automatizada. Sin mensualidades ni comisiones por ventas, el dinero va directo a tu cuenta.'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const showToast = (type, message) => {
    // 1. Montamos el componente oculto (opacity-0, translate-x-8)
    setToast({ type, message, visible: false })
    
    // 2. Esperamos un frame para que React lo dibuje en el DOM, y disparamos la animación
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: true } : null)
    }, 50)

    // 3. A los 4.7s lo empezamos a ocultar
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null)
      
      // 4. A los 5s lo desmontamos por completo
      setTimeout(() => setToast(null), 300)
    }, 4700)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateSiteSettings(formData)
      showToast('success', '¡Configuración guardada! Los cambios ya están en vivo.')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl w-full">
      {/* Sección SEO */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SEO (Google y Redes Sociales)</h2>
            <p className="text-gray-500 text-sm font-medium">Así es como tu página se verá en Google o cuando compartan el link.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título de la Página (Meta Title)</label>
            <input 
              type="text" 
              name="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-[16px] px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción (Meta Description)</label>
            <textarea 
              name="seo_description"
              value={formData.seo_description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-[16px] px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              required
            ></textarea>
          </div>
        </div>
      </div>

      {/* Sección Hero (Homepage) */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
            <Type className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Textos Principales (Homepage)</h2>
            <p className="text-gray-500 text-sm">Cambia lo primero que leen tus usuarios al entrar a deBuenas.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título Gigante (Hero Title)</label>
            <input 
              type="text" 
              name="hero_title"
              value={formData.hero_title}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-[16px] px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo (Hero Subtitle)</label>
            <textarea 
              name="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-[16px] px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              required
            ></textarea>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          disabled={isSaving}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Guardando en la Nube...' : 'Guardar y Publicar'}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform z-50 ${
          toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        } ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </form>
  )
}
