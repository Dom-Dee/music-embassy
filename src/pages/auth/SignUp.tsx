import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { resolveLoginPath } from '../../lib/authRouting'
import { AuthActionTray } from '../../components/auth/AuthActionTray'
import { AuthAlert } from '../../components/auth/AuthAlert'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { GlassCard } from '../../components/ui/GlassCard'
import { supabase } from '../../lib/supabase'

export function SignUp() {
  const { refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })

      if (signUpError) throw signUpError

      if (data.session && data.user) {
        await refreshProfile()

        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (p) {
          const path = await resolveLoginPath(p)
          navigate(path, { replace: true })
          return
        }
      }

      setSuccess('Account created! Check your email to confirm, then sign in.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg"
    >
      <GlassCard className="!p-8 md:!p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">
          Join the embassy
        </p>
        <h1 className="mt-3 font-display text-3xl text-fg">Create account</h1>
        <p className="mt-2 text-sm text-muted">
          Create your account and you'll choose your instruments on the next step.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-6">
          {error ? <AuthAlert message={error} /> : null}
          {success ? <AuthAlert message={success} variant="success" /> : null}

          <FormField
            label="Full name"
            id="full_name"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <FormField
            label="Password"
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />

          <AuthActionTray className="mt-1">
            <Button
              type="submit"
              className="w-full !py-3.5"
              disabled={loading || !!success}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </AuthActionTray>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-gold transition-colors hover:text-fg">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </motion.div>
  )
}
