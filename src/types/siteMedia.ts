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
