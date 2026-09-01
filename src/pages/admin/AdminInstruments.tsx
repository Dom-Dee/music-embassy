import { useEffect, useState } from 'react'
import {
  AdminAlert,
  AdminFormPanel,
  AdminListPanel,
  AdminPage,
  AdminPageIntro,
  AdminRecordCard,
  AdminSplitLayout,
} from '../../components/admin/AdminUi'
import { useAdminToast } from '../../components/admin/AdminToastProvider'
import { Button } from '../../components/ui/Button'
import { FormField, formInputClass } from '../../components/ui/FormField'
import { fetchAdminInstruments, updateInstrument } from '../../lib/adminData'
import {
  fetchPaymentSettings,
  paymentSettingsConfigured,
  updatePaymentSettings,
} from '../../lib/paymentSettings'
import { getInstrumentImageUrl } from '../../lib/instrumentImages'
import type { Instrument } from '../../types/student'
import type { PaymentSettings } from '../../types/payments'
import { formatCurrency } from '../../types/student'

export function AdminInstruments() {
  const { notify } = useAdminToast()
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [monthlyFee, setMonthlyFee] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null)
  const [momoNumber, setMomoNumber] = useState('')
  const [momoName, setMomoName] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccountName, setBankAccountName] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [paymentInstructions, setPaymentInstructions] = useState('')
  const [savingPayment, setSavingPayment] = useState(false)

  async function load() {
    const [rows, settings] = await Promise.all([
      fetchAdminInstruments(),
      fetchPaymentSettings(),
    ])
    setInstruments(rows as Instrument[])
    setPaymentSettings(settings)
    setMomoNumber(settings.momo_number ?? '')
    setMomoName(settings.momo_name ?? '')
    setBankName(settings.bank_name ?? '')
    setBankAccountName(settings.bank_account_name ?? '')
    setBankAccountNumber(settings.bank_account_number ?? '')
    setBankBranch(settings.bank_branch ?? '')
    setPaymentInstructions(settings.instructions ?? '')
  }

  useEffect(() => {
    void (async () => {
      try {
        await load()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load instruments')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function startEdit(item: Instrument) {
    setEditingId(item.id)
    setMonthlyFee(String(item.monthly_fee))
    setDescription(item.description ?? '')
    setActive(item.active)
  }

  function resetForm() {
    setEditingId(null)
    setMonthlyFee('')
    setDescription('')
    setActive(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return

    const fee = Number(monthlyFee)
    if (!Number.isFinite(fee) || fee < 0) {
      setError('Enter a valid monthly fee.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await updateInstrument(editingId, {
        description,
        monthly_fee: fee,
        active,
      })
      notify('Instrument updated.')
      resetForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update instrument')
    } finally {
      setSubmitting(false)
    }
  }

  const editing = instruments.find((item) => item.id === editingId) ?? null

  async function handlePaymentSettingsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSavingPayment(true)
    setError(null)

    try {
      await updatePaymentSettings({
        momo_number: momoNumber,
        momo_name: momoName,
        bank_name: bankName,
        bank_account_name: bankAccountName,
        bank_account_number: bankAccountNumber,
        bank_branch: bankBranch,
        instructions: paymentInstructions,
      })
      notify('Payment details updated.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save payment details')
    } finally {
      setSavingPayment(false)
    }
  }

  return (
    <AdminPage>
      <AdminPageIntro
        eyebrow="Enrollment"
        title="Instruments & pricing"
        description="Set tuition fees, payment instructions, and control which instruments students can enroll in."
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminFormPanel title="Payment details for students">
        <form className="space-y-4" onSubmit={(e) => void handlePaymentSettingsSubmit(e)}>
          <p className="text-sm text-muted">
            Students see these details on the Pay page when settling tuition by Mobile Money or
            bank transfer.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="MoMo number" id="momo-number">
              <input
                id="momo-number"
                className={formInputClass}
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="055 123 4567"
              />
            </FormField>
            <FormField label="MoMo account name" id="momo-name">
              <input
                id="momo-name"
                className={formInputClass}
                value={momoName}
                onChange={(e) => setMomoName(e.target.value)}
                placeholder="Music Embassy"
              />
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Bank name" id="bank-name">
              <input
                id="bank-name"
                className={formInputClass}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </FormField>
            <FormField label="Branch" id="bank-branch">
              <input
                id="bank-branch"
                className={formInputClass}
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
              />
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Account name" id="bank-account-name">
              <input
                id="bank-account-name"
                className={formInputClass}
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
              />
            </FormField>
            <FormField label="Account number" id="bank-account-number">
              <input
                id="bank-account-number"
                className={formInputClass}
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="Extra instructions" id="payment-instructions">
            <textarea
              id="payment-instructions"
              className={`${formInputClass} min-h-24`}
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              placeholder="Use your full name and billing month as the payment reference."
            />
          </FormField>
          {!paymentSettings || !paymentSettingsConfigured(paymentSettings) ? (
            <p className="text-xs text-muted">Add at least a MoMo number or bank account.</p>
          ) : null}
          <Button type="submit" disabled={savingPayment}>
            {savingPayment ? 'Saving…' : 'Save payment details'}
          </Button>
        </form>
      </AdminFormPanel>

      <AdminSplitLayout>
        <AdminFormPanel title={editing ? `Edit ${editing.name}` : 'Select an instrument'}>
          {editing ? (
            <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
              <FormField label="Monthly fee (GHS)" id="instrument-fee" required>
                <input
                  id="instrument-fee"
                  type="number"
                  min="0"
                  step="0.01"
                  className={formInputClass}
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Description" id="instrument-description">
                <textarea
                  id="instrument-description"
                  className={`${formInputClass} min-h-28`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormField>
              <label className="flex items-center gap-2 text-sm text-fg">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Available for student enrollment
              </label>
              <p className="text-xs text-muted">
                Unchecking hides this instrument from new enrollments. Existing students keep their
                active enrolments.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  Save changes
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted">
              Choose an instrument on the right to update its monthly fee or enrollment status.
            </p>
          )}
        </AdminFormPanel>

        <AdminListPanel
          eyebrow="Catalog"
          title="All instruments"
          empty={!loading && instruments.length === 0 ? 'No instruments found.' : undefined}
        >
          {instruments.map((item) => (
            <AdminRecordCard
              key={item.id}
              title={item.name}
              meta={`${formatCurrency(item.monthly_fee)} / month · ${item.active ? 'Open for enrollment' : 'Hidden'}`}
              detail={item.description ?? 'No description'}
              action={
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted transition hover:border-gold/35 hover:text-fg"
                >
                  Edit
                </button>
              }
              body={
                <div className="h-20 w-28 overflow-hidden rounded-lg border border-border">
                  <img
                    src={getInstrumentImageUrl(item.name)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              }
            />
          ))}
        </AdminListPanel>
      </AdminSplitLayout>
    </AdminPage>
  )
}
