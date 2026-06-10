import { describe, expect, it } from 'vitest'
import {
  currentMonthLabel,
  endOfMonthIso,
  toDatetimeLocalValue,
} from './datetime'

describe('datetime helpers', () => {
  it('formats ISO for datetime-local input', () => {
    expect(toDatetimeLocalValue('2026-06-15T14:30:00.000Z')).toMatch(
      /^2026-06-15T\d{2}:30$/,
    )
  })

  it('returns month label for a date', () => {
    expect(currentMonthLabel(new Date('2026-03-10'))).toBe('March 2026')
  })

  it('returns last day of month as ISO date', () => {
    expect(endOfMonthIso(new Date('2026-02-10'))).toBe('2026-02-28')
    expect(endOfMonthIso(new Date('2024-02-10'))).toBe('2024-02-29')
  })
})
