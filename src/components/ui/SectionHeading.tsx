import { motion } from 'framer-motion'

type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: Props) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-14 max-w-3xl ${alignClass}`}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold/85">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-4xl font-normal tracking-tight text-fg md:text-5xl">
        {title}
      </h2>
      <div
        className={`liquid-divider mt-5 ${align === 'center' ? 'mx-auto w-16' : 'w-16'}`}
        aria-hidden
      />
      {subtitle ? (
        <p className="mt-4 text-lg leading-relaxed text-muted md:text-xl">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  )
}
