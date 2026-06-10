import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import {
  AdminAlert,
  AdminFormPanel,
  AdminListPanel,
  AdminPage,
  AdminPageIntro,
  AdminRecordCard,
  AdminSplitLayout,
  AudiencePicker,
} from '../../components/admin/AdminUi'
import type { AudienceMode } from '../../types/admin'
import { AdminRecordActions } from '../../components/admin/AdminRecordActions'
import { FileUploadField } from '../../components/admin/FileUploadField'
import { Button } from '../../components/ui/Button'
import { FormField, formInputClass } from '../../components/ui/FormField'
import {
  createAssignmentsForAudience,
  deleteAssignment,
  fetchAdminAssignments,
  fetchAdminEnrollments,
  groupEnrollmentsByInstrument,
  resolveAudienceEnrollments,
  updateAssignment,
} from '../../lib/adminData'
import { uploadPortalFiles } from '../../lib/uploadPortalFile'
import type { AdminEnrollment, Assignment } from '../../types/admin'
import { formatDate } from '../../types/student'

export function AdminAssignments() {
  const { profile } = useAuth()
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [mode, setMode] = useState<AudienceMode>('individual')
  const [enrollmentId, setEnrollmentId] = useState('')
  const [instrumentId, setInstrumentId] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const rosters = useMemo(() => groupEnrollmentsByInstrument(enrollments), [enrollments])

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setDueDate('')
    setResourceUrl('')
    setFiles([])
    setEnrollmentId('')
    setInstrumentId('')
  }

  async function load() {
    const [enr, asn] = await Promise.all([
      fetchAdminEnrollments(),
      fetchAdminAssignments(),
    ])
    setEnrollments(enr)
    setAssignments(asn)
  }

  useEffect(() => {
    void (async () => {
      try {
        await load()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load assignments')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || !title) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (editingId) {
        await updateAssignment(editingId, {
          title,
          description,
          due_date: dueDate || undefined,
          resource_url: resourceUrl.trim() || undefined,
        })
        setSuccess('Assignment updated.')
        resetForm()
        await load()
        return
      }

      const targets = resolveAudienceEnrollments(
        enrollments,
        mode,
        enrollmentId,
        instrumentId,
      )
      const attachmentUrls = await uploadPortalFiles(files, 'assignments')
      const count = await createAssignmentsForAudience(targets, {
        title,
        description,
        due_date: dueDate || undefined,
        resource_url: resourceUrl.trim() || undefined,
        attachment_urls: attachmentUrls,
        created_by: profile.id,
      })
      resetForm()
      setSuccess(`Assignment sent to ${count} student${count === 1 ? '' : 's'}.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save assignment')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(assignment: Assignment) {
    setEditingId(assignment.id)
    setTitle(assignment.title)
    setDescription(assignment.description ?? '')
    setDueDate(assignment.due_date ?? '')
    setResourceUrl(assignment.resource_url ?? '')
    setFiles([])
    setSuccess(null)
    setError(null)
  }

  async function handleDelete(assignmentId: string) {
    if (!window.confirm('Delete this assignment?')) return
    setDeletingId(assignmentId)
    setError(null)
    try {
      await deleteAssignment(assignmentId)
      if (editingId === assignmentId) resetForm()
      setSuccess('Assignment deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete assignment')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p className="text-sm text-muted">Loading assignments…</p>

  return (
    <AdminPage>
      <AdminPageIntro eyebrow="Homework" title="Assignments" />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {success ? <AdminAlert tone="success">{success}</AdminAlert> : null}

      <AdminSplitLayout>
        <AdminFormPanel title={editingId ? 'Edit assignment' : 'New assignment'}>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            {!editingId ? (
              <AudiencePicker
                enrollments={enrollments}
                rosters={rosters}
                mode={mode}
                onModeChange={setMode}
                enrollmentId={enrollmentId}
                onEnrollmentIdChange={setEnrollmentId}
                instrumentId={instrumentId}
                onInstrumentIdChange={setInstrumentId}
                enrollmentFieldId="assignment-enrollment"
                instrumentFieldId="assignment-instrument"
              />
            ) : null}
            <FormField
              label="Title"
              id="assignment-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <FormField label="Instructions" id="assignment-description">
              <textarea
                id="assignment-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={formInputClass}
              />
            </FormField>
            <FormField
              label="Due date"
              id="assignment-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <FormField
              label="Resource link (optional)"
              id="assignment-resource"
              type="text"
              inputMode="url"
              placeholder="https://"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
            />
            {!editingId ? (
              <FileUploadField
                label="Upload files (optional)"
                files={files}
                onChange={setFiles}
              />
            ) : null}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting
                  ? 'Saving…'
                  : editingId
                    ? 'Save changes'
                    : 'Publish assignment'}
              </Button>
              {editingId ? (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </AdminFormPanel>

        <AdminListPanel
          eyebrow="Published"
          title="Recent assignments"
          empty={assignments.length === 0 ? 'No assignments published yet.' : undefined}
        >
          {assignments.map((assignment) => (
            <AdminRecordCard
              key={assignment.id}
              title={assignment.title}
              meta={`${assignment.student?.full_name ?? 'Student'}, ${assignment.enrollments?.instruments?.name ?? 'Instrument'}`}
              detail={assignment.due_date ? `Due ${formatDate(assignment.due_date)}` : undefined}
              action={
                <AdminRecordActions
                  onEdit={() => startEdit(assignment)}
                  onDelete={() => void handleDelete(assignment.id)}
                  deleting={deletingId === assignment.id}
                />
              }
              body={
                assignment.description ? (
                  <p className="text-sm leading-relaxed text-muted">{assignment.description}</p>
                ) : undefined
              }
            />
          ))}
        </AdminListPanel>
      </AdminSplitLayout>
    </AdminPage>
  )
}
