import { safeExternalUrl } from './safeUrl'
import { supabase } from './supabase'

const BUCKET = 'portal-files'
const SIGNED_URL_TTL_SECONDS = 60 * 60

/** Extract storage object path from a stored URL or raw path. */
export function storagePathFromReference(reference: string): string | null {
  const trimmed = reference.trim()
  if (!trimmed) return null

  if (!trimmed.includes('://')) {
    return trimmed.replace(/^\/+/, '')
  }

  try {
    const url = new URL(trimmed)
    const publicMarker = `/storage/v1/object/public/${BUCKET}/`
    const signedMarker = `/storage/v1/object/sign/${BUCKET}/`
    const privateMarker = `/storage/v1/object/${BUCKET}/`

    for (const marker of [publicMarker, signedMarker, privateMarker]) {
      const idx = url.pathname.indexOf(marker)
      if (idx !== -1) {
        return decodeURIComponent(url.pathname.slice(idx + marker.length))
      }
    }
  } catch {
    return null
  }

  return null
}

export async function resolvePortalFileUrl(reference: string): Promise<string | null> {
  const path = storagePathFromReference(reference)
  if (!path) return safeExternalUrl(reference)

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)

  if (error || !data?.signedUrl) {
    return safeExternalUrl(reference)
  }

  return data.signedUrl
}
