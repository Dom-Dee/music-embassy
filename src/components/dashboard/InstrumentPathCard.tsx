import { motion } from 'framer-motion'
import { useNow } from '../../hooks/useNow'
import { isScheduledOnOrAfter } from '../../lib/portalTime'
import type { DashboardFocus } from './DashboardDetailPanel'
import type { InstrumentPath } from '../../types/student'
import { getInstrumentImageUrl } from '../../lib/instrumentImages'
import {
  countPendingAssignments,
  formatCurrency,
  formatDate,
  formatDateTime,
  getOwingInvoices,
  getTotalOwing,
  isAssignmentPending,
} from '../../types/student'

const ease = [0.22, 1, 0.36, 1] as const

type SummaryTileProps = {
  label: string
  value: string
  detail: string
  onClick: () => void
  highlight?: boolean
}

function SummaryTile({ label, value, detail, onClick, highlight }: SummaryTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full flex-col justify-between p-5 text-left transition hover:bg-gold/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold/45 md:p-6 ${
        highlight ? 'bg-gold/[0.04]' : ''
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/85">
        {label}
      </p>
      <div className="mt-4">
        <p className={`font-display text-xl tabular-nums ${highlight ? 'text-gold' : 'text-fg'}`}>
          {value}
        </p>
        <p className="mt-1.5 text-sm leading-snug text-muted">{detail}</p>
      </div>
    </button>
  )
}

type InstrumentPathCardProps = {
  path: InstrumentPath
  index: number
  onOpenSection: (focus: DashboardFocus, instrumentId: string) => void
}

export function InstrumentPathCard({
  path,
  index,
  onOpenSection,
}: InstrumentPathCardProps) {
  const { enrollment, lessons, invoices, assignments, quizzes } = path
  const name = enrollment.instruments?.name ?? 'Instrument'
  const monthlyFee = enrollment.instruments?.monthly_fee ?? 0
  const owing = getOwingInvoices(invoices)
  const pathBalance = getTotalOwing(invoices)
  const currency = invoices[0]?.currency ?? 'GHS'
  const cover = getInstrumentImageUrl(name)
  const instrumentId = enrollment.instrument_id
  const nowMs = useNow()

  const upcomingLessons = lessons
    .filter((lesson) => lesson.status === 'scheduled')
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    )

  const upcomingQuizzes = quizzes
    .filter((quiz) => isScheduledOnOrAfter(quiz.scheduled_at, nowMs))
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    )

  const pendingAssignments = assignments.filter(isAssignmentPending)
  const pendingCount = countPendingAssignments(assignments)

  const lessonsValue =
    lessons.length === 0
      ? 'None yet'
      : upcomingLessons.length > 0
        ? String(upcomingLessons.length)
        : String(lessons.length)

  const lessonsDetail =
    lessons.length === 0
      ? 'Your instructor will post sessions here'
      : upcomingLessons[0]
        ? `Next: ${upcomingLessons[0].title}`
        : `${lessons.length} on your register`

  const assignmentsValue = String(pendingCount)

  const assignmentsDetail =
    assignments.length === 0
      ? 'Nothing assigned yet'
      : pendingCount === 0
        ? 'All caught up'
        : pendingAssignments[0]
          ? `${pendingAssignments[0].title}${pendingAssignments[0].due_date ? ` · due ${formatDate(pendingAssignments[0].due_date)}` : ''}`
          : 'Ready to submit'

  const quizzesValue =
    quizzes.length === 0 ? 'None yet' : String(upcomingQuizzes.length || quizzes.length)

  const quizzesDetail =
    quizzes.length === 0
      ? 'No tests scheduled'
      : upcomingQuizzes[0]
        ? `Next: ${formatDateTime(upcomingQuizzes[0].scheduled_at)}`
        : `${quizzes.length} on record`

  const financeValue =
    pathBalance > 0 ? formatCurrency(pathBalance, currency) : 'Settled'

  const financeDetail =
    owing.length > 0
      ? `${owing.length} month${owing.length === 1 ? '' : 's'} outstanding`
      : invoices.length > 0
        ? `${invoices.length} invoice${invoices.length === 1 ? '' : 's'} on file`
        : 'No invoices yet'

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      transition={{ delay: index * 0.05, duration: 0.45, ease }}
      className="glass-wood-surface liquid-panel flex h-full flex-col overflow-hidden rounded-2xl border border-border"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={cover} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-page via-page/55 to-page/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/90">
            Enrolled {formatDate(enrollment.start_date)}
          </p>
          <h2 className="mt-1 font-display text-2xl text-fg md:text-[1.75rem]">{name}</h2>
          {enrollment.classes?.name ? (
            <p className="mt-1 text-sm text-muted">{enrollment.classes.name}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 md:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Monthly tuition
          </p>
          <p className="mt-1 font-display text-xl text-fg">
            {formatCurrency(Number(monthlyFee), currency)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenSection('billing', instrumentId)}
          className="text-right transition hover:opacity-80"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Account
          </p>
          {pathBalance > 0 ? (
            <p className="mt-1 text-sm font-medium text-gold">
              {formatCurrency(pathBalance, currency)} due
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">Settled</p>
          )}
        </button>
      </div>

      <div className="grid flex-1 divide-x divide-y divide-border border-t border-border md:grid-cols-2">
        <SummaryTile
          label="Lessons"
          value={lessonsValue}
          detail={lessonsDetail}
          onClick={() => onOpenSection('lessons', instrumentId)}
        />
        <SummaryTile
          label="Finance"
          value={financeValue}
          detail={financeDetail}
          onClick={() => onOpenSection('billing', instrumentId)}
        />
        <SummaryTile
          label="Quizzes & tests"
          value={quizzesValue}
          detail={quizzesDetail}
          onClick={() => onOpenSection('quizzes', instrumentId)}
        />
        <SummaryTile
          label="Assignments"
          value={assignmentsValue}
          detail={assignmentsDetail}
          onClick={() => onOpenSection('assignments', instrumentId)}
          highlight={pendingCount > 0}
        />
      </div>
    </motion.article>
  )
}
