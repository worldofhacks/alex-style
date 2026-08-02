# Animista — CSS animation snippets
> Zero-runtime vocabulary of 664 named, pre-tuned CSS @keyframes (entrances, exits, text reveals, attention cues, kenburns/bg ambience) — paste-in CSS for any framework.

## At a glance
- What: 664 unique named @keyframes in 6 categories — basic 199, entrances 176, exits 157, text 53, attention 37, background 20 (22 index rows uncategorized). Each is a self-contained block; Animista's tuned per-family duration/easing/fill-mode defaults are vendored as structured data. No JS, no build step, framework-agnostic.
- License: FreeBSD (2-clause BSD), Copyright 2017 Ana Travas — explicitly free for personal AND commercial use. Hard constraint: redistribution must retain the copyright notice + conditions + disclaimer. `vendor/animista/LICENSE.txt` holds the full text; when copying CSS into a shipped project, keep a header comment: `/* Animations by Animista (https://animista.net) — FreeBSD License, (c) 2017 Ana Travas */`.
- Vendored: `vendor/animista/keyframes.css` (394 KB, ONE minified line, keyframes-only — no class rules, includes 648 `@-webkit-keyframes` duplicates); `vendor/animista/LICENSE.txt`; `vendor/animista/meta/<category>/<family>.ts` (81 small TS files from unocss-preset-animista with keyframes + default duration/easing/fill-mode per family).
- Index: `vendor/_index/animista.tsv` — 664 rows, columns: `animation  family  category  default_duration  default_easing  default_fill_mode`. Example: `grep 'blurred' vendor/_index/animista.tsv`.
- Project deps: none. Pure CSS copied into the project stylesheet. Never `npm install animista` — that package is a squatted 0.0.1 placeholder, not the catalog.

## When to use / when NOT
Wins at:
- Entrance/exit micro-animations for modals, toasts, dropdowns, route transitions (`scale-in-center`, `slide-in-blurred-top`, `puff-out-center`, paired in/out families).
- Hero headline text reveals (`tracking-in-expand`, `text-focus-in`, `focus-in-expand`).
- Attention cues on CTAs/badges (`heartbeat`, `jello-horizontal`, `vibrate-1`, `wobble-hor-bottom`).
- Image/background ambience with zero JS (`kenburns-top`, `bg-pan-left`, `color-change-2x`).
- Hover/state flourishes (`flip-in-hor-bottom`, `shadow-pop-tr`, `rotate-in-center`).

NOT for:
- Scroll-linked, interruptible, spring/physics, or orchestrated sequences → `motion` or `gsap` (with `lenis` for smooth scroll). These are fire-once CSS keyframes.
- Layout/FLIP transitions between measured states → `motion` (keyframes can't measure the DOM).
- Ambient WebGL backgrounds → `vanta` / `shadergradient`.
- Projects already on tailwindcss-animate/animate.css — a second animation vocabulary duplicates ~90% of the entrance/exit space; pick one.

## How to consume (token discipline)
NEVER Read/cat `vendor/animista/keyframes.css` — it is a single 394 KB line; any un-anchored grep also returns the whole file. Extract with `grep -oE` only.
1. Find candidates in the index (name/family/category, plus defaults in cols 4-6):
   `grep 'slide-in' vendor/_index/animista.tsv` or `awk -F'\t' '$3=="text"' vendor/_index/animista.tsv`
2. Extract exactly one block (200–900 bytes; `[^@]*` stops before the next `@` rule; the `@-` in webkit dupes means this pattern only matches the unprefixed block):
   `grep -oE '@keyframes slide-in-blurred-top\{[^@]*' vendor/animista/keyframes.css`
3. Get defaults from the same index row:
   `awk -F'\t' '$1=="tracking-in-expand"{print $4,$5,$6}' vendor/_index/animista.tsv` → `.7s cubic-bezier(.215,.61,.355,1.000) both`
   If cols 4-6 are empty (69 rows), read the family meta file — they are small and safe to read whole: `vendor/animista/meta/entrances/scale-in.ts`. If family is also empty (22 rows, e.g. `simple-fade-*`, `rotate-90-*`), default to `.5s ease both`.
4. Compose the utility class yourself (the dump ships NO class rules) and paste keyframes + class + license comment into the project CSS.

## Core usage
```css
/* Animations by Animista (https://animista.net) — FreeBSD License, (c) 2017 Ana Travas */
@keyframes scale-in-center{0%{transform:scale(0);opacity:1}100%{transform:scale(1);opacity:1}}
.scale-in-center{animation:scale-in-center .5s cubic-bezier(.25,.46,.45,.94) both}

@media (prefers-reduced-motion: reduce){
  .scale-in-center{animation:none}
}
```
Apply by adding the class in any framework. Attention-category families are loops — append `infinite` (their meta sets `counts: 'infinite'`): `.heartbeat{animation:heartbeat 1.5s ease-in-out infinite both}`. The extracted blocks still carry `-webkit-transform`/`-webkit-filter` longhands inside frames — harmless; strip for cleanliness.

## Pitfalls
- Keyframes-only dump: applying the class name without writing the class rule does nothing. Always emit `.NAME{animation:NAME <dur> <easing> both}` from the index defaults.
- SSR/above-the-fold flash: entrance keyframes + `both` fill start at `opacity:0`/`scale(0)`. If the class is present before hydration or before the element scrolls into view, content is invisible. Gate via IntersectionObserver or add the class on mount.
- Vendored meta has an upstream typo: heartbeat duration is `'1.5ss'` in `meta/attention/pulsate.ts` (index leaves it blank) — use `1.5s`.
- Naming is fully systematic: `effect[-in|-out]-[direction][-variant]` with `tr/br/bl/tl` corners, `hor/ver` axes, `fwd/bck` depth, `cw/ccw` rotation. In/out pairs exist for most families (`slide-in-blurred-top` ↔ `slide-out-blurred-top`) — use them for symmetric mount/unmount.
- The `meta/*.ts` files are UnoCSS-preset source (MIT) kept as a data reference — grep/read them for defaults; never import them into the target project.
- animista.net itself has no API, no npm package, no per-animation URLs — everything comes from the vendored mirrors.

## Refresh / fallback
`bash scripts/sync.sh animista`
On-demand fallbacks (verified):
- Full 664-keyframe dump (source of `keyframes.css`): `curl -sL https://raw.githubusercontent.com/vikrantyadav611/tailwindcss-animistacss/master/CSS/animista__keyframes.css`
- Per-family tuned defaults, structured TS: `curl -sL https://raw.githubusercontent.com/amihhs/unocss-preset-animista/main/packages/preset-animista/src/animista/entrances/scale-in.ts`
- Ready-made class+keyframes files (basic category only, 238 files): `curl -sL https://raw.githubusercontent.com/MADEiN83/react-animista/master/src/assets/flip/flip-horizontal-top.css`
