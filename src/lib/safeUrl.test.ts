import { describe, expect, it } from 'vitest'
import { safeExternalUrl } from './safeUrl'

describe('safeExternalUrl', () => {
  it('allows http and https links', () => {
    expect(safeExternalUrl('https://example.com/path')).toBe(
      'https://example.com/path',
    )
    expect(safeExternalUrl('http://example.com')).toBe('http://example.com/')
  })

  it('blocks javascript and other schemes', () => {
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull()
    expect(safeExternalUrl('data:text/html,hello')).toBeNull()
  })

  it('returns null for empty or invalid values', () => {
    expect(safeExternalUrl('')).toBeNull()
    expect(safeExternalUrl('not a url')).toBeNull()
  })
})
