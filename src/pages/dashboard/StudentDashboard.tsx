import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { isApprovedStudent } from '../../auth/types'
import {
  DashboardDetailPanel,
  type DashboardFocus,
} from '../../components/dashboard/DashboardDetailPanel'
import { DailyMusicQuote } from '../../components/dashboard/DailyMusicQuote'
import { DashboardSummary } from '../../components/dashboard/DashboardSummary'
import { InstrumentPathCard } from '../../components/dashboard/InstrumentPathCard'
import { OwingNotificationModal } from '../../components/dashboard/OwingNotificationModal'
import { Button } from '../../components/ui/Button'
import {
  IconBarChart,
  IconCalendar,
  IconClipboard,
  IconCreditCard,
  IconMusic,
} from '../../components/icons'
import { useNow } from '../../hooks/useNow'
import { useStudentDashboard } from '../../hooks/useStudentDashboard'
import { formatFirstName } from '../../lib/formatName'
import { countUpcomingQuizzes } from '../../lib/portalTime'
import { sendPaymentReminderEmail } from '../../lib/paymentReminder'
import { countPendingAssignments, formatCurrency } from '../../types/student'

const ease = [0.22, 1, 0.36, 1] as const

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
    year: 'numeric',
  }).format(new Date())
}

export function StudentDashboard() {
  const { profile } = useAuth()
  const enrolmentsRef = useRef<HTMLElement>(null)
  const [dismissedOwingIds, setDismissedOwingIds] = useState<string | null>(null)
  const [owingModalManual, setOwingModalManual] = useState(false)
  const [dashboardFocus, setDashboardFocus] = useState<DashboardFocus | null>(null)
  const [instrumentFilter, setInstrumentFilter] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const {
    instrumentPaths,
    owingInvoices,
    totalOwing,
    loading,
    error,
    refresh,
  } = useStudentDashboard(profile?.id)

  const owingIds = owingInvoices.map((i) => i.id).join(',')
  const currency = owingInvoices[0]?.currency ?? 'GHS'
  const totalLessons = instrumentPaths.reduce((n, p) => n + p.lessons.length, 0)
  const pendingAssignments = instrumentPaths.reduce(
    (n, p) => n + countPendingAssignments(p.assignments),
    0,
  )
  const nowMs = useNow()
  const upcomingQuizzes = instrumentPaths.reduce(
    (n, p) => n + countUpcomingQuizzes(p.quizzes, nowMs),
    0,
  )

  useEffect(() => {
    if (!profile || !owingIds) return

    const invoices = owingInvoices
    void (async () => {
      const result = await sendPaymentReminderEmail({
        userId: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        owingInvoices: invoices,
      })
      setEmailSent(result.sent)
      setEmailError(result.error ?? null)
    })()
    // Intentionally keyed on owingIds so the reminder runs once per outstanding set.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- owingIds captures invoice changes
  }, [profile?.id, profile?.email, profile?.full_name, owingIds])

  if (!profile) return null

  if (!isApprovedStudent(profile)) {
    return <Navigate to="/admin" replace />
  }

  if (!loading && instrumentPaths.length === 0) {
    return <Navigate to="/choose-instruments" replace />
  }

  const firstName = formatFirstName(profile.full_name)
  const hasBalance = owingInvoices.length > 0
  const showOwingModal =
    owingModalManual ||
    (hasBalance && !loading && dismissedOwingIds !== owingIds)

  function openDashboardFocus(focus: DashboardFocus, instrumentId?: string) {
    setInstrumentFilter(instrumentId ?? null)
    if (instrumentId) {
      setDashboardFocus(focus)
    } else {
      setDashboardFocus((current) => (current === focus ? null : focus))
    }
    requestAnimationFrame(() => {
      document.getElementById('dashboard-detail')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    })
  }

  function scrollToEnrolments() {
    setDashboardFocus(null)
    setInstrumentFilter(null)
    enrolmentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative -mx-6 lg:-mx-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="border-b border-border px-6 pb-10 pt-2 lg:px-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-8 lg:gap-10">
          <div className="max-w-2xl flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/90">
              Student portal
            </p>
            <h1 className="mt-3 font-display text-[2.35rem] leading-[1.08] text-fg md:text-5xl">
              {greeting()}, {firstName}
            </h1>
            <DailyMusicQuote variant="inline" className="mt-7 lg:hidden" />
          </div>
          <div className="flex shrink-0 flex-col items-end text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Today
            </p>
            <p className="mt-2 font-display text-lg text-fg">{formatToday()}</p>
            <DailyMusicQuote variant="marginal" className="mt-8 hidden lg:block" />
          </div>
        </div>
      </motion.header>

      <div className="px-6 lg:px-8">
        {error ? (
          <p className="mt-6 rounded-lg border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-200">
            {error}
            <button
              type="button"
              onClick={() => void refresh()}
              className="ml-2 underline underline-offset-2 hover:text-fg"
            >
              Try again
            </button>
          </p>
        ) : null}

        <div className="mt-8">
          <DashboardSummary
            items={[
              {
                label: 'Instruments',
                value: loading ? '…' : String(instrumentPaths.length),
                detail: 'Active enrolments',
                icon: <IconMusic className="h-4 w-4" />,
                onClick: scrollToEnrolments,
              },
              {
                label: 'Lessons',
                value: loading ? '…' : String(totalLessons),
                detail: 'On your register',
                icon: <IconCalendar className="h-4 w-4" />,
                onClick: () => openDashboardFocus('lessons'),
                active: dashboardFocus === 'lessons',
              },
              {
                label: 'Assignments',
                value: loading ? '…' : String(pendingAssignments),
                detail:
                  pendingAssignments === 0
                    ? 'All caught up'
                    : `${pendingAssignments} to complete`,
                icon: <IconBarChart className="h-4 w-4" />,
                onClick: () => openDashboardFocus('assignments'),
                active: dashboardFocus === 'assignments',
                highlight: pendingAssignments > 0,
              },
              {
                label: 'Quizzes',
                value: loading ? '…' : String(upcomingQuizzes),
                detail: 'Upcoming tests',
                icon: <IconClipboard className="h-4 w-4" />,
                onClick: () => openDashboardFocus('quizzes'),
                active: dashboardFocus === 'quizzes',
              },
              {
                label: 'Balance',
                value: loading ? '…' : formatCurrency(totalOwing, currency),
                detail: hasBalance ? 'Outstanding fees' : 'Settled',
                icon: <IconCreditCard className="h-4 w-4" />,
                emphasis: hasBalance,
                onClick: () => openDashboardFocus('billing'),
                active: dashboardFocus === 'billing',
              },
            ]}
          />
        </div>

        {dashboardFocus && !loading ? (
          <DashboardDetailPanel
            focus={dashboardFocus}
            paths={instrumentPaths}
            currency={currency}
            studentId={profile.id}
            instrumentId={instrumentFilter}
            onClose={() => {
              setDashboardFocus(null)
              setInstrumentFilter(null)
            }}
            onRefresh={refresh}
          />
        ) : null}

        {hasBalance && !loading ? (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-wood-surface liquid-panel mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/25 bg-gold/[0.06] px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium text-fg">
                {formatCurrency(totalOwing, currency)} outstanding across{' '}
                {owingInvoices.length} invoice
                {owingInvoices.length === 1 ? '' : 's'}
              </p>
              <p className="mt-1 text-sm text-muted">
                Please settle your balance to keep lessons uninterrupted.
              </p>
            </div>
            <Button type="button" onClick={() => setOwingModalManual(true)}>
              Review invoices
            </Button>
          </motion.aside>
        ) : null}

        <section ref={enrolmentsRef} className="mt-12 scroll-mt-24 pb-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/90">
                Enrolments
              </p>
              <h2 className="mt-2 font-display text-2xl text-fg md:text-3xl">
                {loading
                  ? 'Loading your register…'
                  : instrumentPaths.length === 1
                    ? 'One instrument on your register'
                    : `${instrumentPaths.length} instruments on your register`}
              </h2>
            </div>
            <Button to="/choose-instruments" variant="secondary" className="text-sm">
              Add instrument
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="glass-wood-surface overflow-hidden rounded-2xl border border-border"
                >
                  <div className="premium-skeleton h-44" />
                  <div className="space-y-3 p-6">
                    <div className="premium-skeleton h-4 w-1/3 rounded" />
                    <div className="premium-skeleton h-3 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {instrumentPaths.map((path, i) => (
                <InstrumentPathCard
                  key={path.enrollment.id}
                  path={path}
                  index={i}
                  onOpenSection={openDashboardFocus}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <OwingNotificationModal
        open={showOwingModal}
        onClose={() => {
          setDismissedOwingIds(owingIds)
          setOwingModalManual(false)
        }}
        fullName={profile.full_name}
        email={profile.email}
        totalOwing={totalOwing}
        currency={currency}
        owingInvoices={owingInvoices}
        emailSent={emailSent}
        emailError={emailError}
      />
    </div>
  )
}
