import { motion } from 'framer-motion'

type AuthAlertProps = {
  message: string
  variant?: 'error' | 'success'
}

export function AuthAlert({ message, variant = 'error' }: AuthAlertProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border px-4 py-3 text-sm ${
        variant === 'error'
          ? 'border-red-500/30 bg-red-500/10 text-red-200'
          : 'border-gold/30 bg-gold/10 text-gold'
      }`}
      role="alert"
    >
      {message}
    </motion.p>
  )
}
