FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @meridian/api exec prisma generate
RUN pnpm --filter @meridian/api build

FROM base AS run
ENV NODE_ENV=production
COPY --from=build /repo /repo
WORKDIR /repo/apps/api
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
