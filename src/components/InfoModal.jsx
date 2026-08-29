import { useState, useEffect } from 'react';

export default function InfoModal({ onClose }) {
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

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-out ${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Clic fuera para cerrar */}
      <div className="absolute inset-0" onClick={handleClose}></div>
      
      <div className={`relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-300 ease-out transform ${isVisible && !isClosing ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
             <img src="/bombillo.jpeg" alt="Bombillo" className="w-full h-full object-cover" />
          </div>
          
          <div className="text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Tengo 8 años y soy un peludito muy tranquilo y amoroso. Hace unos días tuvieron que operarme la boquita y la recuperación se ha complicado; llevo varios días hospitalizado y con muchos exámenes. 
            </p>
            <p>
              Aunque soy muy fuerte y estoy luchando por mejorar, mis papás necesitan una patita para cubrir los gastos de mi tratamiento. 
            </p>
            <p className="font-bold text-gray-900 text-lg">
              ¿Nos ayudas a salir adelante?
            </p>
          </div>

          <button 
            onClick={handleClose}
            className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
