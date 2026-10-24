# Architecture

## Principles
1. **Tokens first.** Every color, size, radius and motion value comes from `@meridian/tokens`.
2. **Dependency direction is one way:** `apps/web` -> `features` -> `packages/ui | domain | api-client | i18n` -> `tokens`. Packages never import from apps. Features never import other features.
3. **Domain logic is pure.** Money, news clustering, search, deal rounds live in `@meridian/domain` with unit tests. No React, no fetch.
4. **The API client is the only network layer** and must match `docs/API-CONTRACT.md`. A mock adapter lets the UI run with no backend.
5. **Every screen has designed states:** loading, empty, error, offline.
6. **Mobile first**, with a desktop layout (sidebar) from the start.
7. **EN + FR** from day one: no hard-coded strings.

## Stack
Next.js 15 (App Router) + React 19 + TypeScript strict, pnpm workspaces + Turborepo, next-intl, Vitest, Playwright, CSS Modules on tokens.

## Layout
See `README.md` for the repo map and `ROUTES.md` for the screen-to-route map.

## Route groups
- `(main)`: has navigation (bottom nav on phone, sidebar on desktop) and the mini-player.
- `(focus)`: no navigation. Onboarding, deal, invest, player, live, thread, edit, claim, assistant, intro.

## State
- Server data: fetched via `api-client` (server components first, client cache where interactive).
- Preferences (`prefs`, region lens, currency, data saver): `PrefsProvider`, persisted via `lib/storage.ts` (try/catch).
- Playback: single global `PlayerProvider` (audio + YouTube), survives navigation.
