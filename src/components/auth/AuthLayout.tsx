import { motion } from 'framer-motion'
import { Link, Outlet } from 'react-router-dom'
import { PREMIUM_EASE } from '../../lib/motion'
import { BackButton } from '../layout/BackButton'
import { PortalAmbient } from '../ui/PortalAmbient'

export function AuthLayout() {
  return (
    <div className="app-canvas relative min-h-svh overflow-x-clip">
      <PortalAmbient subtle />
      <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-border bg-[var(--nav-scrolled-bg)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--nav-scrolled-bg)_82%,transparent)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ x: -2 }} transition={{ duration: 0.18 }}>
              <BackButton fallbackTo="/" />
            </motion.div>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <Link to="/" className="hidden font-display text-xl tracking-tight text-fg sm:block md:text-2xl">
              The Music Embassy
            </Link>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: PREMIUM_EASE }}
        className="site-main-offset site-safe-bottom relative z-10 flex min-h-svh items-center justify-center px-6 pb-12"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}
