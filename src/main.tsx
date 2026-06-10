import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { supabase } from './lib/supabase'
import { initThemeFromSystem } from './theme/theme'

initThemeFromSystem()

// Wake the database as early as possible — before React even renders.
// Free-tier Supabase databases sleep after inactivity and take 3–5 s to
// respond on the first request. Firing this ping here means it's in flight
// the whole time the user is looking at the sign-in form.
void supabase.from('instruments').select('id').limit(1)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
