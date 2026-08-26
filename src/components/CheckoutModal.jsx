import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Clock, Copy, CheckCircle2, MessageCircle } from 'lucide-react';
import { addMinutes, differenceInSeconds } from 'date-fns';

export default function CheckoutModal({ 
  selectedTickets, 
  onClose, 
  totalAPagar 
}) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos en segundos
  const [isReserving, setIsReserving] = useState(true);
  const [error, setError] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(null);
  
  // Estados para animaciones suaves
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Activar la animación de entrada justo después de montar
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Bloquear el scroll del fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Función unificada para cerrar con animación
  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 300ms = duration de la transición
  };

  // Efecto para reservar los tickets al abrir el modal
  useEffect(() => {
    let isMounted = true;
    
    const reserveTickets = async () => {
      try {
        const now = new Date().toISOString();
        const { error } = await supabase
          .from('tickets')
          .update({ status: 'reservado', reserved_at: now })
          .in('id', selectedTickets);

        if (error) throw error;
        
        if (isMounted) {
          setIsReserving(false);
          // Opcional: Podrías calcular el tiempo restante exacto basado en la DB aquí
        }
      } catch (err) {
        if (isMounted) {
          setError('Hubo un error al reservar los números. Por favor, intenta de nuevo.');
          setIsReserving(false);
        }
      }
    };

    reserveTickets();

    return () => { isMounted = false; };
  }, [selectedTickets]);

  // Efecto para el contador regresivo
  useEffect(() => {
    if (isReserving || error) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose(); // Cerrar modal con animación si el tiempo expira
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isReserving, error, onClose]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleWhatsApp = () => {
    const phone = "573209513083"; // Reemplazar con el número real de WhatsApp
    const message = `¡Hola! Acabo de transferir $${totalAPagar.toLocaleString('es-CO')} para los números: ${selectedTickets.join(', ')}. Aquí está mi comprobante para Bombillo 🐱`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 transition-opacity duration-300 ease-out ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] transition-transform duration-300 ease-out ${isVisible && !isClosing ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'}`}>
        
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white text-center relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
          <h2 className="text-2xl font-extrabold mb-1">Completa tu compra</h2>
          <p className="text-blue-100 text-sm">Reserva para Bombillo 🐾</p>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {isReserving ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium animate-pulse">Asegurando tus números...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <button 
                onClick={handleClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-xl transition-colors"
              >
                Volver
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              
              {/* Timer & Summary */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 text-orange-600 font-bold">
                  <Clock className="w-5 h-5 animate-pulse" />
                  <span className="text-lg">Tienes {formatTime(timeLeft)} minutos</span>
                </div>
                <p className="text-sm text-gray-600">
                  Transfiere antes de que el tiempo expire para no perder tus números.
                </p>
                <div className="pt-2 flex justify-between items-center border-t border-orange-100/50 mt-2 text-gray-800">
                  <span className="font-medium">Números: {selectedTickets.join(', ')}</span>
                  <span className="text-xl font-black">${totalAPagar.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>
                  Transfiere a estas cuentas
                </h3>
                
                {/* Llave Breb */}
                <div className="group flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Llave Breb</span>
                    <span className="text-lg font-bold text-gray-900 tracking-wide">320 951 3083</span>
                  </div>
                  <button 
                    onClick={() => handleCopy('3209513083', 'llavebreb')}
                    className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {copiedAccount === 'llavebreb' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                {/* Nequi */}
                <div className="group flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium">Nequi</span>
                    <span className="text-lg font-bold text-gray-900 tracking-wide">320 951 3083</span>
                  </div>
                  <button 
                    onClick={() => handleCopy('3209513083', 'nequi')}
                    className="p-2 text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    {copiedAccount === 'nequi' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-3 pt-4">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>
                  Envía el comprobante
                </h3>
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5b] active:bg-[#1a9d4b] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Enviar a WhatsApp</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
