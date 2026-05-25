<template>
  <div class="preview-card">
    <div class="preview-stage">
      <div class="qr-outer" ref="qrOuterEl">
        <div class="qr-brand" :style="{ background: cfg.transparent ? 'transparent' : 'white' }">
          <svg viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="#3DC97A"/>
            <rect x="11" y="1" width="6" height="6" rx="1" fill="#3DC97A"/>
            <rect x="1" y="11" width="6" height="6" rx="1" fill="#3DC97A"/>
            <rect x="12" y="12" width="2" height="2" fill="#3DC97A"/>
            <rect x="15" y="12" width="2" height="2" fill="#3DC97A"/>
            <rect x="12" y="15" width="5" height="2" fill="#3DC97A"/>
          </svg>
          QRio
        </div>
        <div class="qr-banner" v-if="frameCfg.top" :style="{ background: frameCfg.topBg || 'var(--green)', color: frameCfg.topColor || 'white' }">
          {{ frameCfg.top }}
        </div>
        <div class="qr-body qr-square" :style="{ background: cfg.transparent ? 'transparent' : cfg.bgColor, padding: cfg.quietZone ? '16px' : '0' }">
          <div class="qr-preview-wrap">
            <img v-if="!hasQr && placeholderUrl" :src="placeholderUrl" class="qr-placeholder-img" alt="" />
            <canvas ref="qrCanvas" :width="canvasSize" :height="canvasSize" class="qr-canvas"></canvas>
            <div class="qr-icon-overlay" :style="overlayStyle">
              <svg v-if="cfg.icon === '__logo__'" viewBox="0 0 18 18" fill="none" :style="logoInnerStyle">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="white"/>
                <rect x="11" y="1" width="6" height="6" rx="1" fill="white"/>
                <rect x="1" y="11" width="6" height="6" rx="1" fill="white"/>
                <rect x="12" y="12" width="2" height="2" fill="white"/>
                <rect x="15" y="12" width="2" height="2" fill="white"/>
                <rect x="12" y="15" width="5" height="2" fill="white"/>
              </svg>
              <template v-else-if="cfg.icon || cfg.iconImage">
                <img v-if="cfg.iconImage" :src="cfg.iconImage" :style="imgInnerStyle" />
                <span v-else :style="emojiInnerStyle">{{ cfg.icon }}</span>
              </template>
              <svg v-else viewBox="0 0 18 18" fill="none" :style="logoInnerStyle">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="#1a2e3b"/>
                <rect x="11" y="1" width="6" height="6" rx="1" fill="#1a2e3b"/>
                <rect x="1" y="11" width="6" height="6" rx="1" fill="#1a2e3b"/>
                <rect x="12" y="12" width="2" height="2" fill="#1a2e3b"/>
                <rect x="15" y="12" width="2" height="2" fill="#1a2e3b"/>
                <rect x="12" y="15" width="5" height="2" fill="#1a2e3b"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="qr-banner" v-if="frameCfg.bot" :style="{ background: frameCfg.botBg || 'var(--green)', color: frameCfg.botColor || 'white' }">
          {{ frameCfg.bot }}
        </div>
      </div>
    </div>

    <div class="action-row">
      <button class="btn btn-green" @click="downloadPng">{{ t('b-save') }}</button>
      <button class="btn btn-dark" @click="shareLink">{{ t('b-share') }}</button>
    </div>
    <div class="action-row" style="margin-top:14px">
      <button class="btn btn-outline" @click="copyImage">{{ t('b-copy') }}</button>
      <button class="btn btn-outline" @click="printQR">{{ t('b-print') }}</button>
    </div>
    <button class="btn btn-outline save-lib-btn" @click="saveToLib">+ {{ t('b-addlib') }}</button>

    <div class="share-strip">
      <div v-for="s in shares" :key="s.label" class="share-btn" @click="shareTo(s)" :title="s.label">
        <svg v-if="s.icon === 'whatsapp'" viewBox="0 0 20 20" fill="none" style="width:18px;height:18px">
          <path d="M1.67 18.33l1.13-4.14A8.3 8.3 0 1 1 10 18.3a8.3 8.3 0 0 1-4.2-1.13l-4.13 1.13zM7 6.1a.8.8 0 0 0-.31.08 1.08 1.08 0 0 0-.25.19 2.12 2.12 0 0 0-.21.26 2.27 2.27 0 0 0-.47 1.57c0 .4.1.8.27 1.17.34.75.9 1.55 1.64 2.29.18.18.36.35.54.52a7.87 7.87 0 0 0 3.2 1.7l.48.08c.15 0 .3 0 .46-.01.27 0 .53-.04.69-.2.14-.07.2-.1.32-.18l.1-.07c.12-.09.18-.14.28-.24.07-.07.13-.16.17-.25.07-.14.13-.4.16-.62.02-.16.01-.25.01-.3 0-.1-.08-.19-.16-.23l-.49-.21-.02-.01-1.16-.52a.41.41 0 0 0-.15-.03.4.4 0 0 0-.31.1v-.01l-.66.78a.29.29 0 0 1-.3.11 1.23 1.23 0 0 1-.16-.06l-.21-.09a5 5 0 0 1-1.31-.83c-.1-.1-.2-.2-.3-.29a5.25 5.25 0 0 1-.85-1.05l-.05-.08a.77.77 0 0 1-.08-.17c-.03-.12.05-.22.05-.22s.2-.22.3-.34l.21-.31a3.6 3.6 0 0 0 .22-.31c.1-.16.13-.32.08-.45-.24-.57-.48-1.14-.73-1.7-.05-.11-.19-.19-.32-.21l-.14-.01a2.8 2.8 0 0 0-.33 0z" fill="currentColor"/>
        </svg>
        <svg v-else-if="s.icon === 'twitter'" viewBox="0 0 20 20" fill="none" style="width:18px;height:18px">
          <path d="M11.9 8.5 18 1.5h-1.7l-5.2 6-4.1-6H1l6.3 9.2L1 18.5h1.7l5.5-6.4 4.4 6.4H19l-7.1-10Zm-1.9 2.3-.7-1L3.3 2.5h2.5l4.3 6.2.7 1 5.4 7.8h-2.5l-4.4-6.5Z" fill="currentColor"/>
        </svg>
        <svg v-else-if="s.icon === 'email'" viewBox="0 0 20 20" fill="none" style="width:18px;height:18px">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M2 6l8 5 8-5" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
        <svg v-else-if="s.icon === 'link'" viewBox="0 0 20 20" fill="none" style="width:18px;height:18px">
          <path d="M8.5 11.5a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <path d="M11.5 8.5a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { config, qrDataUrl, getFrameConfig, buildQrContent, generateQRDataURL, type DotStyle } from '../composables/useQR'
import { toast } from '../composables/useToast'
import { t } from '../composables/useI18n'
import { saveExport, saveToLibrary } from '../composables/useDB'
import QRCode from 'qrcode'

const qrCanvas = ref<HTMLCanvasElement | null>(null)
const qrOuterEl = ref<HTMLDivElement | null>(null)
const canvasSize = ref(280)
const placeholderUrl = ref('')

const cfg = computed(() => config.value)
const frameCfg = computed(() => getFrameConfig(cfg.value.frame))
const hasQr = computed(() => !!buildQrContent(cfg.value))

const overlayStyle = computed(() => {
  const s = cfg.value.iconSize
  return {
    width: s + 'px',
    height: s + 'px',
    borderRadius: Math.round(s * 0.25) + 'px',
    fontSize: Math.round(s * 0.55) + 'px',
    background: cfg.value.icon === '__logo__' ? 'var(--green)' : 'white',
  }
})
const imgInnerStyle = computed(() => {
  const n = Math.round(cfg.value.iconSize * 0.75)
  return { width: n + 'px', height: n + 'px' }
})
const emojiInnerStyle = computed(() => {
  return { fontSize: Math.round(cfg.value.iconSize * 0.55) + 'px' }
})
const logoInnerStyle = computed(() => {
  const n = Math.round(cfg.value.iconSize * 0.55)
  return { width: n + 'px', height: n + 'px' }
})
const shares = [
  { label: 'WhatsApp', icon: 'whatsapp', url: (u: string) => `https://wa.me/?text=${encodeURIComponent(u)}` },
  { label: 'Copy link', icon: 'link', url: (u: string) => u },
  { label: 'Twitter', icon: 'twitter', url: (u: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}` },
  { label: 'Email', icon: 'email', url: (u: string) => `mailto:?body=${encodeURIComponent(u)}` },
]

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: DotStyle) {
  const half = size / 2
  switch (style) {
    case 'round':
      ctx.beginPath()
      ctx.arc(x + half, y + half, half * 0.85, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'diamond':
      ctx.save()
      ctx.translate(x + half, y + half)
      ctx.rotate(Math.PI / 4)
      ctx.fillRect(-half * 0.7, -half * 0.7, size * 0.7, size * 0.7)
      ctx.restore()
      break
    case 'hex':
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const px = x + half + half * 0.85 * Math.cos(angle)
        const py = y + half + half * 0.85 * Math.sin(angle)
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      break
    default:
      ctx.fillRect(x, y, size, size)
  }
}

async function renderQR() {
  const canvas = qrCanvas.value
  if (!canvas) return

  const content = buildQrContent(cfg.value)
  if (!content) return

  try {
    const qr = await QRCode.create(content, { errorCorrectionLevel: cfg.value.ecc })
    const modules = qr.modules.size

    const padding = 2
    const size = canvasSize.value
    const moduleCount = modules + padding * 2
    const moduleSize = Math.floor(size / moduleCount)
    const actualSize = moduleSize * moduleCount
    const offset = Math.floor((size - actualSize) / 2)

    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    if (!cfg.value.transparent) {
      ctx.fillStyle = cfg.value.bgColor
      ctx.fillRect(0, 0, size, size)
    }

    const qrColor1 = cfg.value.qrColor
    const qrColor2 = cfg.value.qrColor2
    const useGrad = cfg.value.qrGradient && qrColor2

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (qr.modules.get(row, col)) {
          const x = (col + padding) * moduleSize + offset
          const y = (row + padding) * moduleSize + offset
          if (useGrad) {
            const grad = ctx.createLinearGradient(0, 0, size, size)
            grad.addColorStop(0, qrColor1)
            grad.addColorStop(1, qrColor2!)
            ctx.fillStyle = grad
          } else {
            ctx.fillStyle = qrColor1
          }
          drawDot(ctx, x, y, moduleSize, cfg.value.dotStyle)
        }
      }
    }

    qrDataUrl.value = canvas.toDataURL('image/png')
  } catch {
    // Invalid content
  }
}

watch(config, () => nextTick(renderQR), { deep: true })

/** Draw a single QR code at a given pixel size to an off-screen canvas. */
async function renderQRAtSize(size: number): Promise<string | null> {
  const content = buildQrContent(cfg.value)
  if (!content) return null
  try {
    const qr = await QRCode.create(content, { errorCorrectionLevel: cfg.value.ecc })
    const modules = qr.modules.size, padding = 2
    const moduleCount = modules + padding * 2
    const moduleSize = Math.floor(size / moduleCount)
    const actualSize = moduleSize * moduleCount
    const offset = Math.floor((size - actualSize) / 2)

    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    if (!cfg.value.transparent) {
      ctx.fillStyle = cfg.value.bgColor
      ctx.fillRect(0, 0, size, size)
    }

    const qrColor1 = cfg.value.qrColor, qrColor2 = cfg.value.qrColor2
    const useGrad = cfg.value.qrGradient && qrColor2
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        if (qr.modules.get(row, col)) {
          const x = (col + padding) * moduleSize + offset
          const y = (row + padding) * moduleSize + offset
          ctx.fillStyle = useGrad ? (() => { const g = ctx.createLinearGradient(0,0,size,size); g.addColorStop(0,qrColor1); g.addColorStop(1,qrColor2!); return g })() : qrColor1
          drawDot(ctx, x, y, moduleSize, cfg.value.dotStyle)
        }
      }
    }
    return c.toDataURL('image/png')
  } catch { return null }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r)
  ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h)
  ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r)
  ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y)
  ctx.closePath()
}

/** Render a full composite image (brand + banners + QR + icon overlay). */
async function exportFullImage(size: number): Promise<string | null> {
  const qrData = await renderQRAtSize(size)
  if (!qrData) return null

  const qrImg = new Image()
  await new Promise((res, rej) => { qrImg.onload = res; qrImg.onerror = rej; qrImg.src = qrData })

  const brandH = Math.round(size * 36 / 280)
  const bannerH = Math.round(size * 30 / 280)
  const topH = frameCfg.value.top ? bannerH : 0
  const botH = frameCfg.value.bot ? bannerH : 0
  const totalH = brandH + topH + size + botH

  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = totalH
  const ctx = canvas.getContext('2d')!

  // Frame background
  if (frameCfg.value.bg) { ctx.fillStyle = frameCfg.value.bg; ctx.fillRect(0, 0, size, totalH) }

  // Brand header
  let y = 0
  if (!cfg.value.transparent) {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, y, size, brandH)
  }
  const logoSize = Math.round(brandH * 0.56)
  const logoX = Math.round(size / 2 - logoSize * 5) // rough centering for "logo + text"
  const logoY = y + Math.round((brandH - logoSize) / 2)
  const logoScale = logoSize / 18
  ctx.fillStyle = '#3DC97A'
  const lr = (r: number) => Math.round(r * logoScale)
  // Draw green QRio logo rects
  const lrects: [number,number,number,number,number][] = [[1,1,6,6,1],[11,1,6,6,1],[1,11,6,6,1],[12,12,2,2,0],[15,12,2,2,0],[12,15,5,2,0]]
  for (const [rx, ry, rw, rh, rr] of lrects) {
    if (rr) { roundRect(ctx, logoX + lr(rx), logoY + lr(ry), lr(rw), lr(rh), lr(rr)); ctx.fill() }
    else { ctx.fillRect(logoX + lr(rx), logoY + lr(ry), lr(rw), lr(rh)) }
  }
  ctx.fillStyle = '#3DC97A'
  ctx.font = `bold ${Math.round(brandH * 0.38)}px sans-serif`
  ctx.textBaseline = 'middle'
  ctx.fillText('QRio', logoX + lr(20), y + brandH / 2)
  y += brandH

  // Top banner
  if (frameCfg.value.top) {
    ctx.fillStyle = frameCfg.value.topBg || '#3DC97A'
    ctx.fillRect(0, y, size, bannerH)
    ctx.fillStyle = frameCfg.value.topColor || '#fff'
    ctx.font = `bold ${Math.round(bannerH * 0.48)}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(frameCfg.value.top, size / 2, y + bannerH / 2)
    y += bannerH
  }

  // QR code
  ctx.drawImage(qrImg, 0, y, size, size)

  // Icon overlay
  const iconS = Math.round(size * cfg.value.iconSize / 280)
  const iconX = Math.round((size - iconS) / 2)
  const iconY = y + Math.round((size - iconS) / 2)
  const iconR = Math.round(iconS * 0.25)

  if (cfg.value.icon === '__logo__') {
    ctx.fillStyle = '#3DC97A'
    roundRect(ctx, iconX, iconY, iconS, iconS, iconR); ctx.fill()
    const is = iconS / 18 * 0.55
    const ix = iconX + iconS / 2 - is * 9
    const iy = iconY + iconS / 2 - is * 9
    ctx.fillStyle = '#fff'
    const ir = (n: number) => Math.round(n * is)
    for (const [rx, ry, rw, rh, rr] of lrects) {
      if (rr) { roundRect(ctx, ix + ir(rx), iy + ir(ry), ir(rw), ir(rh), ir(rr)); ctx.fill() }
      else { ctx.fillRect(ix + ir(rx), iy + ir(ry), ir(rw), ir(rh)) }
    }
  } else if (cfg.value.iconImage) {
    const img = new Image()
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = cfg.value.iconImage! })
    await new Promise(r => setTimeout(r, 50)) // ensure img loaded
    ctx.save()
    roundRect(ctx, iconX, iconY, iconS, iconS, iconR); ctx.clip()
    ctx.drawImage(img, iconX, iconY, iconS, iconS)
    ctx.restore()
  } else if (cfg.value.icon) {
    ctx.fillStyle = '#fff'
    roundRect(ctx, iconX, iconY, iconS, iconS, iconR); ctx.fill()
    ctx.fillStyle = '#1a2e3b'
    ctx.font = `${Math.round(iconS * 0.55)}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(cfg.value.icon, size / 2, iconY + iconS / 2)
  } else {
    ctx.fillStyle = '#fff'
    roundRect(ctx, iconX, iconY, iconS, iconS, iconR); ctx.fill()
    const is = iconS / 18 * 0.55
    const ix = iconX + iconS / 2 - is * 9
    const iy = iconY + iconS / 2 - is * 9
    ctx.fillStyle = '#1a2e3b'
    const ir = (n: number) => Math.round(n * is)
    for (const [rx, ry, rw, rh, rr] of lrects) {
      if (rr) { roundRect(ctx, ix + ir(rx), iy + ir(ry), ir(rw), ir(rh), ir(rr)); ctx.fill() }
      else { ctx.fillRect(ix + ir(rx), iy + ir(ry), ir(rw), ir(rh)) }
    }
  }

  y += size

  // Bottom banner
  if (frameCfg.value.bot) {
    ctx.fillStyle = frameCfg.value.botBg || '#3DC97A'
    ctx.fillRect(0, y, size, bannerH)
    ctx.fillStyle = frameCfg.value.botColor || '#fff'
    ctx.font = `bold ${Math.round(bannerH * 0.48)}px sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(frameCfg.value.bot, size / 2, y + bannerH / 2)
  }

  return canvas.toDataURL('image/png')
}

onMounted(async () => {
  renderQR()
  try {
    placeholderUrl.value = await generateQRDataURL('https://q-rio.vercel.app', 'Q', '#1a2e3b', '#ffffff')
  } catch {}
})

async function downloadPng() {
  const size = cfg.value.exportSize
  const url = await exportFullImage(size)
  if (!url) { toast('⚠️ Nothing to save'); return }
  const link = document.createElement('a')
  link.download = (cfg.value.label || 'qrio-qr') + '.png'
  link.href = url
  link.click()
  await saveExport(url, { label: cfg.value.label, type: cfg.value.type })
  toast('✅ ' + t('b-save'))
}

function shareLink() {
  navigator.clipboard.writeText(cfg.value.content)
  toast('🔗 ' + t('toast-copied'))
}

async function copyImage() {
  const url = await exportFullImage(1024)
  if (!url) { toast('⚠️ Nothing to copy'); return }
  try {
    const parts = url.split(',')
    const byteString = atob(parts[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
    const blob = new Blob([ab], { type: 'image/png' })
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    toast('📋 ' + t('toast-copied'))
  } catch {
    toast('⚠️ Copy failed')
  }
}

let printFrame: HTMLIFrameElement | null = null
async function printQR() {
  const url = await exportFullImage(1024)
  if (!url) { toast('⚠️ Nothing to print'); return }
  if (!printFrame) {
    printFrame = document.createElement('iframe')
    printFrame.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none'
    document.body.appendChild(printFrame)
  }
  printFrame.srcdoc = `<!DOCTYPE html><html><head><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh}@page{margin:0}img{max-width:100%;max-height:100vh}</style></head><body><img src="${url}" onload="setTimeout(()=>{window.print()},200)" /></body></html>`
}

function shareTo(s: { url: (u: string) => string }) {
  if (s.label === 'Copy link') {
    navigator.clipboard.writeText(cfg.value.content)
    toast('🔗 ' + t('toast-copied'))
    return
  }
  const url = s.url(cfg.value.content || 'https://qrio.app')
  window.open(url, '_blank')
}

async function saveToLib() {
  await renderQR()
  const label = cfg.value.label || 'QR #' + Date.now()
  await saveToLibrary({
    label,
    type: cfg.value.type,
    config: JSON.stringify(cfg.value),
    ts: new Date().toLocaleDateString(),
  })
  toast('✅ ' + label + ' ' + t('toast-saved'))
}
</script>

<style scoped>
.preview-stage {
  width: 100%;
  min-height: 260px;
  border-radius: 14px;
  background: var(--surface2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: background .25s;
  position: relative;
}
.qr-outer {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0,0,0,.14);
}
.qr-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px 6px;
  font-size: var(--fs-base);
  font-weight: 900;
  color: var(--green);
}
.qr-brand svg { width: 20px; height: 20px; }
.qr-square {
  border: 2px solid var(--border);
  border-radius: 0;
  margin: 0 8px 8px;
}
.qr-banner {
  color: white;
  font-size: var(--fs-sm);
  font-weight: 900;
  padding: 8px 16px;
  text-align: center;
  letter-spacing: .05em;
}
.qr-body {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.qr-preview-wrap {
  display: grid;
  grid-template-areas: "preview";
  align-items: center;
  justify-items: center;
  position: relative;
}
.qr-preview-wrap > * {
  grid-area: preview;
}
.qr-placeholder-img {
  display: block;
  max-width: 100%;
  height: auto;
}
.qr-canvas {
  display: block;
  max-width: 100%;
  height: auto;
  z-index: 1;
}
.qr-icon-overlay {
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.14);
  pointer-events: none;
  z-index: 2;
}
.qr-icon-overlay img { border-radius: 6px; object-fit: cover; }
.share-strip {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 14px;
  width: 100%;
}
.share-btn {
  flex: 1;
  height: 38px;
  border-radius: 10px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--fs-md);
  transition: all .15s;
}
.share-btn:hover { border-color: var(--green); transform: scale(1.08); }
.save-lib-btn { width: 100%; padding: 12px; border-radius: 14px; font-size: 13px; margin-top: 14px; }
</style>
