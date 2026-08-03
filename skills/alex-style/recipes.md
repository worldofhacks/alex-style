# Recipes — cross-source combinations that cohere

Each recipe names exact sources, files, and the wiring that makes them work
together. Adapt tokens to the design brief; never stack two recipes' background
treatments on one page.

## 1. Statement hero (award-site energy)

Shader gradient + split-text reveal + smooth scroll.
1. Background: `sources/shadergradient.md` → pick preset from
   `_index/shadergradient-presets.tsv` (halo = warm plane, pensive = purple
   sphere, mint = water). `npm i @shadergradient/react @react-three/fiber three`.
   Render absolutely-positioned behind hero, `pointer-events: none`.
2. Headline: grep `split\|text` in `_index/components.tsv` — reactbits
   `SplitText-TS-TW` (GSAP-based) or magicui `text-animate`. One text effect
   per page.
3. Scroll: `sources/lenis.md` init in layout; hero content parallax via GSAP
   ScrollTrigger (`sources/gsap.md`, wire Lenis to GSAP ticker — see card).
4. CTA hover: brief's hover token only (e.g. 150ms scale). No extra flourish.
Cost note: one WebGL canvas — do not add vanta elsewhere on the page.

## 2. Dark SaaS landing page

1. Direction: `grep -i saas vendor/_index/inspiration.tsv`; dark palette from
   `_index/palettes.tsv` (many are dark-mode).
2. Hero background: subtle beams/grid, NOT WebGL — grep
   `beam\|grid\|dot` in `components.tsv` (magicui `animated-grid-pattern`,
   `warp-background`; kokonutui alternatives).
3. Social proof: magicui `marquee` for logos.
4. Feature grid: magicui `bento-grid` or kokonutui cards; icons phosphor
   duotone via `get-icon.sh <name> duotone`. Note: bento-grid ships with
   `@radix-ui/react-icons` + shadcn button deps — swap its icons to phosphor
   to keep one icon family.
5. Numbers: magicui `number-ticker` on scroll-enter.
5b. Pricing: no pricing component exists in the arsenal — hand-build from
   brief tokens (plain markup + shadcn/ui), reusing the section entrance vocab.
6. Entrances: animista `fade-in-bottom` family (grep `_index/animista.tsv`),
   staggered 60–90ms, wrapped in `prefers-reduced-motion` guard.

## 3. Product dashboard shell

Restraint: no page backgrounds, motion only as feedback.
1. Components: motion-primitives (`accordion`, `disclosure`, `animated-number`,
   `morphing-dialog`) + kokonutui inputs/cards. Grep `components.tsv` col 1
   filter `motion-primitives\|kokonutui`.
2. Icons: phosphor ONE weight (regular or duotone), sizes 16/20 only.
3. Micro-feedback: motion (`sources/motion.md`) springs for
   press/expand; animista `scale-in-center` (200ms) for popovers/toasts.
4. No lenis (native scroll for app UIs), no WebGL, no text effects.

## 4. Scroll-driven story page

1. `sources/lenis.md` + `sources/gsap.md` (ScrollTrigger; Lenis on GSAP
   ticker — exact snippet in lenis card). Do NOT add ScrollSmoother when using
   Lenis — pick one smoothing layer.
2. Pinned scenes: GSAP timelines per section, scrub: true.
3. Text: SplitText (free in 3.15) line-reveals as scenes enter; guidance in
   `vendor/gsap/skills/`.
4. Progress: motion-primitives `scroll-progress`.
5. Reduced-motion: gate every scrub/pin; provide static fallback.

## 5. Ambient section background (WebGL, controlled)

vanta for organic scenes when shadergradient is too abstract.
1. `grep <mood> vendor/_index/vanta.tsv` — fog (soft), waves (calm), net
   (techy), birds (playful), globe/rings (data-y). Options in the TSV's
   default_options column; colors from brief.
2. React: `npm i vanta three@0.134.0`; init in `useEffect` on a ref'd div,
   `effect.destroy()` on unmount. three MUST be r134-line (see card — newer
   three breaks vanta). Project already on modern three? Install both via npm
   alias: `npm i three-r134@npm:three@0.134.0`, then
   `import * as THREE from 'three-r134'` and pass it: `NET({ el, THREE })` —
   never share the app's modern three instance with vanta.
3. Zero-build: copy `vendor/vanta/three.r134.min.js` + `vendor/vanta/dist/
   vanta.<effect>.min.js` into the project; two script tags; `VANTA.<EFFECT>({el})`.
4. One vanta instance per page, never in scroll-recycled lists; pause when
   off-viewport via IntersectionObserver.

## 6. Zero-build static page (no npm at all)

Everything served from vendored files copied into the project:
- Scroll: `vendor/lenis/dist/lenis.min.js` + `lenis.css`.
- Background: recipe 5's zero-build path.
- Animations: extract needed keyframes from `vendor/animista/keyframes.css`
  (grep -o per SKILL.md) into a local `animations.css` + utility classes; keep
  the FreeBSD notice from `vendor/animista/LICENSE.txt` in the file header.
- Icons: `get-icon.sh <name> <weight> assets/icons/<name>.svg`, inline into HTML.
- GSAP (if needed): jsdelivr pinned `gsap@3.15.0/dist/gsap.min.js` — the one
  allowed CDN exception, or copy from a node_modules elsewhere.

## 7. Micro-interaction polish pass (existing UI)

Run as the LAST specialist pass (see orchestration.md Phase 2 rules).
1. Inventory interactive elements; map each to the brief's motion vocab.
2. Hovers/presses: motion `whileHover`/`whileTap` springs (React) or animista
   150–300ms utilities (non-React).
3. List/grid entrances: single `stagger` implementation, one direction.
4. Page transitions (Next.js): motion `AnimatePresence`, 300ms, fade+8px.
5. Audit: nothing animates that the brief doesn't name; everything respects
   `prefers-reduced-motion`.
