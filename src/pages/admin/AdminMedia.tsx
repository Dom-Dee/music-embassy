import { useEffect, useState } from 'react'
import {
  AdminAlert,
  AdminFormPanel,
  AdminListPanel,
  AdminPage,
  AdminPageIntro,
  AdminRecordCard,
  AdminSplitLayout,
} from '../../components/admin/AdminUi'
import { useAdminToast } from '../../components/admin/AdminToastProvider'
import { AdminRecordActions } from '../../components/admin/AdminRecordActions'
import { FileUploadField } from '../../components/admin/FileUploadField'
import { SiteMediaDisplay } from '../../components/site/SiteMediaDisplay'
import { Button } from '../../components/ui/Button'
import { FormField, formInputClass } from '../../components/ui/FormField'
import {
  createGalleryItem,
  createSiteEvent,
  deleteGalleryItem,
  deleteSiteEvent,
  fetchAdminGalleryItems,
  fetchAdminSiteEvents,
  updateGalleryItem,
  updateSiteEvent,
} from '../../lib/siteMediaData'
import { uploadPortalFiles } from '../../lib/uploadPortalFile'
import type { GalleryItem, SiteEvent } from '../../types/siteMedia'
import { GALLERY_TAGS, mediaTypeFromFile } from '../../types/siteMedia'

type MediaTab = 'events' | 'gallery'

export function AdminMedia() {
  const { notify } = useAdminToast()
  const [tab, setTab] = useState<MediaTab>('events')
  const [events, setEvents] = useState<SiteEvent[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventPublished, setEventPublished] = useState(true)
  const [eventSortOrder, setEventSortOrder] = useState(0)
  const [eventMediaUrl, setEventMediaUrl] = useState<string | null>(null)
  const [eventMediaType, setEventMediaType] = useState<'image' | 'video' | null>(null)
  const [eventFiles, setEventFiles] = useState<File[]>([])

  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null)
  const [galleryTitle, setGalleryTitle] = useState('')
  const [galleryTag, setGalleryTag] = useState<string>(GALLERY_TAGS[0])
  const [galleryPublished, setGalleryPublished] = useState(true)
  const [gallerySortOrder, setGallerySortOrder] = useState(0)
  const [galleryMediaUrl, setGalleryMediaUrl] = useState('')
  const [galleryMediaType, setGalleryMediaType] = useState<'image' | 'video'>('image')
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])

  function resetEventForm() {
    setEditingEventId(null)
    setEventTitle('')
    setEventDescription('')
    setEventDate('')
    setEventPublished(true)
    setEventSortOrder(0)
    setEventMediaUrl(null)
    setEventMediaType(null)
    setEventFiles([])
  }

  function resetGalleryForm() {
    setEditingGalleryId(null)
    setGalleryTitle('')
    setGalleryTag(GALLERY_TAGS[0])
    setGalleryPublished(true)
    setGallerySortOrder(0)
    setGalleryMediaUrl('')
    setGalleryMediaType('image')
    setGalleryFiles([])
  }

  async function load() {
    const [ev, gal] = await Promise.all([fetchAdminSiteEvents(), fetchAdminGalleryItems()])
    setEvents(ev)
    setGallery(gal)
  }

  useEffect(() => {
    void (async () => {
      try {
        await load()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load site media')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function startEditEvent(item: SiteEvent) {
    setTab('events')
    setEditingEventId(item.id)
    setEventTitle(item.title)
    setEventDescription(item.description ?? '')
    setEventDate(item.event_date ?? '')
    setEventPublished(item.published)
    setEventSortOrder(item.sort_order)
    setEventMediaUrl(item.media_url)
    setEventMediaType(item.media_type)
    setEventFiles([])
  }

  function startEditGallery(item: GalleryItem) {
    setTab('gallery')
    setEditingGalleryId(item.id)
    setGalleryTitle(item.title)
    setGalleryTag(item.tag ?? GALLERY_TAGS[0])
    setGalleryPublished(item.published)
    setGallerySortOrder(item.sort_order)
    setGalleryMediaUrl(item.media_url)
    setGalleryMediaType(item.media_type)
    setGalleryFiles([])
  }

  async function handleEventSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!eventTitle.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      let mediaUrl = eventMediaUrl
      let mediaType = eventMediaType

      if (eventFiles.length > 0) {
        const [uploaded] = await uploadPortalFiles(eventFiles.slice(0, 1), 'events')
        mediaUrl = uploaded
        mediaType = mediaTypeFromFile(eventFiles[0])
      }

      const payload = {
        title: eventTitle,
        description: eventDescription,
        event_date: eventDate,
        media_url: mediaUrl,
        media_type: mediaType,
        published: eventPublished,
        sort_order: eventSortOrder,
      }

      if (editingEventId) {
        await updateSiteEvent(editingEventId, payload)
        notify('Event updated.')
      } else {
        await createSiteEvent(payload)
        notify('Event published.')
      }

      resetEventForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save event')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGallerySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!galleryTitle.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      let mediaUrl = galleryMediaUrl
      let mediaType = galleryMediaType

      if (galleryFiles.length > 0) {
        const [uploaded] = await uploadPortalFiles(galleryFiles.slice(0, 1), 'gallery')
        mediaUrl = uploaded
        mediaType = mediaTypeFromFile(galleryFiles[0])
      } else if (!editingGalleryId) {
        throw new Error('Upload a photo or video for the gallery.')
      }

      const payload = {
        title: galleryTitle,
        tag: galleryTag,
        media_url: mediaUrl,
        media_type: mediaType,
        published: galleryPublished,
        sort_order: gallerySortOrder,
      }

      if (editingGalleryId) {
        await updateGalleryItem(editingGalleryId, payload)
        notify('Gallery item updated.')
      } else {
        await createGalleryItem(payload)
        notify('Gallery item added.')
      }

      resetGalleryForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save gallery item')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteEvent(id: string) {
    setSubmitting(true)
    setError(null)
    try {
      await deleteSiteEvent(id)
      notify('Event removed.')
      if (editingEventId === id) resetEventForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete event')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteGallery(id: string) {
    setSubmitting(true)
    setError(null)
    try {
      await deleteGalleryItem(id)
      notify('Gallery item removed.')
      if (editingGalleryId === id) resetGalleryForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete gallery item')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminPage>
      <AdminPageIntro
        eyebrow="Site content"
        title="Events & gallery"
        description="Upload photos and videos for the public Events page and Music gallery. Published items appear on the site automatically."
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="mb-6 flex flex-wrap gap-2">
        {([
          ['events', 'Events'],
          ['gallery', 'Gallery'],
        ] as const).map(([key, label]) => {
          const active = tab === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-gold text-on-gold shadow-md'
                  : 'border border-border bg-page/60 text-muted hover:text-fg'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'events' ? (
        <AdminSplitLayout>
          <AdminFormPanel title={editingEventId ? 'Edit event' : 'Add event'}>
            <form className="space-y-4" onSubmit={(e) => void handleEventSubmit(e)}>
              <FormField label="Title" id="event-title" required>
                <input
                  id="event-title"
                  className={formInputClass}
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Date (display text)" id="event-date">
                <input
                  id="event-date"
                  className={formInputClass}
                  placeholder="Mar 15, 2026"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </FormField>
              <FormField label="Description" id="event-description">
                <textarea
                  id="event-description"
                  className={`${formInputClass} min-h-28`}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </FormField>
              <FileUploadField
                label="Photo or video"
                files={eventFiles}
                onChange={setEventFiles}
                accept="image/*,video/*"
                multiple={false}
              />
              {eventMediaUrl && eventFiles.length === 0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <SiteMediaDisplay
                    reference={eventMediaUrl}
                    mediaType={eventMediaType}
                    className="aspect-video w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Sort order" id="event-sort">
                  <input
                    id="event-sort"
                    type="number"
                    className={formInputClass}
                    value={eventSortOrder}
                    onChange={(e) => setEventSortOrder(Number(e.target.value) || 0)}
                  />
                </FormField>
                <label className="flex items-center gap-2 pt-7 text-sm text-fg">
                  <input
                    type="checkbox"
                    checked={eventPublished}
                    onChange={(e) => setEventPublished(e.target.checked)}
                  />
                  Published on site
                </label>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {editingEventId ? 'Update event' : 'Add event'}
                </Button>
                {editingEventId ? (
                  <Button type="button" variant="secondary" onClick={resetEventForm}>
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </form>
          </AdminFormPanel>

          <AdminListPanel
            eyebrow="Scheduled"
            title="Events on site"
            empty={!loading && events.length === 0 ? 'No events yet. Add your first event on the left.' : undefined}
          >
            {events.map((item) => (
              <AdminRecordCard
                key={item.id}
                title={item.title}
                meta={`${item.event_date ?? 'No date'} · ${item.published ? 'Live' : 'Draft'}`}
                detail={item.media_type ? `${item.media_type} attached` : 'Text only'}
                action={
                  <AdminRecordActions
                    onEdit={() => startEditEvent(item)}
                    onDelete={() => void handleDeleteEvent(item.id)}
                    deleting={submitting}
                  />
                }
                body={
                  <div className="flex gap-4">
                    {item.media_url ? (
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border">
                        <SiteMediaDisplay
                          reference={item.media_url}
                          mediaType={item.media_type}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    {item.description ? (
                      <p className="line-clamp-2 text-sm text-muted">{item.description}</p>
                    ) : null}
                  </div>
                }
              />
            ))}
          </AdminListPanel>
        </AdminSplitLayout>
      ) : (
        <AdminSplitLayout>
          <AdminFormPanel title={editingGalleryId ? 'Edit gallery item' : 'Add gallery item'}>
            <form className="space-y-4" onSubmit={(e) => void handleGallerySubmit(e)}>
              <FormField label="Title" id="gallery-title" required>
                <input
                  id="gallery-title"
                  className={formInputClass}
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Category" id="gallery-tag">
                <select
                  id="gallery-tag"
                  className={formInputClass}
                  value={galleryTag}
                  onChange={(e) => setGalleryTag(e.target.value)}
                >
                  {GALLERY_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </FormField>
              <FileUploadField
                label="Photo or video"
                files={galleryFiles}
                onChange={setGalleryFiles}
                accept="image/*,video/*"
                multiple={false}
              />
              {galleryMediaUrl && galleryFiles.length === 0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <SiteMediaDisplay
                    reference={galleryMediaUrl}
                    mediaType={galleryMediaType}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Sort order" id="gallery-sort">
                  <input
                    id="gallery-sort"
                    type="number"
                    className={formInputClass}
                    value={gallerySortOrder}
                    onChange={(e) => setGallerySortOrder(Number(e.target.value) || 0)}
                  />
                </FormField>
                <label className="flex items-center gap-2 pt-7 text-sm text-fg">
                  <input
                    type="checkbox"
                    checked={galleryPublished}
                    onChange={(e) => setGalleryPublished(e.target.checked)}
                  />
                  Published on site
                </label>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {editingGalleryId ? 'Update item' : 'Add to gallery'}
                </Button>
                {editingGalleryId ? (
                  <Button type="button" variant="secondary" onClick={resetGalleryForm}>
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </form>
          </AdminFormPanel>

          <AdminListPanel
            eyebrow="Published"
            title="Gallery items"
            empty={!loading && gallery.length === 0 ? 'No gallery items yet. Upload your first photo or video.' : undefined}
          >
            {gallery.map((item) => (
              <AdminRecordCard
                key={item.id}
                title={item.title}
                meta={`${item.tag ?? 'Uncategorized'} · ${item.media_type} · ${item.published ? 'Live' : 'Draft'}`}
                action={
                  <AdminRecordActions
                    onEdit={() => startEditGallery(item)}
                    onDelete={() => void handleDeleteGallery(item.id)}
                    deleting={submitting}
                  />
                }
                body={
                  <div className="h-24 w-full max-w-[9rem] overflow-hidden rounded-lg border border-border">
                    <SiteMediaDisplay
                      reference={item.media_url}
                      mediaType={item.media_type}
                      className="h-full w-full object-cover"
                    />
                  </div>
                }
              />
            ))}
          </AdminListPanel>
        </AdminSplitLayout>
      )}
    </AdminPage>
  )
}
