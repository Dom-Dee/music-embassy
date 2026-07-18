import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AdminCard,
  AdminCardBody,
  AdminCardHeader,
  AdminPage,
  AdminStatCell,
  AdminStatGrid,
  SegmentTabs,
} from '../../components/admin/AdminUi'
import {
  fetchAdminOverview,
  sortEnrollmentsByName,
} from '../../lib/adminData'
import type { AdminEnrollment, AdminOverview } from '../../types/admin'
import { formatCurrency } from '../../types/student'

type RosterSort = 'instrument' | 'name'

export function AdminOverview() {
  const [data, setData] = useState<AdminOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<RosterSort>('instrument')

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

  const flatEnrollments = useMemo(() => {
    if (!data) return []
    return data.instrumentRosters.flatMap((roster) => roster.enrollments)
  }, [data])

  const sortedByName = useMemo(
    () => sortEnrollmentsByName(flatEnrollments),
    [flatEnrollments],
  )

  const sortedRosters = useMemo(() => {
    if (!data) return []
    if (sortBy === 'instrument') {
      return data.instrumentRosters.map((roster) => ({
        ...roster,
        enrollments: sortEnrollmentsByName(roster.enrollments),
      }))
    }
    return []
  }, [data, sortBy])

  if (loading) {
    return <p className="text-sm text-muted">Loading overview…</p>
  }

  if (error || !data) {
    return (
      <AdminCard padding="md">
        <p
          className="text-sm"
          style={{ color: 'var(--status-danger-fg)' }}
        >
          {error ?? 'Overview unavailable'}
        </p>
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
        <AdminCardBody>
          <div className="mb-5">
            <SegmentTabs
              tabs={[
                { id: 'instrument', label: 'By instrument' },
                { id: 'name', label: 'By name' },
              ]}
              active={sortBy}
              onChange={setSortBy}
            />
          </div>

          {sortBy === 'instrument' ? (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedRosters.map((roster) => (
                <div
                  key={roster.instrumentId}
                  className="overflow-hidden rounded-xl border border-border bg-page/25"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="font-display text-lg text-fg">
                      {roster.instrumentName}
                    </h3>
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
                          <p className="text-xs text-muted">
                            {enrollment.student?.email}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-page/25">
              {sortedByName.map((enrollment: AdminEnrollment) => (
                <li
                  key={enrollment.id}
                  className="flex flex-wrap items-start justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-fg">
                      {enrollment.student?.full_name ?? 'Student'}
                    </p>
                    <p className="text-xs text-muted">{enrollment.student?.email}</p>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                    {enrollment.instruments?.name ?? 'Instrument'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCardBody>
      </AdminCard>

      <AdminCard padding="none">
        <AdminCardHeader eyebrow="Shortcuts" title="Portal modules" />
        <AdminCardBody>
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
