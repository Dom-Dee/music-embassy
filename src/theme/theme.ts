export type Theme = 'dark' | 'light'
export type ThemePreference = 'system' | Theme

const STORAGE_KEY = 'music-embassy-theme'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

export function setStoredThemePreference(preference: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, preference)
}

export function resolveTheme(preference: ThemePreference): Theme {
  if (preference === 'system') return getSystemTheme()
  return preference
}

export function applyResolvedTheme(theme: Theme) {
  applyTheme(theme)
}

/** Run before React mounts so the first paint matches saved or system theme */
export function initThemeFromSystem() {
  applyResolvedTheme(resolveTheme(getStoredThemePreference()))
}

export function syncThemeWithSystem() {
  if (getStoredThemePreference() !== 'system') return
  applyResolvedTheme(getSystemTheme())
}
