# Recipes — cross-source combinations that cohere

Each recipe names exact sources, files, and the wiring that makes them work
together. Adapt tokens to the design brief; never stack two recipes' background
treatments on one page.

Named items inside recipe steps are the proven wiring EXAMPLE of a class,
never the default pick: sample the class
(`bash scripts/vary.sh vendor/_index/components.tsv 8 "<class>"`), shortlist
three per Rule 0, and run YOUR pick through the same wiring. A build whose
choices match a recipe's named items row-for-row is a variation defect.

## Craft floor (applies to every recipe, every build)

- Business/marketing pages ship the full conversion anatomy: hero with a
  proof point, services/features, social proof, process or about, a WORKING
  contact form or explicit contact band, footer. A missing section needs a
  reason, not a shrug.
- Rhythm: no two adjacent sections share the same background treatment —
  alternate tints, dark bands, dividers; sparse-next-to-sparse is a defect.
- House-register marketing pages ship editorial furniture (recipe 9): kicker,
  standfirst, at least one pull-quote, oversized numerals on stats/process,
  captions on imagery — each carrying REAL copy. Furniture that could be
  deleted without losing information is decoration: make it informative or
  cut it.
- shadcn is plumbing, never a look: any primitive pulled in via
  `registry_deps` ships fully re-dressed in brief tokens (type, radius,
  border, color). If a screenshot of any element could pass for a shadcn
  demo, that element is a defect.
- Combine sources per the recipes: a hero without motion, a marketing page
  without scroll behavior, sections without entrances are unfilled roles —
  reach for the combination, not the single tool.
- Placeholders: never abstract filler art. Omit the section, or make the
  placeholder look intentional (styled cards, real copy, CSS treatments)
  and mark it for replacement.
- Every recipe ends with an **Amplify** ladder — sanctioned escalations, in
  order. Climb it by default (Rule 0): stop only where the brief, the stack,
  or a restraint ceiling stops you — never out of laziness. Each rung must
  pass the coherence check (brief tokens, one motion vocabulary, one icon
  weight); Amplify extends a recipe, it never stacks a second recipe's
  background or text vocabulary. New arsenal sources join recipes as new
  rungs, so the ladders are also where the arsenal grows.
- Before calling a build done: RENDER IT AND LOOK AT IT. Ask: does the page
  deliver the ELEVATED brief's concept and signature moment — or just the
  literal prompt? does it read as ART-DIRECTED — composed grounds with warmth,
  characterful type, a human touch — or does it carry generated tells (raw
  #fff/#000 ground, default-flavor type, centered-column stacking all the way
  down)? is there at
  least one memorable moment? does the rhythm hold through a full scroll?
  would the chosen inspiration references sit comfortably beside it? how many
  arsenal sources are genuinely working together? how many Amplify rungs did
  you climb — and can you justify every rung you skipped? is it impressive,
  exciting, engaging — or merely correct? would this exact hero appear on any
  other client's site? (if yes, re-pick the treatment — see Rule 0 variation
  law). Fix, re-look, then ship. Full rubric: `evals/judging.md`.
- Reveal gating is JS-conditional by construction: elements hidden before an
  entrance (`opacity: 0` pre-reveal) get that state ONLY under a root class
  set by script (`<script>document.documentElement.classList.add('js')</script>`
  in head → `html.js .reveal { opacity: 0 }`) — no-JS, failed-JS, and crawler
  renders show the full page. Content trapped by its own reveal gating is an
  instant axis-3 failure (evals/judging.md); this pattern makes it structurally
  impossible.
- Shipping gate: append the build's signature row to the skill's `ledger.tsv`
  (schema + axes in orchestration.md "Variation protocol"). A build with no
  ledger row isn't done — the ledger is how the NEXT build stays unique.

## 1. Statement hero (award-site energy)

Animated background + split-text reveal + smooth scroll — the full treatment.
0. Direction FIRST: grep `_index/inspiration.tsv` for the vertical, palette
   from `_index/palettes.tsv`/brand → brief tokens (orchestration.md Phase 0).
1. Hero moment — shortlist 3 across classes per Rule 0: a shadergradient
   preset (`_index/shadergradient-presets.tsv`, R3F:
   `npm i @shadergradient/react @react-three/fiber three`) vs a vanta scene
   (recipe 5's mood map) vs a paper-shaders texture field
   (`_index/paper-shaders.tsv` — grain/mesh/halftone, zero-dep) vs a
   component background (grep
   `beam\|grid\|particle` in `components.tsv`). Pick the most client-specific;
   render absolutely-positioned behind the hero, `pointer-events: none`.
2. Headline: reactbits `SplitText-TS-TW` (GSAP) or magicui `text-animate` —
   ONE text-effect vocabulary per page, and the hero owns it.
3. Scroll: `sources/lenis.md` init in layout, wired to the GSAP ticker (card
   snippet); hero parallax + below-fold reveals via ScrollTrigger.
4. Below the hero is still a full page (craft floor anatomy): entrances from
   ONE animista family staggered 60–90ms, phosphor icons ONE weight, proof
   row via magicui `number-ticker`.
5. CTA hover: brief's hover token only (e.g. 150ms scale).
Amplify: hero depth layers + mouse rig (recipe 8, steps 2–3) → marquee logo
strip under the hero → motion-primitives `scroll-progress` → the hero's SAME
text effect as line-reveals on section headlines (extend the vocabulary,
never add a second one) → recipe 9 furniture: kicker above the display
headline, standfirst deck, one mid-scroll pull-quote sharing the hero's
text vocabulary.
Restraint ceiling: ONE WebGL canvas, one text vocabulary, one icon weight.

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
   to keep one icon family, and re-dress the pulled-in primitives in brief
   tokens (stock shadcn styling never ships — craft floor).
5. Numbers: magicui `number-ticker` on scroll-enter.
5b. Pricing: no pricing component exists in the arsenal — hand-build from
   brief tokens as an editorial object (oversized price numerals, kicker
   tier labels, hairline rules — recipe 9 translated to dark), reusing the
   section entrance vocab. Never a stock shadcn card grid.
6. Entrances: animista `fade-in-bottom` family (grep `_index/animista.tsv`),
   staggered 60–90ms, wrapped in `prefers-reduced-motion` guard.
7. Scroll: lenis on the gsap ticker; scroll-enter triggers via ScrollTrigger
   or IntersectionObserver — a marketing page never ships on raw scroll.
8. One text moment on the hero headline (magicui `text-animate` or reactbits
   `SplitText-TS-TW`) — the page's single text-effect vocabulary.
Amplify: section image drift (recipe 8, step 4) → motion-primitives
`accordion` for the FAQ → kokonutui cards for
testimonials → magicui `shine-border` on the featured pricing tier (css-
carrying: orchestrator merges its globals) → `warp-background` as ONE section
divider (this spends the page's component-background budget) → recipe 9
furniture translated to dark: kickers, oversized stat numerals, one
pull-quote, hairline rules in the palette's line color.

## 3. Product dashboard shell

Restraint: no page backgrounds, motion only as feedback.
1. Components: motion-primitives (`accordion`, `disclosure`, `animated-number`,
   `morphing-dialog`) + kokonutui inputs/cards. Grep `components.tsv` col 1
   filter `motion-primitives\|kokonutui`.
2. Icons: phosphor ONE weight (regular or duotone), sizes 16/20 only.
3. Micro-feedback: motion (`sources/motion.md`) springs for
   press/expand; animista `scale-in-center` (200ms) for popovers/toasts.
4. No lenis (native scroll for app UIs), no WebGL, no text effects.
Amplify (feedback depth, never decoration — ambition in an app UI means every
interaction answers): motion-primitives `morphing-dialog` for detail views →
`animated-number` on every KPI that changes → `disclosure` rows →
motion layout animations on list reorder/filter → hover + `focus-visible` +
press states on EVERY interactive element. Nothing else moves.

## 4. Scroll-driven story page

1. `sources/lenis.md` + `sources/gsap.md` (ScrollTrigger; Lenis on GSAP
   ticker — exact snippet in lenis card). Do NOT add ScrollSmoother when using
   Lenis — pick one smoothing layer.
2. Pinned scenes: GSAP timelines per section, scrub: true.
3. Text: SplitText (free in 3.15) line-reveals as scenes enter; guidance in
   `vendor/gsap/skills/`.
4. Progress: motion-primitives `scroll-progress`.
5. Reduced-motion: gate every scrub/pin; provide static fallback.
Amplify: layered depth inside pinned scenes (recipe 8 ratios per layer) →
scrubbed count-ups inside pinned scenes (gsap, numbers land as the
scene completes) → per-scene token shifts (background/accent custom props
tweened by scene, still the brief's palette) → phosphor chapter icons in a
sticky mini-nav → the SAME SplitText vocabulary on each scene's kicker line
→ oversized chapter numerals + one pull-quote per act (recipe 9),
scrub-revealed with their scene.

## 5. Ambient section background (WebGL, controlled)

vanta for organic scenes when shadergradient is too abstract.
1. All 14 effects, by mood — birds (playful flocking), cells (organic),
   clouds/clouds2 (open sky), dots (minimal pulse), fog (soft mist), globe
   (worldwide/data), halo (aura glow), net (connected/techy), rings (orbital),
   ripple (liquid), topology (drifting terrain, p5), trunk (organic growth
   rings, p5), waves (ocean swell). Row order and card examples are ARBITRARY —
   never treat any effect as the default. Shortlist 3 that could serve the
   brief, pick the one most specific to THIS client; options in the TSV's
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
Amplify: recolor EVERY effect option to brief hex ints (never ship stock
colors — stock colors are how every vanta site looks the same) → choreograph
the overlay content's entrances against the scene (animista family, staggered)
→ CSS fallback background that carries the same palette when WebGL is absent.

## 6. Zero-build static page (no npm at all)

**The reference build (`evals/reference/fern-and-stone/`) is this recipe
executed to the craft floor — study it before building.** Its floor: full
conversion anatomy (hero + proof stats, services, checklist about, process,
testimonials, contact band), alternating panel rhythm, ONE animista text
effect on the hero, lenis, phosphor duotone, palette + refs from the indexes.
Everything served from vendored files copied into the project:
- Scroll: `vendor/lenis/dist/lenis.min.js` + `lenis.css`.
- Background: recipe 5's zero-build path, or paper-shaders via native
  `<script type="module">` (its core dist is relative-import ESM — snippet
  in sources/paper-shaders.md; needs no bundler).
- Type: typography.tsv pair via Fontshare kit download or woff2 self-host
  (`sources/typography.md` zero-build path; FFL license laws apply).
- Human touch: rough-notation IIFE (global `RoughNotation`) or roughjs
  IIFE (global `rough`) — both single-file copies.
- Animations: extract needed keyframes from `vendor/animista/keyframes.css`
  (grep -o per SKILL.md) into a local `animations.css` + utility classes; keep
  the FreeBSD notice from `vendor/animista/LICENSE.txt` in the file header.
- Icons: `get-icon.sh <name> <weight> assets/icons/<name>.svg`, inline into HTML.
- GSAP (if needed): jsdelivr pinned `gsap@3.15.0/dist/gsap.min.js` — the one
  allowed CDN exception, or copy from a node_modules elsewhere.
Amplify: CSS scroll-driven layer drift + atropos hover-depth work cards
(recipe 8, step 6 — both zero-build) → a vanta zero-build scene behind the
hero (recipe 5's shortlist + its Amplify recoloring; spends the ONE canvas) → gsap count-ups on the stats band
→ a recurring SVG motif (divider/watermark drawn from the brand's language)
carried through every section → CSS-only marquee for a logo/keyword strip
→ recipe 9 furniture, zero-build by nature: kicker, standfirst, pull-quote,
drop cap, oversized numerals are plain HTML+CSS.

## 7. Micro-interaction polish pass (existing UI)

Run as the LAST specialist pass (see orchestration.md Phase 2 rules).
1. Inventory interactive elements; map each to the brief's motion vocab.
2. Hovers/presses: motion `whileHover`/`whileTap` springs (React) or animista
   150–300ms utilities (non-React).
3. List/grid entrances: single `stagger` implementation, one direction.
4. Page transitions (Next.js): motion `AnimatePresence`, 300ms, fade+8px.
5. Audit: nothing animates that the brief doesn't name; everything respects
   `prefers-reduced-motion`.
Amplify: `focus-visible` rings on every interactive element (missing rings are
a defect, not a style choice) → unify stray icon families to the project's one
phosphor weight → ONE signature hover on primary CTAs (drawn from the brief's
motion vocab, used consistently) → staggered list/grid entrances where lists
exist → replace `transition: all` with explicit property lists as you touch
each element.

## 8. Depth system (parallax + hover-depth, cross-cutting)

ONE depth system per page — pick the rungs that serve the brief, all wired to
the same scale. No dedicated parallax library, ever: every one lost the
head-to-head to gsap+lenis already vendored.
1. Depth scale in the brief: three ratios (e.g. 0.9 / 0.75 / 0.5 of scroll
   speed) — every parallax element uses one of them, nothing freelances.
2. Hero layers: background art / midground subject / foreground accent as
   separate elements; ScrollTrigger `scrub: true` on the lenis spine moves
   each at its ratio (`sources/gsap.md` + `sources/lenis.md` ticker wiring).
3. Mouse/gyro depth on hero art: `gsap.quickTo(el, "x"/"y")` per layer at the
   same ratios, ±8–24px travel; kill on touch devices and reduced-motion.
4. Section drift: images/cards travel 20–40px over their scroll window (same
   scrub) so depth recurs through the page, not only in the hero.
5. Hover-depth cards (portfolio/work/product): atropos multi-plane scenes —
   `sources/atropos.md` is law (reduced-motion gate, `rotateTouch:'scroll-y'`,
   6–8 instance cap, IO destroy/re-init in grids). Single-plane tilt stays
   with reactbits `TiltedCard`/motion-primitives tilt.
6. Zero-build path (recipe 6 pages): CSS `animation-timeline: scroll()`/
   `view()` for layer drift as progressive enhancement (no-support browsers
   get the static page); atropos works from two copied files.
Restraint ceiling: one depth system, one scale; parallax never fights a
pinned-scene recipe 4 scrub on the same element; everything static under
`prefers-reduced-motion`; `will-change: transform` only on moving layers.

## 9. Editorial magazine system (cross-cutting, the house register made concrete)

The furniture that makes a page read as art-directed print — every piece
FUNCTIONAL (it carries real copy and aids scanning), every piece animated
from the arsenal, none of it component-library flavored. Default on all
house-register marketing/landing builds; translate the register per brief
(orchestration.md Phase 0 "Aesthetic").
1. Grid: compose on a real 12-col grid and BREAK it deliberately — offset
   text blocks, full-bleed images, overlapping layers; at least one section
   escapes the centered column. Archetype comes from the brief's ledger row
   (Variation protocol), so no two builds break the grid the same way.
2. Type furniture, top to bottom: kicker/eyebrow (small caps + hairline
   rule), display headline (tight leading, 3–5× body), standfirst/deck
   paragraph, pull-quotes (oversized, hung punctuation), a drop cap on ONE
   section's opening paragraph, captions under imagery, oversized numerals
   for stats and process steps, running folio (section number + name:
   "01 — Services"). Faces come from a sampled `_index/typography.tsv` pair
   (sources/typography.md — never Frankenstein two rows' display faces).
   Link language: pick ONE animated-underline or letter-swap hover from the
   `fancy` source and use it for nav + inline links page-wide, colors from
   brief tokens.
3. Rules & ornament: hairline rules structure sections; one recurring SVG
   motif drawn from the brand's language (also the natural home of the
   register's human touch — hand-drawn underline, annotated stat, stamp).
   Tools: `rough-notation` for hand-drawn annotation of live copy (its
   card's color + scarcity laws apply) and `roughjs` for organic motif/
   hachure shapes (accent-only) — the three-way boundary law lives in
   sources/roughjs.md.
4. Motion ON the furniture, from the page's existing vocabularies (never new
   ones): the hero's SplitText/text-animate vocabulary reused as line-reveals
   on pull-quotes; gsap scrubbed count-ups on oversized numerals; hairline
   rules draw in (`scaleX` 0→1 on ScrollTrigger); captions enter with the
   page's animista family.
5. Ticker strips: magicui `marquee` (or recipe 6's CSS-only marquee) styled
   as a magazine spine/ticker — keywords, press, clients — not a naked logo
   row.
6. Imagery treated, never naked: duotone/tint in brief colors, intentional
   crops, image+caption blocks — or a paper-shaders halftone/dither
   treatment (`halftone-dots`, `image-dithering`, recolored to brief inks);
   a bare stock photo is a placeholder defect.
Amplify: work/feature cards as magazine covers with atropos hover-depth
(recipe 8 rung 5: cover art / oversized numeral / title on separate planes)
→ sticky mini-nav of running folios (phosphor, one weight) → full-bleed
spread sections with layer drift (recipe 8 rung 4/6) → hung punctuation +
optical margin alignment on every pull-quote → a static paper-shaders
texture ground on ONE band (`paper-texture`/`grain-gradient`, speed 0,
brief colors) → breathing variable-font display moment (fancy
`breathing-text` with a variable face from the typography pair).
Restraint ceiling: furniture serves scanning — kicker, standfirst, and
pull-quotes carry real copy, numerals real numbers; if deleting a piece
loses no information it was decoration (cut it or make it informative); one
drop cap per page, folios consistent page-wide, and the motion vocabularies
stay the page's existing closed set.
