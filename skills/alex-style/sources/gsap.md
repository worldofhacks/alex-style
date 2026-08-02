# GSAP — animation-runtime
> The heavyweight JS animation engine: scroll-driven choreography, text splitting, SVG morph/draw, FLIP, drag physics — core + all 24 plugins free in one npm package.

## At a glance
- **What**: Framework-agnostic animation runtime (tweens, timelines, eases, utils) + plugins: ScrollTrigger, ScrollSmoother, SplitText, Flip, Draggable, InertiaPlugin, MorphSVG, DrawSVG, MotionPath, Observer, ScrollTo, Text/ScrambleText, CustomEase/Bounce/Wiggle, Physics2D, GSDevTools. Current: gsap 3.15.0, @gsap/react 2.1.2.
- **License**: Webflow "GSAP Standard License" (custom, NOT OSI open source). **Free for commercial use**, AI-generated code explicitly permitted, no Club membership/auth token exists anymore. Hard bans: building no-code visual animation tools that compete with Webflow; reverse engineering for competitive products; removing proprietary notices. If the project mandates OSI-only licenses, GSAP is out — use `motion` instead. (The `license: MIT` in vendored SKILL.md frontmatter covers only the gsap-skills docs repo, not the library.)
- **Vendored** (docs only — the runtime comes from npm):
  - `vendor/gsap/skills/` — GreenSock's 8 official agent-format guides: gsap-core (254 ln), gsap-timeline (107), gsap-scrolltrigger (296), gsap-plugins (433), gsap-react (135), gsap-frameworks (266), gsap-performance (79), gsap-utils (284), each `<dir>/SKILL.md`.
  - `vendor/gsap/skills/llms.txt` — 39-line routing index for those 8 skills (safe to read fully).
  - `vendor/gsap/llms.txt` — 514-line gsap.com doc-tree index (~412 links; grep only, never read fully).
- **Index**: no own TSV, but 29 `_index/components.tsv` components (all reactbits) list gsap as an npm dep: `awk -F'\t' '$5 ~ /gsap/' vendor/_index/components.tsv`
- **Project deps**: `npm install gsap @gsap/react` (@gsap/react only for React projects; peer deps gsap ^3.12.5, react >=17). Zero runtime dependencies. Zero-build HTML: `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js` (73 KB) + `.../dist/<Plugin>.min.js`.

## When to use / when NOT
Use for:
- Scroll-driven storytelling: pinned sections, scrubbed timelines, parallax (ScrollTrigger + ScrollSmoother).
- Hero/text reveals: line/word/char staggers via SplitText (3.13 rewrite: built-in masking, screen-reader aria).
- SVG logo/icon animation: MorphSVG shape morphs, DrawSVG stroke draw-on, MotionPath travel.
- Complex choreographed sequences: nested timelines, labels, position params, CustomEase/Bounce/Wiggle.
- Layout/state transitions CSS can't do: Flip plugin between DOM states.
- Draggable/inertia UI physics: sliders, throwable cards (Draggable + InertiaPlugin); confetti (Physics2D).

NOT for:
- Simple hover/fade/slide micro-interactions — plain CSS or `animista` keyframes beat a 73 KB runtime.
- React-idiomatic declarative enter/exit variants — sibling `motion` (framer-motion lineage) fits JSX better.
- Smooth-scroll-only needs — sibling `lenis` is smaller if you don't need ScrollSmoother's GSAP wiring.
- Prebuilt animated components — check `reactbits` first (29 of its variants already ship on gsap).
- No-code visual animation builders competing with Webflow — license-prohibited, refuse.

## How to consume (token discipline)
1. Route: read `vendor/gsap/skills/llms.txt` (39 lines) to pick the one relevant skill area.
2. Read ONLY that guide: `cat vendor/gsap/skills/gsap-scrolltrigger/SKILL.md` (largest is gsap-plugins at 433 lines; read one, not several — they cross-reference).
3. For exact API detail the skill lacks, grep the doc index for the page path, then fetch its markdown twin:
   `grep -i "splittext" vendor/gsap/llms.txt` → paths like `/docs/v3/Plugins/SplitText.md` → `curl -s https://gsap.com/docs/v3/Plugins/SplitText.md` (every gsap.com docs URL + `.md` works; URL-encode parens in method pages, e.g. `gsap.to%28%29.md`).
4. NEVER read `vendor/gsap/llms.txt` in full (514 lines of links) — grep it. Never fetch plugin source/dist/type files; the .md pages carry the whole API surface. `llms-full.txt` does not exist (404) — don't try.

## Core usage
```jsx
// npm install gsap @gsap/react   (React; vanilla omits @gsap/react)
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ESM from package root; gsap/dist/* for UMD/CJS
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP); // once, module scope; every plugin needs registering

function Hero() {
  const ref = useRef(null);
  useGSAP(() => {                 // auto gsap.context() cleanup on unmount (StrictMode-safe)
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 80%", scrub: 1 } })
      .from(".hero-line", { yPercent: 100, opacity: 0, stagger: 0.08, ease: "power3.out" });
  }, { scope: ref });             // scope: selectors match only inside ref
  return <section ref={ref}>…</section>;
}
```
Vanilla: same `registerPlugin` + `gsap.timeline()` calls in a `<script type="module">` or CDN UMD build. Responsive/reduced-motion: wrap variants in `gsap.matchMedia()` — the sanctioned path (auto-reverts per query, honors `prefers-reduced-motion`).

## Pitfalls
- Known upstream typo in `vendor/gsap/skills/gsap-scrolltrigger/SKILL.md` containerAnimation example: `Max.max(...)` must be `Math.max(...)` — fix when copying.
- Redistribution: shipping gsap inside your app/site is fine; do NOT bundle gsap runtime files into paid template packs or component products — have buyers install it as an npm dep.
- Lenis needs NO ScrollTrigger scrollerProxy — just `lenis.on('scroll', ScrollTrigger.update)` + the gsap ticker wiring (see sources/lenis.md). scrollerProxy is for transform-based smoothers only.
- Forgetting `gsap.registerPlugin(X)` — every plugin, once, before use; silent failure otherwise.
- SSR (Next/Nuxt): ScrollTrigger/ScrollSmoother touch `window` at registration. Register and animate client-side only (inside useGSAP/effects, `"use client"`), never during render/module top-level on the server.
- ScrollTrigger goes on the **timeline or a top-level tween**, never on a child tween inside a timeline: `gsap.timeline({ scrollTrigger: {...} }).to(...)` — not `.to(".a", { scrollTrigger })`.
- `scrub` and `toggleActions` are mutually exclusive on one ScrollTrigger (scrub wins). Pick one.
- Call `ScrollTrigger.refresh()` after dynamic content/images/fonts change layout; resize is auto, content is not. Multiple triggers created out of page order need `refreshPriority`.
- Don't animate the pinned element itself (`pin: true`) — animate its children. Leave `pinSpacing` default unless you know why.
- `markers: true` must not ship to production.
- React without useGSAP leaks tweens/ScrollTriggers on unmount — if stuck on plain useEffect, wrap in `gsap.context()` and `return () => ctx.revert()`.
- Pairing with `lenis` instead of ScrollSmoother: drive GSAP from Lenis (`lenis.on('scroll', ScrollTrigger.update)` + raf via `gsap.ticker`) — see the lenis card; don't run both smoothers.
- Never reference "unlocked"/nulled plugin repos (e.g. iboxz/gsap-plugins-unlocked) — obsolete piracy; the public `gsap` npm package contains every plugin.
- reactbits components pin `gsap@^3.13.0` — installing plain `gsap` (3.15.0) satisfies them; don't double-install.

## Refresh / fallback
- `bash scripts/sync.sh gsap` — re-fetches `vendor/gsap/llms.txt` and re-clones the official greensock/gsap-skills repo into `vendor/gsap/skills/`.
- On-demand fallbacks (verified):
  - `curl -s https://gsap.com/llms.txt` — current doc index.
  - `curl -s https://gsap.com/docs/v3/Plugins/ScrollTrigger.md` — any docs path + `.md` (encode parens: `https://gsap.com/docs/v3/GSAP/gsap.to%28%29.md`).
  - `curl -s https://data.jsdelivr.com/v1/packages/npm/gsap@3.15.0` — JSON manifest of all shippable plugin files for a version.
