import { describe, expect, it } from 'vitest'
import {
  getPostLoginPath,
  isApprovedAdmin,
  isApprovedStudent,
  type Profile,
} from './types'

const student: Profile = {
  id: '1',
  full_name: 'Student',
  email: 's@test.com',
  role: 'student',
  status: 'approved',
  phone: null,
  created_at: '2026-01-01',
}

const admin: Profile = {
  ...student,
  id: '2',
  role: 'admin',
  email: 'admin@test.com',
}

describe('auth types', () => {
  it('routes admins and students after login', () => {
    expect(getPostLoginPath(admin)).toBe('/admin')
    expect(getPostLoginPath(student)).toBe('/dashboard')
  })

  it('identifies approved roles', () => {
    expect(isApprovedAdmin(admin)).toBe(true)
    expect(isApprovedAdmin(student)).toBe(false)
    expect(isApprovedStudent(student)).toBe(true)
    expect(isApprovedStudent(null)).toBe(false)
  })

  it('rejects pending or rejected accounts', () => {
    expect(isApprovedStudent({ ...student, status: 'pending' })).toBe(false)
    expect(isApprovedAdmin({ ...admin, status: 'rejected' })).toBe(false)
  })
})
