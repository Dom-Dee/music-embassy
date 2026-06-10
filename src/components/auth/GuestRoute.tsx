import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { resolveLoginPath } from '../../lib/authRouting'

export function GuestRoute() {
  const { session, profile, loading } = useAuth()
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  useEffect(() => {
    if (loading || !session || !profile) return

    let cancelled = false
    void resolveLoginPath(profile).then((path) => {
      if (!cancelled) setRedirectTo(path)
    })

    return () => {
      cancelled = true
    }
  }, [loading, session, profile])

  if (!loading && session && profile && redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
