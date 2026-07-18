import { createContext, useContext, type ReactNode } from 'react'
import { ToastViewport } from '../ui/ToastViewport'
import { useToast, type ToastTone } from '../../hooks/useToast'

type AdminToastContextValue = {
  notify: (message: string, tone?: ToastTone) => void
}

const AdminToastContext = createContext<AdminToastContextValue | null>(null)

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const { toasts, notify, dismiss } = useToast()

  return (
    <AdminToastContext.Provider value={{ notify }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </AdminToastContext.Provider>
  )
}

export function useAdminToast(): AdminToastContextValue {
  const context = useContext(AdminToastContext)
  if (!context) {
    throw new Error('useAdminToast must be used within AdminToastProvider')
  }
  return context
}
