# @meridian/api

NestJS (Fastify) + Prisma + PostgreSQL + Redis/BullMQ. See `docs/BACKEND-ARCHITECTURE.md`.

```
docker compose up -d
cp apps/api/.env.example apps/api/.env
pnpm --filter @meridian/api db:migrate
pnpm --filter @meridian/api dev   # http://localhost:4000/docs
```
