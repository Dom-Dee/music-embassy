import { useEffect, useState } from 'react'

/**
 * Current time for deadline / countdown UI.
 * Pass `intervalMs` to refresh periodically (e.g. every minute).
 * Without an interval, the value is fixed for the component mount.
 */
export function useNow(intervalMs?: number): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!intervalMs || intervalMs <= 0) return

    const id = window.setInterval(() => {
      setNow(Date.now())
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [intervalMs])

  return now
}
