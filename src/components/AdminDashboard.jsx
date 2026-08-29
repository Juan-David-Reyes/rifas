import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { X, Save, Trophy, Settings, Type, AlignLeft, Gift, Calendar, Hash, BarChart3, Users, DollarSign, Download } from 'lucide-react';

export default function AdminDashboard({ config, tickets = [], onClose, onConfigUpdated }) {
  const [activeTab, setActiveTab] = useState('stats'); // 'config' | 'stats'
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

  // Bloquear el scroll del fondo mientras el dashboard está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
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
        <div className="bg-slate-900 text-white p-6 flex flex-col shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold">Dashboard Admin</h2>
            </div>
            <button onClick={handleClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
              Estadísticas
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'config' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
              Configuración
            </button>
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {activeTab === 'config' ? (
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
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
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
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
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
          ) : (
            <AdminStats tickets={tickets} />
          )}
        </div>

        {/* Footer */}
        {activeTab === 'config' && (
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
        )}

      </div>
    </div>
  );
}

function AdminStats({ tickets }) {
  const PRECIO_POR_PAR = 20000;
  const totalTickets = 100;
  
  const reservedTickets = tickets.filter(t => t.status === 'reservado').length;
  const boughtTickets = tickets.filter(t => t.status === 'comprado').length;
  const availableTickets = totalTickets - (reservedTickets + boughtTickets);

  const totalCollected = (boughtTickets / 2) * PRECIO_POR_PAR;
  const totalReservedAmount = (reservedTickets / 2) * PRECIO_POR_PAR;
  const expectedTotal = (totalTickets / 2) * PRECIO_POR_PAR;

  // Group buyers
  const buyersGroup = {};
  tickets.filter(t => t.status === 'comprado' || t.status === 'reservado').forEach(t => {
    const key = t.buyer_name ? t.buyer_name.trim().toLowerCase() : 'desconocido_key_' + t.id;
    if (!buyersGroup[key]) {
      buyersGroup[key] = {
        name: t.buyer_name || 'Sin Nombre',
        phone: t.buyer_phone || '',
        numbers: [],
        status: t.status 
      };
    }
    buyersGroup[key].numbers.push(String(t.id).padStart(2, '0'));
    if (t.status === 'comprado') buyersGroup[key].status = 'comprado';
  });

  const buyersList = Object.values(buyersGroup).map(buyer => ({
    ...buyer,
    amountToPay: (buyer.numbers.length / 2) * PRECIO_POR_PAR
  })).sort((a, b) => b.numbers.length - a.numbers.length);

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Rifa</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1a1a1a; }
            h1 { color: #0055ff; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; }
            h2 { color: #2d3748; margin-top: 30px; }
            .grid { display: flex; gap: 20px; margin-bottom: 30px; }
            .card { background: #f7fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; flex: 1; }
            .card-title { font-size: 12px; font-weight: bold; color: #718096; text-transform: uppercase; margin-bottom: 5px; }
            .card-value { font-size: 24px; font-weight: bold; color: #2d3748; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #f7fafc; color: #4a5568; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge-green { color: #22c55e; font-weight: bold; }
            .badge-yellow { color: #eab308; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte de Rifa - Bombillo</h1>
          
          <div class="grid">
            <div class="card">
              <div class="card-title">Recaudado (Pagado)</div>
              <div class="card-value">$${totalCollected.toLocaleString('es-CO')}</div>
            </div>
            <div class="card">
              <div class="card-title">Por Validar</div>
              <div class="card-value">$${totalReservedAmount.toLocaleString('es-CO')}</div>
            </div>
            <div class="card">
              <div class="card-title">Números (Vendidos / Total)</div>
              <div class="card-value">${boughtTickets + reservedTickets} / 100</div>
            </div>
          </div>
          
          <h2>Estado de los Números</h2>
          <ul>
            <li><strong>Disponibles:</strong> ${availableTickets}</li>
            <li><strong>Reservados (Pendientes):</strong> ${reservedTickets}</li>
            <li><strong>Aprobados (Pagados):</strong> ${boughtTickets}</li>
          </ul>
          
          <h2>Listado de Compradores</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Celular</th>
                <th>Números</th>
                <th>Estado</th>
                <th>Total a Pagar</th>
              </tr>
            </thead>
            <tbody>
              ${buyersList.length === 0 ? '<tr><td colspan="5" style="text-align: center;">No hay reservas registradas</td></tr>' : ''}
              ${buyersList.map(b => `
                <tr>
                  <td>${b.name}</td>
                  <td>${b.phone || '-'}</td>
                  <td>${b.numbers.join(', ')}</td>
                  <td class="${b.status === 'comprado' ? 'badge-green' : 'badge-yellow'}">${b.status === 'comprado' ? 'Pagado' : 'Pendiente'}</td>
                  <td><strong>$${b.amountToPay.toLocaleString('es-CO')}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 40px; font-size: 12px; color: #a0aec0; text-align: center;">Generado el ${new Date().toLocaleString('es-CO')}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Botón de Descarga */}
      <div className="flex justify-end">
        <button 
          onClick={handleDownloadPDF}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition-all active:scale-95 text-sm"
        >
          <Download className="w-4 h-4" /> Exportar a PDF
        </button>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <div className="text-gray-500 text-sm font-semibold mb-1 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" /> Recaudado (Pagado)
          </div>
          <div className="text-3xl font-black text-gray-900">
            ${totalCollected.toLocaleString('es-CO')}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Meta: ${expectedTotal.toLocaleString('es-CO')}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
          <div className="text-yellow-700 text-xs font-bold uppercase mb-1">Por Validar</div>
          <div className="text-xl font-bold text-yellow-900">${totalReservedAmount.toLocaleString('es-CO')}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <div className="text-blue-700 text-xs font-bold uppercase mb-1">Total Números</div>
          <div className="text-xl font-bold text-blue-900">{boughtTickets + reservedTickets} / 100</div>
        </div>
      </div>

      {/* Estados de los números */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
          <BarChart3 className="w-5 h-5 text-blue-500" /> Estado de los números
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span className="text-gray-600 font-medium">Disponibles</span>
            </div>
            <span className="font-bold text-gray-900">{availableTickets}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">Reservados</span>
            </div>
            <span className="font-bold text-gray-900">{reservedTickets}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 font-medium">Aprobados</span>
            </div>
            <span className="font-bold text-gray-900">{boughtTickets}</span>
          </div>
        </div>
      </div>

      {/* Lista de Compradores */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Users className="w-5 h-5 text-purple-500" /> Compradores ({buyersList.length})
        </h3>
        
        <div className="space-y-4">
          {buyersList.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Aún no hay reservas registradas.</p>
          ) : (
            buyersList.map((buyer, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-gray-900">{buyer.name}</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-md ${buyer.status === 'comprado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {buyer.status === 'comprado' ? 'Pagado' : 'Pendiente'}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <div className="text-gray-500">
                    Números: <span className="text-gray-900">{buyer.numbers.join(', ')}</span>
                  </div>
                  <div className="text-blue-700 font-bold">
                    ${buyer.amountToPay.toLocaleString('es-CO')}
                  </div>
                </div>
                {buyer.phone && (
                  <div className="text-xs text-gray-400 mt-1">Cel: {buyer.phone}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
