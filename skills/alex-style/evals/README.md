# alex-style evals

Three orthogonal build evals (`evals.json`): zero-build static (eval 0), React +
Tailwind multi-section (eval 1), constrained polish pass (eval 2). Run by the
skill-creator harness into `iteration-N/<eval>/<config>/` run dirs.

## How the pieces fit

1. **skill-creator harness** runs each eval, saves the delivered files under the
   run dir (plus its own notification-derived `timing.json` — nothing here ever
   writes that file).
2. **analyze-runs.mjs `<transcript-dir> <iteration-dir>`** parses the workflow
   subagent transcripts post-hoc and writes `monitor.json` per run dir: tool
   counts, web calls, grep/vendor telemetry, duration/tokens, and — for
   `with_skill` runs — hard `gates`: `web_calls_zero` and `forbidden_reads_zero`
   (zero-tolerance; everything else is informational/WARN-level).
3. **check-outputs.mjs `<run-dir>`** mechanically verifies the five
   exhaustive-scan assertions (offline-completeness, local-asset existence,
   NOTES.md dep completeness, `'use client'` hygiene, one-icon-family) and
   writes `checks.json`. The LLM grader receives it as evidence and cites it;
   judgment-shaped assertions (animation quality, restraint, semantics) stay
   with the grader.

## Tiers

- **SMOKE** — run per skill-edit iteration: eval 2 (`dashboard-polish`,
  smallest scope, fixture-anchored) `with_skill` only, then `check-outputs.mjs`
  plus the two monitor gates. Fast, cheap, catches most regressions.
- **FULL** — before releases: all 3 evals x `with_skill`/`without_skill` x N
  reps, with `analyze-runs.mjs` + `check-outputs.mjs` on every run dir.

## policy.json contract

`policy.json` is the analyzers' source of truth, kept in sync by hand when
`scripts/sync.sh` vendors a new source or SKILL.md's token-discipline table
changes:

- `grep_only_patterns` — regexes for files that must never be read in full
  (llms-full.txt, animista/keyframes.css, phosphor/icons.ts, gsap/motion
  llms.txt, the large `_index` TSVs: icons/inspiration/components/logos).
- `vendor_slugs` — every directory under `vendor/`: `_index`, `animista`,
  `gsap`, `kokonutui`, `layers`, `lenis`, `magicui`, `motion`,
  `motion-primitives`, `phosphor`, `reactbits`, `recent`, `shadergradient`,
  `vanta`, plus incoming `radix-colors`, `paper-shaders`, `svgl`,
  `review-packs`.

If `policy.json` is missing, `analyze-runs.mjs` falls back to built-ins and
prints a warning — the fallback may lag SKILL.md, so keep the file present.
