'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, ShieldAlert, ShieldCheck, Mail, Calendar, Hash, Ticket, ChevronLeft, ChevronRight, Trash2, ExternalLink, MoreVertical } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { banUserAction, deleteUserAction } from '../../../utils/superAdminActions'

export default function UsuariosClient({ users, totalPages, totalUsers, initialPage, initialSearch }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [localUsers, setLocalUsers] = React.useState(users || [])
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')
  
  // Sincronizar estado local cuando llegan nuevos props del servidor
  React.useEffect(() => {
    setLocalUsers(users || [])
  }, [users])
  const [loadingAction, setLoadingAction] = useState(null)
  const [toast, setToast] = useState(null)
  const [expandedUser, setExpandedUser] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)



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
      
      // Actualizar estado local optimistamente
      setLocalUsers(localUsers.map(u => 
        u.id === userId ? { ...u, is_banned: !currentIsBanned } : u
      ))
      
      showToast('success', `Usuario ${accion}do exitosamente.`)
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`⚠️ ADVERTENCIA DESTRUCTIVA ⚠️\n\n¿Estás absolutamente seguro de que deseas ELIMINAR al usuario ${email}?\n\nEsta acción borrará al usuario, TODAS sus rifas y TODOS los tickets asociados. Esta acción NO se puede deshacer.`)) {
      return
    }

    setLoadingAction(`delete-${userId}`)
    try {
      await deleteUserAction(userId)
      
      // Eliminar el usuario del estado local
      setLocalUsers(localUsers.filter(u => u.id !== userId))
      if (expandedUser === userId) setExpandedUser(null)
      
      showToast('success', 'Usuario y todos sus datos eliminados correctamente.')
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setLoadingAction(null)
    }
  }

  // Timer para debounce
  const searchTimeout = React.useRef(null)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (value) params.set('search', value)
      params.set('page', '1') // Al buscar, siempre volver a la pag 1
      router.replace(`${pathname}?${params.toString()}`)
    }, 500)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    params.set('page', newPage.toString())
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white p-4 rounded-[32px] border border-gray-200 flex items-center">
        <Search className="w-5 h-5 text-gray-400 ml-2 mr-3" />
        <input 
          type="text"
          placeholder="Buscar por correo electrónico..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-medium outline-none"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden">
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
              {localUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                localUsers.map((user) => (
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
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === user.id ? null : user.id)
                          }}
                          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-900"
                          title="Opciones"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {openMenuId === user.id && (
                          <div 
                            className="absolute right-8 top-12 mt-1 w-48 bg-white rounded-[16px] border border-gray-200 shadow-xl z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-1.5 flex flex-col">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  handleToggleBan(user.id, user.is_banned, user.email);
                                }}
                                disabled={loadingAction === user.id || loadingAction === `delete-${user.id}`}
                                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3 disabled:opacity-50"
                              >
                                {loadingAction === user.id ? (
                                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                ) : user.is_banned ? (
                                  <>
                                    <ShieldCheck className="w-4 h-4 text-gray-500" />
                                    <span>Reactivar</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldAlert className="w-4 h-4 text-gray-500" />
                                    <span>Suspender</span>
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                  handleDeleteUser(user.id, user.email);
                                }}
                                disabled={loadingAction === user.id || loadingAction === `delete-${user.id}`}
                                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3 disabled:opacity-50 mt-0.5"
                              >
                                {loadingAction === `delete-${user.id}` ? (
                                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <>
                                    <Trash2 className="w-4 h-4 text-gray-500" />
                                    <span>Eliminar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
                                <div key={raffle.id} className="bg-white p-4 rounded-3xl border border-gray-200 flex items-center justify-between">
                                    <div>
                                      <a href={`/${raffle.slug || raffle.id}`} target="_blank" rel="noopener noreferrer" className="font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1.5 transition-colors">
                                        {raffle.title}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
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
                            <div className="text-center py-4 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-500 text-sm">
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
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              Mostrando página <span className="font-bold text-gray-900">{initialPage}</span> de <span className="font-bold text-gray-900">{totalPages}</span> ({totalUsers} usuarios en total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(initialPage - 1, 1))}
                disabled={initialPage === 1}
                className="p-2 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-sm font-bold text-gray-700 px-2">
                Página {initialPage} de {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(initialPage + 1, totalPages))}
                disabled={initialPage === totalPages}
                className="p-2 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform z-50 ${
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
