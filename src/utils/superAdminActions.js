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
  return true
}
