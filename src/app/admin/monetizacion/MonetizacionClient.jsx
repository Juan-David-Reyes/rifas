'use client'

import { useState } from 'react'
import { Save, CheckCircle, Ticket, Banknote } from 'lucide-react'
import { updateSiteSettings } from '../../../utils/settingsActions'

export default function MonetizacionClient({ initialSettings }) {
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState(null)
  
  const [formData, setFormData] = useState({
    fee_type: initialSettings?.fee_type || 'ticket',
    fee_fixed: initialSettings?.fee_fixed || 20000,
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
    setIsSaving(true)
    try {
      await updateSiteSettings(formData)
      showToast('success', '¡Modelo de monetización actualizado con éxito!')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Elige tu Modelo de Cobro</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Opción 1: Dinámica (1 Boleta) */}
          <label className={`relative flex cursor-pointer rounded-3xl border-2 p-6 focus:outline-none transition-all ${
            formData.fee_type === 'ticket' 
              ? 'border-primary-500 bg-primary-50/50' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <input
              type="radio"
              name="fee_type"
              value="ticket"
              className="sr-only"
              checked={formData.fee_type === 'ticket'}
              onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
            />
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${formData.fee_type === 'ticket' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${formData.fee_type === 'ticket' ? 'text-primary-900' : 'text-gray-900'}`}>Valor de 1 Boleta</h3>
                  <p className="text-gray-500 text-sm mt-1">El usuario paga el costo de 1 número (Mín. $10.000 COP).</p>
                </div>
              </div>
              {formData.fee_type === 'ticket' && (
                <CheckCircle className="h-6 w-6 text-primary-600" />
              )}
            </div>
          </label>

          {/* Opción 2: Tarifa Fija */}
          <label className={`relative flex cursor-pointer rounded-3xl border-2 p-6 focus:outline-none transition-all ${
            formData.fee_type === 'fixed' 
              ? 'border-green-500 bg-green-50/50' 
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}>
            <input
              type="radio"
              name="fee_type"
              value="fixed"
              className="sr-only"
              checked={formData.fee_type === 'fixed'}
              onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
            />
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${formData.fee_type === 'fixed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${formData.fee_type === 'fixed' ? 'text-green-900' : 'text-gray-900'}`}>Tarifa Fija</h3>
                  <p className="text-gray-500 text-sm mt-1">Cobras un monto exacto fijo por cada rifa creada.</p>
                </div>
              </div>
              {formData.fee_type === 'fixed' && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>
          </label>
        </div>

        {/* Configurador de Tarifa Fija */}
        {formData.fee_type === 'fixed' && (
          <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Monto a cobrar por Rifa (COP)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-gray-500 font-bold">$</span>
              </div>
              <input
                type="number"
                name="fee_fixed"
                value={formData.fee_fixed}
                onChange={(e) => setFormData({ ...formData, fee_fixed: parseInt(e.target.value) || 0 })}
                className="block w-full rounded-2xl border-gray-300 pl-8 pr-12 focus:border-green-500 focus:ring-green-500 text-lg font-bold py-3 shadow-sm"
                placeholder="20000"
                min="0"
                step="1000"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-gray-500 font-medium">COP</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Este es el monto exacto que se le cobrará a los organizadores en la pasarela de pagos al momento de activar su rifa.
            </p>
          </div>
        )}
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
          {isSaving ? 'Guardando...' : 'Aplicar Modelo de Negocio'}
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
