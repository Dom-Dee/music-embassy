import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, PREMIUM_EASE, staggerContainer } from '../../lib/motion'

export type SummaryItemData = {
  label: string
  value: string
  detail: string
  icon: ReactNode
  emphasis?: boolean
  highlight?: boolean
  onClick?: () => void
  active?: boolean
}

function SummaryItem({
  label,
  value,
  detail,
  icon,
  emphasis,
  highlight,
  onClick,
  active,
}: SummaryItemData) {
  const interactive = Boolean(onClick)

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          {label}
        </p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60 text-gold">
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p
          className={`font-display text-3xl leading-none tracking-tight tabular-nums md:text-[2rem] ${
            emphasis || highlight ? 'text-gold' : 'text-fg'
          }`}
        >
          {value}
        </p>
        <p className="mt-2 text-sm leading-snug text-muted">{detail}</p>
      </div>
    </>
  )

  const className = `flex h-full min-w-0 flex-1 flex-col gap-4 px-6 py-6 text-left transition-colors ${
    interactive
      ? 'cursor-pointer hover:bg-gold/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold/45'
      : ''
  } ${active || highlight ? 'bg-gold/[0.06]' : ''}`

  if (interactive) {
    return (
      <motion.button
        type="button"
        variants={fadeUp}
        transition={{ duration: 0.42, ease: PREMIUM_EASE }}
        onClick={onClick}
        className={className}
        aria-pressed={active}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.42, ease: PREMIUM_EASE }}
      className={className}
    >
      {content}
    </motion.div>
  )
}

type DashboardSummaryProps = {
  items: SummaryItemData[]
}

export function DashboardSummary({ items }: DashboardSummaryProps) {
  return (
    <div className="glass-wood-surface liquid-panel overflow-hidden rounded-2xl">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid auto-rows-fr divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-5"
      >
        {items.map((item) => (
          <SummaryItem key={item.label} {...item} />
        ))}
      </motion.div>
    </div>
  )
}
