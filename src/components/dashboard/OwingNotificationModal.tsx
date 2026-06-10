import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Button } from '../ui/Button'
import type { Invoice } from '../../types/student'
import { formatFirstName } from '../../lib/formatName'
import { formatCurrency, formatDate } from '../../types/student'

type OwingNotificationModalProps = {
  open: boolean
  onClose: () => void
  fullName: string
  email: string
  totalOwing: number
  currency: string
  owingInvoices: Invoice[]
  emailSent: boolean
  emailError: string | null
}

export function OwingNotificationModal({
  open,
  onClose,
  fullName,
  email,
  totalOwing,
  currency,
  owingInvoices,
  emailSent,
  emailError,
}: OwingNotificationModalProps) {
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
          <motion.div
            role="alertdialog"
            aria-labelledby="owing-title"
            aria-modal="true"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-wood-surface liquid-panel fixed left-1/2 top-1/2 z-[101] w-[min(100%-2rem,26rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card-hover)]"
          >
            <div className="border-b border-border px-6 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Account notice
              </p>
              <h2 id="owing-title" className="mt-2 font-display text-2xl text-fg">
                Balance due
              </h2>
              <p className="mt-1 text-sm text-muted">
                {formatFirstName(fullName)}, please review the following invoices.
              </p>
              <p className="mt-4 font-display text-3xl text-fg">
                {formatCurrency(totalOwing, currency)}
              </p>
            </div>

            <div className="space-y-4 px-6 py-5">
              <p className="text-sm leading-relaxed text-muted">
                {owingInvoices.length} outstanding invoice
                {owingInvoices.length === 1 ? '' : 's'}. Settlement keeps your lessons
                and studio access uninterrupted.
              </p>

              <ul className="max-h-40 space-y-0 divide-y divide-border overflow-y-auto rounded-lg border border-border text-sm">
                {owingInvoices.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <span>
                      <span className="text-fg">{inv.month}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        Due {formatDate(inv.due_date)}
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums font-medium text-fg">
                      {formatCurrency(Number(inv.amount), inv.currency)}
                    </span>
                  </li>
                ))}
              </ul>

              {emailSent ? (
                <p className="rounded-lg border border-border bg-surface/60 px-3 py-2.5 text-sm text-muted">
                  A copy of this notice was sent to{' '}
                  <span className="text-fg">{email}</span>.
                </p>
              ) : null}

              {emailError ? (
                <p className="rounded-lg border border-border bg-surface/60 px-3 py-2.5 text-xs leading-relaxed text-muted">
                  Email delivery unavailable ({emailError}). Contact the studio at
                  musicembassy.edu@gmail.com if you need assistance.
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-1">
                <Button type="button" onClick={onClose} className="flex-1">
                  Understood
                </Button>
                <Button to="/contact" variant="secondary" className="flex-1">
                  Contact studio
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
