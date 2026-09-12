export default function TabPayments({
  formData,
  handleChange
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Recaudo Manual</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Banco o Billetera (Ej. Nequi)</label>
            <input type="text" name="payment_method_name" value={formData.payment_method_name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">Número de Cuenta</label>
            <input type="text" name="payment_account_number" value={formData.payment_account_number} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Pasarelas de Pago (Opcional)</h3>
        <p className="text-sm text-gray-500 mb-4">Configura las API Keys para aceptar pagos automáticos. Mantén esto en secreto.</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">MercadoPago Access Token</label>
            <input type="password" name="mercadopago_token" value={formData.mercadopago_token} onChange={handleChange} placeholder="APP_USR-..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-mono" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">ePayco Public Key</label>
            <input type="password" name="epayco_token" value={formData.epayco_token} onChange={handleChange} placeholder="Public Key..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-mono" />
          </div>
        </div>
      </div>
    </div>
  )
}
