export function PageLoader() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-gold/20 border-t-gold/75" />
    </div>
  )
}
