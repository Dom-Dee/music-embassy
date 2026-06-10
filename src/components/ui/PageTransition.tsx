import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageFade, pageTransition } from '../../lib/motion'

type PageTransitionProps = {
  routeKey: string
  children: ReactNode
}

export function PageTransition({ routeKey, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={routeKey}
        {...pageFade}
        transition={pageTransition}
        className="page-transition w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
