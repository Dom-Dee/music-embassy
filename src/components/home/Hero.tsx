import { motion, useScroll, useTransform } from 'framer-motion'
import { images } from '../../data/images'
import { Button } from '../ui/Button'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], ['0%', '18%'])
  const scale = useTransform(scrollY, [0, 700], [1, 1.08])

  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden">
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <img
          src={images.hero}
          alt=""
          className="hero-image"
          fetchPriority="high"
        />
        <div className="hero-film-top" />
        <div className="hero-film-side" />
        <div className="hero-film-vignette" />
        <div className="hero-film-accent" />
      </motion.div>

      <div className="hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-28 text-left lg:translate-x-[-4%] lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex max-w-3xl flex-col items-start"
        >
          <motion.p
            variants={item}
            className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-gold/88"
          >
            Global music education & creative community
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Where Music Connects, Teaches, and Inspires the World
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
          >
            A premium home for lessons, performances, and collaboration,
            crafted with the same care as the music you love.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-12 flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:flex-wrap"
          >
            <Button to="/sign-in">Start Learning</Button>
            <Button to="/music" variant="secondary">
              Explore Music
            </Button>
            <Button to="/community" variant="secondary">
              Join the Community
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
