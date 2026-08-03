# SVGL — brand logos
> 665 official brand marks (1,081 SVGs: light/dark/wordmark variants) from pheralb/svgl — the ONLY shippable logo source in the arsenal; phosphor `*-logo` glyphs remain banned as brand marks.

## At a glance
- **What**: Curated SVG snapshot of svgl.app — official-color vectors (vercel, stripe, figma, slack, linear…) with `_dark` variants where black/white marks need them and wordmarks for ~150 brands. Static files only: zero deps, zero runtime, zero build, no version pin possible.
- **License — READ THIS**: MIT covers the *collection/code* (`vendor/svgl/LICENSE`, (c) 2022 Pablo Hdez). It does NOT license the marks — every logo remains a trademark of its owner. **Nominative use only**: tech-stack / "built with" strips, integration pages, docs, true press mentions — placements describing a real relationship. **NEVER fabricate customer walls or imply endorsement** ("Trusted by Stripe" on an unrelated product is a legal + taste failure worse than placeholder text). Reselling/redistributing the SVGs as a logo pack is not covered.
- **Vendored** (`vendor/svgl/`, ~5.6MB): `library/` — all 1,081 SVGs (avg ~3KB each); `index.json` — the api.svgl.app dump (126KB, never read — grep the TSV); `LICENSE`.
- **Index**: `vendor/_index/logos.tsv` — 664 rows: `name title category route_light route_dark wordmark_light wordmark_dark brand_url`. The TSV is MANDATORY routing, not convenience: upstream filenames are inconsistent and unguessable (`aws_light.svg` vs `nvidia-icon-light.svg` vs `vercel_wordmark_dark.svg`) — never guess a path in `library/`.
- **Project deps**: none, ever. Copy the SVG file (or data-URI it); nothing installs.

## When to use / when NOT
Use for:
- Logo strips / marquees: magicui `marquee` (recipes.md recipe 2 "Dark SaaS landing page", step 3 social proof) and reactbits `LogoLoop-TS-TW` (`{src, alt}` items) — the two components that previously had nothing real to display.
- Integration grids, "works with" sections, footer badges, docs, tech-stack callouts.
- Wordmark variants (col 6/7) when the horizontal lockup fits better than the icon.

NOT for:
- **Any brand absent from logos.tsv — HARD ROUTING RULE**: render a styled TEXT wordmark placeholder (brand name, brief's display font, tasteful weight/tracking). NEVER hand-draw or approximate a mark; NEVER substitute phosphor `*-logo` glyphs (monochrome outlines, not official marks). Expect misses often: coverage is dev/design-tool heavy (Software 283, Library 77, AI 67) — spot-audit measured ~40% hit rate on realistic B2B customer strips and ~0% for non-tech enterprise (banks, airlines, CPG: JPMorgan/Delta/Walmart/Coca-Cola all absent). Tech stacks are the sweet spot (23/25 hit).
- Fictional/demo companies — invent a text wordmark, don't borrow a real mark.
- UI icons → `phosphor`. Decorative shapes → components/animista.

## How to consume (token discipline)
NEVER read `vendor/svgl/index.json` (126KB) or list `library/` — grep the TSV, then `get-logo.sh`. Titles are human names, not slugs (`Amazon Web Services`, not `aws`) — grep case-insensitively across the whole row.
```bash
grep -i "stripe" vendor/_index/logos.tsv                 # find slug + variant map
awk -F'\t' '$1=="vercel"' vendor/_index/logos.tsv        # exact row: which variants exist
bash scripts/get-logo.sh vercel                          # light route → stdout
bash scripts/get-logo.sh vercel dark public/vercel.svg   # dark route → file
bash scripts/get-logo.sh stripe wordmark                 # wordmark route
cut -f3 vendor/_index/logos.tsv | tr ',' '\n' | sort | uniq -c | sort -rn   # category census
```
Empty column = variant doesn't exist. A missing `route_dark` usually means the colored mark is theme-safe — use `route_light` on dark backgrounds as-is.

## Core usage
Preferred embed — `<img src>` (or CSS `background-image`)/data-URI. This sidesteps the id-collision trap below and keeps marks untouched:
```html
<img src="/logos/vercel_dark.svg" alt="Vercel" style="height:28px;width:auto" />
```
Logo strip, the tasteful defaults (works in marquee/LogoLoop/plain flex):
```css
.logo-strip img { height: 28px; width: auto;            /* NEVER fixed-width boxes */
  filter: grayscale(1); opacity: .7; transition: opacity .15s, filter .15s; }
.logo-strip img:hover { filter: none; opacity: 1; }
```
reactbits LogoLoop items: `{ src: '/logos/stripe.svg', alt: 'Stripe', href: 'https://stripe.com' }`.
Rules that are law, with the why:
- **Size by height, `width:auto`** — viewBoxes/scales are NOT normalized (slack 2447×2452 vs vercel 256×222, some non-zero origins); fixed-width boxes distort or mis-align the strip.
- **Never recolor, tint (`currentColor`), distort, or CSS-invert a mark** — that creates an unofficial mark (trademark problem) and breaks brand colors. Dark theme = swap to the `route_dark` file from the TSV; `filter:invert()` is forbidden.
- **Inlining raw SVG needs id-hygiene** — several files carry un-namespaced Figma-export ids (`clip0_547_9`, `paint0_linear_547_9`); inline two such logos on one page and gradients/clipPaths cross-corrupt. If you must inline (e.g. strict-CSP artifact), prefix every `id=` + `url(#…)` per logo (`sed 's/clip0_/stripe-clip0_/g; s/paint0_/stripe-paint0_/g'` per file). `<img src>`/data-URI needs none of this.
- **High-visibility placement?** Check `brand_url` (col 8, present on 158 entries — Vercel, NVIDIA, Plausible…) for the owner's usage rules before shipping.

## Pitfalls
- Grep by title, not guessed slug: `aws` works, but many only match on title (`grep -i "web services"`). No hit ≠ absent — try the title before falling back to the text-wordmark rule.
- One upstream duplicate (`pycharm`, two index entries → one TSV row after dedupe); catalogs handle it — don't "fix" the index.
- Wordmark ≠ icon era: upstream already ships a Stripe rebrand mismatch (icon `#533afd` new purple, wordmark `#635bff` legacy blurple). Don't mix icon + wordmark of the same brand in one strip without eyeballing both.
- Rebrands age silently — a stale logo on a customer strip is a quality regression. Re-sync quarterly and spot-check the high-visibility marks in your strip against the live brand site.
- Dark-page vanishing: a black-on-transparent mark with no `route_dark` row would disappear on dark backgrounds — if a mark is invisible on your theme and no `_dark` exists, drop to the styled TEXT wordmark rather than inverting.
- `get-logo.sh` errors are guidance, not noise: "not found" → grep titles, then text-wordmark rule; "no <variant> route" → colored marks are theme-safe / wordmark missing → icon + text.

## Refresh / fallback
- `bash scripts/sync.sh svgl && node scripts/build-catalogs.mjs` — re-snapshots api.svgl.app + the repo library. **Quarterly**: sync prints the old→new entry-count diff; changes are additive-mostly, but rebrands replace files silently — diff `vendor/svgl/library/` for changed marks you ship.
- Sync fail-louds (index <500 items, library <900 files or <2MB, non-MIT LICENSE) keep the previous copy — never "fix" a failed sync by loosening the gates; re-audit instead.
- On-demand single logo (verified 200): `curl -s https://svgl.app/library/vercel.svg` · index: `curl -s https://api.svgl.app` — but vendored-first per hard rule 1.
