# Layers (layers.to) — inspiration gallery
> Live UI/UX shot metadata + community color palettes from a Dribbble-alternative; visual reference and palette seeds, never code.

## At a glance
- **What**: Design community (Remix SPA) with an undocumented but fully working REST API at `https://layers.to/api/v1/*`. Shots (title, description, image URL, author), a 30-tag taxonomy with popularity counts, and 5–6-color community palettes. No components, no tokens, no code — descriptions and palettes are the reusable signal.
- **License**: NO open-source license. Per its T&C (§2.4/§3.2, verified 2026-08): uploaders retain full IP; third parties get view/comment rights only. Shot images are copyrighted third-party work — visual reference ONLY, never copy/embed/redistribute in a deliverable, no commercial reuse. Raw hex palette values are not copyrightable and ARE reusable. Vendoring here is metadata-only by design (no images stored).
- **Vendored** (`vendor/layers/`, 3 files):
  - `vendor/layers/tags.json` — 30 tag slugs + per-tag shot counts (2.4 KB; safe to read whole)
  - `vendor/layers/shots.jsonl` — 1000 recent shots, one JSON/line: `{id,title,description,imageUrl,user,createdAt}` (~395 KB; grep only)
  - `vendor/layers/palettes.json` — 100 palettes with hex + RGB ints (137 KB; jq/grep only)
- **Index**: `vendor/_index/palettes.tsv` (100 rows: `palette_id<TAB>hex_colors`) and `vendor/_index/inspiration.tsv` (1000 rows with `origin=layers` out of 1504; cols: origin, format, category, title, description, source_url). Example:
  `grep -i 'dashboard' vendor/_index/inspiration.tsv | awk -F'\t' '$1=="layers"'` → 106 hits.
- **Project deps**: none. Zero-install source — pure HTTP/JSON; nothing is ever imported into the target project.

## When to use / when NOT
Use for:
- Design-direction language: shot `description` fields read like rationale (type choices, color constraints, layout logic) — grep them for the domain you're building ("fintech", "onboarding", "pricing").
- Palette seeds: 100 ready 5–6-color hex palettes — the only data here that may go straight into a deliverable.
- Trend snapshot / visual references by topic: surface `imageUrl`s for a human to look at; cite `https://layers.to/layers/{id}` permalinks.
- Vocabulary calibration: community-weighted tag counts (ui 37567, dashboard 7765, saas 6762, dark-mode 2304).

Do NOT use for:
- Copyable component code → `magicui`, `kokonutui`, `reactbits`, `motion-primitives` (see `vendor/_index/components.tsv`).
- Icons → `phosphor`. Animation/motion code → `animista`, `gsap`, `motion`. Animated backgrounds → `vanta`, `shadergradient`.
- Anything production-dependent on the live API: it is undocumented, unversioned, Referer-gated, with already-broken endpoints. Harvest, don't integrate.
- "Layers Kit" (`layers.to/kit/*`): vaporware — `@layerskit` npm scope is empty, docs render `npm install @layerskit/undefined`. Ignore entirely.

## How to consume (token discipline)
NEVER fully read `vendor/layers/shots.jsonl` (395 KB) or `vendor/layers/palettes.json` (137 KB) — grep/jq them. `tags.json` is small enough to read whole.
1. Find the vocabulary (only if you need topic slugs for a live query):
   `jq -r '.data[] | "\(.name)\t\(._count.layers)"' vendor/layers/tags.json`
2. Grep vendored shots for the topic; extract only title/user/imageUrl:
   `grep -i 'fintech' vendor/layers/shots.jsonl | head -5 | jq -r '[.title,.user,.imageUrl] | @tsv'`
   (Get the permalink id the same way: add `.id` → `https://layers.to/layers/{id}`.)
3. Pick a palette from the index, then expand only that one:
   `grep -c ',' vendor/_index/palettes.tsv` / eyeball rows, then
   `jq -r '.palettes[] | select(.id=="cmbhztcmh000al80cd86lbtbu") | [.colors[].hex] | join(",")' vendor/layers/palettes.json`
   → `#32aad5,#541424,#ace4dc,#9c7464,#2c5f56,#d8bebd`
4. Read the winning shots' `description` fields for rationale; pass `imageUrl` through to the user — do NOT fetch multi-MB images (records up to 6400×4800, 2 MB+; some are `.mp4` motion shots) into context.

## Core usage
This is a data source, not a library. Canonical live query (the ONLY auth is the Referer header — no cookie, no key; `take` max 100; paginate via `pagination.nextCursor`):
```bash
curl -s 'https://layers.to/api/v1/layers?take=24&tags=dashboard' \
  -H 'Referer: https://layers.to/' \
  | jq -r '.data[] | [.id,.title,.imageUrl] | @tsv'
```
Idiomatic use of a vendored palette in the target project — hexes become tokens, nothing from Layers ships:
```css
:root { /* seeded from layers palette cmbhztcmh000al80cd86lbtbu */
  --accent: #32aad5; --deep: #541424; --mist: #ace4dc;
  --clay: #9c7464; --pine: #2c5f56; --blush: #d8bebd;
}
```
Also usable live without any header: `/api/v1/tags?take=30`, `/palettes/list?take=100`, `/api/v1/users/{username}`. Free-text: `/api/v1/layers?keyword=...`; author: `/api/v1/layers?username=...` (both need the Referer).

## Pitfalls
- 401 `UNAUTHORIZED` on `/api/v1/layers` and `/api/v1/jobs` = missing `Referer: https://layers.to/` header. Referer alone is sufficient; cookies/UA are irrelevant.
- `take` > 100 → zod `too_big` error. Sort params (`sort=hot|top|trending`) are cosmetic — feed is always recency-ordered.
- Tags are EMPTY (`[]`) in list responses; only `/api/v1/layers/{id}` populates them (`tags:[{tag:{name}}]`). Budget 1 request/shot; do it only for a curated handful. This is why `inspiration.tsv` category is blank for layers rows.
- `inspiration.tsv` `source_url` for layers rows is the S3 image URL, NOT a permalink. For citations get `id` from `shots.jsonl` → `https://layers.to/layers/{id}`.
- Broken live endpoints (as of 2026-08): `/api/v1/search/suggestions` → 500; `/api/v1/groups/layers` → 400; `/api/v1/design-types` → empty; `/api/v1/users/{u}/layers` → auth-required (use `/api/v1/layers?username=` instead).
- `shots.jsonl` is a raw recency dump and contains AI-prompt spam and SEO accounts — filter by keyword/tag, never treat "recent" as "good".
- Some `imageUrl`s are `.mp4` (motion shots), all are multi-MB — link, never fetch.
- Legal posture: read metadata, cite permalinks, let a human look at images. Never vendor images, never copy a design, keep request volume modest (no robots.txt ≠ permission).

## Refresh / fallback
- `bash scripts/sync.sh layers` — refreshes tags.json, palettes.json (take=100), and 10×100 shot pages into shots.jsonl. Quarterly is enough; gate ad-hoc harvests on `curl -s https://layers.to/api/v1/health` (expect `"status":"healthy"`).
- On-demand (all verified):
  - `curl -s 'https://layers.to/api/v1/layers?take=24&tags=saas' -H 'Referer: https://layers.to/'`
  - `curl -s 'https://layers.to/api/v1/tags?take=30'` (no headers needed)
  - `curl -s 'https://layers.to/palettes/list?take=48'` (no headers needed)
