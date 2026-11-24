# QRio product

QRio is a browser-only tool for making, styling, saving, and exporting QR
codes. It is a Vue 3 single-page app: the QR payload is assembled and rendered
in the browser, and saved codes live in the browser's own IndexedDB. There is
no account, server, or sync service.

## Who it is for

- Someone who needs a QR for a URL, Wi-Fi network, contact card, email, SMS,
  location, plain text, or a payment string without sending that data to a
  third-party generator.
- Someone who wants a branded-looking code (center logo, frame, dot shape)
  and a PNG they can copy, print, or download.
- Arabic and English speakers; the interface flips to RTL when Arabic is
  selected.

## What it does today

| Capability | Evidence |
| --- | --- |
| Eight content types — URL, Wi-Fi, vCard, email, location, text, SMS, payment | `QrType` in [`../src/composables/useQR.ts`](../src/composables/useQR.ts); `qrTypes` in [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue) |
| Multi-field forms that join inputs into newline-separated content | watchers and form fields in [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue), parsed by `buildQrContent` in [`../src/composables/useQR.ts`](../src/composables/useQR.ts) |
| Four module shapes — square, round, diamond, hex | `drawDot()` in [`../src/components/PreviewPanel.vue`](../src/components/PreviewPanel.vue) |
| Five frame presets plus no frame | `FRAMES` in [`../src/composables/useQR.ts`](../src/composables/useQR.ts); `frames` in [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue) |
| Center icon: built-in QRio mark, 11 emoji presets, or an uploaded image | `iconPresets` and upload handling in [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue); overlay drawing in [`../src/components/PreviewPanel.vue`](../src/components/PreviewPanel.vue) |
| Live preview and PNG export at 512 / 1024 / 2048 px | `renderQR()`, `renderQRAtSize()`, `exportFullImage()`, `downloadPng()` in [`../src/components/PreviewPanel.vue`](../src/components/PreviewPanel.vue) |
| Copy image to clipboard, print via an off-screen iframe, copy content/share links | `copyImage()`, `printQR()`, `shareLink()`, `shareTo()` in [`../src/components/PreviewPanel.vue`](../src/components/PreviewPanel.vue) |
| Save, browse, reopen, and delete QR codes | [`../src/composables/useDB.ts`](../src/composables/useDB.ts) and [`../src/components/TabLibrary.vue`](../src/components/TabLibrary.vue) |
| Export/import the whole library as JSON, clear it | `handleExport`, `handleImport`, `handleClear` in [`../src/components/TabSettings.vue`](../src/components/TabSettings.vue) |
| Optional save on page unload | `beforeunload` handler gated by `autoSave` in [`../src/App.vue`](../src/App.vue) |
| Light/dark theme and English/Arabic with RTL | [`../src/composables/useTheme.ts`](../src/composables/useTheme.ts) and [`../src/composables/useI18n.ts`](../src/composables/useI18n.ts) |
| Installable PWA with offline shell caching | `VitePWA` block in [`../vite.config.ts`](../vite.config.ts) |

## Non-goals and known gaps

- **No SVG/vector export.** The only generated image format is PNG via
  `canvas.toDataURL('image/png')` in
  [`../src/components/PreviewPanel.vue`](../src/components/PreviewPanel.vue).
  The README's earlier SVG claim has been corrected.
- **No color or gradient controls in the UI.** `QRConfig` models background,
  dot, and frame colors plus gradient flags, but
  [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue) exposes
  only label, type, content, icon, frame, and advanced options. Only
  `qrGradient` is read by the renderer; `bgColor2`, `frameColor2`,
  `bgGradient`, and `frameGradient` are unused in application code. The i18n
  table contains colour keys that no component currently renders.
- **One external font request.** [`../index.html`](../index.html) loads Nunito
  from Google Fonts. QR content and the library stay on the device, but the
  page itself contacts `fonts.googleapis.com`. Cairo is served from a local
  font file declared in [`../src/style.css`](../src/style.css).
- **`saveExport()` is a no-op placeholder** in
  [`../src/composables/useDB.ts`](../src/composables/useDB.ts); PNG download
  calls it, but it stores nothing. Auto-save is implemented separately through
  `beforeunload` in `App.vue`.
- **No accounts, sync, or backend API.** All persistence is browser-local.
- **No automated test suite.** See [testing](./testing.md).
- **`dev/` is local-only.** It holds a Lighthouse report and an early prototype
  but is excluded by [`../.gitignore`](../.gitignore).

## Sources

- [`../README.md`](../README.md)
- [`../package.json`](../package.json)
- [`../src/composables/useQR.ts`](../src/composables/useQR.ts)
- [`../src/composables/useDB.ts`](../src/composables/useDB.ts)
- [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue)
- [`../src/components/PreviewPanel.vue`](../src/components/PreviewPanel.vue)
- [`../src/components/TabLibrary.vue`](../src/components/TabLibrary.vue)
- [`../src/components/TabSettings.vue`](../src/components/TabSettings.vue)
- [`../vite.config.ts`](../vite.config.ts)
