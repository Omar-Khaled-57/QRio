/**
 * useQR — Core QR configuration and generation logic.
 *
 * Manages the shared reactive config object, QR content builders,
 * frame presets, and a lightweight SVG-to-PNG renderer used for
 * placeholder generation and clipboard export.
 *
 * @module useQR
 */

import { ref, type Ref } from 'vue'
import QRCode from 'qrcode'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** Supported QR content types */
export type QrType = 'url' | 'wifi' | 'vcard' | 'email' | 'location' | 'text' | 'sms' | 'payment'

/** QR module dot shapes */
export type DotStyle = 'square' | 'round' | 'diamond' | 'hex'

/** Error correction levels (L=low … H=high) */
export type EccLevel = 'L' | 'M' | 'Q' | 'H'

/** Export image dimensions */
export type ExportSize = 512 | 1024 | 2048

/** Frame / container preset keys */
export type FrameKey = 'none' | 'scan-me' | 'coffee' | 'badge' | 'menu' | 'social'

/**
 * Complete QR configuration — single source of truth shared reactively
 * between the create form, the preview panel, and library restoration.
 */
export interface QRConfig {
  type: QrType
  /** Raw (type-specific) content entered by the user */
  content: string
  /** Optional display label */
  label: string
  /** Icon preset: emoji string, `'__logo__'`, or `null` */
  icon: string | null
  /** Custom uploaded icon (base64 data URL) */
  iconImage: string | null
  /** Icon overlay size in px */
  iconSize: number
  frame: FrameKey
  bgColor: string
  bgColor2: string | null
  bgGradient: boolean
  qrColor: string
  qrColor2: string | null
  qrGradient: boolean
  frameColor: string
  frameColor2: string | null
  frameGradient: boolean
  ecc: EccLevel
  exportSize: ExportSize
  dotStyle: DotStyle

  transparent: boolean
  quietZone: boolean
  autoSave: boolean
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

export function defaultConfig(): QRConfig {
  return {
    type: 'url',
    content: '',
    label: '',
    icon: '__logo__',
    iconImage: null,
    iconSize: 40,
    frame: 'none',
    bgColor: '#ffffff',
    bgColor2: null,
    bgGradient: false,
    qrColor: '#1a2e3b',
    qrColor2: null,
    qrGradient: false,
    frameColor: '#3DC97A',
    frameColor2: null,
    frameGradient: false,
    ecc: 'Q',
    exportSize: 1024,
    dotStyle: 'square',

    transparent: false,
    quietZone: true,
    autoSave: false,
  }
}

/* ------------------------------------------------------------------ */
/*  Shared reactive config  (singleton — imported everywhere)          */
/* ------------------------------------------------------------------ */

/** The single reactive QRConfig instance shared across all components. */
export const config: Ref<QRConfig> = ref(defaultConfig())

/** Snapshot of the last rendered QR as a data URL (used by copy / print). */
export const qrDataUrl: Ref<string | null> = ref(null)

/* ------------------------------------------------------------------ */
/*  Frame presets                                                      */
/* ------------------------------------------------------------------ */

/** Data for one frame type */
export interface FrameConfig {
  top: string | null
  topBg?: string
  topColor?: string
  bot: string | null
  botBg?: string
  botColor?: string
  /** Banner background color shown behind the QR body */
  bg?: string
}

const FRAMES: Record<FrameKey, FrameConfig> = {
  'none':     { top: null, bot: null },
  'scan-me':  { top: null, bot: 'SCAN ME ↓', botBg: '#3DC97A', botColor: 'white' },
  'coffee':   { top: '☕ ORDER HERE', topBg: '#F7C948', topColor: '#7a4f00', bot: null },
  'badge':    { top: null, bot: 'SCAN THIS →', botBg: '#1a2e3b', botColor: 'white', bg: '#1a2e3b' },
  'menu':     { top: '📋 MENU', topBg: '#F7C948', topColor: '#7a4f00', bot: null },
  'social':   { top: null, bot: 'FOLLOW ME ✦', botBg: '#27C9B8', botColor: 'white' },
}

export function getFrameConfig(key: FrameKey): FrameConfig {
  return FRAMES[key]
}

/* ------------------------------------------------------------------ */
/*  Content builders                                                   */
/* ------------------------------------------------------------------ */

/**
 * Build the QR-encoded string from the user's raw config.
 *
 * Multi-field types (email, sms, wifi, vcard, location) expect their
 * content as **newline-separated** fields entered by the user.
 * Single-field types (url, text, payment) pass the content through.
 */
export function buildQrContent(cfg: QRConfig): string {
  switch (cfg.type) {
    case 'url':
    case 'text':
    case 'payment':
      return cfg.content
    case 'email': {
      const [to, subject, ...body] = cfg.content.split('\n')
      return `mailto:${to}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body.join('\n') || '')}`
    }
    case 'sms': {
      const [num, ...body] = cfg.content.split('\n')
      return `sms:${num}?body=${encodeURIComponent(body.join('\n') || '')}`
    }
    case 'wifi': {
      const [ssid, pass, enc] = cfg.content.split('\n')
      return `WIFI:T:${enc || 'WPA'};S:${ssid};P:${pass};;`
    }
    case 'vcard': {
      const [name, tel, email] = cfg.content.split('\n')
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${name || ''}\nTEL:${tel || ''}\nEMAIL:${email || ''}\nEND:VCARD`
    }
    case 'location': {
      const [lat, lng] = cfg.content.split('\n')
      return `geo:${lat || '0'},${lng || '0'}`
    }
    default:
      return cfg.content
  }
}

/* ------------------------------------------------------------------ */
/*  Lightweight QR renderer (offscreen canvas → data URL)              */
/* ------------------------------------------------------------------ */

/**
 * Render a QR code to a PNG data URL on an offscreen canvas.
 *
 * Used for:
 * - placeholder QR on the create tab (TabCreate.vue)
 * - clipboard image export (PreviewPanel.vue copyImage)
 *
 * NOTE: This is a simplified renderer (square dots only).
 * The full renderer with gradients & dot styles lives in
 * PreviewPanel.vue → renderQR().
 */
export async function generateQRDataURL(
  content: string,
  ecc: EccLevel = 'Q',
  qrColor: string = '#1a2e3b',
  bgColor: string = '#ffffff',
  size: number = 280,
): Promise<string> {
  const qr = await QRCode.create(content, { errorCorrectionLevel: ecc })
  const modules = qr.modules.size
  const padding = 2
  const moduleCount = modules + padding * 2
  const moduleSize = Math.floor(size / moduleCount)
  const actualSize = moduleSize * moduleCount
  const offset = Math.floor((size - actualSize) / 2)

  const cvs = document.createElement('canvas')
  cvs.width = size
  cvs.height = size
  const ctx = cvs.getContext('2d')!
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = qrColor

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (qr.modules.get(row, col)) {
        const x = (col + padding) * moduleSize + offset
        const y = (row + padding) * moduleSize + offset
        ctx.fillRect(x, y, moduleSize, moduleSize)
      }
    }
  }
  return cvs.toDataURL('image/png')
}

/* ------------------------------------------------------------------ */
/*  Shared SVG assets                                                  */
/* ------------------------------------------------------------------ */


