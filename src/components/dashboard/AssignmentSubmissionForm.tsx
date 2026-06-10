import { useState } from 'react'
import { FileUploadField } from '../admin/FileUploadField'
import { Button } from '../ui/Button'
import { AttachmentLinks } from './AttachmentLinks'
import { submitStudentAssignment } from '../../lib/studentData'
import { uploadPortalFiles } from '../../lib/uploadPortalFile'
import type { Assignment } from '../../types/student'
import { formatDateTime } from '../../types/student'

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
  const [notes, setNotes] = useState(assignment.submission_notes ?? '')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSubmitted = assignment.submission_status === 'submitted' || assignment.submission_status === 'reviewed'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!notes.trim() && files.length === 0 && !assignment.submission_urls?.length) {
      setError('Add notes or upload at least one file.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const uploaded = await uploadPortalFiles(files, 'assignment-submissions', studentId)
      const existing = assignment.submission_urls ?? []
      const submission_urls = [...existing, ...uploaded]

      await submitStudentAssignment(assignment.id, {
        submission_notes: notes,
        submission_urls,
      })
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit assignment')
    } finally {
      setSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mt-3 rounded-xl border border-gold/20 bg-gold/[0.05] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          Submitted
          {assignment.submitted_at
            ? ` · ${formatDateTime(assignment.submitted_at)}`
            : ''}
        </p>
        {assignment.submission_notes ? (
          <p className="mt-2 text-sm leading-relaxed text-muted">{assignment.submission_notes}</p>
        ) : null}
        <AttachmentLinks urls={assignment.submission_urls} />
      </div>
    )
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="mt-3 space-y-3 rounded-xl border border-border bg-surface/40 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/85">
        Submit your work
      </p>
      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes for your instructor"
        className="w-full rounded-xl border border-border bg-page/60 px-4 py-3 text-sm text-fg placeholder:text-muted/70 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/18"
      />
      <FileUploadField label="Upload files (optional)" files={files} onChange={setFiles} />
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
      <Button type="submit" className="text-sm" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit assignment'}
      </Button>
    </form>
  )
}
