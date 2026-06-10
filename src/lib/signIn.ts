import { resolveLoginEmail } from './authCredentials'
import { supabase } from './supabase'

export const SIGN_IN_USER_NOT_FOUND =
  'User does not exist. Create an account.'
export const SIGN_IN_INVALID_PASSWORD = 'Invalid password.'

function isInvalidCredentialsError(message: string): boolean {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('invalid login credentials') ||
    normalized.includes('invalid_credentials')
  )
}

async function profileExistsForLogin(
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

export async function signInWithPreciseErrors(
  identifier: string,
  password: string,
): Promise<void> {
  const email = resolveLoginEmail(identifier)
  const exists = await profileExistsForLogin(identifier)

  if (exists === false) {
    throw new Error(SIGN_IN_USER_NOT_FOUND)
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (isInvalidCredentialsError(error.message)) {
      throw new Error(
        exists === true ? SIGN_IN_INVALID_PASSWORD : error.message,
      )
    }
    throw new Error(error.message)
  }
}
