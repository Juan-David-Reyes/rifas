import { getAllUsersData } from '../../../utils/superAdminActions'
import UsuariosClient from './UsuariosClient'

export const dynamic = 'force-dynamic'

export default async function UsuariosPage() {
  const users = await getAllUsersData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black font-heading text-gray-900">Usuarios y Clientes</h1>
        <p className="text-gray-500 mt-2">
          Gestiona los organizadores de rifas, revisa sus métricas y suspende cuentas sospechosas de fraude.
        </p>
      </div>

      <UsuariosClient initialUsers={users} />
    </div>
  )
}
