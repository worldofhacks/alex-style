# Phosphor Icons — icon-library
> The default UI icon set: 1,512 glyphs x 6 weights, MIT, consumable as raw inline SVG (zero deps) or typed React components.

## At a glance
- **What**: 1,512 unique icons in 6 weights (thin, light, regular, bold, fill, duotone) = 9,072 SVGs. 16px-grid design, shipped as `viewBox="0 0 256 256"` with `fill="currentColor"` — they inherit CSS `color` with no extra work.
- **License**: MIT (verified against the LICENSE in the core repo and all `@phosphor-icons/*` npm packages). Free for commercial use, modification, redistribution. No attribution required. No paid tier. Local copy: `vendor/phosphor/LICENSE`.
- **Vendored** (`vendor/phosphor/`):
  - `core.tgz` — the `@phosphor-icons/core@2.1.1` npm tarball (1.4MB compressed). All 9,072 SVGs at `package/assets/<weight>/...` (1,512 per weight, verified). Extract single files; never unpack wholesale.
  - `icons.ts` — 498KB machine catalog (name, pascal_name, categories, tags per icon). NEVER read fully; the TSV below replaces it.
  - `LICENSE` — MIT text.
- **Index**: `vendor/_index/icons.tsv` — 1,512 rows + header, tab-separated: `name  pascal_name  categories  tags`. Example (verified):
  `grep -i 'settings' vendor/_index/icons.tsv | cut -f1,2` → gear, gear-six, faders, faders-horizontal...
- **Project deps**: none for inline SVG. Only if the target project is React and will use many icons: `npm i @phosphor-icons/react` (v2.1.10, peer react>=16.8, tree-shaken, TS types included).

## When to use / when NOT
- **Use for**: all app-chrome iconography — nav, row actions (trash / pencil-simple / copy), status (check-circle / x-circle / warning-circle / info), search (magnifying-glass), overflow menus (dots-three-vertical), filters (funnel, sliders-horizontal), empty states. Active-state toggling is a weight swap, not an icon swap: `weight="regular"` → `weight="fill"` for heart/star/bell/bookmark. Duotone weight gives accent-tinted feature tiles and onboarding lists while staying single-color-pipeline.
- **Use for**: static HTML artifacts, emails, diagrams — inline the 200–900-byte SVG directly; no JS, no build step.
- **NOT for**: brand logos (the `*-logo` glyphs are monochrome outlines, not official marks — fetch real brand assets instead). NOT for animated icons — glyphs are static; spin/pulse them with `animista` keyframes or `motion`/`gsap` for micro-interactions. NOT for illustrations or hero graphics (use `vanta`/`shadergradient` for backgrounds, `inspiration.tsv` for reference). If the project already standardized on lucide or heroicons, stay on that set — mixing two general-purpose icon families degrades consistency.

## How to consume (token discipline)
1. Find the icon by name or concept (columns: name, pascal_name, categories, tags):
   ```
   grep -i 'search' vendor/_index/icons.tsv | cut -f1,2
   awk -F'\t' '$1=="bell"' vendor/_index/icons.tsv
   ```
2. Extract exactly one SVG to stdout from the tarball (macOS BSD tar: `-O` must sit in the option cluster, `-xzOf`):
   ```
   tar -xzOf vendor/phosphor/core.tgz package/assets/regular/magnifying-glass.svg
   tar -xzOf vendor/phosphor/core.tgz package/assets/fill/heart-fill.svg
   tar -xzOf vendor/phosphor/core.tgz package/assets/duotone/bell-duotone.svg
   ```
   Filename rule: regular weight has NO suffix (`bell.svg`); every other weight appends `-<weight>` (`bell-bold.svg`, `bell-duotone.svg`).
3. Inline the SVG (add `width`/`height`/`aria-hidden` attrs; color via CSS `color` on a parent), or for React emit the import line straight from the pascal_name — no file read needed at all.
- NEVER read fully: `vendor/phosphor/icons.ts` (498KB) and anything inside `core.tgz` other than single `assets/` files (`dist/index.mjs` is 446KB, `index.umd.js` similar). Grep the TSV instead; it contains everything the catalog has that you need.

## Core usage
Inline SVG (any HTML) — sized and colored by the surrounding CSS:
```html
<span style="color:#6366f1; display:inline-flex">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="..."/></svg>
</span>
```
React (target project only, after `npm i @phosphor-icons/react`):
```tsx
import { MagnifyingGlassIcon, HeartIcon, IconContext } from "@phosphor-icons/react";
// Next.js RSC / server components: import from "@phosphor-icons/react/ssr" instead (context-free)

<IconContext.Provider value={{ size: 20, weight: "regular" }}>
  <MagnifyingGlassIcon />
  <HeartIcon weight={liked ? "fill" : "regular"} color="#e11d48" />
</IconContext.Provider>
```
Props: `size`, `color`, `weight` ("thin"|"light"|"regular"|"bold"|"fill"|"duotone"), `mirrored`, `alt`. Component name = pascal_name from the TSV + `Icon` suffix.

## Pitfalls
- **Suffix rule breaks automation**: `assets/regular/bell.svg` but `assets/bold/bell-bold.svg`. Forgetting the suffix on non-regular weights = "Not found in archive".
- **BSD tar**: `tar -xzf ... <file> -O` fails on macOS ("`-O: Not found in archive`"). Use `tar -xzOf`.
- **React 2.1.x renamed exports** with an `Icon` suffix (`HorseIcon`); bare legacy names still alias but write the suffixed form.
- **Legacy packages are frozen**: unscoped `phosphor-react` and `phosphor-icons` npm packages stopped in 2022 and lack ~500 newer icons. Only `@phosphor-icons/*` scope.
- **Duotone anatomy**: duotone SVGs carry a second `<path opacity="0.2">` — both paths are currentColor; don't strip the opacity path or recolor it independently unless intentional.
- **Vendored registry components use lucide**: 24 rows in `vendor/_index/components.tsv` (magicui/kokonutui/etc.) import `lucide-react`. Keep lucide scoped inside those copied components or swap their imports to Phosphor — don't let both sets leak into general app chrome.
- **Never** ship the all-weights web-font script tag (`https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2` bare) — ~3MB. Use one per-weight stylesheet or inline SVGs.
- Homepage/README "1,248 icons" is stale — real count is 1,512/weight. GitHub *contents* API silently caps directory listings at 1,000 entries; use the git *trees* API to enumerate.
- No llms.txt, no CLI, no registry JSON exists — the tarball + TSV here are the whole automation surface.

## Refresh / fallback
- `bash scripts/sync.sh phosphor` — re-fetches `core.tgz` (pinned `@phosphor-icons/core@2.1.1` in the script) and `icons.ts`, then rebuild the TSV via `scripts/build-catalogs.mjs`.
- On-demand single files if the vendor dir is unavailable (all verified 200):
  - `curl -s https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/acorn.svg` (non-regular: `assets/bold/acorn-bold.svg`)
  - `curl -s https://unpkg.com/@phosphor-icons/core@2.1.1/assets/fill/heart-fill.svg` (jsDelivr mirror: `https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/assets/...`)
  - Icon-font CSS for throwaway HTML: `https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/<weight>/style.css` then `<i class="ph ph-smiley">` (regular) / `<i class="ph-bold ph-heart">`.
