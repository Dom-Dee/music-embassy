import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { registerAccount } from '../lib/authSignUp'
import { signInWithPreciseErrors } from '../lib/signIn'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authContext'
import type { Profile } from './types'

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Failed to fetch profile:', error.message)
    return null
  }

  return data as Profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const p = await fetchProfile(user.id)
    setProfile(p)
  }, [user])

  // Never await inside onAuthStateChange — that deadlocks signInWithPassword.
  useEffect(() => {
    let mounted = true

    void supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return
      setSession(initialSession)
      setUser(initialSession?.user ?? null)

      if (initialSession?.user) {
        void fetchProfile(initialSession.user.id).then((p) => {
          if (!mounted) return
          setProfile(p)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      const nextUser = nextSession?.user ?? null
      setUser(nextUser)
      if (nextUser) {
        void fetchProfile(nextUser.id).then((p) => {
          if (!mounted) return
          setProfile(p)
        })
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(
    async (fullName: string, email: string, password: string) => {
      const outcome = await registerAccount(fullName, email, password)

      if (outcome.kind === 'existing_email') {
        throw new Error('An account with this email already exists. Sign in instead.')
      }

      if (outcome.kind === 'confirm_email') {
        throw new Error(
          'Account created. Check your email to confirm your address, then sign in.',
        )
      }
    },
    [],
  )

  const signIn = useCallback(async (identifier: string, password: string) => {
    await signInWithPreciseErrors(identifier, password)
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut({ scope: 'global' })
    if (error) throw new Error(error.message)
    setSession(null)
    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
    }),
    [session, user, profile, loading, signUp, signIn, signOut, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
