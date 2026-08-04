# Rough Notation — hand-drawn annotations on live copy
> Sketchy hand-drawn ANNOTATIONS @ 0.5.1 (MIT, zero-dep bundled builds, ~10.7KB working core): underline / circle / box / bracket / highlight / strike-through drawn as animated SVG over real DOM text. This is the annotation engine — for freeform sketchy SHAPES route to `sources/roughjs.md`; for draw-on of authored art paths route to GSAP DrawSVG.

## At a glance
- **What**: `rough-notation` **pinned 0.5.1** (Preet Shihn / linkedin) — `annotate(el, config)` returns a `RoughAnnotation` (`show/hide/remove/isShowing`), `annotationGroup([...])` sequences several. Seven types: `underline | box | circle | highlight | strike-through | crossed-off | bracket` (`vendor/rough-notation/model.d.ts`). The three vendored builds (esm/iife/cjs) are rollup bundles with the rough.js renderer INLINED — grep-verified zero import/require of external specifiers.
- **License**: MIT, (c) 2020 Preet Shihn (`vendor/rough-notation/LICENSE`).
- **Vendored** (`vendor/rough-notation/`, ~45KB): 10-file allowlist — `rough-notation.{esm,iife,cjs}.js`, four `.d.ts`, `LICENSE`, `README.md`, `package.json` — plus `PIN.json` (per-file byte pins + tarball sha1 `32abbb1…`). Excluded structurally: the UNBUNDLED `lib/{rough-notation,render,model,keyframes}.js` — they `import from 'roughjs/bin/*'` and are not self-contained.
- **Index**: card-only source — NO TSV. This card is the route.
- **Project deps**: zero for vanilla. React → the vendored magicui `highlighter` component (`vendor/magicui/r/highlighter.json`) is the SANCTIONED React path — it wraps this exact engine via npm dep `rough-notation@0.5.1` (plus `motion` for `useInView`). Vanilla/zero-build → copy `vendor/rough-notation/rough-notation.iife.js` (global `RoughNotation`) or the `.esm.js` as a module.
- **Feature-frozen upstream** (last release 2020; repo dormant): any fix is a `PATCHED(alex-style)` edit in-vendor with fail-loud anchors, never a float to an unaudited version.

## Routing (law) — the three-way sketch boundary
- **Annotating live copy** (a phrase, a stat, a heading fragment) → **HERE, only here**. Never rebuild an underline with `rough.line()` — this engine measures the DOM rect, handles multiline, wraps show/hide lifecycle.
- **Freeform organic shapes / motifs / hachure texture blocks / sketchy diagram accents** → `sources/roughjs.md`.
- **Draw-on animation of custom authored art paths** → GSAP DrawSVG (`sources/gsap.md`).

## When to use / when NOT
Use for: emphasizing 1–3 load-bearing phrases or stats on marketing/editorial pages — the "editor's pen" moment; scroll-triggered reveal of a key claim; highlight sweeps behind a metric.
NOT for: dashboards/app chrome (decoration budget), body-copy-wide decoration (scarcity law below), links/buttons (interactive affordances get real CSS states), inside `<table>` cells directly (sibling-SVG pitfall below).

## How to consume (token discipline)
Zero-build — one file copy, one call, MANDATORY reduced-motion gate (the library has ZERO built-in `prefers-reduced-motion` handling; `animate: false` renders the annotation instantly = the static fallback):
```html
<script src="/rough-notation/rough-notation.iife.js"></script>
<script>
  const el = document.querySelector('#claim')
  const a = RoughNotation.annotate(el, {
    type: 'underline',                     // rotate via the ledger's human_touch axis
    color: 'var(--accent)',                // NEVER defaulted — currentColor default = black = tell
    strokeWidth: 2, iterations: 2,
    animate: !matchMedia('(prefers-reduced-motion: reduce)').matches,
  })
  // scroll reveal: trigger once, after webfonts settle (rect precision)
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return
    io.disconnect()
    document.fonts.ready.then(() => a.show())
  }, { threshold: 0.6 }).observe(el)
</script>
```
React — the sanctioned path is the vendored magicui wrapper, NOT a hand-rolled `useEffect`:
```tsx
import { Highlighter } from "@/components/magicui/highlighter"  // vendor/magicui/r/highlighter.json
// its default color is pink #ffd1dc — MUST be overridden with brief palette colors
<Highlighter action="underline" color="var(--accent)" isView>ships in 4 weeks</Highlighter>
<Highlighter action="highlight" color="oklch(0.95 0.06 85)" isView>2.4x faster</Highlighter>
```
The wrapper already handles in-view trigger-once (`isView` via `useInView`, −10% margin), ResizeObserver re-render, and cleanup. Reading the source: `model.d.ts` (1.2KB) is the full options surface; read `rough-notation.esm.js` only when patching in-vendor.

## Non-optional defaults (law, with the why)
1. **Color is NEVER defaulted** — the library default is `currentColor` (= text color = black strokes = instant AI-slop tell). Accent color for stroke types, a LIGHT TINT for `highlight`. The magicui wrapper's `#ffd1dc` pink default is equally banned — always pass brief palette colors.
2. **Type rotates via the ledger's `human_touch` axis** — consecutive builds must not all reach for `underline`. Seven types exist; the ledger row proves variation.
3. **Scarcity: 1–3 annotations per page on load-bearing phrases/stats only.** Ten sketchy underlines is a doodle, not an editor's pen.
4. **Reduced-motion gate is MANDATORY** (grep-verified: no `matchMedia` anywhere in the library): `animate: !matchMedia('(prefers-reduced-motion: reduce)').matches`. `animate: false` still draws the annotation — instant, static, correct.
5. **Scroll reveal, trigger once** — IntersectionObserver (vanilla) or the wrapper's `isView`. Annotations that are already drawn on page load waste the whole gesture.
6. **Roughness is NOT configurable** (hardcoded internally; seed is auto). The levers you own: `type`, `color`, `strokeWidth`, `iterations`, `padding`, `animationDuration`, `brackets`, `multiline`.

## Pitfalls
- **Client-only**: the annotation touches DOM at construction — never call `annotate()` during SSR; in React that means effect-time only (the magicui wrapper already does).
- **The SVG is inserted as a SIBLING of the annotated element** — inside `<table>` markup that's invalid DOM and rendering breaks. Annotate an inner `<span>`, never the `<td>`/`<tr>`.
- **Text-over-highlight contrast is YOUR job**: `highlight` paints under the text with the color as-is — use light tints (e.g. `oklch(0.95 …)`), check contrast against the text color.
- **Webfonts move rects**: `document.fonts.ready.then(() => a.show())` — annotating before font swap draws at the fallback font's metrics.
- **Feature-frozen upstream (2020)**: known quirks stay. Any fix lands as `PATCHED(alex-style)` in `vendor/rough-notation/`, never a version float.
- `annotationGroup` sequences show() calls in order — use it for multi-annotation reveals instead of hand-rolled timeouts.

## Refresh / fallback
- `bash scripts/sync.sh rough-notation` — re-fetches the pinned tarball; gates: sha1 `32abbb1…`, version == 0.5.1, MIT in package.json AND license text, zero-runtime-dep invariant, all 10 allowlisted files at EXACT byte pins. Any miss keeps the previous copy.
- Bumping the version is a deliberate edit: re-run the adding-a-source audit, re-verify the bundled builds are still import-free, re-pin sha1 + all byte sizes.
