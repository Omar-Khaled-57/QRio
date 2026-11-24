# QRio testing

## Test tooling

[`../package.json`](../package.json) defines exactly three scripts: `dev`,
`build`, and `preview`. There is **no `test` script**, no test runner dependency
(Vitest, Jest, Playwright, Cypress, and friends are absent), and no test
configuration file.

A search of the repository found no `*.test.*` or `*.spec.*` files, and no
`tests/`, `__tests__/`, or `e2e/` directory. No coverage report is committed.

## What `npm run build` actually checks

```bash
npm run build
```

This runs `tsc && vite build`:

- `tsc` type-checks `src/` using [`../tsconfig.json`](../tsconfig.json)
  (`noEmit`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`). It fails the build on
  type or unused-symbol errors.
- `vite build` bundles the app and generates the PWA service worker/manifest.

This is a compile-and-bundle check, **not a test suite**. It does not exercise
QR encoding, export, persistence, i18n, or the service worker.

## Evidence that exists

- [`../dev/lighthouse.json`](../dev/lighthouse.json) is a Lighthouse 13.0.2
  audit of `https://q-rio.vercel.app/`, fetched
  `2026-05-25T08:10:12.288Z`. It records category scores of performance 0.95,
  accessibility 0.77, best practices 0.96, and SEO 0.82. This is a one-off
  production audit, not a repeatable test, and the `dev/` directory is ignored
  by [`../.gitignore`](../.gitignore).
- [`../scripts/generate-icons.mjs`](../scripts/generate-icons.mjs) generates
  image assets; it contains no assertions.

## Manual checks available from the UI

These are not automated tests, but they describe the flows a reviewer can
exercise after `npm run dev`:

| Flow | What to observe | Code path |
| --- | --- | --- |
| Each of the eight types | The form changes and the preview redraws | `TabCreate.vue` → `buildQrContent()` → `PreviewPanel.vue` |
| PNG export | Downloaded filename uses the label or `qrio-qr`; image includes frame/icon | `downloadPng()` → `exportFullImage()` |
| Copy / print / share | Clipboard image, print iframe, and share links respond | `copyImage()`, `printQR()`, `shareTo()` |
| Save and reopen | A library entry appears and restores the config | `saveToLib()` → `useDB.ts` → `TabLibrary.vue` |
| Backup round-trip | JSON export re-imports without error | `TabSettings.vue` |
| Theme and language | `data-theme` and `<html dir/lang>` change and persist | `useTheme.ts`, `useI18n.ts` |

## Known gaps

- No unit, component, integration, or end-to-end tests.
- No assertions around QR payload construction (`buildQrContent`), which is the
  most correctness-sensitive logic.
- No test of IndexedDB migration from earlier database versions.
- No coverage report and no CI configuration that would run tests.
- The Lighthouse report is a point-in-time snapshot in an ignored directory,
  not a maintained performance budget.

## Sources

- [`../package.json`](../package.json)
- [`../tsconfig.json`](../tsconfig.json)
- [`../dev/lighthouse.json`](../dev/lighthouse.json)
- [`../.gitignore`](../.gitignore)
- [`../src/composables/useQR.ts`](../src/composables/useQR.ts)
- [`../src/components/PreviewPanel.vue`](../src/components/PreviewPanel.vue)
