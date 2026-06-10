import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockRpc = vi.fn()
const mockSignInWithPassword = vi.fn()

vi.mock('./supabase', () => ({
  supabase: {
    rpc: (...args: unknown[]) => mockRpc(...args),
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
    },
  },
}))

import {
  SIGN_IN_INVALID_PASSWORD,
  SIGN_IN_USER_NOT_FOUND,
  signInWithPreciseErrors,
} from './signIn'

describe('signInWithPreciseErrors', () => {
  beforeEach(() => {
    mockRpc.mockReset()
    mockSignInWithPassword.mockReset()
  })

  it('reports when the user does not exist', async () => {
    mockRpc.mockResolvedValue({ data: false, error: null })

    await expect(
      signInWithPreciseErrors('missing@example.com', 'secret'),
    ).rejects.toThrow(SIGN_IN_USER_NOT_FOUND)

    expect(mockSignInWithPassword).not.toHaveBeenCalled()
  })

  it('reports invalid password when the user exists', async () => {
    mockRpc.mockResolvedValue({ data: true, error: null })
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    })

    await expect(
      signInWithPreciseErrors('student@example.com', 'wrong'),
    ).rejects.toThrow(SIGN_IN_INVALID_PASSWORD)
  })

  it('signs in successfully when credentials are valid', async () => {
    mockRpc.mockResolvedValue({ data: true, error: null })
    mockSignInWithPassword.mockResolvedValue({ error: null })

    await expect(
      signInWithPreciseErrors('admin', 'abcdefg'),
    ).resolves.toBeUndefined()

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'admin@themusicembassy.com',
      password: 'abcdefg',
    })
  })

  it('maps admin username before sign-in', async () => {
    mockRpc.mockResolvedValue({ data: false, error: null })

    await expect(signInWithPreciseErrors('admin', 'x')).rejects.toThrow(
      SIGN_IN_USER_NOT_FOUND,
    )

    expect(mockRpc).toHaveBeenCalledWith('profile_exists_for_login', {
      login_identifier: 'admin',
    })
  })
})
