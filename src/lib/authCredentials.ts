/** Canonical email for the default staff admin account */
export const ADMIN_EMAIL = 'admin@themusicembassy.com'

/** Map sign-in identifier (email or short username) to a Supabase email */
export function resolveLoginEmail(identifier: string): string {
  const trimmed = identifier.trim()
  if (trimmed.toLowerCase() === 'admin') {
    return ADMIN_EMAIL
  }
  return trimmed
}
