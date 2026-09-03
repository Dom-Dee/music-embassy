import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Button } from '../ui/Button'
import type { Invoice } from '../../types/student'
import {
  formatCurrency,
  formatDate,
  formatGraceCountdown,
  getGraceDaysRemaining,
  isInvoiceOwing,
} from '../../types/student'
import { formatFirstName } from '../../lib/formatName'

type OwingNotificationModalProps = {
  open: boolean
  onClose: () => void
  fullName: string
  email: string
  totalOwing: number
  currency: string
  unpaidInvoices: Invoice[]
  nowMs: number
  emailSent: boolean
}

export function OwingNotificationModal({
  open,
  onClose,
  fullName,
  email,
  totalOwing,
  currency,
  unpaidInvoices,
  nowMs,
  emailSent,
}: OwingNotificationModalProps) {
  const graceDays = unpaidInvoices
    .map((invoice) => getGraceDaysRemaining(invoice, nowMs))
    .filter((value): value is number => value !== null)
  const soonestGraceDays =
    graceDays.length > 0 ? Math.min(...graceDays) : null
  const graceLabel = formatGraceCountdown(soonestGraceDays)
  const hasPastDue = unpaidInvoices.some((invoice) => isInvoiceOwing(invoice, nowMs))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-page/85 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <div className="fixed inset-0 z-[101] flex items-end justify-center p-4 sm:items-center sm:p-6">
            <motion.div
              role="alertdialog"
              aria-labelledby="owing-title"
              aria-modal="true"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-wood-surface liquid-panel flex max-h-[min(92dvh,calc(100svh-2rem))] w-full max-w-[26rem] flex-col overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card-hover)]"
            >
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="border-b border-border px-5 py-5 sm:px-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                    {hasPastDue ? 'Payment overdue' : 'New billing'}
                  </p>
                  <h2 id="owing-title" className="mt-2 font-display text-xl text-fg sm:text-2xl">
                    {hasPastDue ? 'Balance overdue' : 'Tuition invoice ready'}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {formatFirstName(fullName)}, please review your current tuition invoice
                    {unpaidInvoices.length === 1 ? '' : 's'}.
                  </p>
                  <p className="mt-4 font-display text-2xl text-fg sm:text-3xl">
                    {formatCurrency(totalOwing, currency)}
                  </p>
                  {graceLabel ? (
                    <p
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        soonestGraceDays !== null && soonestGraceDays <= 2
                          ? 'bg-[color:var(--status-danger-bg)] text-[color:var(--status-danger-fg)] ring-1 ring-[color:var(--status-danger-border)]'
                          : 'bg-gold/12 text-gold ring-1 ring-gold/25'
                      }`}
                    >
                      {graceLabel}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted">
                      Pay by the due date. After that you have 7 days before dashboard access
                      is paused.
                    </p>
                  )}
                </div>

                <div className="space-y-4 px-5 py-5 sm:px-6">
                  <p className="text-sm leading-relaxed text-muted">
                    {unpaidInvoices.length} open invoice
                    {unpaidInvoices.length === 1 ? '' : 's'}. Settlement keeps your lessons
                    and studio access uninterrupted.
                  </p>

                  <ul className="max-h-40 space-y-0 divide-y divide-border overflow-y-auto rounded-lg border border-border text-sm">
                    {unpaidInvoices.map((inv) => {
                      const invoiceGrace = getGraceDaysRemaining(inv, nowMs)
                      const pastDue = isInvoiceOwing(inv, nowMs)
                      return (
                        <li
                          key={inv.id}
                          className="flex items-start justify-between gap-3 px-4 py-3"
                        >
                          <span className="min-w-0">
                            <span className="block text-fg">{inv.month}</span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                              Due {formatDate(inv.due_date)}
                              {pastDue && invoiceGrace !== null
                                ? ` · ${formatGraceCountdown(invoiceGrace)}`
                                : ''}
                            </span>
                          </span>
                          <span className="shrink-0 tabular-nums font-medium text-fg">
                            {formatCurrency(Number(inv.amount), inv.currency)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {emailSent ? (
                    <p className="rounded-lg border border-border bg-surface/60 px-3 py-2.5 text-sm text-muted">
                      A copy of this notice was sent to{' '}
                      <span className="break-all text-fg">{email}</span>.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="shrink-0 border-t border-border px-5 py-4 sm:px-6">
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button type="button" to="/dashboard/pay" className="w-full sm:flex-1">
                    Pay now
                  </Button>
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    className="w-full sm:flex-1"
                  >
                    Understood
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
