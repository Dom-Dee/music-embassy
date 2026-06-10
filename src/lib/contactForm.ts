import { STUDIO_EMAIL } from '../data/contact'
import { buildGmailComposeUrl, openEmailCompose } from './emailLinks'
import { supabase } from './supabase'

export type ContactFormInput = {
  name: string
  email: string
  subject: string
  message: string
}

function contactEmailContent(input: ContactFormInput) {
  return {
    to: STUDIO_EMAIL,
    subject: `[Music Embassy] ${input.subject} — ${input.name}`,
    body: `Name: ${input.name}\nReply to: ${input.email}\nSubject: ${input.subject}\n\n${input.message}`,
  }
}

/** Gmail compose link with the contact form message pre-filled. */
export function buildContactEmailUrl(input: ContactFormInput): string {
  return buildGmailComposeUrl(contactEmailContent(input))
}

function shouldFallbackToEmailApp(message: string): boolean {
  return (
    message.includes('Failed to send a request to the Edge Function') ||
    message.includes('Function not found') ||
    message.includes('404') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('RESEND_API_KEY') ||
    message.includes('validation_error') ||
    message.includes('Edge Function returned a non-2xx')
  )
}

export async function sendContactMessage(
  input: ContactFormInput,
): Promise<{
  sent: boolean
  via: 'email' | 'mailto'
  error?: string
  mailtoHref?: string
}> {
  const { data, error } = await supabase.functions.invoke('send-contact-message', {
    body: input,
  })

  if (!error && data && typeof data === 'object' && 'ok' in data && data.ok) {
    return { sent: true, via: 'email' }
  }

  const dataError =
    data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
      ? data.error
      : undefined
  const message = error?.message ?? dataError ?? 'Could not reach the messaging service.'
  const emailHref = buildContactEmailUrl(input)

  if (shouldFallbackToEmailApp(message)) {
    openEmailCompose(contactEmailContent(input))
    return { sent: true, via: 'mailto', mailtoHref: emailHref }
  }

  return { sent: false, via: 'email', error: message, mailtoHref: emailHref }
}
