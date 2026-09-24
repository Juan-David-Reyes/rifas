import { getPaginatedUsersData } from '../../../utils/superAdminActions'
import { Users } from 'lucide-react'
import UsuariosClient from './UsuariosClient'

export const dynamic = 'force-dynamic'

export default async function UsuariosPage({ searchParams }) {
  // Manejo de parámetros de URL de forma asíncrona (Requerimiento de Next.js 15+)
  const params = await searchParams;
  const page = parseInt(params?.page || '1', 10);
  const search = params?.search || '';

  const { users, totalPages, totalUsers } = await getPaginatedUsersData(page, search);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="md:sticky md:top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-2xl font-black font-heading text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-500" />
            Usuarios y Clientes
          </h1>
          <p className="text-gray-500 text-[15px] font-normal">
            Gestiona los organizadores de rifas, revisa sus métricas y suspende cuentas sospechosas de fraude.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <UsuariosClient 
          users={users} 
          totalPages={totalPages} 
          totalUsers={totalUsers} 
          initialPage={page} 
          initialSearch={search} 
        />
      </div>
    </div>
  )
}
