import { Outlet, useLocation } from 'react-router-dom'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { portalLayoutKey } from '../../lib/motion'
import { useAuth } from '../../auth/useAuth'
import { isApprovedStudent } from '../../auth/types'
import { NotificationBell } from '../dashboard/NotificationBell'
import { WebsiteReturnTab } from '../layout/WebsiteReturnTab'
import { SiteBrandLink, SiteHeaderInner } from '../layout/SiteBrandLink'
import { UserProfileMenu } from '../layout/UserProfileMenu'
import { PortalAmbient } from '../ui/PortalAmbient'
import { PageTransition } from '../ui/PageTransition'

export function AppLayout() {
  const { profile } = useAuth()
  const { pathname } = useLocation()
  useScrollToTop()
  const isStudent = isApprovedStudent(profile)

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-[100] overflow-visible border-b border-border bg-[var(--nav-scrolled-bg)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--nav-scrolled-bg)_92%,transparent)]">
        <SiteHeaderInner>
          <SiteBrandLink />
          <nav className="relative z-20 ml-auto mr-[3.25rem] flex shrink-0 items-center gap-2 md:mr-[3.5rem] md:gap-3">
            {isStudent && profile ? <NotificationBell studentId={profile.id} /> : null}
          </nav>
        </SiteHeaderInner>
        <div className="navbar-profile-slot">
          <UserProfileMenu />
        </div>
      </header>

      <div className="app-canvas relative min-h-svh">
        <PortalAmbient />
        {profile ? <WebsiteReturnTab /> : null}
        <main className="site-main-offset site-safe-bottom relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          <PageTransition routeKey={portalLayoutKey(pathname)}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </>
  )
}
