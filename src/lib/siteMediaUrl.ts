import { storagePathFromReference } from './portalFileUrl'
import { safeExternalUrl } from './safeUrl'
import { supabase } from './supabase'

const BUCKET = 'portal-files'
const SITE_MEDIA_TTL_SECONDS = 60 * 60 * 24

export async function resolveSiteMediaUrl(
  reference: string | null | undefined,
): Promise<string | null> {
  if (!reference?.trim()) return null

  const trimmed = reference.trim()
  const path = storagePathFromReference(trimmed)

  if (!path) {
    return safeExternalUrl(trimmed)
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SITE_MEDIA_TTL_SECONDS)

  if (error || !data?.signedUrl) {
    return safeExternalUrl(trimmed)
  }

  return data.signedUrl
}
