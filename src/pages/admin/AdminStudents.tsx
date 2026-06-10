import { useEffect, useState } from 'react'
import {
  AdminCard,
  AdminCardBody,
  AdminCardHeader,
  AdminPage,
  AdminPageIntro,
} from '../../components/admin/AdminUi'
import { fetchAdminEnrollments, groupEnrollmentsByInstrument } from '../../lib/adminData'
import type { InstrumentRoster } from '../../types/admin'
import { formatDate } from '../../types/student'

export function AdminStudents() {
  const [rosters, setRosters] = useState<InstrumentRoster[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const enrollments = await fetchAdminEnrollments()
        setRosters(groupEnrollmentsByInstrument(enrollments))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load students')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p className="text-sm text-muted">Loading roster…</p>

  if (error) {
    return (
      <AdminCard padding="md">
        <p className="text-sm text-red-200">{error}</p>
      </AdminCard>
    )
  }

  return (
    <AdminPage>
      <AdminPageIntro eyebrow="Register" title="Students by instrument" />

      {rosters.length === 0 ? (
        <AdminCard padding="md">
          <p className="text-sm text-muted">No active enrolments yet.</p>
        </AdminCard>
      ) : (
        <div className="space-y-6">
          {rosters.map((roster) => (
            <AdminCard key={roster.instrumentId} padding="none">
              <AdminCardHeader
                title={roster.instrumentName}
                action={
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                    {roster.enrollments.length}
                  </span>
                }
              />
              <AdminCardBody className="!pt-0 !px-0 !pb-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <thead>
                      <tr className="border-y border-border bg-page/25 text-[11px] uppercase tracking-[0.18em] text-muted">
                        <th className="px-6 py-3 font-semibold md:px-7">Student</th>
                        <th className="px-6 py-3 font-semibold md:px-7">Email</th>
                        <th className="px-6 py-3 font-semibold md:px-7">Enrolled</th>
                        <th className="px-6 py-3 font-semibold md:px-7">Class</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/80">
                      {roster.enrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td className="px-6 py-3 font-medium text-fg md:px-7">
                            {enrollment.student?.full_name ?? ''}
                          </td>
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
              </AdminCardBody>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminPage>
  )
}
