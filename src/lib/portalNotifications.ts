import { requireOwnStudentId } from './requireAuth'
import { supabase } from './supabase'
import { isMissingTableError } from './supabaseErrors'

export type PortalNotificationType = 'lesson' | 'assignment' | 'quiz' | 'invoice'

export type PortalNotification = {
  id: string
  student_id: string
  type: PortalNotificationType
  title: string
  body: string | null
  read_at: string | null
  created_at: string
}

type NotifyTarget = {
  student_id: string
  student?: { full_name: string; email: string } | null
}

export async function fetchStudentNotifications(
  studentId: string,
): Promise<PortalNotification[]> {
  await requireOwnStudentId(studentId)
  const { data, error } = await supabase
    .from('portal_notifications')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(40)

  if (error) {
    if (isMissingTableError(error.message, 'portal_notifications')) return []
    throw new Error(error.message)
  }
  return (data ?? []) as PortalNotification[]
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('portal_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) throw new Error(error.message)
}

export async function markAllNotificationsRead(studentId: string): Promise<void> {
  await requireOwnStudentId(studentId)
  const { error } = await supabase
    .from('portal_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('student_id', studentId)
    .is('read_at', null)

  if (error) throw new Error(error.message)
}

export async function publishStudentNotifications(
  targets: NotifyTarget[],
  input: {
    type: PortalNotificationType
    title: string
    body?: string
  },
): Promise<void> {
  if (targets.length === 0) return

  const rows = targets.map((target) => ({
    student_id: target.student_id,
    type: input.type,
    title: input.title,
    body: input.body?.trim() || null,
  }))

  const { error } = await supabase.from('portal_notifications').insert(rows)
  if (error && !isMissingTableError(error.message, 'portal_notifications')) {
    console.error('Could not save in-app notifications:', error.message)
  }

  await Promise.allSettled(
    targets.map(async (target) => {
      const email = target.student?.email
      if (!email) return

      await supabase.functions.invoke('send-portal-notification', {
        body: {
          email,
          fullName: target.student?.full_name ?? 'Student',
          title: input.title,
          body: input.body ?? '',
          type: input.type,
        },
      })
    }),
  )
}
