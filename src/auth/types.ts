export type Role = 'admin' | 'student'

export type ProfileStatus = 'pending' | 'approved' | 'rejected'

export type Profile = {
  id: string
  full_name: string
  email: string
  role: Role
  status: ProfileStatus
  phone: string | null
  created_at: string
}

export function getPostLoginPath(profile: Profile): string {
  return profile.role === 'admin' ? '/admin' : '/dashboard'
}

export function isApprovedAdmin(profile: Profile | null): boolean {
  return profile?.role === 'admin' && profile.status === 'approved'
}

export function isApprovedStudent(profile: Profile | null): boolean {
  return profile?.role === 'student' && profile.status === 'approved'
}
