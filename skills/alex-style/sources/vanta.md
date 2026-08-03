# Vanta.js — webgl-backgrounds
> 14 prebuilt, mouse-reactive 3D/WebGL background effects (waves, net, fog, birds...) that attach to any DOM element in a few lines — no shader knowledge needed.

## At a glance
- **What**: Self-contained UMD builds (`VANTA.EFFECTNAME(options)`), one file per effect (~10–30KB min). 12 effects render via three.js, 2 (trunk, topology) via p5.js. Instance API: `setOptions()`, `resize()`, `destroy()`. Common options: `el, mouseControls (true), touchControls (true), gyroControls (false), minHeight, minWidth, scale, scaleMobile`.
- **License**: MIT (Copyright 2020 Teng Bao, `vendor/vanta/LICENSE.md`). Commercial use, modification, redistribution all permitted. README credits third-party shader origins (Inigo Quilez, Rune Stubbe, zz85, Kjetil Golid) but everything ships under MIT.
- **Vendored** (`vendor/vanta/`, ~960K): `dist/` — all 14 `vanta.<effect>.min.js` UMD builds (212K, copy verbatim into projects); `src/` — 14 unminified `vanta.<effect>.js` (132K, the authoritative per-effect param reference); `three.r134.min.js` (604K, the known-good three build at the vendor/vanta root — NOT in a `vendor/` subdir); `README.md` (225 lines, all framework recipes); `LICENSE.md`. p5.js is NOT vendored.
- **Index**: `vendor/_index/vanta.tsv` — 14 rows: `effect <TAB> dist_file <TAB> default_options`. Example: `awk -F'\t' '$1=="net"' vendor/_index/vanta.tsv` → `net  vendor/vanta/dist/vanta.net.min.js  color: 0xff3f81, backgroundColor: 0x23153c, points: 10, maxDistance: 20, spacing: 15, showDots: true`.
- **Project deps** (bundler path only): `npm i vanta three@0.134.0` (p5 effects: `npm i p5@1.1.9` too). Package frozen at 0.5.24 since 2022-09; zero deps declared — three/p5 always supplied by consumer. No `@types/vanta` exists.

## When to use / when NOT
Use for:
- Hero-section animated backdrop behind a headline (waves, fog, halo) — full-bleed in minutes.
- Tech/AI/network marketing look (net, globe, dots) recolored to brand hex ints.
- Ambient interactive login/signup/404 backgrounds; mouse/touch (optional gyro) reactivity for free.
- Generative-art section dividers via p5 effects (trunk, topology).

NOT for:
- Dashboards/admin/data-dense UI — continuous GPU loop distracts and drains battery.
- Custom gradient/texture looks — sibling `shadergradient` (shader planes/spheres, R3F) or CSS gradients; vanta is scenes, not gradients.
- Scroll-driven/choreographed motion — sibling `gsap` or `motion`; vanta is a fire-and-forget ambient loop.
- Lightweight CSS-only ambience or mobile-critical pages — sibling `animista`; vanta itself warns some effects fail on mobile (always set a CSS fallback background).
- Projects already on modern three (>=0.135) — vanta breaks (see Pitfalls); don't share a three instance with modern scene code.

## How to consume (token discipline)
1. Pick an effect from the index (name + defaults in one line): `awk -F'\t' '$1=="topology"' vendor/_index/vanta.tsv`. List all: `cut -f1 vendor/_index/vanta.tsv | tail -n +2`. The effect names in these examples are placeholders, NOT recommendations — shortlist 3 candidates per the brief and pick the most client-specific; the obvious/safe pick must beat two named alternatives.
2. Only if tuning beyond the tsv defaults, read the effect's source (50–200 lines each): `Read vendor/vanta/src/vanta.fog.js` — the `defaultOptions` / `getDefaultOptions()` object is the complete param list. NOTE: the tsv's `halo` row is empty (halo defines `getDefaultOptions()` instead of `prototype.defaultOptions`); get halo params from `vendor/vanta/src/vanta.halo.js` lines 13–31.
3. Ship the runtime: either `cp vendor/vanta/dist/vanta.<effect>.min.js vendor/vanta/three.r134.min.js <project>/public/` for script tags, or `npm i vanta three@0.134.0` for bundlers.
4. NEVER read `dist/*.min.js` or `three.r134.min.js` into context — minified bundles, copy only. README recipes: `grep -n -A 20 "React" vendor/vanta/README.md` rather than a full read.

## Core usage
React (bundler) — the canonical init/cleanup pattern; SSR-safe because it runs client-side only:
```jsx
import { useEffect, useRef, useState } from 'react'
import NET from 'vanta/dist/vanta.net.min'
import * as THREE from 'three'            // must be three@0.134.0

export default function Hero() {
  const ref = useRef(null)
  const [effect, setEffect] = useState(null)
  useEffect(() => {
    if (!effect && ref.current) {
      setEffect(NET({ el: ref.current, THREE,   // pass THREE explicitly; else it wants window.THREE
        color: 0xff3f81, backgroundColor: 0x23153c, points: 10, maxDistance: 20 }))
    }
    return () => { if (effect) effect.destroy() }   // mandatory cleanup on unmount
  }, [effect])
  return <div ref={ref} style={{ width: '100%', height: '100vh' }} />
}
```
Script-tag path (no build): load three r134 THEN the effect, then `VANTA.NET({ el: '#hero', ... })`. Colors are hex ints (`0xff3f81`), not strings. Live-retune with `effect.setOptions({ color: 0xff88cc })`; call `effect.resize()` if the container resizes outside window events.

## Pitfalls
- Project already on modern three (≥0.135)? Install both via npm alias — `npm i three-r134@npm:three@0.134.0` — then `import * as THREE from 'three-r134'` and pass it explicitly (`NET({ el, THREE })`). Never hand vanta the app's modern three.
- Effect sources import `./_base.js` (vendored at `vendor/vanta/src/_base.js`, with `_p5Base.js`/`_shaderBase.js`/`helpers.js`) — read it for shared lifecycle (resize/destroy) behavior.
- **three version trap (the big one)**: three >=0.125 removed `THREE.Geometry`, later versions removed `PlaneBufferGeometry` — three 0.143/0.144 render NOTHING (repo issues #101, #144). Pin `three@0.134.0` or use the vendored `vendor/vanta/three.r134.min.js`. Never reuse the app's modern three instance.
- **p5 effects**: trunk and topology need p5, which is NOT vendored here — supply `p5@1.1.9` (npm or CDN) and pass it as the `p5:` option (or `window.p5`).
- **clouds2** requires a `texturePath` noise texture (default `./gallery/noise.png`) that is not vendored — prefer `clouds`, or supply your own noise PNG.
- **SSR (Next/Nuxt)**: window-dependent; init only in `useEffect`/`onMounted`, always `destroy()` on unmount or you leak a WebGL context per navigation.
- Max 1–2 effects per page (site's own warning); birds is the heaviest (GPGPU flocking).
- Mobile: set a CSS fallback `background` on the container; some effects don't run on mobile. `scaleMobile` tunes density there.
- No TypeScript types anywhere; declare `declare module 'vanta/dist/*'` yourself if TS complains.

## Refresh / fallback
- `bash scripts/sync.sh vanta` (sparse-clones master → refreshes dist/, src/, three.r134.min.js, README, LICENSE). Package is frozen since 2022 — re-sync is almost never needed.
- On-demand fetch (verified 200): `curl -sO https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js` · `curl -sO https://raw.githubusercontent.com/tengbao/vanta/master/dist/vanta.net.min.js` · three pin: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js`.
