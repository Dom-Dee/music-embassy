import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { AuthAlert } from '../../components/auth/AuthAlert'
import { Button } from '../../components/ui/Button'
import { FormField, formInputClass } from '../../components/ui/FormField'
import { GlassCard } from '../../components/ui/GlassCard'
import { useStudentDashboard } from '../../hooks/useStudentDashboard'
import { fetchStudentPaymentClaims, submitPaymentClaim } from '../../lib/paymentClaims'
import {
  fetchPaymentSettings,
  paymentSettingsConfigured,
} from '../../lib/paymentSettings'
import type { PaymentClaim } from '../../types/payments'
import {
  formatCurrency,
  formatDate,
  getUnpaidInvoices,
} from '../../types/student'

export function StudentPay() {
  const { profile } = useAuth()
  const studentId = profile?.id
  const { invoices, loading, error, refresh } = useStudentDashboard(studentId)
  const [settings, setSettings] = useState<Awaited<ReturnType<typeof fetchPaymentSettings>> | null>(
    null,
  )
  const [claims, setClaims] = useState<PaymentClaim[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const [paymentSettings, paymentClaims] = await Promise.all([
          fetchPaymentSettings(),
          studentId ? fetchStudentPaymentClaims(studentId) : Promise.resolve([]),
        ])
        setSettings(paymentSettings)
        setClaims(paymentClaims)
      } catch (e) {
        setFormError(e instanceof Error ? e.message : 'Could not load payment details')
      }
    })()
  }, [studentId])

  const unpaidInvoices = useMemo(
    () => getUnpaidInvoices(invoices),
    [invoices],
  )

  const pendingClaimByInvoice = useMemo(() => {
    const map = new Map<string, PaymentClaim>()
    for (const claim of claims) {
      if (claim.status === 'pending') {
        map.set(claim.invoice_id, claim)
      }
    }
    return map
  }, [claims])

  useEffect(() => {
    if (!selectedInvoiceId && unpaidInvoices.length > 0) {
      setSelectedInvoiceId(unpaidInvoices[0].id)
    }
  }, [selectedInvoiceId, unpaidInvoices])

  const selectedInvoice = unpaidInvoices.find((inv) => inv.id === selectedInvoiceId) ?? null
  const hasPendingClaim = selectedInvoice
    ? pendingClaimByInvoice.has(selectedInvoice.id)
    : false

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedInvoiceId) return

    setSubmitting(true)
    setFormError(null)
    setSuccess(null)

    try {
      await submitPaymentClaim({
        invoiceId: selectedInvoiceId,
        reference,
        notes,
      })
      setSuccess('Payment submitted. The studio will confirm once your transfer is verified.')
      setReference('')
      setNotes('')
      if (studentId) {
        setClaims(await fetchStudentPaymentClaims(studentId))
      }
      await refresh()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not submit payment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && invoices.length === 0) {
    return <p className="text-sm text-muted">Loading payment details…</p>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/88">
          Tuition
        </p>
        <h1 className="mt-3 font-display text-3xl text-fg md:text-4xl">Make a payment</h1>
        <p className="mt-2 text-sm text-muted">
          Send your tuition using the details below, then tap payment done so the studio can
          confirm your invoice.
        </p>
      </div>

      {error ? <AuthAlert message={error} /> : null}
      {formError ? <AuthAlert message={formError} /> : null}
      {success ? <AuthAlert message={success} variant="success" /> : null}

      <GlassCard className="space-y-5 !p-6 md:!p-8">
        <h2 className="font-display text-xl text-fg">Where to pay</h2>

        {!settings || !paymentSettingsConfigured(settings) ? (
          <p className="text-sm text-muted">
            Payment details are being set up by the studio. Please contact{' '}
            <Link to="/contact" className="text-gold hover:text-fg">
              Music Embassy
            </Link>{' '}
            if you need to pay now.
          </p>
        ) : (
          <div className="space-y-4 text-sm">
            {settings.momo_number ? (
              <div className="rounded-xl border border-border bg-surface/50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Mobile Money
                </p>
                <p className="mt-2 font-display text-2xl text-fg">{settings.momo_number}</p>
                {settings.momo_name ? (
                  <p className="mt-1 text-muted">Account name: {settings.momo_name}</p>
                ) : null}
              </div>
            ) : null}

            {settings.bank_name || settings.bank_account_number ? (
              <div className="rounded-xl border border-border bg-surface/50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Bank transfer
                </p>
                {settings.bank_name ? (
                  <p className="mt-2 font-medium text-fg">{settings.bank_name}</p>
                ) : null}
                {settings.bank_account_name ? (
                  <p className="mt-1 text-muted">Account name: {settings.bank_account_name}</p>
                ) : null}
                {settings.bank_account_number ? (
                  <p className="mt-1 text-fg">Account number: {settings.bank_account_number}</p>
                ) : null}
                {settings.bank_branch ? (
                  <p className="mt-1 text-muted">Branch: {settings.bank_branch}</p>
                ) : null}
              </div>
            ) : null}

            {settings.instructions ? (
              <p className="rounded-xl border border-border bg-surface/40 px-4 py-3 text-muted">
                {settings.instructions}
              </p>
            ) : null}
          </div>
        )}
      </GlassCard>

      {unpaidInvoices.length === 0 ? (
        <GlassCard className="!p-6 md:!p-8">
          <p className="text-sm text-muted">
            You have no open invoices right now.{' '}
            <Link to="/dashboard" className="text-gold hover:text-fg">
              Return to dashboard
            </Link>
          </p>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-5 !p-6 md:!p-8">
          <h2 className="font-display text-xl text-fg">Confirm your payment</h2>

          <FormField label="Invoice" id="pay-invoice">
            <select
              id="pay-invoice"
              className={formInputClass}
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
            >
              {unpaidInvoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.month} — {formatCurrency(Number(invoice.amount), invoice.currency)}
                </option>
              ))}
            </select>
          </FormField>

          {selectedInvoice ? (
            <p className="text-sm text-muted">
              Due {formatDate(selectedInvoice.due_date)} ·{' '}
              {formatCurrency(Number(selectedInvoice.amount), selectedInvoice.currency)}
            </p>
          ) : null}

          {hasPendingClaim ? (
            <div className="rounded-xl border border-gold/25 bg-gold/10 px-4 py-4 text-sm text-fg">
              Payment submitted for this invoice — awaiting studio confirmation. You will be
              cleared for the month once admin verifies your transfer.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
              <FormField
                label="Transaction reference (optional)"
                id="pay-reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="MoMo reference or bank transfer ID"
              />
              <FormField label="Notes (optional)" id="pay-notes">
                <textarea
                  id="pay-notes"
                  className={`${formInputClass} min-h-24`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sender name, payment time, or anything that helps us match your transfer"
                />
              </FormField>
              <Button type="submit" className="w-full !py-3.5" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Payment done'}
              </Button>
            </form>
          )}
        </GlassCard>
      )}

      {claims.length > 0 ? (
        <GlassCard className="space-y-3 !p-6 md:!p-8">
          <h2 className="font-display text-xl text-fg">Recent submissions</h2>
          <ul className="divide-y divide-border text-sm">
            {claims.map((claim) => {
              const invoice = invoices.find((inv) => inv.id === claim.invoice_id)
              return (
                <li key={claim.id} className="flex items-center justify-between gap-3 py-3">
                  <span>
                    <span className="text-fg">{invoice?.month ?? 'Invoice'}</span>
                    <span className="mt-0.5 block text-xs capitalize text-muted">
                      {claim.status === 'pending'
                        ? 'Awaiting confirmation'
                        : claim.status === 'confirmed'
                          ? 'Confirmed'
                          : 'Not confirmed'}
                    </span>
                  </span>
                  <span className="text-xs text-muted">
                    {formatDate(claim.submitted_at.slice(0, 10))}
                  </span>
                </li>
              )
            })}
          </ul>
        </GlassCard>
      ) : null}
    </div>
  )
}
