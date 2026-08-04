# rough.js — hand-sketched vector shapes and textures
> Sketchy hand-drawn SHAPE PRIMITIVES @ 4.6.6 (MIT, deps fully inlined in bundled builds, ~27KB working core): line/rect/ellipse/circle/polygon/arc/curve/path rendered with wobbly strokes and 7 fill styles, to SVG or canvas. This is the shape engine — for annotating live copy route to `sources/rough-notation.md`; for draw-on of authored art route to GSAP DrawSVG.

## At a glance
- **What**: `roughjs` **pinned 4.6.6** (Preet Shihn) — `rough.svg(el)` / `rough.canvas(el)` / `rough.generator()` / `rough.newSeed()` (`vendor/roughjs/rough.d.ts`). Full `Options` surface in `core.d.ts`: `roughness`, `bowing`, `stroke`, `strokeWidth`, `fill`, `fillStyle`, `fillWeight`, `hachureAngle`, `hachureGap`, `seed`, dash/curve controls. Seven fill styles: `hachure` (default), `cross-hatch`, `dots`, `zigzag`, `dashed`, `zigzag-line`, `solid`.
- **License**: MIT, (c) 2019 Preet Shihn (`vendor/roughjs/LICENSE`).
- **Vendored** (`vendor/roughjs/`, ~103KB): 14-file allowlist from the tarball's `bundled/` tree — `rough.esm.js`, `rough.js` (IIFE, global `rough`), `rough.cjs.js`, eight `.d.ts`, `LICENSE`, `README.md`, `package.json` — plus `PIN.json` (per-file byte pins + tarball sha1 `1059f49…`). The package declares 4 npm deps (`hachure-fill`, `path-data-parser`, `points-on-curve`, `points-on-path`) but the `bundled/` builds INLINE all four — grep-verified zero import/require of external specifiers. The unbundled `bin/` tree (which does import the deps) is structurally excluded.
- **Index**: card-only source — NO TSV. This card is the route.
- **Project deps**: zero. Zero-build → copy `vendor/roughjs/rough.js`, one script tag. React → `ref` + `useEffect`, no official wrapper (pattern below). Build pipeline → import the vendored `rough.esm.js` or `npm i roughjs@4.6.6` (exact pin).

## Routing (law) — the three-way sketch boundary
- **Annotation of live copy** (underline/circle/highlight a real DOM phrase) → `sources/rough-notation.md`, only there. NEVER rebuild an underline with `rough.line()` — the annotation engine measures DOM rects and handles multiline; hand-placing coordinates over text is fragile theater.
- **Draw-on animation of custom authored art paths** (logos, illustrations you designed) → GSAP DrawSVG (`sources/gsap.md`).
- **Freeform organic shapes, decorative motifs, hachure texture blocks, sketchy diagram accents** (arrows, boxes-and-arrows explainers, marginalia circles, texture panels) → **HERE**.
- **The two rough libraries compose with DrawSVG**: rough generates the geometry (`<path>` elements), DrawSVG animates the drawing-on. Generate → select paths → `gsap.from(paths, { drawSVG: 0 })`.

## When to use / when NOT
Use for: one hand-sketched motif in a hero (a circled number, a wobbly divider, an arrow between panels), a hachure-filled accent block behind a stat, sketchy diagram accents in an explainer section, generative texture at build time.
NOT for: entire UIs in sketch style (register law below), data visualization where precision is the point, anything rough-notation or DrawSVG owns (routing law), body-copy decoration at scale.

## How to consume (token discipline)
Zero-build — one script tag, SVG target (law 3), static output so no motion gate needed unless you animate:
```html
<svg id="motif" width="320" height="180" viewBox="0 0 320 180"></svg>
<script src="/roughjs/rough.js"></script>
<script>
  const rc = rough.svg(document.getElementById('motif'))
  // rc.* RETURNS a node — you must append it yourself
  document.getElementById('motif').appendChild(
    rc.ellipse(160, 90, 240, 120, {
      roughness: 1, bowing: 1.2,                    // editorial band: 0.5–1.5
      stroke: 'var(--accent)', strokeWidth: 2,
      fill: 'var(--accent-tint)', fillStyle: 'hachure', hachureGap: 6,
      seed: 7,                                       // pinnable — stable across renders
    })
  )
</script>
```
React — `ref` + `useEffect`, no official wrapper:
```tsx
'use client'
import { useEffect, useRef } from 'react'
import rough from 'roughjs'                          // resolves to the bundled ESM
export function SketchMotif() {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current!
    const node = rough.svg(svg).rectangle(10, 10, 300, 160,
      { roughness: 1, stroke: 'var(--accent)', seed: 7 })
    svg.appendChild(node)
    return () => { node.remove() }                   // StrictMode-safe
  }, [])
  return <svg ref={ref} width={320} height={180} viewBox="0 0 320 180" />
}
```
SSR / build-time — `rough.generator()` computes drawables with NO DOM: `gen.rectangle(...)` → `gen.toPaths(drawable)` → emit static inline `<path>` markup in the build. This is the route for static sites and server components.
Reading the source: `core.d.ts` (2.2KB) for the full options surface; never read the bundled `.js` files.

## Non-optional defaults (law, with the why)
1. **ACCENT ONLY — 1–2 rough elements per page max.** A whole UI in sketch style is whiteboard-doodle register drift, not print-magazine. The sketch reads as a human touch precisely because everything around it is set with precision.
2. **Roughness 0.5–1.5 for editorial** (library default 1); `>2` only for deliberate marginalia. Vary `roughness`/`bowing`/`fillStyle`/`stroke` via the ledger — consecutive builds must not reuse one recipe.
3. **`rough.svg()` over `rough.canvas()`** — crisp at every DPR, stylable with CSS vars, and DrawSVG-animatable. Canvas blurs on retina without manual devicePixelRatio work and its output can't be animated as paths.
4. **Seed IS pinnable here** (public `seed` option, unlike rough-notation) — pin it (`seed: 7` or `rough.newSeed()` stored once) for stable renders across reloads/re-renders, or omit deliberately for per-visit variation. Choose; don't get variation by accident.
5. **Animate outlines, pop fills in.** Hachure fills are MANY path segments — draw-on animating a fill is heavy and reads as noise. DrawSVG the outline path, then fade/instant-show the fill group.
6. **`rough.generator()` for anything static** — if the motif never changes, compute it at build time and ship inline SVG; the 27KB runtime is for genuinely dynamic drawing only.

## Pitfalls
- `rough.svg(el).rectangle(...)` **returns** an `SVGGElement` — nothing appears until you `appendChild` it. `rough.canvas()` draws immediately; the asymmetry trips people.
- Unpinned seed + React re-renders = the shape REDRAWS differently on every render. Pin the seed or memoize the node.
- Shapes don't reflow: coordinates are fixed at draw time. Use a `viewBox` and let the SVG scale, or regenerate on resize — don't stretch a rough canvas.
- `fill` without `fillStyle` gets hachure, not solid — pass `fillStyle: 'solid'` when you mean flat.
- `path()` with complex curves multiplies segments fast — check output size; prefer simple primitives for accents.
- SSR: `rough.svg`/`rough.canvas` need real elements — module import is clean, so importing is safe server-side, but calling those two is client/effect-time only; `rough.generator()` is the DOM-free route.

## Refresh / fallback
- `bash scripts/sync.sh roughjs` — re-fetches the pinned tarball; gates: sha1 `1059f49…`, version == 4.6.6, MIT in package.json AND license text, bundled-builds-import-free invariant, all 14 allowlisted files at EXACT byte pins. Any miss keeps the previous copy.
- Bumping the version is a deliberate edit: re-run the adding-a-source audit, re-verify the `bundled/` files still inline all deps, re-pin sha1 + all byte sizes.
