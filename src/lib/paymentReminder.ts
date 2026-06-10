import { supabase } from './supabase'
import type { Invoice } from '../types/student'
import { formatCurrency, getTotalOwing } from '../types/student'

const STORAGE_PREFIX = 'music-embassy-payment-reminder'

function reminderKey(userId: string): string {
  return `${STORAGE_PREFIX}-${userId}`
}

/** At most one reminder email per user per calendar day */
export function wasReminderSentToday(userId: string): boolean {
  try {
    const raw = localStorage.getItem(reminderKey(userId))
    if (!raw) return false
    const sent = new Date(raw)
    const now = new Date()
    return (
      sent.getFullYear() === now.getFullYear() &&
      sent.getMonth() === now.getMonth() &&
      sent.getDate() === now.getDate()
    )
  } catch {
    return false
  }
}

function markReminderSent(userId: string): void {
  try {
    localStorage.setItem(reminderKey(userId), new Date().toISOString())
  } catch {
    /* ignore */
  }
}

export async function sendPaymentReminderEmail(params: {
  userId: string
  email: string
  fullName: string
  owingInvoices: Invoice[]
}): Promise<{ sent: boolean; error?: string }> {
  const { userId, email, fullName, owingInvoices } = params

  if (owingInvoices.length === 0) {
    return { sent: false }
  }

  if (wasReminderSentToday(userId)) {
    return { sent: false }
  }

  const total = getTotalOwing(owingInvoices)
  const currency = owingInvoices[0]?.currency ?? 'GHS'

  const { error } = await supabase.functions.invoke('send-payment-reminder', {
    body: {
      email,
      fullName,
      total: formatCurrency(total, currency),
      invoiceCount: owingInvoices.length,
      invoices: owingInvoices.map((inv) => ({
        month: inv.month,
        amount: formatCurrency(Number(inv.amount), inv.currency),
        dueDate: inv.due_date,
        status: inv.status,
      })),
    },
  })

  if (error) {
    return { sent: false, error: error.message }
  }

  markReminderSent(userId)
  return { sent: true }
}
