'use server'

import { createAdminClient } from './supabase/admin'
import { revalidatePath } from 'next/cache'

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
  return true
}

export async function getAllUsersData() {
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
}

