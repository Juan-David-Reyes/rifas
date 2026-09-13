import { createClient } from '@supabase/supabase-js'

// Este cliente usa la Service Role Key para saltarse las reglas de seguridad (RLS)
// y acceder a los datos de todos los usuarios para el panel de administración.
// IMPORTANTE: NUNCA usar este cliente en el frontend, solo en Server Actions o Route Handlers.

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY no está definida en .env.local')
    // Creamos un cliente dummy o fallamos si se intenta usar sin la llave
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
