import { Plus, Trash2 } from 'lucide-react'

export default function TabPayments({
  formData,
  handleChange,
  setFormData
}) {
  const BANKS = [
    'Bancolombia', 'Davivienda', 'Banco de Bogotá', 'Banco de Occidente', 
    'Banco Popular', 'Banco AV Villas', 'Banco Caja Social', 'Scotiabank Colpatria', 
    'Itaú', 'BBVA', 'Banco Falabella', 'Nequi', 'Daviplata', 'Lulo Bank', 
    'NuBank', 'Ualá', 'Dale!', 'RappiPay', 'Otro'
  ]
  
  const BILLETERAS = ['Nequi', 'Daviplata', 'Dale!', 'RappiPay', 'Ualá']

  const addPaymentMethod = () => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: [...(prev.paymentMethods || []), { bank: 'Bancolombia', transferMethod: 'Llave Breb', accountType: 'Ahorros', account: '' }]
    }))
  }

  const removePaymentMethod = (index) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, i) => i !== index)
    }))
  }

  const updatePaymentMethod = (index, field, value) => {
    setFormData(prev => {
      const newMethods = [...prev.paymentMethods]
      newMethods[index][field] = value
      return { ...prev, paymentMethods: newMethods }
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
          <h3 className="font-bold text-gray-800">Recaudo Manual (Cuentas)</h3>
          <button 
            type="button"
            onClick={addPaymentMethod}
            className="text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 cursor-pointer font-bold"
          >
            <Plus className="w-4 h-4" /> Agregar cuenta
          </button>
        </div>

        <div className="space-y-4">
          {formData.paymentMethods?.map((method, index) => {
            const isWallet = BILLETERAS.includes(method.bank);
            const isNumeroCuenta = method.transferMethod === 'Número de cuenta';
            const showAccountType = isNumeroCuenta && !isWallet;
            const inputLabel = method.transferMethod === 'Llave Breb' ? 'Llave' : 'Número de cuenta';

            return (
              <div key={index} className="flex flex-col gap-4 bg-gray-50 p-5 sm:p-6 rounded-3xl border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Banco/Entidad</label>
                    <select 
                      value={method.bank}
                      onChange={(e) => updatePaymentMethod(index, 'bank', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium text-sm cursor-pointer"
                    >
                      {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Medio de Trx</label>
                    <select 
                      value={method.transferMethod || 'Llave Breb'}
                      onChange={(e) => updatePaymentMethod(index, 'transferMethod', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium text-sm cursor-pointer"
                    >
                      <option value="Llave Breb">Llave Breb</option>
                      <option value="Número de cuenta">Número de cuenta</option>
                    </select>
                  </div>
                  {showAccountType && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Tipo de cuenta</label>
                      <select 
                        value={method.accountType || 'Ahorros'}
                        onChange={(e) => updatePaymentMethod(index, 'accountType', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium text-sm cursor-pointer"
                      >
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                      </select>
                    </div>
                  )}
                  <div className={!showAccountType ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-gray-700 mb-2">{inputLabel}</label>
                    <input 
                      type={method.transferMethod === 'Llave Breb' ? 'text' : 'number'}
                      placeholder={method.transferMethod === 'Llave Breb' ? 'Ej. @juan123' : 'Ej. 3001234567'}
                      value={method.account}
                      onChange={(e) => updatePaymentMethod(index, 'account', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none transition-all font-medium text-sm placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                </div>
                {formData.paymentMethods.length > 1 && (
                  <div className="flex justify-end pt-3 mt-1 border-t border-gray-200/60">
                    <button 
                      type="button"
                      onClick={() => removePaymentMethod(index)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar cuenta
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Pasarelas de Pago (Opcional)</h3>
        <p className="text-sm text-gray-500 mb-4">Configura las API Keys para aceptar pagos automáticos. Mantén esto en secreto.</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">MercadoPago Access Token</label>
            <input type="password" name="mercadopago_token" value={formData.mercadopago_token} onChange={handleChange} placeholder="APP_USR-..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-mono" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">ePayco Public Key</label>
            <input type="password" name="epayco_token" value={formData.epayco_token} onChange={handleChange} placeholder="Public Key..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 outline-none font-mono" />
          </div>
        </div>
      </div>
    </div>
  )
}
