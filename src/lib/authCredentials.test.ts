import { describe, expect, it } from 'vitest'
import { ADMIN_EMAIL, resolveLoginEmail } from './authCredentials'

describe('resolveLoginEmail', () => {
  it('maps admin username to admin email', () => {
    expect(resolveLoginEmail('admin')).toBe(ADMIN_EMAIL)
    expect(resolveLoginEmail(' Admin ')).toBe(ADMIN_EMAIL)
  })

  it('returns trimmed lowercase email for regular accounts', () => {
    expect(resolveLoginEmail('  Student@Example.com  ')).toBe('student@example.com')
  })
})
