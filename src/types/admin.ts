import type { Enrollment, Invoice, LessonSession } from './student'

export type AdminProfile = {
  id: string
  full_name: string
  email: string
  phone: string | null
  created_at: string
}

export type AdminEnrollment = Enrollment & {
  student: AdminProfile | null
  instruments: {
    id: string
    name: string
    monthly_fee: number
  } | null
}

export type InstrumentRoster = {
  instrumentId: string
  instrumentName: string
  enrollments: AdminEnrollment[]
}

export type Assignment = {
  id: string
  title: string
  description: string | null
  due_date: string | null
  enrollment_id: string | null
  student_id: string
  resource_url: string | null
  attachment_urls?: string[] | null
  created_by: string | null
  created_at: string
  enrollments?: {
    instruments: { name: string } | null
  } | null
  student?: { full_name: string; email: string } | null
}

export type AdminOverview = {
  totalStudents: number
  activeEnrollments: number
  totalOwing: number
  upcomingLessons: number
  instrumentRosters: InstrumentRoster[]
}

export type AdminLessonRow = LessonSession & {
  enrollments: {
    student_id: string
    instruments: { name: string } | null
    student: { full_name: string; email: string } | null
  } | null
}

export type AdminInvoiceRow = Invoice & {
  enrollments: {
    instruments: { name: string } | null
  } | null
  student: { full_name: string; email: string } | null
}

export type Quiz = {
  id: string
  title: string
  description: string | null
  scheduled_at: string
  enrollment_id: string
  student_id: string
  created_by: string | null
  created_at: string
  enrollments?: {
    instruments: { name: string } | null
  } | null
  student?: { full_name: string; email: string } | null
}

export type AudienceMode = 'individual' | 'instrument'
