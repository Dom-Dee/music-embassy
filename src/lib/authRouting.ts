import type { Profile } from '../auth/types'
import { getPostLoginPath } from '../auth/types'
import { supabase } from './supabase'

export async function resolveLoginPath(
  profile: Profile,
  fallbackFrom?: string | null,
): Promise<string> {
  const skipResolve = new Set([
    '/sign-in',
    '/sign-up',
    '/dashboard',
    '/choose-instruments',
  ])
  if (fallbackFrom && !skipResolve.has(fallbackFrom)) {
    return fallbackFrom
  }

  const base = getPostLoginPath(profile)

  if (base !== '/dashboard') {
    return base
  }

  const { count, error } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', profile.id)
    .eq('status', 'active')

  if (error) {
    console.error('Enrollment check failed:', error.message)
    return '/choose-instruments'
  }

  if ((count ?? 0) === 0) {
    return '/choose-instruments'
  }

  return '/dashboard'
}
