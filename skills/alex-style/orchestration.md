# Orchestration — parallel design swarm

For any build bigger than a single component: full landing page, multi-screen
app, marketing site, dashboard. For one component or a tweak, stay solo — a
swarm adds overhead without payoff.

## Why a brief comes first

Parallel agents produce incoherent design unless every choice that spans
sections is made ONCE, up front, in writing. The brief is the contract; section
agents never invent tokens, colors, fonts, easing, or icon weights.

## Phase 0 — Direction (orchestrator, solo)

0. **ELEVATE THE PROMPT before anything else.** Users write minimums ("simple
   site for my landscaping company"); you build the version a top studio would
   pitch back. Write an `## Elevation` block at the top of `design-brief.md`:
   - **Concept**: one line that only fits THIS client — a metaphor/story the
     whole page argues; sections, motif, copy, and motion all serve it.
   - **Genre ceiling**: name what carries wow in this genre (photography?
     type? scroll choreography? product motion?) and the plan for whatever
     gap you can't fill — no photos means type-led art direction with one
     strong motif, never cute filler.
   - **Signature moment**: the ONE thing a visitor describes to someone the
     next day. Design it first; build the page around it.
   - **Voice**: copy strategy — client-specific lines, real-sounding proof,
     zero template phrases ("Welcome to…", "We offer a wide range…").
   - **Aesthetic — house register (default)**: unless the user names their own
     aesthetic, every brief commits to studio-grade art direction — the page
     COMPOSED like an editorial spread, never stacked like a template:
     * Type does the heavy lifting: a characterful display face against a
       quiet body face, real scale contrast (hero display 3–5× body), and
       editorial furniture earning its keep — kickers/eyebrows, pull-quotes,
       oversized numerals, captions, running folios (build spec + motion
       wiring: recipes.md #9).
     * Grounds are warm and alive: tinted paper, cream, warm ink — a raw
       `#fff` or `#000` ground is a generated tell, not a choice. One
       saturated, living accent; palette still sourced from
       `_index/palettes.tsv` or brand, then warmed into tokens.
     * Composition over stacking: asymmetry, overlap, generous whitespace
       used as layout material; at least one section that breaks the
       centered-column rhythm.
     * At least one HUMAN touch: hand-drawn underline or motif, annotated
       stat, organic shape, texture, stamp — something a person visibly made.
     * Alive but functional: motion and depth serve the composition
       (entrances, drift, one signature moment), and hierarchy, contrast,
       and conversion anatomy are untouchable — beauty never costs function.
     TRANSLATE the register per client — a clinic's warmth is not a coffee
     roaster's warmth; same confidence, different expression — and the Rule 0
     variation law applies to the register itself: never the same palette
     temperature, display face, or human-touch device two builds running.
     If the user DOES name an aesthetic (dark SaaS, brutalist, cyber,
     corporate-minimal…), elevate inside THEIR direction with the same studio
     finish — the house register yields; the craft bar never does.
   Elevation never overrides the user's explicit constraints (stack, budget,
   "no X") — it raises ambition inside them. The build is judged against the
   elevated brief, not the literal prompt.
1. Interpret the request: audience, vertical, mood, constraints.
2. Ground it in references — SAMPLED, never the head of a grep:
   `bash scripts/vary.sh vendor/_index/inspiration.tsv 10 "<vertical|pattern>"`
   — pick 3–5 references from the random slice, note the *patterns* they
   share (layout, density, motion character). Weak sample? Re-run for a
   fresh slice; never fall back to grep order.
3. Pick color the same way:
   `bash scripts/vary.sh vendor/_index/palettes.tsv 8 <light-ui|dark-ui>`
   (real curated 5-color palettes) or brand colors. Derive semantic tokens
   (bg, surface, text, muted, accent, accent-contrast) — don't ship raw
   palette order.
   Then type, from the pairing index — never from memory:
   `bash scripts/vary.sh vendor/_index/typography.tsv 8 "<register|mood|vertical>"`
   Sample at PAIR level (display + body + fallbacks travel together; never
   mix two rows' display faces); the ledger's display_face rule applies.
   Delivery per stack in `sources/typography.md` — FFL faces are
   download-per-project, never copied between builds.
4. Run the **Variation protocol** below — ledger check + layout archetype.
5. Write `design-brief.md` **in the target project root**:

```markdown
# Design brief — <project>
Direction: <2 sentences: mood, density, era, references — states the aesthetic
  register (house editorial-warm default, or the user's named direction)>
Palette: bg #… surface #… text #… muted #… accent #… (usage rules)
Type: <sampled typography.tsv row: display / body (+ mono), src + license
  note, fallback stacks; scale: 12 14 16 20 24 32 48 64>
Spacing: 4px base — 4 8 12 16 24 32 48 64 96 | Radius: <e.g. 8/16/full> | Border: <1px solid …>
Motion: durations 150/300/600ms, easing cubic-bezier(.22,1,.36,1); entrances
  <e.g. fade+8px rise>; hover <e.g. 150ms scale 1.02>; NO other motion vocab
Icons: phosphor, weight=<one weight>, size 16/20/24 only
Background: <treatment + which source, e.g. shadergradient preset=halo hero only>
Signature: <the ledger row in prose — hero treatment / background / text
  effect / human touch / layout archetype, and which axes differ from the
  recent ledger rows>
Sources: <every arsenal slug in play with its one-line role; name each
  expressive source left OUT and why (a source absent without a reason is an
  unfilled role — Rule 0)>
Stack: <React/Next/Tailwind versions; shadcn present? zero-build?>
Sections: <list with 1-line spec each>
```

### Variation protocol (non-optional; applies to solo builds too)

Uniqueness is enforced by mechanism, not intention — an LLM given similar
prompts re-picks the same "safe" items unless the selection step itself
carries entropy and memory:

- **Sample, then choose.** Every shortlist drawn from an index — palettes,
  inspiration, components, vanta effects, animista families, motif icons —
  starts from `bash scripts/vary.sh <tsv> <n> [pattern]` (a random slice),
  never from grep order. Judgment picks FROM the sample; entropy only decides
  what you look at first. Selection stays yours: pick the candidate most
  specific to THIS brief, re-sample if the slice is weak.
- **The ledger** (`ledger.tsv` in the skill root; create from the schema
  header if missing) records every shipped build's signature choices:
  `date  project  vertical  palette  display_face  hero_treatment
  background  text_effect  motion_family  human_touch  layout_archetype`.
  Before writing the brief: `tail -8 ledger.tsv`. The new build must differ
  from every row shown on **at least 4 signature axes**, and must not repeat
  the most recent row's hero_treatment, palette, display_face, or
  human_touch at all. A class genuinely exhausted (all 14 vanta effects in
  recent rows) → vary at a finer grain (options, recoloring, composition)
  and note it in the brief. Append the new row when the build ships — the
  craft floor makes that a completion gate.
- **Layout archetype is a signature axis.** Name the page's composition in
  the brief — split editorial / full-bleed art / offset column / oversized
  type stack / magazine grid / diagonal-broken grid / centered classic
  (earn it) — and don't repeat any of the last 3 ledger rows' archetype.

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
