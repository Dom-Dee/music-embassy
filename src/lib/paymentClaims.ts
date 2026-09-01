import { requireAdminProfile, requireOwnStudentId } from './requireAuth'
import { publishStudentNotifications } from './portalNotifications'
import { supabase } from './supabase'
import { isMissingTableError } from './supabaseErrors'
import type { AdminPaymentClaimRow, PaymentClaim } from '../types/payments'

export async function fetchStudentPaymentClaims(
  studentId: string,
): Promise<PaymentClaim[]> {
  await requireOwnStudentId(studentId)
  const { data, error } = await supabase
    .from('payment_claims')
    .select('*')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false })
    .limit(20)

  if (error) {
    if (isMissingTableError(error.message, 'payment_claims')) return []
    throw new Error(error.message)
  }

  return (data ?? []) as PaymentClaim[]
}

export async function submitPaymentClaim(input: {
  invoiceId: string
  reference?: string
  notes?: string
}): Promise<void> {
  const { error } = await supabase.rpc('submit_payment_claim', {
    p_invoice_id: input.invoiceId,
    p_reference: input.reference?.trim() || null,
    p_notes: input.notes?.trim() || null,
  })

  if (error) throw new Error(error.message)
}

export async function fetchAdminPaymentClaims(): Promise<AdminPaymentClaimRow[]> {
  await requireAdminProfile()
  const { data, error } = await supabase
    .from('payment_claims')
    .select(
      '*, student:profiles!student_id(full_name, email), invoice:invoices(month, amount, currency, due_date)',
    )
    .order('submitted_at', { ascending: false })
    .limit(50)

  if (error) {
    if (isMissingTableError(error.message, 'payment_claims')) return []
    throw new Error(error.message)
  }

  return (data ?? []) as AdminPaymentClaimRow[]
}

export async function confirmPaymentClaim(claimId: string): Promise<void> {
  await requireAdminProfile()

  const { data, error } = await supabase.rpc('confirm_payment_claim', {
    p_claim_id: claimId,
  })

  if (error) throw new Error(error.message)

  const result = data as { student_id?: string; month?: string } | null
  if (result?.student_id && result.month) {
    await publishStudentNotifications(
      [{ student_id: result.student_id }],
      {
        type: 'invoice',
        title: 'Payment confirmed',
        body: `Your ${result.month} tuition payment has been confirmed. Thank you!`,
      },
    )
  }
}

export async function rejectPaymentClaim(
  claimId: string,
  reason?: string,
): Promise<void> {
  await requireAdminProfile()

  const { data, error } = await supabase.rpc('reject_payment_claim', {
    p_claim_id: claimId,
    p_reason: reason?.trim() || null,
  })

  if (error) throw new Error(error.message)

  const result = data as { student_id?: string; month?: string } | null
  if (result?.student_id && result.month) {
    await publishStudentNotifications(
      [{ student_id: result.student_id }],
      {
        type: 'invoice',
        title: 'Payment could not be confirmed',
        body: `We could not confirm your ${result.month} payment. Please contact the studio or submit again with the correct reference.`,
      },
    )
  }
}
