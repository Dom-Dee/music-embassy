import { Link, Outlet, useLocation } from 'react-router-dom'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { portalLayoutKey } from '../../lib/motion'
import { useAuth } from '../../auth/useAuth'
import { isApprovedStudent } from '../../auth/types'
import { NotificationBell } from '../dashboard/NotificationBell'
import { WebsiteReturnTab } from '../layout/WebsiteReturnTab'
import { PortalAmbient } from '../ui/PortalAmbient'
import { PageTransition } from '../ui/PageTransition'
import { SignOutButton } from './SignOutButton'

export function AppLayout() {
  const { profile } = useAuth()
  const { pathname } = useLocation()
  useScrollToTop()
  const isStudent = isApprovedStudent(profile)

  return (
    <div className="app-canvas relative min-h-svh overflow-x-clip">
      <PortalAmbient />
      {profile ? <WebsiteReturnTab /> : null}
      <header className="site-header fixed inset-x-0 top-0 z-50 overflow-visible border-b border-border bg-[var(--nav-scrolled-bg)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--nav-scrolled-bg)_82%,transparent)]">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-6 lg:px-8">
          <Link to="/" className="min-w-0 truncate font-display text-xl tracking-tight text-fg">
            The Music Embassy
          </Link>
          <nav className="flex shrink-0 items-center gap-2 md:gap-4">
            {isStudent && profile ? <NotificationBell studentId={profile.id} /> : null}
            <SignOutButton compact />
          </nav>
        </div>
      </header>

      <main className="site-main-offset site-safe-bottom relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <PageTransition routeKey={portalLayoutKey(pathname)}>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}
