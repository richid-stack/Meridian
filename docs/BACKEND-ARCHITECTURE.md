# Backend architecture

## Stack
NestJS 11 on Fastify, TypeScript strict. PostgreSQL 16 via Prisma. Redis + BullMQ for cache, rate limits and jobs. S3-compatible object storage for uploads. OpenAPI generated at `/docs`.

## Principles
1. **Contract first.** Shapes live in `packages/contracts` (zod). API validates with them, `api-client` and web import them. One source of truth.
2. **Modular monolith.** One deployable, one module per domain under `src/modules`. Modules talk through exported services, never through each other's tables.
3. **Ports and adapters.** Anything external (payments, KYC, AI, search, mail, push, storage) sits behind a port in `src/infra`, with a sandbox adapter for dev and tests.
4. **Money is exact.** Decimal columns, integer minor units on the wire, an append-only ledger, idempotency keys on every money-moving call.
5. **Jobs are idempotent.** Every BullMQ processor can run twice safely, retries with backoff, has a dead-letter queue.
6. **Security by default.** Global auth guard (opt out with `@Public()`), RBAC, rate limiting, helmet, input validation on every route, audit log for sensitive actions.
7. **Observable.** Structured logs (pino, secrets redacted), `/health`, `/ready`, metrics, tracing.

## Modules
auth, users, entities (people and companies), claims, corrections, feed, markets, news, deals, investments, portfolio, watchlist, messaging, notifications, community, groups, live, media, uploads, search, assistant, moderation, admin, health.

## Request flow
Client -> Fastify -> throttler -> JWT guard -> roles guard -> zod pipe -> controller -> service -> Prisma / ports -> response (contract shape).

## Environments
local (docker compose), staging, production. Config validated at boot (`env.schema.ts`); the app refuses to start on bad config.
