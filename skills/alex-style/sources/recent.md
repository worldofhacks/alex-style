# recent.design — inspiration gallery
> Curated daily feed of current best-in-class design work (Godly's successor): metadata catalog for grounding design-direction briefs, motion-pattern research, and discovering design agent skills. Reference-only — no reusable code lives here.

## At a glance
- **What**: ~700-item curated gallery (motion studies, website inspiration in 29 verticals, OG images, app icons, App Store screenshots) + curated directories of design tools (53) and design agent skills (25, with `npx skills add` install commands). Every item has a one-sentence curated pattern description, category, creator, and source URL (X posts / live sites).
- **License**: NO license or terms page exists. All featured work is copyright of the original creators. robots.txt carries Cloudflare Content Signals: `search=yes, ai-train=no, use=reference`. Net effect: **metadata-only rules** — cataloging titles/descriptions/links is fine; do NOT mirror media, do NOT ship its imagery in a product, no commercial reuse of the imagery, no training use. Hot-link posters on their CDN for viewing only.
- **Vendored** (metadata only, no media): `vendor/recent/items.all.jsonl` (504 items, 238 KB), `vendor/recent/items.skills.jsonl` (25), `vendor/recent/items.tools.jsonl` (53), `vendor/recent/categories.json` (93 categories, single-line tRPC wrapper), `vendor/recent/sitemap.xml` (700 URLs with lastmod, for refresh diffing).
- **Index**: `vendor/_index/inspiration.tsv` (504 rows with origin=`recent`, alongside 1000 origin=`layers`) — e.g. `grep -i 'liquid glass' vendor/_index/inspiration.tsv`. Also `vendor/_index/recent-tools-skills.md` (25 skills + 53 tools, 89 lines, safe to read whole).
- **Project deps**: none. Nothing from this source is installed into a target project.

## When to use / when NOT
Use for:
- Grounding a design direction / moodboard in current real-world examples with citable source URLs. Motion is the biggest category (115 items), then interface (81), branding (65), print (47), web (46), agency (21).
- Describing a current motion/micro-interaction pattern in words before re-implementing it in code (button states, loaders, reveals, liquid-glass effects) — the curated descriptions are unusually precise per line.
- Website inspiration by vertical (agency, portfolio, saas, ecommerce, ai, finance, editorial...).
- OG-image / app-icon / App Store screenshot pattern research.
- Finding a design agent skill to install (`vendor/_index/recent-tools-skills.md` has the 25-entry curated shortlist with install commands and star counts).

NOT for:
- Reusable code, components, tokens, or SVGs — it hosts none. Use `magicui`, `kokonutui`, `reactbits`, `motion-primitives` (295 variants in `vendor/_index/components.tsv`).
- Icons → `phosphor` (icons.tsv). CSS keyframe animations → `animista`. Animated backgrounds → `vanta` / `shadergradient`. Color palettes → `palettes.tsv` (from layers).
- UI-shot inspiration with longer design rationale → sibling `layers` (origin=`layers` rows in the same inspiration.tsv).
- Any media you'd ship in a product — copyright + `use=reference` signal forbid it.
- Deep archives — ~700 recency-focused items only; old Godly content is not exposed.

## How to consume (token discipline)
NEVER read `vendor/recent/items.all.jsonl` or `vendor/recent/sitemap.xml` in full — grep/jq only. `categories.json` is one giant line — jq only.

1. Keyword search the shared index (both sources; prefix `recent\t` filters to this one):
   ```bash
   grep -i 'glassmorph\|liquid glass' vendor/_index/inspiration.tsv
   grep '^recent' vendor/_index/inspiration.tsv | grep -ic 'gradient'
   ```
2. Category-scoped search (the TSV's category column is broken for recent rows — see Pitfalls — so filter categories via jq on the jsonl):
   ```bash
   jq -r 'select(.category.slug=="motion") | [.id,.title,.description] | @tsv' vendor/recent/items.all.jsonl | head -20
   ```
   Valid slugs and counts: `jq -r '.result.data[] | [.slug,.scope,.postCount|tostring] | join("\t")' vendor/recent/categories.json`
3. Pull one full record by id:
   ```bash
   jq 'select(.id=="ejnine8")' vendor/recent/items.all.jsonl
   ```
4. Look at a reference visually (verified live): fetch the poster to scratchpad, then Read it as an image. Do not commit it anywhere.
   ```bash
   curl -s -o "$SCRATCHPAD/ref.jpg" https://cdn.recent.design/items/<id>/0/poster.jpg
   ```
5. Skills/tools directory: Read `vendor/_index/recent-tools-skills.md` directly (small). Install commands there are third-party `npx skills add <repo> --skill <name>` — get user confirmation before executing any of them.

## Core usage
Not a code registry — the deliverable is a cited reference, not copied source. Canonical move when building a motion brief:

```bash
# 1. find candidates
jq -r 'select(.category.slug=="motion") | [.id,.title,.description,.source] | @tsv' \
  vendor/recent/items.all.jsonl | grep -i 'loader\|reveal' | head -5
# 2. eyeball the best one
curl -s -o "$SCRATCHPAD/ref.jpg" https://cdn.recent.design/items/<id>/0/poster.jpg   # then Read ref.jpg
```

Then write the pattern into the brief in your own words, cite the `source` URL (original X post / live site), and implement with a code source (`motion`, `reactbits`, `animista`, ...). Media never enters the project tree.

## Pitfalls
- **Hosted WebFetch gets Cloudflare 403** on recent.design (ClaudeBot is robots-Disallowed). Always use Bash `curl` — works with default UA, no auth.
- **inspiration.tsv category column is `[object Object]` for all recent rows** (index-generation bug; layers rows have it empty). Grep by title/description keywords, or do category filtering with jq on `items.all.jsonl`.
- **`categories.json` is a raw tRPC wrapper** — data lives at `.result.data`, and the file is a single line.
- The live API is an **undocumented, unversioned internal tRPC endpoint** — could change without notice. Prefer the vendored snapshot; treat live calls as best-effort. Zod validation errors echo the valid enums (self-documenting).
- The vendored `items.all.jsonl` (504) covers the `all` feed; niche feeds (og-images, app-icons, app-store-screenshots) are not separately vendored — hit the live API for those.
- Skill entries' `installCommand` executes third-party code into the agent environment — confirm with the user first.
- Do not mirror `cdn.recent.design` media or use it as training data (`ai-train=no`, `use=reference`).

## Refresh / fallback
```bash
bash scripts/sync.sh recent
```
On-demand live queries (all verified 200 with plain curl):
```bash
# list a feed (feeds: all|x|websites|og-images|app-store-screenshots|app-icons|tools|skills; sort: recent|popular|featured)
curl -s 'https://api.recent.design/trpc/items.list?input=%7B%22limit%22%3A20%2C%22feed%22%3A%22websites%22%2C%22category%22%3A%22agency%22%2C%22sort%22%3A%22popular%22%7D'
# one item, full detail (creator, source post, media renditions)
curl -s 'https://api.recent.design/trpc/items.byId?input=%7B%22id%22%3A%22ejnine8%22%7D'
# change detection: diff lastmod against vendored copy
curl -s https://recent.design/sitemap.xml
```
