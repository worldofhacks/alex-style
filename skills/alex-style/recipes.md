# Recipes — cross-source combinations that cohere

Each recipe names exact sources, files, and the wiring that makes them work together.
Find yours by grepping the tag lines, then read ONLY that section:
```bash
grep -n "covers:.*<term>" recipes.md     # e.g. covers:.*nav → recipe + line number
grep -A20 "{#<slug>}" recipes.md         # pulls one whole recipe
```
Adapt tokens to the design brief; never stack two recipes' background treatments on
one page. Default palette polarity and device tier come from the BRIEF — #light-mode
and #mobile-budget override any dark/desktop assumption in the recipe you compose.

## Routing: request → recipe

| Request | Recipe |
|---|---|
| statement hero, award-site energy | 1 #statement-hero |
| SaaS / marketing landing page (dark) | 2 #dark-saas |
| dashboard / app / admin shell | 3 #dashboard-shell |
| scroll story, pinned scenes | 4 #scroll-story |
| ambient WebGL section background | 5 #ambient-bg |
| zero-build static page (no npm) | 6 #zero-build |
| polish existing UI, page transitions | 7 #polish-pass |
| navbar / header / dock / sidebar | 8 #navigation |
| logo strip / testimonials / trust | 9 #social-proof |
| portfolio / work gallery | 10 #portfolio |
| 404 / error page | 11 #error-404 |
| stats / bento / metrics section | 12 #stats-bento |
| onboarding flow, empty states | 13 #onboarding |
| custom cursor / pointer effects | 14 #cursor |
| light-mode / B2B / minimal landing | 15 #light-mode |
| mobile, perf, reduced-motion pass | 16 #mobile-budget |
| blog / article / docs reading | 17 #editorial |
| full landing page from section blocks | 18 #landing-scaffold |
| layered 3D hover / depth cards | 19 #depth-card |
| parallax layers (scroll / mouse / gyro / CSS) | 20 #parallax-layers |
| distort / ripple page images & video | 21 #media-distortion |
| 3D product model / glTF hero | 22 #product-3d |
| scroll-scrubbed video / image sequence | 23 #scroll-scrub |
| hero / background video | 24 #hero-video |
| inline video player with controls | 25 #video-player |
| pricing / testimonials / footers / FAQ / auth pages | tailark sections — `grep -i "<section>" vendor/_index/sections.tsv`, ONE kit per project; wiring in 2 #dark-saas + 18 #landing-scaffold |
| forms / data tables / pickers / in-app navbars | origin — `grep -i "<need>" vendor/_index/application-ui.tsv`, application UI only; wiring in 3 #dashboard-shell |
| e-commerce blocks (cart, checkout, product grids) | no arsenal coverage — hand-build from brief tokens + shadcn/ui, reusing the page's entrance vocabulary |

## 1. Statement hero (award-site energy) {#statement-hero}
covers: hero, statement, shader, gradient, webgl, split-text, smooth-scroll, award, physics, wild
stack: React (shaders-react / R3F); zero-build heroes → #zero-build background route
1. Background default: Paper Shaders — pick a preset row from `vendor/_index/paper-shaders.tsv`, wire per `sources/paper-shaders.md` (the card carries the mandatory WebGL2 try/catch + CSS-gradient fallback and the reduced-motion `speed={0}` snippet — use them, do not re-derive). Exceptions: reproducing an exact shadergradient.co URL or a true-3D sphere/orbit look → `_index/shadergradient-presets.tsv` + `sources/shadergradient.md`; pointer-reactive scene → #ambient-bg. Footage-based hero → #hero-video; hero media that bends/ripples with scroll → #media-distortion (takes the same one-WebGL-canvas slot).
2. Render the canvas absolutely-positioned behind hero content, `pointer-events: none`.
3. Headline: `grep -iE "split|text" vendor/_index/components.tsv` — reactbits `SplitText-TS-TW` (gsap) or magicui `text-animate`. One text effect per page.
4. Scroll: `sources/lenis.md` init in layout; hero parallax via GSAP ScrollTrigger (`sources/gsap.md`; wire Lenis to the GSAP ticker — exact snippet in the lenis card).
5. CTA hover: brief's hover token only (e.g. 150ms scale). No extra flourish.
6. Wild tier (only when the brief names it): fancy `text-along-path` headline-on-a-curve or a `gravity` physics moment — `grep -i "wild:" vendor/_index/components.tsv`; ONE wild showpiece per page, and the Safari-fallback + reduced-motion + `autoStart` gates in `sources/fancy.md` apply by reference — never re-derive them.
Restraint: ONE WebGL canvas per page — the hero shader is it; nothing from vanta/ogl elsewhere; a step-6 wild showpiece takes the same slot (shader OR wild, not both).
Perf: Paper Shaders pauses off-viewport natively; reduced-motion → shader `speed={0}` + static headline (skip SplitText).

## 2. Dark SaaS landing page {#dark-saas}
covers: saas, landing, marketing, dark, features, launch, startup, pricing, testimonials, sections
stack: React (registry components); zero-build → #zero-build
1. Direction: `grep -i saas vendor/_index/inspiration.tsv` (102 refs); character palette from `grep dark-ui vendor/_index/palettes.tsv`.
2. Tokens: character palette FIRST, then map neutral ramps, hover/active states, and dark steps through Radix per `sources/radix-colors.md` — Radix is infrastructure, never the identity.
3. Hero background: subtle beams/grid, NOT WebGL — `grep -iE "beam|grid|dot" vendor/_index/components.tsv` (magicui `animated-grid-pattern`, `warp-background`; kokonutui alternatives). Product-demo footage → #hero-video anatomy; inline demo player → #video-player.
4. Social proof: magicui `marquee` with REAL marks — `scripts/get-logo.sh <brand>` from `vendor/_index/logos.tsv`; brand not in the TSV → styled text wordmark, never approximate a mark (trademark rules in `sources/svgl.md`). Full section wiring → #social-proof.
5. Feature grid: magicui `bento-grid` or kokonutui cards; icons phosphor duotone via `get-icon.sh <name> duotone`. bento-grid ships `@radix-ui/react-icons` + a shadcn button dep — swap its icons to phosphor to keep one icon family.
6. Numbers: magicui `number-ticker` on scroll-enter (deeper wiring → #stats-bento).
7. Pricing (and testimonial/footer/FAQ sections): `grep -i pricing vendor/_index/sections.tsv` (tailark) — pick ONE kit for the whole project (dusk OR mist OR veil, kit column), then run the card's replace-before-ship list verbatim (`sources/tailark.md`): placeholder brand logos swap to real marks via `scripts/get-logo.sh` (svgl rules), testimonial quotes AND hotlinked avatars NEVER ship, all placeholder copy rewritten. Full-page assembly → #landing-scaffold.
8. Entrances: animista `fade-in-bottom` family (`grep fade-in vendor/_index/animista.tsv`), staggered 60–90ms.
Restraint: ONE tailark kit per project — grep hits span all three kits, filter by the kit column; one glow treatment max.
Perf: entrances + marquee behind `prefers-reduced-motion` (marquee freezes to a static row; ticker renders final value).
License: animista CSS ships with the FreeBSD header comment from `vendor/animista/LICENSE.txt`.

## 3. Product dashboard shell {#dashboard-shell}
covers: dashboard, app, admin, product, shell, tool, internal, forms, tables, inputs, pickers
stack: React-only (motion-primitives + kokonutui are TSX)
1. Components: motion-primitives `accordion`, `disclosure`, `animated-number`, `morphing-dialog` + kokonutui inputs/cards — `grep -E "^(motion-primitives|kokonutui)" vendor/_index/components.tsv`.
2. Forms, inputs, data tables, pickers, in-app navbars: `grep -iE "table|picker|combobox|stepper|form|upload|navbar" vendor/_index/application-ui.tsv` (origin) — application UI ONLY, never hero/marketing/animation work (`sources/origin.md`; Tailwind v4 required — v3 silently drops its focus rings and popover animations).
3. Tokens: brief palette for identity; neutral ramps, border/input steps, hover/active states, and the dark mapping via `sources/radix-colors.md` (its shadcn token bridge keeps registry components working in both modes).
4. Icons: phosphor ONE weight (regular or duotone), sizes 16/20 only.
5. Micro-feedback: motion springs (`sources/motion.md`) for press/expand; animista `scale-in-center` at 200ms for popovers/toasts.
6. Onboarding, empty states, success moments → #onboarding.
Restraint: no page backgrounds, no lenis (native scroll for app UIs), no WebGL, no text effects — motion only as feedback; tailark marketing blocks and the fancy wild tier (physics / SVG filters / path-following) are BANNED on app surfaces.
Perf: `MotionConfig reducedMotion="user"` at the root; animista classes carry the reduce guard from their card.
License: animista FreeBSD header comment in the shipped CSS.

## 4. Scroll-driven story page {#scroll-story}
covers: scroll, story, scrollytelling, pinned, parallax, narrative
stack: any — React or vanilla (gsap CDN pin + `vendor/lenis/dist` per #zero-build)
1. `sources/lenis.md` + `sources/gsap.md` (ScrollTrigger; Lenis on the GSAP ticker — exact snippet in the lenis card). Do NOT add ScrollSmoother alongside Lenis — pick one smoothing layer.
2. Pinned scenes: GSAP timelines per section, `scrub: true`; multi-layer scenes use the #parallax-layers depth ratios; Apple-style frame-scrub product scenes → #scroll-scrub (a scrub showpiece replaces, never joins, a pinned scene).
3. Text: SplitText (free in 3.15) line-reveals as scenes enter; guidance in `vendor/gsap/skills/`.
4. Progress: motion-primitives `scroll-progress` (React) or a hand-rolled scaleX bar (vanilla).
Restraint: every scene must advance the story or it goes; no ambient WebGL competing with pinned scenes.
Perf: reduced-motion gates EVERY scrub/pin — static layout fallback, content readable without scroll-driven reveals.

## 5. Ambient section background (WebGL, controlled) {#ambient-bg}
covers: background, ambient, webgl, vanta, pointer-reactive, organic, interactive-bg
stack: any — React via npm, zero-build via two script tags (step 3)
Default for ambient/gradient/texture looks is Paper Shaders (#statement-hero step 1, `sources/paper-shaders.md`); vanta earns the slot ONLY for pointer-reactive or organic 3D scenes.
1. `grep <mood> vendor/_index/vanta.tsv` — fog (soft), waves (calm), net (techy), birds (playful), globe/rings (data-y). Options in the TSV `default_options` column; colors from brief.
2. React: `npm i vanta three@0.134.0`; init in `useEffect` on a ref'd div, `effect.destroy()` on unmount. three MUST be r134-line (`sources/vanta.md`). Project already on modern three? npm alias: `npm i three-r134@npm:three@0.134.0`, then `import * as THREE from 'three-r134'` and pass it: `NET({ el, THREE })` — never share the app's modern three instance with vanta.
3. Zero-build: copy `vendor/vanta/three.r134.min.js` + `vendor/vanta/dist/vanta.<effect>.min.js` into the project; two script tags; `VANTA.<EFFECT>({el})`.
4. Custom shader backgrounds (OGL/raw canvas, incl. seamlessly LOOPING ones): every noise function imports from `sources/noise.md`'s sanctioned files — never transcribed from Shadertoy/blogs; pick by the card's function table (tiling/derivatives/cost tier).
Restraint: one vanta instance per page, never in scroll-recycled lists; it consumes the page's one-WebGL-canvas budget.
Perf: pause off-viewport via IntersectionObserver; reduced-motion → destroy the effect, keep the static CSS fallback background the vanta card mandates.

## 6. Zero-build static page (no npm at all) {#zero-build}
covers: zero-build, static, vanilla, no-npm, html, csp, artifact
stack: any — this IS the no-React path the other recipes point at
Everything served from vendored files copied into the project:
- Scroll: `vendor/lenis/dist/lenis.min.js` + `lenis.css`.
- Background: Paper Shaders via the pinned jsdelivr `+esm` URL in `sources/paper-shaders.md` (one `<script type=module>`); strict-CSP pages copy its vendored dist tree instead. Pointer-reactive → #ambient-bg step 3.
- Animations: extract needed keyframes from `vendor/animista/keyframes.css` (`grep -oE` per SKILL.md) into a local `animations.css` + utility classes.
- Icons: `get-icon.sh <name> <weight> assets/icons/<name>.svg`, inline into HTML.
- Logos: `scripts/get-logo.sh <brand>` from `vendor/_index/logos.tsv`, consumed as `<img src>` — inlining risks id collisions (`sources/svgl.md`).
- GSAP (if needed): jsdelivr pinned `gsap@3.15.0/dist/gsap.min.js` — the one allowed CDN exception, or copy from a node_modules elsewhere.
- Parallax: the zero-JS CSS scroll-driven route in #parallax-layers step 4 — pure CSS behind `@supports`, no script at all.
- 3D model: `<model-viewer>` per #product-3d — one copied script + one tag; poster law applies.
Perf: reduced-motion guard on every animista class; shader speed 0 under reduce.
License: keep the FreeBSD notice from `vendor/animista/LICENSE.txt` in the CSS file header.

## 7. Micro-interaction polish pass (existing UI) {#polish-pass}
covers: polish, micro-interactions, hover, transitions, page-transitions, audit
stack: any — motion for React, animista utilities for non-React
Run as the LAST specialist pass (see orchestration.md Phase 2 rules).
1. Inventory interactive elements; map each to the brief's motion vocab.
2. Hovers/presses: motion `whileHover`/`whileTap` springs (React) or animista 150–300ms utilities (non-React). While touching each element: replace any `transition-all` with an explicit property list and add a `focus-visible` ring (`sources/review-packs.md`).
3. List/grid entrances: single `stagger` implementation, one direction.
4. Page transitions — pick ONE route by stack: (a) React SPA → motion `AnimatePresence`, 300ms, fade+8px; (b) modern browsers → `animateView()` view transitions, now free in motion core (`sources/motion.md`); (c) zero-build → animista paired in/out families (`slide-in-blurred-top` ↔ `slide-out-blurred-top`), same duration both directions.
Restraint: nothing animates that the brief doesn't name.
Perf: everything respects `prefers-reduced-motion`; transitions fall back to instant swaps.
License: any animista CSS added here carries the FreeBSD header comment.

## 8. Site navigation system (navbar / header / dock) {#navigation}
covers: nav, navbar, header, menu, dock, sidebar, tabs
stack: React-only (all routed components are TSX); zero-build navs are hand-built + the animista drawer pair
One nav identity per site — never stack a dock AND an overlay menu.
1. Pick tier by site energy: product/app → reactbits `PillNav-TS-TW` (sliding pill), motion-primitives `animated-background` (moving tab highlight), or kokonutui `smooth-tab`; marketing/award → reactbits `StaggeredMenu-TS-TW` or `CardNav-TS-TW` (full-screen/card overlays, gsap); playful/portfolio → `GooeyNav-TS-TW` / `BubbleMenu-TS-TW` / `FlowingMenu-TS-TW`; personal-site bottom bar → ONE dock (magicui `dock`, motion-primitives `dock`, or reactbits `Dock-TS-TW`); app sidebar/navbar → `LineSidebar-TS-TW` (dep-free) or origin navbars via `grep -i navbar vendor/_index/application-ui.tsv` (application surfaces only, `sources/origin.md`).
2. Dep traps before install: `PillNav-TS-TW` pins `react-router-dom` — in Next.js swap its Link/useLocation for next/link + usePathname; `CardNav-TS-TW` ships `react-icons` — swap to phosphor (one icon family per SKILL.md); kokonutui `morphic-navbar` imports `next/link` — reverse-swap outside Next (`sources/kokonutui.md`).
3. Mobile: overlay menus handle it natively; hand-built drawers use the animista pair `slide-in-top`/`slide-out-top` at 250ms.
4. Sticky chrome is hand-built (position:sticky + backdrop-blur from brief tokens); add scroll-hide only if the brief names it.
Restraint: nav motion ≤300ms; no WebGL in headers; icons 16/20, one weight.
Perf: gsap overlay menus fall back to instant open/close under `prefers-reduced-motion`.
License: animista drawer CSS ships the FreeBSD header comment.

## 9. Social-proof section (logos + testimonials + counts) {#social-proof}
covers: social-proof, logos, logo-strip, testimonials, tweets, trust, avatars
stack: React (marquee/cards); zero-build logo strips = plain flexbox + get-logo.sh SVGs
1. Logo strip: magicui `marquee` (dep-free; merge its `.css` keyframes — `sources/magicui.md` step 3) or reactbits `LogoLoop-TS-TW` (dep-free, hover-pause).
2. The marks: `scripts/get-logo.sh <brand>` from `vendor/_index/logos.tsv` (light/dark/wordmark variants are TSV columns — dark theme uses the `_dark` route, never CSS-invert). Brand not in the TSV → styled TEXT WORDMARK; never hand-draw a mark, never substitute phosphor `*-logo` glyphs. Nominative use only — no fabricated customer walls (`sources/svgl.md`). Size strips by height, width:auto.
3. Testimonials: live tweets → magicui `tweet-card` (TRAP: `react-tweet` fetches at render — client network dependency; breaks offline/SSG, skip for static exports). Static: kokonutui `tweet-card` (styled, no fetch) or hand-built quote cards from brief tokens.
4. Trust cluster: magicui `avatar-circles` + `number-ticker` ("12,000+ teams") — count animates once on scroll-enter.
5. Entrances: motion-primitives `animated-group` stagger or one animista `fade-in-bottom` family at 60–90ms — same vocab as the rest of the page, not a new one.
6. reactbits `ScrollVelocity-TS-TW` (scroll-reactive text marquee) only on marketing pages with real scroll length; never on app surfaces.
Restraint: ONE marquee per page; the marquee's duplicated loop content must be aria-hidden.
Perf: reduced-motion freezes marquee/ticker to static rows with final values.
License: animista header comment where used; logos are trademarks — MIT covers the collection, not the marks (`sources/svgl.md`).

## 10. Portfolio / work gallery {#portfolio}
covers: portfolio, gallery, work, masonry, case-study, images, showcase, physics, wild
stack: React-only (grids/hover are TSX); zero-build galleries = CSS columns + animista fades
1. Direction: `grep -i portfolio vendor/_index/inspiration.tsv` (58 refs).
2. Grid layer — pick ONE: reactbits `Masonry-TS-TW` (gsap, DOM-based, safe default) or `ChromaGrid-TS-TW` (grayscale→color hover, strong for client walls). 3D showpieces `CircularGallery-TS-TW` (ogl) / `DomeGallery-TS-TW` (@use-gesture/react) count as the page's ONE WebGL canvas — choosing one forbids paper-shaders/vanta elsewhere (#ambient-bg rule).
3. Tile hover: `TiltedCard-TS-TW` OR `PixelTransition-TS-TW` — one hover vocabulary across all tiles, never mixed. Layered multi-plane work cards (shadow/highlight depth scenes) → #depth-card; hover-glitch media tiles → the vfx-js route in #media-distortion — either still counts as the single hover vocabulary.
4. Detail views: magicui `lens` for zoomable shots; motion-primitives `image-comparison` for before/after case studies.
5. Entrances: magicui `blur-fade` staggered, or animista `fade-in` + `kenburns-top` (5s ease-out) on the cover image only — one kenburns instance per page.
6. Optional cursor flourish: `ImageTrail-TS-TW`, desktop `(pointer: fine)` only — gating rules in #cursor.
7. Wild tier (only when the brief names it): ONE fancy showpiece — `gravity` physics wall (skills/clients tiles as draggable bodies) or a gooey/pixelate SVG-filter hover — `grep -i "wild:" vendor/_index/components.tsv`; Safari-fallback + reduced-motion + `autoStart` rules per `sources/fancy.md` by reference, and it takes the page's showpiece slot (step 2's 3D galleries then forbidden).
Restraint: gallery imagery comes from the user — inspiration sources are reference-only, never assets.
Perf: explicit aspect-ratios on every tile (CLS; Masonry reflow needs known dimensions); lazy-load below the fold; reduced-motion → static grid, kenburns off.
License: animista header comment where its CSS ships.

## 11. 404 / error page {#error-404}
covers: 404, error, not-found, glitch, maintenance
stack: React for the glitch components; zero-build path in step 5
1. Direction: `grep -i 404 vendor/_index/inspiration.tsv` (23 refs).
2. Statement type: reactbits `FuzzyText-TS-TW` (dep-free canvas, built for giant 404 numerals) or `GlitchText-TS-TW` (dep-free CSS); kokonutui `glitch-text` is the alternative. Full-bleed backdrop instead: `LetterGlitch-TS-TW` (matrix rain). Pick text effect OR backdrop, not both.
3. Ambient background (optional, skip if LetterGlitch): one vanta effect per #ambient-bg — `fog` (soft) or `net` (techy); the vanta card names 404s a sanctioned use.
4. Recovery UI: hand-built from brief tokens — home link + search, phosphor icon at 20px, the brief's CTA hover only. Keep glitch effects OFF the recovery links (legibility is the job).
5. Zero-build: animista `text-flicker-in-glow` + #ambient-bg step 3's script-tag route.
Restraint: error pages are transient — no lenis, no scroll choreography; the moment lands in under a second.
Perf: reduced-motion → static 404 numeral, kill the canvas.
License: animista header comment on the zero-build path.

## 12. Stats & bento storytelling section {#stats-bento}
covers: stats, bento, metrics, numbers, counters, integrations, data
stack: React-only; zero-build stat rows are hand-built + animista entrances
1. Frame: magicui `bento-grid` (swap its `@radix-ui/react-icons` to phosphor — #dark-saas rule) or kokonutui `bento-grid`; reactbits `MagicBento-TS-TW` (gsap) for showpiece energy. ONE bento per page.
2. Numbers: pick ONE counter implementation site-wide — magicui `number-ticker`, reactbits `CountUp-TS-TW` / `Counter-TS-TW`, or motion-primitives `animated-number` / `sliding-number` — triggered once on in-view (mp `in-view` or the component's own observer). Two counter libraries on one page is animation soup.
3. Relationship tiles: magicui `animated-beam` (integration diagrams), `orbiting-circles` (ecosystem), `icon-cloud` (logo sphere). `globe` TRAP: needs `cobe` + a sized container, and it is a canvas — it spends the page's one-WebGL-canvas budget alongside any shader/vanta background.
4. Progress/activity: magicui `animated-circular-progress-bar` or kokonutui `apple-activity-card` for ring metrics.
5. Real charts (line/bar/area) DO NOT exist in the arsenal — hand-build with a charting lib from brief tokens or flag; never fake data-viz with decorative components.
Restraint: max 1–2 animated tiles per bento row — static tiles carry the grid.
Perf: all counters respect `prefers-reduced-motion` (render final value); beams/orbits pause off-viewport.

## 13. App onboarding flow + empty states {#onboarding}
covers: onboarding, empty-state, stepper, wizard, first-run, success, loading
stack: React-only
App surface — #dashboard-shell restraint applies (no page backgrounds, motion as feedback only).
1. Flow shell: reactbits `Stepper-TS-TW` (motion dep) as step indicator + motion-primitives `transition-panel` for step content — one slide direction, 300ms, brief easing.
2. Empty states: phosphor duotone icon + one-line explanation + primary action, hand-built from brief tokens. Sanctioned deviation from the 16/20 icon rule: empty-state glyphs may go 32–48px, same single weight. Entrance: animista `scale-in-center` at 200ms, first render only.
3. First-success moment: magicui `confetti` (deps `canvas-confetti` + a shadcn button registry dep) — fire ONCE on completion, never on revisits.
4. Waiting states: kokonutui `ai-loading` / `loader` for long agentic waits; skeletons are hand-built rectangles from brief tokens (no skeleton component exists in the arsenal).
5. Setup utilities: kokonutui `file-upload` (drag-drop import step), `action-search-bar` (command-palette pickers).
Restraint: onboarding is the user's first perf impression — zero WebGL, zero lenis; total added JS ≈ the motion runtime only.
Perf: confetti is pure decoration — skip entirely under `prefers-reduced-motion`; entrances too.
License: animista header comment for the entrance CSS.

## 14. Cursor identity layer (desktop showpiece polish) {#cursor}
covers: cursor, pointer, magnetic, click-effects, mouse, desktop-only
stack: React-only
ONE cursor treatment per site, and only when the brief names it — award-site vocabulary, never product UI.
1. Pick by energy: subtle → motion-primitives `cursor` or `magnetic` hover targets; portfolio → reactbits `TargetCursor-TS-TW` or `Crosshair-TS-TW` (both gsap); maximal → `SplashCursor-TS-TW` (dep-free but a heavy fluid sim — treat as the page's WebGL-budget spend) or `BlobCursor-TS-TW` (gsap).
2. Gate hard: mount only under `matchMedia('(pointer: fine)')` — never on touch; never hide the native cursor unless the replacement tracks at 60fps (a11y).
3. `ClickSpark-TS-TW` (click feedback) is the only stackable one — composes under any pointer treatment.
4. `Magnet-TS-TW` / motion-primitives `magnetic` on primary CTAs only, 2–3 elements per page max.
5. TRAP: magicui `smooth-cursor` declares `framer-motion` while the arsenal standardizes on `motion` — never install both (`sources/motion.md`); port its import to `motion/react` or prefer the mp/reactbits equivalents. magicui `pointer` is the lightweight alternative.
Restraint: this whole layer is optional; skip it silently unless the brief asks for it.
Perf: everything here runs per-pointermove rAF — do not combine with a WebGL background unless both are trivially light; disable wholesale under `prefers-reduced-motion`.

## 15. Premium light-mode landing page {#light-mode}
covers: light, light-mode, b2b, minimal, white, clean, enterprise
stack: React (glass/highlighter); zero-build works — texture, animista, and the shader route all have vanilla paths
The anti-#dark-saas: same page anatomy, inverted physics — depth on white comes from borders and shadow, not glow.
1. Palette: `grep light-ui vendor/_index/palettes.tsv` (25 rows) — near-white bg, ink text, ONE saturated accent. Ramps: map through the Radix LIGHT scales per `sources/radix-colors.md`; depth via 1px borders + layered soft shadows; the `step9_foreground` column in `vendor/_index/radix-colors.tsv` prevents the white-text-on-yellow/sky trap.
2. Skip the glow family — border-beam, shine-border, aurora, meteors read as smudges on white. Texture instead: magicui `dot-pattern` or `grid-pattern` at low opacity behind the hero.
3. Animated hero bg (optional): a light Paper Shaders preset from `vendor/_index/paper-shaders.tsv` at low speed (`sources/paper-shaders.md`), or shadergradient `cottonCandy` / `mint` (`_index/shadergradient-presets.tsv`); vanta's light-native rows are `clouds` (bg 0xffffff) and `ripple` (0xf6f6f6). One canvas max, per #ambient-bg. Footage hero instead → #hero-video (poster/autoplay law).
4. Accent moments: magicui `highlighter` (deps motion + rough-notation) for a hand-drawn underline on the ONE key claim; phosphor duotone tinted with the accent; glass (`GlassSurface-TS-TW`, kokonutui `liquid-glass-card`) only over textured/gradient zones — glass over flat white is invisible.
5. Entrances: animista `fade-in-bottom` family staggered 60–90ms; magicui `blur-fade` for hero media.
Restraint: if the page needs a dark band, it is ONE inverted section, not alternating stripes.
Perf: light mode fails quietly — muted text ≥4.5:1 (radix step 11/12 rules), verify accent-on-white for AA; reduced-motion → shader speed 0, entrances static.
License: animista header comment in the shipped CSS.

## 16. Mobile-first motion budget (cross-cutting pass) {#mobile-budget}
covers: mobile, touch, performance, budget, reduced-motion, battery, audit
stack: any — this pass constrains the other recipes
Run at brief time (decide tiers) and again pre-ship; applies to every other recipe.
1. Two axes, not one: device tier (pointer/width via `matchMedia` or `gsap.matchMedia()` — GSAP's sanctioned responsive API) and `prefers-reduced-motion` (user intent). Handle both independently.
2. Touch/narrow tier: entrances become animista CSS only (zero JS cost), zero cursor effects, zero WebGL — never mount paper-shaders/vanta/shadergradient/ogl on mobile; give the container a static CSS gradient from the same palette (the vanta card mandates a CSS fallback anyway; `scaleMobile` tunes density, it does not fix battery).
3. Lenis: skip on touch by default — native inertia beats lerp on phones; if kept, `syncTouch` is flaky on iOS<16 and Safari caps at 60fps (`sources/lenis.md`).
4. Bundle: on mobile-critical React pages use motion's `LazyMotion` + `m.div` (TRAP: `motion.div` breaks tree-shaking and throws the lazy-strict warning); prefer animista for anything fire-once.
5. React apps: `MotionConfig reducedMotion="user"` at the root; every animista class ships with the `@media (prefers-reduced-motion: reduce)` guard from its card.
6. Verify on-device: CPU-throttled scroll stays 60fps; no rAF loops (cursor, marquee, canvas) run while off-viewport — IntersectionObserver-pause them, per #ambient-bg.
Perf: this whole recipe IS the perf footer for the others.
License: animista header comment still applies to CSS extracted during this pass.

## 17. Long-form article / editorial reading polish {#editorial}
covers: editorial, article, blog, docs, reading, prose, typography, changelog
stack: any — scroll-progress is React; everything else degrades to CSS
Typography IS the design here and the arsenal cannot supply it — hand-build the prose column (60–75ch measure, brief type scale); the arsenal only adds the reading layer.
1. Direction: `grep -i editorial vendor/_index/inspiration.tsv` (53 refs).
2. Reading progress: ONE `scroll-progress` implementation (magicui or motion-primitives), pinned top. NO lenis — text-heavy reading is the lenis card's canonical "native scroll is correct" case.
3. Key-claim annotation: magicui `highlighter` (motion + rough-notation) fired once in-view — 2–3 annotations per article max; it is emphasis, not decoration.
4. Media: animista `kenburns-top` on the cover image only; magicui `lens` for zoomable figures/diagrams; motion-primitives `in-view` fades for figures; mp `progressive-blur` on overflowing related-article rails.
5. Body text NEVER animates — no entrances, no split-text, no per-paragraph reveals; prose must not wait for motion.
Restraint: the quietest recipe in the file by design — if a step feels omittable, omit it.
Perf: reduced-motion → kenburns and highlighter degrade to static.
License: animista header comment if kenburns CSS ships.

## 18. Full landing page from section blocks {#landing-scaffold}
covers: landing-scaffold, full-page, sections, blocks, pricing, testimonials, footer, faq, auth, scaffold
stack: React/Next + Tailwind >=4.1 ONLY — `mask-t-*`/`mask-radial-*` silently no-op below 4.1 and gut the hero treatments; Tailwind v3/v4.0 → hand-build path (routing table); non-Next → mechanical `next/link`→`<a>`, `next/image`→`<img>` swap per `sources/tailark.md`.
1. Pick the page: `awk -F'\t' '$3=="full-page"' vendor/_index/sections.tsv` (10 full landing compositions) — or compose sections: `grep -iE "hero|pricing|testimonial|footer|faq|login|sign-up" vendor/_index/sections.tsv`.
2. ONE kit per project — dusk OR mist OR veil (kit column); never mix kits across sections (`sources/tailark.md` — kits differ in radius, shadow, hover model, and typography; same law shape as the one-icon-weight rule).
3. Replace-before-ship pass (the card's list is law, run it before ANY styling): placeholder brand logos → real marks via `scripts/get-logo.sh` from `vendor/_index/logos.tsv` (brand absent → styled text wordmark, `sources/svgl.md`); testimonial quotes AND hotlinked avatars NEVER ship; rewrite ALL placeholder copy (upstream contains grammar errors); swap `/public` image refs and Unsplash hotlinks for project assets or gradient placeholders.
4. Icons: swap the blocks' lucide-react icons to phosphor, ONE weight (one icon family per SKILL.md).
5. Tokens: blocks consume shadcn CSS vars — wire the brief's palette through them per `sources/radix-colors.md`; brief polarity wins (#light-mode inverts, same anatomy).
6. Mobile nav: add `aria-expanded`/`aria-controls` + Escape-to-close to the CSS-only hamburger (a11y note in `sources/tailark.md`).
7. Motion beyond the blocks: reuse the #dark-saas entrance vocab (animista `fade-in-bottom`, 60–90ms stagger) — never introduce a second vocabulary on top of a scaffold.
Restraint: tailark supplies structure, not identity — ONE kit, one glow treatment; heavy-dep blocks (recharts/dotted-map/swiper/three) are flagged in the TSV, skip unless the brief needs them.
Perf: entrances behind `prefers-reduced-motion`; no WebGL on top of a full-page block unless #statement-hero explicitly replaces the hero section.
License: tailark is MIT; logos remain trademarks (`sources/svgl.md`); animista header comment if its CSS ships.

## 19. Layered depth card (hover-3D scenes) {#depth-card}
covers: depth, depth-card, layered, hover-3d, atropos, showcase, feature-card
stack: any — one atropos tarball ships vanilla/web-component/React builds (`sources/atropos.md`)
1. Route by class first: single-plane image tilt → reactbits `TiltedCard-TS-TW` or motion-primitives `tilt` (stay there for plain hover); a COMPOSED scene — multiple planes, projected shadow, highlight sweep — → atropos per `sources/atropos.md`. Wild-tier floating items stay with `sources/fancy.md`.
2. Layer convention: 3–5 children with `data-atropos-offset` — back planes negative (-5…-2, move less), subject 0, front accents positive (3…5, move most); readable text and CTAs sit at 0, never on a moving plane.
3. `shadow` grounds the card; the highlight sweep earns its place on dark/glass cards only — on flat white it reads as a smudge (#light-mode physics).
4. Gates BY REFERENCE to `sources/atropos.md`, never re-derived: the non-optional reduced-motion skip-init/destroy gate, `rotateTouch: 'scroll-y'` default (stock default eats page scroll), and the instance cap + IntersectionObserver destroy/re-init discipline for grids.
5. Zero-build path: two file copies + `Atropos({el})`; React gets `<Atropos>` with automatic cleanup — both in the card.
Restraint: a showpiece treatment — one depth-card grid OR 1–2 hero cards per page; every card on the page in 3D is a funhouse. Plain tilt remains the default hover vocab (#portfolio step 3).
Perf: each instance runs a perpetual rAF loop — the card's cap (~6–8) is law; avoid inside actively scrolling containers (cached-rect origin drift, card trap).

## 20. Parallax layers (scroll / mouse / gyro / CSS) {#parallax-layers}
covers: parallax, layers, depth-ratio, mouse-parallax, gyro, css-scroll-driven, scroll-depth
stack: any — GSAP+Lenis spine (React or vanilla); step 4 is the pure-CSS #zero-build route
ONE parallax system per page — scroll rig OR pointer rig OR CSS route, never two; Lenis stays the single smoothing layer (`sources/lenis.md` ticker pattern).
1. Scroll layers (GSAP ScrollTrigger on the Lenis spine): one timeline per section, `scrub: true`; each layer's `yPercent` scales by depth ratio — far bg 0.2×, mid 0.5×, subject 1× (the unmoving anchor), fg accent 1.2×. `will-change: transform` ONLY on the moving layers (≤4 elements), removed when the section leaves — never page-wide.
2. Image-window: media sized ~120% of its `overflow: hidden` mask so travel never exposes edges; explicit aspect-ratio on the mask (CLS).
3. Mouse/gyro rig: per-layer `gsap.quickTo` x/y — reuses one tween per property, per the vendored `vendor/gsap/skills/gsap-performance/SKILL.md` — gated `matchMedia('(pointer: fine)')`; same depth ratios as step 1. Gyro variant swaps in `deviceorientation` and REQUIRES the iOS tap-to-enable permission prompt, falling back to static.
4. Zero-JS CSS route (#zero-build pages): keyframes on `animation-timeline: view()` translate the layers on the compositor — behind a hard `@supports (animation-timeline: view())` gate. Chrome/Edge 115+ and Safari 26+ today; Firefox lands in 156 (Sept 2026) — progressive enhancement only, the static page must read perfectly without it.
Restraint: parallax is seasoning, never load-bearing — 2–4 layers max, content fully readable with zero movement; a #depth-card hover scene and a scroll rig on the same element is double-parallax soup.
Perf: reduced-motion kills every rig (static layout, no pin); touch/narrow tier → CSS route or nothing per #mobile-budget.

## 21. Media distortion (shader effects on page images & video) {#media-distortion}
covers: distortion, ripple, flowmap, media-fx, glitch, duotone, shader-media, gallery-morph
stack: any — curtains UMD single-file for zero-build, ESM elsewhere; vfx-js is ESM (`+esm` on no-npm pages)
1. Three-way routing: custom-shader or scroll-synced distortion of PAGE-FLOW `<img>`/`<video>` (scroll-bend, hover flowmap ripple, GSAP fullscreen gallery morph) → curtains, `sources/curtains.md`; one-line PRESET effects on media (glitch, duotone, pixelate, hueShift…) → vfx-js, `sources/vfx-js.md` + `grep -i <effect> vendor/_index/vfx-presets.tsv`; background GENERATION stays Paper Shaders/vanta (#ambient-bg) — never answer a background request from here.
2. curtains: planes are built FROM the real DOM media, position/size auto-synced; scroll-sync via the card's canonical Lenis pattern (`watchScroll: false` + `lenis.on('scroll')` → `updateScrollValues`) — it supersedes the upstream locomotive-scroll example; one smoothing layer, always.
3. Custom shader noise (flow, grain, voronoi displacement) imports from `sources/noise.md` only — sanctioned-source law, never Shadertoy transcriptions.
4. vfx-js: init via the `VFX.init()` null-check (no-WebGL → plain media); scroll-linked looks feed ScrollTrigger progress into per-frame uniform functions; element cap, pixelRatio, and stacking-context notes per `sources/vfx-js.md`.
5. Fallback law (why this class is safe): the fallback IS the original DOM element — onError class, skipped init, or reduced-motion all leave normal images/video; nothing can look broken.
Restraint: distorted media spends the page's ONE WebGL surface — never stacked with shader/vanta backgrounds on the same viewport region, never on chrome-controlled players (#video-player); one distortion vocabulary per page.
Perf: reduced-motion → skip plane creation / skip `vfx.add()` entirely (both cards mandate it); pixelRatio caps per card; dispose on unmount.

## 22. 3D product hero (glTF model + studio lighting) {#product-3d}
covers: 3d, model, gltf, glb, product-hero, model-viewer, hdri, environment
stack: any — `<model-viewer>` web component is the default (zero-build first-class); React/R3F alternative in step 5
1. Default: `<model-viewer>` per `sources/model-viewer.md` — one copied script + one tag. Poster law: the `poster` attribute ALWAYS ships (it is the LCP story); below-the-fold models load lazily and reveal on interaction.
2. Lighting from the shelf: `environment-image` pointing at a vendored HDRI — `grep -i <mood> vendor/_index/assets-3d.tsv` (studio_small_03 = product-studio, venice_sunset = golden-hour marketing), consumed per `sources/assets-3d.md`. Shelf glbs are placeholder/demo subjects — client heroes use the client's model with the shelf's lighting.
3. Reduced-motion recipe from the card is mandatory (drop auto-rotate + interaction-prompt, keep poster) — the bundle has zero built-in handling.
4. Scroll choreography: GSAP ScrollTrigger tweening `camera-orbit` — no new animation layer, the existing spine drives the camera.
5. React/R3F projects: reactbits `ModelViewer-TS-TW` or drei staging (Stage/Float/Environment) per `sources/r3f-drei.md` — including the CUBEMAP_ROOT trap: `environmentPreset` fetches raw.githack at runtime by default; always pass local shelf files via `Environment files=`.
Restraint: max ONE live `<model-viewer>` per page (card law — swap `src` for galleries); it spends the page's WebGL budget, so no shader/vanta background beside it; the 289KB runtime is video-hero budget — the model must BE the hero.
Perf: touch/narrow tier keeps the poster (`reveal="interaction"`) per #mobile-budget; never co-bundle the module build's modern three with vanta's r134 (card trap).
License: shelf assets are CC0 with per-file provenance rows in `vendor/_index/assets-3d.tsv` (`sources/assets-3d.md`); client models remain the client's.

## 23. Scroll-scrubbed product reveal (Apple-style) {#scroll-scrub}
covers: scrub, sequence, image-sequence, apple-style, scroll-video, canvas-frames
stack: any — rides the pinned GSAP spine; zero-build via the jsdelivr gsap exception (#zero-build)
1. Default: canvas image sequence via GreenSock's own `imageSequenceScrub` helper — indexed at `vendor/gsap/llms.txt` line 202, fetched via the `.md`-twin flow in `sources/gsap.md`; ~30 lines returning a tween wired to ScrollTrigger `scrub`.
2. Frame budget is data, not vibes: ≤150 frames; long edge 1600px desktop / 900px mobile; 2–4MB hero budget; preload all frames THEN pin; `ScrollTrigger.refresh()` after decode.
3. Frames come from ffmpeg at design time (never a runtime dependency): `ffmpeg -i in.mp4 -vf "fps=15,scale=1600:-2" frames/f_%03d.webp`.
4. `video.currentTime`-scrub alternative (keeps the `<video>` element): smooth ONLY on all-keyframe files — re-encode with `-g 1` (keyint=1) + `-movflags +faststart`; expect 2–3× file-size inflation, so prefer the image-sequence path for long sequences or 4K sources.
5. Lenis interplay inherited by reference: the ticker pattern in `sources/lenis.md`; one smoothing layer, one scrubbing answer.
Restraint: ONE scrub showpiece per page — it replaces a pinned #scroll-story scene, never joins one; every scrubbed frame must advance the product story.
Perf: reduced-motion → static poster/first frame, no pin, page reads without scrolling; small screens default to the poster or a reduced frame set.

## 24. Hero / background video craft {#hero-video}
covers: video, hero-video, background-video, autoplay, poster, footage
stack: any — a plain `<video>` element, zero libraries
1. Autoplay contract, all five or mobile silently blocks: `muted autoplay loop playsinline` + `poster`. NO controls on hero footage — chrome belongs to #video-player.
2. `preload="metadata"`; IntersectionObserver starts `play()` on viewport enter and `pause()` off-viewport — never let hidden footage burn battery.
3. The poster IS the LCP: a real exported frame from the footage, in a box with the video's explicit aspect-ratio (CLS).
4. Mobile data etiquette: tiered sources within the 2–4MB hero budget; `saveData`/narrow tier ships the poster only, per #mobile-budget.
5. Reduced-motion: swap to the static poster image — pause alone still shows a frozen player, the swap reads as designed.
6. Footage sourcing is law: `sources/video-policy.md` — video FILES are never vendored (all stock licenses prohibit redistribution); pick from its fetch-date-stamped rows. Scroll-linked shader treatment on footage (duotone, glitch) → #media-distortion.
Restraint: hero footage is the section's one showpiece — no WebGL background underneath, no text effects fighting moving pixels; dim/scrim the footage before lightening the type.
Perf: steps 2–5 ARE the perf story; verify autoplay on a real iPhone, not the simulator.
License: footage terms per `sources/video-policy.md`; the poster frame inherits the footage's license.

## 25. Branded inline video player {#video-player}
covers: player, video-player, demo-video, controls, testimonial-video, captions
stack: any — vanilla web components (zero-build friendly); React via npm `media-chrome/react`, never vendored
1. Class boundary first: visible-controls inline players (product demos, testimonials) → media-chrome, `sources/media-chrome.md`; hero/background footage → #hero-video with NO chrome; effects on media → #media-distortion.
2. Markup: `<media-controller>` wrapping `<video slot="media">` + a control bar composed from the card's vendored component subset (play, mute, volume, time range, time display, fullscreen).
3. Theme to the brief: start from an allowlisted player.style theme (minimal / microvideo / sutro — the card's allowlist is law; brand-lookalike themes are permanently excluded), then map colors/radius/hover through brief tokens via the `sources/radix-colors.md` bridge — the player must look like the site, not like a video site.
4. a11y ships in the dist (keyboard-operable ranges, i18n aria-labels) — compose the shipped components, never rebuild controls by hand.
5. Zero-build: jsdelivr `+esm` one-liner online; fully-offline pages copy the iife bundle per the card.
Restraint: never stack vfx-js/curtains effects on a chrome-controlled player — controls must stay legible and clickable; ONE themed player identity per site, reused for every inline video.
Perf: `preload="metadata"` + poster still apply (#hero-video anatomy); below-fold players lazy-mount; players never autoplay with sound.
