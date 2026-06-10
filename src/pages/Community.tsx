import { motion } from 'framer-motion'
import { testimonials } from '../data/content'
import { images } from '../data/images'
import { GlassCard } from '../components/ui/GlassCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { heroContainer, heroItem } from '../lib/motion'

const highlights = [
  {
    name: 'Naa Ashorkor',
    role: 'Composer · Accra',
    bio: 'Blending highlife textures with electronic production.',
    img: images.guitar,
  },
  {
    name: 'Theo Mensah',
    role: 'Jazz pianist · London',
    bio: 'Teaching improvisation as a language, not a trick bag.',
    img: images.piano,
  },
] as const

const rhythmChips = [
  'Global cohorts',
  'Live listening rooms',
  'Peer circles',
  'Showcase nights',
] as const

const pillars = [
  {
    title: 'Cross borders',
    text: 'Share work, feedback, and repertoire with musicians who understand both your scene and the wider world.',
  },
  {
    title: 'Learn in public',
    text: 'Workshops, critiques, and listening sessions that treat growth as a shared ritual, not a solo grind.',
  },
  {
    title: 'Step forward',
    text: 'From open mics to embassy showcases, performance paths that respect where you are and where you are headed.',
  },
] as const

export function Community() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_90%_55%_at_15%_-5%,var(--glow-ambient-1),transparent_50%),radial-gradient(ellipse_70%_45%_at_90%_40%,var(--glow-ambient-2),transparent_48%)]"
        aria-hidden
      />

      <section className="relative isolate min-h-[min(88svh,52rem)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={images.community}
            alt=""
            className="about-hero-image h-full w-full object-cover"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="hero-film-top" />
          <div className="hero-film-side" />
          <div className="hero-film-vignette" />
          <div className="hero-film-accent" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-page to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-28 text-center md:min-h-[min(88svh,52rem)] md:justify-center md:pb-28 md:pt-32 lg:px-8">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div
              variants={heroItem}
              className="mb-8 flex flex-wrap justify-center gap-2.5"
            >
              {rhythmChips.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-glass px-4 py-2 text-xs font-medium tracking-wide text-fg shadow-[0_0_24px_-12px_rgba(184,167,138,0.2)] backdrop-blur-md"
                >
                  {t}
                </span>
              ))}
            </motion.div>
            <motion.p
              variants={heroItem}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gold/88"
            >
              Music Embassy community
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="font-display text-[2.5rem] font-normal leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-[3.35rem]"
            >
              A living room for artists who refuse to create alone.
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
            >
              Teachers, students, and makers in one orbit: honest feedback,
              real collaboration, and stages that remember your name.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="mt-11 flex flex-wrap justify-center gap-4"
            >
              <Button to="/contact">Request access</Button>
              <Button to="/events" variant="secondary">
                See what’s on
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="premium-band relative border-y border-border py-14 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(184,167,138,0.05)_45%,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4 md:gap-8 lg:px-8">
          {[
            { label: 'Cohorts', detail: 'Accra to London and beyond' },
            { label: 'Rhythm', detail: 'Weekly rooms and critiques' },
            { label: 'Mentors', detail: 'Faculty in the thread' },
            { label: 'Stages', detail: 'Showcases and open calls' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: i * 0.06,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="text-center md:text-left"
            >
              <p className="font-display text-2xl text-fg md:text-3xl">
                {s.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-muted">{s.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Voices"
            title="What members carry with them"
            subtitle="No slogans, just the kind of detail you only hear when people actually listened."
          />
          <div className="grid gap-8 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <GlassCard className="relative flex h-full flex-col !p-0 overflow-hidden">
                  <div className="absolute left-6 top-6 font-display text-5xl leading-none text-gold/25">
                    “
                  </div>
                  <div className="h-1 bg-gradient-to-r from-gold via-gold/50 to-transparent" />
                  <div className="flex flex-1 flex-col p-8 pt-14">
                    <p className="flex-1 font-display text-lg leading-relaxed text-fg/95 md:text-xl">
                      {t.quote}
                    </p>
                    <div className="mt-8 border-t border-border pt-6">
                      <p className="font-medium text-fg">{t.name}</p>
                      <p className="mt-1 text-sm text-gold/90">{t.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-band relative border-t border-border py-24 md:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why it works"
            title="Built for momentum, not noise"
            subtitle="Three commitments we keep in every room, thread, and set list."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <div className="rounded-2xl border border-border bg-glass/80 p-8 shadow-[var(--shadow-card)] backdrop-blur-md transition-[border-color,box-shadow] duration-200 hover:border-gold/20 hover:shadow-[var(--shadow-card-hover)]">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/12 ring-1 ring-border">
                    <span className="font-display text-lg text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-fg">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {p.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Spotlight"
            title="Artists in focus"
            subtitle="Portraits of the people shaping what our community sounds like this season."
          />
          <div className="grid gap-10 lg:grid-cols-2">
            {highlights.map((h, i) => (
              <motion.article
                key={h.name}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-glass shadow-[var(--shadow-card)] ring-1 ring-border backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-gold/22 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={h.img}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-page via-page/20 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full border border-border bg-page/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/95 backdrop-blur-md">
                    Featured
                  </span>
                </div>
                <div className="p-8 md:p-9">
                  <h3 className="font-display text-2xl text-fg md:text-[1.65rem]">
                    {h.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-medium tracking-wide text-gold/90">
                    {h.role}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {h.bio}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-28 pt-6 md:pt-8">
        <div className="absolute inset-0 -z-10">
          <img
            src={images.workshop}
            alt=""
            className="h-full w-full object-cover opacity-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-page via-page/96 to-page" />
        </div>
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
            className="glass-wood-surface liquid-panel relative overflow-hidden rounded-3xl border border-border p-10 shadow-[var(--shadow-card-hover)] md:p-14"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/14 blur-[72px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-gold/10 blur-[64px]" />
            <div className="relative text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/88">
                Your turn
              </p>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl leading-tight text-fg md:text-4xl">
                Pull up a chair. The next session starts when you say hello.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-muted md:text-lg">
                Workshops, listening rooms, and collaborations. Tell us what you
                play, what you want to learn, and we will point you to the right
                room.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button to="/contact">Request access</Button>
                <Button to="/events" variant="secondary">
                  View events
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
