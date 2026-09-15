'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, ShieldAlert, ShieldCheck, Mail, Calendar, Hash, MoreVertical, Ticket } from 'lucide-react'
import { banUserAction } from '../../../utils/superAdminActions'

export default function UsuariosClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingAction, setLoadingAction] = useState(null)
  const [toast, setToast] = useState(null)
  const [expandedUser, setExpandedUser] = useState(null)

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
                  <React.Fragment key={user.id}>
                  <tr className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedUser === user.id ? 'bg-gray-50' : ''}`} onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {user.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {format(new Date(user.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 h-8 rounded-full bg-primary-100 text-primary-700 font-black gap-2">
                        {user.raffle_count} <span className="text-[10px] uppercase font-bold text-primary-500">Ver</span>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBan(user.id, user.is_banned, user.email)
                        }}
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
                  
                  {expandedUser === user.id && (
                    <tr className="bg-gray-50/50 border-b border-gray-200">
                      <td colSpan="5" className="p-0">
                        <div className="px-8 py-6 bg-gray-100/50 inner-shadow">
                          <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-gray-400" />
                            Rifas creadas por este usuario ({user.raffle_count})
                          </h4>
                          
                          {user.raffles && user.raffles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {user.raffles.map(raffle => (
                                <div key={raffle.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                  <div>
                                    <div className="font-bold text-gray-900">{raffle.title}</div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                                      <span>Creada: {format(new Date(raffle.created_at), "d MMM, yyyy", { locale: es })}</span>
                                      <span>Boleto: ${raffle.ticket_price}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center border ${
                                      raffle.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 
                                      raffle.status === 'PAUSED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                      'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                      {raffle.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                              Este usuario aún no ha creado ninguna rifa.
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
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
