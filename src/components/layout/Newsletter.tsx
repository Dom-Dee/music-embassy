import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../ui/Button'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setEmail('')
    window.setTimeout(() => setSent(false), 3200)
  }

  return (
    <section className="relative overflow-hidden border-y border-border bg-surface/50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,var(--glow-ambient-2),transparent)]" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold/8 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">
            Stay in the loop
          </p>
          <h2 className="mt-4 font-display text-3xl text-fg md:text-4xl">
            Join the Music Embassy newsletter
          </h2>
          <p className="mt-3 text-muted">
            Curated performances, lesson insights, and community highlights:
            no noise, just signal.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full flex-1 rounded-full border border-border bg-glass px-5 text-sm text-fg placeholder:text-muted backdrop-blur-md transition-[border-color,box-shadow] duration-200 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            <Button type="submit" className="h-12 shrink-0 px-8">
              {sent ? 'Subscribed' : 'Subscribe'}
            </Button>
          </form>
          {sent ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-gold"
            >
              Thank you. Watch your inbox for the next note from us.
            </motion.p>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
