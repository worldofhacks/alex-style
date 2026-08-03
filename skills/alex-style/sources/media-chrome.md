# media-chrome — branded inline video players
> 11 core player-chrome web components @ **media-chrome 4.19.2** (MIT, Mux) + 3 curated player.style themes — the ONLY arsenal answer for styled video player UI; the alternative is the browser's unstylable native controls.

## At a glance
- **What**: Web components (`<media-controller>` + control elements) that wrap a real `<video>`/`<audio>` and replace native chrome with fully CSS-stylable controls. Framework-free custom elements; a11y (i18n aria-labels, arrow-key ranges, hotkeys) is built into the shipped dist — see the A11y section for what was verified.
- **License**: MIT, (c) 2020 Mux, Inc. (`vendor/media-chrome/LICENSE`). player.style themes are also MIT (per-theme `package.json`). Note the LICENSE file has no "MIT License" heading — it opens with the copyright + permission grant; sync gates on the grant text.
- **Vendored** (`vendor/media-chrome/`, ~700K): `dist/` — 40-file ESM import closure of the 11 core controls (play/mute/volume-range/time-range/time-display/duration-display/fullscreen/poster/loading + controller/control-bar) plus `media-theme-element` and their base classes/utils/media-store/lang-en; `dist/iife/all.js` (241K) — the zero-build offline bundle, and the ONLY iife build that defines `<media-theme>` (`iife/index.js` does not — verified at 4.19.2); `themes/{minimal,microvideo,sutro}/` — `template.html` + `package.json` each, pinned to muxinc/player.style commit in `PIN.json`; `LICENSE`, `package.json`, `PIN.json`.
- **NOT vendored, by law**: `dist/react` + `dist/cjs` (they drag `ce-la-react` — the package's only dep, grep-proven react-wrapper-only, so the vanilla subset is dependency-free), `menu/`, cast/airplay/live/pip/seek/captions buttons, dialogs. The npm package serves those; the vendored subset is the audited core.
- **Index**: `vendor/_index/player-themes.tsv` — 3 rows: `theme, npm_pkg, mood, controls, template_bytes, template_file` (controls column is a build-time census of each template — trust it over memory).
- **Project deps**: React → `npm i media-chrome@4.19.2` (exact pin) and import from `media-chrome/react`. Vanilla bundler → same package, import element modules. Zero-build online → pinned CDN `https://cdn.jsdelivr.net/npm/media-chrome@4.19.2/+esm`. Fully-offline zero-build → copy `vendor/media-chrome/dist/iife/all.js` (plain `<script src>`, it's an IIFE).

## Routing (law) — one answer per video class
- **Player UI** (product demo, testimonial, tutorial, any inline video the user controls) → **HERE**. This class has no other arsenal answer.
- **Hero/background video** → recipes.md `#hero-video` with **NO chrome**: a plain `muted playsinline loop` `<video>` + poster. Controls on ambience are a category error — they invite interaction with what is decoration, steal the hero's focus, and the autoplay contract (muted, no controls) IS the hero recipe. Never put a `<media-controller>` around a background video.
- **Effects ON media** (glitch, duotone, shader transitions) → `vfx-js`. Never stack VFX-JS or curtains.js on a chrome-controlled player: both drive a canvas overlay ON TOP of the media — over a player that means a second surface fighting the control overlay for pointer events, plus the page's one-WebGL-surface budget spent on a utility element. Effect-treated footage is ambience by definition → route it to `#hero-video`, chromeless.
- **Scroll-scrubbed video** → the `#scroll-scrub` recipe (GSAP image-sequence), not a player.

## When to use / when NOT
Use for:
- Product-demo and testimonial players on marketing pages whose chrome must match the brief (accent color, radius, focus ring) — grep `player-themes.tsv` for a theme, or compose from the 11 controls.
- Docs/changelog walkthrough videos, course/lesson players, audio players (same elements work with `<audio slot="media">`).
NOT for:
- Hero/background/ambient video (chromeless, `#hero-video`), GIF-replacement loops, video-as-texture (curtains/vfx-js classes).
- Streaming stacks needing HLS/DASH/cast/live UI — that's the full npm package + mux-player territory; the vendored subset deliberately excludes those controls.

## How to consume (token discipline)
1. Pick a theme: `cat vendor/_index/player-themes.tsv` (3 rows, reading fully is fine). Need a control the census lacks → compose your own chrome instead.
2. `vendor/media-chrome/dist/iife/all.js` is minified — **NEVER read it**; copy it beside the page.
3. `dist/*.js` ESM files are readable source — read ONE component only when tuning behavior (e.g. `media-chrome-range.js` for range semantics); never bulk-read the tree.
4. Theme `template.html` files are meant to be read/edited whole when customizing chrome layout.

## Core usage
Compose-your-own chrome (zero-build, fully offline — copy `dist/iife/all.js` to the page):
```html
<script src="/media-chrome/all.js"></script>  <!-- copied vendor/media-chrome/dist/iife/all.js -->
<media-controller>
  <!-- slot="media" is REQUIRED; remove any native `controls` attribute — leaving it renders double UI -->
  <video slot="media" src="/demo.mp4" poster="/demo-poster.jpg" playsinline crossorigin></video>
  <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
  <media-control-bar>
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <media-time-display showduration></media-time-display>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```
Brief-token theming — chrome inherits the page's design brief through CSS custom properties (all names verified in the 4.19.2 dist/themes). Radix bridge: hover = step 4, solid accent = step 9, focus ring = step 8 (`sources/radix-colors.md` role split):
```css
media-controller {
  --media-primary-color: var(--fg);                 /* icons + range thumb */
  --media-secondary-color: var(--surface);          /* control-bar background family */
  --media-control-background: transparent;
  --media-control-hover-background: var(--accent-4);
  --media-range-bar-color: var(--accent-9);         /* played portion of the time range */
  --media-range-track-background: var(--accent-a5); /* alpha step over the poster */
  --media-focus-box-shadow: 0 0 0 2px var(--accent-8);  /* NEVER remove — keyboard focus ring */
  border-radius: var(--radius-lg); overflow: hidden;
}
```
Vendored theme (themes use controls BEYOND the 11-control subset — airplay/cast/pip/seek etc. — so they run on `iife/all.js`, the CDN `+esm`, or npm; NOT on the copied ESM subset):
```html
<script src="/media-chrome/all.js"></script>
<template id="player-theme"><!-- paste vendor/media-chrome/themes/minimal/template.html contents --></template>
<media-theme template="#player-theme">
  <video slot="media" src="/demo.mp4" poster="/demo-poster.jpg" playsinline crossorigin></video>
</media-theme>
```
React (npm wrapper — NEVER vendored; this is where the `ce-la-react` dep enters):
```tsx
'use client'  // custom elements are client-only; the wrapper ships no directive (verified) — add it yourself
import { MediaController, MediaControlBar, MediaPlayButton, MediaMuteButton,
  MediaVolumeRange, MediaTimeRange, MediaTimeDisplay, MediaFullscreenButton } from 'media-chrome/react'
// npm i media-chrome@4.19.2 — themes: npm i @player.style/minimal → import '@player.style/minimal/react'
```
Next.js: mount client-side only (`'use client'` file or `dynamic(..., { ssr: false })`). The dist imports `server-safe-globals` so module *import* never crashes SSR — but element registration/rendering is browser-only.

## A11y — what was verified in the shipped dist (why this source earned its slot)
- `media-chrome-range.js`: `keysUsed = ["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]` (line 488) — ranges are keyboard-operable; aria-disabled propagation at 342–357.
- `media-play-button.js` + every button: `aria-label` set through the i18n `t()` layer; `lang/en.js` vendored, en fallback baked into `utils/i18n.js`; tabIndex managed in `media-chrome-button.js`.
- `media-controller.js`: hotkeys (space/arrows seek + volume) with per-key `nohotkeys` opt-out.
- Eval contract: `evals/check-arsenal.mjs` asserts the arrow-key + aria-label wiring survives every sync; the fixture player must pass the Phase 4 axe pass (Wave 1 review pack, 22-rule allowlist) with keyboard operation of the time range.

## Pitfalls
- **Bumping the pin is a subset re-audit, not an edit**: dist internals reshuffle between versions — re-run the import-closure audit before changing `MEDIA_CHROME_VERSION`; the sync closure gate fails loud if upstream grows the graph.
- **Theme allowlist is closed data** (minimal/microvideo/sutro). Brand-lookalike themes (`notflix`, `yt`, `vimeonova`, `winamp`, `instaplay`) are **permanently excluded** — trade-dress imitation fails the marketing-grade bar. Excluded means never vendor, never imitate their look by hand either. The catalog builder refuses to index any non-allowlisted theme.
- Themes reference no external assets (sync-gated) — safe for fully-offline pages; keep it that way when customizing (no CDN fonts/icons inside templates).
- `slot="media"` missing → blank controller. Native `controls` attribute left on → double chrome.
- Keep `--media-focus-box-shadow` visible against the poster — it is the focus ring; setting it to `none` is the #1 way to fail the axe pass.
- Poster always (`#hero-video` craft rules apply to the media element itself: poster, `preload="metadata"`, mobile-sized sources).
- One live player per view is the taste ceiling on marketing pages; a wall of players is a gallery → thumbnails + one player (or the magicui `hero-video-dialog` lightbox, which remains the modal answer).
- CDN use must pin `media-chrome@4.19.2` — never `@4`/`latest` (upstream moves fast; 5.x will break the subset assumptions unaudited).

## Refresh / fallback
- `bash scripts/sync.sh media-chrome && node scripts/build-catalogs.mjs` — re-fetches the pinned tarball + themes at the pinned player.style commit; every gate miss keeps the previous copy (version/license/dep-surface, 40-file closure, iife defines `<media-theme>`, a11y contract greps, theme MIT + no-external-assets).
- Pins live in `sync.sh` (`MEDIA_CHROME_VERSION`, `PLAYER_STYLE_SHA`) and are recorded in `vendor/MANIFEST.json` + `vendor/media-chrome/PIN.json`. Bump deliberately: re-run the closure audit, re-verify theme templates, re-check the theme allowlist against new upstream themes (new original designs may be *proposed*; lookalikes never).
- Upstream health at audit (2026-08): Mux-backed, pushed 2026-07, 3 open issues, 2.7k stars; player.style pushed 2026-06. Docs: media-chrome.org (verified statements quoted in the audit; vendored-first per hard rule 1).
