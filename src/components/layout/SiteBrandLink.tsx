import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const siteBrandClassName =
  'site-brand relative z-10 inline-flex min-w-0 shrink-0 items-center gap-2 font-display text-xl tracking-tight text-fg md:text-2xl'

type SiteBrandLinkProps = {
  className?: string
  onClick?: () => void
}

function TrebleClefMark() {
  return (
    <span
      aria-hidden
      className="inline-block h-[1em] w-[0.58em] shrink-0 bg-current"
      style={{
        WebkitMaskImage: 'url(/treble-clef.png)',
        maskImage: 'url(/treble-clef.png)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

export function SiteBrandLink({ className = '', onClick }: SiteBrandLinkProps) {
  return (
    <Link to="/" onClick={onClick} className={`${siteBrandClassName} ${className}`.trim()}>
      <TrebleClefMark />
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
