import { requireOwnStudentId } from './requireAuth'
import { supabase } from './supabase'

export async function ensureStudentMonthlyInvoices(studentId: string): Promise<void> {
  await requireOwnStudentId(studentId)

  const { error } = await supabase.rpc('ensure_student_monthly_invoices', {
    p_student_id: studentId,
  })

  if (error) {
    if (error.message.includes('ensure_student_monthly_invoices')) {
      return
    }
    throw new Error(error.message)
  }
}
