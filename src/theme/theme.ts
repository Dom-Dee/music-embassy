export type Theme = 'dark' | 'light'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

/** Run before React mounts so the first paint matches the device */
export function initThemeFromSystem() {
  applyTheme(getSystemTheme())
}

export function syncThemeWithSystem() {
  applyTheme(getSystemTheme())
}
