import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastTone = 'success' | 'error'

export type ToastItem = {
  id: string
  message: string
  tone: ToastTone
}

const DEFAULT_DURATION_MS = 4200

export function useToast(durationMs = DEFAULT_DURATION_MS) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, message, tone }])

      const timer = window.setTimeout(() => {
        dismiss(id)
      }, durationMs)
      timersRef.current.set(id, timer)
    },
    [dismiss, durationMs],
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      for (const timer of timers.values()) {
        window.clearTimeout(timer)
      }
      timers.clear()
    }
  }, [])

  return { toasts, notify, dismiss }
}
