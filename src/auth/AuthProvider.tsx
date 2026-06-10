import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
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
          setLoading(false)
        })
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(
    async (fullName: string, email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw new Error(error.message)
    },
    [],
  )

  const signIn = useCallback(async (identifier: string, password: string) => {
    await signInWithPreciseErrors(identifier, password)
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
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
