import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  fetchStudentNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type PortalNotification,
} from '../../lib/portalNotifications'
import { formatDateTime } from '../../types/student'

type NotificationBellProps = {
  studentId: string
}

type NotificationPanelProps = {
  panelRef: React.RefObject<HTMLDivElement | null>
  loading: boolean
  items: PortalNotification[]
  unread: number
  onReadAll: () => void
  onRead: (item: PortalNotification) => void
  className: string
}

function NotificationPanel({
  panelRef,
  loading,
  items,
  unread,
  onReadAll,
  onRead,
  className,
}: NotificationPanelProps) {
  return (
    <div
      ref={panelRef}
      className={className}
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <p className="text-sm font-medium text-fg">Notifications</p>
        {unread > 0 ? (
          <button
            type="button"
            onClick={onReadAll}
            className="text-xs text-gold hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>
      <ul className="max-h-[min(20rem,60svh)] overflow-y-auto bg-surface sm:max-h-80">
        {loading ? (
          <li className="px-4 py-8 text-center text-sm text-fg/80">Loading…</li>
        ) : items.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-fg/80">No notifications yet.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="border-b border-border/80 last:border-b-0">
              <button
                type="button"
                onClick={() => onRead(item)}
                className={`w-full px-4 py-3 text-left transition hover:bg-gold/[0.04] ${
                  item.read_at ? 'opacity-75' : ''
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/80">
                  {item.type}
                </p>
                <p className="mt-1 text-sm font-medium text-fg">{item.title}</p>
                {item.body ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
                ) : null}
                <p className="mt-2 text-[11px] text-muted">{formatDateTime(item.created_at)}</p>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export function NotificationBell({ studentId }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [items, setItems] = useState<PortalNotification[]>([])
  const [loading, setLoading] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const unread = items.filter((item) => !item.read_at).length

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchStudentNotifications(studentId)
      setItems(list)
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!open) return

    function handleClick(event: MouseEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open || !isMobile) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open, isMobile])

  async function handleOpen() {
    setOpen((value) => !value)
    if (!open) await load()
  }

  async function handleRead(item: PortalNotification) {
    if (item.read_at) return
    await markNotificationRead(item.id)
    setItems((current) =>
      current.map((row) =>
        row.id === item.id ? { ...row, read_at: new Date().toISOString() } : row,
      ),
    )
  }

  async function handleReadAll() {
    await markAllNotificationsRead(studentId)
    setItems((current) =>
      current.map((row) => ({ ...row, read_at: row.read_at ?? new Date().toISOString() })),
    )
  }

  const panelProps = {
    panelRef,
    loading,
    items,
    unread,
    onReadAll: () => void handleReadAll(),
    onRead: (item: PortalNotification) => void handleRead(item),
  }

  const mobilePanel = open && isMobile ? (
    <>
      <button
        type="button"
        aria-label="Close notifications"
        className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-[1px]"
        onClick={() => setOpen(false)}
      />
      <NotificationPanel
        {...panelProps}
        className="fixed inset-x-4 top-[calc(4rem+env(safe-area-inset-top,0px)+0.5rem)] z-[90] overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card-hover)]"
      />
    </>
  ) : null

  const desktopPanel = open && !isMobile ? (
    <NotificationPanel
      {...panelProps}
      className="absolute right-0 top-12 z-[90] w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card-hover)]"
    />
  ) : null

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => void handleOpen()}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-glass text-fg transition hover:border-gold/35"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M15 17H9l-1 2h8l-1-2zM12 3a5 5 0 00-5 5v3l-2 2h14l-2-2V8a5 5 0 00-5-5z" />
        </svg>
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-on-gold">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {desktopPanel}
      {mobilePanel ? createPortal(mobilePanel, document.body) : null}
    </div>
  )
}
