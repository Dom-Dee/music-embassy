/** First word of a full name, with the first letter capitalised for display */
export function formatFirstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] ?? ''
  if (!first) return ''
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}
