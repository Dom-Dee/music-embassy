import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildInstrumentPaths,
  canEditAssignmentSubmission,
  countPendingAssignments,
  formatCurrency,
  formatSubmissionEditRemaining,
  getOwingInvoices,
  groupAssignmentsByWorkflow,
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

  it('counts only pending assignments', () => {
    const assignments = [
      { submission_status: 'pending' as const },
      { submission_status: 'submitted' as const },
      { submission_status: 'reviewed' as const },
      {},
    ]
    expect(countPendingAssignments(assignments as never)).toBe(2)
  })

  it('allows editing submitted work for 24 hours', () => {
    const submittedAt = '2026-05-19T10:00:00.000Z'
    const withinWindow = new Date('2026-05-19T20:00:00.000Z').getTime()
    const afterWindow = new Date('2026-05-20T11:00:00.000Z').getTime()

    const assignment = {
      submission_status: 'submitted' as const,
      submitted_at: submittedAt,
    }

    expect(canEditAssignmentSubmission(assignment as never, withinWindow)).toBe(true)
    expect(canEditAssignmentSubmission(assignment as never, afterWindow)).toBe(false)
    expect(
      canEditAssignmentSubmission(
        { ...assignment, submission_status: 'reviewed' } as never,
        withinWindow,
      ),
    ).toBe(false)
    expect(formatSubmissionEditRemaining(assignment as never, withinWindow)).toContain(
      'left to edit',
    )
  })

  it('groups and sorts assignments by workflow', () => {
    const assignments = [
      {
        id: '3',
        title: 'Reviewed piece',
        submission_status: 'reviewed' as const,
        submitted_at: '2026-05-10T10:00:00.000Z',
        due_date: null,
      },
      {
        id: '1',
        title: 'Later due',
        submission_status: 'pending' as const,
        due_date: '2026-06-01',
      },
      {
        id: '2',
        title: 'Sooner due',
        submission_status: 'pending' as const,
        due_date: '2026-05-20',
      },
      {
        id: '4',
        title: 'Just submitted',
        submission_status: 'submitted' as const,
        submitted_at: '2026-05-18T10:00:00.000Z',
        due_date: null,
      },
    ]

    const groups = groupAssignmentsByWorkflow(assignments as never)
    expect(groups.map((g) => g.status)).toEqual(['pending', 'submitted', 'reviewed'])
    expect(groups[0]?.items.map((item) => item.title)).toEqual([
      'Sooner due',
      'Later due',
    ])
  })

  it('formats Ghana cedis', () => {
    expect(formatCurrency(150)).toContain('150')
    expect(formatCurrency(150)).toContain('GH')
  })
})
