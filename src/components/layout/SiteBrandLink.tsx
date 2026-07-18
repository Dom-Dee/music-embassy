import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const siteBrandClassName =
  'site-brand relative z-10 min-w-0 shrink-0 truncate font-display text-xl tracking-tight text-fg md:text-2xl'

type SiteBrandLinkProps = {
  className?: string
  onClick?: () => void
}

export function SiteBrandLink({ className = '', onClick }: SiteBrandLinkProps) {
  return (
    <Link to="/" onClick={onClick} className={`${siteBrandClassName} ${className}`.trim()}>
      The Music Embassy
    </Link>
  )
}

type SiteHeaderInnerProps = {
  children: ReactNode
  className?: string
}

export function SiteHeaderInner({ children, className = '' }: SiteHeaderInnerProps) {
  return (
    <div
      className={`site-header-inner relative mx-auto flex h-[4.5rem] max-w-7xl items-center px-6 lg:px-8 ${className}`.trim()}
    >
      {children}
    </div>
  )
}
