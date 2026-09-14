'use client'

import { useState } from 'react'
import { Save, AlertTriangle, ShieldAlert, CheckCircle, PowerOff, PauseCircle } from 'lucide-react'
import { updateSiteSettings } from '../../../utils/settingsActions'

export default function SistemaClient({ initialSettings }) {
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)
  
  const [formData, setFormData] = useState({
    maintenance_mode: initialSettings?.maintenance_mode || false,
    allow_new_raffles: initialSettings?.allow_new_raffles !== undefined ? initialSettings.allow_new_raffles : true,
  })

  const showToast = (type, message) => {
    setToast({ type, message, visible: false })
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: true } : null)
    }, 50)
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null)
      setTimeout(() => setToast(null), 300)
    }, 4700)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Add extra confirmation for dangerous actions
    if (formData.maintenance_mode && !initialSettings?.maintenance_mode) {
      if (!window.confirm("⚠️ ADVERTENCIA: Estás a punto de activar el Modo Mantenimiento. Toda la plataforma pública dejará de funcionar para los usuarios normales. ¿Estás seguro?")) {
        return
      }
    }

    setIsSaving(true)
    try {
      await updateSiteSettings(formData)
      showToast('success', 'Configuración de seguridad actualizada.')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6 md:p-8">
        
        {/* Switch 1: Modo Mantenimiento */}
        <div className="flex items-start gap-4 p-6 rounded-2xl border-2 transition-all mb-6 relative overflow-hidden bg-white hover:border-gray-300 border-gray-200">
          {formData.maintenance_mode && (
            <div className="absolute inset-0 bg-red-50/50 -z-10 pointer-events-none"></div>
          )}
          <div className={`p-3 rounded-xl shrink-0 ${formData.maintenance_mode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
            <PowerOff className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${formData.maintenance_mode ? 'text-red-900' : 'text-gray-900'}`}>Modo Mantenimiento Global</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">
              Desactiva temporalmente todo el acceso público a la plataforma. Los usuarios verán una pantalla de mantenimiento. Como Super Admin, tú seguirás teniendo acceso total.
            </p>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={formData.maintenance_mode}
                  onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${formData.maintenance_mode ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.maintenance_mode ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className={`ml-3 font-bold text-sm ${formData.maintenance_mode ? 'text-red-600' : 'text-gray-500'}`}>
                {formData.maintenance_mode ? 'SISTEMA APAGADO' : 'SISTEMA EN LÍNEA'}
              </span>
            </label>
          </div>
        </div>

        {/* Switch 2: Pausar Nuevas Rifas */}
        <div className="flex items-start gap-4 p-6 rounded-2xl border-2 transition-all relative overflow-hidden bg-white hover:border-gray-300 border-gray-200">
          {!formData.allow_new_raffles && (
            <div className="absolute inset-0 bg-amber-50/50 -z-10 pointer-events-none"></div>
          )}
          <div className={`p-3 rounded-xl shrink-0 ${!formData.allow_new_raffles ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
            <PauseCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${!formData.allow_new_raffles ? 'text-amber-900' : 'text-gray-900'}`}>Pausar Creación de Rifas</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">
              Desactiva temporalmente el embudo de creación (`/crear`). Las rifas existentes seguirán funcionando con normalidad, pero no se aceptarán nuevos organizadores.
            </p>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={!formData.allow_new_raffles}
                  onChange={(e) => setFormData({ ...formData, allow_new_raffles: !e.target.checked })}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${!formData.allow_new_raffles ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${!formData.allow_new_raffles ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className={`ml-3 font-bold text-sm ${!formData.allow_new_raffles ? 'text-amber-600' : 'text-gray-500'}`}>
                {!formData.allow_new_raffles ? 'CREACIÓN PAUSADA' : 'CREACIÓN ACTIVA'}
              </span>
            </label>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-2">
        <button 
          type="submit"
          disabled={isSaving}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Guardando...' : 'Guardar Cambios de Sistema'}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform z-50 ${
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
