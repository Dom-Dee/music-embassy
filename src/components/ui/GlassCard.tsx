import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'

type GlassCardProps = {
  children: ReactNode
  className?: string
} & HTMLMotionProps<'div'>

export function GlassCard({
  children,
  className = '',
  ...props
}: GlassCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-wood-surface liquid-panel rounded-2xl border border-border p-8 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
