/** Local assets in /public/instruments — official Music Embassy photography */
const local = (file: string) => `/instruments/${file}`

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=90`

function publicInstrumentStorageUrl(path: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL
  return `${base}/storage/v1/object/public/portal-files/${path.replace(/^\/+/, '')}`
}

/** Exact-name map (lowercase) for Music Embassy offerings */
export const INSTRUMENT_PHOTOS: Record<string, string> = {
  drums: local('drums.png'),
  piano: unsplash('1520523839897-bd0b52f945a0'),
  saxophone: local('saxophone.png'),
  violin: local('violin.jpg'),
  'voice training': local('voice-training.png'),
}

const FALLBACK = unsplash('1470229722913-7c0e2dbbafd3')

export function getInstrumentImageUrl(
  name: string,
  storedUrl?: string | null,
): string {
  if (storedUrl?.trim()) {
    const trimmed = storedUrl.trim()
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('/')
    ) {
      return trimmed
    }
    return publicInstrumentStorageUrl(trimmed)
  }
  const key = name.trim().toLowerCase()
  return INSTRUMENT_PHOTOS[key] ?? FALLBACK
}
