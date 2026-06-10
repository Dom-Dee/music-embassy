import { motion, type HTMLMotionProps, type Transition } from 'framer-motion'
import { Link, type LinkProps } from 'react-router-dom'
import { type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const styles: Record<Variant, string> = {
  primary:
    'btn-primary text-on-gold shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset] shadow-black/15 hover:brightness-[1.03] hover:shadow-md hover:shadow-black/20 active:brightness-[0.98]',
  secondary:
    'border border-[color:var(--btn-secondary-border)] bg-glass text-[var(--btn-secondary-fg)] backdrop-blur-sm hover:bg-[var(--btn-secondary-hover-bg)] hover:shadow-sm hover:brightness-[1.02] active:brightness-[0.98]',
  ghost:
    'text-muted hover:text-fg hover:bg-gold/[0.08] active:bg-gold/[0.12]',
}

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-[color,background-color,border-color,box-shadow,filter] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/55'

const btnMotionTransition: Transition = {
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
}

const MotionLink = motion.create(Link)

type NativeButtonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
  to?: undefined
  type?: 'button' | 'submit' | 'reset'
} & Omit<HTMLMotionProps<'button'>, 'children' | 'type'>

type RouterLinkButtonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
  to: string
} & Omit<LinkProps, 'children' | 'className'>

export type ButtonProps = NativeButtonProps | RouterLinkButtonProps

export function Button(props: ButtonProps) {
  const { variant = 'primary', className = '' } = props
  const cls = `${baseClass} ${styles[variant]} ${className}`

  const motionProps = {
    whileHover: { y: -1 },
    whileTap: { y: 0, scale: 0.99 },
    transition: btnMotionTransition,
  } as const

  if ('to' in props && typeof props.to === 'string') {
    const { to, children: c } = props
    return (
      <MotionLink to={to} className={cls} {...motionProps}>
        {c}
      </MotionLink>
    )
  }

  const native = { ...(props as NativeButtonProps) }
  delete native.variant
  delete native.className
  const { children: c, type = 'button', ...btnRest } = native

  return (
    <motion.button
      type={type}
      {...btnRest}
      {...motionProps}
      className={cls}
    >
      {c}
    </motion.button>
  )
}
