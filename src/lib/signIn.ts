import { resolveLoginEmail } from './authCredentials'
import { supabase } from './supabase'

export const SIGN_IN_USER_NOT_FOUND =
  'User does not exist. Create an account.'
export const SIGN_IN_INVALID_PASSWORD = 'Invalid password.'
export const SIGN_IN_EMAIL_NOT_CONFIRMED =
  'Please confirm your email before signing in. Check your inbox for the confirmation link.'

function isInvalidCredentialsError(message: string): boolean {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('invalid login credentials') ||
    normalized.includes('invalid_credentials')
  )
}

function isEmailNotConfirmedError(message: string): boolean {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('email not confirmed') ||
    normalized.includes('email_not_confirmed')
  )
}

async function accountExistsForLogin(
  identifier: string,
): Promise<boolean | null> {
  const { data, error } = await supabase.rpc('profile_exists_for_login', {
    login_identifier: identifier.trim(),
  })

  if (error) {
    console.error('profile_exists_for_login:', error.message)
    return null
  }

  return Boolean(data)
}

function mapSignInError(message: string, exists: boolean | null): string {
  if (isEmailNotConfirmedError(message)) {
    return SIGN_IN_EMAIL_NOT_CONFIRMED
  }

  if (isInvalidCredentialsError(message)) {
    return exists === true ? SIGN_IN_INVALID_PASSWORD : message
  }

  return message
}

export async function signInWithPreciseErrors(
  identifier: string,
  password: string,
): Promise<void> {
  const email = resolveLoginEmail(identifier)
  const exists = await accountExistsForLogin(identifier)

  if (exists === false) {
    throw new Error(SIGN_IN_USER_NOT_FOUND)
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw new Error(mapSignInError(error.message, exists))
  }
}
