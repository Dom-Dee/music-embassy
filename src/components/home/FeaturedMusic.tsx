import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { featuredTracks } from '../../data/content'
import { SectionHeading } from '../ui/SectionHeading'
import { IconPause, IconPlay } from '../icons'

export function FeaturedMusic() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  function togglePlay(id: string) {
    setPlayingId((p) => (p === id ? null : id))
  }

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Listen"
          title="Featured from the Embassy"
          subtitle="A rotating selection of artists and sessions. Hover, play, and drift through the sound."
        />
        <div
          ref={scrollRef}
          className="music-scroll -mx-6 flex gap-6 overflow-x-auto px-6 pb-4 pt-2 md:mx-0 md:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {featuredTracks.map((track, i) => {
            const playing = playingId === track.id
            return (
              <motion.article
                key={track.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                  transition: { type: 'spring', stiffness: 320, damping: 22 },
                }}
                className="group relative w-[min(100%,280px)] shrink-0 overflow-hidden rounded-2xl border border-border bg-glass shadow-[var(--shadow-card)] backdrop-blur-md transition-[border-color,box-shadow] duration-200 hover:border-gold/25"
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
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/22 to-gold/10" />
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
  )
}
