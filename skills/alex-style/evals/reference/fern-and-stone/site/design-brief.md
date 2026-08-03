# Design brief — Fern & Stone

Direction: Warm, editorial, unhurried — a small landscaping studio that reads like a garden
journal, not a contractor flyer. Light stone-paper ground, deep forest ink, one bright fern
accent used sparingly. Grounded in layers palette `cmbgd7y9v` and reference patterns from
Icebug (bold editorial outdoor hero), Aster Botanics (white editorial layout), and
Natured Headlines (natural typographic mood) — direction only, no imagery copied.

Palette (semantic tokens derived from layers palette cmbgd7y9v — raw order not shipped):
- bg `#f6f5ef` (warm stone-white) · surface `#ffffff` · surface-2 `#edefe2` (pale sage panel)
- text `#1f2410` · muted `#5c6450`
- accent `#243c24` (deep forest — buttons, links, contact band)
- accent-2 `#829a64` (sage — duotone icons, borders, details)
- highlight `#cde284` (fern chartreuse — hovers, selection, CTA on dark; sparingly)
- earth `#a36e45` (terracotta — eyebrow labels only)
- accent-contrast `#f4f8ea` (text on accent)

Type: display 'Iowan Old Style'/Georgia serif (system, no web fonts — page must work offline);
body system-ui sans. Scale: 12 14 16 20 24 32 48 64.

Spacing: 4px base — 4 8 12 16 24 32 48 64 96 | Radius: 8/16/999 | Border: 1px solid rgba(31,36,16,.14)

Motion (closed vocabulary, all behind prefers-reduced-motion):
- durations 150/300/600ms, easing cubic-bezier(.22,1,.36,1) for transitions
- entrances: animista `fade-in-bottom` (.6s cubic-bezier(.39,.575,.565,1) both),
  staggered 90ms, gated by IntersectionObserver (no above-the-fold flash)
- hero headline: animista `tracking-in-expand` — the ONE text effect on the page
- hover: 150ms color/underline; buttons translateY(-1px)
- NO other motion vocab. No WebGL, no kenburns, no attention loops.

Icons: phosphor, weight=duotone (one weight for the whole page), sizes 16/20/24 only,
inline SVG, colored via currentColor.

Background: solid tokens; alternate sections on surface-2; hero gets one hand-authored
decorative SVG (organic fern/stone shapes in palette colors) — decorative only, aria-hidden.

Stack: zero-build static HTML/CSS/JS, opens from file://. Lenis 1.3.25 vendored
(js/lenis.min.js + css/lenis.css) for smooth scroll + anchor easing; no npm, no CDN.

Sections:
- Header: sticky; leaf mark + wordmark; anchor nav (Services, About, Process, Contact); CTA.
- Hero: terracotta eyebrow, serif display headline (tracking-in-expand), subcopy, two CTAs,
  small stat row; decorative organic SVG panel on the right.
- Services: 6 duotone icon tiles — plant / shovel / wall / scissors / drop / tree-evergreen.
- About: two columns — story + check-list of differentiators.
- Process: 3 numbered steps on a sage panel.
- Testimonials: 2 quote cards with quotes icon.
- Contact: deep-forest band — phone / envelope-simple / map-pin rows, hours, CTA.
- Footer: small print + Animista (FreeBSD) / Phosphor (MIT) / Lenis (MIT) credits.
