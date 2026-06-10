import type { ReactNode } from 'react'

type AuthActionTrayProps = {
  children: ReactNode
  /** Compact tray for nav headers */
  compact?: boolean
  /** Slightly softer tray for sign out */
  tone?: 'primary' | 'exit'
  className?: string
}

export function AuthActionTray({
  children,
  compact = false,
  tone = 'primary',
  className = '',
}: AuthActionTrayProps) {
  return (
    <div
      className={`auth-action-tray ${
        tone === 'exit' ? 'auth-action-tray-exit' : ''
      } ${compact ? 'auth-action-tray-compact' : ''} ${className}`}
    >
      <div className="auth-action-tray-inner">{children}</div>
    </div>
  )
}
