import { Button } from '../ui/Button'
import { formatCurrency, formatDate, type Invoice } from '../../types/student'

type DashboardLockedScreenProps = {
  fullName: string
  totalOwing: number
  currency: string
  unpaidInvoices: Invoice[]
}

export function DashboardLockedScreen({
  fullName,
  totalOwing,
  currency,
  unpaidInvoices,
}: DashboardLockedScreenProps) {
  return (
    <div className="mx-auto flex min-h-[min(70svh,36rem)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center lg:px-8">
      <div className="glass-wood-surface w-full rounded-3xl border border-border p-8 shadow-[var(--shadow-card-hover)] md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/90">
          Account paused
        </p>
        <h1 className="mt-4 font-display text-3xl text-fg md:text-4xl">
          Dashboard access is on hold
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {fullName}, your tuition payment is more than 7 days overdue. Settle your balance
          to restore lessons, assignments, and studio access.
        </p>
        <p className="mt-6 font-display text-3xl text-fg">{formatCurrency(totalOwing, currency)}</p>
        <p className="mt-2 text-sm text-muted">
          Outstanding across {unpaidInvoices.length} invoice
          {unpaidInvoices.length === 1 ? '' : 's'}
        </p>

        <ul className="mt-6 space-y-2 text-left text-sm">
          {unpaidInvoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3"
            >
              <span>
                <span className="font-medium text-fg">{invoice.month}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  Due {formatDate(invoice.due_date)}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-fg">
                {formatCurrency(Number(invoice.amount), invoice.currency)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/contact">Contact studio to pay</Button>
          <Button to="/" variant="secondary">
            Return to website
          </Button>
        </div>
      </div>
    </div>
  )
}
