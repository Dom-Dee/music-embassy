import { describe, expect, it } from 'vitest'
import { submissionStatusOf } from './AssignmentSubmissionReview'
import type { Assignment } from '../../types/admin'

const baseAssignment: Assignment = {
  id: '1',
  title: 'Scales',
  description: null,
  due_date: null,
  enrollment_id: 'e1',
  student_id: 's1',
  resource_url: null,
  created_by: null,
  created_at: '2026-01-01T00:00:00Z',
}

describe('submissionStatusOf', () => {
  it('defaults missing status to pending', () => {
    expect(submissionStatusOf(baseAssignment)).toBe('pending')
  })

  it('returns stored submission status', () => {
    expect(
      submissionStatusOf({ ...baseAssignment, submission_status: 'submitted' }),
    ).toBe('submitted')
  })
})
