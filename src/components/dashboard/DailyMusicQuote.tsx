import { motion } from 'framer-motion'
import { getDailyMusicQuote } from '../../data/musicQuotes'

type DailyMusicQuoteProps = {
  variant: 'marginal' | 'inline'
  className?: string
}

export function DailyMusicQuote({ variant, className = '' }: DailyMusicQuoteProps) {
  const { quote, author } = getDailyMusicQuote()

  if (variant === 'marginal') {
    return (
      <motion.figure
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Daily music quote"
        className={`max-w-[18rem] ${className}`}
      >
        <div className="border-r border-gold/22 pr-5 text-right">
          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-gold/45">
            Daily note
          </p>
          <blockquote className="mt-2.5 font-display text-[0.98rem] italic leading-[1.45] text-fg/70">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-[11px] tracking-wide text-muted/75">
            {author}
          </figcaption>
        </div>
      </motion.figure>
    )
  }

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-md border-l border-gold/18 pl-4 font-display text-sm italic leading-relaxed text-fg/62 ${className}`}
      aria-label="Daily music quote"
    >
      &ldquo;{quote}&rdquo;
      <span className="mt-1 block text-[11px] not-italic text-muted/70">{author}</span>
    </motion.p>
  )
}
