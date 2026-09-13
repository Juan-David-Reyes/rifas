import { DollarSign, BarChart3, Users, Search, XCircle, Image as ImageIcon, Undo2 } from 'lucide-react'
import { formatMoney, formatTicketNumber } from '../../utils/formatters'

export default function TabOverview({
  totalCollected,
  expectedTotal,
  totalReservedAmount,
  boughtTicketsCount,
  reservedTicketsCount,
  availableTicketsCount,
  buyersList,
  searchTerm,
  setSearchTerm,
  handleApprovePayment,
  handleRejectPayment,
  handleRevertPayment,
  isApproving
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <DollarSign className="w-24 h-24" />
          </div>
          <div className="text-gray-500 text-sm font-bold mb-1 flex items-center gap-2 uppercase tracking-wide">
            <DollarSign className="w-5 h-5 text-green-500" /> Recaudado (Pagado)
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">
            ${formatMoney(totalCollected)}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            Meta de recaudo: ${formatMoney(expectedTotal)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-green-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(totalCollected / expectedTotal) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 flex flex-col justify-center relative overflow-hidden">
          <div className="text-yellow-700 text-xs font-bold uppercase tracking-wider mb-2">Por Validar (Pendientes)</div>
          <div className="text-3xl font-black text-yellow-900">${formatMoney(totalReservedAmount)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-1 space-y-4 h-fit">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <BarChart3 className="w-5 h-5 text-blue-500" /> Estado de Números
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">Pagados</span>
              </div>
              <span className="font-bold text-gray-900">{boughtTicketsCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600 font-medium">Reservados</span>
              </div>
              <span className="font-bold text-gray-900">{reservedTicketsCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <span className="text-gray-600 font-medium">Disponibles</span>
              </div>
              <span className="font-bold text-gray-900">{availableTicketsCount}</span>
            </div>
          </div>
        </div>

        {/* Buyers List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" /> Compradores Activos
            </h3>
            <div className="relative w-48">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2">
            {buyersList.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8 font-medium">Aún no hay compradores registrados.</p>
            ) : (
              buyersList.map((buyer, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-gray-900">{buyer.name}</div>
                      <div className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-md ${buyer.status === 'comprado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {buyer.status === 'comprado' ? 'Pagado' : 'Pendiente'}
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm mb-1">
                      Números: <span className="font-bold text-gray-900">{buyer.numbers.join(', ')}</span>
                    </div>
                    {buyer.phone && <div className="text-xs text-gray-400">{buyer.phone}</div>}
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t border-gray-200 sm:border-0 pt-3 sm:pt-0">
                    <div className="text-blue-700 font-black text-lg">
                      ${formatMoney(buyer.amountToPay)}
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      {buyer.receipt_url && (
                        <a 
                          href={buyer.receipt_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-lg transition-colors border border-blue-200"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          Ver Comprobante
                        </a>
                      )}
                      
                      {buyer.status === 'reservado' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectPayment(buyer.name)}
                            disabled={isApproving === buyer.name}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-1.5 px-3 rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1 flex-1 sm:flex-none"
                            title="Rechazar y liberar números"
                          >
                            <XCircle className="w-4 h-4" />
                            Rechazar
                          </button>
                          <button
                            onClick={() => handleApprovePayment(buyer.name)}
                            disabled={isApproving === buyer.name}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-4 rounded-lg text-sm shadow transition-colors disabled:opacity-50 flex-1 sm:flex-none"
                          >
                            {isApproving === buyer.name ? 'Aprobando...' : 'Aprobar'}
                          </button>
                        </div>
                      )}
                      
                      {buyer.status === 'comprado' && (
                        <div className="flex gap-2 mt-1 justify-end">
                          <button
                            onClick={() => handleRevertPayment(buyer.name)}
                            disabled={isApproving === buyer.name}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-1.5 px-3 rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1 flex-1 sm:flex-none"
                            title="Deshacer aprobación y liberar números"
                          >
                            <Undo2 className="w-4 h-4" />
                            Revertir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
