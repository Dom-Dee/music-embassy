import { requireAdminProfile } from './requireAuth'
import { safeExternalUrl } from './safeUrl'
import { supabase } from './supabase'
import { publishStudentNotifications } from './portalNotifications'
import { isMissingTableError } from './supabaseErrors'
import type {
  AdminEnrollment,
  AdminInvoiceRow,
  AdminLessonRow,
  AdminOverview,
  Assignment,
  AudienceMode,
  InstrumentRoster,
  Quiz,
} from '../types/admin'
import { getTotalOwing } from '../types/student'

export function resolveAudienceEnrollments(
  enrollments: AdminEnrollment[],
  mode: AudienceMode,
  enrollmentId: string,
  instrumentId: string,
): AdminEnrollment[] {
  if (mode === 'individual') {
    const match = enrollments.find((e) => e.id === enrollmentId)
    return match ? [match] : []
  }
  return enrollments.filter((e) => e.instrument_id === instrumentId)
}

export async function fetchAdminEnrollments(): Promise<AdminEnrollment[]> {
  await requireAdminProfile()
  const { data, error } = await supabase
    .from('enrollments')
    .select(
      '*, instruments(id, name, monthly_fee, description), classes(name), student:profiles!student_id(id, full_name, email, phone, created_at)',
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as AdminEnrollment[]
}

export function groupEnrollmentsByInstrument(
  enrollments: AdminEnrollment[],
): InstrumentRoster[] {
  const map = new Map<string, InstrumentRoster>()

  for (const enrollment of enrollments) {
    const instrumentId = enrollment.instrument_id
    const instrumentName = enrollment.instruments?.name ?? 'Unknown'
    const existing = map.get(instrumentId)
    if (existing) {
      existing.enrollments.push(enrollment)
    } else {
      map.set(instrumentId, {
        instrumentId,
        instrumentName,
        enrollments: [enrollment],
      })
    }
  }

  return [...map.values()].sort((a, b) =>
    a.instrumentName.localeCompare(b.instrumentName),
  )
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const [enrollments, invoices, lessons] = await Promise.all([
    fetchAdminEnrollments(),
    fetchAdminInvoices(),
    fetchAdminLessons(),
  ])

  const studentIds = new Set(enrollments.map((e) => e.student_id))
  const now = new Date()
  const weekAhead = new Date(now)
  weekAhead.setDate(weekAhead.getDate() + 7)

  const upcomingLessons = lessons.filter((lesson) => {
    const at = new Date(lesson.scheduled_at)
    return lesson.status === 'scheduled' && at >= now && at <= weekAhead
  }).length

  return {
    totalStudents: studentIds.size,
    activeEnrollments: enrollments.length,
    totalOwing: getTotalOwing(invoices),
    upcomingLessons,
    instrumentRosters: groupEnrollmentsByInstrument(enrollments),
  }
}

export async function fetchAdminLessons(): Promise<AdminLessonRow[]> {
  await requireAdminProfile()
  const { data, error } = await supabase
    .from('lesson_sessions')
    .select(
      '*, enrollments(student_id, instruments(name), student:profiles!student_id(full_name, email))',
    )
    .order('scheduled_at', { ascending: false })
    .limit(50)

  if (error) throw new Error(error.message)
  return (data ?? []) as AdminLessonRow[]
}

export async function createLessonSessionsForAudience(
  targets: AdminEnrollment[],
  input: {
    scheduled_at: string
    title: string
    notes?: string
    video_url?: string
    attachment_urls?: string[]
  },
): Promise<number> {
  await requireAdminProfile()
  if (targets.length === 0) throw new Error('Select at least one student')

  const attachments = input.attachment_urls?.length ? input.attachment_urls : null

  const rows = targets.map((enrollment) => ({
    enrollment_id: enrollment.id,
    scheduled_at: input.scheduled_at,
    title: input.title,
    notes: input.notes?.trim() || null,
    video_url: safeExternalUrl(input.video_url) || null,
    attachment_urls: attachments,
    status: 'scheduled' as const,
  }))

  const { error } = await supabase.from('lesson_sessions').insert(rows)
  if (error) throw new Error(error.message)

  await publishStudentNotifications(targets, {
    type: 'lesson',
    title: input.title,
    body: input.notes?.trim() || 'A new lesson has been added to your register.',
  })

  return rows.length
}

export async function updateLessonSession(
  id: string,
  input: {
    scheduled_at: string
    title: string
    notes?: string
    video_url?: string
    status?: 'scheduled' | 'completed' | 'cancelled'
  },
): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase
    .from('lesson_sessions')
    .update({
      scheduled_at: input.scheduled_at,
      title: input.title,
      notes: input.notes?.trim() || null,
      video_url: safeExternalUrl(input.video_url) || null,
      status: input.status ?? 'scheduled',
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteLessonSession(id: string): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase.from('lesson_sessions').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminAssignments(): Promise<Assignment[]> {
  await requireAdminProfile()
  const { data, error } = await supabase
    .from('assignments')
    .select(
      '*, enrollments(instruments(name)), student:profiles!student_id(full_name, email)',
    )
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw new Error(error.message)
  return (data ?? []) as Assignment[]
}

export async function createAssignmentsForAudience(
  targets: AdminEnrollment[],
  input: {
    title: string
    description?: string
    due_date?: string
    resource_url?: string
    attachment_urls?: string[]
    created_by: string
  },
): Promise<number> {
  await requireAdminProfile()
  if (targets.length === 0) throw new Error('Select at least one student')

  const attachments = input.attachment_urls?.length ? input.attachment_urls : null

  const rows = targets.map((enrollment) => ({
    enrollment_id: enrollment.id,
    student_id: enrollment.student_id,
    title: input.title,
    description: input.description?.trim() || null,
    due_date: input.due_date || null,
    resource_url: safeExternalUrl(input.resource_url) || null,
    attachment_urls: attachments,
    created_by: input.created_by,
  }))

  const { error } = await supabase.from('assignments').insert(rows)
  if (error) throw new Error(error.message)

  await publishStudentNotifications(targets, {
    type: 'assignment',
    title: input.title,
    body: input.description?.trim() || 'A new assignment is waiting on your dashboard.',
  })

  return rows.length
}

export async function updateAssignment(
  id: string,
  input: {
    title: string
    description?: string
    due_date?: string
    resource_url?: string
  },
): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase
    .from('assignments')
    .update({
      title: input.title,
      description: input.description?.trim() || null,
      due_date: input.due_date || null,
      resource_url: safeExternalUrl(input.resource_url) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteAssignment(id: string): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase.from('assignments').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminQuizzes(): Promise<Quiz[]> {
  await requireAdminProfile()
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      '*, enrollments(instruments(name)), student:profiles!student_id(full_name, email)',
    )
    .order('scheduled_at', { ascending: false })
    .limit(50)

  if (error) {
    if (isMissingTableError(error.message, 'quizzes')) return []
    throw new Error(error.message)
  }
  return (data ?? []) as Quiz[]
}

export async function createQuizzesForAudience(
  targets: AdminEnrollment[],
  input: {
    title: string
    description?: string
    scheduled_at: string
    created_by: string
  },
): Promise<number> {
  await requireAdminProfile()
  if (targets.length === 0) throw new Error('Select at least one student')

  const rows = targets.map((enrollment) => ({
    enrollment_id: enrollment.id,
    student_id: enrollment.student_id,
    title: input.title,
    description: input.description?.trim() || null,
    scheduled_at: input.scheduled_at,
    created_by: input.created_by,
  }))

  const { error } = await supabase.from('quizzes').insert(rows)
  if (error) {
    if (isMissingTableError(error.message, 'quizzes')) {
      throw new Error(
        'Quizzes table not set up yet. Run supabase/RUN-IN-SUPABASE.sql in the Supabase SQL Editor.',
      )
    }
    throw new Error(error.message)
  }

  await publishStudentNotifications(targets, {
    type: 'quiz',
    title: input.title,
    body: input.description?.trim() || 'A quiz has been scheduled on your register.',
  })

  return rows.length
}

export async function updateQuiz(
  id: string,
  input: {
    title: string
    description?: string
    scheduled_at: string
  },
): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase
    .from('quizzes')
    .update({
      title: input.title,
      description: input.description?.trim() || null,
      scheduled_at: input.scheduled_at,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteQuiz(id: string): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase.from('quizzes').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchAdminInvoices(): Promise<AdminInvoiceRow[]> {
  await requireAdminProfile()
  const { data, error } = await supabase
    .from('invoices')
    .select(
      '*, enrollments(instruments(name)), student:profiles!student_id(full_name, email)',
    )
    .order('due_date', { ascending: false })
    .limit(100)

  if (error) throw new Error(error.message)
  return (data ?? []) as AdminInvoiceRow[]
}

export async function markInvoicePaid(invoiceId: string): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)

  if (error) throw new Error(error.message)
}

export async function markInvoiceUnpaid(invoiceId: string): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'pending',
      paid_at: null,
    })
    .eq('id', invoiceId)

  if (error) throw new Error(error.message)
}

export async function createInvoice(input: {
  student_id: string
  enrollment_id: string
  month: string
  amount: number
  due_date: string
  currency?: string
}): Promise<void> {
  await requireAdminProfile()
  const { error } = await supabase.from('invoices').insert({
    student_id: input.student_id,
    enrollment_id: input.enrollment_id,
    month: input.month,
    amount: input.amount,
    due_date: input.due_date,
    currency: input.currency ?? 'GHS',
    status: 'pending',
  })

  if (error) throw new Error(error.message)
}

export async function generateMonthlyInvoices(
  month: string,
  dueDate: string,
): Promise<{ created: number; skipped: number }> {
  await requireAdminProfile()
  const enrollments = await fetchAdminEnrollments()
  let created = 0
  let skipped = 0

  for (const enrollment of enrollments) {
    const amount = Number(enrollment.instruments?.monthly_fee ?? 0)
    if (amount <= 0) {
      skipped++
      continue
    }

    const { data: existing, error: lookupError } = await supabase
      .from('invoices')
      .select('id')
      .eq('enrollment_id', enrollment.id)
      .eq('month', month)
      .neq('status', 'cancelled')
      .maybeSingle()

    if (lookupError) throw new Error(lookupError.message)
    if (existing) {
      skipped++
      continue
    }

    const { error } = await supabase.from('invoices').insert({
      student_id: enrollment.student_id,
      enrollment_id: enrollment.id,
      month,
      amount,
      due_date: dueDate,
      currency: 'GHS',
      status: 'pending',
    })

    if (error) {
      if (error.code === '23505') {
        skipped++
        continue
      }
      throw new Error(error.message)
    }

    created++
  }

  return { created, skipped }
}
