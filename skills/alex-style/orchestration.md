# Orchestration — parallel design swarm

For any build bigger than a single component: full landing page, multi-screen
app, marketing site, dashboard. For one component or a tweak, stay solo — a
swarm adds overhead without payoff.

## Why a brief comes first

Parallel agents produce incoherent design unless every choice that spans
sections is made ONCE, up front, in writing. The brief is the contract; section
agents never invent tokens, colors, fonts, easing, or icon weights.

## Phase 0 — Direction (orchestrator, solo)

1. Interpret the request: audience, vertical, mood, constraints.
2. Ground it in references:
   `grep -i "<vertical>" vendor/_index/inspiration.tsv` — pick 3–5 references,
   note the *patterns* they share (layout, density, motion character).
3. Pick color: `vendor/_index/palettes.tsv` (real curated 5-color palettes) or
   brand colors. Derive semantic tokens (bg, surface, text, muted, accent,
   accent-contrast) — don't ship raw palette order.
4. Write `design-brief.md` **in the target project root**:

```markdown
# Design brief — <project>
Direction: <2 sentences: mood, density, era, references>
Palette: bg #… surface #… text #… muted #… accent #… (usage rules)
Type: <display font / body font, scale: 12 14 16 20 24 32 48 64>
Spacing: 4px base — 4 8 12 16 24 32 48 64 96 | Radius: <e.g. 8/16/full> | Border: <1px solid …>
Motion: durations 150/300/600ms, easing cubic-bezier(.22,1,.36,1); entrances
  <e.g. fade+8px rise>; hover <e.g. 150ms scale 1.02>; NO other motion vocab
Icons: phosphor, weight=<one weight>, size 16/20/24 only
Background: <treatment + which source, e.g. shadergradient preset=halo hero only>
Stack: <React/Next/Tailwind versions; shadcn present? zero-build?>
Sections: <list with 1-line spec each>
```

## Phase 1 — Scaffold (orchestrator, solo)

One owner for shared state — NEVER parallelize global files. Create: project
scaffold, `globals.css`/Tailwind theme with the brief's tokens, layout shell,
font loading, npm deps that multiple sections need (union of `npm_deps` from
chosen components — check `vendor/_index/components.tsv` cols 5–6), Lenis/
provider wiring if used.

**Pre-install shared components here, not in Phase 2.** Any arsenal component
whose item JSON carries `.css`/`.cssVars` payloads (marquee, shimmer-button,
shine-border…) needs `globals.css`/theme edits — section agents can't touch
those files, so the orchestrator copies these components and merges their CSS
now. Section agents then import them; a section agent that discovers it needs
another css-carrying component reports it instead of installing it.
Commit or checkpoint before fan-out.

## Phase 2 — Section fan-out (parallel agents)

One agent per section (hero, features, pricing, footer…) or per screen.
Dispatch in a SINGLE message so they run concurrently. Prompt template:

```
Build the <section> of <project> at <project path>.
READ FIRST: <project>/design-brief.md — it is law; do not invent tokens.
Skill arsenal: <skill dir> — read SKILL.md "Routing" section, then use ONLY:
  - components: grep vendor/_index/components.tsv, read matched item, adapt to brief tokens
  - icons: bash scripts/get-icon.sh <name> <weight from brief>
  - animations: grep vendor/_index/animista.tsv per brief's motion vocab
  <allowlist only the source slugs this section needs; name relevant recipes.md entry>
Write ONLY: <project>/components/sections/<section>.tsx (+ sub-components in
  components/sections/<section>/). Do NOT touch globals.css, layout, package.json —
  list any new npm dep in your report instead.
Verify: renders without errors against existing scaffold; uses brief tokens only.
Report: files written, components/sources used, new deps needed, deviations.
```

Rules that keep the merge clean:
- **File ownership is exclusive.** Section agents write only their own files.
- Missing dep → reported, installed by orchestrator after fan-out.
- Specialist passes that touch many files (motion polish, a11y) run AFTER
  section agents complete, sequentially, not alongside.

## Phase 3 — Assembly (orchestrator, solo)

Install reported deps, compose sections in the layout, wire Lenis/observers,
resolve collisions, run build + fix type errors. Then screenshot/preview.

## Phase 4 — Review swarm (parallel agents)

Dispatch reviewers with distinct lenses; each returns findings, touches nothing:
1. **Cohesion**: every section vs brief — token drift, off-scale spacing, alien
   motion, mixed icon weights.
2. **Craft**: alignment, rhythm, contrast hierarchy, empty states, responsive
   breakpoints — compare against the Phase 0 reference patterns.
3. **Performance/a11y**: reduced-motion fallbacks (`prefers-reduced-motion`
   around every animista/gsap/motion effect), WebGL background cost (one canvas
   max, destroy on unmount), contrast ratios, focus states, CLS from fonts.
Orchestrator triages findings → one fix agent per section (parallel again) →
re-verify.

## Ultracode / Workflow variant

When the Workflow tool is available, run phases 2 and 4 as one script:

```js
export const meta = { name: 'design-build', description: 'parallel section build + review',
  phases: [{ title: 'Build' }, { title: 'Review' }, { title: 'Fix' }] }
const SECTIONS = ['hero', 'features', 'pricing', 'faq', 'footer']  // from brief
const built = await parallel(SECTIONS.map(s => () =>
  agent(`<section prompt template for ${s}>`, { label: `build:${s}`, phase: 'Build' })))
// assembly happens in the main session after this workflow returns findings
const reviews = await parallel(['cohesion', 'craft', 'perf-a11y'].map(lens => () =>
  agent(`Review all sections through the ${lens} lens vs design-brief.md; return findings list`,
    { label: `review:${lens}`, phase: 'Review', schema: FINDINGS })))
const fixes = dedupeByFile(reviews.flatMap(r => r.findings))
await parallel(fixes.map(f => () =>
  agent(`Fix in place: ${f.detail} (file ${f.file}); obey design-brief.md`, { phase: 'Fix' })))
return { built, findings: fixes }
```

Note: assembly (Phase 3) stays in the main session between the Build and Review
workflows when using two separate workflow runs — reviewers need the composed page.

## Failure modes to prevent

| Symptom | Cause | Prevention |
|---|---|---|
| Sections look like different sites | no brief / brief too vague | Phase 0 brief with exact tokens, motion vocab, icon weight |
| Merge conflicts in globals.css | parallel agents editing shared files | exclusive file ownership; orchestrator owns globals |
| 4 copies of `motion` in package.json | agents installing deps | agents report deps; orchestrator installs once |
| Janky page (3 WebGL canvases) | every agent adding its own background | brief assigns background to ONE section; reviewers count canvases |
| Animation soup | agents each picking their own easing/duration | brief's motion vocab is a closed set |
