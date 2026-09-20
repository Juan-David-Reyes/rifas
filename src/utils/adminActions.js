'use server'

import { createAdminClient } from './supabase/admin'
import { createClient } from './supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function approvePaymentAction(ticketIds) {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) throw new Error("Service key missing")

  const { error } = await supabaseAdmin
    .from('tickets')
    .update({ status: 'comprado' })
    .in('id', ticketIds)

  if (error) throw error
  return true
}

export async function rejectPaymentAction(ticketIds, auditMeta) {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) throw new Error("Service key missing")

  // Log the action first for security
  if (auditMeta) {
    const { raffleId, organizerId, buyerName, actionType, reason, ticketCount } = auditMeta;
    try {
      await supabaseAdmin.from('audit_logs').insert([{
        raffle_id: raffleId,
        organizer_id: organizerId,
        buyer_name: buyerName,
        action_type: actionType,
        reason: reason,
        ticket_count: ticketCount
      }]);
    } catch (logError) {
      console.error("No se pudo guardar el log de auditoría:", logError);
      // We log it but continue the reject action so the user experience isn't broken
      // in case they haven't created the table yet.
    }
  }

  const { error } = await supabaseAdmin
    .from('tickets')
    .update({ 
      status: 'disponible', 
      reserved_at: null, 
      buyer_name: null,
      receipt_url: null
    })
    .in('id', ticketIds)

  if (error) throw error
  return true
}

export async function toggleMyRaffleStatusAction(raffleId, newStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("No estás autenticado")

  // Verificar que el usuario es el dueño de la rifa
  const { data: raffle, error: checkError } = await supabase
    .from('raffles')
    .select('user_id')
    .eq('id', raffleId)
    .single()

  if (checkError || !raffle) throw new Error("Rifa no encontrada")
  if (raffle.user_id !== user.id) throw new Error("No tienes permisos para modificar esta rifa")

  const { error } = await supabase
    .from('raffles')
    .update({ status: newStatus })
    .eq('id', raffleId)

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/${raffleId}`)
  revalidateTag('admin-dashboard')
  return true
}
