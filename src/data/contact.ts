import { buildGmailComposeUrl } from '../lib/emailLinks'

export const STUDIO_NAME = 'Palm Valley Estates (Kuottam Estates)'
export const STUDIO_AREA = 'Oyarifa, Accra'
export const STUDIO_LOCATION = STUDIO_NAME
export const STUDIO_EMAIL = 'musicembassy.edu@gmail.com'
export const STUDIO_EMAIL_COMPOSE_URL = buildGmailComposeUrl({ to: STUDIO_EMAIL })
export const STUDIO_PHONE = '+233 541 803 908'
export const STUDIO_PHONE_HREF = 'tel:+233541803908'
export const STUDIO_WHATSAPP_URL = 'https://wa.me/233541803908'

const STUDIO_LATITUDE = 5.7441869
const STUDIO_LONGITUDE = -0.1831641

export const STUDIO_MAPS_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  STUDIO_NAME,
)}@${STUDIO_LATITUDE},${STUDIO_LONGITUDE}`
