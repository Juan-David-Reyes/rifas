'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Save, AlertTriangle, ShieldAlert, CheckCircle, PowerOff, PauseCircle } from 'lucide-react'
import { updateSiteSettings } from '../../../utils/settingsActions'

export default function SistemaClient({ initialSettings, auditLogs }) {
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
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden p-6 md:p-8">
        
        {/* Switch 1: Modo Mantenimiento */}
        <div className="flex items-start gap-4 p-6 rounded-3xl border-2 transition-all mb-6 relative overflow-hidden bg-white hover:border-gray-300 border-gray-200">
          {formData.maintenance_mode && (
            <div className="absolute inset-0 bg-red-50/50 -z-10 pointer-events-none"></div>
          )}
          <div className={`p-3 rounded-2xl shrink-0 ${formData.maintenance_mode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
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
        <div className="flex items-start gap-4 p-6 rounded-3xl border-2 transition-all relative overflow-hidden bg-white hover:border-gray-300 border-gray-200">
          {!formData.allow_new_raffles && (
            <div className="absolute inset-0 bg-amber-50/50 -z-10 pointer-events-none"></div>
          )}
          <div className={`p-3 rounded-2xl shrink-0 ${!formData.allow_new_raffles ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
            <PauseCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${!formData.allow_new_raffles ? 'text-amber-900' : 'text-gray-900'}`}>Pausar Creación de Rifas</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">
              Desactiva temporalmente el embudo de creación (`/crear-rifa`). Las rifas existentes seguirán funcionando con normalidad, pero no se aceptarán nuevos organizadores.
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
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
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

      {/* Tabla de Auditoría Anti-Fraude */}
      <div className="bg-white rounded-[32px] shadow-sm border border-red-100 overflow-hidden mt-12">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center border border-red-200">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registro de Auditoría (Anti-Fraude)</h2>
              <p className="text-gray-500 text-sm font-medium">Monitorea rechazos y reversiones sospechosas por parte de organizadores.</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Fecha</th>
                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Organizador (ID)</th>
                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Acción</th>
                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Comprador Afectado</th>
                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Números</th>
                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Motivo Declarado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!auditLogs || auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No hay registros de auditoría. (Verifica si la tabla audit_logs ya fue creada en Supabase).
                  </td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">
                      {format(new Date(log.created_at), "d MMM, hh:mm a", { locale: es })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 mb-0.5">{log.organizer_email}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{log.raffle_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center ${log.action_type === 'REVERSION' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {log.buyer_name}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      {log.ticket_count}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 bg-gray-50 p-2 rounded-2xl border border-gray-100 text-xs italic line-clamp-2" title={log.reason}>
                        "{log.reason}"
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
