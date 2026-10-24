# Contributing

1. One milestone per branch, small PRs.
2. A screen is done only when it has: loading, empty, error and offline states; dark mode; 44px tap targets; EN and FR strings; keyboard and screen reader checked.
3. No hard-coded colors, sizes or strings. Use tokens and `@meridian/i18n`.
4. Features import from `packages/*` and their own folder only. Features never import from other features (use `shared/` or a package).
5. Commit style: `feat(capital): add deal room timeline`.
