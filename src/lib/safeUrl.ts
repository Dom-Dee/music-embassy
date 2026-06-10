export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null

  try {
    const parsed = new URL(url.trim())
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null
    }
    return parsed.href
  } catch {
    return null
  }
}
