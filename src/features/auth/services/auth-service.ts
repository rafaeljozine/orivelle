import { supabase } from '../../../lib/supabase/client'

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('A autenticação ainda não está configurada.')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signUp(name: string, email: string, password: string) {
  if (!supabase) throw new Error('A autenticação ainda não está configurada.')
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/entrar` },
  })
  if (error) throw error
}

export async function requestPasswordReset(email: string) {
  if (!supabase) throw new Error('A autenticação ainda não está configurada.')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/entrar?recuperacao=concluida`,
  })
  if (error) throw error
}

export async function signOut() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function updatePassword(password: string) {
  if (!supabase) throw new Error('A autenticação ainda não está configurada.')
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}