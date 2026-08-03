# Origin UI — application/form/data UI

> 646 application-UI registry items (600 numbered comps + 40 shadcn-style ui primitives + 5 hooks + 1 lib) from the legacy Origin UI registry frozen inside cosscom/coss — the arsenal's ONLY source for date/time pickers, steppers, combobox/multiselect, data tables, navbars, uploads, OTP/payment inputs.

## At a glance
- **What**: the post-acquisition Origin UI snapshot at `apps/origin` in cosscom/coss, **pinned to commit `3c6058e484e51e1fc14849c9b59a9cca6269c539`** (2026-05-08, the last commit touching the subtree — the catalog is frozen, so the pin never drifts). Payload JSONs with inline `.files[].content` — the same shadcn-registry shape as magicui/kokonutui; `get-component.sh` works unchanged. Coverage (tag census): date 34, table 20, stepper 17, navbar 20, select/combobox 58, multiselect 6, upload 14, OTP 4, payment 7, timezone 3.
- **License — READ THIS**: `vendor/origin/LICENSE.md` is MIT ("Originally Copyright (c) 2025 Origin UI") and covers ONLY the `apps/origin` subtree. The cosscom/coss monorepo ROOT is **AGPLv3** — vendoring or copying ANYTHING from that repo outside `apps/origin/` is a license breach. `sync.sh` extracts exactly four `apps/origin` paths and hard-fails if LICENSE.md stops reading as MIT.
- **Vendored** (`vendor/origin/`, ~3.8MB): `r/` — all 646 payloads (~2.2MB) with FULL dependency closure (every `registryDependencies` entry resolves locally — sync gates it); `navbar-components/` — 10 helper files (logo, theme-toggle, user-menu, team-switcher…) that the 20 navbar comps import but NO payload ships; `registry.json` (~280KB — never read, grep the TSV); `LICENSE.md`.
- **Index**: `vendor/_index/application-ui.tsv` — 646 rows: `name type tags description_or_title npm_deps payload_file`. Tags are NORMALIZED at build time: upstream's malformed comma-joined tag `navbar, navigation` (all 20 navbar items) is split so exact-tag matching works, and the 47 untagged items (40 ui primitives, 5 hooks, 1 lib, `tree`) are backfilled name-as-tag so grep reaches them. Grep the TSV, never registry.json.
- **Project deps**: shadcn-style project assumed (`cn()` util, CSS-var theme tokens) — same assumption as magicui/kokonutui. Most items need zero or one npm dep. Date/time items pull `react-aria-components` (+`@internationalized/date`) — Adobe's React Aria, the best-in-class date-a11y layer; taking a date picker takes that dep, and that's acceptable but must be stated. The 9 TanStack table items pull `@tanstack/react-table`; 27 items pull the unified `radix-ui` package.

## Routing (law)
- **Origin serves APPLICATION/FORM/DATA UI ONLY**: date/time pickers, steppers, combobox/multiselect, data tables, navbars, pagination, uploads, OTP/payment/phone inputs, settings panels. This REPLACES the old SKILL.md concession that forms and data tables are hand-built from brief tokens — hand-built agent forms are where output fails a11y hardest (numbers below).
- **NEVER route Origin for hero/marketing/animation work** — reactbits/magicui/kokonutui set the taste ceiling there. Origin's utilitarian shadcn styling on a marketing page is taste dilution, the exact regression the dedicated class-scoped TSV exists to prevent: its 646 rows must never become the second-best answer inside the `components.tsv` grep surface.
- **Check the target project's Tailwind major FIRST**: v4 required (next section). Tailwind v3 project → apply the downgrade mappings to every copied file, or fall back to the hand-build path.

## When to use / when NOT
Use for:
- Anything a user "fills in, picks, sorts, or navigates": forms and inputs (masked, phone, OTP, payment, textarea with limits), date/time/timezone pickers, steppers, combobox/multiselect/autocomplete, data tables with sort/filter/pagination, navbars, pagination, file uploads, tree views, settings panels.
- Dashboards and app shells where correctness and a11y outrank visual flair.
- The 40 ui primitives as the shadcn-compatible base layer for any of the above (`awk -F'\t' '$2=="ui"' vendor/_index/application-ui.tsv`).

NOT for:
- Hero sections, marketing/landing sections, text effects, animated anything → `components.tsv` sources (reactbits/magicui/kokonutui). Routing origin there dilutes taste.
- Tailwind v3 projects, unless you apply the downgrade mappings below to every copied file.
- Zero-build/vanilla pages — payloads are React + shadcn-token TSX; there is no CDN story (same as every registry source in the arsenal).

## Tailwind v4 REQUIRED — the silent-failure floor
Payload sources use Tailwind v4-only syntax that **silently no-ops on v3** — no build error, the classes just vanish, and what vanishes is exactly the a11y affordances that justify adoption (focus rings, popover entry animation, spacing). The four patterns and their v3 downgrades:

| v4-only class (payload count) | silently lost on v3 | v3 downgrade mapping |
|---|---|---|
| `outline-hidden` (11 payloads) | focus outline suppression pairing | `outline-none` (keep the `focus-visible:ring-*` classes) |
| `*:not-first:` variants (152 payloads) | child spacing/dividers | `[&>*:not(:first-child)]:` |
| bare `data-entering:` / `data-focus-visible:` (react-aria items) | popover/dialog entry animation, focus styles | `data-[entering]:` / `data-[focus-visible]:` |
| `rotate-315` and other bare-degree rotations (14 payloads) | icon orientation | `rotate-[315deg]` |

On a v3 project, grep every copied file for all four patterns before shipping. Silent a11y degradation is this source's worst failure mode.

## The a11y case (why these beat hand-builds)
Measured, not vibes — from the adoption audit:
- `comp-485` (TanStack data table, 26KB): **24 `aria-` attributes**, aria-label'd row checkboxes, sortable headers with `tabIndex={0}` + explicit Enter/Space `onKeyDown`, faceted filters, pagination, column visibility. The arsenal previously had zero data tables.
- `comp-41` (date picker): built on **React Aria** (DatePicker/Group/Label/Popover/Dialog) with an `aria-live="polite"` region — hand-built date inputs do not approach this.
- `stepper` ui primitive: real `<button>` triggers, `focus-visible:ring` tokens, disabled states, controlled/uncontrolled API, aria-hidden icons. The baseline's only stepper (reactbits `Stepper`, a visual progress animation) measures **0 `aria-`, 0 `onKeyDown`, 0 `tabIndex`** in 9.8KB of source.
- `multiselect` ui primitive: Backspace/Delete/Escape key handling, `aria-invalid` states, labelled Remove/Clear controls.

## How to consume (token discipline)
1. `grep -i "<concept>" vendor/_index/application-ui.tsv` — 646 rows. Exact-tag: `awk -F'\t' '$3 ~ /(^|,)date(,|$)/' vendor/_index/application-ui.tsv`. Primitives/hooks are reachable by name thanks to the tag backfill (`awk -F'\t' '$2=="ui"'` lists all 40).
2. Read ONLY the matched payload, or extract without reading: `bash scripts/get-component.sh vendor/origin/r/comp-485.json` (`--deps` / `--files` work too). Largest payload is `comp-542` (~119KB, 18 files — an entire event calendar): always extract, never read it whole.
3. `registryDependencies` are ABSOLUTE `https://coss.com/origin/r/<name>.json` URLs — resolve them LOCALLY: basename minus `.json` → `vendor/origin/r/<name>.json`. NEVER fetch them (hard rule 1); sync gates that the closure is complete inside the vendor dir.
4. Import-path remap when copying into a project: `@/registry/default/ui/…` → your ui dir (`@/components/ui/…`), `@/registry/default/lib/utils` → `@/lib/utils`, `@/registry/default/hooks/…` → `@/hooks/…`, `@/registry/default/components/…` → your components dir.
5. Navbar items (the 20 `navbar`-tagged comps) import `navbar-components/logo` etc. — shipped in NO payload. Copy what the item imports from `vendor/origin/navbar-components/` and replace `logo.tsx` with the project's real logo.

## Pitfalls
- **Dual a11y stack by design**: most items are Radix; date/time items are React Aria. Both in one project is upstream's own architecture — never rebuild a React Aria date picker on Radix primitives to "unify".
- `StepperTrigger`'s `asChild` branch silently drops onClick/disabled wiring — intentional for static indicators, surprising otherwise; keep default rendering for interactive steps.
- `multiselect` uses document-level mousedown/touchend click-outside listeners, not a Radix dismiss layer — fine standalone; test dismiss order inside nested dialogs/popovers.
- `stepper` omits `aria-current="step"` — add it to the active trigger when copying (one attribute; still far ahead of the baseline's zero-aria stepper).
- Demo `<img src="/origin/avatar-*.jpg">` refs (avatar/user comps) point at origin's own public dir and would 404 in your project — swap for project assets. No remote hotlinks exist in any payload (verified).
- **Frozen snapshot, "limited support" upstream**: stable and drift-free under the SHA pin; upstream still landed compile-keeping patches through 2026-05. If a future React 19+/Radix/react-aria major deprecates an API, PATCH THE VENDORED COPY (treat `vendor/origin/` as maintained-by-us) rather than waiting for upstream.

## Refresh / fallback
- `bash scripts/sync.sh origin && node scripts/build-catalogs.mjs` — refetches ONE codeload tarball at the pinned SHA (~2.3MB; chosen over 646 per-item coss.com fetches: atomic, SHA-consistent with registry.json, and it also carries the navbar helpers + LICENSE.md which the live endpoint cannot serve). Every gate (MIT license text, exact 646/600/40/5/1 counts, payload parse, dependency closure, 10 navbar helpers) keeps the previous copy on a miss.
- The registry is frozen: re-sync only matters after a deliberate `ORIGIN_COSS_SHA` bump in `sync.sh` — check upstream `git log -- apps/origin` first, then re-verify the exact counts in the sync gates and catalog builder.
- Per-item fallback (verified 200, byte-identical to repo payloads): `https://coss.com/origin/r/<name>.json` — but vendored-first per hard rule 1.
