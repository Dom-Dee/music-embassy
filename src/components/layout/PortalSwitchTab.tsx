import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PREMIUM_EASE } from '../../lib/motion'

function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

type PortalSwitchTabProps = {
  to: string
  eyebrow: string
  title: string
}

export function PortalSwitchTab({ to, eyebrow, title }: PortalSwitchTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: PREMIUM_EASE, delay: 0.15 }}
      className="floating-safe fixed z-[60] md:bottom-8 md:right-8"
    >
      <Link
        to={to}
        className="glass-wood-surface group flex items-center gap-3 rounded-2xl border border-gold/25 py-3 pl-3.5 pr-5 shadow-[var(--shadow-card-hover)] transition-[border-color,box-shadow] duration-300 hover:border-gold/40"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/14 text-gold ring-1 ring-gold/22 transition-colors group-hover:bg-gold/20">
          <IconArrowLeft className="h-4 w-4" />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/90">
            {eyebrow}
          </span>
          <span className="block text-sm font-medium text-fg">{title}</span>
        </span>
      </Link>
    </motion.div>
  )
}
