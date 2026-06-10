import type { ReactNode } from 'react'
import type { AdminEnrollment, AudienceMode, InstrumentRoster } from '../../types/admin'
import { FormField, formInputClass } from '../ui/FormField'
import { EnrollmentSelect } from './EnrollmentSelect'

const cardBase =
  'glass-wood-surface liquid-panel overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]'

type AdminCardProps = {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4 md:p-5',
  md: 'p-6 md:p-7',
  lg: 'p-7 md:p-9',
}

export function AdminPage({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>
}

export function AdminCard({ children, className = '', padding = 'none' }: AdminCardProps) {
  return (
    <div className={`${cardBase} ${paddingMap[padding]} ${className}`}>{children}</div>
  )
}

export function AdminCardHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex min-h-[5.25rem] flex-wrap items-start justify-between gap-4 border-b border-border px-6 py-5 md:px-7">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold/90">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`font-display text-xl leading-tight text-fg md:text-2xl ${eyebrow ? 'mt-1' : ''}`}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export function AdminCardBody({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`p-6 md:p-7 ${className}`}>{children}</div>
}

export function AdminPageIntro({ eyebrow, title, description }: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <AdminCard padding="none">
      <AdminCardHeader eyebrow={eyebrow} title={title} description={description} />
    </AdminCard>
  )
}

export function AdminAlert({
  tone,
  children,
}: {
  tone: 'error' | 'success'
  children: ReactNode
}) {
  const styles =
    tone === 'error'
      ? 'border-red-500/25 bg-red-500/8 text-red-200'
      : 'border-gold/25 bg-gold/8 text-gold'
  return (
    <AdminCard padding="md">
      <p className={`text-sm ${styles} rounded-lg border px-4 py-3`}>{children}</p>
    </AdminCard>
  )
}

export function AdminFormPanel({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <AdminCard padding="none" className="w-full self-start">
      <AdminCardHeader eyebrow="Compose" title={title} />
      <AdminCardBody>{children}</AdminCardBody>
    </AdminCard>
  )
}

export function AdminListPanel({
  eyebrow,
  title,
  description,
  empty,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  empty?: string
  children: ReactNode
}) {
  return (
    <AdminCard padding="none" className="w-full self-start">
      <AdminCardHeader eyebrow={eyebrow} title={title} description={description} />
      {empty ? (
        <AdminCardBody>
          <p className="text-sm text-muted">{empty}</p>
        </AdminCardBody>
      ) : (
        <ul className="divide-y divide-border">{children}</ul>
      )}
    </AdminCard>
  )
}

export function AdminRecordCard({
  title,
  meta,
  detail,
  action,
  body,
}: {
  title: string
  meta: string
  detail?: string
  action?: ReactNode
  body?: ReactNode
}) {
  return (
    <li className="px-6 py-4 md:px-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-fg">{title}</p>
          <p className="mt-1 text-sm text-muted">{meta}</p>
          {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
        </div>
        {action}
      </div>
      {body ? <div className="mt-3">{body}</div> : null}
    </li>
  )
}

export function AdminSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,26rem)_1fr]">
      {children}
    </div>
  )
}

export function AdminStatGrid({ children }: { children: ReactNode }) {
  return (
    <AdminCard padding="none">
      <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {children}
      </div>
    </AdminCard>
  )
}

export function AdminStatCell({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="px-6 py-5 md:px-7 md:py-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-3xl ${emphasis ? 'text-gold' : 'text-fg'}`}
      >
        {value}
      </p>
    </div>
  )
}

type AudiencePickerProps = {
  enrollments: AdminEnrollment[]
  rosters: InstrumentRoster[]
  mode: AudienceMode
  onModeChange: (mode: AudienceMode) => void
  enrollmentId: string
  onEnrollmentIdChange: (id: string) => void
  instrumentId: string
  onInstrumentIdChange: (id: string) => void
  enrollmentFieldId: string
  instrumentFieldId: string
}

export function AudiencePicker({
  enrollments,
  rosters,
  mode,
  onModeChange,
  enrollmentId,
  onEnrollmentIdChange,
  instrumentId,
  onInstrumentIdChange,
  enrollmentFieldId,
  instrumentFieldId,
}: AudiencePickerProps) {
  const selectedRoster = rosters.find((r) => r.instrumentId === instrumentId)
  const recipientCount =
    mode === 'instrument'
      ? (selectedRoster?.enrollments.length ?? 0)
      : enrollmentId
        ? 1
        : 0

  const recipientSummary =
    recipientCount === 0
      ? 'Select a recipient to publish.'
      : mode === 'instrument' && selectedRoster
        ? `Will reach ${recipientCount} student${recipientCount === 1 ? '' : 's'} in ${selectedRoster.instrumentName}.`
        : `Will reach ${recipientCount} student${recipientCount === 1 ? '' : 's'}.`

  return (
    <fieldset className="space-y-4 rounded-xl border border-border/90 bg-surface/25 p-4 md:p-5">
      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/85">
        Audience
      </legend>

      <div
        className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-page/50 p-1"
        role="group"
        aria-label="Audience type"
      >
        {(
          [
            { id: 'individual' as const, label: 'Individual' },
            { id: 'instrument' as const, label: 'Per instrument' },
          ] as const
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onModeChange(option.id)}
            aria-pressed={mode === option.id}
            className={`rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors ${
              mode === option.id
                ? 'bg-gold/14 text-fg ring-1 ring-gold/28'
                : 'text-muted hover:text-fg'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {mode === 'individual' ? (
        <FormField label="Student and instrument" id={enrollmentFieldId}>
          <EnrollmentSelect
            id={enrollmentFieldId}
            enrollments={enrollments}
            value={enrollmentId}
            onChange={onEnrollmentIdChange}
            required
          />
        </FormField>
      ) : (
        <FormField label="Instrument" id={instrumentFieldId}>
          <select
            id={instrumentFieldId}
            required
            value={instrumentId}
            onChange={(e) => onInstrumentIdChange(e.target.value)}
            className={formInputClass}
          >
            <option value="">Select instrument</option>
            {rosters.map((roster) => (
              <option key={roster.instrumentId} value={roster.instrumentId}>
                {roster.instrumentName} ({roster.enrollments.length} enrolled)
              </option>
            ))}
          </select>
        </FormField>
      )}

      <p className="text-sm leading-relaxed text-muted">{recipientSummary}</p>
    </fieldset>
  )
}

type SegmentTab<T extends string> = { id: T; label: string; count?: number }

export function SegmentTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: SegmentTab<T>[]
  active: T
  onChange: (id: T) => void
}) {
  return (
    <AdminCard padding="sm" className="!shadow-none bg-surface/25">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              active === tab.id
                ? 'bg-gold/14 text-fg ring-1 ring-gold/28'
                : 'text-muted hover:bg-page/30 hover:text-fg'
            }`}
          >
            {tab.label}
            {tab.count !== undefined ? (
              <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
            ) : null}
          </button>
        ))}
      </div>
    </AdminCard>
  )
}
