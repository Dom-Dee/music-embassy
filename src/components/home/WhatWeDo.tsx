import { motion } from 'framer-motion'
import { GlassCard } from '../ui/GlassCard'
import { SectionHeading } from '../ui/SectionHeading'
import { IconMic, IconSparkle, IconUsers } from '../icons'

const cards = [
  {
    title: 'Teach Music',
    body: 'Accomplished instructors meet you where you are: technique, theory, and artistry in harmony.',
    icon: IconMic,
  },
  {
    title: 'Showcase Music',
    body: 'Curated stages and digital showcases spotlight voices that deserve to be heard worldwide.',
    icon: IconSparkle,
  },
  {
    title: 'Build Community',
    body: 'Collaboration, mentorship, and culture: a network of artists who lift each other higher.',
    icon: IconUsers,
  },
] as const

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
}

const cardMotion = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function WhatWeDo() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(100%,72rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we do"
          title="Three pillars. One movement."
          subtitle="Everything we build serves musicians who teach, create, and gather, with clarity and soul."
        />
        <motion.ul
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-8 md:grid-cols-3"
        >
          {cards.map((c) => (
            <motion.li key={c.title} variants={cardMotion}>
              <GlassCard className="flex h-full flex-col">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/12 text-gold ring-1 ring-border">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl text-fg">{c.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {c.body}
                </p>
              </GlassCard>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
