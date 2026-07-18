import { LayoutGroup, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLayoutEffect, useRef } from 'react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/lessons', label: 'Lessons' },
  { to: '/music', label: 'Music' },
  { to: '/community', label: 'Community' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
] as const

type NavBubbleTrackProps = {
  pathname: string
  onNavigate: () => void
}

function linkIndex(path: string): number {
  const index = links.findIndex((l) => l.to === path)
  return index === -1 ? 0 : index
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Bounce + speed scale with jump distance; capped so it never gets wild */
function getBubbleSpring(jumpDistance: number) {
  if (jumpDistance <= 1) {
    return {
      type: 'spring' as const,
      stiffness: 260,
      damping: 32,
      mass: 1.12,
      restDelta: 0.001,
    }
  }

  const maxDistance = links.length - 1
  const t = Math.min(1, (jumpDistance - 2) / Math.max(maxDistance - 2, 1))

  const stiffness = lerp(150, 108, t)
  const mass = lerp(1.55, 2.0, t)
  const critical = 2 * Math.sqrt(stiffness * mass)
  // More bounce on longer jumps, still controlled
  const dampingRatio = lerp(0.88, 0.66, t)

  return {
    type: 'spring' as const,
    stiffness,
    damping: critical * dampingRatio,
    mass,
    restDelta: 0.001,
  }
}

export function NavBubbleTrack({ pathname, onNavigate }: NavBubbleTrackProps) {
  const prevIndexRef = useRef(linkIndex(pathname))
  const activeIndex = linkIndex(pathname)
  const jumpDistance = Math.abs(activeIndex - prevIndexRef.current)
  const bubbleSpring = getBubbleSpring(jumpDistance)

  useLayoutEffect(() => {
    prevIndexRef.current = activeIndex
  }, [activeIndex])

  return (
    <LayoutGroup id="site-nav-bubble">
      <nav className="nav-bubble-track pointer-events-auto relative hidden items-center gap-1.5 md:flex">
        {links.map((l) => {
          const active = pathname === l.to
          return (
            <Link
              key={l.to}
              to={l.to}
              onClick={onNavigate}
              className={`nav-link group relative z-[1] rounded-full px-4 py-3 text-[0.9375rem] font-medium leading-none md:text-base ${
                active ? 'text-fg' : 'text-muted hover:text-fg'
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="site-nav-active-bubble"
                  className="nav-link-active-pill pointer-events-none absolute inset-0 rounded-full"
                  transition={bubbleSpring}
                  aria-hidden
                />
              ) : null}
              {!active ? (
                <span
                  aria-hidden
                  className="nav-link-hover-glass pointer-events-none absolute inset-0 -z-10 rounded-full"
                />
              ) : null}
              <span className="relative">{l.label}</span>
            </Link>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}
