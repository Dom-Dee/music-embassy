/** Format ISO timestamp for datetime-local input */
export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function currentMonthLabel(date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(date)
}

export function endOfMonthIso(date = new Date()): string {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`
}
