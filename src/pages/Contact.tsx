import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  STUDIO_AREA,
  STUDIO_EMAIL,
  STUDIO_EMAIL_COMPOSE_URL,
  STUDIO_LOCATION,
  STUDIO_MAPS_URL,
  STUDIO_PHONE,
  STUDIO_PHONE_HREF,
  STUDIO_WHATSAPP_URL,
} from '../data/contact'
import { images } from '../data/images'
import { buildContactEmailUrl, sendContactMessage } from '../lib/contactForm'
import { heroContainer, heroItem, PREMIUM_EASE } from '../lib/motion'
import { Button } from '../components/ui/Button'
import { IconMail, IconPhone, IconMapPin, IconWhatsApp } from '../components/icons'

const contactDetails = [
  {
    icon: IconMail,
    label: 'Email',
    value: STUDIO_EMAIL,
    href: STUDIO_EMAIL_COMPOSE_URL,
    sub: 'Tap to open Gmail and message us',
    external: true,
  },
  {
    icon: IconPhone,
    label: 'Phone',
    value: STUDIO_PHONE,
    href: STUDIO_PHONE_HREF,
    sub: null,
  },
  {
    icon: IconMapPin,
    label: 'Location',
    value: STUDIO_LOCATION,
    href: STUDIO_MAPS_URL,
    sub: `${STUDIO_AREA} · Open in Google Maps`,
  },
]

const CONTACT_CARD_CLASS =
  'tap-card contact-card group flex items-start gap-4 rounded-2xl border border-border bg-glass/70 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm hover:border-gold/22 hover:shadow-[var(--shadow-card-hover)]'

const WHATSAPP_CARD_CLASS =
  'tap-card contact-card flex items-center gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm hover:border-emerald-500/40 hover:bg-emerald-500/12'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentViaMailto, setSentViaMailto] = useState(false)
  const [mailtoHref, setMailtoHref] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSentViaMailto(false)
    setMailtoHref(null)
    setSubmitting(true)

    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const subject = String(data.get('subject') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!subject) {
      setError('Please choose what your message is about.')
      setSubmitting(false)
      return
    }

    try {
      const result = await sendContactMessage({ name, email, subject, message })

      if (!result.sent) {
        setMailtoHref(result.mailtoHref ?? buildContactEmailUrl({ name, email, subject, message }))
        setError(
          result.error ??
            `Could not send your message. Email us directly at ${STUDIO_EMAIL}`,
        )
        return
      }

      setSent(true)
      setSentViaMailto(result.via === 'mailto')
      setMailtoHref(result.mailtoHref ?? null)
      form.reset()
      window.setTimeout(() => {
        setSent(false)
        setSentViaMailto(false)
        setMailtoHref(null)
      }, 6000)
    } catch {
      setError('Could not send your message. Try the email link on the left.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_85%_50%_at_30%_-8%,var(--glow-ambient-1),transparent_52%)]"
        aria-hidden
      />

      <section className="relative isolate min-h-[min(58svh,34rem)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={images.studio}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: 'brightness(0.7) saturate(0.88) contrast(1.02)' }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: PREMIUM_EASE }}
          />
          <div className="hero-film-top" />
          <div className="hero-film-side" />
          <div className="hero-film-vignette" />
          <div className="hero-film-accent" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-page to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col justify-end px-6 pb-20 pt-28 md:min-h-[min(58svh,34rem)] md:justify-center md:pb-28 md:pt-32 lg:px-8">
          <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-2xl">
            <motion.p variants={heroItem} className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gold/88">
              Get in touch
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="font-display text-[2.5rem] font-normal leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl"
            >
              We'd love to hear from you.
            </motion.h1>
            <motion.p variants={heroItem} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Every message gets a personal reply, usually within two business days.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-5 lg:gap-16">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: PREMIUM_EASE }}
              className="space-y-5 lg:col-span-2"
            >
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">Contact</p>
                <h2 className="mt-3 font-display text-3xl text-fg">Reach us anytime</h2>
                <p className="mt-3 text-muted">Whether you're ready to enroll, have a question, or just want to say hello, we're here.</p>
              </div>

              {contactDetails.map((detail, i) => {
                const content = (
                  <>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/12 ring-1 ring-border">
                      <detail.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                        {detail.label}
                      </p>
                      <p className="mt-1 font-medium text-fg transition-colors duration-150 group-hover:text-gold">
                        {detail.value}
                      </p>
                      {detail.sub ? (
                        <p className="mt-0.5 text-xs text-muted">{detail.sub}</p>
                      ) : null}
                    </div>
                  </>
                )

                if (detail.href) {
                  return (
                    <a
                      key={detail.label}
                      href={detail.href}
                      target={detail.external || detail.href.startsWith('http') ? '_blank' : undefined}
                      rel={
                        detail.external || detail.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      style={{ animationDelay: `${i * 60}ms` }}
                      className={`${CONTACT_CARD_CLASS} cursor-pointer no-underline`}
                    >
                      {content}
                    </a>
                  )
                }

                return (
                  <div
                    key={detail.label}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className={CONTACT_CARD_CLASS}
                  >
                    {content}
                  </div>
                )
              })}

              <a
                href={STUDIO_WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                style={{ animationDelay: '180ms' }}
                className={WHATSAPP_CARD_CLASS}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/18 ring-1 ring-emerald-500/25">
                  <IconWhatsApp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400/80">WhatsApp</p>
                  <p className="mt-1 font-medium text-fg">Message us directly</p>
                  <p className="mt-0.5 text-xs text-muted">Fastest response channel</p>
                </div>
              </a>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.04, duration: 0.4, ease: PREMIUM_EASE }}
              onSubmit={(e) => void handleSubmit(e)}
              className="relative overflow-hidden rounded-2xl border border-border bg-glass p-8 shadow-[var(--shadow-card-hover)] backdrop-blur-xl md:p-10 lg:col-span-3"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-[64px]" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">Send a message</p>
                <h3 className="mt-3 font-display text-2xl text-fg">Tell us how we can help</h3>

                <div className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        className="mt-2 w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-base text-fg placeholder:text-muted/60 transition-[border-color,box-shadow] duration-150 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/18"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-2 w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-base text-fg placeholder:text-muted/60 transition-[border-color,box-shadow] duration-150 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/18"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wide text-muted">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="mt-2 w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-base text-fg transition-[border-color,box-shadow] duration-150 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/18"
                    >
                      <option value="">What's this about?</option>
                      <option>Enrolling in lessons</option>
                      <option>Event information</option>
                      <option>Community membership</option>
                      <option>General enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-muted">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="mt-2 w-full resize-none rounded-xl border border-border bg-surface/50 px-4 py-3 text-base text-fg placeholder:text-muted/60 transition-[border-color,box-shadow] duration-150 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/18"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                {error ? (
                  <div className="mt-6 space-y-3 rounded-lg border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-200">
                    <p>{error}</p>
                    {mailtoHref ? (
                      <a
                        href={mailtoHref}
                        className="tap-target inline-flex font-medium text-gold underline underline-offset-2"
                      >
                        Open Gmail to send this message
                      </a>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button type="submit" className="sm:w-auto" disabled={submitting}>
                    {submitting
                      ? 'Sending…'
                      : sent
                        ? '✓ Message sent'
                        : 'Send message'}
                  </Button>
                  {sent ? (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-2 text-sm text-gold"
                    >
                      <p>
                        {sentViaMailto
                          ? 'Gmail should open with your message ready to send.'
                          : "Thank you. We'll be in touch shortly."}
                      </p>
                      {sentViaMailto && mailtoHref ? (
                        <a
                          href={mailtoHref}
                          className="tap-target inline-flex font-medium underline underline-offset-2"
                        >
                          Tap here if Gmail did not open
                        </a>
                      ) : null}
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  )
}
