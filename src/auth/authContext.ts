import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { Profile } from './types'

export type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (fullName: string, email: string, password: string) => Promise<void>
  signIn: (identifier: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
