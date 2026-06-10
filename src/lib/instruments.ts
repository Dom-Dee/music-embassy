import { supabase } from './supabase'
import { getInstrumentImageUrl } from './instrumentImages'
import type { Instrument } from '../types/student'

const DISPLAY_ORDER = [
  'drums',
  'piano',
  'saxophone',
  'voice training',
]

function sortInstruments(list: Instrument[]): Instrument[] {
  return [...list].sort((a, b) => {
    const ai = DISPLAY_ORDER.indexOf(a.name.trim().toLowerCase())
    const bi = DISPLAY_ORDER.indexOf(b.name.trim().toLowerCase())
    const ao = ai === -1 ? 99 : ai
    const bo = bi === -1 ? 99 : bi
    return ao - bo || a.name.localeCompare(b.name)
  })
}

function withFallbackImages(list: Instrument[]): Instrument[] {
  return list.map((inst) => ({
    ...inst,
    image_url: getInstrumentImageUrl(inst.name, inst.image_url),
  }))
}

export async function fetchActiveInstruments(): Promise<Instrument[]> {
  // image_url is applied client-side (see instrumentImages.ts) so the app
  // works even before the optional DB column is added in Supabase.
  const { data, error } = await supabase
    .from('instruments')
    .select('id, name, description, monthly_fee, active')
    .eq('active', true)

  if (error) throw new Error(error.message)

  return sortInstruments(withFallbackImages((data ?? []) as Instrument[]))
}
