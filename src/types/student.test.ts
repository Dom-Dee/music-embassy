import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildInstrumentPaths,
  formatCurrency,
  getOwingInvoices,
  getTotalOwing,
  isInvoiceOwing,
  type Enrollment,
  type Invoice,
} from './student'

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: 'inv-1',
    student_id: 'student-1',
    enrollment_id: 'enr-1',
    month: 'May 2026',
    amount: 150,
    currency: 'GHS',
    due_date: '2026-05-01',
    status: 'pending',
    paid_at: null,
    created_at: '2026-05-01',
    ...overrides,
  }
}

describe('student helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-19T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('flags overdue and past-due pending invoices', () => {
    expect(isInvoiceOwing(makeInvoice({ status: 'overdue' }))).toBe(true)
    expect(isInvoiceOwing(makeInvoice({ status: 'paid' }))).toBe(false)
    expect(isInvoiceOwing(makeInvoice({ due_date: '2026-05-10' }))).toBe(true)
    expect(isInvoiceOwing(makeInvoice({ due_date: '2026-12-31' }))).toBe(false)
  })

  it('totals owing invoices', () => {
    const invoices = [
      makeInvoice({ id: '1', amount: 100, due_date: '2026-05-10' }),
      makeInvoice({ id: '2', amount: 50, status: 'paid' }),
      makeInvoice({ id: '3', amount: 25, due_date: '2026-12-31' }),
    ]
    expect(getOwingInvoices(invoices)).toHaveLength(1)
    expect(getTotalOwing(invoices)).toBe(100)
  })

  it('builds instrument paths for active enrolments only', () => {
    const enrollments: Enrollment[] = [
      {
        id: 'enr-1',
        student_id: 's1',
        instrument_id: 'i1',
        class_id: null,
        start_date: '2026-01-01',
        status: 'active',
        created_at: '2026-01-01',
        instruments: { name: 'Piano', monthly_fee: 150, description: null },
        classes: null,
      },
      {
        id: 'enr-2',
        student_id: 's1',
        instrument_id: 'i2',
        class_id: null,
        start_date: '2026-01-01',
        status: 'completed',
        created_at: '2026-01-01',
        instruments: { name: 'Drums', monthly_fee: 130, description: null },
        classes: null,
      },
    ]

    const paths = buildInstrumentPaths(enrollments, [], [], [], [])
    expect(paths).toHaveLength(1)
    expect(paths[0]?.enrollment.id).toBe('enr-1')
  })

  it('formats Ghana cedis', () => {
    expect(formatCurrency(150)).toContain('150')
    expect(formatCurrency(150)).toContain('GH')
  })
})
