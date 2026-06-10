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
