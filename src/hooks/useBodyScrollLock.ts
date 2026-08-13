import { useEffect } from 'react'

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousTouchAction = body.style.touchAction
    const previousPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    body.style.touchAction = 'none'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      body.style.overflow = previousOverflow
      body.style.touchAction = previousTouchAction
      body.style.paddingRight = previousPaddingRight
    }
  }, [locked])
}
