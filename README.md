<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='10' fill='%233DC97A'/%3E%3Crect x='6' y='6' width='16' height='16' rx='3' fill='white'/%3E%3Crect x='26' y='6' width='16' height='16' rx='3' fill='white'/%3E%3Crect x='6' y='26' width='16' height='16' rx='3' fill='white'/%3E%3Crect x='30' y='30' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='38' y='30' width='5' height='5' rx='1' fill='white'/%3E%3Crect x='30' y='38' width='13' height='5' rx='1' fill='white'/%3E%3C/svg%3E">
    <img src="public/favicon.svg" alt="QRio" width="40" height="40" style="vertical-align: middle;">
  </picture>
  QRio
</h1>

Create beautiful, customizable QR codes — free, offline, and private.

<a href="#features">Features</a> •
<a href="#getting-started">Getting Started</a> •
<a href="#usage">Usage</a> •
<a href="#stack">Stack</a> •
<a href="#configuration">Configuration</a>

<img src="https://img.shields.io/badge/Vue_3-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3">
<img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white" alt="PWA">
<img src="https://img.shields.io/badge/i18n-EN_%2F_AR-3DC97A" alt="i18n">

---

## Features

| Feature | Description |
|---|---|
| **8 QR Types** | URL, Wi-Fi, vCard, Email, SMS, Location, Text, Payment |
| **Custom Styles** | Square, Round, Diamond, Hex dot shapes |
| **Gradients** | Background, QR dots, and frame color gradients |
| **Frames** | Scan Me, Coffee, Dark Badge, Menu, Social — or no frame |
| **Center Icons** | Upload your logo or pick from 11 preset emojis |
| **Export** | PNG at 512 / 1024 / 2048 px, copy to clipboard, or print |
| **SVG Export** | Vector export for lossless scaling |
| **Library** | Save, browse, edit, and restore QR codes (IndexedDB) |
| **PWA** | Installable, works offline with service worker caching |
| **Dark Mode** | Automatic theme toggle with persisted preference |
| **i18n** | Full English and Arabic (RTL) support |
| **Privacy** | Everything stays on your device — no servers, no tracking |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server — open `http://localhost:5173` (or the port shown in the terminal).

### Production Build

```bash
npm run build
```

Type-checks with TypeScript and produces an optimized build in `dist/`.

### Preview Build

```bash
npm run preview
```

Serves the production build locally.

## Usage

1. **Pick a QR type** — URL, Wi-Fi, vCard, Email, SMS, Location, Text, or Payment.
2. **Enter your content** — the form adapts to the selected type.
3. **Customize the look** — choose colors, gradients, dot style, frame, and center icon.
4. **Export** — download as PNG or SVG, copy to clipboard, or print.

### QR Types

| Type | Fields |
|---|---|
| URL | Website URL |
| Wi-Fi | SSID, Password, Encryption (WPA/WEP) |
| vCard | Name, Phone, Email |
| Email | To, Subject, Body |
| Location | Latitude, Longitude |
| Text | Freeform text |
| SMS | Phone Number, Message |
| Payment | Payment string |

### Dot Styles

| Style | Preview |
|---|---|
| `square` | Standard square modules |
| `round` | Circular modules |
| `diamond` | Rotated square modules |
| `hex` | Hexagonal modules |

## Stack

| Layer | Library |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite](https://vite.dev/) |
| QR Generation | [`qrcode`](https://www.npmjs.com/package/qrcode) |
| Database | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [`idb`](https://www.npmjs.com/package/idb) |
| PWA | [`vite-plugin-pwa`](https://www.npmjs.com/package/vite-plugin-pwa) (Workbox) |
| Fonts | [Nunito](https://fonts.google.com/specimen/Nunito) (Latin), [Cairo](https://fonts.google.com/specimen/Cairo) (Arabic) |

## Configuration

### `src/composables/useQR.ts`

The core `QRConfig` interface defines all customizable properties:

| Property | Type | Default | Description |
|---|---|---|---|
| `type` | `QrType` | `'url'` | QR content type |
| `dotStyle` | `DotStyle` | `'square'` | Module shape |
| `ecc` | `EccLevel` | `'Q'` | Error correction (L/M/Q/H) |
| `exportSize` | `ExportSize` | `1024` | PNG export resolution |
| `frame` | `FrameKey` | `'none'` | Frame / container preset |
| `transparent` | `boolean` | `false` | Transparent PNG background |
| `quietZone` | `boolean` | `true` | Include quiet zone border |

### PWA

The PWA manifest and service worker are configured in `vite.config.ts` via `vite-plugin-pwa`. The app caches the shell and QR generation assets for offline use.

## Lighthouse

Audited at **Performance 95% · Accessibility 77% · Best Practices 96% · SEO 82%**

> Lighthouse scores from a recent audit of the production build.

## Internationalization

QRio ships with English (`en`) and Arabic (`ar`) translations. Language preference is persisted in `localStorage`.

- Toggle language from the navbar button
- Arabic uses RTL layout with the Cairo font
- Translations live in `src/composables/useI18n.ts`

## Project Structure

```
QRio/
├── public/
│   ├── favicon.svg        # App icon
│   ├── icons.svg          # Social/sharing icons
│   ├── icon-{192,512}.png # PWA icons
│   └── logo/
│       └── og-default.png # Open Graph image
├── src/
│   ├── components/        # Vue components
│   │   ├── NavBar.vue
│   │   ├── PreviewPanel.vue
│   │   ├── TabCreate.vue
│   │   ├── TabLibrary.vue
│   │   ├── TabSettings.vue
│   │   └── Toast.vue
│   ├── composables/       # Shared state & logic
│   │   ├── useDB.ts       # IndexedDB persistence
│   │   ├── useI18n.ts     # Internationalization
│   │   ├── useQR.ts       # QR config & generation
│   │   ├── useTheme.ts    # Dark/light theme
│   │   └── useToast.ts    # Toast notifications
│   ├── App.vue
│   ├── main.ts
│   └── style.css          # Global styles & CSS variables
├── dev/
│   └── qr-maker.html      # Early prototype / standalone QR maker
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── opencode.json
```

## License

[MIT](LICENSE) © [Omar Khaled](https://github.com/Omar-Khaled-57)
