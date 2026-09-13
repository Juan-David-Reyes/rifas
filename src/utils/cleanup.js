import { createAdminClient } from './supabase/admin';

export async function cleanExpiredTickets(raffleId) {
  try {
    const supabaseAdmin = createAdminClient();
    if (!supabaseAdmin) return; // Si no hay service key, omitir (no podemos forzar limpiar)

    // Calculamos el timestamp de hace 15 minutos en UTC/ISO
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60000).toISOString();

    // Actualizamos los tickets que llevan más de 15 min en estado "reservado"
    const { error } = await supabaseAdmin
      .from('tickets')
      .update({ 
        status: 'disponible', 
        reserved_at: null, 
        buyer_name: null 
      })
      .eq('raffle_id', raffleId)
      .eq('status', 'reservado')
      .lt('reserved_at', fifteenMinsAgo);

    if (error) {
      console.error('Error en JIT Cleanup de tickets expirados:', error.message);
    }
  } catch (err) {
    console.error('Error inesperado en JIT Cleanup:', err);
  }
}
