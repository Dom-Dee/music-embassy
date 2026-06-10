import { useEffect, useState } from 'react'
import { resolvePortalFileUrl } from '../../lib/portalFileUrl'
import { fileNameFromUrl } from '../../lib/uploadPortalFile'

type AttachmentLinksProps = {
  urls?: string[] | null
  className?: string
}

export function AttachmentLinks({ urls, className = '' }: AttachmentLinksProps) {
  const [resolvedUrls, setResolvedUrls] = useState<string[]>([])

  useEffect(() => {
    if (!urls?.length) return

    let cancelled = false

    void (async () => {
      const next = await Promise.all(
        urls.map(async (reference) => {
          const href = await resolvePortalFileUrl(reference)
          return href ?? reference
        }),
      )
      if (!cancelled) setResolvedUrls(next.filter(Boolean))
    })()

    return () => {
      cancelled = true
    }
  }, [urls])

  if (!urls?.length || resolvedUrls.length === 0) return null

  return (
    <ul className={`mt-2 space-y-1 ${className}`}>
      {resolvedUrls.map((url, index) => (
        <li key={`${url}-${index}`}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-xs text-gold hover:underline"
          >
            {fileNameFromUrl(urls[index] ?? url)}
          </a>
        </li>
      ))}
    </ul>
  )
}
