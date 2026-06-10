import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchStudentAssignments,
  fetchStudentEnrollments,
  fetchStudentInvoices,
  fetchStudentLessons,
  fetchStudentQuizzes,
} from '../lib/studentData'
import type {
  Assignment,
  Enrollment,
  Invoice,
  InstrumentPath,
  LessonSession,
  Quiz,
} from '../types/student'
import { buildInstrumentPaths, getOwingInvoices, getTotalOwing } from '../types/student'

type DashboardState = {
  invoices: Invoice[]
  enrollments: Enrollment[]
  lessons: LessonSession[]
  instrumentPaths: InstrumentPath[]
  owingInvoices: Invoice[]
  totalOwing: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useStudentDashboard(studentId: string | undefined): DashboardState {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [lessons, setLessons] = useState<LessonSession[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    setError(null)
    try {
      const [inv, enr, les, asn, qz] = await Promise.all([
        fetchStudentInvoices(studentId),
        fetchStudentEnrollments(studentId),
        fetchStudentLessons(studentId),
        fetchStudentAssignments(studentId),
        fetchStudentQuizzes(studentId),
      ])
      setInvoices(inv)
      setEnrollments(enr)
      setLessons(les)
      setAssignments(asn)
      setQuizzes(qz)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load dashboard')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const instrumentPaths = useMemo(
    () => buildInstrumentPaths(enrollments, lessons, invoices, assignments, quizzes),
    [enrollments, lessons, invoices, assignments, quizzes],
  )
  const owingInvoices = useMemo(() => getOwingInvoices(invoices), [invoices])
  const totalOwing = useMemo(() => getTotalOwing(invoices), [invoices])

  return {
    invoices,
    enrollments,
    lessons,
    instrumentPaths,
    owingInvoices,
    totalOwing,
    loading,
    error,
    refresh,
  }
}
