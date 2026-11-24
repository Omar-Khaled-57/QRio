# QRio changelog

## Release-history status

QRio has **no `CHANGELOG.md`** and no release notes in the repository. There
are no git tags available to summarize here, and `package.json` pins the
version at `0.0.0` with `private: true`. Consequently, no release dates,
feature-by-release lists, or semver history can be reported without inventing
them.

## What the repo does record

| Evidence | Detail |
| --- | --- |
| [`../README.md`](../README.md) | Product overview, feature table, stack, usage, and the Lighthouse score summary |
| [`../package.json`](../package.json) | Current dependency set and the three available scripts |
| [`../docs/visual-identity.md`](./visual-identity.md) | Brand palette and theme roles, maintained alongside the docs |
| [`../src/composables/useQR.ts`](../src/composables/useQR.ts) | Current QR types, defaults, frame presets, and content builders |
| [`../opencode.json`](../opencode.json) | Tooling provider config with a placeholder key; not a release artifact |

## Audit evidence

[`../dev/lighthouse.json`](../dev/lighthouse.json) is the only dated snapshot
in the project:

- Lighthouse version: `13.0.2`
- Audited URL: `https://q-rio.vercel.app/`
- Fetch time: `2026-05-25T08:10:12.288Z`
- Category scores: Performance `0.95`, Accessibility `0.77`, Best Practices
  `0.96`, SEO `0.82`

These numbers are reproduced in the README. They come from a single audit and
are not a release history or a tracked performance budget. The `dev/` folder is
excluded by [`../.gitignore`](../.gitignore), so this file is local evidence.

## Known gaps

- No changelog, release notes, or tagged versions.
- No commit history summary should be inferred from the audit timestamp.
- The PWA uses `registerType: 'autoUpdate'` in
  [`../vite.config.ts`](../vite.config.ts), so users receive new builds
  silently; there is no in-app "what's new" surface.

## Sources

- [`../README.md`](../README.md)
- [`../package.json`](../package.json)
- [`../dev/lighthouse.json`](../dev/lighthouse.json)
- [`../.gitignore`](../.gitignore)
- [`../vite.config.ts`](../vite.config.ts)
