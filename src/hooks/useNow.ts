import { useState } from 'react'

/** Stable timestamp for the current mount (avoids Date.now() during every render). */
export function useNow(): number {
  return useState(() => Date.now())[0]
}
