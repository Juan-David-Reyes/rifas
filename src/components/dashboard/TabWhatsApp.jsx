export default function TabWhatsApp({
  formData,
  handleChange
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Configuración de WhatsApp</h3>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Número Celular (Receptor)</label>
          <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} placeholder="Ej. 3001234567" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-gray-900 outline-none" />
          <p className="text-xs text-gray-500 mt-2">Si lo dejas vacío, usaremos el mismo número de tu cuenta bancaria.</p>
        </div>
        <div className="pt-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Plantilla del Mensaje</label>
          <p className="text-sm text-gray-500 mb-3">
            Variables disponibles: <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">{"{{nombre}}"}</code>, <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">{"{{boletas}}"}</code>, <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">{"{{total}}"}</code>.
          </p>
          <textarea name="whatsapp_template" value={formData.whatsapp_template} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-gray-900 outline-none resize-none" />
        </div>
      </div>
    </div>
  )
}
