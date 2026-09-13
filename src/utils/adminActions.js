'use server'

import { createAdminClient } from './supabase/admin'

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
