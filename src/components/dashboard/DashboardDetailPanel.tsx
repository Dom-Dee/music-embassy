import { motion } from 'framer-motion'
import { AssignmentSubmissionForm } from './AssignmentSubmissionForm'
import { AttachmentLinks } from './AttachmentLinks'
import { safeExternalUrl } from '../../lib/safeUrl'
import type { InstrumentPath, InvoiceStatus } from '../../types/student'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getOwingInvoices,
} from '../../types/student'

export type DashboardFocus =
  | 'lessons'
  | 'assignments'
  | 'quizzes'
  | 'billing'

type DashboardDetailPanelProps = {
  focus: DashboardFocus
  paths: InstrumentPath[]
  currency: string
  studentId: string
  instrumentId?: string | null
  onClose: () => void
  onRefresh: () => void
}

const titles: Record<DashboardFocus, string> = {
  lessons: 'Your lessons',
  assignments: 'Your assignments',
  quizzes: 'Quizzes & tests',
  billing: 'Billing & invoices',
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, string> = {
    pending: 'border-gold/30 text-gold',
    overdue: 'border-red-400/35 text-red-300',
    paid: 'border-emerald-500/25 text-emerald-300',
    cancelled: 'border-border text-muted',
  }
  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${styles[status]}`}
    >
      {status}
    </span>
  )
}

export function DashboardDetailPanel({
  focus,
  paths,
  currency,
  studentId,
  instrumentId,
  onClose,
  onRefresh,
}: DashboardDetailPanelProps) {
  const filteredPaths = instrumentId
    ? paths.filter((path) => path.enrollment.instrument_id === instrumentId)
    : paths

  const instrumentLabel = instrumentId
    ? (filteredPaths[0]?.enrollment.instruments?.name ?? null)
    : null

  const lessons = filteredPaths
    .flatMap((path) =>
      path.lessons.map((lesson) => ({
        ...lesson,
        instrument: path.enrollment.instruments?.name ?? 'Instrument',
      })),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    )

  const assignments = filteredPaths
    .flatMap((path) =>
      path.assignments.map((assignment) => ({
        ...assignment,
        instrument: path.enrollment.instruments?.name ?? 'Instrument',
      })),
    )
    .sort((a, b) => {
      const aDue = a.due_date ? new Date(a.due_date).getTime() : 0
      const bDue = b.due_date ? new Date(b.due_date).getTime() : 0
      return bDue - aDue
    })

  const quizzes = filteredPaths
    .flatMap((path) =>
      path.quizzes.map((quiz) => ({
        ...quiz,
        instrument: path.enrollment.instruments?.name ?? 'Instrument',
      })),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    )

  const invoices = filteredPaths
    .flatMap((path) =>
      path.invoices.map((invoice) => ({
        ...invoice,
        instrument: path.enrollment.instruments?.name ?? 'Instrument',
      })),
    )
    .sort((a, b) => b.month.localeCompare(a.month))

  const owingIds = new Set(
    filteredPaths.flatMap((path) =>
      getOwingInvoices(path.invoices).map((inv) => inv.id),
    ),
  )

  return (
    <motion.section
      id="dashboard-detail"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-wood-surface liquid-panel mt-6 overflow-hidden rounded-2xl border border-gold/20"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/90">
            Register
          </p>
          <h2 className="mt-1 font-display text-xl text-fg md:text-2xl">
            {titles[focus]}
            {instrumentLabel ? (
              <span className="text-muted"> · {instrumentLabel}</span>
            ) : null}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted transition hover:border-gold/30 hover:text-fg"
        >
          Close
        </button>
      </div>

      <div className="max-h-[min(28rem,70vh)] overflow-y-auto px-5 py-5 sm:px-6">
        {focus === 'lessons' ? (
          lessons.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              No lessons on your register yet. Your instructor will post sessions here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {lessons.map((lesson) => {
                const lessonUrl = safeExternalUrl(lesson.video_url)
                return (
                <li key={lesson.id} className="flex flex-wrap gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
                      {lesson.instrument}
                    </p>
                    <p className="mt-1 text-sm font-medium text-fg">{lesson.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {formatDateTime(lesson.scheduled_at)}
                    </p>
                    {lesson.notes ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {lesson.notes}
                      </p>
                    ) : null}
                    {lessonUrl ? (
                      <a
                        href={lessonUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-2 inline-block text-xs text-gold hover:underline"
                      >
                        Open lesson link
                      </a>
                    ) : null}
                    <AttachmentLinks urls={lesson.attachment_urls} />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                    {lesson.status}
                  </span>
                </li>
              )})}
            </ul>
          )
        ) : null}

        {focus === 'assignments' ? (
          assignments.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              No assignments from your instructors yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {assignments.map((assignment) => {
                const resourceUrl = safeExternalUrl(assignment.resource_url)
                return (
                <li key={assignment.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
                    {assignment.instrument}
                  </p>
                  <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-fg">{assignment.title}</p>
                    {assignment.due_date ? (
                      <p className="text-xs text-muted">
                        Due {formatDate(assignment.due_date)}
                      </p>
                    ) : null}
                  </div>
                  {assignment.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {assignment.description}
                    </p>
                  ) : null}
                  {resourceUrl ? (
                    <a
                      href={resourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-2 inline-block text-xs text-gold hover:underline"
                    >
                      Open resource link
                    </a>
                  ) : null}
                  <AttachmentLinks urls={assignment.attachment_urls} />
                  <AssignmentSubmissionForm
                    assignment={assignment}
                    studentId={studentId}
                    onSubmitted={() => void onRefresh()}
                  />
                </li>
              )})}
            </ul>
          )
        ) : null}

        {focus === 'quizzes' ? (
          quizzes.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              No quizzes scheduled yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {quizzes.map((quiz) => (
                <li key={quiz.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
                    {quiz.instrument}
                  </p>
                  <p className="mt-1 text-sm font-medium text-fg">{quiz.title}</p>
                  <p className="mt-1 text-xs text-gold">
                    {formatDateTime(quiz.scheduled_at)}
                  </p>
                  {quiz.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {quiz.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )
        ) : null}

        {focus === 'billing' ? (
          invoices.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              No invoices issued yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {invoices.map((invoice) => {
                const owing = owingIds.has(invoice.id)
                return (
                  <li
                    key={invoice.id}
                    className={`flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 ${
                      owing ? 'rounded-lg bg-gold/[0.05] -mx-2 px-2' : ''
                    }`}
                  >
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
                        {invoice.instrument}
                      </p>
                      <p className={`mt-1 text-sm font-medium ${owing ? 'text-gold' : 'text-fg'}`}>
                        {invoice.month}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        Due {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums text-fg">
                        {formatCurrency(Number(invoice.amount), invoice.currency || currency)}
                      </span>
                      <StatusBadge status={invoice.status} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )
        ) : null}
      </div>
    </motion.section>
  )
}
