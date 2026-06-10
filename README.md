# The Music Embassy

Premium music education site with a student dashboard and admin portal.

## Stack

React, TypeScript, Vite, Tailwind CSS, Supabase

## Setup

1. Copy env vars into `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Fresh database: run `supabase/schema.sql` in the Supabase SQL Editor.

3. App data & policies: run `supabase/RUN-IN-SUPABASE.sql`.

4. Admin account:
   ```bash
   npm run seed:admin
   ```
   Then run `supabase/RUN-IN-SUPABASE.sql` again if the admin role is missing.

5. Edge functions (email reminders and publish alerts):

   Install the [Supabase CLI](https://supabase.com/docs/guides/cli), link your project, then deploy:

   ```bash
   supabase functions deploy send-payment-reminder
   supabase functions deploy send-portal-notification
   supabase functions deploy send-contact-message
   ```

   Set secrets in the Supabase dashboard (Project Settings → Edge Functions → Secrets) or via CLI:

   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxx
   supabase secrets set PAYMENT_REMINDER_FROM="Music Embassy <billing@yourdomain.com>"
   supabase secrets set PORTAL_NOTIFICATION_FROM="Music Embassy <notify@yourdomain.com>"
   supabase secrets set CONTACT_INBOX_EMAIL="musicembassy.edu@gmail.com"
   supabase secrets set CONTACT_FROM_EMAIL="Music Embassy <notify@yourdomain.com>"
   ```

   - `send-payment-reminder` — sent when a student with outstanding invoices opens the dashboard.
   - `send-portal-notification` — sent when an admin publishes a lesson, assignment, or quiz.
   - `send-contact-message` — delivers the Contact page form to `musicembassy.edu@gmail.com`.

   Both functions use [Resend](https://resend.com). Verify your sending domain in Resend before going live.

   For portal notification emails, also set:

   ```bash
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   supabase secrets set ALLOWED_ORIGIN=https://your-production-domain.com
   ```

6. Security hardening: re-run `supabase/RUN-IN-SUPABASE.sql` through **section 11** after updates. This adds profile protection, secure assignment submission, private file storage, and scoped storage policies.

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run preview  # preview production build
```

## Project layout

- `src/` — React app
- `public/` — static assets
- `supabase/` — database schema and SQL setup
- `scripts/` — one-off setup helpers
