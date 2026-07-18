import { useEffect, useState } from 'react'
import { FileUploadField } from '../admin/FileUploadField'
import { Button } from '../ui/Button'
import { AttachmentLinks } from './AttachmentLinks'
import { useNow } from '../../hooks/useNow'
import { submitStudentAssignment } from '../../lib/studentData'
import { uploadPortalFiles } from '../../lib/uploadPortalFile'
import type { Assignment } from '../../types/student'
import {
  canEditAssignmentSubmission,
  formatDateTime,
  formatSubmissionEditRemaining,
} from '../../types/student'

type AssignmentSubmissionFormProps = {
  assignment: Assignment
  studentId: string
  onSubmitted: () => void
}

export function AssignmentSubmissionForm({
  assignment,
  studentId,
  onSubmitted,
}: AssignmentSubmissionFormProps) {
  const nowMs = useNow(60_000)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(assignment.submission_notes ?? '')
  const [files, setFiles] = useState<File[]>([])
  const [keptUrls, setKeptUrls] = useState<string[]>(assignment.submission_urls ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const status = assignment.submission_status ?? 'pending'
  const isReviewed = status === 'reviewed'
  const isSubmitted = status === 'submitted' || isReviewed
  const canEdit = canEditAssignmentSubmission(assignment, nowMs)
  const editRemaining = formatSubmissionEditRemaining(assignment, nowMs)
  const showForm = !isSubmitted || editing

  useEffect(() => {
    if (!editing) {
      setNotes(assignment.submission_notes ?? '')
      setKeptUrls(assignment.submission_urls ?? [])
      setFiles([])
      setError(null)
    }
  }, [assignment.submission_notes, assignment.submission_urls, editing])

  useEffect(() => {
    if (editing && !canEdit) {
      setEditing(false)
    }
  }, [canEdit, editing])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!notes.trim() && files.length === 0 && keptUrls.length === 0) {
      setError('Add notes or upload at least one file.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const uploaded = await uploadPortalFiles(files, 'assignment-submissions', studentId)
      const submission_urls = [...keptUrls, ...uploaded]

      await submitStudentAssignment(assignment.id, {
        submission_notes: notes,
        submission_urls,
      })
      setEditing(false)
      setFiles([])
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit assignment')
    } finally {
      setSubmitting(false)
    }
  }

  if (isSubmitted && !showForm) {
    return (
      <div
        className={`mt-3 rounded-xl border px-4 py-3 ${
          isReviewed
            ? 'border-[color:var(--status-reviewed-border)] bg-[color:var(--status-reviewed-bg)]'
            : 'border-[color:var(--status-submitted-border)] bg-[color:var(--status-submitted-bg)]'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{
                color: isReviewed
                  ? 'var(--status-reviewed-fg)'
                  : 'var(--status-submitted-fg)',
              }}
            >
              {isReviewed ? 'Reviewed' : 'Submitted'}
              {assignment.submitted_at
                ? ` · ${formatDateTime(assignment.submitted_at)}`
                : ''}
            </p>
            {canEdit && editRemaining ? (
              <p className="mt-1 text-xs text-muted">{editRemaining}</p>
            ) : null}
            {!canEdit && !isReviewed ? (
              <p className="mt-1 text-xs text-muted">
                Edit window closed. This submission is locked.
              </p>
            ) : null}
            {isReviewed ? (
              <p className="mt-1 text-xs text-muted">
                Your instructor has reviewed this work.
              </p>
            ) : null}
          </div>
          {canEdit ? (
            <Button
              type="button"
              variant="secondary"
              className="text-sm"
              onClick={() => setEditing(true)}
            >
              Edit submission
            </Button>
          ) : null}
        </div>
        {assignment.submission_notes ? (
          <p className="mt-2 text-sm leading-relaxed text-muted whitespace-pre-wrap">
            {assignment.submission_notes}
          </p>
        ) : null}
        <AttachmentLinks urls={assignment.submission_urls} />
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="portal-list-card mt-3 space-y-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/85">
            {editing ? 'Update your submission' : 'Submit your work'}
          </p>
          {editing && editRemaining ? (
            <p className="mt-1 text-xs text-muted">{editRemaining}</p>
          ) : null}
        </div>
        {editing ? (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs text-muted transition hover:text-fg"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes for your instructor"
        className="w-full rounded-xl border border-border bg-page/60 px-4 py-3 text-sm text-fg placeholder:text-muted/70 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/18"
      />

      {keptUrls.length > 0 ? (
        <div className="rounded-xl border border-border/80 bg-page/40 px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Attached files
            </p>
            <button
              type="button"
              onClick={() => setKeptUrls([])}
              className="text-xs text-muted transition hover:text-fg"
            >
              Remove files
            </button>
          </div>
          <AttachmentLinks urls={keptUrls} />
        </div>
      ) : null}

      <FileUploadField
        label={keptUrls.length > 0 ? 'Add more files (optional)' : 'Upload files (optional)'}
        files={files}
        onChange={setFiles}
      />
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
      <Button type="submit" className="text-sm" disabled={submitting}>
        {submitting
          ? editing
            ? 'Saving…'
            : 'Submitting…'
          : editing
            ? 'Save changes'
            : 'Submit assignment'}
      </Button>
    </form>
  )
}
