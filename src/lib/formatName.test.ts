import { describe, expect, it } from 'vitest'
import { formatFirstName } from './formatName'

describe('formatFirstName', () => {
  it('capitalises the first word', () => {
    expect(formatFirstName('dominic owusu')).toBe('Dominic')
    expect(formatFirstName('JANE DOE')).toBe('Jane')
  })

  it('handles empty input', () => {
    expect(formatFirstName('')).toBe('')
    expect(formatFirstName('   ')).toBe('')
  })
})
