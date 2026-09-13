'use server'

import { createAdminClient } from './supabase/admin'

export async function uploadReceiptAction(formData) {
  const file = formData.get('file')
  
  if (!file) {
    throw new Error('No se ha proporcionado ningún archivo.')
  }

  const supabaseAdmin = createAdminClient()
  if (!supabaseAdmin) {
    throw new Error('Servidor no configurado correctamente (Service Key faltante).')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `public/${fileName}`

  // Upload to Supabase Storage using Admin Client (Bypasses RLS completely)
  const { data, error } = await supabaseAdmin.storage
    .from('receipts')
    .upload(filePath, file)

  if (error) {
    console.error("Storage upload error:", error)
    throw new Error('Error al subir el archivo a Storage.')
  }

  // Get the public URL
  const { data: urlData } = supabaseAdmin.storage
    .from('receipts')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}
