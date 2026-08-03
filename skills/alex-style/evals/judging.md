# Judging rubric — how every build is graded

Used by: the build agent's own render-and-look pass (Craft floor), any grader
agent in evals, and human A/B review. Score each axis 1–5; a build ships at
4+ on all three. Mechanical checks (offline-complete, reduced-motion, licenses)
are table stakes, not scores — they gate, they don't grade.

## 1. Arsenal utilization & variation
How many sources are genuinely LOAD-BEARING on the page (not merely present),
wired together per the recipes (e.g. lenis driving ScrollTrigger; entrances +
hero moment + icons + palette from their proper sources)?
- 5: six+ sources cohering; hero treatment chosen from a 3-candidate shortlist
  and specific to this client; no default/example picks anywhere.
- 3: several sources but obvious/safe picks (a card's worked example, a TSV's
  first match) or roles left unfilled (no scroll behavior, no text moment).
- 1: one or two sources; the arsenal might as well not exist.

## 2. Impressive, exciting, engaging
Would a demanding client stop scrolling? Is there at least one memorable
moment, motion that rewards scrolling, and a page that feels designed FOR this
client rather than assembled?
- 5: a distinctive concept carried through (recurring motif, choreographed
  scroll, a hero no other site has); you want to show someone.
- 3: pleasant and competent but interchangeable — the hero could appear on any
  similar site.
- 1: static, sparse, or template-flavored; nothing to remember.

## 3. Craft & quality
Composition, rhythm, hierarchy, and correctness as seen in a real render.
- 5: full conversion anatomy; rhythm holds through the whole scroll (no two
  adjacent same-background sections); type hierarchy confident; placeholders
  intentional; defects found in the render pass were fixed before shipping.
- 3: solid bones but visible seams — sparse stretches, faint text, plain
  stock sections beside rich ones.
- 1: broken layout, filler art, unreadable contrast, or content hidden by
  its own reveal gating.

Verdict format: three scores + one sentence per axis citing something visible
in the render. A "correct but boring" build fails axis 2 — correctness is
never the goal; it is the floor.
