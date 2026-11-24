# QRio documentation

Start here. QRio is a browser-only Vue 3 app for creating, styling, and saving
QR codes. The [product page](./product.md) explains what it does today, the
[architecture page](./architecture.md) explains how the code fits together, and
the [configuration page](./configuration.md) lists every setting and stored key.

## Documentation index

| Page | What it answers |
| --- | --- |
| [Product](./product.md) | Problem, audience, feature inventory, non-goals and known gaps. |
| [Architecture](./architecture.md) | Stack, entry points, directory map, state and storage flow. |
| [Development](./development.md) | Prerequisites, install, commands, conventions, troubleshooting. |
| [Configuration](./configuration.md) | QR defaults, PWA manifest, localStorage keys, secrets and security notes. |
| [Testing](./testing.md) | What test tooling exists, what is genuinely checked, and what is missing. |
| [Deployment](./deployment.md) | Build output, PWA/hosting evidence, and unconfigured targets. |
| [Changelog](./changelog.md) | Release-history status; the audit evidence behind the README scores. |
| [Visual identity](./visual-identity.md) | Pre-existing brand palette, theme roles, and asset links. |

Additional local material: `../dev/lighthouse.json` is a Lighthouse report and
`../dev/qr-maker.html` is an early standalone prototype. Both sit in `dev/`,
which `../.gitignore` excludes from version control.

## Canonical source-of-truth files

| Concern | File |
| --- | --- |
| Commands, dependencies, version | [`../package.json`](../package.json) |
| PWA manifest and service-worker options | [`../vite.config.ts`](../vite.config.ts) |
| TypeScript compiler settings | [`../tsconfig.json`](../tsconfig.json) |
| QR types, defaults, content builders | [`../src/composables/useQR.ts`](../src/composables/useQR.ts) |
| IndexedDB library schema | [`../src/composables/useDB.ts`](../src/composables/useDB.ts) |
| Translations and language key | [`../src/composables/useI18n.ts`](../src/composables/useI18n.ts) |
| Theme key and system fallback | [`../src/composables/useTheme.ts`](../src/composables/useTheme.ts) |
| Tooling-only provider config | [`../opencode.json`](../opencode.json) |
| Product overview and Lighthouse summary | [`../README.md`](../README.md) |

These pages were written against the hub's [documentation standard](../../docs/DOC-STANDARD.md).
