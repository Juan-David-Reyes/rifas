'use server'

import { createAdminClient } from './supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateSiteSettings(settingsData) {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) throw new Error("Service key missing")

  const { error } = await supabaseAdmin
    .from('site_settings')
    .update({ 
      ...settingsData,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'global')

  if (error) {
    console.error("Error updating site settings:", error)
    throw new Error('No se pudo guardar la configuración. ' + error.message)
  }

  // Revalidar las rutas afectadas para que el nuevo SEO y textos apliquen inmediatamente
  revalidatePath('/')
  revalidatePath('/layout') // Aunque el layout global se revalida al limpiar el cache completo
  revalidatePath('/admin/seo')

  return true
}

export async function getSiteSettings() {
  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) return null

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .eq('id', 'global')
    .single()

  if (error && error.code !== 'PGRST116') { // Ignorar error de no encontrado
    console.error("Error fetching site settings:", error)
  }

  return data
}
