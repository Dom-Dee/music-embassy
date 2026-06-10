import { supabase } from './supabase'
import type { Profile } from '../auth/types'

export async function requireSessionUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('You must be signed in.')
  }

  return user.id
}

export async function requireOwnStudentId(studentId: string): Promise<string> {
  const userId = await requireSessionUserId()
  if (userId !== studentId) {
    throw new Error('Access denied.')
  }
  return userId
}

export async function requireAdminProfile(): Promise<Profile> {
  const userId = await requireSessionUserId()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) {
    throw new Error('Could not verify admin access.')
  }

  const profile = data as Profile
  if (profile.role !== 'admin' || profile.status !== 'approved') {
    throw new Error('Admin access required.')
  }

  return profile
}
