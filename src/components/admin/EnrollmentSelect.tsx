import type { AdminEnrollment } from '../../types/admin'
import { formInputClass } from '../ui/FormField'

type EnrollmentSelectProps = {
  id: string
  enrollments: AdminEnrollment[]
  value: string
  onChange: (enrollmentId: string) => void
  required?: boolean
}

export function EnrollmentSelect({
  id,
  enrollments,
  value,
  onChange,
  required,
}: EnrollmentSelectProps) {
  return (
    <select
      id={id}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={formInputClass}
    >
      <option value="">Select student and instrument</option>
      {enrollments.map((enrollment) => (
        <option key={enrollment.id} value={enrollment.id}>
          {enrollment.student?.full_name ?? 'Student'},{' '}
          {enrollment.instruments?.name ?? 'Instrument'}
        </option>
      ))}
    </select>
  )
}
