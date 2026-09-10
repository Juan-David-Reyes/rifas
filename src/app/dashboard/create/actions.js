'use server'

import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createRaffle(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No estás autenticado')
  }

  // Format slug (lowercase, no spaces, URL safe)
  let slug = formData.get('slug').toLowerCase().replace(/[^a-z0-9-]/g, '')
  
  const raffleData = {
    user_id: user.id,
    title: formData.get('title'),
    slug: slug,
    description: formData.get('description'),
    prize: formData.get('prize'),
    lottery_name: formData.get('lottery_name'),
    draw_date: formData.get('draw_date'),
    ticket_price: parseInt(formData.get('ticket_price')),
    total_tickets: 100 // default for now
  }

  // Insert the raffle
  const { data: raffle, error: raffleError } = await supabase
    .from('raffles')
    .insert(raffleData)
    .select()
    .single()

  if (raffleError) {
    if (raffleError.code === '23505') { // Unique violation
      return { error: 'Ese enlace ya está en uso. Por favor elige otro.' }
    }
    return { error: 'Error al crear la rifa: ' + raffleError.message }
  }

  // Insert 100 tickets for this raffle
  const ticketsToInsert = Array.from({ length: 100 }, (_, i) => ({
    raffle_id: raffle.id,
    ticket_number: i,
    status: 'disponible'
  }))

  const { error: ticketsError } = await supabase
    .from('tickets')
    .insert(ticketsToInsert)

  if (ticketsError) {
    return { error: 'Error al generar los números: ' + ticketsError.message }
  }

  redirect(`/dashboard/${raffle.id}`)
}
