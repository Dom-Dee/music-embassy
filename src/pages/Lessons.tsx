import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { lessonTypes } from '../data/content'
import { images } from '../data/images'
import { GlassCard } from '../components/ui/GlassCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { IconCheck } from '../components/icons'
import { heroContainer, heroItem } from '../lib/motion'

const instrumentEmoji: Record<string, string> = {
  Drums: '🥁',
  Piano: '🎹',
  Saxophone: '🎷',
  'Voice Training': '🎤',
}

const steps = [
  {
    step: '01',
    title: 'Discover your path',
    description:
      'Share your goals and influences. We match you with a teacher and a curriculum shaped around your sound.',
  },
  {
    step: '02',
    title: 'Learn with precision',
    description:
      'Weekly sessions, clear practice frameworks, and feedback that respects both craft and creativity.',
  },
  {
    step: '03',
    title: 'Perform & share',
    description:
      'Optional showcases, recitals, and digital releases so progress becomes presence.',
  },
] as const

const stats = [
  { value: '4', label: 'Disciplines' },
  { value: 'Bespoke', label: 'Curriculum for each student' },
  { value: '1:1', label: 'Instructor sessions' },
  { value: 'Accra', label: 'Global community' },
] as const

const perks = [
  'Personalized learning plan from day one',
  'Dedicated instructor who knows your sound',
  'Flexible scheduling around your life',
  'Optional performance opportunities',
]

export function Lessons() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_90%_50%_at_50%_-8%,var(--glow-ambient-1),transparent_52%)]"
        aria-hidden
      />

      <section className="lessons-hero relative isolate overflow-hidden border-b border-border">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_1.12fr] lg:min-h-[min(76svh,46rem)]">
          <div className="relative order-2 flex flex-col justify-center px-6 py-14 sm:px-8 sm:py-16 lg:order-1 lg:px-10 lg:py-20 xl:px-14">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-gradient-to-b from-transparent via-gold/35 to-transparent lg:block"
              aria-hidden
            />
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="show"
              className="relative max-w-xl"
            >
              <motion.p
                variants={heroItem}
                className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gold/88"
              >
                Private instruction &amp; mentorship
              </motion.p>
              <motion.h1
                variants={heroItem}
                className="font-display text-[2.5rem] font-normal leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-[3.25rem]"
              >
                Lessons that feel bespoke,<br className="hidden sm:block" /> because they are.
              </motion.h1>
              <motion.p
                variants={heroItem}
                className="mt-8 max-w-lg text-lg leading-relaxed text-muted"
              >
                From first notes to professional polish: structured, human, and
                shaped entirely around you.
              </motion.p>
              <motion.div variants={heroItem} className="mt-10 flex flex-wrap gap-4">
                <Button to="/contact">Book a consultation</Button>
                <Button to="/music" variant="secondary">
                  Hear our artists
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative order-1 min-h-[16rem] sm:min-h-[22rem] lg:order-2 lg:min-h-full">
            <motion.img
              src={images.lessonsHero}
              alt=""
              className="lessons-hero-image absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="lessons-hero-image-edge pointer-events-none absolute inset-0" aria-hidden />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-page to-transparent lg:hidden"
              aria-hidden
            />
          </div>
        </div>
      </section>

      <section className="premium-band relative border-y border-border py-12 md:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(184,167,138,0.05)_45%,transparent)]" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4 lg:px-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              className="text-center md:text-left"
            >
              <p className="font-display text-2xl text-fg md:text-3xl">{s.value}</p>
              <p className="mt-1.5 text-xs leading-snug text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="What we teach"
            title="Our instruments"
            subtitle="Drums, piano, saxophone, and voice training. Each path blends technique with room to find your sound."
          />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {lessonTypes.map((t, i) => (
              <motion.article
                key={t.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-glass transition-[border-color,box-shadow] duration-300 hover:border-gold/28 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={t.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-page via-page/45 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/14 to-gold/4 opacity-0 transition duration-300 group-hover:opacity-100" />
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-page/75 text-lg backdrop-blur-md shadow-sm">
                    {instrumentEmoji[t.title] ?? '🎵'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-fg">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.description}</p>
                  <Link
                    to="/sign-up"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-gold/85 opacity-100 transition duration-200 hover:text-gold sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <span>Enroll now</span>
                    <span className="translate-x-0 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-band relative border-y border-border py-24 md:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">Why it works</p>
              <h2 className="mt-4 font-display text-4xl text-fg md:text-5xl">Built for your growth</h2>
              <p className="mt-5 text-lg text-muted">
                Every detail is designed so you can focus on the music, not the administration.
              </p>
              <ul className="mt-10 space-y-4">
                {perks.map((perk, i) => (
                  <motion.li
                    key={perk}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/18 ring-1 ring-gold/30">
                      <IconCheck className="h-3 w-3 text-gold" />
                    </span>
                    <span className="text-muted">{perk}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10">
                <Button to="/sign-up">Start your journey</Button>
              </div>
            </motion.div>

            <SectionHeading
              eyebrow="Process"
              title="How lessons work"
              subtitle="A calm rhythm, so you always know what comes next."
              align="left"
            />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative"
              >
                {i < steps.length - 1 ? (
                  <div
                    className="pointer-events-none absolute -right-4 top-8 hidden h-px w-8 bg-gradient-to-r from-gold/40 to-transparent md:block"
                    aria-hidden
                  />
                ) : null}
                <GlassCard className="h-full !p-7">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/14 ring-1 ring-gold/25">
                    <span className="text-xs font-bold tracking-wider text-gold">{s.step}</span>
                  </div>
                  <h3 className="font-display text-xl text-fg">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {s.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
