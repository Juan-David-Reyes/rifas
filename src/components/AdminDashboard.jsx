import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { X, Save, Trophy, Settings, Type, AlignLeft, Gift, Calendar, Hash } from 'lucide-react';

export default function AdminDashboard({ config, onClose, onConfigUpdated }) {
  const [formData, setFormData] = useState({
    title: config.title || '',
    description: config.description || '',
    prize: config.prize || '',
    lottery_name: config.lottery_name || '',
    draw_date: config.draw_date || '',
    winner_ticket_id: config.winner_ticket_id || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // 300ms transition
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const dataToSave = {
        ...formData,
        winner_ticket_id: formData.winner_ticket_id ? parseInt(formData.winner_ticket_id) : null
      };

      const { error } = await supabase
        .from('config')
        .update(dataToSave)
        .eq('id', true);

      if (error) throw error;
      
      if (onConfigUpdated) {
        onConfigUpdated(dataToSave);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Error al guardar. Verifica que ejecutaste el script SQL para crear las columnas.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Clic fuera para cerrar */}
      <div className="absolute inset-0" onClick={handleClose}></div>
      
      {/* Sidecar / Drawer */}
      <div className={`relative w-full max-w-md bg-gray-50 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isVisible && !isClosing ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">Dashboard Admin</h2>
          </div>
          <button onClick={handleClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="admin-form" onSubmit={handleSave} className="space-y-6">
            
            {/* Mensajes de Alerta */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-start gap-2 animate-pulse">
                <span>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-semibold border border-green-100 flex items-start gap-2">
                <span>✅</span> Cambios guardados exitosamente.
              </div>
            )}

            {/* SECCIÓN 1: CABECERA */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Textos Principales</h3>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <Type className="w-4 h-4 text-gray-400" /> Título
                </label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <AlignLeft className="w-4 h-4 text-gray-400" /> Descripción
                </label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange} required rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <Gift className="w-4 h-4 text-gray-400" /> Premio Prometido
                </label>
                <input 
                  type="text" name="prize" value={formData.prize} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* SECCIÓN 2: LOTERÍA */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Sorteo</h3>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <Settings className="w-4 h-4 text-gray-400" /> Lotería Asignada
                </label>
                <input 
                  type="text" name="lottery_name" value={formData.lottery_name} onChange={handleChange} required
                  placeholder="Ej. Boyacá, Cundinamarca"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" /> Fecha del Sorteo
                </label>
                <input 
                  type="text" name="draw_date" value={formData.draw_date} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* SECCIÓN 3: MODO GANADOR */}
            <div className="bg-green-50 p-5 rounded-2xl shadow-sm border border-green-200 space-y-3">
              <h3 className="font-bold text-green-900 border-b border-green-200/50 pb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-600" /> Finalizar Rifa (Ganador)
              </h3>
              <p className="text-xs text-green-700 leading-relaxed">
                Ingresa el número ganador para cerrar la rifa. Esto bloqueará la selección de números y mostrará al ganador públicamente.
              </p>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-green-800 mb-1 mt-3">
                  <Hash className="w-4 h-4" /> Número Ganador (1-50)
                </label>
                <input 
                  type="number" name="winner_ticket_id" value={formData.winner_ticket_id} onChange={handleChange} min="1" max="50"
                  placeholder="Dejar vacío para seguir jugando"
                  className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none font-bold text-green-700 placeholder:font-normal placeholder:text-green-300"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          <button 
            type="submit" 
            form="admin-form"
            disabled={isSaving}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
