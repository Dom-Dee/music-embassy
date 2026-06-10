import { useLocation } from 'react-router-dom'

/** Top-level screens where a back control is not shown. */
function isRootScreen(pathname: string): boolean {
  if (pathname === '/' || pathname === '/dashboard' || pathname === '/choose-instruments') {
    return true
  }
  return pathname === '/admin'
}

/** True when the user can return to a prior page in browser history. */
export function useCanGoBack(): boolean {
  const { pathname } = useLocation()

  if (isRootScreen(pathname)) return false
  if (typeof window === 'undefined') return false

  return window.history.length > 1
}
