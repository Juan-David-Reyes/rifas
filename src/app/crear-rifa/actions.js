'use server'

import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createRaffle(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No estás autenticado. Por favor inicia sesión o regístrate en el paso anterior.' }
  }

  // Generate a random slug based on title if no slug was provided in formData
  let baseSlug = formData.title.toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!baseSlug) baseSlug = 'rifa-' + Math.floor(Math.random() * 1000)
  
  // Append a small random string to avoid collisions
  const slug = baseSlug + '-' + Math.random().toString(36).substring(2, 6)

  const raffleData = {
    user_id: user.id,
    title: formData.title,
    slug: slug,
    description: formData.title, // En el nuevo wizard no pedimos description, usamos el título
    prize: formData.prizeType === 'object' ? formData.prizeDescription : (formData.prizeValue ? formData.prizeValue.toString() : ''),
    lottery_name: 'Por definir', // El wizard no pide lotería, podemos poner default
    draw_date: 'Por definir', 
    ticket_price: parseInt(formData.ticketPrice),
    total_tickets: parseInt(formData.ticketCount),
    payment_method_name: 'Múltiples métodos', // Fallback
    payment_account_number: JSON.stringify(formData.paymentMethods || [])
  }

  // Insert the raffle
  const { data: raffle, error: raffleError } = await supabase
    .from('raffles')
    .insert(raffleData)
    .select()
    .single()

  if (raffleError) {
    if (raffleError.code === '23505') { // Unique violation
      return { error: 'Ese enlace ya está en uso. Por favor intenta de nuevo.' }
    }
    return { error: 'Error al crear la rifa: ' + raffleError.message }
  }

  // Insert tickets for this raffle
  const ticketsToInsert = Array.from({ length: raffle.total_tickets }, (_, i) => ({
    raffle_id: raffle.id,
    ticket_number: i + 1, // Start at 1 for visual
    status: 'disponible'
  }))

  const { error: ticketsError } = await supabase
    .from('tickets')
    .insert(ticketsToInsert)

  if (ticketsError) {
    return { error: 'Error al generar los números: ' + ticketsError.message }
  }

  return { success: true, raffleId: raffle.id }
}
