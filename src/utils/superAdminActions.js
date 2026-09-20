'use server'

import { createAdminClient } from './supabase/admin'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'

export async function toggleRaffleStatus(raffleId, newStatus) {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) throw new Error("Service key missing")

  const { error } = await supabaseAdmin
    .from('raffles')
    .update({ status: newStatus })
    .eq('id', raffleId)

  if (error) {
    console.error("Error updating raffle status:", error)
    throw new Error('No se pudo actualizar el estado de la rifa')
  }

  revalidatePath('/admin')
  revalidateTag('admin-users')
  revalidateTag('admin-dashboard')
  return true
}

export async function deleteRaffleAction(raffleId) {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) throw new Error("Service key missing")

  // Borrar tickets asociados primero (si no hay borrado en cascada configurado en Supabase)
  const { error: ticketsError } = await supabaseAdmin
    .from('tickets')
    .delete()
    .eq('raffle_id', raffleId)

  if (ticketsError) {
    console.error("Error deleting tickets:", ticketsError)
    throw new Error('No se pudieron borrar los tickets de la rifa')
  }

  // Borrar la rifa
  const { error: raffleError } = await supabaseAdmin
    .from('raffles')
    .delete()
    .eq('id', raffleId)

  if (raffleError) {
    console.error("Error deleting raffle:", raffleError)
    throw new Error('No se pudo eliminar la rifa')
  }

  revalidatePath('/admin')
  revalidateTag('admin-users')
  revalidateTag('admin-dashboard')
  return true
}

export async function banUserAction(userId, isBanning) {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) throw new Error("Service key missing")

  // Si isBanning es true, baneamos por 100 años (876600h). Si es false, quitamos el baneo ("none")
  const banDuration = isBanning ? '876600h' : 'none'

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { 
    ban_duration: banDuration 
  })

  if (error) {
    console.error("Error banning user:", error)
    throw new Error('No se pudo actualizar el baneo del usuario')
  }

  // Si estamos baneando, pausamos preventivamente todas sus rifas
  if (isBanning) {
    await supabaseAdmin
      .from('raffles')
      .update({ status: 'PAUSED' })
      .eq('user_id', userId)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/usuarios')
  revalidateTag('admin-users')
  revalidateTag('admin-dashboard')
  return true
}

export async function deleteUserAction(userId) {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) throw new Error("Service key missing")

  // 1. Borrar todas las rifas asociadas al usuario. 
  // Al borrarlas, los tickets vinculados se borrarán en cascada gracias a ON DELETE CASCADE en la BD.
  const { error: rafflesError } = await supabaseAdmin
    .from('raffles')
    .delete()
    .eq('user_id', userId)

  if (rafflesError) {
    console.error("Error deleting user's raffles:", rafflesError)
    throw new Error('No se pudieron eliminar las rifas del usuario')
  }

  // 2. Borrar el usuario de Supabase Auth
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (authError) {
    console.error("Error deleting auth user:", authError)
    throw new Error('No se pudo eliminar al usuario del sistema')
  }

  revalidatePath('/admin')
  revalidatePath('/admin/usuarios')
  revalidateTag('admin-users')
  revalidateTag('admin-dashboard')
  return true
}

// Envuelto en unstable_cache para alto rendimiento
const getCachedUsersData = unstable_cache(
  async () => {
    const supabaseAdmin = createAdminClient()
    if (!supabaseAdmin) throw new Error("Service key missing")

    // 1. Obtener todos los usuarios de Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error("Error fetching auth users:", authError)
      throw new Error('No se pudieron obtener los usuarios')
    }

    const authUsers = authData.users || []

    // 2. Obtener las rifas y agrupar por usuario
    const { data: raffles, error: rafflesError } = await supabaseAdmin
      .from('raffles')
      .select('id, title, status, created_at, ticket_price, user_id')

    if (rafflesError) {
      console.error("Error fetching raffles for users:", rafflesError)
      throw new Error('No se pudieron obtener las rifas')
    }

    const userRaffles = {}
    raffles.forEach(r => {
      if (!userRaffles[r.user_id]) userRaffles[r.user_id] = []
      userRaffles[r.user_id].push(r)
    })

    // 3. Combinar datos
    const usersWithData = authUsers.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      is_banned: !!u.banned_until,
      raffle_count: userRaffles[u.id]?.length || 0,
      raffles: userRaffles[u.id] || []
    }))

    // Ordenar por cantidad de rifas (descendente)
    return usersWithData.sort((a, b) => b.raffle_count - a.raffle_count)
  },
  ['all-users-data'], // key cache
  { tags: ['admin-users'], revalidate: 300 } // TTL 5 min o revalidación por tag
)

export async function getAllUsersData() {
  return await getCachedUsersData()
}

// Caché para las métricas globales del dashboard (se revalida cada 5 min o bajo demanda)
export const getAdminDashboardStats = unstable_cache(
  async () => {
    const supabaseAdmin = createAdminClient()
    if (!supabaseAdmin) throw new Error("Service key missing")

    // 1. Total usuarios
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
    const totalUsers = usersData?.users?.length || 0

    // 2. Total rifas
    const { count: totalRaffles } = await supabaseAdmin
      .from('raffles')
      .select('*', { count: 'exact', head: true })

    // 3. Actividad reciente (últimas 5)
    const { data: recentRaffles } = await supabaseAdmin
      .from('raffles')
      .select('id, title, created_at, user_id, ticket_price, status')
      .order('created_at', { ascending: false })
      .limit(5)

    return { totalUsers, totalRaffles, recentRaffles: recentRaffles || [], usersData: usersData?.users || [] }
  },
  ['admin-dashboard-stats'],
  { tags: ['admin-dashboard'], revalidate: 300 }
)

