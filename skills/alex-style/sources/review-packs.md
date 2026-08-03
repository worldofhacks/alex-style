# Review packs — WIG + axe-core (Phase 4 review law)
> Two bundled reviewer-side sources: Vercel's Web Interface Guidelines (93-rule prose checklist) and the axe-core 4.12.1 accessibility engine locked to a closed 22-rule allowlist. Nothing here ever ships in a product build — this pack exists to turn Phase 4 findings from vibes into measurements without turning reviews oppressive.

## At a glance
- **What**: `wig/` — `command.md` (93 rules, 16 categories + 12 anti-patterns, output contract already matches the Phase 4 finding shape) and `AGENTS.md` (consume ONLY its `## Design` section), vendored VERBATIM; curation lives in this card, never as edits to the files. `axe/` — `axe.min.js` (573KB self-contained IIFE, the engine behind Lighthouse a11y), `rule-descriptions.md` (105 rules at v4.12.1), `allowlist.json` (the closed 22-rule set as a ready `runOnly` object).
- **License**: wig MIT (Copyright 2025 Vercel Labs, `vendor/review-packs/wig/LICENSE`). axe-core **MPL-2.0** — file-level copyleft is satisfied by shipping `axe.min.js` unmodified (header intact) with `vendor/review-packs/axe/LICENSE` (+ `LICENSE-3RD-PARTY.txt`) alongside. Never modify the file; never ship it in a product build — the review-time copy is deleted after the run.
- **Vendored** (`vendor/review-packs/`, ~600KB): `wig/{command.md,AGENTS.md,README.md,LICENSE}` · `axe/{axe.min.js,LICENSE,LICENSE-3RD-PARTY.txt,rule-descriptions.md,allowlist.json}`. Engine and rule doc are synced from the SAME tag (v4.12.1) — the doc regenerates per release, so mixed versions silently misdocument rule tiers/IDs.
- **Index**: `vendor/_index/review-rules.tsv` — 105 rows: `rule_id, impact, wcag_tags, description, in_allowlist`. `awk -F'\t' '$5=="yes"'` → the 22 sanctioned rules.
- **Project deps**: none, ever. axe runs against the served preview DOM at review time; WIG is prose.

## The axe pass — when it runs (and when it silently doesn't)
- **Optional by design, skip-silent**: run ONLY when (a) Playwright MCP browser tools are available AND (b) a served preview exists (Phase 3 ends with one). If either is missing, skip with no error and no mention — the prose lens still runs. The axe pass must never become a hard dependency of reviews; that is how review breaks on thin hosts.
- **Once, at Phase 4 start**, against the assembled Phase 3 preview — never per-section in Phase 2 (sections aren't composed yet; heading/landmark context would be wrong anyway).
- **The allowlist is a CLOSED set** (`vendor/review-packs/axe/allowlist.json`, 22 rules): contrast, accessible names, image/svg alts, aria validity, meta-viewport, tabindex/scroll-focus, heading-order. Reviewers may not widen it ad hoc. **Tag-based `runOnly` (`'wcag2a'`, `'best-practice'`) is FORBIDDEN** — it re-imports the region/landmark/heading-one noise cluster wholesale, the exact failure mode this pack was gated against. `target-size` (WCAG 2.2, disabled upstream) is the only sanctioned opt-in.

## Injection recipe (the only sanctioned way to run axe)
1. `cp vendor/review-packs/axe/axe.min.js <served-dir>/` — never paste the 573KB source into an evaluate call.
2. `browser_navigate` to the preview, then `browser_evaluate`:
```js
async () => {
  await new Promise((ok, err) => { const s = document.createElement('script');
    s.src = '/axe.min.js'; s.onload = ok; s.onerror = err; document.head.appendChild(s); });
  const allow = {"type":"rule","values":[/* paste runOnly.values from allowlist.json */]};
  const r = await axe.run(document, { runOnly: allow, resultTypes: ['violations', 'incomplete'] });
  return {
    violations: r.violations.map(v => ({ id: v.id, impact: v.impact,
      target: v.nodes.slice(0, 5).map(n => n.target.join(' ')), summary: v.help })),
    contrastNeedsHumanEye: (r.incomplete.find(i => i.id === 'color-contrast')?.nodes.length) ?? 0,
  };
}
```
3. Return ONLY violations as `{id, impact, target, summary}` plus ONE advisory line: "N text nodes over dynamic backgrounds need human contrast check" — routed to prose judgment, never reported as violations. Never return passes or incomplete node details.
4. `rm <served-dir>/axe.min.js` — a forgotten copy in `public/` ships 573KB of MPL code in the product build.

## What axe CANNOT check — the prose lens stays
**A clean axe run is NOT a clean a11y pass.** axe has zero rules for the lens-3 headline items; they remain prose review:
- `prefers-reduced-motion` fallbacks around every animista/gsap/motion effect
- focus-ring **visibility** (axe checks names/focusability, never whether a `:focus-visible` ring is visible)
- WebGL background cost (one canvas max, destroy on unmount)
- CLS from fonts
Also: `color-contrast` returns *incomplete*, not violations, over gradients/images/canvas — precisely the arsenal's vanta/shadergradient hero aesthetic — so the flagship rule is weakest exactly where contrast risk is highest. That is what the advisory count is for.

## WIG consumption — exclusion list (keyed to category/rule NAMES, never line numbers)
- **EXCLUDE the `Content & Copy` category** (7 rules: Title Case, "&" over "and", second person…) — Vercel brand voice; the design brief's voice wins.
- **EXCLUDE the `autocomplete="off"` on non-auth fields rule** — contradicts the same category's "inputs need autocomplete" and WCAG 2.2 SC 1.3.5 (Identify Input Purpose).
- **SCOPE `Hydration` + Next-specific rules** (`Image` priority, `<Link>`, nuqs, `suppressHydrationWarning`) as React/Next-only — pure noise against zero-build static pages (recipe 6).
- **SOFTEN "virtualize >50 items"** to dashboards/app lists only — a 60-logo marquee on a marketing page is not a finding.
- **From `AGENTS.md`, consume ONLY the `## Design` section** (layered shadows, concentric radii, hue-tinted borders, banding) as craft-lens vocabulary — the rest adds non-checkable runtime rules (iOS Low Power Mode, <500ms budgets) that produce speculative findings.
- **APCA is supplementary** — WCAG 2.x remains the compliance bar; never pass contrast on APCA alone.

## Reviewer consumption shape (anti-noise law)
- WIG rule ids are cited only for findings a reviewer would already raise at their severity gate — **the checklist sharpens findings, it does not generate them**. Never sweep command.md rule-by-rule against every file.
- Lens 3 (perf/a11y) reads `wig/command.md` minus the exclusions above, citing rule text + file:line. Lens 2 (craft) gets the ~20-rule marketing subset (focus-visible, reduced-motion, transform/opacity-only animation, no `transition: all`, img dimensions, alt text, aria-label on icon buttons, truncate + min-w-0, curly quotes/…, tabular-nums, safe-area insets, color-scheme) plus the AGENTS.md Design vocabulary.
- Typography micro-nits (curly quotes, ellipsis, nbsp) are batched: ONE finding per section, never per instance. The 12 anti-patterns are always reported individually — they are the high-signal dozen.
- Full checklist (forms, URL state, hydration, i18n, virtualization) runs only for dashboard/app builds and the dedicated polish pass — not on every marketing-page review.
- Build-time payoff (prevention beats findings): when adapting any arsenal component, replace `transition-all` with explicit property lists and add a `focus-visible` ring to interactive elements — 35 vendored payloads carry `transition-all` today.

## Pitfalls
- **NEVER adopt the `web-design-guidelines` skill wrapper** (vercel-labs/agent-skills): it is a 39-line stub whose whole mechanism is live-WebFetching command.md before each review — a direct violation of hard rule 1. The files are vendored here; use them.
- Allowlist erosion is the documented failure mode: one edit from rule-values to tags makes review oppressive. Treat `allowlist.json` as frozen; changes go through a gate review, not a reviewer's judgment call.
- Version skew: never mix engine and rule doc versions; `sync.sh` pulls both from the same pinned tag (`AXE_CORE_VERSION`) and fails loudly otherwise.
- `command.md` opens with slash-command YAML frontmatter (`$ARGUMENTS` placeholder) — ignore the frontmatter, read from `## Rules`.
- axe on `about:blank` or a `file://` page mostly works, but the recipe assumes an HTTP-served dir so `<script src>` resolves — serve, don't open.

## Refresh / fallback
- `bash scripts/sync.sh review-packs` then `node scripts/build-catalogs.mjs`. Pinned: `AXE_CORE_VERSION=4.12.1` (bump both engine and doc together; check the allowlist ids still exist in the new rule-descriptions.md — the catalog build fails loudly if not).
- On-demand (verified 200): `https://registry.npmjs.org/axe-core/-/axe-core-4.12.1.tgz` · `https://raw.githubusercontent.com/dequelabs/axe-core/v4.12.1/doc/rule-descriptions.md` · `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`.
