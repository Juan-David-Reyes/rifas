import { useState, useEffect, useMemo } from 'react';
import { differenceInMinutes, parseISO } from 'date-fns';

export default function TicketGrid({ tickets, selectedTickets, toggleTicket, isAdmin, winnerTicketId }) {
  // Estado para forzar re-render y evaluar el tiempo real
  const [now, setNow] = useState(new Date());

  // Actualizar 'now' cada 10 segundos para la "Evaluación Perezosa"
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  // Generamos los 100 números (del 0 al 99)
  const allNumbers = useMemo(() => Array.from({ length: 100 }, (_, i) => i), []);

  // Optimización: Convertimos el arreglo de la BD en un diccionario para búsquedas O(1)
  const ticketMap = useMemo(() => {
    return tickets.reduce((acc, t) => {
      acc[t.id] = t;
      return acc;
    }, {});
  }, [tickets]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {allNumbers.map((num) => {
          // Buscamos el estado del número de forma instantánea
          const dbTicket = ticketMap[num];
          let computedStatus = dbTicket ? dbTicket.status : 'disponible';

          // -----------------------------------------------------------
          // LOGICA DE EVALUACION PEREZOSA (LAZY EVALUATION)
          // -----------------------------------------------------------
          // Si está reservado, verificamos si ya pasaron 15 minutos.
          // Si es así, lo volvemos a pintar como 'disponible' en el front.
          if (computedStatus === 'reservado' && dbTicket?.reserved_at) {
            const minutesPassed = differenceInMinutes(now, parseISO(dbTicket.reserved_at));
            if (minutesPassed >= 15) {
              computedStatus = 'disponible'; // Auto-liberación visual
            }
          }

          const isSelected = selectedTickets.includes(num);

          // Determinar clases CSS según el estado calculado
          let buttonClasses = "relative overflow-hidden h-14 w-full rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-sm flex justify-center items-center ";
          let isDisabled = false;
          let content = String(num).padStart(2, '0');

          // MODO GANADOR ABSOLUTO
          if (winnerTicketId) {
            isDisabled = true;
            if (num === parseInt(winnerTicketId)) {
              buttonClasses += "bg-green-500 text-white border-b-4 border-green-700 shadow-xl ring-4 ring-green-300 scale-105 z-10";
              content = <span className="flex items-center gap-1 text-xl">🏆 {String(num).padStart(2, '0')}</span>;
            } else {
              buttonClasses += "bg-gray-100 text-gray-400 border border-gray-200 opacity-40 cursor-not-allowed";
            }
          } else {
            // FLUJO NORMAL
            if (computedStatus === 'comprado') {
              buttonClasses += `bg-gray-200 text-gray-400 border border-gray-300 opacity-70 ${isAdmin ? 'cursor-pointer hover:border-gray-500 hover:opacity-100 hover:shadow-md' : 'cursor-not-allowed'}`;
              isDisabled = !isAdmin;
              content = (
                <>
                  <span className="relative z-10">{String(num).padStart(2, '0')}</span>
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-400 transform -rotate-45 scale-150 opacity-60"></div>
                </>
              );
            } else if (computedStatus === 'reservado') {
              buttonClasses += `bg-yellow-300 text-yellow-800 border-b-4 border-yellow-500 ${isAdmin ? 'cursor-pointer hover:bg-yellow-400 hover:shadow-md' : 'cursor-not-allowed'}`;
              isDisabled = !isAdmin;
            } else {
              // Está disponible
              if (isSelected) {
                // Seleccionado por MÍ
                buttonClasses += "bg-blue-600 text-white border-b-4 border-blue-800 shadow-md ring-2 ring-blue-300 ring-offset-2 z-10 scale-105";
              } else {
                // Disponible para seleccionar
                if (!isAdmin && selectedTickets.length >= 2) {
                  // Si ya seleccionó 2, bloqueamos los demás para que no de alertas
                  buttonClasses += "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60";
                  isDisabled = true;
                } else {
                  buttonClasses += "bg-white text-gray-700 border border-[#777777] hover:border-blue-300 hover:bg-blue-50 hover:shadow-md";
                }
              }
            }
          }

          return (
            <button
              key={num}
              onClick={() => {
                if (!isDisabled) {
                  toggleTicket(num);
                }
              }}
              disabled={isDisabled}
              className={buttonClasses}
              title={`Número ${String(num).padStart(2, '0')} - ${computedStatus}`}
            >
              {content}
            </button>
          );
        })}
      </div>
      
      {/* Leyenda Visual */}
      <div className="mt-10 flex flex-wrap justify-center gap-2 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white border border-[#777777] rounded-md"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded-md"></div>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-yellow-300 rounded-md border border-yellow-500"></div>
          <span>Reservado (Proceso de pago)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded-md border border-gray-300 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-400 transform -rotate-45 scale-150 opacity-60"></div>
          </div>
          <span>Comprado</span>
        </div>
      </div>
    </div>
  );
}
