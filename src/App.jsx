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
  const [config, setConfig] = useState({ 
    lottery_name: 'Boyacá', 
    draw_date: 'Por definir',
    title: '🐾 Gran Rifa para Bombillo',
    description: 'Bombillo está recuperándose de su cirugía y necesitamos tu ayuda para cubrir los gastos médicos.',
    prize: '$300.000 COP',
    winner_ticket_id: null
  })
  
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

    if (!isAdmin && config.winner_ticket_id) return;

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
    <div className="min-h-screen bg-gray-50 font-sans"> 
      
      {/* TOP NAVBAR / HEADER */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🐾 Bombillo
          </span>
        </div>
      </nav>

      {/* HERO SECTION - El contexto de Bombillo */}
      <header className="bg-gradient-to-b from-blue-50 to-gray-50 pt-16 pb-12 px-4 text-center border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          {config.winner_ticket_id && (
            <div className="mb-6 inline-flex items-center justify-center bg-green-100 text-green-800 px-6 py-2 rounded-full font-black text-lg animate-bounce border border-green-300 shadow-sm">
              🏆 ¡Tenemos un ganador: Número {config.winner_ticket_id}! 🏆
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {config.title}
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
            {config.description} <br className="hidden sm:block" />¡Participa y gana <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{config.prize}</span>!
          </p>
          <div className="bg-white shadow-sm px-6 py-4 rounded-2xl border border-gray-200 mb-6 mx-auto max-w-lg text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-xl">🎟️</span> Juega con la lotería de: <strong>{config.lottery_name}</strong>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="text-gray-500 font-medium text-sm">
              Sorteo: {config.draw_date}
            </div>
          </div>
          <div>
            <div className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-200">
              Valor 2 números: $20.000 COP
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
          winnerTicketId={config.winner_ticket_id}
        />
      </main>

      {/* STICKY BAR (CARRITO FLOTANTE) */}
      {!config.winner_ticket_id && selectedTickets.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] p-4 sm:p-5 z-40 animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 font-semibold mb-1">
                {selectedTickets.length} / 2 números
              </p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">
                $20.000
              </p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              disabled={selectedTickets.length !== 2}
              className={`${selectedTickets.length === 2 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 shadow-lg transform active:scale-95' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} font-bold py-3 px-6 sm:px-10 rounded-xl transition-all whitespace-nowrap`}
            >
              {selectedTickets.length === 2 ? 'Pagar ➔' : 'Falta 1 número'}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <CheckoutModal 
          selectedTickets={selectedTickets} 
          totalAPagar={20000}
          onClose={() => {
            setShowModal(false);
          }} 
          onConcurrencyError={(stolenIds) => {
            setSelectedTickets(prev => prev.filter(id => !stolenIds.includes(id)));
          }}
          onReset={() => {
            setSelectedTickets([]);
            setShowModal(false);
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
              ⚙️ Dashboard Administrador
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
        <AdminDashboard
          config={config}
          onClose={() => setShowConfigModal(false)}
          onConfigUpdated={(newConfig) => setConfig(prev => ({ ...prev, ...newConfig }))}
        />
      )}
    </div>
  )
}

import AdminDashboard from './components/AdminDashboard';
export default App