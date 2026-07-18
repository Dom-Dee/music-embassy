export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export type Instrument = {
  id: string
  name: string
  description: string | null
  monthly_fee: number
  active: boolean
  image_url?: string | null
}

export type Invoice = {
  id: string
  student_id: string
  enrollment_id: string
  month: string
  amount: number
  currency: string
  due_date: string
  status: InvoiceStatus
  paid_at: string | null
  created_at: string
}

export type Enrollment = {
  id: string
  student_id: string
  instrument_id: string
  class_id: string | null
  start_date: string
  status: 'active' | 'paused' | 'completed'
  created_at: string
  instruments: {
    name: string
    monthly_fee: number
    description: string | null
  } | null
  classes: { name: string } | null
}

export type LessonSession = {
  id: string
  enrollment_id: string
  scheduled_at: string
  title: string
  notes: string | null
  video_url: string | null
  attachment_urls?: string[] | null
  status: 'scheduled' | 'completed' | 'cancelled'
  enrollments: {
    instruments: { name: string } | null
  } | null
}

export type AssignmentSubmissionStatus = 'pending' | 'submitted' | 'reviewed'

export type Assignment = {
  id: string
  enrollment_id: string | null
  student_id: string
  title: string
  description: string | null
  due_date: string | null
  resource_url: string | null
  attachment_urls?: string[] | null
  submission_notes?: string | null
  submission_urls?: string[] | null
  submitted_at?: string | null
  submission_status?: AssignmentSubmissionStatus
  created_at: string
}

export type Quiz = {
  id: string
  enrollment_id: string
  student_id: string
  title: string
  description: string | null
  scheduled_at: string
  created_at: string
}

export type InstrumentPath = {
  enrollment: Enrollment
  lessons: LessonSession[]
  invoices: Invoice[]
  assignments: Assignment[]
  quizzes: Quiz[]
}

export function isInvoiceOwing(invoice: Invoice): boolean {
  if (invoice.status === 'overdue') return true
  if (invoice.status !== 'pending') return false
  const due = new Date(invoice.due_date)
  due.setHours(23, 59, 59, 999)
  return due.getTime() <= Date.now()
}

export function getOwingInvoices(invoices: Invoice[]): Invoice[] {
  return invoices.filter(isInvoiceOwing)
}

export function getTotalOwing(invoices: Invoice[]): number {
  return getOwingInvoices(invoices).reduce((sum, inv) => sum + Number(inv.amount), 0)
}

/** Students may edit/resubmit for this long after the first submission. */
export const SUBMISSION_EDIT_WINDOW_MS = 24 * 60 * 60 * 1000

export function isAssignmentPending(assignment: Assignment): boolean {
  return (assignment.submission_status ?? 'pending') === 'pending'
}

export function countPendingAssignments(assignments: Assignment[]): number {
  return assignments.filter(isAssignmentPending).length
}

export function assignmentStatusLabel(
  status: AssignmentSubmissionStatus | null | undefined,
): string {
  switch (status ?? 'pending') {
    case 'pending':
      return 'To do'
    case 'submitted':
      return 'Submitted'
    case 'reviewed':
      return 'Reviewed'
  }
}

const ASSIGNMENT_STATUS_ORDER: Record<AssignmentSubmissionStatus, number> = {
  pending: 0,
  submitted: 1,
  reviewed: 2,
}

export function assignmentWorkflowRank(
  status: AssignmentSubmissionStatus | null | undefined,
): number {
  return ASSIGNMENT_STATUS_ORDER[status ?? 'pending']
}

/** To do first, then submitted, then reviewed. Within a group: soonest due / newest submit. */
export function compareAssignmentsByWorkflow(a: Assignment, b: Assignment): number {
  const rankDiff =
    assignmentWorkflowRank(a.submission_status) -
    assignmentWorkflowRank(b.submission_status)
  if (rankDiff !== 0) return rankDiff

  const status = a.submission_status ?? 'pending'
  if (status === 'pending') {
    const aDue = a.due_date ? new Date(a.due_date).getTime() : Number.POSITIVE_INFINITY
    const bDue = b.due_date ? new Date(b.due_date).getTime() : Number.POSITIVE_INFINITY
    if (aDue !== bDue) return aDue - bDue
    return a.title.localeCompare(b.title)
  }

  const aSubmitted = a.submitted_at ? new Date(a.submitted_at).getTime() : 0
  const bSubmitted = b.submitted_at ? new Date(b.submitted_at).getTime() : 0
  if (aSubmitted !== bSubmitted) return bSubmitted - aSubmitted
  return a.title.localeCompare(b.title)
}

export function sortAssignmentsByWorkflow<T extends Assignment>(assignments: T[]): T[] {
  return [...assignments].sort(compareAssignmentsByWorkflow)
}

export function groupAssignmentsByWorkflow<T extends Assignment>(
  assignments: T[],
): { status: AssignmentSubmissionStatus; label: string; items: T[] }[] {
  const sorted = sortAssignmentsByWorkflow(assignments)
  const groups: {
    status: AssignmentSubmissionStatus
    label: string
    items: T[]
  }[] = [
    { status: 'pending', label: 'To do', items: [] },
    { status: 'submitted', label: 'Submitted', items: [] },
    { status: 'reviewed', label: 'Reviewed', items: [] },
  ]

  for (const assignment of sorted) {
    const status = assignment.submission_status ?? 'pending'
    const group = groups.find((entry) => entry.status === status)
    group?.items.push(assignment)
  }

  return groups.filter((group) => group.items.length > 0)
}

export function submissionEditDeadlineMs(assignment: Assignment): number | null {
  if (!assignment.submitted_at) return null
  return new Date(assignment.submitted_at).getTime() + SUBMISSION_EDIT_WINDOW_MS
}

/** True while status is submitted and still inside the 24-hour edit window. */
export function canEditAssignmentSubmission(
  assignment: Assignment,
  nowMs: number = Date.now(),
): boolean {
  if ((assignment.submission_status ?? 'pending') !== 'submitted') return false
  const deadline = submissionEditDeadlineMs(assignment)
  if (deadline === null) return false
  return nowMs < deadline
}

export function formatSubmissionEditRemaining(
  assignment: Assignment,
  nowMs: number = Date.now(),
): string | null {
  const deadline = submissionEditDeadlineMs(assignment)
  if (deadline === null) return null
  const remainingMs = deadline - nowMs
  if (remainingMs <= 0) return null

  const totalMinutes = Math.ceil(remainingMs / (60 * 1000))
  if (totalMinutes < 60) {
    return `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'} left to edit`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (minutes === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} left to edit`
  }
  return `${hours}h ${minutes}m left to edit`
}

export function buildInstrumentPaths(
  enrollments: Enrollment[],
  lessons: LessonSession[],
  invoices: Invoice[],
  assignments: Assignment[] = [],
  quizzes: Quiz[] = [],
): InstrumentPath[] {
  const active = enrollments.filter((e) => e.status === 'active')

  return active.map((enrollment) => ({
    enrollment,
    lessons: lessons.filter((l) => l.enrollment_id === enrollment.id),
    invoices: invoices.filter((inv) => inv.enrollment_id === enrollment.id),
    assignments: assignments.filter((a) => a.enrollment_id === enrollment.id),
    quizzes: quizzes.filter((q) => q.enrollment_id === enrollment.id),
  }))
}

export function formatCurrency(amount: number, currency = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
