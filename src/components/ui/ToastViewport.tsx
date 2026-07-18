import { AnimatePresence, motion } from 'framer-motion'
import type { ToastItem } from '../../hooks/useToast'

type ToastViewportProps = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

const toneStyles = {
  success:
    'border-gold/35 bg-page/95 text-fg shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
  error:
    'toast-error border-[color:var(--status-danger-border)] bg-page/95 shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto rounded-xl border px-4 py-3 backdrop-blur-md ${toneStyles[toast.tone]}`}
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-xs text-muted transition hover:text-fg"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
