# QRio development

## Prerequisites

The README specifies Node.js ≥ 18 and npm ≥ 9. `package.json` has no `engines`
field, so those are documented expectations rather than an enforced constraint.

## Install and run

```bash
npm install
npm run dev
```

The dev server address is whatever Vite prints (the README cites
`http://localhost:5173`; `vite.config.ts` does not set an explicit port).

## Command reference

Commands are taken verbatim from the `scripts` block of
[`../package.json`](../package.json).

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `vite` | Starts the Vite dev server |
| `build` | `tsc && vite build` | Type-checks with `tsc` (per `tsconfig.json`, `noEmit`), then builds into `dist/` |
| `preview` | `vite preview` | Serves the built output locally |

`npm install` is the install command documented in [`../README.md`](../README.md).
There is no `test`, `lint`, or `format` script.

## Repository structure

```
src/components/   Vue single-file components (template + script setup + scoped CSS)
src/composables/  Shared reactive state and side-effect helpers
src/App.vue       Tab shell, language application, auto-save on unload
src/main.ts       createApp(...).mount('#app')
src/style.css     Global tokens, theme overrides, font-face
public/           Static assets copied verbatim into the build
scripts/          generate-icons.mjs — sharp helper for PWA/OG images (no package script)
docs/             This standard documentation set plus visual-identity.md
dev/              Local-only prototype and Lighthouse JSON, excluded by .gitignore
```

## Conventions

- Components use `<script setup lang="ts">` and are imported explicitly in
  `App.vue` or their parent. The app does not use a router; `App.vue` switches
  tabs through a local `ref`.
- Shared state lives in module-level refs in `src/composables`, notably the
  `config` singleton in `useQR.ts`. Components mutate that same object rather
  than passing a config prop tree.
- UI text goes through `t('key')` from `useI18n.ts`. Keys must be added to both
  `en` and `ar` tables; missing keys return the key itself.
- Styling uses CSS custom properties from `style.css` and logical properties
  (`inset-inline-*`, `margin-inline-*`) so RTL works without mirrored rules.
- Dark mode is driven by `data-theme` on `<body>`; several components include a
  `[data-theme="dark"]` override in their scoped styles.
- Saved records are JSON strings, not structured objects; `TabLibrary.vue`
  merges a parsed record over the current `config`.

## How to add a feature

- **New QR content type:** extend `QrType` and `buildQrContent()` in
  `useQR.ts`, add an entry to `qrTypes` and a form branch in `TabCreate.vue`,
  and add `p-<id>` keys to both language tables in `useI18n.ts`.
- **New frame:** add a key to `FrameKey` and `FRAMES` in `useQR.ts`, a visual
  entry to `frames` in `TabCreate.vue`, and an `f-<key>` translation in both
  languages.
- **New center icon preset:** add it to `iconPresets` in `TabCreate.vue`; the
  preview renders any non-`__logo__` string as an emoji glyph.
- **New user preference:** add the field and default to `QRConfig`/`defaultConfig()`
  in `useQR.ts`, expose a toggle in `TabSettings.vue`, and add `ts-<key>` and
  `ts-<key>-s` translations.

## Troubleshooting grounded in the code

- **Saved QRs disappear between machines.** The library is IndexedDB on one
  browser profile only. Use `Export Library` / `Import Library` in Settings to
  move the JSON file.
- **Uploaded icon rejected.** `TabCreate.vue` limits uploads to files under
  2 MB and at most 10 custom icons; both cases surface a toast.
- **Language or theme not retained.** Both are written to `localStorage`
  (`qrio_lang`, `qrio_theme`). Clearing site data resets them. If no theme is
  stored, `useTheme.ts` falls back to `prefers-color-scheme`.
- **Offline Arabic font missing.** The Workbox `globPatterns` in
  `vite.config.ts` lists `woff2` but not `ttf`, while `style.css` loads a local
  `.ttf` for Cairo. The font file can therefore be absent from the precache.
- **Local reports not visible in git.** `dev/` is ignored by
  [`../.gitignore`](../.gitignore); the Lighthouse report and prototype there
  are local artifacts.
- **Asset regeneration.** [`../scripts/generate-icons.mjs`](../scripts/generate-icons.mjs)
  is a standalone Node/`sharp` helper that writes `public/icon-192.png`,
  `public/icon-512.png`, and `public/logo/og-default.png`. It is not wired into
  any `package.json` script.

## Sources

- [`../README.md`](../README.md)
- [`../package.json`](../package.json)
- [`../tsconfig.json`](../tsconfig.json)
- [`../vite.config.ts`](../vite.config.ts)
- [`../src/App.vue`](../src/App.vue)
- [`../src/composables/useQR.ts`](../src/composables/useQR.ts)
- [`../src/composables/useI18n.ts`](../src/composables/useI18n.ts)
- [`../src/components/TabCreate.vue`](../src/components/TabCreate.vue)
- [`../scripts/generate-icons.mjs`](../scripts/generate-icons.mjs)
