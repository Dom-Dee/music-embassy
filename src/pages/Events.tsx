import { motion } from 'framer-motion'
import { events } from '../data/content'
import { images } from '../data/images'
import { Button } from '../components/ui/Button'
import { IconCalendar } from '../components/icons'
import { heroContainer, heroItem } from '../lib/motion'

const eventImages = [images.live, images.crowd, images.studio]

function parseDateParts(dateStr: string) {
  const parts = dateStr.split(' ')
  return { month: parts[0].toUpperCase(), day: parts[1].replace(',', '') }
}

export function Events() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_90%_55%_at_10%_-5%,var(--glow-ambient-1),transparent_52%),radial-gradient(ellipse_70%_45%_at_88%_40%,var(--glow-ambient-2),transparent_48%)]"
        aria-hidden
      />

      <section className="relative isolate min-h-[min(72svh,42rem)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={images.crowd}
            alt=""
            className="about-hero-image h-full w-full object-cover"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="hero-film-top" />
          <div className="hero-film-side" />
          <div className="hero-film-vignette" />
          <div className="hero-film-accent" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-page to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-28 text-center md:min-h-[min(72svh,42rem)] md:justify-center md:pb-28 md:pt-32 lg:px-8">
          <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-3xl">
            <motion.p variants={heroItem} className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gold/88">
              Live events &amp; gatherings
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="font-display text-[2.5rem] font-normal leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl"
            >
              Where music becomes memory.
            </motion.h1>
            <motion.p variants={heroItem} className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              Intimate performances, workshops, and open stages. Each gathering
              is designed to leave something behind.
            </motion.p>
            <motion.div variants={heroItem} className="mt-11 flex flex-wrap justify-center gap-4">
              <Button to="/contact">Reserve a seat</Button>
              <Button to="/community" variant="secondary">Join the community</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="premium-band relative border-y border-border py-12 md:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(184,167,138,0.05)_45%,transparent)]" />
        <div className="relative mx-auto grid max-w-4xl grid-cols-3 gap-6 px-6 text-center lg:px-8">
          {[
            { value: '3', label: 'Upcoming events' },
            { value: 'Monthly', label: 'Showcase rhythm' },
            { value: 'Open', label: 'All levels welcome' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <p className="font-display text-2xl text-fg md:text-3xl">{s.value}</p>
              <p className="mt-1.5 text-sm text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/85">Upcoming</p>
            <h2 className="mt-3 font-display text-4xl text-fg md:text-5xl">On the schedule</h2>
            <p className="mt-4 max-w-xl text-muted">
              Every event is open to community members, students, and curious newcomers alike.
            </p>
          </motion.div>

          <div className="relative space-y-8">
            <div
              className="pointer-events-none absolute left-[2.4rem] top-14 hidden w-px bg-gradient-to-b from-gold/35 via-gold/15 to-transparent md:block"
              style={{ bottom: '4rem' }}
              aria-hidden
            />

            {events.map((event, i) => {
              const { month, day } = parseDateParts(event.date)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                  className="group relative flex gap-6 md:gap-8"
                >
                  <div className="relative z-10 hidden shrink-0 flex-col items-center md:flex">
                    <div className="flex h-[4.8rem] w-[4.8rem] flex-col items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/18 to-gold/6 shadow-[0_0_28px_-12px_rgba(184,167,138,0.3)] ring-1 ring-gold/18">
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold/85">{month}</span>
                      <span className="font-display text-[2rem] leading-none text-fg">{day}</span>
                    </div>
                  </div>

                  <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-glass shadow-[var(--shadow-card)] backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:border-gold/22 group-hover:shadow-[var(--shadow-card-hover)]">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative aspect-[16/7] shrink-0 overflow-hidden md:aspect-auto md:w-[38%]">
                        <img
                          src={eventImages[i % eventImages.length]}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-page/35 md:bg-gradient-to-t md:from-page/50" />
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-gold/30 bg-page/80 px-3 py-1.5 backdrop-blur-md md:hidden">
                          <IconCalendar className="h-3.5 w-3.5 text-gold" />
                          <span className="text-xs font-semibold text-gold">{event.date}</span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-7 md:p-8">
                        <div>
                          <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-gold/85 md:block">
                            {event.date}
                          </p>
                          <h2 className="mt-1 font-display text-2xl text-fg md:mt-2.5 md:text-3xl">
                            {event.title}
                          </h2>
                          <p className="mt-3 leading-relaxed text-muted">{event.description}</p>
                        </div>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          <Button to="/contact" className="!px-5 !py-2.5 text-sm">
                            Reserve a seat
                          </Button>
                          <span className="rounded-full border border-border bg-glass/50 px-3 py-1.5 text-xs text-muted backdrop-blur-sm">
                            Free admission
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative pb-28 pt-4">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="glass-wood-surface liquid-panel relative overflow-hidden rounded-3xl border border-border p-10 shadow-[var(--shadow-card-hover)] md:p-14"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/14 blur-[72px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-gold/10 blur-[64px]" />
            <div className="relative text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/88">Stay in the loop</p>
              <h2 className="mx-auto mt-5 max-w-xl font-display text-3xl text-fg md:text-4xl">
                Want first access to every event?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-muted">
                Join our community for early announcements, member-only workshops, and
                invitations to private showcases.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button to="/contact">Get in touch</Button>
                <Button to="/community" variant="secondary">Join the community</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
