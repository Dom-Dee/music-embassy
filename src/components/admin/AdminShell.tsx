import { motion } from 'framer-motion'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { formatFirstName } from '../../lib/formatName'
import { PREMIUM_EASE } from '../../lib/motion'
import { AdminCard } from './AdminUi'
import { AdminToastProvider } from './AdminToastProvider'

const tabs: { to: string; label: string; end?: boolean }[] = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/lessons', label: 'Lessons' },
  { to: '/admin/assignments', label: 'Assignments' },
  { to: '/admin/quizzes', label: 'Quizzes' },
  { to: '/admin/finance', label: 'Finance' },
]

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatToday(): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

export function AdminShell() {
  const { profile } = useAuth()
  const { pathname } = useLocation()
  const firstName = profile?.full_name ? formatFirstName(profile.full_name) : 'Admin'

  return (
    <AdminToastProvider>
      <div className="relative -mx-6 px-6 pb-12 lg:-mx-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: PREMIUM_EASE }}
          className="portal-shell-nav sticky z-40"
        >
        <AdminCard padding="none">
          <div className="flex flex-wrap items-start justify-between gap-6 px-6 py-6 md:px-8 md:py-7">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/90">
                Staff portal
              </p>
              <h1 className="mt-2 font-display text-[2.1rem] leading-[1.08] text-fg md:text-[2.75rem]">
                {greeting()}, {firstName}
              </h1>
            </div>
            <div className="glass-wood-surface rounded-xl border border-border px-4 py-3 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                Today
              </p>
              <p className="mt-1 font-display text-base text-fg">{formatToday()}</p>
            </div>
          </div>

          <nav
            className="flex gap-1 overflow-x-auto border-t border-border bg-[var(--nav-scrolled-bg)] px-3 py-2 md:px-4"
            aria-label="Admin sections"
          >
            {tabs.map((tab) => {
              const active =
                tab.end ? pathname === tab.to : pathname.startsWith(tab.to)
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={`relative shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    active ? 'text-fg' : 'text-muted hover:bg-page/40 hover:text-fg'
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="admin-nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-gold/14 ring-1 ring-gold/28"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  ) : null}
                  {tab.label}
                </NavLink>
              )
            })}
          </nav>
        </AdminCard>
        </motion.div>

        <AdminCard padding="lg">
          <Outlet />
        </AdminCard>
      </div>
      </div>
    </AdminToastProvider>
  )
}
