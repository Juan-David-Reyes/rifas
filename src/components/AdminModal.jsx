import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User, Phone, Check, X, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminModal({ ticket, onClose }) {
  const [name, setName] = useState(ticket?.buyer_name || '');
  const [phone, setPhone] = useState(ticket?.buyer_phone || '');
  const [loading, setLoading] = useState(false);
  
  // Animaciones
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleUpdate = async (newStatus = ticket.status) => {
    setLoading(true);
    const updates = { 
      buyer_name: name, 
      buyer_phone: phone 
    };
    
    if (newStatus !== ticket.status) {
      updates.status = newStatus;
      if (newStatus === 'disponible') {
        // Al liberar, borramos los datos
        updates.buyer_name = null;
        updates.buyer_phone = null;
        updates.reserved_at = null;
      }
    }

    const { error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticket.id);

    setLoading(false);
    if (!error) handleClose();
    else alert('Error al actualizar ticket');
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 transition-opacity duration-300 ease-out ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] transition-transform duration-300 ease-out ${isVisible && !isClosing ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'}`}>
        
        {/* Header */}
        <div className={`${ticket.status === 'comprado' ? 'bg-gray-800' : 'bg-yellow-500'} p-4 text-white text-center relative transition-colors`}>
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >✕</button>
          <h2 className="text-2xl font-extrabold mb-1">Número {String(ticket.id).padStart(2, '0')}</h2>
          <p className="text-white/90 text-sm font-medium uppercase tracking-widest">
            {ticket.status}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {ticket.reserved_at && (
            <div className="text-center text-sm text-gray-500 bg-gray-50 py-2 rounded-lg">
              Reservado el: <span className="font-semibold">{format(parseISO(ticket.reserved_at), "d 'de' MMMM, h:mm a", { locale: es })}</span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg border-b pb-2">Datos del Comprador (Opcional)</h3>
            
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Nombre de quien pagó" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="number" 
                placeholder="Celular / WhatsApp" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 grid grid-cols-2 gap-3">
            {ticket.status !== 'comprado' && (
              <button 
                disabled={loading}
                onClick={() => handleUpdate('comprado')}
                className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"
              >
                <Check className="w-5 h-5" /> Aprobar Pago
              </button>
            )}

            {ticket.status === 'comprado' && (
              <button 
                disabled={loading}
                onClick={() => handleUpdate(ticket.status)}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"
              >
                <Save className="w-5 h-5" /> Guardar Datos
              </button>
            )}

            <button 
              disabled={loading}
              onClick={() => {
                if (window.confirm("¿Seguro que quieres liberar este número? Se borrarán los datos.")) {
                  handleUpdate('disponible');
                }
              }}
              className="col-span-2 bg-red-100 text-red-600 hover:bg-red-200 font-bold py-3 rounded-xl flex justify-center items-center gap-2"
            >
              <X className="w-5 h-5" /> Rechazar y Liberar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
