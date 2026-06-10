import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { STUDIO_AREA, STUDIO_LOCATION, STUDIO_MAPS_URL } from '../../data/contact'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/lessons', label: 'Lessons' },
  { to: '/music', label: 'Music & Showcase' },
  { to: '/community', label: 'Community' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
] as const

const social = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://youtube.com', label: 'YouTube' },
  { href: 'https://x.com', label: 'X' },
] as const

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-page">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,var(--glow-ambient-1),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl text-fg">Music Embassy</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Teaching music. Showcasing creativity. Building community. A global
              platform for artists, learners, and listeners who believe sound
              shapes culture.
            </p>
            <a
              href={STUDIO_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${STUDIO_LOCATION} in Google Maps`}
              className="mt-4 inline-block text-sm text-muted transition-colors duration-200 hover:text-gold"
            >
              {STUDIO_LOCATION}
              <span className="block text-xs text-muted/80">{STUDIO_AREA}</span>
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted transition-colors duration-200 hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Social
            </p>
            <ul className="mt-4 space-y-3">
              {social.map((s) => (
                <li key={s.href}>
                  <motion.a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm text-muted transition-colors duration-200 hover:text-gold"
                    whileHover={{ x: 4 }}
                  >
                    {s.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-sm text-muted md:text-left">
            © {new Date().getFullYear()} Music Embassy. All rights reserved.
          </p>
          <p className="text-center font-display text-base text-fg/90 md:text-right">
            Music Embassy. Teaching music. Showcasing creativity. Building
            community.
          </p>
        </div>
      </div>
    </footer>
  )
}
