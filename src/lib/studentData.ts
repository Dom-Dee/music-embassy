import { requireOwnStudentId, requireSessionUserId } from './requireAuth'
import { supabase } from './supabase'
import { isMissingTableError } from './supabaseErrors'
import type {
  Assignment,
  Enrollment,
  Invoice,
  LessonSession,
  Quiz,
} from '../types/student'

export async function fetchStudentInvoices(studentId: string): Promise<Invoice[]> {
  await requireOwnStudentId(studentId)
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('student_id', studentId)
    .order('due_date', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Invoice[]
}

export async function fetchStudentEnrollments(
  studentId: string,
): Promise<Enrollment[]> {
  await requireOwnStudentId(studentId)
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, instruments(name, monthly_fee, description), classes(name)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Enrollment[]
}

export async function fetchStudentLessons(
  studentId: string,
): Promise<LessonSession[]> {
  await requireOwnStudentId(studentId)
  const { data, error } = await supabase
    .from('lesson_sessions')
    .select('*, enrollments!inner(student_id, instruments(name))')
    .eq('enrollments.student_id', studentId)
    .in('status', ['scheduled', 'completed'])
    .order('scheduled_at', { ascending: false })
    .limit(24)

  if (error) throw new Error(error.message)
  return (data ?? []) as LessonSession[]
}

export async function fetchStudentAssignments(
  studentId: string,
): Promise<Assignment[]> {
  await requireOwnStudentId(studentId)
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    if (isMissingTableError(error.message, 'assignments')) return []
    throw new Error(error.message)
  }
  return (data ?? []) as Assignment[]
}

export async function fetchStudentQuizzes(studentId: string): Promise<Quiz[]> {
  await requireOwnStudentId(studentId)
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('student_id', studentId)
    .order('scheduled_at', { ascending: true })
    .limit(50)

  if (error) {
    if (isMissingTableError(error.message, 'quizzes')) return []
    throw new Error(error.message)
  }
  return (data ?? []) as Quiz[]
}

export async function submitStudentAssignment(
  assignmentId: string,
  input: {
    submission_notes?: string
    submission_urls?: string[]
  },
): Promise<void> {
  const userId = await requireSessionUserId()
  const { data: assignment, error: lookupError } = await supabase
    .from('assignments')
    .select('student_id')
    .eq('id', assignmentId)
    .single()

  if (lookupError || !assignment) {
    throw new Error('Assignment not found.')
  }
  if (assignment.student_id !== userId) {
    throw new Error('Access denied.')
  }

  const { error } = await supabase.rpc('submit_assignment', {
    p_assignment_id: assignmentId,
    p_notes: input.submission_notes ?? '',
    p_urls: input.submission_urls?.length ? input.submission_urls : [],
  })

  if (error) throw new Error(error.message)
}
