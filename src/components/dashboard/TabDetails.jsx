import { Trophy } from 'lucide-react'

export default function TabDetails({
  formData,
  handleChange,
  totalTicketsCount
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Información Principal</h3>
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Título de la Rifa</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-gray-900 outline-none" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-gray-900 outline-none resize-none" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Premio Prometido</label>
          <input type="text" name="prize" value={formData.prize} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-gray-900 outline-none" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Sorteo</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Lotería (Ej: Boyacá)</label>
            <input type="text" name="lottery_name" value={formData.lottery_name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-gray-900 outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Fecha Sorteo</label>
            <input type="text" name="draw_date" value={formData.draw_date} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-gray-900 outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-[32px] border border-green-200 space-y-3">
        <h3 className="font-bold text-green-900 flex items-center gap-2"><Trophy className="w-5 h-5 text-green-600" /> Finalizar Rifa</h3>
        <p className="text-sm text-green-700 mb-2">Ingresa el número ganador para cerrar la rifa y mostrar el ganador al público.</p>
        <input type="number" name="winner_ticket_id" value={formData.winner_ticket_id} onChange={handleChange} min="0" max={totalTicketsCount-1} placeholder="Dejar vacío para seguir" className="w-full max-w-xs px-4 py-3 bg-white border border-green-300 rounded-[16px] focus:ring-2 focus:ring-green-50 outline-none font-bold text-green-700" />
      </div>
    </div>
  )
}
