import { requireAdminProfile } from './requireAuth'
import { supabase } from './supabase'
import { isMissingTableError } from './supabaseErrors'
import {
  PAYMENT_SETTINGS_ID,
  type PaymentSettings,
} from '../types/payments'

export type PaymentSettingsInput = {
  momo_number?: string | null
  momo_name?: string | null
  bank_name?: string | null
  bank_account_name?: string | null
  bank_account_number?: string | null
  bank_branch?: string | null
  instructions?: string | null
}

const EMPTY_SETTINGS: PaymentSettings = {
  id: PAYMENT_SETTINGS_ID,
  momo_number: null,
  momo_name: null,
  bank_name: null,
  bank_account_name: null,
  bank_account_number: null,
  bank_branch: null,
  instructions: null,
  updated_at: new Date(0).toISOString(),
}

function trimOrNull(value?: string | null): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const { data, error } = await supabase
    .from('payment_settings')
    .select('*')
    .eq('id', PAYMENT_SETTINGS_ID)
    .maybeSingle()

  if (error) {
    if (isMissingTableError(error.message, 'payment_settings')) {
      return EMPTY_SETTINGS
    }
    throw new Error(error.message)
  }

  return (data ?? EMPTY_SETTINGS) as PaymentSettings
}

export async function updatePaymentSettings(input: PaymentSettingsInput): Promise<void> {
  await requireAdminProfile()

  const payload = {
    id: PAYMENT_SETTINGS_ID,
    momo_number: trimOrNull(input.momo_number),
    momo_name: trimOrNull(input.momo_name),
    bank_name: trimOrNull(input.bank_name),
    bank_account_name: trimOrNull(input.bank_account_name),
    bank_account_number: trimOrNull(input.bank_account_number),
    bank_branch: trimOrNull(input.bank_branch),
    instructions: trimOrNull(input.instructions),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('payment_settings').upsert(payload)
  if (error) throw new Error(error.message)
}

export function paymentSettingsConfigured(settings: PaymentSettings): boolean {
  return Boolean(
    settings.momo_number?.trim() ||
      settings.bank_name?.trim() ||
      settings.bank_account_number?.trim(),
  )
}
