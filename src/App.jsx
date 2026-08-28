import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import TicketGrid from './components/TicketGrid'
import CheckoutModal from './components/CheckoutModal'
import AdminLogin from './components/AdminLogin'
import AdminModal from './components/AdminModal'

// Ajusta el precio de cada número aquí
const PRECIO_TICKET = 10000; // 2 números x $10.000 = $20.000 total

function App() {
  const [tickets, setTickets] = useState([])
  const [selectedTickets, setSelectedTickets] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [config, setConfig] = useState({ lottery_name: 'Lotería de Boyacá', draw_date: 'Por definir' })
  
  // Estados Admin
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminSelectedTicket, setAdminSelectedTicket] = useState(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  
  const showModalRef = useRef(showModal)

  useEffect(() => {
    showModalRef.current = showModal
  }, [showModal])

  useEffect(() => {
    // 1. Carga inicial
    fetchTickets()
    fetchConfig()

    // 2. Verificar sesión de Admin
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session)
    })

    // 3. Escuchar cambios en vivo (La magia del tiempo real)
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

    const configChannel = supabase
      .channel('cambios-config')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'config' }, 
        (payload) => setConfig(payload.new)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(configChannel)
      subscription.unsubscribe()
    }
  }, [])

  const fetchTickets = async () => {
    const { data, error } = await supabase.from('tickets').select('*').order('id')
    if (data) setTickets(data)
  }

  const fetchConfig = async () => {
    const { data } = await supabase.from('config').select('*').single()
    if (data) setConfig(data)
  }

  const toggleTicket = (id) => {
    if (isAdmin) {
      const ticket = tickets.find(t => t.id === id);
      if (ticket) setAdminSelectedTicket(ticket);
      return;
    }

    if (!selectedTickets.includes(id) && selectedTickets.length >= 2) {
      alert("Solo puedes seleccionar 2 números por transacción.");
      return;
    }

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
          <div className="bg-purple-50 text-purple-800 px-4 py-3 rounded-xl border border-purple-200 mb-5 mx-auto max-w-lg text-sm sm:text-base">
            🎟️ Juega con las 2 últimas cifras de la <strong>{config.lottery_name}</strong> el <strong>{config.draw_date}</strong>
          </div>
          <div>
            <div className="inline-block bg-blue-50 text-blue-800 px-5 py-2 rounded-full font-semibold text-sm border border-blue-100">
              Valor por número: ${PRECIO_TICKET.toLocaleString('es-CO')}
            </div>
          </div>
        </div>
      </header>

      {/* GRILLA DE NÚMEROS */}
      <main className="mt-8">
        <TicketGrid 
          tickets={tickets} 
          selectedTickets={selectedTickets} 
          toggleTicket={toggleTicket} 
          isAdmin={isAdmin}
        />
      </main>

      {/* STICKY BAR (CARRITO FLOTANTE) */}
      {selectedTickets.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] p-4 z-40 animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                {selectedTickets.length} / 2 números seleccionados
              </p>
              <p className="text-2xl font-bold text-gray-900 leading-none">
                Total: ${totalAPagar.toLocaleString('es-CO')}
              </p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              disabled={selectedTickets.length !== 2}
              className={`${selectedTickets.length === 2 ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg transform active:scale-95' : 'bg-gray-300 cursor-not-allowed'} text-white font-bold py-3 px-8 rounded-xl transition-all`}
            >
              {selectedTickets.length === 2 ? 'Reservar y Pagar' : 'Selecciona 1 más'}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <CheckoutModal 
          selectedTickets={selectedTickets} 
          totalAPagar={totalAPagar}
          onClose={() => {
            setShowModal(false);
          }} 
          onConcurrencyError={(stolenIds) => {
            setSelectedTickets(prev => prev.filter(id => !stolenIds.includes(id)));
          }}
        />
      )}

      {/* FOOTER & SECRET ADMIN LOGIN */}
      <footer className="mt-12 pb-8 text-center text-sm text-gray-400 flex flex-col items-center justify-center">
        <button 
          onClick={() => setShowAdminLogin(true)} 
          className="text-gray-300 hover:text-gray-500 transition-colors p-4"
          title="Admin Login"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </button>
        {isAdmin && (
          <div className="mt-2 flex flex-col items-center gap-3">
            <div className="text-blue-600 font-bold">
              Modo Administrador Activo 
              <button 
                onClick={() => supabase.auth.signOut()} 
                className="underline ml-4 text-blue-800 hover:text-blue-900"
              >
                Salir
              </button>
            </div>
            <button 
              onClick={() => setShowConfigModal(true)}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
            >
              ⚙️ Configurar Lotería y Fecha
            </button>
          </div>
        )}
      </footer>

      {/* MODALES DE ADMIN */}
      {showAdminLogin && (
        <AdminLogin 
          onClose={() => setShowAdminLogin(false)} 
          onLoginSuccess={() => setShowAdminLogin(false)}
        />
      )}

      {adminSelectedTicket && (
        <AdminModal 
          ticket={adminSelectedTicket} 
          onClose={() => setAdminSelectedTicket(null)} 
        />
      )}

      {showConfigModal && (
        <ConfigModal
          config={config}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  )
}

import ConfigModal from './components/ConfigModal'; // Add at bottom or move to top
export default App