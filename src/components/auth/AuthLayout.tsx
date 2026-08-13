import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { PREMIUM_EASE } from '../../lib/motion'
import { SiteBrandLink, SiteHeaderInner } from '../layout/SiteBrandLink'
import { UserProfileMenu } from '../layout/UserProfileMenu'
import { PortalAmbient } from '../ui/PortalAmbient'

export function AuthLayout() {
  return (
    <>
      <header className="site-header portal-header fixed inset-x-0 top-0 z-[100] overflow-visible border-b border-border">
        <SiteHeaderInner>
          <SiteBrandLink />
        </SiteHeaderInner>
        <div className="navbar-profile-slot">
          <UserProfileMenu />
        </div>
      </header>

      <div className="app-canvas relative min-h-svh">
        <PortalAmbient subtle />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: PREMIUM_EASE }}
          className="site-main-offset site-safe-bottom relative z-10 flex min-h-svh items-center justify-center px-6 pb-12"
        >
          <Outlet />
        </motion.main>
      </div>
    </>
  )
}
