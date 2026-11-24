# QRio deployment

## Build

```bash
npm run build
```

As defined in [`../package.json`](../package.json), this runs
`tsc && vite build`. The output is a static site in `dist/`, which is ignored
by [`../.gitignore`](../.gitignore). To check the built output locally:

```bash
npm run preview
```

## What ships

| Artifact | Source |
| --- | --- |
| Static HTML/JS/CSS bundle | Vite build from `index.html`, `src/` |
| PWA manifest and service worker | `VitePWA` in [`../vite.config.ts`](../vite.config.ts) |
| Favicon, PWA icons, icons.svg, logo, font | `public/` copied to the build root |
| Generated icon/OG images | [`../scripts/generate-icons.mjs`](../scripts/generate-icons.mjs) (Node/`sharp` helper, not a package script) |

Service worker behavior: `registerType: 'autoUpdate'`, with Workbox precaching
`**/*.{js,css,html,svg,png,ico,woff2}`. A new build replaces the cached shell
automatically on the next load. The local Cairo `.ttf` is not in that glob, so
it is not precached — see [development](./development.md#troubleshooting-grounded-in-the-code).

## Target platforms

The PWA manifest declares `display: 'standalone'` and `orientation: 'portrait'`,
so the app is installable on browsers that support PWAs. This is a static web
target only. There is no Tauri/Electron wrapper, native binary config, or mobile
store setup in this project.

## Deployment configuration present in the repo

There is no `vercel.json`, Netlify config, Dockerfile, CI workflow, or deploy
script anywhere in the project. The only deployment evidence is a local,
gitignored Lighthouse report:

- [`../dev/lighthouse.json`](../dev/lighthouse.json) records an audit of
  `https://q-rio.vercel.app/` using Lighthouse 13.0.2, fetched
  `2026-05-25T08:10:12.288Z`.
- That URL indicates a Vercel-hosted instance was audited. The report does not
  describe how it was deployed, and no hosting configuration is tracked.

The README's Lighthouse section summarizes those scores; see
[changelog](./changelog.md#audit-evidence) for the exact provenance.

## Known gaps

- No CI/CD pipeline or automated deploy.
- No environment-specific builds or variables (the app reads none).
- No documented rollback or versioning strategy. `package.json` stays at
  version `0.0.0` and is marked `private: true`.
- No cache-header or server configuration tracked; hosting behavior beyond the
  audited URL is unknown.

## Sources

- [`../package.json`](../package.json)
- [`../vite.config.ts`](../vite.config.ts)
- [`../.gitignore`](../.gitignore)
- [`../dev/lighthouse.json`](../dev/lighthouse.json)
- [`../scripts/generate-icons.mjs`](../scripts/generate-icons.mjs)
