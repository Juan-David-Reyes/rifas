'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, ShieldAlert, ShieldCheck, Mail, Calendar, Hash, MoreVertical } from 'lucide-react'
import { banUserAction } from '../../../utils/superAdminActions'

export default function UsuariosClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingAction, setLoadingAction] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message, visible: false })
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: true } : null)
    }, 50)
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null)
      setTimeout(() => setToast(null), 300)
    }, 4700)
  }

  const handleToggleBan = async (userId, currentIsBanned, email) => {
    // Confirmación nativa simple
    const accion = currentIsBanned ? 'reactivar' : 'suspender'
    if (!window.confirm(`¿Estás seguro de que deseas ${accion} al usuario ${email}?`)) {
      return
    }

    setLoadingAction(userId)
    try {
      await banUserAction(userId, !currentIsBanned)
      
      // Actualizar estado local
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_banned: !currentIsBanned } : u
      ))
      
      showToast('success', `Usuario ${accion}do exitosamente.`)
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setLoadingAction(null)
    }
  }

  // Filtrado
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center">
        <Search className="w-5 h-5 text-gray-400 ml-2 mr-3" />
        <input 
          type="text"
          placeholder="Buscar por correo electrónico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-medium outline-none"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> Organizador</div>
                </th>
                <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Registro</div>
                </th>
                <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Hash className="w-4 h-4" /> Rifas</div>
                </th>
                <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {user.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {format(new Date(user.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-black">
                        {user.raffle_count}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_banned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                          <ShieldAlert className="w-3.5 h-3.5" /> Suspendido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          <ShieldCheck className="w-3.5 h-3.5" /> Activo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleBan(user.id, user.is_banned, user.email)}
                        disabled={loadingAction === user.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-50 ${
                          user.is_banned 
                            ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                        }`}
                      >
                        {loadingAction === user.id ? (
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : user.is_banned ? (
                          'Reactivar'
                        ) : (
                          'Suspender'
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform z-50 ${
          toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        } ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
        }`}>
          {toast.type === 'success' && <ShieldCheck className="w-5 h-5 text-green-400" />}
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
