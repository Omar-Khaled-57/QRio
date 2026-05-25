import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#3DC97A"/>
  <rect x="64" y="64" width="170" height="170" rx="30" fill="white"/>
  <rect x="278" y="64" width="170" height="170" rx="30" fill="white"/>
  <rect x="64" y="278" width="170" height="170" rx="30" fill="white"/>
  <rect x="320" y="320" width="55" height="55" rx="12" fill="white"/>
  <rect x="400" y="320" width="55" height="55" rx="12" fill="white"/>
  <rect x="320" y="400" width="135" height="55" rx="12" fill="white"/>
</svg>`

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
]

async function main() {
  const pub = resolve(root, 'public')
  const logo = resolve(pub, 'logo')
  mkdirSync(logo, { recursive: true })

  for (const { name, size } of sizes) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(resolve(pub, name))
    console.log(`Created ${name}`)
  }

  // OG image (1200x630)
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f2f8f5"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="480" y="190" width="240" height="240" rx="50" fill="#3DC97A"/>
    <rect x="510" y="220" width="80" height="80" rx="14" fill="white"/>
    <rect x="610" y="220" width="80" height="80" rx="14" fill="white"/>
    <rect x="510" y="320" width="80" height="80" rx="14" fill="white"/>
    <rect x="620" y="330" width="26" height="26" rx="6" fill="white"/>
    <rect x="656" y="330" width="26" height="26" rx="6" fill="white"/>
    <rect x="620" y="366" width="62" height="26" rx="6" fill="white"/>
    <text x="600" y="490" font-family="system-ui,sans-serif" font-size="48" font-weight="900" fill="#1a2e3b" text-anchor="middle">QRio</text>
    <text x="600" y="540" font-family="system-ui,sans-serif" font-size="24" fill="#4a5e6a" text-anchor="middle">Create beautiful, customizable QR codes</text>
  </svg>`

  const ogNames = ['og-default.png']
  for (const name of ogNames) {
    await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toFile(resolve(logo, name))
    console.log(`Created logo/${name}`)
  }
}

main().catch(console.error)
