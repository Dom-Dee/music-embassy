import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { featuredTracks, showcaseItems } from '../data/content'
import { images } from '../data/images'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { IconPause, IconPlay } from '../components/icons'
import { heroContainer, heroItem } from '../lib/motion'

const filters = [
  'All',
  'Performance',
  'Studio',
  'Education',
  'Showcase',
  'Community',
  'Workshop',
] as const

const rhythmChips = [
  'Curated sets',
  'Studio & stage',
  'New features monthly',
  'From our community',
] as const

const statLine = [
  { label: 'Gallery', detail: 'Performances & sessions' },
  { label: 'Studios', detail: 'Tracking & production' },
  { label: 'Rooms', detail: 'Education & workshops' },
  { label: 'Stages', detail: 'Showcases & jams' },
] as const

export function MusicShowcase() {
  const [active, setActive] = useState<(typeof filters)[number]>('All')
  const [playingId, setPlayingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (active === 'All') return showcaseItems
    return showcaseItems.filter((x) => x.tag === active)
  }, [active])

  function togglePlay(id: string) {
    setPlayingId((p) => (p === id ? null : id))
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_85%_50%_at_20%_-8%,var(--glow-ambient-1),transparent_52%),radial-gradient(ellipse_65%_45%_at_85%_35%,var(--glow-ambient-2),transparent_48%)]"
        aria-hidden
      />

      <section className="relative isolate min-h-[min(86svh,50rem)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={images.live}
            alt=""
            className="about-hero-image h-full w-full object-cover"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="hero-film-top" />
          <div className="hero-film-side" />
          <div className="hero-film-vignette" />
          <div className="hero-film-accent" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-page to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-28 text-center md:min-h-[min(86svh,50rem)] md:justify-center md:pb-28 md:pt-32 lg:px-8">
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
              Music & showcase
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="font-display text-[2.45rem] font-normal leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-[3.25rem]"
            >
              Where sessions become stories worth replaying.
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
            >
              A living gallery of performances, workshops, and studio moments
              from the embassy: browse by type, sample the current rotation, and
              find your place on the wall.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="mt-11 flex flex-wrap justify-center gap-4"
            >
              <Button to="/music#gallery">Browse the gallery</Button>
              <Button to="/contact" variant="secondary">
                Submit your work
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="premium-band relative border-y border-border py-14 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(184,167,138,0.05)_45%,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4 md:gap-8 lg:px-8">
          {statLine.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: i * 0.05,
                duration: 0.5,
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

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Listen"
            title="On rotation"
            subtitle="A sample of artists and sessions in our orbit. Tap play for a preview placeholder until your catalog is connected."
          />
          <div
            className="music-scroll -mx-6 flex gap-6 overflow-x-auto px-6 pb-4 pt-2 md:mx-0 md:px-0"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {featuredTracks.map((track, i) => {
              const playing = playingId === track.id
              return (
                <motion.article
                  key={track.id}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  whileHover={{
                    y: -5,
                    transition: { type: 'spring', stiffness: 340, damping: 24 },
                  }}
                  className="group relative w-[min(100%,280px)] shrink-0 overflow-hidden rounded-2xl border border-border bg-glass shadow-[var(--shadow-card)] backdrop-blur-md transition-[border-color,box-shadow] duration-200 hover:border-gold/22"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={track.cover}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-page via-page/25 to-transparent" />
                    <div className="absolute inset-0 opacity-0 mix-blend-overlay transition group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/8" />
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePlay(track.id)}
                      aria-label={playing ? 'Pause' : 'Play preview'}
                      className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-on-gold shadow-md shadow-black/25 ring-1 ring-gold/40 backdrop-blur-md transition duration-200 hover:brightness-110"
                    >
                      <motion.span
                        animate={
                          playing
                            ? { scale: [1, 1.06, 1] }
                            : { scale: 1 }
                        }
                        transition={
                          playing
                            ? { repeat: Infinity, duration: 1.2 }
                            : undefined
                        }
                      >
                        {playing ? (
                          <IconPause className="h-5 w-5" />
                        ) : (
                          <IconPlay className="h-5 w-5 translate-x-0.5" />
                        )}
                      </motion.span>
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="font-display text-lg text-fg">{track.title}</p>
                    <p className="mt-1 text-sm text-muted">{track.artist}</p>
                    {playing ? (
                      <p className="mt-3 text-xs text-gold/85">
                        Preview UI. Connect your catalog when ready.
                      </p>
                    ) : null}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="glass-wood-surface liquid-panel rounded-2xl border border-border p-6 shadow-[var(--shadow-card)] md:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">
                  Browse
                </p>
                <h2 className="mt-2 font-display text-2xl text-fg md:text-3xl">
                  Gallery
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted md:text-base">
                  Filter by moment type. Every tile is a doorway into how we teach,
                  perform, and gather.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const isOn = active === f
                return (
                  <motion.button
                    key={f}
                    type="button"
                    onClick={() => setActive(f)}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.1, 0.25, 1] as const,
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-200 ${
                      isOn
                        ? 'border-transparent bg-gold text-on-gold shadow-md shadow-black/20 hover:brightness-110'
                        : 'border border-border bg-page/60 text-muted hover:border-gold/28 hover:text-fg'
                    }`}
                  >
                    {f}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="columns-1 gap-8 sm:columns-2 lg:columns-3"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i * 0.04, 0.36),
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className="mb-8 break-inside-avoid"
                >
                  <article className="group relative overflow-hidden rounded-2xl border border-border bg-glass shadow-[var(--shadow-card)] ring-1 ring-border/80 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-gold/22 hover:shadow-[var(--shadow-card-hover)]">
                    <div
                      className={`relative overflow-hidden ${
                        i % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[3/4]'
                      }`}
                    >
                      <img
                        src={item.img}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-page via-page/50 to-transparent opacity-95" />
                      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/15 to-transparent" />
                      </div>
                      <span className="absolute left-4 top-4 rounded-full border border-border bg-page/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/95 backdrop-blur-md">
                        {item.tag}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-5 pt-12">
                        <p className="font-display text-xl leading-snug text-fg md:text-2xl">
                          {item.title}
                        </p>
                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                          Embassy feature
                        </p>
                      </div>
                    </div>
                  </article>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="premium-band border-t border-border pb-28 pt-16 md:pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card-hover)] ring-1 ring-border"
            >
              <img
                src={images.singer}
                alt=""
                className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-page/92 via-page/45 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-page/70 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 max-w-[14rem] font-display text-lg leading-snug text-fg md:text-xl">
                Your session could be the next tile in the gallery.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.65,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <SectionHeading
                align="left"
                eyebrow="For artists"
                title="Submit your music"
                subtitle="We review every submission with care. Share a link, tell your story, and you may be featured in our showcases or newsletter."
              />
              <div className="mt-8 flex flex-wrap gap-4">
                <Button to="/contact">Submit via contact</Button>
                <Button to="/community" variant="secondary">
                  Meet the community
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
