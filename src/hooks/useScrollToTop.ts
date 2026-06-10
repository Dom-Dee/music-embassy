import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTopInstant } from '../lib/navigation'

export function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTopInstant()
  }, [pathname])
}
