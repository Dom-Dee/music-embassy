import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AdminCard,
  AdminCardBody,
  AdminCardHeader,
  AdminPage,
  AdminStatCell,
  AdminStatGrid,
} from '../../components/admin/AdminUi'
import { fetchAdminOverview } from '../../lib/adminData'
import type { AdminOverview } from '../../types/admin'
import { formatCurrency } from '../../types/student'

export function AdminOverview() {
  const [data, setData] = useState<AdminOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        setData(await fetchAdminOverview())
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load overview')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <p className="text-sm text-muted">Loading overview…</p>
  }

  if (error || !data) {
    return (
      <AdminCard padding="md">
        <p className="text-sm text-red-200">{error ?? 'Overview unavailable'}</p>
      </AdminCard>
    )
  }

  const stats = [
    { label: 'Students', value: String(data.totalStudents) },
    { label: 'Enrolments', value: String(data.activeEnrollments) },
    {
      label: 'Outstanding',
      value: formatCurrency(data.totalOwing),
      emphasis: data.totalOwing > 0,
    },
    { label: 'This week', value: String(data.upcomingLessons) },
  ]

  return (
    <AdminPage>
      <AdminStatGrid>
        {stats.map((stat) => (
          <AdminStatCell key={stat.label} {...stat} />
        ))}
      </AdminStatGrid>

      <AdminCard padding="none">
        <AdminCardHeader
          eyebrow="Roster"
          title="Students by instrument"
          action={
            <Link
              to="/admin/students"
              className="text-sm text-gold hover:underline underline-offset-4"
            >
              Full register →
            </Link>
          }
        />
        <AdminCardBody className="!pt-0">
          <div className="grid gap-4 md:grid-cols-2">
            {data.instrumentRosters.map((roster) => (
              <div
                key={roster.instrumentId}
                className="overflow-hidden rounded-xl border border-border bg-page/25"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="font-display text-lg text-fg">{roster.instrumentName}</h3>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                    {roster.enrollments.length}
                  </span>
                </div>
                {roster.enrollments.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted">No students yet.</p>
                ) : (
                  <ul className="divide-y divide-border/80">
                    {roster.enrollments.map((enrollment) => (
                      <li key={enrollment.id} className="px-4 py-3">
                        <p className="text-sm font-medium text-fg">
                          {enrollment.student?.full_name ?? 'Student'}
                        </p>
                        <p className="text-xs text-muted">{enrollment.student?.email}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </AdminCardBody>
      </AdminCard>

      <AdminCard padding="none">
        <AdminCardHeader eyebrow="Shortcuts" title="Portal modules" />
        <AdminCardBody className="!pt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/admin/lessons', title: 'Lessons' },
              { to: '/admin/assignments', title: 'Assignments' },
              { to: '/admin/quizzes', title: 'Quizzes' },
              { to: '/admin/finance', title: 'Finance' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-xl border border-border bg-page/25 p-4 transition-colors hover:border-gold/30 hover:bg-page/40"
              >
                <p className="font-display text-lg text-fg">{action.title}</p>
              </Link>
            ))}
          </div>
        </AdminCardBody>
      </AdminCard>
    </AdminPage>
  )
}
