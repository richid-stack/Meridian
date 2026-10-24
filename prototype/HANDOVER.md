# Meridian handover

Read this first in a new chat. It holds everything needed to continue without the old conversation.

## 1. What this is
Meridian is a mobile-first "business, everywhere" platform: Bloomberg-style data, Forbes-style editorial, Wikipedia-style profiles, and an X-style community, plus community investing in startups and an AI assistant. Content covers industry players worldwide. The real users are in Africa, so the default lens is Africa. "Meridian" is a working name.

Owner: Rich (founder, Ghana). He drives product, design, and frontend with AI as a build partner. A technical co-founder handles backend. **Right now only the frontend is in scope.**

## 2. How Rich wants to work
- High design bar: "industry level", pixel perfect, not AI-looking, billion-dollar feel. Push back on generic or unfinished output.
- Terse messages. Expect proactive diagnosis and fixes instead of clarifying questions.
- **Verify every design build with Playwright screenshots before delivering.** If it is not up to standard, fix it.
- Phone-first. He is on the Claude mobile app, so keep replies short.
- Chats got very long and hit usage limits fast. Work one milestone per chat, avoid viewing many screenshots, and keep replies short.

## 3. Status
Done and published (single file app, 30 views):
- Phase 1: Capital landing, data-driven deal rooms (3 rounds), notifications, loading, empty, and error states.
- Phase 2: book pages, article reader, podcast player, live room, groups.
- Phase 3: messages, intro requests, profile editing, claim flow, founder dashboard.
- Phase 4: investment flow (sample payments), portfolio, watchlist, compare, AI assistant (canned answers).
- M1 images: illustration engine, lightbox, avatar enhancer, galleries.
- M2 uploads: profile photo and cover cropper, composer photos, video, voice notes (record or file), PDF, alt text.
- M3 playback: real audio engine, YouTube facade and IFrame adapter, interview pages with chapters and transcript, mini-player, Media Session, composer link cards.
- M4 news: two sample feeds with converters, clustering, News page, story page, Africa lens notes, translation, share to community.
- M5 global: region lens, display currency, global people and companies, sourced profiles, real typo-tolerant search.
- M6 handoff contract: Claude Doc "Meridian backend handoff contract" (v0.2, 10 Oct 2026): https://claude.ai/artifact/4evoqz4KJDzQAKT6aijpHv . Derived from the adapters, plus feed, Home, onboarding, markets and crop aspects. Still untraced: feed ranking, Explore data beyond Home, group and live-room internals (its section 11). Waiting on the co-founder's answers to its section 12.

**Next, in order:**
1. **Phase 5, production frontend**: move to a real project (React or Next.js, TypeScript), component library from the design tokens, desktop layout, French and English, accessibility audit, performance, real API clients.
2. Smaller leftovers: data saver mode, a dedicated onboarding step for region and currency (it is currently appended to the interests step), desktop widths, skeleton states on every view.

## 4. Restore and run
```
unzip meridian.zip -d /home/claude          # gives /home/claude/meridian
cd /home/claude/meridian/build && python3 build.py   # writes ../dist/meridian-app.html
cd ../tests && python3 make_fixtures.py     # once; needs pillow and ffmpeg
python3 g_test.py                           # any *_test.py; needs playwright + chromium
```
`dist/meridian-app.html` is the shipped single file. A rebuild is byte-identical to the published one. To publish: use the Artifact tool with `file_path` on the output file (copy it to `/mnt/user-data/outputs/` first). Published app link at handover: https://claude.ai/artifact/8b6gK7ArTNAbj76idprsev. Design system page: https://claude.ai/artifact/NsradNcdJTrHimXbkTNRZA.

Sandbox has no internet, so fonts fall back and remote images and embeds cannot load. The published preview blocks outside images, embeds, and requests too (see limitations).

## 5. Architecture (important)
`build.py` assembles one HTML file from:
- `screens/meridian-*.html`: the original standalone screens (onboarding, home, explore, community, capital = deal room template, profile, company, you, compose, system). The build extracts each screen's CSS, body, and script, then:
  - scopes every CSS rule under `#v-<name>` (global rules dropped), also cloning profile CSS to `#v-gperson` and company CSS to `#v-gorg`;
  - converts `id="x"` to `data-i="x"` and rewrites `document.getElementById/querySelector` calls to a per-view root `R`;
  - wraps each script in an IIFE.
- `build/p1..p8`: modules added later (`.js`, `.css`, `.html` each). Source edits for those live in the p-files, not in the screens. The build also applies string patches to screen bodies (look in `build.py` for `if n=='home'` and similar).
- `build/shell_new.js`: the router and global click delegation.

Router (`shell_new.js`): `App.tab(v)`, `App.push(v)`, `App.back()`. A view shows when `#v-<name>` has class `on`. `window.onView(v)` is chained by each module to render on show. Bottom nav hides on: onboarding, deal, player, live, thread, edit, claim, invest, ai. Routing by data attributes (handled before view-specific rules): `data-ent`, `data-story`, `data-deal`, `data-tab`, `data-book`, `data-ep`, `data-group`, `data-thread`, `data-intro`, `data-view`, `data-ask`.

Module map:
| File | Owns |
|---|---|
| p1 | Capital landing, deal rooms (`Deals`), notifications, skeleton/empty/error state helpers |
| p2 | books, article, live room, groups |
| p3 | messages, threads, intro sheet, edit profile, claim, founder dashboard (`PPL`, `ME`) |
| p4 | invest flow, portfolio, watchlist, compare, AI assistant (`Port`, `W`, `answer()`) |
| p5 | `Art` illustrations, `Media` (render, enhancer for avatars), lightbox, `Up` upload pipeline, cropper, `Tray` composer attachments, recorder |
| p6 | `Episodes`, `Sources`, playback engine, Media Session, mini-player, YouTube loader and `ytCard`, transcript |
| p7 | news `Providers`, `normA/normB`, `cluster`, `Repo`, News and story pages, `storyEmbed` |
| p8 | `Prefs`, `Money`, markets strip, `ENT` people and companies and their pages, search (`MSearch`), onboarding extras |

Globals you will use: `App`, `window.onView`, `toast`, `Art.uri`, `Media`, `Tray`, `Prefs`, `Money`, `Entities`, `Episodes`, `Deals`, `News`, `Playback`, `MSearch`, `openEntity/openDeal/openStory/openEp/openBook/openGroup/openLive/openThread/openIntro/openArticle/openCompose/startInvest/askAI/syncPort`.

localStorage keys: `prefs`, `news:saved`, `news:topic`, `mp:<episodeId>` (resume), `mp:rate`. Uploads live only in memory.

Gotchas learned the hard way:
- Inside module code, `document.querySelector(...)` in a screen script is rewritten to the view root. To reach another view from a screen-derived script (compose), write `document['querySelector'](...)`.
- Use `hidden` plus an explicit `[hidden]{display:none}` rule when the element has its own `display`.
- `App.push(v)` ignores the current view; re-render in place instead (see `openEntity`).
- Duplicate class names across views are safe because CSS is scoped, but p-module CSS written by hand must be scoped by hand.

## 6. Design system
Tokens (light / dark): bg `#F1F4F2` / `#08120F`, surface `#FAFBFA` / `#0D1A16`, ink `#0E1A16` / `#E8EEEA`, mute `#55635D` / `#93A29B`, rule `#D3DAD6` / `#21312B`, accent `#8F6708` / `#E3B341`, panel `#0B2A21` / `#0F3A2D`, gold `#E3B341`, risk `#A4432B` / `#E8836B`.
Fonts: Newsreader (reading, headlines), Instrument Sans (UI), JetBrains Mono (numbers, tabular). Radius: 4 portraits, 12 fields, 14 panels, full for pills. 4pt spacing, 20px page margin.
Rules: sentence case labels, rules not cards (one bordered card for the key action per screen), one accent, honest risk beside every investment screen, real content never lorem ipsum, source and AI labels next to AI text, every state designed (loading, empty, error, offline), 44px tap targets, `prefers-reduced-motion` respected, dark mode for every screen.

## 7. Sample data (all fictional)
People: Ama Boateng, Nia Mensah, Kunle Okafor, Tunde Dlamini, Fatou Keita, Priya Raman, Mateo Alvarez, Sofia Lindqvist. Companies: Kora Freight, Aya Health, Zuri Energy, Helix Semiconductors, Aurora Retail Group, Lumen Grid. News outlets are fictional. Real people and companies must only come from sourced data (Wikidata and filings) with citations and a corrections process.

## 8. Tests
`tests/*_test.py` drive Chromium with Playwright and print results. `pb_test.py` ends with one expected message (`onStateChange is not a function`) caused by its fake YouTube API; everything else should print `ERRORS []`. Suites: p1 (Capital, notifications), p2 (content), p3 (people), p4 (invest, AI), m (composer media), m2 (profile photo), pb (playback), n (news), g (global). Screens are checked at 390 and 360 px, light and dark.

## 9. Known limitations (be honest about these)
- The published preview blocks remote images, embeds, and network requests. Real news photos, YouTube playback, and live APIs only work after the production deployment. The YouTube path is tested against a fake API; the sample video id `aqz-KE-bpKQ` is unverified and must be replaced.
- Local video and audio preview inside the hosted preview is unverified (tested in local Chromium).
- No backend: payments, auth, uploads, messaging, notifications, moderation, and AI are simulated. Investing needs a licensed partner and legal setup.
- Audio is synthesized tone audio with shortened sample durations. FX rates are sample rates. AI answers, translations, and "why it matters" notes are canned.
- Interface is English only. No desktop layout yet.

## 10. Start prompt for the new chat
> I am continuing a project called Meridian. Unzip the attached meridian.zip into /home/claude, read /home/claude/meridian/HANDOVER.md fully, rebuild with build.py to confirm it works, then do the next milestone: Phase 5 (production frontend). Start by reading the M6 contract so API clients match it. Keep replies short and verify any design work with Playwright screenshots, but only view the few screenshots you really need.

Tip: put the zip and this file into a Claude Project so every new chat starts with them.
