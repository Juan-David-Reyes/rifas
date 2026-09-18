'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Save, FileText, Shield, Cookie, CheckCircle } from 'lucide-react'
import { updateSiteSettings } from '../../../utils/settingsActions'

// Dinamically import react-quill-new to avoid SSR hydration mismatch
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

export default function LegalFormClient({ initialSettings }) {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('terms') // 'terms', 'privacy', 'cookies'
  const [toast, setToast] = useState(null)
  
  const [formData, setFormData] = useState({
    terms_text: initialSettings?.terms_text || '<h2>Términos y Condiciones</h2><p>Escribe aquí...</p>',
    privacy_text: initialSettings?.privacy_text || '<h2>Política de Privacidad</h2><p>Escribe aquí...</p>',
    cookies_text: initialSettings?.cookies_text || '<h2>Política de Cookies</h2><p>Escribe aquí...</p>'
  })

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  }

  const handleEditorChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [`${activeTab}_text`]: value
    }))
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
      showToast('success', '¡Políticas legales publicadas con éxito!')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'terms' 
                ? 'border-primary-500 text-primary-700 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Términos y Condiciones
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'privacy' 
                ? 'border-blue-500 text-blue-700 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            Política de Privacidad
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'cookies' 
                ? 'border-purple-500 text-purple-700 bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Cookie className="w-4 h-4" />
            Política de Cookies
          </button>
        </div>

        {/* Editor Area */}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {activeTab === 'terms' && 'Editando Términos y Condiciones'}
              {activeTab === 'privacy' && 'Editando Política de Privacidad'}
              {activeTab === 'cookies' && 'Editando Política de Cookies'}
            </h2>
            <p className="text-gray-500 text-sm">
              Usa el editor para estructurar el contenido con títulos y viñetas para un mejor SEO.
            </p>
          </div>
          
          <div className="h-[500px] mb-12">
            {/* Wrapper required for react-quill to respect heights */}
            <ReactQuill 
              theme="snow" 
              value={formData[`${activeTab}_text`]} 
              onChange={handleEditorChange}
              modules={modules}
              className="h-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
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
          {isSaving ? 'Guardando...' : 'Guardar Todas las Políticas'}
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
