import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { scrollToTopInstant } from '../../lib/navigation'
import { AuthActionTray } from '../auth/AuthActionTray'
import { BackButton } from './BackButton'
import { NavBubbleTrack } from './NavBubbleTrack'
import { SiteBrandLink, SiteHeaderInner } from './SiteBrandLink'
import { UserProfileMenu } from './UserProfileMenu'
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
        className={`site-header fixed inset-x-0 top-0 z-[100] overflow-visible transition-[background-color,backdrop-filter,border-color] duration-200 ${
          scrolled
            ? 'border-b border-border bg-[var(--nav-scrolled-bg)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--nav-scrolled-bg)_92%,transparent)]'
            : 'border-b border-transparent bg-[color-mix(in_srgb,var(--nav-scrolled-bg)_72%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--nav-scrolled-bg)_58%,transparent)]'
        }`}
      >
        <SiteHeaderInner>
          <SiteBrandLink onClick={handleNavClick} />

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <NavBubbleTrack pathname={pathname} onNavigate={handleNavClick} />
          </div>
        </SiteHeaderInner>
        <div className="navbar-actions-slot">
          {!session ? (
            <div className="hidden md:block">
              <AuthActionTray compact>
                <Button to="/sign-in" variant="primary" className="!px-5 !py-2 text-sm">
                  Sign in
                </Button>
              </AuthActionTray>
            </div>
          ) : null}
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
          <UserProfileMenu />
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[90] overflow-y-auto bg-page/95 backdrop-blur-xl md:hidden"
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
              <div className="mt-4 border-t border-border pt-4 px-4">
                {!session ? (
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
                ) : null}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
