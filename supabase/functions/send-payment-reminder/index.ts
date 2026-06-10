import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders, escapeHtml } from '../_shared/http.ts'

type ReminderBody = {
  email: string
  fullName: string
  total: string
  invoiceCount: number
  invoices: Array<{
    month: string
    amount: string
    dueDate: string
    status: string
  }>
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get('Origin'))

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json()) as ReminderBody

    if (body.email.toLowerCase() !== (user.email ?? '').toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    if (!body.invoices?.length || body.invoiceCount < 1) {
      return new Response(JSON.stringify({ error: 'No invoices to remind' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail =
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

    const invoiceLines = body.invoices
      .map(
        (inv) =>
          `<li><strong>${escapeHtml(inv.month)}</strong>: ${escapeHtml(inv.amount)} (due ${escapeHtml(inv.dueDate)}, ${escapeHtml(inv.status)})</li>`,
      )
      .join('')

    const html = `
      <div style="font-family: Georgia, serif; color: #1a1714; max-width: 520px;">
        <h1 style="color: #7a6349;">Music Embassy</h1>
        <p>Hello ${escapeHtml(body.fullName)},</p>
        <p>This is a friendly reminder that you have an outstanding balance of <strong>${escapeHtml(body.total)}</strong> across ${body.invoiceCount} invoice(s).</p>
        <ul>${invoiceLines}</ul>
        <p>Please arrange payment at your earliest convenience. If you have already paid, you can disregard this message.</p>
        <p style="color: #6b6560; font-size: 14px;">Accra, Ghana · musicembassy.edu@gmail.com</p>
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
        to: body.email,
        subject: `Payment reminder: ${body.total} due | Music Embassy`,
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
