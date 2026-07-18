import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { hasSupabaseConfig, supabase } from './lib/supabase'
import { initThemeFromSystem } from './theme/theme'

initThemeFromSystem()

const root = document.getElementById('root')!

if (!hasSupabaseConfig) {
  root.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;padding:2rem;font-family:system-ui,sans-serif;background:#0f0d0b;color:#f2f0ec;">
      <div style="max-width:32rem;border:1px solid rgba(184,167,138,0.35);border-radius:1rem;padding:1.5rem 1.75rem;background:#1a1714;">
        <p style="margin:0;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#b8a78a;">Music Embassy</p>
        <h1 style="margin:0.75rem 0 0;font-size:1.5rem;">Site configuration needed</h1>
        <p style="margin:0.85rem 0 0;line-height:1.55;color:#a8a29c;">
          This deployment is missing Supabase environment variables, so the app cannot start.
        </p>
        <ol style="margin:1rem 0 0;padding-left:1.2rem;line-height:1.7;color:#d6d0c8;">
          <li>Open your Vercel project → <strong>Settings → Environment Variables</strong></li>
          <li>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code></li>
          <li>Redeploy the project</li>
        </ol>
      </div>
    </div>
  `
} else {
  // Wake the database as early as possible — before React even renders.
  void supabase.from('instruments').select('id').limit(1)

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
