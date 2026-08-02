# Lenis — smooth-scroll runtime
> The scroll engine: lerped/eased native scrolling for award-style pages, GSAP ScrollTrigger sync, parallax/WebGL scenes, and section snapping. Behavior only — zero UI assets.

## At a glance
- **What**: `lenis@1.3.25` — ~18KB min, zero runtime deps. Core class + subpath adapters `lenis/react`, `lenis/vue`, `lenis/nuxt`, `lenis/snap`, plus a required companion stylesheet. Keeps position:sticky, anchors, and a11y working on top of native scroll.
- **License**: MIT (darkroom.engineering). Full commercial use, modification, redistribution. No restrictions.
- **Vendored** (6 files): `vendor/lenis/llms.txt` (340 lines, canonical API ref), `vendor/lenis/README.md` (386 lines, full Settings/Properties/Methods/Events tables), `vendor/lenis/README.react.md` (151), `vendor/lenis/README.snap.md` (84), `vendor/lenis/dist/lenis.min.js` (18.4KB UMD, global `Lenis`), `vendor/lenis/dist/lenis.css` (26 lines, required). No vue/nuxt README vendored — curl on demand (see Refresh).
- **Index**: no dedicated TSV. One cross-reference in components.tsv — reactbits ScrollStack declares lenis as an npm dep: `grep lenis vendor/_index/components.tsv`
- **Project deps**: `npm i lenis` (runtime library; pulls nothing else — react/vue/nuxt peers are optional). Static/no-build projects: copy the two `vendor/lenis/dist/` files into the project instead.

## When to use / when NOT
Use for:
- Marketing/award-site smooth scrolling with inertia and custom easing.
- Syncing GSAP ScrollTrigger to lerped scroll (canonical ticker pattern below) — pairs with sibling `gsap`.
- Parallax and Three.js/WebGL scroll-scene sync (its original design goal).
- Horizontal-scroll sections (`orientation:'horizontal'`, `gestureOrientation:'both'`), infinite marquees (`infinite:true` + `syncTouch`).
- Full-page section snapping via `lenis/snap` (`type:'lock'`, `addElements`) — CSS scroll-snap does NOT work under Lenis.

NOT for:
- Dashboards, admin panels, text-heavy apps — native scroll is correct; hijacked inertia hurts usability and battery. Skip Lenis entirely there.
- Virtualized lists/data grids (react-window etc.) — conflicts with scroll virtualization.
- Simple scroll-reveals — use IntersectionObserver, CSS animations from `animista`, or `motion` whileInView; no runtime needed.
- Scrolling inside iframes (wheel events not forwarded).
- Anything needing visual components — pair with `reactbits` (its ScrollStack already wires Lenis), `magicui`, etc.

## How to consume (token discipline)
1. Options/methods/events lookup — grep the vendored llms.txt first:
   `grep -n -A3 "scrollTo" vendor/lenis/llms.txt`
2. Section extraction by line range (headings are stable): options `sed -n '25,42p' vendor/lenis/llms.txt`; methods `sed -n '43,63p'`; GSAP pattern `sed -n '296,330p'`; limitations `sed -n '105,112p'`. Full read of llms.txt (8.2KB) is acceptable when doing heavy config work.
3. Full Settings/Properties tables only when tuning feel: `sed -n '185,255p' vendor/lenis/README.md`. Nested-scroll + anchor recipes: `sed -n '282,349p' vendor/lenis/README.md`. Never read README.md whole (33KB, half is sponsors/marketing).
4. React specifics (`ReactLenis`, `useLenis`, framer-motion frame loop): read `vendor/lenis/README.react.md` (151 lines, fine to read fully). Snap API: `vendor/lenis/README.snap.md` (84 lines).
5. NEVER read `vendor/lenis/dist/lenis.min.js` (minified bundle — zero information). `dist/lenis.css` is 26 lines; copy it, don't study it.

## Core usage
```js
// npm project (vanilla). SSR: window/document touched at construct time —
// run only client-side (useEffect / onMounted / dynamic import).
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'          // REQUIRED — stop/prevent classes break without it

const lenis = new Lenis({ autoRaf: true, anchors: true })   // minimal
// GSAP ScrollTrigger variant — autoRaf OFF, drive from GSAP's ticker:
//   const lenis = new Lenis()
//   lenis.on('scroll', ScrollTrigger.update)
//   gsap.ticker.add((t) => lenis.raf(t * 1000))
//   gsap.ticker.lagSmoothing(0)
// SPA teardown: lenis.destroy()
```
React: `import { ReactLenis, useLenis } from 'lenis/react'` → `<ReactLenis root>{children}</ReactLenis>`; still import the CSS once.
No-build static page: copy both `vendor/lenis/dist/` files, `<script src="lenis.min.js">` + `new Lenis({ autoRaf:true, autoToggle:true, anchors:true, allowNestedScroll:true })` (official drop-in config).
`scrollTo(target, opts)` accepts px, selector, keyword ('top','bottom'), or element. Per-frame reads: `lenis.progress / velocity / direction` via `lenis.on('scroll', cb)`.

## Pitfalls
- `vendor/lenis/README.react.md`'s GSAP example is INCOMPLETE upstream — it omits `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.lagSmoothing(0)`, causing stale ScrollTrigger positions. Use the full pattern from this card / `vendor/lenis/llms.txt` (GSAP section) instead.
- Forgetting `lenis/dist/lenis.css` — `stop()`/`data-lenis-prevent` misbehave without the `html.lenis` rules.
- GSAP wiring: with the ticker pattern do NOT also set `autoRaf:true` (double RAF); `lagSmoothing(0)` is mandatory or ScrollTrigger jumps.
- SSR crash: instantiate only client-side; the react/vue wrappers still must render client-side.
- Nested scrollers (modals, code blocks, inner lists) freeze unless marked `data-lenis-prevent` (or `-wheel`/`-touch` variants). `allowNestedScroll:true` auto-detects but walks the DOM per gesture — prefer `prevent: (node) => bool` on perf-sensitive pages.
- CSS scroll-snap silently dead under Lenis — must migrate to `lenis/snap`.
- Anchor `#hash` links are blocked by default — set `anchors: true`.
- `lerp` overrides `duration`/`easing` when both set.
- `infinite:true` needs `syncTouch:true` on touch devices; syncTouch itself is flaky on iOS<16. Safari caps at 60fps (30 low-power).
- Old package names `@studio-freight/lenis` / `lenis-react` are deprecated — only plain `lenis`.
- A V2-ROADMAP exists upstream — pin 1.3.x; expect API changes in v2.

## Refresh / fallback
- `bash scripts/sync.sh lenis` (re-fetches all 6 vendored files at pinned LENIS_VERSION=1.3.25).
- `curl -s https://www.lenis.dev/llms.txt` — canonical API doc (www required; apex 308-redirects; llms-full.txt does not exist).
- `curl -s https://raw.githubusercontent.com/darkroomengineering/lenis/main/packages/vue/README.md` — vue/nuxt details (not vendored).
- `curl -sO https://unpkg.com/lenis@1.3.25/dist/lenis.min.js` (+ `dist/lenis.css`) — pinned no-build files; jsdelivr mirrors both.
