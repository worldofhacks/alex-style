# Fancy Components — curated editorial/typographic subset (React/Tailwind)

> The print-editorial motion language the other registries lack: animated link underlines, letter-swap nav hovers, media expanding between words, content flowing along SVG paths, REAL variable-font axis animation, and reusable SVG filter primitives — copy-paste TSX, MIT.

## At a glance

- **What**: a **curated 15-item subset** of the ~45 `registry:ui` items in the fancy registry (fancycomponents.dev, danielpetho/fancy). Chosen because NOTHING already vendored covers them; the other ~30 items were **deliberately excluded as duplicates** of components in magicui/kokonutui/reactbits/motion-primitives (marquees, tickers, scramble/typewriter text, carousels, cursors…). **Future syncs must never blanket-import this registry** — fetch the pinned list in `vendor/fancy/PIN.json` only.
- **License**: MIT, (c) 2024 Daniel Petho — commercial use, modification, redistribution allowed. `vendor/fancy/LICENSE`.
- **Pin**: the registry has no version numbers — pinned to danielpetho/fancy commit `f9f62c6` (HEAD 2026-03-14). Full shas + per-file sha256 in `vendor/fancy/PIN.json`.
- **Vendored** (paths relative to skill dir):
  - `vendor/fancy/r/<name>.json` — 15 registry items (full TSX embedded) + 3 `registry:hook` dep files (`use-dimensions`, `use-elastic-line-events`, `use-mouse-position` — the dependency closure of `elastic-line`, NOT extra components)
  - `vendor/fancy/LICENSE`, `vendor/fancy/PIN.json`
- **Index**: `vendor/_index/components.tsv` (15 fancy rows): `grep '^fancy' vendor/_index/components.tsv | grep -i underline`
- **Project deps**: mostly `npm install motion`; `clsx` on the two comes-in/goes-out underlines; `lodash` on `letter-swap-pingpong-anim` and `variable-font-hover-by-letter` (for `debounce` only — acceptable, or inline a 10-line debounce and drop the dep). Check the item JSON before assuming.

## What each fills (why these 15)

- **Animated underline suite** (`underline-center`, `underline-comes-in-goes-out`, `underline-goes-out-comes-in`, `underline-to-background`) — the print-editorial link language. Zero underline components exist in the other four registries.
- **Letter-swap hovers** (`letter-swap-forward-anim`, `letter-swap-pingpong-anim`) — the studio nav-link interaction (per-letter roll on hover).
- **`media-between-text`** — inline image/video expanding between words; the most art-directed piece here.
- **Along-SVG-path trio** (`marquee-along-svg-path`, `element-along-svg-path`, `text-along-path`) — marquees, arbitrary children, and text flowing on any SVG path, with optional scroll-driven progress.
- **Variable-font pair** (`breathing-text`, `variable-font-hover-by-letter`) — REAL `fontVariationSettings` axis animation (magicui's kinetic text is a CSS transform trick, not variable axes). Pairs with a variable face from `sources/typography.md`.
- **`elastic-line`** — cursor-bending SVG divider (drag it, it springs back).
- **SVG filter primitives** (`gooey-svg-filter`, `pixelate-svg-filter`) — reusable `<filter>` defs; apply via CSS `filter: url(#id)` to any element (gooey menus, pixelated reveals).

## When to use / when NOT

**Use for**: editorial/portfolio/studio link + nav hover language (underlines, letter swaps — the whole page's link identity); art-directed hero/about copy (`media-between-text`, `breathing-text`); flowing ticker/badge content on curves (`*-along-svg-path`); expressive section dividers (`elastic-line`); goo/pixelation treatments without WebGL (`*-svg-filter`).

**Do NOT use for**: anything the other registries already cover — marquees on a straight line (`magicui marquee`), scramble/typewriter/rotate text, number tickers, carousels, cursors (those fancy items were excluded as duplicates; grep `components.tsv` first); non-React stacks (all TSX); dense app UI (these are display/marketing pieces).

## How to consume (token discipline)

1. Find the item: `grep '^fancy' vendor/_index/components.tsv | grep -i swap` — last column is the vendored file, `npm_deps` tells install cost upfront.
2. Extract the source (verified working on these item files):
   `bash scripts/get-component.sh vendor/fancy/r/underline-center.json` (or `jq -r '.files[0].content' ...`)
3. Check deps: `bash scripts/get-component.sh vendor/fancy/r/elastic-line.json --deps`
4. Copy into the project preserving the upstream layout: embedded paths are `fancy/<category>/<name>.tsx` (`text/`, `blocks/`, `physics/`, `filter/`) — conventionally `src/components/fancy/...`; hooks go to `src/hooks/`.

## Core usage

```bash
bash scripts/get-component.sh vendor/fancy/r/underline-center.json > src/components/fancy/text/underline-center.tsx
npm install motion   # per the item's deps
# elastic-line additionally needs its vendored hooks:
bash scripts/get-component.sh vendor/fancy/r/use-dimensions.json > src/hooks/use-dimensions.ts
bash scripts/get-component.sh vendor/fancy/r/use-elastic-line-events.json > src/hooks/use-elastic-line-events.ts
bash scripts/get-component.sh vendor/fancy/r/use-mouse-position.json > src/hooks/use-mouse-position.ts
```

Several items import `cn` from `@/lib/utils` (shadcn convention) — ensure it exists, same helper as the magicui card.

## Laws

1. **Variable-font components REQUIRE a loaded variable font with the right axes** (`variable-font-hover-by-letter` defaults `'wght' 400, 'slnt' 0` → `'wght' 900, 'slnt' -10`; `breathing-text` takes from/to settings as props) — a static face **silently no-ops**. Always pair with a variable face from `sources/typography.md` and verify the face actually has those axes.
2. **None of these handle `prefers-reduced-motion`** — wrap per the skill's standing reduced-motion gate before shipping.
3. **One link-hover language per page**: pick ONE underline variant OR one letter-swap and use it everywhere (nav + inline links); underline colors come from brief tokens, never the demo defaults.
4. **Commit-pinned; upstream quiet since 2026-03** — fixes live in-vendor as `// PATCHED(alex-style):` comments (three items patched: `useId()` for SSR-safe SVG path ids + added `"use client"`). Never "refresh" by overwriting with raw upstream — re-apply or re-verify patches (sync_fancy does this).

## Pitfalls

- Registry names are kebab-case but embedded file paths use category dirs: `fancy/text/underline-center.tsx`, `fancy/blocks/media-between-text.tsx`, `fancy/physics/elastic-line.tsx`, `fancy/filter/gooey-svg-filter.tsx` — imports in your pages must match wherever you place them.
- Import inconsistency upstream: most items use `cn` from `@/lib/utils`, but `underline-comes-in-goes-out` / `underline-goes-out-comes-in` do `import cn from "clsx"` directly (hence their `clsx` dep).
- `elastic-line` imports `@/hooks/use-dimensions` + `@/hooks/use-elastic-line-events` (which needs `use-mouse-position`) — all three are vendored in `vendor/fancy/r/`; copying only the component will not compile. Its `registryDependencies` are absolute URLs to the live site — ignore them, use the vendored files.
- Letter-based components split with naive `label.split("")` — breaks on emoji/multi-byte graphemes (no `Intl.Segmenter` in this subset — verified). Keep labels to plain text.
- The SVG filters render a `<svg><filter id=…></svg>` def only — nothing visible until you apply `style={{ filter: "url(#id)" }}` to a target; Safari's gooey blur compositing is the usual cross-browser suspect — eyeball it there.
- Upstream registry descriptions are all placeholder ("A ui component.") — the `components.tsv` rows carry curated descriptions; trust the TSV, not the item JSON's description field.
- Live-fetch URLs require the `.json` suffix: `https://www.fancycomponents.dev/r/<name>` without it is a hard 404.

## Refresh / fallback

- `bash scripts/sync.sh fancy` — fetches ONLY the pinned 18 item files (never the whole registry), verifies the commit pin, and fails loudly if upstream changed under a PATCHED item.
- On-demand (verified): `curl -s https://www.fancycomponents.dev/r/<name>.json` (item, full source); `curl -s https://www.fancycomponents.dev/r/registry.json` (manifest — for auditing only, do NOT blanket-import).
- Raw GitHub mirror (works at pinned sha): `https://raw.githubusercontent.com/danielpetho/fancy/f9f62c61207b2dd3210476dd98af3c9a5be24094/src/fancy/components/<category>/<name>.tsx`
