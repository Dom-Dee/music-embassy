import { useEffect, useMemo, useState } from 'react'
import {
  AdminCard,
  AdminCardBody,
  AdminCardHeader,
  AdminPage,
  AdminPageIntro,
  SegmentTabs,
} from '../../components/admin/AdminUi'
import {
  fetchAdminEnrollments,
  groupEnrollmentsByInstrument,
  sortEnrollmentsByName,
} from '../../lib/adminData'
import type { AdminEnrollment, InstrumentRoster } from '../../types/admin'
import { formatDate } from '../../types/student'

type RosterSort = 'instrument' | 'name'

export function AdminStudents() {
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<RosterSort>('instrument')

  useEffect(() => {
    void (async () => {
      try {
        setEnrollments(await fetchAdminEnrollments())
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load students')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const rosters = useMemo(
    () => groupEnrollmentsByInstrument(enrollments),
    [enrollments],
  )

  const sortedByName = useMemo(
    () => sortEnrollmentsByName(enrollments),
    [enrollments],
  )

  if (loading) return <p className="text-sm text-muted">Loading roster…</p>

  if (error) {
    return (
      <AdminCard padding="md">
        <p className="text-sm" style={{ color: 'var(--status-danger-fg)' }}>
          {error}
        </p>
      </AdminCard>
    )
  }

  return (
    <AdminPage>
      <AdminPageIntro
        eyebrow="Register"
        title="Students by instrument"
        description="Sort the full register by instrument groups or alphabetically by student name."
      />

      <SegmentTabs
        tabs={[
          { id: 'instrument', label: 'By instrument', count: rosters.length },
          { id: 'name', label: 'By name', count: enrollments.length },
        ]}
        active={sortBy}
        onChange={setSortBy}
      />

      {enrollments.length === 0 ? (
        <AdminCard padding="md">
          <p className="text-sm text-muted">No active enrolments yet.</p>
        </AdminCard>
      ) : sortBy === 'instrument' ? (
        <div className="space-y-6">
          {rosters.map((roster) => (
            <InstrumentTable key={roster.instrumentId} roster={roster} />
          ))}
        </div>
      ) : (
        <AdminCard padding="none">
          <AdminCardHeader
            eyebrow="A–Z"
            title="All students"
            action={
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                {sortedByName.length}
              </span>
            }
          />
          <AdminCardBody className="!px-0 !pb-0">
            <EnrollmentTable
              rows={sortedByName}
              showInstrument
            />
          </AdminCardBody>
        </AdminCard>
      )}
    </AdminPage>
  )
}

function InstrumentTable({ roster }: { roster: InstrumentRoster }) {
  return (
    <AdminCard padding="none">
      <AdminCardHeader
        title={roster.instrumentName}
        action={
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {roster.enrollments.length}
          </span>
        }
      />
      <AdminCardBody className="!px-0 !pb-0">
        <EnrollmentTable rows={roster.enrollments} />
      </AdminCardBody>
    </AdminCard>
  )
}

function EnrollmentTable({
  rows,
  showInstrument = false,
}: {
  rows: AdminEnrollment[]
  showInstrument?: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-y border-border bg-page/25 text-[11px] uppercase tracking-[0.18em] text-muted">
            <th className="px-6 py-3 font-semibold md:px-7">Student</th>
            {showInstrument ? (
              <th className="px-6 py-3 font-semibold md:px-7">Instrument</th>
            ) : null}
            <th className="px-6 py-3 font-semibold md:px-7">Email</th>
            <th className="px-6 py-3 font-semibold md:px-7">Enrolled</th>
            <th className="px-6 py-3 font-semibold md:px-7">Class</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/80">
          {rows.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="px-6 py-3 font-medium text-fg md:px-7">
                {enrollment.student?.full_name ?? ''}
              </td>
              {showInstrument ? (
                <td className="px-6 py-3 text-muted md:px-7">
                  {enrollment.instruments?.name ?? ''}
                </td>
              ) : null}
              <td className="px-6 py-3 text-muted md:px-7">
                {enrollment.student?.email ?? ''}
              </td>
              <td className="px-6 py-3 text-muted md:px-7">
                {formatDate(enrollment.start_date)}
              </td>
              <td className="px-6 py-3 text-muted md:px-7">
                {enrollment.classes?.name ?? ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
