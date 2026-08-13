export type SiteMediaType = 'image' | 'video'

export type SiteEvent = {
  id: string
  title: string
  description: string | null
  event_date: string | null
  media_url: string | null
  media_type: SiteMediaType | null
  published: boolean
  sort_order: number
  created_at: string
}

export type GalleryItem = {
  id: string
  title: string
  tag: string | null
  media_url: string
  media_type: SiteMediaType
  published: boolean
  sort_order: number
  created_at: string
}

export const GALLERY_TAGS = [
  'Performance',
  'Studio',
  'Education',
  'Showcase',
  'Community',
  'Workshop',
] as const

export type GalleryTag = (typeof GALLERY_TAGS)[number]

export function mediaTypeFromFile(file: File): SiteMediaType {
  return file.type.startsWith('video/') ? 'video' : 'image'
}

export function sortSiteMediaItems<T extends { sort_order: number; created_at: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export function nextSiteMediaSortOrder(items: { sort_order: number }[]): number {
  if (items.length === 0) return 0
  return Math.max(...items.map((item) => item.sort_order)) + 10
}

function ordinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const mod100 = n % 100
  const suffix = suffixes[(mod100 - 20) % 10] ?? suffixes[mod100] ?? suffixes[0]
  return `${n}${suffix}`
}

export function siteMediaPositionLabel(index: number, total: number): string {
  if (total <= 1) return 'Only item on page'
  if (index === 0) return 'Shows first on the site'
  if (index === total - 1) return 'Shows last on the site'
  return `Shows ${ordinal(index + 1)} on the site`
}

export function parseEventDateParts(dateStr: string | null | undefined): {
  month: string
  day: string
  full: string
} {
  if (!dateStr?.trim()) {
    return { month: 'TBA', day: '—', full: 'Date TBA' }
  }

  const parts = dateStr.trim().split(/\s+/)
  if (parts.length >= 2) {
    return {
      month: parts[0].replace(',', '').toUpperCase(),
      day: parts[1].replace(',', ''),
      full: dateStr.trim(),
    }
  }

  return { month: 'EVENT', day: '•', full: dateStr.trim() }
}
