import { useEffect, useState } from 'react'
import { resolveSiteMediaUrl } from '../../lib/siteMediaUrl'
import type { SiteMediaType } from '../../types/siteMedia'

type SiteMediaDisplayProps = {
  reference: string | null | undefined
  mediaType?: SiteMediaType | null
  alt?: string
  className?: string
  videoClassName?: string
  fallback?: React.ReactNode
  autoPlayVideo?: boolean
  mutedVideo?: boolean
  loopVideo?: boolean
}

export function SiteMediaDisplay({
  reference,
  mediaType = 'image',
  alt = '',
  className = 'h-full w-full object-cover',
  videoClassName,
  fallback = null,
  autoPlayVideo = false,
  mutedVideo = true,
  loopVideo = false,
}: SiteMediaDisplayProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!reference?.trim()) {
      setSrc(null)
      return
    }

    let cancelled = false

    void (async () => {
      const resolved = await resolveSiteMediaUrl(reference)
      if (!cancelled) setSrc(resolved)
    })()

    return () => {
      cancelled = true
    }
  }, [reference])

  if (!reference?.trim()) return fallback
  if (!src) {
    return (
      fallback ?? (
        <div
          className={`${className} premium-skeleton bg-surface`}
          aria-hidden
        />
      )
    )
  }

  if (mediaType === 'video') {
    return (
      <video
        src={src}
        className={videoClassName ?? className}
        controls
        playsInline
        preload="metadata"
        autoPlay={autoPlayVideo}
        muted={mutedVideo}
        loop={loopVideo}
      />
    )
  }

  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
}
