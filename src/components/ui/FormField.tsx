import { type InputHTMLAttributes, type ReactNode } from 'react'

export const formInputClass =
  'mt-2 w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-base text-fg placeholder:text-muted/70 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20'

type FormFieldProps = {
  label: string
  id: string
  children?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export function FormField({
  label,
  id,
  children,
  className = '',
  ...inputProps
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
      >
        {label}
      </label>
      {children ?? (
        <input id={id} className={`${formInputClass} ${className}`} {...inputProps} />
      )}
    </div>
  )
}
