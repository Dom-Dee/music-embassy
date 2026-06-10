import { useEffect, type ReactNode } from 'react'
import { syncThemeWithSystem } from './theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    syncThemeWithSystem()
    media.addEventListener('change', syncThemeWithSystem)
    return () => media.removeEventListener('change', syncThemeWithSystem)
  }, [])

  return children
}
