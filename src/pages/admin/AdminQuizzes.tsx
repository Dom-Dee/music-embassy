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
import { Button } from '../../components/ui/Button'
import { FormField, formInputClass } from '../../components/ui/FormField'
import {
  createQuizzesForAudience,
  deleteQuiz,
  fetchAdminEnrollments,
  fetchAdminQuizzes,
  groupEnrollmentsByInstrument,
  resolveAudienceEnrollments,
  updateQuiz,
} from '../../lib/adminData'
import { toDatetimeLocalValue } from '../../lib/datetime'
import type { AdminEnrollment, Quiz } from '../../types/admin'
import { formatDateTime } from '../../types/student'

export function AdminQuizzes() {
  const { profile } = useAuth()
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [mode, setMode] = useState<AudienceMode>('individual')
  const [enrollmentId, setEnrollmentId] = useState('')
  const [instrumentId, setInstrumentId] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const rosters = useMemo(() => groupEnrollmentsByInstrument(enrollments), [enrollments])

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setScheduledAt('')
    setEnrollmentId('')
    setInstrumentId('')
  }

  async function load() {
    const [enr, qz] = await Promise.all([
      fetchAdminEnrollments(),
      fetchAdminQuizzes(),
    ])
    setEnrollments(enr)
    setQuizzes(qz)
  }

  useEffect(() => {
    void (async () => {
      try {
        await load()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load quizzes')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || !title || !scheduledAt) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (editingId) {
        await updateQuiz(editingId, {
          title,
          description,
          scheduled_at: new Date(scheduledAt).toISOString(),
        })
        setSuccess('Quiz updated.')
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
      const count = await createQuizzesForAudience(targets, {
        title,
        description,
        scheduled_at: new Date(scheduledAt).toISOString(),
        created_by: profile.id,
      })
      resetForm()
      setSuccess(`Quiz scheduled for ${count} student${count === 1 ? '' : 's'}.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save quiz')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(quiz: Quiz) {
    setEditingId(quiz.id)
    setTitle(quiz.title)
    setDescription(quiz.description ?? '')
    setScheduledAt(toDatetimeLocalValue(quiz.scheduled_at))
    setSuccess(null)
    setError(null)
  }

  async function handleDelete(quizId: string) {
    if (!window.confirm('Delete this quiz?')) return
    setDeletingId(quizId)
    setError(null)
    try {
      await deleteQuiz(quizId)
      if (editingId === quizId) resetForm()
      setSuccess('Quiz deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete quiz')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p className="text-sm text-muted">Loading quizzes…</p>

  return (
    <AdminPage>
      <AdminPageIntro eyebrow="Assessment" title="Quizzes & tests" />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {success ? <AdminAlert tone="success">{success}</AdminAlert> : null}

      <AdminSplitLayout>
        <AdminFormPanel title={editingId ? 'Edit quiz' : 'Schedule quiz'}>
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
                enrollmentFieldId="quiz-enrollment"
                instrumentFieldId="quiz-instrument"
              />
            ) : null}
            <FormField
              label="Title"
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <FormField
              label="Scheduled date & time"
              id="quiz-datetime"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
            <FormField label="Details" id="quiz-description">
              <textarea
                id="quiz-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={formInputClass}
              />
            </FormField>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting
                  ? 'Saving…'
                  : editingId
                    ? 'Save changes'
                    : 'Schedule quiz'}
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
          eyebrow="Scheduled"
          title="Upcoming & recent"
          empty={quizzes.length === 0 ? 'No quizzes scheduled yet.' : undefined}
        >
          {quizzes.map((quiz) => (
            <AdminRecordCard
              key={quiz.id}
              title={quiz.title}
              meta={`${quiz.student?.full_name ?? 'Student'}, ${quiz.enrollments?.instruments?.name ?? 'Instrument'}`}
              detail={formatDateTime(quiz.scheduled_at)}
              action={
                <AdminRecordActions
                  onEdit={() => startEdit(quiz)}
                  onDelete={() => void handleDelete(quiz.id)}
                  deleting={deletingId === quiz.id}
                />
              }
              body={
                quiz.description ? (
                  <p className="text-sm leading-relaxed text-muted">{quiz.description}</p>
                ) : undefined
              }
            />
          ))}
        </AdminListPanel>
      </AdminSplitLayout>
    </AdminPage>
  )
}
