# Stripped third-party runtimes (alex-style vendor law)

sync_curtains deletes three bundled files from these examples at sync time:

- `multiple-planes-scroll-effect-custom-scroll/js/locomotive-scroll.min.js`
- `multiple-planes-scroll-effect-custom-scroll/locomotive-scroll.min.css`
- `gsap-click-to-fullscreen-gallery/js/gsap.min.js`

Locomotive-scroll: the arsenal allows ONE smoothing layer — lenis. The lenis
wiring in `sources/curtains.md` (custom-scroll recipe) SUPERSEDES this
example's locomotive setup 1:1 (`watchScroll: false` + `lenis.on('scroll')` ->
`curtains.updateScrollValues()` + `curtains.needRender()`).
gsap.min.js: a stale bundled copy of an arsenal source — load GSAP per
`sources/gsap.md` instead.

The examples are reference reading, not runnable-as-is; never re-fetch the
stripped files from upstream.
