import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders, escapeHtml } from '../_shared/http.ts'

type NotificationBody = {
  email: string
  fullName: string
  title: string
  body?: string
  type: 'lesson' | 'assignment' | 'quiz' | 'invoice'
}

const typeLabels: Record<NotificationBody['type'], string> = {
  lesson: 'New lesson',
  assignment: 'New assignment',
  quiz: 'Quiz scheduled',
  invoice: 'Invoice update',
}

async function isApprovedAdmin(userId: string): Promise<boolean> {
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  if (!serviceKey) return false

  const service = createClient(supabaseUrl, serviceKey)
  const { data } = await service
    .from('profiles')
    .select('role, status')
    .eq('id', userId)
    .maybeSingle()

  return data?.role === 'admin' && data?.status === 'approved'
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

    if (!(await isApprovedAdmin(user.id))) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const payload = (await req.json()) as NotificationBody
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail =
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

    const label = typeLabels[payload.type] ?? 'Update'
    const html = `
      <div style="font-family: Georgia, serif; color: #1a1714; max-width: 520px;">
        <h1 style="color: #7a6349;">Music Embassy</h1>
        <p>Hello ${escapeHtml(payload.fullName)},</p>
        <p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(payload.title)}</p>
        ${payload.body ? `<p>${escapeHtml(payload.body)}</p>` : ''}
        <p>Sign in to your student dashboard to view the details.</p>
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
        to: payload.email,
        subject: `${label}: ${payload.title} | Music Embassy`,
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
