import { motion } from 'framer-motion'
import { images } from '../data/images'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { heroContainer, heroItem, PREMIUM_EASE } from '../lib/motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.55, ease: PREMIUM_EASE },
  }),
}

const pillars = [
  {
    id: 'story' as const,
    label: 'Our Story',
    kicker: 'Origins',
    body: [
      'Music Embassy began as a small circle of teachers and performers who believed excellence in music should never be gatekept by geography.',
      'Today we connect instructors, students, and audiences across continents, with the same warmth as a living room lesson and the reach of a world stage.',
    ],
    image: images.teaching,
    align: 'left' as const,
  },
  {
    id: 'vision' as const,
    label: 'Vision',
    kicker: 'North star',
    body: [
      'We envision a world where every curious mind can learn with dignity, perform with pride, and belong to a creative community that celebrates difference.',
    ],
    image: images.studio,
    align: 'right' as const,
  },
  {
    id: 'mission' as const,
    label: 'Mission',
    kicker: 'How we show up',
    body: [
      'We design premium learning paths, curate unforgettable showcases, and nurture community so that music remains a bridge between cultures, generations, and dreams.',
    ],
    image: images.live,
    align: 'left' as const,
  },
] as const

const values = [
  {
    title: 'Craft',
    text: 'Rigorous technique, never at the expense of soul. Every lesson is tuned to the artist behind the instrument.',
  },
  {
    title: 'Connection',
    text: 'Mentorship and ensemble energy, so no one practices in isolation, and every voice finds its room.',
  },
  {
    title: 'Courage',
    text: 'Stage, studio, or screen: we celebrate the leap from practice to performance with unflinching support.',
  },
] as const

const rhythmLabels = [
  'Bespoke curricula',
  'Live & digital showcases',
  'Accra · Global cohorts',
]

export function About() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_100%_60%_at_20%_-10%,var(--glow-ambient-1),transparent_55%),radial-gradient(ellipse_80%_50%_at_85%_30%,var(--glow-ambient-2),transparent_50%)]"
        aria-hidden
      />

      <section className="relative isolate min-h-[min(92svh,56rem)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={images.piano}
            alt=""
            className="about-hero-image"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="hero-film-top" />
          <div className="hero-film-side" />
          <div className="hero-film-vignette" />
          <div className="hero-film-accent" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-6 pb-20 pt-32 md:min-h-[min(92svh,56rem)] md:justify-center md:pb-28 md:pt-36 lg:px-8">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div
              variants={heroItem}
              className="mb-8 flex flex-wrap gap-3"
            >
              {rhythmLabels.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-glass px-4 py-2 text-xs font-medium tracking-wide text-fg shadow-[0_0_28px_-14px_rgba(212,175,55,0.18)] backdrop-blur-md"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.p
              variants={heroItem}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.38em] text-gold/85"
            >
              About Music Embassy
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="font-display text-[2.65rem] font-normal leading-[1.06] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-[3.5rem]"
            >
              Where artistry meets intention, and every note is held with care.
            </motion.h1>

            <motion.div
              variants={heroItem}
              className="mt-8 h-px w-24 bg-gradient-to-r from-gold via-gold/45 to-transparent"
            />

            <motion.p
              variants={heroItem}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
            >
              Elegance in teaching. Courage in performance. Generosity in
              community: the same standards you&apos;d expect from a world class
              institution, with the warmth of a room full of people who truly
              listen.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-11 flex flex-wrap gap-4"
            >
              <Button to="/lessons">Explore lessons</Button>
              <Button to="/contact" variant="secondary">
                Speak with us
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-muted">
            <span>Scroll</span>
            <span className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
          </div>
        </motion.div>
      </section>

      <section className="premium-band relative border-y border-border py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.06)_50%,transparent)]" />
        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="font-display text-2xl leading-snug text-fg md:text-3xl lg:text-[2.15rem]"
          >
            “We don’t teach music as a checklist. We cultivate a living culture
            around it.”
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 text-sm font-medium tracking-wide text-muted"
          >
            The founding ethos of Music Embassy
          </motion.p>
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
            className="mb-20 max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">
              The narrative
            </p>
            <h2 className="mt-4 font-display text-4xl text-fg md:text-5xl">
              Three threads, one tapestry
            </h2>
            <p className="mt-4 text-lg text-muted">
              Story, vision, and mission, each told with room to breathe, like
              chapters in a luxury album booklet.
            </p>
          </motion.div>

          <div className="flex flex-col gap-24 md:gap-32">
            {pillars.map((block, index) => {
              const isRight = block.align === 'right'
              return (
                <motion.article
                  key={block.label}
                  id={block.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-100px' }}
                  className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${isRight ? 'lg:[&>div:first-child]:order-2' : ''}`}
                >
                  <motion.div
                    custom={index}
                    variants={{
                      hidden: { opacity: 0, x: isRight ? 40 : -40 },
                      show: (i: number) => ({
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: 0.08 * i,
                          duration: 0.75,
                          ease: [0.22, 1, 0.36, 1] as const,
                        },
                      }),
                    }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/12 via-transparent to-gold/6 opacity-70 blur-2xl md:-inset-8" />
                    <div className="relative overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card-hover)] ring-1 ring-border">
                      <motion.img
                        src={block.image}
                        alt=""
                        className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-page/85 via-transparent to-transparent" />
                    </div>
                  </motion.div>

                  <motion.div
                    custom={index}
                    variants={{
                      hidden: { opacity: 0, y: 36 },
                      show: (i: number) => ({
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: 0.1 + 0.06 * i,
                          duration: 0.65,
                          ease: [0.22, 1, 0.36, 1] as const,
                        },
                      }),
                    }}
                    className="relative"
                  >
                    <span className="font-display text-7xl leading-none text-fg/[0.08] md:text-8xl">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="-mt-10 md:-mt-12">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/90">
                        {block.kicker}
                      </p>
                      <h3 className="mt-3 font-display text-3xl text-fg md:text-4xl">
                        {block.label}
                      </h3>
                      <div className="relative mt-6 space-y-5 pl-7">
                        <span
                          className="pointer-events-none absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-gold/80 via-gold/35 to-gold/50"
                          aria-hidden
                        />
                        {block.body.map((paragraph, j) => (
                          <p
                            key={`${block.label}-${j}`}
                            className="text-[1.05rem] leading-[1.8] text-muted"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="premium-band relative border-t border-border pt-24 pb-12 md:pt-28 md:pb-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">
              What we protect
            </p>
            <h2 className="mt-4 font-display text-4xl text-fg md:text-5xl">
              Values that stay in the room
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  show: fadeUp,
                }}
              >
                <GlassCard className="h-full !p-7 md:!p-8">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/12 ring-1 ring-border">
                    <span className="font-display text-lg text-gold">
                      {v.title[0]}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-fg">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {v.text}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pt-6 pb-16 md:pt-8 md:pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 sm:grid-cols-4 md:gap-4 lg:px-8">
          {[images.violin, images.guitar, images.mixer, images.community].map(
            (src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  delay: 0.06 * i,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-xl border border-border shadow-[var(--shadow-card)]"
              >
                <img
                  src={src}
                  alt=""
                  className="aspect-[5/6] w-full object-cover sm:aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-page/75 via-transparent to-transparent opacity-90" />
              </motion.div>
            ),
          )}
        </div>
      </section>

      <section className="relative pb-28 pt-4">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-wood-surface liquid-panel relative overflow-hidden rounded-3xl border border-border p-10 shadow-[var(--shadow-card-hover)] md:p-14"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/12 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gold/8 blur-[70px]" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">
                Join the movement
              </p>
              <h2 className="mt-5 max-w-xl font-display text-3xl text-fg md:text-4xl">
                Step into a space built for serious music and serious joy.
              </h2>
              <p className="mt-5 max-w-lg text-muted">
                Lessons, showcases, and community in one continuous experience.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button to="/community">Discover community</Button>
                <Button to="/music" variant="secondary">
                  Browse showcases
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
