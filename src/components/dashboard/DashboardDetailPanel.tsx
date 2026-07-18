import { motion } from 'framer-motion'
import { AssignmentSubmissionForm } from './AssignmentSubmissionForm'
import { AttachmentLinks } from './AttachmentLinks'
import { safeExternalUrl } from '../../lib/safeUrl'
import type { AssignmentSubmissionStatus, InstrumentPath, InvoiceStatus } from '../../types/student'
import {
  assignmentStatusLabel,
  formatCurrency,
  formatDate,
  formatDateTime,
  getOwingInvoices,
  groupAssignmentsByWorkflow,
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

function invoiceChipClass(status: InvoiceStatus): string {
  if (status === 'overdue') return 'status-chip status-chip--danger'
  if (status === 'paid') return 'status-chip status-chip--success'
  if (status === 'pending') return 'status-chip status-chip--todo'
  return 'status-chip status-chip--neutral'
}

function assignmentChipClass(
  status: AssignmentSubmissionStatus | null | undefined,
): string {
  const resolved = status ?? 'pending'
  if (resolved === 'pending') return 'status-chip status-chip--todo'
  if (resolved === 'submitted') return 'status-chip status-chip--submitted'
  return 'status-chip status-chip--reviewed'
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

  const assignments = filteredPaths.flatMap((path) =>
    path.assignments.map((assignment) => ({
      ...assignment,
      instrument: path.enrollment.instruments?.name ?? 'Instrument',
    })),
  )
  const assignmentGroups = groupAssignmentsByWorkflow(assignments)

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
      className="glass-wood-surface liquid-panel mt-6 overflow-hidden rounded-2xl border border-border"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div>
          <p className="portal-section-label">Register</p>
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
          className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted transition hover:border-gold/40 hover:text-fg"
        >
          Close
        </button>
      </div>

      <div className="max-h-[min(34rem,72vh)] overflow-y-auto px-5 py-5 sm:px-6">
        {focus === 'lessons' ? (
          lessons.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              No lessons on your register yet. Your instructor will post sessions here.
            </p>
          ) : (
            <ul className="space-y-3">
              {lessons.map((lesson) => {
                const lessonUrl = safeExternalUrl(lesson.video_url)
                return (
                  <li key={lesson.id} className="portal-list-card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="portal-section-label">{lesson.instrument}</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{lesson.title}</p>
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
                            className="mt-2 inline-block text-xs font-medium text-gold hover:underline"
                          >
                            Open lesson link
                          </a>
                        ) : null}
                        <AttachmentLinks urls={lesson.attachment_urls} />
                      </div>
                      <span className="status-chip status-chip--neutral">{lesson.status}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )
        ) : null}

        {focus === 'assignments' ? (
          assignments.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              No assignments from your instructors yet.
            </p>
          ) : (
            <div className="space-y-7">
              {assignmentGroups.map((group) => (
                <section key={group.status} aria-labelledby={`assignment-group-${group.status}`}>
                  <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-2">
                    <h3
                      id={`assignment-group-${group.status}`}
                      className="portal-section-label"
                    >
                      {group.label}
                    </h3>
                    <span className="text-xs tabular-nums text-muted">
                      {group.items.length}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((assignment) => {
                      const resourceUrl = safeExternalUrl(assignment.resource_url)
                      return (
                        <li key={assignment.id} className="portal-list-card">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                                {assignment.instrument}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-fg">
                                {assignment.title}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={assignmentChipClass(assignment.submission_status)}
                              >
                                {assignmentStatusLabel(assignment.submission_status)}
                              </span>
                              {assignment.due_date ? (
                                <p className="text-xs text-muted">
                                  Due {formatDate(assignment.due_date)}
                                </p>
                              ) : null}
                            </div>
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
                              className="mt-2 inline-block text-xs font-medium text-gold hover:underline"
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
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )
        ) : null}

        {focus === 'quizzes' ? (
          quizzes.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">
              No quizzes scheduled yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {quizzes.map((quiz) => (
                <li key={quiz.id} className="portal-list-card">
                  <p className="portal-section-label">{quiz.instrument}</p>
                  <p className="mt-1 text-sm font-semibold text-fg">{quiz.title}</p>
                  <p className="mt-1 text-xs font-medium text-gold">
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
            <ul className="space-y-3">
              {invoices.map((invoice) => {
                const owing = owingIds.has(invoice.id)
                return (
                  <li
                    key={invoice.id}
                    className={`portal-list-card flex flex-wrap items-center justify-between gap-4 ${
                      owing ? 'border-[color:var(--status-todo-border)]' : ''
                    }`}
                  >
                    <div>
                      <p className="portal-section-label">{invoice.instrument}</p>
                      <p className={`mt-1 text-sm font-semibold ${owing ? 'text-gold' : 'text-fg'}`}>
                        {invoice.month}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        Due {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium tabular-nums text-fg">
                        {formatCurrency(Number(invoice.amount), invoice.currency || currency)}
                      </span>
                      <span className={invoiceChipClass(invoice.status)}>{invoice.status}</span>
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
