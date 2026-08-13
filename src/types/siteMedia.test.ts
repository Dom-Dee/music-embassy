import { describe, expect, it } from 'vitest'
import {
  nextSiteMediaSortOrder,
  parseEventDateParts,
  siteMediaPositionLabel,
  sortSiteMediaItems,
} from './siteMedia'

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

describe('sortSiteMediaItems', () => {
  it('sorts by sort_order then newest first', () => {
    const items = [
      { id: 'b', sort_order: 10, created_at: '2026-01-01T00:00:00Z' },
      { id: 'a', sort_order: 0, created_at: '2026-01-02T00:00:00Z' },
      { id: 'c', sort_order: 10, created_at: '2026-01-03T00:00:00Z' },
    ]

    expect(sortSiteMediaItems(items).map((item) => item.id)).toEqual(['a', 'c', 'b'])
  })
})

describe('nextSiteMediaSortOrder', () => {
  it('starts at zero for an empty list', () => {
    expect(nextSiteMediaSortOrder([])).toBe(0)
  })

  it('appends after the highest sort order', () => {
    expect(nextSiteMediaSortOrder([{ sort_order: 0 }, { sort_order: 30 }])).toBe(40)
  })
})

describe('siteMediaPositionLabel', () => {
  it('describes first, middle, and last positions', () => {
    expect(siteMediaPositionLabel(0, 3)).toBe('Shows first on the site')
    expect(siteMediaPositionLabel(1, 3)).toBe('Shows 2nd on the site')
    expect(siteMediaPositionLabel(2, 3)).toBe('Shows last on the site')
  })
})
