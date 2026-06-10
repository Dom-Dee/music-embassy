import { describe, expect, it } from 'vitest'
import {
  countUpcomingQuizzes,
  isDueOnOrAfter,
  isScheduledOnOrAfter,
} from './portalTime'

const now = new Date('2026-05-19T12:00:00').getTime()

describe('portalTime', () => {
  it('detects upcoming scheduled items', () => {
    expect(isScheduledOnOrAfter('2026-05-20T10:00:00Z', now)).toBe(true)
    expect(isScheduledOnOrAfter('2026-05-18T10:00:00Z', now)).toBe(false)
  })

  it('detects open assignment due dates', () => {
    expect(isDueOnOrAfter('2026-05-20', now)).toBe(true)
    expect(isDueOnOrAfter('2026-05-18', now)).toBe(false)
  })

  it('counts upcoming quizzes', () => {
    const count = countUpcomingQuizzes(
      [
        { scheduled_at: '2026-05-20T10:00:00Z' },
        { scheduled_at: '2026-05-10T10:00:00Z' },
      ],
      now,
    )
    expect(count).toBe(1)
  })
})
