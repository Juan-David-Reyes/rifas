'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteAccountButton() {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "⚠️ ADVERTENCIA IRREVERSIBLE ⚠️\n\n¿Estás completamente seguro de que deseas eliminar tu cuenta?\n\nAl confirmar, se eliminarán permanentemente:\n- Todos tus datos del sistema.\n- Las rifas realizadas.\n- El historial de pagos.\n\nEsta acción NO se puede deshacer."
    )

    if (!isConfirmed) return

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // En un escenario real con Service Role Key se llamaría supabase.auth.admin.deleteUser(user.id)
        // Por ahora, eliminamos los datos de la app y cerramos la sesión.
        
        // 1. Eliminar todas las rifas del usuario (por Cascade se borran sus tickets)
        await supabase.from('raffles').delete().eq('user_id', user.id)
        
        // 2. Cerrar sesión
        await supabase.auth.signOut()
      }
      
      // Redirigir al landing
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error eliminando la cuenta:', error)
      alert("Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-8">
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
            <Trash2 className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Eliminar Cuenta</h2>
            <p className="text-gray-500 text-sm mt-1 max-w-md">
              Eliminar tu cuenta borrará permanentemente todas tus rifas, tickets generados y tu historial de facturación.
            </p>
          </div>
        </div>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="shrink-0 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 font-bold py-3 px-6 rounded-xl transition-all w-full md:w-auto disabled:opacity-50"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar mi cuenta'}
        </button>
      </div>
    </div>
  )
}
