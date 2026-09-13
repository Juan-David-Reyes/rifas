'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../utils/supabase/server'

export async function sendOtp(email) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true // Permitimos que nuevos usuarios se registren
    }
  })

  if (error) {
    return { error: 'No pudimos enviar el código. Verifica el correo e intenta de nuevo.' }
  }

  return { success: true }
}

export async function verifyOtpCode(email, code) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email'
  })

  if (error) {
    return { error: 'El código es incorrecto o ha expirado.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
