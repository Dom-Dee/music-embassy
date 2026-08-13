type AdminMediaOrderControlsProps = {
  positionLabel: string
  canMoveUp: boolean
  canMoveDown: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  disabled?: boolean
}

const orderButtonClass =
  'rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted transition hover:border-gold/35 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40'

export function AdminMediaOrderControls({
  positionLabel,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  disabled = false,
}: AdminMediaOrderControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted">{positionLabel}</span>
      <div className="flex gap-1">
        <button
          type="button"
          className={orderButtonClass}
          onClick={onMoveUp}
          disabled={disabled || !canMoveUp}
          aria-label="Move earlier on the page"
          title="Move earlier on the page"
        >
          Move up
        </button>
        <button
          type="button"
          className={orderButtonClass}
          onClick={onMoveDown}
          disabled={disabled || !canMoveDown}
          aria-label="Move later on the page"
          title="Move later on the page"
        >
          Move down
        </button>
      </div>
    </div>
  )
}
