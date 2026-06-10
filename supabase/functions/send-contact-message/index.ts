import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders, escapeHtml, isValidEmail } from '../_shared/http.ts'

type ContactBody = {
  name: string
  email: string
  subject: string
  message: string
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get('Origin'))

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  }

  try {
    const apikey = req.headers.get('apikey')
    if (!apikey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { apikey } } },
    )

    const body = (await req.json()) as ContactBody
    const name = body.name?.trim().slice(0, 120) ?? ''
    const email = body.email?.trim().slice(0, 200) ?? ''
    const subject = body.subject?.trim().slice(0, 200) ?? 'General enquiry'
    const message = body.message?.trim().slice(0, 5000) ?? ''

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    const inbox =
      Deno.env.get('CONTACT_INBOX_EMAIL') ?? 'musicembassy.edu@gmail.com'
    const fromEmail =
      Deno.env.get('CONTACT_FROM_EMAIL') ??
      Deno.env.get('PORTAL_NOTIFICATION_FROM') ??
      Deno.env.get('PAYMENT_REMINDER_FROM') ??
      'Music Embassy <onboarding@resend.dev>'

    if (!resendKey) {
      return new Response(
        JSON.stringify({
          error: 'RESEND_API_KEY not configured on Supabase Edge Functions',
        }),
        { status: 503, headers: { ...headers, 'Content-Type': 'application/json' } },
      )
    }

    const html = `
      <div style="font-family: Georgia, serif; color: #1a1714; max-width: 560px;">
        <h1 style="color: #7a6349; font-size: 20px;">New contact message</h1>
        <p><strong>From:</strong> ${escapeHtml(name)}</p>
        <p><strong>Reply to:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr style="border: none; border-top: 1px solid #e8e4df; margin: 20px 0;" />
        <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: inbox,
        reply_to: email,
        subject: `[Music Embassy] ${subject} — ${name}`,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return new Response(JSON.stringify({ error: errText }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      },
    )
  }
})
