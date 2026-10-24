# Migration plan (prototype -> production)

Order matters: foundations, then shared pieces, then screens by user value.

| Step | Work | Prototype source |
|---|---|---|
| 0 | Skeleton (this commit), CI green | n/a |
| 1 | Tokens, fonts, theme, `ui` primitives (Button, Pill, Rule, Field, Skeleton, states) | design system page |
| 2 | Shell: layouts, nav, i18n, Prefs provider | `shell_new.js`, p8 `Prefs` |
| 3 | `domain`: money, news cluster, search | p8, p7 |
| 4 | `api-client` + mocks from the M6 contract | M6 contract |
| 5 | Home, Explore, News, Story | screens/home, explore, p7 |
| 6 | Capital, Deal, Invest, Portfolio, Watchlist, Compare | p1, p4 |
| 7 | People, Companies, Claim, Intro, Account | p3, p8 |
| 8 | Community, Groups, Compose, Uploads, Messaging | p2, p3, p5 |
| 9 | Media: player, mini-player, live, reading | p2, p6 |
| 10 | Assistant, search, notifications | p4, p8, p1 |
| 11 | Desktop layout, a11y audit, performance, FR translation | n/a |
| 12 | Port e2e suites from Python to Playwright TS | prototype/tests |

The prototype stays in `prototype/` as the visual and behavioral reference until step 12 passes.
