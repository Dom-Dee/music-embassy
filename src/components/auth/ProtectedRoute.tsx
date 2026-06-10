import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { isApprovedAdmin, isApprovedStudent } from '../../auth/types'

type ProtectedRouteProps = {
  requireAdmin?: boolean
  requireStudent?: boolean
}

export function ProtectedRoute({
  requireAdmin = false,
  requireStudent = false,
}: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading || (session && !profile)) {
    return (
      <div className="app-canvas flex min-h-svh items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
            aria-hidden
          />
          <p className="text-sm text-muted">Loading your session…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }

  if (requireAdmin && !isApprovedAdmin(profile)) {
    return <Navigate to="/dashboard" replace />
  }

  if (requireStudent && !isApprovedStudent(profile)) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
