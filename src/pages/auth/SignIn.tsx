import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import type { Profile } from '../../auth/types'
import { AuthActionTray } from '../../components/auth/AuthActionTray'
import { AuthAlert } from '../../components/auth/AuthAlert'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { images } from '../../data/images'
import { resolveLoginPath } from '../../lib/authRouting'
import { supabase } from '../../lib/supabase'

const panelImages = [images.piano, images.guitar, images.drums, images.singer]
const heroImage = panelImages[Math.floor(Math.random() * panelImages.length)]

export function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Sign in failed. Please try again.')
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        throw new Error('Could not load your profile. Please contact support.')
      }

      const path = await resolveLoginPath(profile as Profile, from)
      navigate(path, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-wood-surface liquid-panel w-full max-w-4xl overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card-hover)]"
    >
      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        <div className="relative hidden overflow-hidden bg-surface lg:block">
          <motion.img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
            fetchPriority="high"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-page via-page/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-page/25" />
          <div className="absolute bottom-10 left-8 right-8">
            <p className="font-display text-2xl leading-snug text-fg">
              Welcome back to Music Embassy
            </p>
            <p className="mt-2 text-sm text-muted">
              Your lessons, community, and creative path await.
            </p>
            <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold/70 to-transparent" />
          </div>
        </div>

        <div className="bg-glass px-8 py-10 backdrop-blur-xl md:px-10 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">
            Welcome back
          </p>
          <h1 className="mt-3 font-display text-3xl text-fg">Sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Use the email and password from your enrolment.
          </p>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-5">
            {error ? <AuthAlert message={error} /> : null}

            <FormField
              label="Email or username"
              id="email"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <FormField
              label="Password"
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <AuthActionTray className="mt-1">
              <Button
                type="submit"
                className="w-full !py-3.5"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </AuthActionTray>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            New to Music Embassy?{' '}
            <Link
              to="/sign-up"
              className="text-gold transition-colors hover:text-fg"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
