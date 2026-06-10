import type { Transition, Variants } from 'framer-motion'

export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const

export const pageTransition: Transition = {
  duration: 0.14,
  ease: [0.25, 0.1, 0.25, 1],
}

export const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

export const heroContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.1 },
  },
}

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: PREMIUM_EASE },
  },
}

export function portalLayoutKey(pathname: string): string {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/dashboard')) return 'dashboard'
  if (pathname.startsWith('/choose-instruments')) return 'choose-instruments'
  return pathname
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}
