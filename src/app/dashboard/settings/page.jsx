import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, Mail, Shield, AlertCircle, Receipt } from 'lucide-react'
import DeleteAccountButton from './DeleteAccountButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all user raffles to show in the billing history
  const { data: raffles } = await supabase
    .from('raffles')
    .select('id, title, created_at, ticket_price')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Cuenta</h1>
        <p className="text-gray-500 mt-1">Gestiona tu perfil, preferencias de seguridad y facturación.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tu Perfil</h2>
              <p className="text-gray-500 text-sm">Información de contacto.</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <User className="w-4 h-4 text-gray-400" /> Nombre Completo
              </label>
              <input 
                type="text" 
                disabled 
                value="Administrador" 
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-2xl outline-none cursor-not-allowed" 
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-gray-400" /> Correo Electrónico
              </label>
              <input 
                type="email" 
                disabled 
                value={user.email} 
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-2xl outline-none cursor-not-allowed font-medium" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Seguridad</h2>
              <p className="text-gray-500 text-sm">Protege el acceso a tu cuenta.</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-sm flex gap-3 items-start border border-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Has iniciado sesión con Google</p>
                <p>Tu contraseña y seguridad son gestionadas directamente por Google. Para mayor seguridad te recomendamos activar la verificación en dos pasos en tu cuenta de Google.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <Receipt className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Historial de Facturación</h2>
            <p className="text-gray-500 text-sm">Registro de los pagos realizados a la plataforma por activación de rifas.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">Concepto</th>
                <th className="px-6 py-4 font-bold text-gray-700">Fecha</th>
                <th className="px-6 py-4 font-bold text-gray-700">Método</th>
                <th className="px-6 py-4 font-bold text-gray-700">Total</th>
                <th className="px-6 py-4 font-bold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {raffles?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay pagos registrados aún.</td>
                </tr>
              ) : (
                raffles?.map(raffle => (
                  <tr key={raffle.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      Activación de rifa: <span className="text-gray-500 italic font-normal">{raffle.title}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {raffle.created_at ? new Date(raffle.created_at).toLocaleDateString('es-CO') : 'Reciente'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">MercadoPago</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${(raffle.ticket_price || 10000).toLocaleString('es-CO')}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">Pagado</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteAccountButton />
    </div>
  )
}
