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
3. Color, in this order: character palette FIRST — `vendor/_index/palettes.tsv`
   or brand hexes, the brief's only named color source. THEN map neutral ramps,
   state steps, text steps, and dark pairs via Radix (`sources/radix-colors.md`).
   Radix is infrastructure, never the brief's palette — invented ramps are the
   #1 contrast defect source; Radix-as-character flattens every build the same.
4. Pre-resolve each section's picks into the Sections list below: component →
   vendored item path → npm_deps → animista keyframe names → icon names +
   weight (40–80 tokens each) — agents skip ~4–8k tokens of arsenal navigation
   apiece and can't diverge on picks.
5. Write `design-brief.md` **in the target project root** (worth doing before a
   solo build too — Phase 0 stands alone):

````markdown
# Design brief — <project>
Direction: <2 sentences: mood, density, era, references>
Tokens (Phase 1 pastes VERBATIM into globals.css; cite these exact var names):
```css
:root {
  --bg:#…; --surface:#…; --text:#…; --muted:#…; --accent:#…; --accent-contrast:#…;
  /* character hexes from the palette; neutral/state/dark steps from the Radix mapping */
  --font-display:…; --font-body:…;      /* type scale: 12 14 16 20 24 32 48 64 */
  --space-1:4px; --space-2:8px; /* …12 16 24 32 48 64 96 */ --radius:8px; --border:1px solid …;
  --dur-1:150ms; --dur-2:300ms; --dur-3:600ms; --ease:cubic-bezier(.22,1,.36,1);
}
```
Motion: entrances <e.g. fade+8px rise>; hover <e.g. --dur-1 scale 1.02>; NO other motion vocab
Icons: phosphor, weight=<one weight>, size 16/20/24 only
Background: <treatment + source, e.g. shadergradient preset=halo, hero only>
Stack: <React/Next/Tailwind versions; shadcn present? zero-build?>
Sections — canonical ids (nav anchor targets) + pre-resolved picks, one line each:
- <id>: <1-line spec> | <component> → <vendor item path> | deps: <npm_deps> |
  keyframes: <names> | icons: <names>@<weight>
````

## Phase 1 — Scaffold (orchestrator, solo)

One owner for shared state — NEVER parallelize global files. Create: project
scaffold; `globals.css`/theme — paste the brief's `:root` block verbatim
(hand-translation reintroduces the var-name drift the block exists to kill);
layout shell with nav wired to the brief's canonical section ids; font loading;
union of `npm_deps` from the brief's picks; Lenis/provider wiring if used.
Pre-extract the brief's animista keyframes (grep -o per SKILL.md) into a shared
animations layer — section agents never touch keyframes.css.

**Pre-install shared components here, not in Phase 2.** Two kinds: components
whose item JSON carries `.css`/`.cssVars` payloads (marquee, shimmer-button,
shine-border…) — they need `globals.css`/theme edits section agents can't
make — and any component two+ sections pick, regardless of css payload, so the
page gets ONE copy, not divergent copies. Section agents import them; a newly
discovered css-carrying need is reported, never installed. Commit or checkpoint
before fan-out — the brief is FROZEN here; edits redispatch affected sections.

## Phase 2 — Section fan-out (parallel agents)

One agent per section (hero, features, pricing, footer…) or per page-section
pair. Dispatch in a SINGLE message so they run concurrently.

### Section-agent prompt

Placeholders `<section>`, `<project path>`, `<skill dir>`; picks are in the brief.

```
Build the <section> of <project> at <project path>.
READ FIRST: <project>/design-brief.md — it is law; do not invent tokens.
Use your section's pre-resolved picks (item paths under <skill dir>, deps,
  keyframes, icons). Pick missing/wrong? grep <skill dir>/vendor/_index/*.tsv
  once; still nothing → hand-build from brief tokens per SKILL.md and say so
  in your report — never fabricate an "arsenal" component. Read a source card
  ONLY for runtime-pitfall sources: vanta/gsap/shadergradient/lenis/paper-shaders.
Write ONLY: <project>/components/sections/<section>.tsx (+ sub-components in
  components/sections/<section>/). Do NOT touch globals.css, layout, package.json —
  list any new npm dep in your report instead.
Verify: renders without errors against existing scaffold; brief var names only.
Report: files written, sources used, new deps needed, deviations.
```

Rules that keep the merge clean:
- **File ownership is exclusive.** Section agents write only their own files.
- Missing dep → reported, installed by orchestrator after fan-out.
- Specialist passes that touch many files (motion polish, a11y) run AFTER
  section agents complete, sequentially, not alongside.

**Multi-page sites**: fan out per page-section pair, but chunk by page when the
flat list would exceed ~10 concurrent agents (the cap is 10–16). Shared chrome
(nav, footer, root layout) is orchestrator-owned exactly like globals.css;
Phase 1 creates the per-route layout shells.

## Phase 3 — Assembly (orchestrator, solo)

1. Existence check: every id in the brief's Sections list has its file under
   `components/sections/` — a dead agent leaves a hole, not an error message.
   Redispatch any missing section solo.
2. Install reported deps — after diffing them for version conflicts. Known
   case: `three` (vanta pins r134 — alias fix in `sources/vanta.md`); the
   brief's one-background rule should have prevented the collision upstream.
3. Compose sections in the layout, wire Lenis/observers, resolve collisions,
   run build + fix type errors.
4. Mechanical checks — greps, not reviewers (agents re-finding these waste dispatches):
```bash
grep -rl 'animation\|gsap\|motion/' components/sections | xargs grep -L 'prefers-reduced-motion'
grep -rn 'transition-all' components/sections     # explicit property lists only
grep -rli 'canvas' components/sections | wc -l    # one WebGL canvas max, page-wide
grep -rL 'focus-visible' components/sections      # judge hits: interactives need rings
```
Hits go into the Phase 4 fix batches. Then screenshot/preview.

## Phase 4 — Review swarm (parallel agents)

Reviewers return findings `{section, file, detail, severity}`, touch nothing.
Scale to the build — a fixed 3-reviewer swarm out-costs a small build:
- **≤5 sections → ONE reviewer**, combined checklist: token drift vs the
  brief's `:root` var names, off-scale spacing, alien motion, mixed icon
  weights; alignment, rhythm, contrast hierarchy, empty states, breakpoints
  vs the Phase 0 references; plus what no tool measures — reduced-motion
  behavior, focus-ring visibility, WebGL cost/teardown, CLS from fonts.
- **>5 sections → split** into cohesion (brief conformance) and craft
  (everything else) lenses.

Review packs (`sources/review-packs.md` — reference it, don't restate it):
- At Phase 4 start, if Playwright MCP AND a served preview exist, run axe ONCE
  against the preview with the closed allowlist in
  `vendor/review-packs/axe/allowlist.json` (injection recipe in the card; never
  widen it ad hoc); else skip silently — reviews never hard-depend on a
  browser. A clean axe run is NOT a clean a11y pass.
- Reviewers consume the WIG checklist per the card's exclusion list, citing
  rule ids, at its severity gate: typography micro-nits batch to ONE finding
  per section; the 12 anti-patterns are always reported individually.

Triage: group findings by section → ONE fix agent per section with its batch
(parallel) → re-verify — per-finding agents double cost and break ownership.

Phase 4 runs standalone against any project with a `design-brief.md`; if none
exists, first write a retro-brief from the site's actual tokens (same template).

## Ultracode / Workflow variant

Two runs — reviewers need the composed page, and assembly is main-session work
(deps, layout, build errors). Run 1, Build:

```js
export const meta = { name: 'design-build', phases: [{ title: 'Build' }] }
const SECTIONS = ['hero', 'features', 'pricing', 'faq', 'footer']  // brief's canonical ids
const built = await parallel(SECTIONS.map(s => () =>
  agent(`<Section-agent prompt above, with <section> = ${s}>`, { label: `build:${s}`, phase: 'Build' })))
// agent() resolves to null on a dead/skipped subagent — never index results unchecked
const failed = SECTIONS.filter((_, i) => !built[i])
return { built: SECTIONS.filter((_, i) => built[i]), failed }
```

Redispatch `failed` by re-running the script: unchanged `agent()` prefixes
return cached, so a resumed run re-executes ONLY the failures. Then do Phase 3
in the main session. Run 2, Review + Fix:

```js
export const meta = { name: 'design-review', phases: [{ title: 'Review' }, { title: 'Fix' }] }
const FINDINGS = { findings: [{ section: '', file: '', detail: '', severity: 'low|med|high' }] }
const SECTIONS = [/* same list as Run 1 */]
const LENSES = SECTIONS.length > 5 ? ['cohesion', 'craft'] : ['cohesion+craft']
const reviews = (await parallel(LENSES.map(l => () =>
  agent(`Review the assembled page with the ${l} checklist vs design-brief.md`,
    { label: `review:${l}`, phase: 'Review', schema: FINDINGS })))).filter(Boolean)
const bySection = reviews.flatMap(r => r.findings)
  .reduce((m, f) => m.set(f.section, [...(m.get(f.section) || []), f]), new Map())
await parallel([...bySection].map(([s, fs]) => () =>
  agent(`Fix section ${s}: ${fs.map(f => `${f.file} — ${f.detail}`).join('; ')}; obey design-brief.md`,
    { label: `fix:${s}`, phase: 'Fix' })))
```

For large builds prefer `pipeline(SECTIONS, build, perSectionReview)` — no
inter-stage barrier, schedules within the concurrency cap; only the cohesion
lens needs the post-assembly barrier.

## Incremental rebuilds

"Make the pricing section denser" after a full build is not a new swarm:
- Solo path: ONE section agent (Section-agent prompt + "the rest of the page
  exists — match it"), then a single cohesion spot-check vs its neighbors
  instead of the full Phase 4 swarm.
- Workflow path: re-run the Build script with only that section's prompt
  changed — prefix caching skips every unchanged agent.

## Failure modes to prevent

| Symptom | Cause | Prevention |
|---|---|---|
| Sections look like different sites | no brief / brief too vague | Phase 0 brief with literal `:root` tokens, motion vocab, icon weight |
| Merge conflicts in globals.css | parallel agents editing shared files | exclusive file ownership; orchestrator owns globals |
| 4 copies of `motion` in package.json | agents installing deps | agents report deps; orchestrator installs once |
| Janky page (3 WebGL canvases) | every agent adding its own background | brief assigns background to ONE section; Phase 3 canvas grep |
| Animation soup | agents each picking their own easing/duration | brief's motion vocab is a closed set |
| Fabricated "arsenal" component | grep found no match | prompt fallback: hand-build from brief tokens per SKILL.md, say so in report |
| Hole where a section should be | section agent died mid-fan-out | Phase 3 existence check; redispatch solo |
| Nav links to anchors that don't exist | no owner for cross-section ids | brief's Sections list carries canonical ids; nav stays orchestrator-owned |
| Half the sections obey an older brief | brief edited mid-fan-out | brief frozen at the Phase 1 checkpoint; edits redispatch affected sections |
| Two divergent copies of one component | only css-carrying picks pre-installed | manifest-named shared components installed in Phase 1 regardless of css payload |
