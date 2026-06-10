import { motion } from 'framer-motion'
import type { Instrument } from '../../types/student'
import { formatCurrency } from '../../types/student'
import { getInstrumentImageUrl } from '../../lib/instrumentImages'

type InstrumentSelectorProps = {
  instruments: Instrument[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  loading?: boolean
  error?: string | null
  variant?: 'compact' | 'premium'
}

export function InstrumentSelector({
  instruments,
  selectedIds,
  onChange,
  loading = false,
  error = null,
  variant = 'premium',
}: InstrumentSelectorProps) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  if (loading) {
    return (
      <div
        className={
          variant === 'premium'
            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2'
            : 'grid gap-4 sm:grid-cols-2'
        }
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`animate-pulse rounded-2xl border border-border bg-glass/40 ${
              variant === 'premium' ? 'h-64' : 'h-48'
            }`}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {error}
      </p>
    )
  }

  if (instruments.length === 0) {
    return (
      <p className="text-sm text-muted">
        No instruments are available yet. Please contact Music Embassy to get started.
      </p>
    )
  }

  const gridClass =
    variant === 'premium'
      ? 'mt-8 grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2'
      : 'mt-4 grid gap-4 sm:grid-cols-2'

  return (
    <div>
      {variant === 'compact' ? (
        <>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            What would you like to learn?
          </p>
          <p className="mt-1 text-sm text-muted">
            Select one or more. Each gets its own path on your dashboard.
          </p>
        </>
      ) : null}

      <div className={gridClass}>
        {instruments.map((inst, i) => {
          const selected = selectedIds.includes(inst.id)
          const img = getInstrumentImageUrl(inst.name, inst.image_url)

          return (
            <motion.button
              key={inst.id}
              type="button"
              onClick={() => toggle(inst.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.07,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-300 ${
                selected
                  ? 'border-gold/50 shadow-[var(--shadow-card-hover)] ring-1 ring-gold/40'
                  : 'border-border hover:border-gold/30'
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  variant === 'premium' ? 'aspect-[5/4]' : 'aspect-[16/10]'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-page via-page/55 to-page/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                <span
                  className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all duration-200 ${
                    selected
                      ? 'border-gold bg-gold text-on-gold shadow-md'
                      : 'border-border/80 bg-page/50 text-transparent backdrop-blur-md'
                  }`}
                  aria-hidden
                >
                  ✓
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4 pt-16">
                  <p className="font-display text-xl text-fg md:text-2xl">
                    {inst.name}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold/90">
                    {formatCurrency(Number(inst.monthly_fee))} / month
                  </p>
                </div>
              </div>

              {inst.description ? (
                <div className="border-t border-border bg-glass/80 px-4 py-3 backdrop-blur-md">
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                    {inst.description}
                  </p>
                </div>
              ) : null}
            </motion.button>
          )
        })}
      </div>

      <p
        className={`mt-6 text-center text-sm ${
          selectedIds.length > 0 ? 'text-gold' : 'text-muted'
        }`}
      >
        {selectedIds.length > 0
          ? `${selectedIds.length} instrument${selectedIds.length === 1 ? '' : 's'} selected. Each gets its own dashboard.`
          : 'Select at least one instrument to continue'}
      </p>
    </div>
  )
}
