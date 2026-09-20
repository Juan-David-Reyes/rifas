'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Ticket, ArrowRight, CheckCircle2, DollarSign, Calculator, Lock, Plus, Trash2, PlusCircle, Loader2 } from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { createRaffle } from './actions'
export default function CrearRifaWizard({ initialSettings }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    prizeType: 'money',
    prizeValue: '',
    prizeDescription: '',
    ticketCount: 100,
    ticketPrice: 10000,
    paymentMethods: [{ bank: 'Bancolombia', transferMethod: 'Llave Breb', accountType: 'Ahorros', account: '' }],
    name: '',
    email: '',
    password: '',
  })
  
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get('step')
    if (stepParam) {
      const savedState = localStorage.getItem('crearRifaState')
      if (savedState) {
        try {
          setFormData(JSON.parse(savedState))
          setStep(parseInt(stepParam, 10))
        } catch(e) {}
        localStorage.removeItem('crearRifaState')
      }
    }
  }, [])

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => Math.max(1, s - 1))

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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

  const BANKS = [
    'Bancolombia', 'Davivienda', 'Banco de Bogotá', 'Banco de Occidente', 
    'Banco Popular', 'Banco AV Villas', 'Banco Caja Social', 'Scotiabank Colpatria', 
    'Itaú', 'BBVA', 'Banco Falabella', 'Nequi', 'Daviplata', 'Lulo Bank', 
    'NuBank', 'Ualá', 'Dale!', 'RappiPay', 'Otro'
  ]
  
  const BILLETERAS = ['Nequi', 'Daviplata', 'Dale!', 'RappiPay', 'Ualá']

  const handleCurrencyChange = (field, value) => {
    const rawValue = value.replace(/\D/g, '');
    updateForm(field, rawValue ? parseInt(rawValue, 10) : '');
  }

  const formatCurrencyInput = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('es-CO').format(value);
  }

  // Cálculos financieros
  const feeType = initialSettings?.fee_type || 'ticket'
  const feeFixed = initialSettings?.fee_fixed || 20000

  const totalRevenue = formData.ticketCount * formData.ticketPrice
  const platformFee = feeType === 'fixed' ? feeFixed : Math.max(10000, formData.ticketPrice)
  const netProfit = totalRevenue - platformFee

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true)
    localStorage.setItem('crearRifaState', JSON.stringify(formData))
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirigir de vuelta al paso 5 (pago) después de auth
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/crear-rifa?step=5')}`,
      },
    })
  }

  const handleEmailRegistration = async () => {
    setIsAuthenticating(true)
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name
        }
      }
    })

    setIsAuthenticating(false)

    if (error) {
      alert("Error en el registro: " + error.message)
      return
    }

    setStep(5)
  }

  const handlePayment = async (method) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // 1. Primero creamos la rifa en la base de datos (con estado PENDING_PAYMENT)
      const result = await createRaffle(formData)
      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      const raffleId = result.raffleId;

      if (method === 'mercadopago') {
        // 2. Llamamos a nuestra API para generar la preferencia de pago
        const mpResponse = await fetch('/api/mercadopago/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            unit_price: platformFee, // Pagamos la tarifa de la plataforma
            raffle_id: raffleId,
            origin: window.location.origin
          })
        });

        const mpData = await mpResponse.json();

        if (mpData.init_point) {
          // 3. Redirigimos al usuario a MercadoPago
          window.location.href = mpData.init_point;
          return; // No cambiamos el step localmente, el navegador se va a MP
        } else {
          throw new Error(mpData.error || 'Error al generar link de pago');
        }
      } else {
        // ePayco u otro (Pendiente de implementar)
        setError('Método de pago no disponible temporalmente.')
        setIsSubmitting(false)
      }
      
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado al procesar la creación.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-body">
      {/* Header with Stepper */}
      <header className="bg-white border-b border-gray-200 h-20 sm:h-24 flex items-center px-4 sm:px-8 justify-between fixed top-0 left-0 right-0 z-50">
        
        {/* Left: Cancel Button */}
        <div className="w-auto sm:flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </Link>
        </div>

        {/* Center: Progress Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-8 relative mt-[-12px]">
          <div className="relative z-10 w-full px-3 sm:px-4">
            
            {/* Track Line Container */}
            <div className="absolute top-3.5 sm:top-4 left-6 sm:left-8 right-6 sm:right-8 h-1 bg-gray-200 -z-10 -translate-y-1/2">
              <div 
                className="h-full bg-primary-500 transition-all duration-500 ease-out" 
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              ></div>
            </div>
            
            {/* Circles and Labels */}
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center relative">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-500 shadow-sm ${
                    step > i ? 'bg-primary-600 text-white shadow-primary-500/30' : 
                    step === i ? 'bg-primary-500 text-white ring-4 ring-primary-100' : 
                    'bg-white text-gray-400 border-2 border-gray-200'
                  }`}>
                    {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
                  </div>
                  {/* Label exactly centered below */}
                  <span className={`absolute top-9 sm:top-10 text-[9px] sm:text-xs font-bold transition-colors whitespace-nowrap ${step >= i ? 'text-gray-900' : 'text-gray-400'} hidden sm:block`}>
                    {i === 1 && 'Detalles'}
                    {i === 2 && 'Estructura'}
                    {i === 3 && 'Proyección'}
                    {i === 4 && 'Cuenta'}
                    {i === 5 && 'Pago'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Logo */}
        <div className="w-auto sm:flex-1 flex justify-end">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <Ticket className="w-3 h-3 text-white transform -rotate-45" />
            </div>
            <span className="font-heading font-black text-gray-900 text-lg tracking-tight hidden sm:inline">deBuenas</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 relative pt-24 sm:pt-28">

        {/* Card Container */}
        <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          
          {/* STEP 1: Detalles del Sorteo */}
          {step === 1 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">¿Qué vas a rifar?</h2>
              <p className="text-gray-500 mb-8 font-medium">Dale un nombre atractivo a tu sorteo para enganchar a tus participantes.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Rifa</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Gran Rifa para la Cirugía de Bombillo 🐱"
                    value={formData.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-lg placeholder:font-normal placeholder:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Tipo de Premio</label>
                  <div className="flex gap-3 mb-5">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.prizeType === 'money' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 hover:border-gray-300 text-gray-600 font-medium'}`}>
                      <input 
                        type="radio" 
                        name="prizeType" 
                        value="money" 
                        checked={formData.prizeType === 'money'}
                        onChange={() => updateForm('prizeType', 'money')}
                        className="hidden"
                      />
                      Dinero (Efectivo)
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.prizeType === 'object' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 hover:border-gray-300 text-gray-600 font-medium'}`}>
                      <input 
                        type="radio" 
                        name="prizeType" 
                        value="object" 
                        checked={formData.prizeType === 'object'}
                        onChange={() => updateForm('prizeType', 'object')}
                        className="hidden"
                      />
                      Objeto Físico
                    </label>
                  </div>

                  {formData.prizeType === 'money' ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Valor comercial del premio (COP)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Ej. 300.000"
                          value={formatCurrencyInput(formData.prizeValue)}
                          onChange={(e) => handleCurrencyChange('prizeValue', e.target.value)}
                          className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-lg placeholder:font-normal placeholder:text-base"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Este valor es opcional pero ayuda a dar confianza a tus compradores.</p>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-bold text-gray-700 mb-2">¿Qué objeto vas a rifar?</label>
                      <input 
                        type="text" 
                        placeholder="Ej. PlayStation 5, Moto Honda Navi..."
                        value={formData.prizeDescription}
                        onChange={(e) => updateForm('prizeDescription', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-lg placeholder:font-normal placeholder:text-base"
                      />
                      <p className="text-xs text-gray-400 mt-2">Describe claramente el premio que se llevará el ganador.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!formData.title}
                  className="bg-gray-900 hover:bg-black disabled:opacity-50 disabled:hover:bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  Continuar <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Estructura Financiera */}
          {step === 2 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Estructura tu rifa</h2>
              <p className="text-gray-500 mb-8 font-medium">Configura la cantidad de números y el precio de cada boleta.</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Cantidad de números</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[50, 100].map(num => (
                      <button
                        key={num}
                        onClick={() => updateForm('ticketCount', num)}
                        className={`py-3 rounded-xl font-bold border-2 transition-all ${
                          formData.ticketCount === num 
                          ? 'border-primary-600 bg-primary-50 text-primary-700' 
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <input 
                      type="number"
                      placeholder="Otro"
                      className="py-3 px-4 rounded-xl font-bold border-2 border-gray-100 bg-white text-gray-600 outline-none focus:border-primary-500 placeholder:font-normal placeholder:text-base"
                      onChange={(e) => updateForm('ticketCount', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Valor de cada número (COP)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Ej. 10.000"
                      value={formatCurrencyInput(formData.ticketPrice)}
                      onChange={(e) => handleCurrencyChange('ticketPrice', e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold text-xl text-gray-900 placeholder:font-normal placeholder:text-base"
                    />
                  </div>
                  {formData.ticketPrice > 0 && formData.ticketPrice < 10000 && (
                     <p className="text-sm text-amber-600 mt-2 font-medium">Nota: El valor mínimo de la boleta sugerido es $10.000 COP.</p>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      ¿A dónde te van a pagar?
                    </span>
                    <button 
                      onClick={addPaymentMethod}
                      className="text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Agregar cuenta
                    </button>
                  </h3>
                  
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
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-sm cursor-pointer"
                              >
                                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-2">Medio de Trx</label>
                              <select 
                                value={method.transferMethod || 'Llave Breb'}
                                onChange={(e) => updatePaymentMethod(index, 'transferMethod', e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-sm cursor-pointer"
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
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-sm cursor-pointer"
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
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium text-sm placeholder:font-normal placeholder:text-gray-400"
                              />
                            </div>
                          </div>
                          {formData.paymentMethods.length > 1 && (
                            <div className="flex justify-end pt-3 mt-1 border-t border-gray-200/60">
                              <button 
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
              </div>

              <div className="mt-10 flex justify-between">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-bold px-4 cursor-pointer">Atrás</button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.ticketCount || !formData.ticketPrice || formData.paymentMethods?.some(m => !m.account.trim())}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold cursor-pointer flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                >
                  Ver Proyección <Calculator className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Proyección y Resumen */}
          {step === 3 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Tu Proyección</h2>
              <p className="text-gray-500 mb-8 font-medium">Así se ven los números de tu rifa. Total transparencia.</p>
              
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-500 font-medium">Recaudo estimado ({formData.ticketCount} boletas)</span>
                  <span className="text-xl font-bold text-gray-900">{formatMoney(totalRevenue)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-medium">Costo de plataforma (Único pago)</span>
                    <span className="text-xs text-gray-400">
                      {feeType === 'fixed' ? 'Tarifa plana por activación' : 'Equivalente a 1 boleta (Mín. $10,000)'}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-red-500">-{formatMoney(platformFee)}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-black text-lg">Tu ganancia</span>
                  <span className="text-3xl font-black text-green-500">{formatMoney(netProfit)}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                <div className="shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5 text-blue-500"/></div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>¡Cero comisiones por ventas!</strong> Solo pagas el costo de activación ({feeType === 'fixed' ? 'tarifa plana' : '1 boleta'}) y el 100% del dinero recaudado va directo a tu cuenta (Nequi/Daviplata/Banco).
                </p>
              </div>

              <div className="mt-10 flex justify-between">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-bold px-4 cursor-pointer">Modificar</button>
                <button 
                  onClick={handleNext}
                  className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold cursor-pointer shadow-lg transition-all transform hover:-translate-y-1"
                >
                  ¡Excelente, Activar Rifa!
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Auth */}
          {step === 4 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-gray-700" />
              </div>
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Guarda tu progreso</h2>
              <p className="text-gray-500 mb-8 font-medium">Crea tu cuenta gratis para asociar esta rifa a tu perfil de organizador antes de pagar la activación.</p>
              
              <button 
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-4 px-4 rounded-xl shadow-sm transition-all mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isAuthenticating ? 'Conectando...' : 'Continuar con Google'}
              </button>

              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">O regístrate con tus datos</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  value={formData.name || ''}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none placeholder:font-normal placeholder:text-sm"
                />
                <input 
                  type="email" 
                  placeholder="Correo electrónico" 
                  value={formData.email || ''}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none placeholder:font-normal placeholder:text-sm"
                />
                <input 
                  type="password" 
                  placeholder="Crea una contraseña" 
                  value={formData.password || ''}
                  onChange={(e) => updateForm('password', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none placeholder:font-normal placeholder:text-sm"
                />
                <button 
                  onClick={handleEmailRegistration}
                  disabled={isAuthenticating || !formData.name || !formData.email || !formData.password}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl cursor-pointer shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating ? 'Registrando...' : 'Crear Cuenta y Continuar'}
                </button>
              </div>
              
              <button onClick={() => setStep(5)} className="w-full text-center text-sm font-bold text-gray-400 hover:text-gray-600 mt-6">(Simular Login Exitoso para demo)</button>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-start">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 font-bold">Atrás</button>
              </div>
            </div>
          )}

          {/* STEP 5: Pasarela de Pagos (Simulada) */}
          {step === 5 && (
            <div className="p-8 sm:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black font-heading text-gray-900 mb-2">Pago de Activación</h2>
                <p className="text-gray-500 font-medium">Estás a un paso de publicar tu rifa.</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8 text-center">
                <p className="text-gray-500 font-bold mb-1">Total a Pagar</p>
                <p className="text-4xl font-black text-gray-900">{formatMoney(platformFee)}</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-start gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => handlePayment('mercadopago')} 
                  disabled={isSubmitting}
                  className="w-full bg-[#009ee3] hover:bg-[#0089c4] text-white px-8 py-4 rounded-xl font-bold cursor-pointer shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                   {isSubmitting ? 'Procesando pago...' : (
                     <>
                       Pagar con
                       <Image src="/images/logo-mercado-pago.svg" alt="Mercado Pago" width={72} height={24} className="h-6 w-auto" />
                     </>
                   )}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
                <Image src="/images/logo-visa.svg" alt="Visa" width={48} height={24} className="h-6 w-auto" />
                <Image src="/images/Mastercard-logo.svg" alt="Mastercard" width={48} height={28} className="h-7 w-auto" />
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
                 <p className="text-xs text-gray-400">Pagos 100% seguros y encriptados.</p>
              </div>
            </div>
          )}

          {/* STEP 6: Éxito */}
          {step === 6 && (
            <div className="p-8 sm:p-12 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-black font-heading text-gray-900 mb-4">¡Rifa Creada con Éxito!</h2>
              <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">El pago ha sido procesado. Tu plataforma ya está activa y lista para recibir a tus compradores.</p>
              
              <Link href="/dashboard" className="inline-block w-full bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all transform hover:-translate-y-1">
                Ir a mi Dashboard de Control
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
