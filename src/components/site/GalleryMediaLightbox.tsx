import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { IconClose } from '../icons'
import { SiteMediaDisplay } from './SiteMediaDisplay'
import type { SiteMediaType } from '../../types/siteMedia'

export type GalleryLightboxItem = {
  id: string
  title: string
  tag: string
  media_url?: string | null
  media_type?: SiteMediaType | null
  fallbackImage?: string
}

type GalleryMediaLightboxProps = {
  item: GalleryLightboxItem | null
  onClose: () => void
}

export function GalleryMediaLightbox({ item, onClose }: GalleryMediaLightboxProps) {
  useBodyScrollLock(Boolean(item))

  useEffect(() => {
    if (!item) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-page/92 backdrop-blur-sm"
            aria-label="Close gallery preview"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`gallery-lightbox-${item.id}`}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[calc(4.5rem+env(safe-area-inset-top,0px))] z-[111] mx-auto flex max-h-[calc(100dvh-6rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-page shadow-[var(--shadow-card-hover)] sm:inset-x-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/90">
                  {item.tag}
                </p>
                <h2
                  id={`gallery-lightbox-${item.id}`}
                  className="mt-1 truncate font-display text-xl text-fg sm:text-2xl"
                >
                  {item.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="tap-target flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-fg transition hover:border-gold/35"
                aria-label="Close"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center bg-surface/40 p-3 sm:p-5">
              {item.media_url ? (
                <SiteMediaDisplay
                  reference={item.media_url}
                  mediaType={item.media_type}
                  alt={item.title}
                  className="max-h-[min(72dvh,42rem)] w-full object-contain"
                  videoClassName="max-h-[min(72dvh,42rem)] w-full rounded-xl object-contain"
                />
              ) : item.fallbackImage ? (
                <img
                  src={item.fallbackImage}
                  alt={item.title}
                  className="max-h-[min(72dvh,42rem)] w-full object-contain"
                />
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
