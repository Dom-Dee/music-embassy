import { useNavigate } from 'react-router-dom'
import { useCanGoBack } from '../../hooks/useCanGoBack'

function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

type BackButtonProps = {
  fallbackTo?: string
  className?: string
  label?: string
}

export function BackButton({
  fallbackTo = '/',
  className = '',
  label = 'Back',
}: BackButtonProps) {
  const navigate = useNavigate()
  const canGoBack = useCanGoBack()

  if (!canGoBack) return null

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate(fallbackTo)
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`tap-target flex min-h-11 items-center gap-2 rounded-full border border-border bg-glass px-3.5 py-2.5 text-sm font-medium text-muted backdrop-blur-sm transition-[color,border-color,background-color] duration-200 hover:border-gold/35 hover:text-fg ${className}`}
      aria-label="Go back to the previous page"
    >
      <IconArrowLeft className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}
