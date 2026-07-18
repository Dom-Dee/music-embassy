import { useEffect, useMemo, useState } from 'react'
import {
  AdminAlert,
  AdminCard,
  AdminCardBody,
  AdminFormPanel,
  AdminPage,
  AdminPageIntro,
  AdminSplitLayout,
  SegmentTabs,
} from '../../components/admin/AdminUi'
import { useAdminToast } from '../../components/admin/AdminToastProvider'
import { EnrollmentSelect } from '../../components/admin/EnrollmentSelect'
import { Button } from '../../components/ui/Button'
import { FormField } from '../../components/ui/FormField'
import { currentMonthLabel, endOfMonthIso } from '../../lib/datetime'
import {
  createInvoice,
  fetchAdminEnrollments,
  fetchAdminInvoices,
  generateMonthlyInvoices,
  markInvoicePaid,
  markInvoiceUnpaid,
} from '../../lib/adminData'
import type { AdminEnrollment, AdminInvoiceRow } from '../../types/admin'
import { formatCurrency, formatDate, isInvoiceOwing } from '../../types/student'

type FinanceTab = 'unpaid' | 'paid'

export function AdminFinance() {
  const { notify } = useAdminToast()
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([])
  const [invoices, setInvoices] = useState<AdminInvoiceRow[]>([])
  const [tab, setTab] = useState<FinanceTab>('unpaid')
  const [enrollmentId, setEnrollmentId] = useState('')
  const [month, setMonth] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [actingId, setActingId] = useState<string | null>(null)
  const [autoMonth, setAutoMonth] = useState(currentMonthLabel())
  const [autoDueDate, setAutoDueDate] = useState(endOfMonthIso())
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const [enr, inv] = await Promise.all([
      fetchAdminEnrollments(),
      fetchAdminInvoices(),
    ])
    setEnrollments(enr)
    setInvoices(inv)
  }

  useEffect(() => {
    void (async () => {
      try {
        await load()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load finance data')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const unpaid = useMemo(
    () =>
      invoices.filter(
        (inv) => inv.status === 'pending' || inv.status === 'overdue' || isInvoiceOwing(inv),
      ),
    [invoices],
  )
  const paid = useMemo(() => invoices.filter((inv) => inv.status === 'paid'), [invoices])
  const visible = tab === 'unpaid' ? unpaid : paid
  const unpaidTotal = unpaid.reduce((sum, inv) => sum + Number(inv.amount), 0)
  const paidTotal = paid.reduce((sum, inv) => sum + Number(inv.amount), 0)

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault()
    const enrollment = enrollments.find((item) => item.id === enrollmentId)
    if (!enrollment || !month || !amount || !dueDate) return

    setSubmitting(true)
    setError(null)

    try {
      await createInvoice({
        student_id: enrollment.student_id,
        enrollment_id: enrollment.id,
        month,
        amount: Number(amount),
        due_date: dueDate,
      })
      setMonth('')
      setAmount('')
      setDueDate('')
      setEnrollmentId('')
      notify('Invoice issued.')
      setTab('unpaid')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create invoice')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMarkPaid(invoiceId: string) {
    setActingId(invoiceId)
    setError(null)
    try {
      await markInvoicePaid(invoiceId)
      notify('Payment recorded.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not confirm payment')
    } finally {
      setActingId(null)
    }
  }

  async function handleGenerateMonthly(e: React.FormEvent) {
    e.preventDefault()
    if (!autoMonth || !autoDueDate) return

    setGenerating(true)
    setError(null)

    try {
      const result = await generateMonthlyInvoices(autoMonth, autoDueDate)
      notify(
        `Generated ${result.created} invoice${result.created === 1 ? '' : 's'}. Skipped ${result.skipped}.`,
      )
      setTab('unpaid')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate invoices')
    } finally {
      setGenerating(false)
    }
  }

  async function handleMarkUnpaid(invoiceId: string) {
    setActingId(invoiceId)
    setError(null)
    try {
      await markInvoiceUnpaid(invoiceId)
      notify('Invoice marked unpaid.')
      setTab('unpaid')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update invoice')
    } finally {
      setActingId(null)
    }
  }

  if (loading) return <p className="text-sm text-muted">Loading finance…</p>

  return (
    <AdminPage>
      <AdminPageIntro eyebrow="Accounts" title="Finance" />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminCard padding="md" className="border-gold/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Unpaid total
          </p>
          <p className="mt-2 font-display text-3xl text-gold">{formatCurrency(unpaidTotal)}</p>
        </AdminCard>
        <AdminCard padding="md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Collected
          </p>
          <p className="mt-2 font-display text-3xl text-fg">{formatCurrency(paidTotal)}</p>
        </AdminCard>
      </div>

      <AdminSplitLayout>
        <div className="w-full space-y-6 self-start">
        <AdminFormPanel title="Generate monthly invoices">
          <form onSubmit={(e) => void handleGenerateMonthly(e)} className="space-y-4">
            <p className="text-sm leading-relaxed text-muted">
              Creates one invoice per active enrolment using each instrument&apos;s monthly fee.
              Enrolments already billed for this period are skipped.
            </p>
            <FormField
              label="Billing period"
              id="auto-invoice-month"
              value={autoMonth}
              onChange={(e) => setAutoMonth(e.target.value)}
              required
              placeholder="June 2026"
            />
            <FormField
              label="Due date"
              id="auto-invoice-due"
              type="date"
              value={autoDueDate}
              onChange={(e) => setAutoDueDate(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={generating}>
              {generating ? 'Generating…' : 'Generate for all students'}
            </Button>
          </form>
        </AdminFormPanel>

        <AdminFormPanel title="Issue invoice">
          <form onSubmit={(e) => void handleCreateInvoice(e)} className="space-y-4">
            <FormField label="Student & instrument" id="invoice-enrollment">
              <EnrollmentSelect
                id="invoice-enrollment"
                enrollments={enrollments}
                value={enrollmentId}
                onChange={(id) => {
                  setEnrollmentId(id)
                  const enrollment = enrollments.find((item) => item.id === id)
                  if (enrollment?.instruments?.monthly_fee) {
                    setAmount(String(enrollment.instruments.monthly_fee))
                  }
                }}
                required
              />
            </FormField>
            <FormField
              label="Billing period"
              id="invoice-month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              placeholder="June 2026"
            />
            <FormField
              label="Amount (GHS)"
              id="invoice-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <FormField
              label="Due date"
              id="invoice-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Issuing…' : 'Issue invoice'}
            </Button>
          </form>
        </AdminFormPanel>
        </div>

        <div className="w-full space-y-4 self-start">
          <SegmentTabs
            tabs={[
              { id: 'unpaid' as const, label: 'Unpaid', count: unpaid.length },
              { id: 'paid' as const, label: 'Paid', count: paid.length },
            ]}
            active={tab}
            onChange={setTab}
          />

          <AdminCard padding="none">
            {visible.length === 0 ? (
              <AdminCardBody>
                <p className="text-sm text-muted">
                  {tab === 'unpaid'
                    ? 'No outstanding invoices.'
                    : 'No paid invoices recorded yet.'}
                </p>
              </AdminCardBody>
            ) : (
              <ul className="divide-y divide-border">
                {visible.map((invoice) => (
                  <li
                    key={invoice.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-7"
                  >
                    <div>
                      <p className="font-medium text-fg">
                        {invoice.student?.full_name ?? 'Student'}, {invoice.month}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {invoice.enrollments?.instruments?.name ?? 'Instrument'},{' '}
                        {tab === 'unpaid'
                          ? `Due ${formatDate(invoice.due_date)}`
                          : invoice.paid_at
                            ? `Paid ${formatDate(invoice.paid_at)}`
                            : 'Paid'}
                      </p>
                      <p className="mt-1 font-display text-lg text-fg">
                        {formatCurrency(Number(invoice.amount), invoice.currency)}
                      </p>
                    </div>
                    {tab === 'unpaid' ? (
                      <Button
                        type="button"
                        className="!px-4 !py-2 text-sm"
                        disabled={actingId === invoice.id}
                        onClick={() => void handleMarkPaid(invoice.id)}
                      >
                        {actingId === invoice.id ? 'Saving…' : 'Confirm paid'}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        className="!px-4 !py-2 text-sm"
                        disabled={actingId === invoice.id}
                        onClick={() => void handleMarkUnpaid(invoice.id)}
                      >
                        {actingId === invoice.id ? 'Saving…' : 'Mark unpaid'}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      </AdminSplitLayout>
    </AdminPage>
  )
}
