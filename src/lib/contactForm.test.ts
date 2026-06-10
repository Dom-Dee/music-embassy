import { describe, expect, it } from 'vitest'
import { buildContactEmailUrl } from './contactForm'

describe('buildContactEmailUrl', () => {
  it('builds a Gmail compose link to the studio inbox', () => {
    const href = buildContactEmailUrl({
      name: 'Alex',
      email: 'alex@example.com',
      subject: 'Enrolling in lessons',
      message: 'Hello there',
    })

    expect(href).toContain('mail.google.com/mail/')
    expect(href).toContain('musicembassy.edu%40gmail.com')
    expect(href).toContain('Alex')
    expect(href).toContain('alex%40example.com')
  })
})
