import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { IconTrebleClef } from '../icons'

export const siteBrandClassName =
  'site-brand relative z-10 inline-flex min-w-0 shrink-0 items-center gap-2 font-display text-xl tracking-tight text-fg md:text-2xl'

type SiteBrandLinkProps = {
  className?: string
  onClick?: () => void
}

export function SiteBrandLink({ className = '', onClick }: SiteBrandLinkProps) {
  return (
    <Link to="/" onClick={onClick} className={`${siteBrandClassName} ${className}`.trim()}>
      <IconTrebleClef className="h-[1em] w-auto shrink-0" />
      <span className="truncate">The Music Embassy</span>
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
      className={`site-header-inner relative mx-auto flex h-[4.5rem] max-w-7xl items-center px-6 pr-[5.75rem] lg:px-8 lg:pr-8 ${className}`.trim()}
    >
      {children}
    </div>
  )
}
