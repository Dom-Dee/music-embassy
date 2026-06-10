/** Instant scroll — avoids fighting route changes with smooth scroll. */
export function scrollToTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

/** Wait for the next paint so taps feel responsive before heavy work. */
export function deferToNextFrame(task: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(task)
  })
}

/** Open external apps / tabs after the UI has updated. */
export function openExternalUrl(url: string, options?: { newTab?: boolean }) {
  deferToNextFrame(() => {
    const useNewTab = options?.newTab !== false
    if (useNewTab) {
      const opened = window.open(url, '_blank', 'noopener,noreferrer')
      if (!opened) window.location.assign(url)
      return
    }
    window.location.assign(url)
  })
}
