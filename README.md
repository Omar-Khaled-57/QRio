# QRio — QR Maker

Create beautiful, customizable QR codes. Built with Vue 3, TypeScript, and Vite.

## Features

- **QR Types** — URL, Wi-Fi, vCard, Email, SMS, Location, Text, Payment
- **Customization** — Dot styles (square, round, diamond, hex), gradients, frames, center icons
- **Export** — PNG download at 512/1024/2048 px, copy to clipboard, print
- **Library** — Save, browse, and restore QR codes with IndexedDB persistence
- **PWA** — Installable offline-ready progressive web app
- **i18n** — English / Arabic with RTL support
- **Dark mode** — Automatic theme toggle

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Type-check and build for production
npm run preview  # Preview production build
```

## Stack

| Layer | Library |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript |
| Build | Vite 8 |
| QR generation | `qrcode` |
| Database | IndexedDB via `idb` |
| PWA | `vite-plugin-pwa` (Workbox) |

## Lighthouse

Audited at **Performance 95% · Accessibility 77% · Best Practices 96% · SEO 82%**.
