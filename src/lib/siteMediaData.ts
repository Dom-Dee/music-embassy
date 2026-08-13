import type { GalleryItem, SiteEvent, SiteMediaType } from '../types/siteMedia'
import { supabase } from './supabase'

export type SiteEventInput = {
  title: string
  description?: string | null
  event_date?: string | null
  media_url?: string | null
  media_type?: SiteMediaType | null
  published?: boolean
  sort_order?: number
}

export type GalleryItemInput = {
  title: string
  tag?: string | null
  media_url: string
  media_type: SiteMediaType
  published?: boolean
  sort_order?: number
}

export async function fetchPublishedSiteEvents(): Promise<SiteEvent[]> {
  const { data, error } = await supabase
    .from('site_events')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as SiteEvent[]
}

export async function fetchPublishedGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as GalleryItem[]
}

export async function fetchAdminSiteEvents(): Promise<SiteEvent[]> {
  const { data, error } = await supabase
    .from('site_events')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as SiteEvent[]
}

export async function fetchAdminGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as GalleryItem[]
}

export async function createSiteEvent(input: SiteEventInput): Promise<void> {
  const { error } = await supabase.from('site_events').insert({
    title: input.title.trim(),
    description: input.description?.trim() || null,
    event_date: input.event_date?.trim() || null,
    media_url: input.media_url ?? null,
    media_type: input.media_type ?? null,
    published: input.published ?? true,
    sort_order: input.sort_order ?? 0,
  })

  if (error) throw new Error(error.message)
}

export async function updateSiteEvent(id: string, input: SiteEventInput): Promise<void> {
  const { error } = await supabase
    .from('site_events')
    .update({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      event_date: input.event_date?.trim() || null,
      media_url: input.media_url ?? null,
      media_type: input.media_type ?? null,
      published: input.published ?? true,
      sort_order: input.sort_order ?? 0,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteSiteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('site_events').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function createGalleryItem(input: GalleryItemInput): Promise<void> {
  const { error } = await supabase.from('gallery_items').insert({
    title: input.title.trim(),
    tag: input.tag?.trim() || null,
    media_url: input.media_url,
    media_type: input.media_type,
    published: input.published ?? true,
    sort_order: input.sort_order ?? 0,
  })

  if (error) throw new Error(error.message)
}

export async function updateGalleryItem(id: string, input: GalleryItemInput): Promise<void> {
  const { error } = await supabase
    .from('gallery_items')
    .update({
      title: input.title.trim(),
      tag: input.tag?.trim() || null,
      media_url: input.media_url,
      media_type: input.media_type,
      published: input.published ?? true,
      sort_order: input.sort_order ?? 0,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const { error } = await supabase.from('gallery_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
