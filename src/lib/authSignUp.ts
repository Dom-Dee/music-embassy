import type { User } from '@supabase/supabase-js'
import { normalizeAuthEmail } from './authCredentials'
import { supabase } from './supabase'

export type SignUpOutcome =
  | { kind: 'signed_in'; user: User }
  | { kind: 'confirm_email' }
  | { kind: 'existing_email' }

export async function registerAccount(
  fullName: string,
  email: string,
  password: string,
): Promise<SignUpOutcome> {
  const normalizedEmail = normalizeAuthEmail(email)

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { full_name: fullName.trim() },
      emailRedirectTo: `${window.location.origin}/sign-in`,
    },
  })

  if (error) throw new Error(error.message)

  if (data.user?.identities?.length === 0) {
    return { kind: 'existing_email' }
  }

  if (data.session && data.user) {
    return { kind: 'signed_in', user: data.user }
  }

  if (data.user) {
    return { kind: 'confirm_email' }
  }

  throw new Error('Sign up failed. Please try again.')
}
