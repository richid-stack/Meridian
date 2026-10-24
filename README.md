# Meridian

Business, everywhere. A mobile-first platform for markets, news, people, community and investing, with Africa as the default lens.

## Repo map
| Path | What it is |
|---|---|
| `apps/web` | The product: Next.js (App Router) + TypeScript |
| `packages/tokens` | Design tokens (colors, type, spacing), light + dark |
| `packages/ui` | Component library built from tokens |
| `packages/domain` | Pure logic: money, news clustering, search, entities |
| `packages/api-client` | Typed API client matching the backend contract |
| `packages/i18n` | English + French messages |
| `packages/config` | Shared ESLint and TypeScript presets |
| `e2e` | Playwright end-to-end tests |
| `docs` | Architecture, routes, design system, contract, ADRs |
| `prototype` | The original single-file app (reference only, frozen) |

## Start
```
corepack enable
pnpm install
pnpm dev
```
Read `docs/ARCHITECTURE.md` first, then `docs/MIGRATION-PLAN.md`.
