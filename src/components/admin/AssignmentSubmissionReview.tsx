import { AttachmentLinks } from '../dashboard/AttachmentLinks'
import { Button } from '../ui/Button'
import type { Assignment } from '../../types/admin'
import type { AssignmentSubmissionStatus } from '../../types/student'
import { formatDateTime } from '../../types/student'

const statusLabels: Record<AssignmentSubmissionStatus, string> = {
  pending: 'Awaiting submission',
  submitted: 'Ready for review',
  reviewed: 'Reviewed',
}

const statusChipClass: Record<AssignmentSubmissionStatus, string> = {
  pending: 'status-chip status-chip--neutral',
  submitted: 'status-chip status-chip--submitted',
  reviewed: 'status-chip status-chip--reviewed',
}

export function submissionStatusOf(
  assignment: Assignment,
): AssignmentSubmissionStatus {
  return assignment.submission_status ?? 'pending'
}

export function AssignmentSubmissionBadge({ assignment }: { assignment: Assignment }) {
  const status = submissionStatusOf(assignment)

  return <span className={statusChipClass[status]}>{statusLabels[status]}</span>
}

type AssignmentSubmissionReviewProps = {
  assignment: Assignment
  reviewing: boolean
  onMarkReviewed: () => void
}

export function AssignmentSubmissionReview({
  assignment,
  reviewing,
  onMarkReviewed,
}: AssignmentSubmissionReviewProps) {
  const status = submissionStatusOf(assignment)

  if (status === 'pending') {
    return (
      <p className="mt-3 text-sm text-muted">
        The student has not submitted this assignment yet.
      </p>
    )
  }

  return (
    <div className="portal-list-card mt-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="portal-section-label">Student submission</p>
        {assignment.submitted_at ? (
          <p className="text-xs text-muted">
            Submitted {formatDateTime(assignment.submitted_at)}
          </p>
        ) : null}
      </div>

      {assignment.submission_notes ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
          {assignment.submission_notes}
        </p>
      ) : (
        <p className="text-sm text-muted">No notes were included with this submission.</p>
      )}

      <AttachmentLinks urls={assignment.submission_urls} />

      {status === 'submitted' ? (
        <Button
          type="button"
          className="text-sm"
          disabled={reviewing}
          onClick={onMarkReviewed}
        >
          {reviewing ? 'Saving…' : 'Mark as reviewed'}
        </Button>
      ) : (
        <p
          className="text-xs font-medium"
          style={{ color: 'var(--status-reviewed-fg)' }}
        >
          You have reviewed this submission.
        </p>
      )}
    </div>
  )
}
