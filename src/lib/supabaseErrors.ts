/** True when Supabase/PostgREST has no row for this table yet (SQL not run). */
export function isMissingTableError(message: string, table: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('schema cache') ||
    lower.includes('does not exist') ||
    lower.includes(`'public.${table}'`) ||
    lower.includes(`"${table}"`)
  )
}
