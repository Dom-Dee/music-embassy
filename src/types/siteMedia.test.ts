import { describe, expect, it } from 'vitest'
import { parseEventDateParts } from './siteMedia'

describe('parseEventDateParts', () => {
  it('parses month and day from display strings', () => {
    expect(parseEventDateParts('Mar 15, 2026')).toEqual({
      month: 'MAR',
      day: '15',
      full: 'Mar 15, 2026',
    })
  })

  it('returns placeholders for missing dates', () => {
    expect(parseEventDateParts(null)).toEqual({
      month: 'TBA',
      day: '—',
      full: 'Date TBA',
    })
  })
})
