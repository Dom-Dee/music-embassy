import { requireOwnStudentId } from './requireAuth'
import { supabase } from './supabase'
import { fetchStudentEnrollments } from './studentData'

const DUPLICATE_MESSAGE = 'Instrument already being learnt by you'

export async function getActiveEnrolledInstrumentIds(
  studentId: string,
): Promise<Set<string>> {
  await requireOwnStudentId(studentId)
  const enrollments = await fetchStudentEnrollments(studentId)
  return new Set(
    enrollments
      .filter((enrollment) => enrollment.status === 'active')
      .map((enrollment) => enrollment.instrument_id),
  )
}

export async function createStudentEnrollments(
  studentId: string,
  instrumentIds: string[],
): Promise<void> {
  await requireOwnStudentId(studentId)
  if (instrumentIds.length === 0) return

  const activeInstrumentIds = await getActiveEnrolledInstrumentIds(studentId)
  const hasDuplicate = instrumentIds.some((id) => activeInstrumentIds.has(id))
  if (hasDuplicate) {
    throw new Error(DUPLICATE_MESSAGE)
  }

  const today = new Date().toISOString().slice(0, 10)
  const rows = instrumentIds.map((instrument_id) => ({
    student_id: studentId,
    instrument_id,
    status: 'active' as const,
    start_date: today,
  }))

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20_000)

  try {
    const { error } = await supabase
      .from('enrollments')
      .insert(rows)
      .abortSignal(controller.signal)
    if (error) {
      if (error.code === '23505') {
        throw new Error(DUPLICATE_MESSAGE)
      }
      throw new Error(error.message)
    }
  } finally {
    clearTimeout(timer)
  }
}
