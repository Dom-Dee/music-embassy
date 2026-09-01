export type PaymentSettings = {
  id: string
  momo_number: string | null
  momo_name: string | null
  bank_name: string | null
  bank_account_name: string | null
  bank_account_number: string | null
  bank_branch: string | null
  instructions: string | null
  updated_at: string
}

export type PaymentClaimStatus = 'pending' | 'confirmed' | 'rejected'

export type PaymentClaim = {
  id: string
  student_id: string
  invoice_id: string
  reference: string | null
  notes: string | null
  status: PaymentClaimStatus
  submitted_at: string
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
}

export type AdminPaymentClaimRow = PaymentClaim & {
  student: { full_name: string; email: string } | null
  invoice: {
    month: string
    amount: number
    currency: string
    due_date: string
  } | null
}

export const PAYMENT_SETTINGS_ID = '00000000-0000-0000-0000-000000000001'
