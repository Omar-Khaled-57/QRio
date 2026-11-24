# QRio configuration

## Environment variables

The application source reads no environment variables. A search of the
TypeScript/Vue sources and config files found no `import.meta.env`, `VITE_*`, or
`process.env` usage. There is no `.env` file and nothing to supply for a normal
build or run.

## Configuration files

| File | What it controls |
| --- | --- |
| [`../package.json`](../package.json) | Three scripts (`dev`, `build`, `preview`), dependencies, author, `type: module` |
| [`../tsconfig.json`](../tsconfig.json) | `es2023` target, DOM library, bundler resolution, `noEmit`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` |
| [`../src/env.d.ts`](../src/env.d.ts) | Vite client types plus Vue SFC and `qrcode` module declarations |
| [`../vite.config.ts`](../vite.config.ts) | Vue plugin, PWA manifest, service worker update strategy, Workbox precache patterns |
| [`../index.html`](../index.html) | Page metadata, theme color, favicon, Google Fonts link, mount point |
| [`../opencode.json`](../opencode.json) | OpenRouter provider settings for the local coding tool only; not loaded by the app |

## QR configuration defaults

`defaultConfig()` in [`../src/composables/useQR.ts`](../src/composables/useQR.ts)
is the single source of truth. The live `config` ref starts from these values.

| Field | Default | Notes |
| --- | --- | --- |
| `type` | `'url'` | One of `url`, `wifi`, `vcard`, `email`, `location`, `text`, `sms`, `payment` |
| `content` | `''` | Multi-field types store newline-separated raw fields |
| `label` | `''` | Optional display label; also the default filename stem for PNG downloads |
| `icon` | `'__logo__'` | Emoji string, `'__logo__'`, or `null` |
| `iconImage` | `null` | Uploaded image as a base64 data URL |
| `iconSize` | `40` | Pixels; UI offers 24, 32, 40, 48, 56 |
| `frame` | `'none'` | `none`, `scan-me`, `coffee`, `badge`, `menu`, `social` |
| `bgColor` | `'#ffffff'` | Used by both preview and export unless `transparent` is set |
| `bgColor2` | `null` | Gradient end color; **unused** in application code |
| `bgGradient` | `false` | **Unused** in application code |
| `qrColor` | `'#1a2e3b'` | Dot color used by preview and export |
| `qrColor2` | `null` | Gradient end color; read only by `qrGradient` paths in `PreviewPanel.vue` |
| `qrGradient` | `false` | Honored by the canvas renderer, but no UI control sets it |
| `frameColor` | `'#3DC97A'` | Declared in the config; frame banners use preset colors instead |
| `frameColor2` | `null` | **Unused** in application code |
| `frameGradient` | `false` | **Unused** in application code |
| `ecc` | `'Q'` | UI offers L (7%), M (15%), Q (25%), H (30%) |
| `exportSize` | `1024` | UI offers 512, 1024, 2048 |
| `dotStyle` | `'square'` | `square`, `round`, `diamond`, `hex` |
| `transparent` | `false` | Skips background fill in preview and export |
| `quietZone` | `true` | Preview-only 16 px padding; export always uses a 2-module padding |
| `autoSave` | `false` | When true, `App.vue` saves the config on `beforeunload` |

## PWA settings

From the `VitePWA` block in [`../vite.config.ts`](../vite.config.ts):

| Setting | Value |
| --- | --- |
| `registerType` | `'autoUpdate'` |
| `manifest.name` | `QRio – QR Maker` |
| `manifest.short_name` | `QRio` |
| `manifest.description` | Create beautiful, customizable QR codes |
| `manifest.theme_color` | `#3DC97A` |
| `manifest.background_color` | `#f2f8f5` |
| `manifest.display` | `standalone` |
| `manifest.orientation` | `portrait` |
| `manifest.icons` | `/icon-192.png` (192×192), `/icon-512.png` (512×512) |
| `workbox.globPatterns` | `**/*.{js,css,html,svg,png,ico,woff2}` |

The HTML also sets `<meta name="theme-color" content="#3DC97A">` and Open
Graph/Twitter image metadata pointing at `/logo/og-default.png`.

## localStorage keys

| Key | Written by | Value |
| --- | --- | --- |
| `qrio_lang` | [`../src/composables/useI18n.ts`](../src/composables/useI18n.ts) | `'en'` or `'ar'`; defaults to `'en'` |
| `qrio_theme` | [`../src/composables/useTheme.ts`](../src/composables/useTheme.ts) | `'light'` or `'dark'`; falls back to `prefers-color-scheme` when absent |
| `qrio-uploaded-icons` | [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue) | JSON array of up to 10 base64 data URLs |

## IndexedDB schema

[`../src/composables/useDB.ts`](../src/composables/useDB.ts) opens database
`qrio` at version 2. Its single store `library` has key path `id` with
`autoIncrement`. Records are `{ id?, label, type, config, ts }`, where `config`
is the JSON-stringified `QRConfig` and `ts` is a locale-formatted date string.

## User-facing settings

From [`../src/components/TabSettings.vue`](../src/components/TabSettings.vue):

- **Auto-save to Library** → `config.autoSave`
- **Transparent Background** → `config.transparent`
- **Include Quiet Zone** → `config.quietZone`
- **Local Storage** panel: saved count, Clear All, Export Library, Import Library

From [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue):
label, type, content fields, icon preset/upload/size, frame, error correction,
export size, dot style. Uploaded icons must be under 2 MB and there is a maximum
of 10.

## Security notes

- There are **no runtime secrets**. QR content and saved codes never leave the
  browser through application code.
- [`../opencode.json`](../opencode.json) contains `YOUR_OPENROUTER_API_KEY`, a
  placeholder for the local coding tool. It is not referenced by `src/` and
  should never be replaced with a real key in a committed file.
- [`../index.html`](../index.html) loads Nunito from Google Fonts, so the page
  makes a third-party request even though QR data is local.
- The README's "no servers, no tracking" claim applies to QR data and storage;
  it does not cover the font request. See [product](./product.md#non-goals-and-known-gaps).

## Sources

- [`../src/composables/useQR.ts`](../src/composables/useQR.ts)
- [`../src/composables/useI18n.ts`](../src/composables/useI18n.ts)
- [`../src/composables/useTheme.ts`](../src/composables/useTheme.ts)
- [`../src/composables/useDB.ts`](../src/composables/useDB.ts)
- [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue)
- [`../src/components/TabSettings.vue`](../src/components/TabSettings.vue)
- [`../vite.config.ts`](../vite.config.ts)
- [`../index.html`](../index.html)
- [`../opencode.json`](../opencode.json)
