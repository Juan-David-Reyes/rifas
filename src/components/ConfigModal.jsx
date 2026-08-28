import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ConfigModal({ config, onClose }) {
  const [lotteryName, setLotteryName] = useState(config.lottery_name || '');
  const [drawDate, setDrawDate] = useState(config.draw_date || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('config')
        .update({ lottery_name: lotteryName, draw_date: drawDate })
        .eq('id', true);

      if (error) throw error;
      
      handleClose(); // Cerrar al guardar con éxito
    } catch (err) {
      console.error(err);
      setError('Hubo un error al guardar la configuración.');
      setIsSaving(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-out ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${isVisible && !isClosing ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">⚙️ Configurar Rifa</h2>
          <button onClick={handleClose} disabled={isSaving} className="text-white/80 hover:text-white text-xl disabled:opacity-50">✕</button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Lotería</label>
            <input 
              type="text" 
              required
              value={lotteryName}
              onChange={(e) => setLotteryName(e.target.value)}
              placeholder="Ej. Lotería de Boyacá"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Juego</label>
            <input 
              type="text" 
              required
              value={drawDate}
              onChange={(e) => setDrawDate(e.target.value)}
              placeholder="Ej. 15 de Noviembre"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">También puedes poner "Por definir" si aún no tienes fecha.</p>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
