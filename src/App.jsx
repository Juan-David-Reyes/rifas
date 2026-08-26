import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import TicketGrid from './components/TicketGrid'
import CheckoutModal from './components/CheckoutModal'

// Ajusta el precio de cada número aquí
const PRECIO_TICKET = 10000; 

function App() {
  const [tickets, setTickets] = useState([])
  const [selectedTickets, setSelectedTickets] = useState([])
  const [showModal, setShowModal] = useState(false) // Lo activaremos en el próximo paso
  const showModalRef = useRef(showModal)

  useEffect(() => {
    showModalRef.current = showModal
  }, [showModal])

  useEffect(() => {
    // 1. Carga inicial de los números
    fetchTickets()

    // 2. Escuchar cambios en vivo (La magia del tiempo real)
    const channel = supabase
      .channel('cambios-tickets')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'tickets' }, 
        (payload) => {
          // Actualizamos la grilla
          setTickets(prev => prev.map(t => t.id === payload.new.id ? payload.new : t))
          
          // UX Extra: Si alguien más reserva un número que yo tenía seleccionado pero no había pagado, se me quita de la selección.
          // Ignoramos esto si el usuario actual tiene el modal abierto (es decir, él mismo está haciendo la reserva).
          if (payload.new.status !== 'disponible' && !showModalRef.current) {
            setSelectedTickets(prev => prev.filter(id => id !== payload.new.id))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const fetchTickets = async () => {
    const { data, error } = await supabase.from('tickets').select('*').order('id')
    if (data) setTickets(data)
  }

  const toggleTicket = (id) => {
    setSelectedTickets(prev => 
      prev.includes(id) 
        ? prev.filter(ticketId => ticketId !== id) 
        : [...prev, id]
    )
  }

  const totalAPagar = selectedTickets.length * PRECIO_TICKET

  return (
    // pb-24 da espacio al final para que la Sticky Bar no tape los últimos números
    <div className="min-h-screen bg-gray-50 pb-24 font-sans"> 
      
      {/* HERO SECTION - El contexto de Bombillo */}
      <header className="bg-white shadow-sm pt-12 pb-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            🐾 Gran Rifa para Bombillo
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-5">
            Bombillo está recuperándose de su cirugía y necesitamos tu ayuda para cubrir los gastos médicos. 
            ¡Participa y gana <span className="font-bold text-green-600">$300.000 COP</span>!
          </p>
          <div className="inline-block bg-blue-50 text-blue-800 px-5 py-2 rounded-full font-semibold text-sm border border-blue-100">
            Valor por número: ${PRECIO_TICKET.toLocaleString('es-CO')}
          </div>
        </div>
      </header>

      {/* GRILLA DE NÚMEROS */}
      <main className="mt-8">
        <TicketGrid 
          tickets={tickets} 
          selectedTickets={selectedTickets} 
          toggleTicket={toggleTicket} 
        />
      </main>

      {/* STICKY BAR (CARRITO FLOTANTE) */}
      {selectedTickets.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] p-4 z-40 animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                {selectedTickets.length} {selectedTickets.length === 1 ? 'número seleccionado' : 'números seleccionados'}
              </p>
              <p className="text-2xl font-bold text-gray-900 leading-none">
                Total: ${totalAPagar.toLocaleString('es-CO')}
              </p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform active:scale-95"
            >
              Reservar y Pagar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CHECKOUT */}
      {showModal && (
        <CheckoutModal 
          selectedTickets={selectedTickets} 
          totalAPagar={totalAPagar}
          onClose={() => {
            setShowModal(false);
            setSelectedTickets([]); // Limpiar selección tras cerrar
          }} 
        />
      )}
    </div>
  )
}

export default App