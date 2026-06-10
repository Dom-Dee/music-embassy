import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { InstrumentSelector } from '../../components/auth/InstrumentSelector'
import { AuthAlert } from '../../components/auth/AuthAlert'
import { Button } from '../../components/ui/Button'
import { formatFirstName } from '../../lib/formatName'
import {
  createStudentEnrollments,
  getActiveEnrolledInstrumentIds,
} from '../../lib/enrollments'
import { fetchActiveInstruments } from '../../lib/instruments'
import type { Instrument } from '../../types/student'

export function ChooseInstruments() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [enrolledInstrumentIds, setEnrolledInstrumentIds] = useState<Set<string>>(
    new Set(),
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loadingInstruments, setLoadingInstruments] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!profile) return

    void (async () => {
      try {
        const [list, activeIds] = await Promise.all([
          fetchActiveInstruments(),
          getActiveEnrolledInstrumentIds(profile.id),
        ])
        setEnrolledInstrumentIds(activeIds)
        setInstruments(list.filter((instrument) => !activeIds.has(instrument.id)))
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : 'Could not load instruments',
        )
      } finally {
        setLoadingInstruments(false)
      }
    })()
  }, [profile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || selectedIds.length === 0) return

    const duplicate = selectedIds.find((id) => enrolledInstrumentIds.has(id))
    if (duplicate) {
      setSubmitError('Instrument already being learnt by you')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      await createStudentEnrollments(profile.id, selectedIds)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setSubmitError(
        msg.includes('abort') || msg.includes('AbortError')
          ? 'Request timed out. Please try again in a few seconds.'
          : msg || 'Could not save your instruments. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!profile) return null

  const firstName = formatFirstName(profile.full_name)
  const addingAnother = enrolledInstrumentIds.size > 0
  const allEnrolled =
    !loadingInstruments && instruments.length === 0 && enrolledInstrumentIds.size > 0

  return (
    <div className="relative -mx-6 -mt-4 min-h-[calc(100svh-5rem)] px-6 pb-16 pt-2 lg:-mx-8 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold/88">
          Music Embassy
        </p>
        <h1 className="mt-4 font-display text-4xl text-fg md:text-5xl lg:text-[3.25rem]">
          {addingAnother
            ? `Add another instrument, ${firstName}`
            : `Choose your instruments, ${firstName}`}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {addingAnother
            ? 'Pick a new instrument for your dashboard. Instruments you already learn are not shown here.'
            : 'Select what you want to learn. Each instrument gets its own path on your dashboard, with lessons, fees, and progress kept separate.'}
        </p>
        <div className="liquid-divider mx-auto mt-6 w-20" />
      </motion.header>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="relative mx-auto mt-10 max-w-4xl"
      >
        {submitError ? (
          <div className="mb-6">
            <AuthAlert message={submitError} />
          </div>
        ) : null}

        {allEnrolled ? (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-glass/60 px-6 py-8 text-center">
            <p className="text-base text-fg">
              You are already learning every instrument available right now.
            </p>
            <p className="mt-2 text-sm text-muted">
              Check your dashboard for lessons, assignments, and fees.
            </p>
            <Button to="/dashboard" className="mt-6">
              Back to dashboard
            </Button>
          </div>
        ) : (
          <>
            <InstrumentSelector
              instruments={instruments}
              selectedIds={selectedIds}
              onChange={setSelectedIds}
              loading={loadingInstruments}
              error={loadError}
              variant="premium"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3"
            >
              <Button
                type="submit"
                className="w-full px-10 py-4 text-base"
                disabled={
                  submitting || selectedIds.length === 0 || loadingInstruments
                }
              >
                {submitting
                  ? 'Saving…'
                  : addingAnother
                    ? 'Add to dashboard'
                    : 'Enter your studio'}
              </Button>
              {!addingAnother ? (
                <p className="text-xs text-muted">
                  You can add more instruments later from your dashboard.
                </p>
              ) : null}
            </motion.div>
          </>
        )}
      </form>
    </div>
  )
}
