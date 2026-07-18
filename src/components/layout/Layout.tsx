import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { isApprovedAdmin, isApprovedStudent } from '../../auth/types'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { AdminReturnTab } from './AdminReturnTab'
import { DashboardReturnTab } from './DashboardReturnTab'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { Newsletter } from './Newsletter'
import { PageTransition } from '../ui/PageTransition'

export function Layout() {
  const location = useLocation()
  const { profile } = useAuth()
  useScrollToTop()

  const showAdminReturn = isApprovedAdmin(profile)
  const showDashboardReturn = isApprovedStudent(profile)

  return (
    <>
      <Navbar />
      <div className="app-canvas relative min-h-svh">
        {showAdminReturn ? <AdminReturnTab /> : null}
        {showDashboardReturn ? <DashboardReturnTab /> : null}
        <main className="site-main-offset relative z-10">
          <PageTransition routeKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
        <Newsletter />
        <Footer />
      </div>
    </>
  )
}
