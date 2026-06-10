import { openExternalUrl } from './navigation'

type EmailComposeInput = {
  to: string
  subject?: string
  body?: string
}

export function buildGmailComposeUrl(input: EmailComposeInput): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: input.to })
  if (input.subject) params.set('su', input.subject)
  if (input.body) params.set('body', input.body)
  return `https://mail.google.com/mail/?${params.toString()}`
}

export function openEmailCompose(input: EmailComposeInput): string {
  const gmailUrl = buildGmailComposeUrl(input)
  openExternalUrl(gmailUrl)
  return gmailUrl
}
