import { useEffect, useMemo, useState } from 'react'
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
import { useAdminToast } from '../../components/admin/AdminToastProvider'
import type { AudienceMode } from '../../types/admin'
import { AdminRecordActions } from '../../components/admin/AdminRecordActions'
import { FileUploadField } from '../../components/admin/FileUploadField'
import { Button } from '../../components/ui/Button'
import { FormField, formInputClass } from '../../components/ui/FormField'
import {
  createLessonSessionsForAudience,
  deleteLessonSession,
  fetchAdminEnrollments,
  fetchAdminLessons,
  groupEnrollmentsByInstrument,
  resolveAudienceEnrollments,
  updateLessonSession,
} from '../../lib/adminData'
import { toDatetimeLocalValue } from '../../lib/datetime'
import { uploadPortalFiles } from '../../lib/uploadPortalFile'
import type { AdminEnrollment, AdminLessonRow } from '../../types/admin'
import { formatDateTime } from '../../types/student'

export function AdminLessons() {
  const { notify } = useAdminToast()
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([])
  const [lessons, setLessons] = useState<AdminLessonRow[]>([])
  const [mode, setMode] = useState<AudienceMode>('individual')
  const [enrollmentId, setEnrollmentId] = useState('')
  const [instrumentId, setInstrumentId] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [notes, setNotes] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rosters = useMemo(() => groupEnrollmentsByInstrument(enrollments), [enrollments])

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setScheduledAt('')
    setNotes('')
    setVideoUrl('')
    setFiles([])
    setEnrollmentId('')
    setInstrumentId('')
  }

  async function load() {
    const [enr, les] = await Promise.all([
      fetchAdminEnrollments(),
      fetchAdminLessons(),
    ])
    setEnrollments(enr)
    setLessons(les)
  }

  useEffect(() => {
    void (async () => {
      try {
        await load()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load lessons')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !scheduledAt) return

    setSubmitting(true)
    setError(null)

    try {
      if (editingId) {
        await updateLessonSession(editingId, {
          title,
          scheduled_at: new Date(scheduledAt).toISOString(),
          notes,
          video_url: videoUrl.trim() || undefined,
        })
        notify('Lesson updated.')
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
      const attachmentUrls = await uploadPortalFiles(files, 'lessons')
      const count = await createLessonSessionsForAudience(targets, {
        title,
        scheduled_at: new Date(scheduledAt).toISOString(),
        notes,
        video_url: videoUrl.trim() || undefined,
        attachment_urls: attachmentUrls,
      })
      resetForm()
      notify(`Lesson published to ${count} student${count === 1 ? '' : 's'}.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save lesson')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(lesson: AdminLessonRow) {
    setEditingId(lesson.id)
    setTitle(lesson.title)
    setScheduledAt(toDatetimeLocalValue(lesson.scheduled_at))
    setNotes(lesson.notes ?? '')
    setVideoUrl(lesson.video_url ?? '')
    setFiles([])
    setError(null)
  }

  async function handleDelete(lessonId: string) {
    if (!window.confirm('Delete this lesson?')) return
    setDeletingId(lessonId)
    setError(null)
    try {
      await deleteLessonSession(lessonId)
      if (editingId === lessonId) resetForm()
      notify('Lesson deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete lesson')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p className="text-sm text-muted">Loading lessons…</p>

  return (
    <AdminPage>
      <AdminPageIntro eyebrow="Curriculum" title="Lessons" />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminSplitLayout>
        <AdminFormPanel title={editingId ? 'Edit lesson' : 'New lesson'}>
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
                enrollmentFieldId="lesson-enrollment"
                instrumentFieldId="lesson-instrument"
              />
            ) : null}
            <FormField
              label="Title"
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <FormField
              label="Date & time"
              id="lesson-datetime"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
            <FormField label="Notes" id="lesson-notes">
              <textarea
                id="lesson-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={formInputClass}
              />
            </FormField>
            <FormField
              label="Material link (optional)"
              id="lesson-video"
              type="text"
              inputMode="url"
              placeholder="https://"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
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
                    : 'Publish lesson'}
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
          title="Recent lessons"
          empty={lessons.length === 0 ? 'No lessons published yet.' : undefined}
        >
          {lessons.map((lesson) => (
            <AdminRecordCard
              key={lesson.id}
              title={lesson.title}
              meta={`${lesson.enrollments?.student?.full_name ?? 'Student'}, ${lesson.enrollments?.instruments?.name ?? 'Instrument'}`}
              detail={`${formatDateTime(lesson.scheduled_at)}, ${lesson.status}`}
              action={
                <AdminRecordActions
                  onEdit={() => startEdit(lesson)}
                  onDelete={() => void handleDelete(lesson.id)}
                  deleting={deletingId === lesson.id}
                />
              }
              body={
                lesson.notes ? (
                  <p className="text-sm leading-relaxed text-muted">{lesson.notes}</p>
                ) : undefined
              }
            />
          ))}
        </AdminListPanel>
      </AdminSplitLayout>
    </AdminPage>
  )
}
