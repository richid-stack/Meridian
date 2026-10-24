# Routes (prototype view -> Next.js route)

All routes live under `/{locale}` (`en`, `fr`).

| Prototype view | Route | Group |
|---|---|---|
| `v-home` | `/` | main |
| `v-explore` | `/explore` | main |
| `v-news` | `/news` | main |
| `v-story` | `/news/[storyId]` | main |
| `v-article` | `/articles/[slug]` | main |
| `v-book` | `/books/[bookId]` | main |
| `v-community` | `/community` | main |
| `v-group` | `/groups/[groupId]` | main |
| `v-capital` | `/capital` | main |
| `v-portfolio` | `/portfolio` | main |
| `v-watch` | `/watchlist` | main |
| `v-compare` | `/compare` | main |
| `v-profile / v-gperson` | `/people/[personId]` | main |
| `v-company / v-gorg` | `/companies/[companyId]` | main |
| `v-founder` | `/you/founder` | main |
| `v-you` | `/you` | main |
| `v-prefs` | `/you/preferences` | main |
| `v-msgs` | `/messages` | main |
| `v-notifs` | `/notifications` | main |
| `v-compose` | `/compose` | main |
| `v-onboarding` | `/welcome` | focus |
| `v-deal` | `/capital/deals/[dealId]` | focus |
| `v-invest` | `/capital/deals/[dealId]/invest` | focus |
| `v-player` | `/episodes/[episodeId]` | focus |
| `v-live` | `/live/[roomId]` | focus |
| `v-thread` | `/messages/[threadId]` | focus |
| `v-intro` | `/people/[personId]/intro` | focus |
| `v-edit` | `/you/edit` | focus |
| `v-claim` | `/claim/[entityId]` | focus |
| `v-ai` | `/assistant` | focus |
