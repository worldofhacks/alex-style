# Motion (motion.dev) — animation runtime

> The MIT animation runtime that magicui/kokonutui/motion-primitives components build on; reach for it directly when you need bespoke micro-interactions, enter/exit, layout/shared-element, scroll-linked, or drag animation.

## At a glance

- **What**: Production animation library for React, vanilla JS, and Vue. Successor to Framer Motion — the `motion` npm package (12.43.0) is a thin wrapper re-exporting `framer-motion` (same version). Declarative React API (`motion.div`, `AnimatePresence`, `layout`/`layoutId`, variants) + imperative vanilla API (`animate`, `scroll`, `inView`, `spring`, `stagger`, `animateView`) + motion values as a reactive primitive.
- **License**: Core is MIT — free commercial use, no attribution. Premium tier **Motion+** (splitText, Cursor, Carousel, Ticker, AnimateNumber, ScrambleText, Typewriter, useCurtains, Motion UI, 410+ examples) is paid (£299), delivered via private registry `api.motion.dev/npm/` requiring a `MOTION_TOKEN`; purchased code is MIT but reselling Motion+ capabilities as a product needs a separate Builder's License. **Treat all Motion+ APIs as unavailable** — no token in this environment.
- **Vendored**: `vendor/motion/llms.txt` only (47,692 bytes, 307 lines) — the official machine index: ~125 doc pages, 114 example tutorials (55 react / 52 js / 7 vue), and 22 troubleshooting pages keyed by exact runtime warning text. Library source is NOT vendored — it is a normal npm dep.
- **Index**: No own TSV. Its consumers are in `vendor/_index/components.tsv`: 99 components list it as an npm dep (kokonutui 36, magicui 30, motion-primitives 33). Verify: `awk -F'\t' '$5 ~ /(^|,)(motion|framer-motion)(,|$)/ {print $1"\t"$2}' vendor/_index/components.tsv | head`
- **Project deps**: `npm install motion` (React 18/19 peer deps are optional, so vanilla installs are clean). Zero-build pages: `import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@12/+esm"` (CORS *, verified 200).

## When to use / when NOT

Use for:
- Hover/press/tap feedback with springs (`whileHover`, `whileTap`; vanilla `hover()`, `press()`)
- Enter/exit on mount/unmount — modals, toasts, dropdowns, list items (`AnimatePresence` + `exit`)
- Layout & shared-element transitions — tab indicators, expanding cards, iOS-style folder/App Store expansion (`layout`, `layoutId`)
- Scroll-linked/triggered effects — parallax, progress bars, reveal-on-scroll (`useScroll` + `useTransform`, vanilla `scroll()`/`inView()`)
- Physics drag, swipe, drag-to-reorder (`drag`, `dragConstraints`, `Reorder`)
- Animating static HTML / any framework via the CDN ESM build

NOT for:
- Pre-styled copy-paste components (marquees, bento grids, animated buttons) → **magicui**, **kokonutui**, **motion-primitives**, **reactbits** (the first three already depend on motion — install it once, all their components reuse it)
- Multi-element timeline choreography, SVG morph pipelines → **gsap**
- Smooth/inertia page scrolling → **lenis** (composes with Motion's `useScroll`)
- WebGL/shader backgrounds → **vanta** or **shadergradient**
- A one-off CSS transition → **animista** keyframe snippet; don't pull in a runtime for one fade

## How to consume (token discipline)

**NEVER read `vendor/motion/llms.txt` in full** (48KB) — grep it. There is no llms-full.txt and no per-page `.md` endpoint (both 404); per-page access is HTML fetch.

1. Find the right page in the vendored index (URL + one-line description per row):
   `grep -i "parallax" vendor/motion/llms.txt`
   Sections: `## React docs`, `## JavaScript docs`, `## Vue docs`, `## Tutorials` (examples), `## Optional` (troubleshooting).
2. Fetch ONE doc page and extract just its code blocks (doc pages server-render all code in `<pre>`; verified 8 blocks on react-use-spring):
   `curl -s https://motion.dev/docs/react-use-spring | python3 -c "import sys,re,html; print('\n\n'.join(html.unescape(re.sub(r'<[^>]+>','',p)) for p in re.findall(r'<pre[^>]*>(.*?)</pre>', sys.stdin.read(), re.S)))"`
3. Example tutorial pages (`motion.dev/examples/react-<slug>` etc.) server-render only the STARTER snippet — the full solution is client-rendered inside an `examples.motion.dev` iframe SPA and is NOT greppable from the page HTML. Use the tutorial prose + starter as a spec and implement against the doc-page APIs; only open the example in browser tools if you truly need the finished source.
4. Runtime warning in console → grep its exact text in the index, then curl the matching troubleshooting URL:
   `grep -i "reorder.item" vendor/motion/llms.txt` → `https://motion.dev/troubleshooting/reorder-item-child`

## Core usage

```tsx
"use client"                       // required in RSC apps for any file importing motion/react
import { motion, AnimatePresence } from "motion/react"

export function Toast({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

Vanilla (no React, incl. CDN ESM): `import { animate, inView } from "motion"` → `inView(".card", (el) => { animate(el, { opacity: [0, 1], y: [24, 0] }, { type: "spring" }) })`. `inView()`/`scroll()` return cleanup functions; `animate()` returns controls with `.stop()` — call them on teardown. For true Server Components, generate CSS `linear()` springs (docs/css) instead of shipping the runtime.

## Pitfalls

- Import from `"motion/react"`, never install/import `framer-motion` alongside `motion` — same code, duplicate bundle.
- RSC/Next.js App Router: every file touching `motion/react` needs `"use client"`; omitting it is the top build failure.
- Registry components copied from magicui/kokonutui/motion-primitives silently assume `motion` is installed in the target project — `npm install motion` first or they fail at import.
- `LazyMotion` requires `m.div` components, not `motion.div` (breaks tree-shaking; throws lazy-strict-mode warning).
- `motion/mini` `animate()` (2.3kb) does not accept `type: "spring"` strings — pass the `spring()` function instead.
- Springs: max two keyframes, duration ≤ 10s; `repeat` must be < 20.
- `Reorder.Item` must be a direct child of `Reorder.Group` with a `values` prop; `dragConstraints`/`useScroll` refs must be attached to a rendered element before use.
- Do NOT `npm install motion-plus` from public npm — 1.5.1 there is stale legacy; current 2.x is private-registry only (paid). Motion+ component names appear in llms.txt docs (Cursor, Carousel, Ticker, AnimateNumber, splitText, ScrambleText, Typewriter, useCurtains) — do not propose them. `animateView()` view transitions, however, are now free in core.
- Accessibility: wrap the app in `MotionConfig reducedMotion="user"` or branch on `useReducedMotion()`.

## Refresh / fallback

- `bash scripts/sync.sh motion` — re-fetches `vendor/motion/llms.txt`.
- `curl -s https://motion.dev/llms.txt` — the index itself (47,692 bytes, verified 200).
- `curl -s https://motion.dev/docs/<slug>` — any doc page as HTML (extract `<pre>` blocks; no `.md` variant exists).
- `https://cdn.jsdelivr.net/npm/motion@12/+esm` — pinned-major ESM runtime for zero-build prototypes (verified 200, `application/javascript`).
