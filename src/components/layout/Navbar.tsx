import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { scrollToTopInstant } from '../../lib/navigation'
import { SignOutButton } from '../auth/SignOutButton'
import { AuthActionTray } from '../auth/AuthActionTray'
import { BackButton } from './BackButton'
import { NavBubbleTrack } from './NavBubbleTrack'
import { Button } from '../ui/Button'
import { IconClose, IconMenu } from '../icons'

const mobileLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/lessons', label: 'Lessons' },
  { to: '/music', label: 'Music' },
  { to: '/community', label: 'Community' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
] as const

export function Navbar() {
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const { session } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  function handleNavClick() {
    setOpen(false)
    scrollToTopInstant()
  }

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24)
  })

  return (
    <>
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-200 ${
          scrolled
            ? 'border-b border-border bg-[var(--nav-scrolled-bg)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--nav-scrolled-bg)_82%,transparent)]'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-6 lg:px-8">
          <Link
            to="/"
            className="min-w-0 truncate font-display text-xl tracking-tight text-fg md:text-2xl"
            onClick={handleNavClick}
          >
            The Music Embassy
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <NavBubbleTrack pathname={pathname} onNavigate={handleNavClick} />

            <div className="hidden items-center gap-2 md:flex">
              {session ? (
                <SignOutButton compact />
              ) : (
                <AuthActionTray compact>
                  <Button to="/sign-in" variant="primary" className="!px-5 !py-2 text-sm">
                    Sign in
                  </Button>
                </AuthActionTray>
              )}
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-glass text-fg transition-[background-color,border-color] duration-200 hover:border-gold/30 md:hidden"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <IconMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-page/95 backdrop-blur-xl md:hidden"
            style={{
              paddingTop: 'calc(4.5rem + env(safe-area-inset-top, 0px))',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <nav className="flex flex-col gap-1 px-6 py-8">
              <div className="mb-2 px-4 sm:hidden">
                <BackButton className="w-full justify-center" />
              </div>
              {mobileLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.2 }}
                >
                  <Link
                    to={l.to}
                    onClick={handleNavClick}
                    className={`tap-target block rounded-xl px-4 py-4 text-lg transition-colors duration-150 ${
                      pathname === l.to
                        ? 'bg-gold/12 text-fg ring-1 ring-gold/25'
                        : 'text-muted'
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                {session ? (
                  <div className="px-4 py-2">
                    <SignOutButton fullWidth />
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    <AuthActionTray className="w-full">
                      <Button
                        to="/sign-in"
                        variant="primary"
                        className="w-full !py-3.5"
                        onClick={() => setOpen(false)}
                      >
                        Sign in
                      </Button>
                    </AuthActionTray>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
