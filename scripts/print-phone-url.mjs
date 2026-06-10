import { networkInterfaces } from 'node:os'
import { execSync } from 'node:child_process'

const port = process.env.VITE_PORT || '5173'

function getLanIp() {
  try {
    const en0 = execSync('ipconfig getifaddr en0', { encoding: 'utf8' }).trim()
    if (en0) return en0
  } catch {
    // fall through
  }

  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === 'IPv4' && !entry.internal) return entry.address
    }
  }

  return null
}

const ip = getLanIp()

console.log('\nPhone preview (same Wi‑Fi as this Mac)\n')
if (ip) {
  console.log(`  http://${ip}:${port}`)
} else {
  console.log('  Could not detect your Mac IP. Run: ipconfig getifaddr en0')
}

console.log('\nBefore opening on your phone:')
console.log('  1. Run: npm run dev')
console.log('  2. Use http (not https)')
console.log('  3. Turn off VPN on phone and Mac')
console.log('  4. Disable mobile data on your phone while testing')

console.log('\nIf it still will not load (common on university/campus Wi‑Fi):')
console.log('  • Campus networks often block phone ↔ laptop connections')
console.log('  • Use iPhone Personal Hotspot: connect Mac to your phone hotspot, then run this script again')
console.log('  • Or deploy the site (Vercel/Netlify) for a public link you can open anywhere\n')
