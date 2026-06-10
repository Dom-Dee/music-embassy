type AdminRecordActionsProps = {
  onEdit: () => void
  onDelete: () => void
  deleting?: boolean
}

export function AdminRecordActions({
  onEdit,
  onDelete,
  deleting = false,
}: AdminRecordActionsProps) {
  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted transition hover:border-gold/35 hover:text-fg"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="rounded-full border border-red-500/25 px-3 py-1 text-xs font-medium text-red-300 transition hover:border-red-400/40 hover:text-red-200 disabled:opacity-50"
      >
        {deleting ? 'Removing…' : 'Delete'}
      </button>
    </div>
  )
}
