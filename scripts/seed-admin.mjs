/**
 * Creates the default admin auth user in Supabase.
 *
 * Usage:
 *   ADMIN_PASSWORD='your-strong-password' node scripts/seed-admin.mjs
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
 * After running, execute supabase/RUN-IN-SUPABASE.sql in the SQL Editor.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const envPath = resolve(root, '.env.local')

const ADMIN_EMAIL = 'admin@themusicembassy.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'abcdefg'
const ADMIN_NAME = 'Admin'

function loadEnv() {
  if (!existsSync(envPath)) {
    throw new Error('.env.local not found')
  }

  const env = {}
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1)
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required in .env.local')
}

const supabase = createClient(url, anonKey)

const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
})

if (!signInError && signInData.user) {
  console.log('Admin account already exists.')
  console.log('Sign in with username: admin')
  console.log('\nIf /admin does not load, run supabase/RUN-IN-SUPABASE.sql in Supabase SQL Editor.')
  process.exit(0)
}

const { data, error } = await supabase.auth.signUp({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  options: {
    data: { full_name: ADMIN_NAME },
  },
})

if (error) {
  console.error('Could not create admin user:', error.message)
  console.error('\nIf email confirmation is enabled, disable it under')
  console.error('Supabase → Authentication → Providers → Email, then re-run this script.')
  process.exit(1)
}

if (data.user && !data.session) {
  console.log('Admin user created but email confirmation may be required.')
  console.log('Disable email confirmation in Supabase Auth settings, then sign in,')
  console.log('or confirm the email from your inbox.')
} else {
  console.log('Admin account created successfully.')
}

console.log('\nSign in with:')
console.log('  Username: admin')
console.log('  Email:    admin@themusicembassy.com')
console.log('\nNext: run supabase/RUN-IN-SUPABASE.sql in the Supabase SQL Editor to grant admin role.')
console.log('Set a strong password with ADMIN_PASSWORD before production.')
