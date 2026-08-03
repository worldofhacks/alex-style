# Display/body pairing table — DRAFT FOR OWNER TASTE REVIEW

> Status: **proposal, nothing vendored, nothing in-repo.** This table is the primary route from
> orchestration.md Phase 0 ("Type: <display font / body font, scale…>"); the fonts.tsv grep is the
> fallback for unusual briefs. Per the gate: this table gets owner taste review BEFORE any grep
> path is exposed.

**Data grounding.** Every family below was verified 2026-08-02 against the live Google Fonts
metadata endpoint (1,942 families; clean JSON today — no `)]}'` prefix, confirming shape drift),
the google/fonts `tags/all/families.csv` (29,172 rows; family-level rows only), and the Fontsource
API (license, npmVersion, variable coverage). Category, axes ranges, weights, italic presence,
popularity rank, and dateAdded in this file are copied from that data, not from memory. All 47
families are Fontsource `OFL-1.1`, all currently `npmVersion 5.3.0`.

**Why hand-authored.** The audit proved naive tag grepping regresses below model memory:
`/Expressive/Loud>=60` for a brutalist crypto brief returns Nabla, Honk, Kablammo — color/novelty
fonts whose ONLY structural tags are `/Theme/Shaded|Blobby|Wacky` and which have no `wght` axis at
all (verified). `/Expressive/Sophisticated>=70` for editorial returns wedding scripts. Extremeness
on an expressive axis is anti-correlated with design suitability. Taste lives here; the data
verifies availability, axes, and weights.

**Popularity policy.** Popularity is BANNED as a ranker. No family here is top-20 (the top-20 is
exactly the overused set: Roboto, Open Sans, Inter, Montserrat, Poppins, Lato, Oswald…). Four
families sit at ranks 21–30 and are flagged ⚠ with justification in the watchlist below.

Axes notation: `D:` display family, `B:` body family; `—` = static (no variable axes);
weights listed only where the constraint is a known trap.

---

## Brutalist / loud

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `brutalist-poster` | Archivo Black ⚠ | Archivo | brutalist, loud | crypto, streetwear, agency portfolio | D: — (400 only) · B: wdth 62–125, wght 100–900, ital | One superfamily, two temperatures: Black is the grotesque poster cut; Archivo's wdth 62–125 yields condensed labels AND expanded caps from a single variable file — era coherence is total because it is literally the same skeleton. |
| `brutalist-techno` | Space Grotesk | Zalando Sans | brutalist, technical | crypto infra, dev tools, web3 | D: wght 300–700, **no italic** · B: wdth 75–125, wght 200–900, ital | Both neo-grotesque (tags: SG `/Sans/Neo Grotesque=100`, ZS `=100`) so construction agrees; SG's ink-trapped terminals (`/Theme/Techno=100`) carry personality above ~32px while Zalando Sans (2025-09, memory-proof) disappears at 16px. SG has no italic and nothing below 300 — verified; kills the hallucinated-weight CLS trap. |
| `brutalist-expanded` | Unbounded | Manrope | brutalist, loud | token/exchange sites, gaming, synth | D: wght 200–900 · B: wght 200–800 | Unbounded is ultra-wide rounded-techno display commissioned for Polkadot — native web3 credibility; Manrope's closed quiet neo-grot (Calm=86) leaves the width contrast (display-wide vs body-normal) to do all hierarchy work. |
| `heavy-street` | Dela Gothic One | Onest | brutalist, playful-loud | streetwear drops, music, events | D: — (400 only) · B: wght 100–900 | Dela Gothic One is a Japanese heavy gothic — square counters, near-mono rhythm — reading as a solid graphic block (latin subset verified); Onest's tall x-height and Calm=85 keep dense copy open under all that display mass. |
| `new-brutalist` | Boldonse | Schibsted Grotesk | brutalist, editorial-loud | fashion drops, agencies, poster-led landings | D: — (400 only) · B: wght 400–900, ital | Boldonse (added 2025-03; `/Sans/Grotesque=100`) is a tight-aperture black grotesque model memory cannot know; Schibsted Grotesk is a newsroom-bred grotesque — same structural backbone, opposite volume. |

## Impact / condensed

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `condensed-civic` | Big Shoulders | Public Sans | loud, civic, technical | sports, logistics, civic tech, events | D: opsz 10–72, wght 100–900 · B: wght 100–900, ital | Shared American-gothic lineage (Big Shoulders is Chicago's civic face, re-released 2025-02 with an opsz axis; Public Sans is USWDS's Franklin descendant) — era-coherent; opsz keeps condensed forms crisp from poster to caption. |
| `impact-utility` | Anton | Chivo | loud | fitness, automotive, sports media | D: — (400 only) · B: wght 100–900, ital | Anton is the compressed neo-grot shout done with actual drawing quality (Loud=80 — the counterexample proving the Loud tag needs a structural anchor, not banning); Chivo (`/Sans/Grotesque=100`) mirrors that skeleton at reading sizes. |

## Editorial

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `editorial-didone` | Playfair Display ⚠ | Source Sans 3 | editorial, luxury-adjacent | culture magazines, glossies, wedding editorial | D: wght 400–900, ital · B: wght 200–900, ital | Maximum construction contrast: hairline Didone (`/Serif/Didone=100`) against open-aperture humanist (`/Sans/Humanist=100`, Competent=92). Playfair's hairlines need 32px+; Source Sans 3 owns everything below — a clean size-based division of labor. |
| `editorial-wonky` | Fraunces | Hanken Grotesk | editorial, warm, quirky | DTC brands, coffee, indie magazines, studios | D: SOFT 0–100, WONK 0–1, opsz 9–144, wght 100–900, ital · B: wght 100–900, ital | Fraunces at opsz 144 with WONK on is a personality engine; at opsz 9 it turns bookish — one file, two voices. Hanken (Calm=89 neo-grot) never competes for attention. The axes are the pairing's tuning knobs, all verified. |
| `editorial-opsz` | Newsreader (72pt cut) | Newsreader (16pt cut) | editorial, calm | longform journals, newsletters, essays | opsz 6–72, wght 200–800, ital (one family) | One family, two optical cuts: the 72pt end is sharp and high-contrast, the 6–16pt end sturdy and bookish (`/Serif/Transitional=100`). Era mismatch is impossible — the opsz axis IS the pairing. Cheapest shelf entry: one woff2. |
| `studio-modern` | Instrument Serif | Instrument Sans | editorial, technical-chic | design studios, portfolios, product marketing | D: — (400 + ital only) · B: wdth 75–100, wght 400–700, ital | Designed together as a superfamily (2023): the Scotch/Modern serif's ball terminals sparkle at display size; the sans shares vertical proportions so the grid holds. Constraint to carry into the brief: serif has ONE weight — hierarchy via size and italic, never weight. |
| `editorial-scotch` | DM Serif Display | DM Sans ⚠ | editorial, friendly | consumer fintech, lifestyle, food media | D: — (400 + ital) · B: opsz 9–40, wght 100–1000, ital | Superfamily coherence; a Scotch-flavored transitional over a low-contrast geometric. The friendly-editorial middle when Playfair reads too formal and Fraunces too quirky. |

## Luxury

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `luxury-fashion` | Bodoni Moda | Jost | luxury, editorial | fashion, beauty, fragrance | D: opsz 6–96, wght 400–900, ital · B: wght 100–900, ital | The Vogue formula: Didone hairlines + Futura-alike geometric — 1920s–30s fashion-typography era coherence. Bodoni Moda's opsz keeps hairlines from shattering below display sizes. (Data-noise proof: it carries a factually wrong `/Theme/Blackletter=100` tag — the table, not tags, carries taste.) |
| `luxury-heritage` | Cinzel | EB Garamond | luxury, calm | wine & spirits, law, heritage hotels | D: wght 400–900 · B: wght 400–800, ital | Inscriptional Roman caps over a Garalde book face — five centuries of shared calligraphic stroke logic; the data agrees (both `/Serif/Old Style Garalde=100`). Cinzel is caps-led: body must carry all lowercase reading. |
| `luxury-boutique` | Italiana | Karla | luxury, quirky | boutique hotels, interiors, jewelry | D: — (400 only) · B: wght 200–800, ital | Italiana's razor-contrast fashion caps (GF category says Sans; tags say `/Serif/Modern=100` — the tags are right, note the discrepancy) over Karla's warm, slightly odd grotesque so the page doesn't go cold. |
| `luxury-quiet` | Prata | Mulish | luxury, calm | premium real estate, spas, wellness-premium | D: — (400 only) · B: wght 200–1000, ital | Prata is a warm single-weight Didone that whispers; Mulish (Calm=91) is the most self-effacing geometric in this set. For premium that must stay approachable rather than editorial. |

## Calm / trust

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `calm-humanist` | Source Serif 4 | Source Sans 3 | calm, technical | healthcare SaaS, docs, insurance, gov | D: opsz 8–60, wght 200–900, ital · B: wght 200–900, ital | Adobe superfamily cut from one brief: transitional serif + humanist sans, both scoring Competent=92 — the data's own trust signal. The serif's opsz 8 text cut works as body in serif-led variants. |
| `calm-accessible` | Hanken Grotesk | Atkinson Hyperlegible Next | calm | healthcare, elder care, a11y-first products | D: wght 100–900, ital · B: wght 200–800, ital | Body is the Braille Institute's 2025 hyperlegibility revision (added 2025-01; differentiated forms so 1/l/I and 0/O can't be confused) — provenance a healthcare brief can literally cite. Hanken at 700–800 supplies display warmth from the same grotesque family tree. |
| `calm-serif` | Lora | Figtree | calm, warm | therapy, wellness, education | D: wght 400–700, ital · B: wght 300–900, ital | Lora's brushy transitional curves read warm-not-clinical; Figtree's plain geometric (Calm=84) keeps UI chrome quiet — the middle ground between corporate and precious. |

## Civic / corporate

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `civic-news` | Libre Franklin | Source Serif 4 | editorial, trust | news, policy, nonprofits, civic tech | D: wght 100–900, ital · B: opsz 8–60, wght 200–900, ital | The newspaper inversion: gothic masthead over serif longform. Franklin is THE American news gothic (Public Sans is its fork — this pair and `condensed-civic` are cousins, pick one per project); Source Serif's text opsz carries body trust. |
| `fintech-modern` | Familjen Grotesk | Figtree | technical, calm | fintech, B2B SaaS, analytics | D: wght 400–700, ital · B: wght 300–900, ital | Familjen brings Scandinavian-newsroom credibility with just enough quirk; both have tall x-heights and matched proportions for dense data UI. True italics on both — emphasis works in tables. |

## Technical

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `technical-docs` | IBM Plex Sans | IBM Plex Serif | technical, editorial | engineering blogs, docs, enterprise devtools | D: wdth 75–100, wght 100–700, ital · B: **— static** (100–700 + ital) | The Plex superfamily shares stroke logic across sans/serif/mono: Sans condensed headlines via wdth, Serif (Business=92, `/Serif/Scotch=100`) for longform, Plex Mono free for code. ⚑ Plex Serif is static on GF/Fontsource — needs the static-shelf exception (400 + 700 files) or npm-only. |
| `technical-terminal` | Martian Mono | Instrument Sans | technical, brutalist-adjacent | CLIs, infra, security, terminals | D: wdth 75–112.5, wght 100–800 (variable mono — rare) · B: wdth 75–100, wght 400–700, ital | Terminal aesthetic done as a real design tool: a variable-width mono display so only headings read as code, while the proportional body keeps prose humane. Dodges the JetBrains-Mono-as-body cliché. |

## Playful

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `playful-rounded` | Baloo 2 | Nunito Sans ⚠ | playful | kids, food delivery, pets, education | D: wght 400–800 · B: YTLC 440–540, opsz 6–12, wdth 75–125, wght 200–1000, ital | Baloo 2's `/Sans/Rounded=100` chub at 700–800 against the only body face with FOUR axes — YTLC literally tunes the body x-height to match Baloo's proportions. That axis story exists nowhere else. |
| `playful-hand` | Shantell Sans | Nunito Sans ⚠ | playful, warm | community, creator tools, zines | D: BNCE −100–100, INFM 0–100, SPAC 0–100, wght 300–800, ital · B: as above | A handwriting font with engineering: BNCE (bounce) and INFM (informality) are animatable axes — motion vocabulary for free within brief constraints. Nunito Sans's rounded terminals echo the marker strokes at text size. |
| `quirky-startup` | Bricolage Grotesque | Albert Sans | playful, editorial | playful startups, podcasts, marketing sites | D: opsz 12–96, wdth 75–100, wght 200–800 · B: wght 100–900, ital | Bricolage at display opsz goes chunky and opinionated but its opsz 12 stays civilized — quirk that scales down gracefully; Albert Sans (Calm=85 geometric) is the straight man. |

## Retro / warm

| pair_id | Display | Body | Mood served | Sample verticals | Variable axes | Why it works |
|---|---|---|---|---|---|---|
| `retro-warm` | Young Serif | Work Sans | warm, retro | food & recipes, bakeries, craft goods | D: — (400 only) · B: wght 100–900, ital | Young Serif's chunky 70s old-style (2023, `/Serif/Old Style Garalde=100`, Rugged=70) needs a plain foil; Work Sans at 400/500 disappears, keeping all the warmth in the display layer. |

**Total: 25 pairs, 47 unique families** (Hanken Grotesk and Source Serif 4 serve both roles;
Newsreader pairs with itself via opsz — deliberate shelf economy).

---

## Popularity watchlist (⚠ = rank 21–30; none in top-20)

| Family | Rank | Justification |
|---|---|---|
| DM Sans | 22 | Kept ONLY inside its superfamily pair (`editorial-scotch`) where the coherence is the argument. Never offered as a standalone body. Owner may strike the pair; nothing else depends on it. |
| Nunito Sans | 26 | Its four-axis variable (YTLC/opsz/wdth/wght) is unique among rounded bodies — kept for capability, not familiarity. Alternative if too common: Figtree (rank 47). |
| Playfair Display | 27 | The canonical GF Didone; a magazine brief that means "Didone" means this or Bodoni Moda (which is reserved for fashion). Fraunces covers briefs that can take more quirk. |
| Archivo Black | 28 | The correct instrument for grotesque poster weight; the pair's character comes from scale + width play, not the family's novelty. Alternative: Boldonse (rank 885) in `new-brutalist`. |

## Alternates bench (not in the table; owner swap candidates)

- **Special Gothic Expanded One** (2025-04, `/Sans/Grotesque=100`, static 400) — wider, meaner voice for `new-brutalist`.
- **Cal Sans** (2025-03, `/Sans/Geometric=100`, static 400) — SaaS-hero display alternative to Familjen.
- **Geologica** (CRSV/SHRP/slnt/wght axes) — sci-tech display if `technical-terminal` reads too raw.
- **Syne** (wght 400–800) — arts/culture agency display; slightly fashion-forward.
- **Sour Gummy** (2024-11, wdth 100–125 + wght + ital, `/Theme/Blobby=100`) — candy/kids display if `playful-rounded` is too tame.
- **Anybody** (wdth 50–150, wght 100–900) — variable-width poster play for experimental briefs.
- **Literata** (opsz 7–72) — e-book/reading-app serif body alternative to Newsreader.
- **Spectral** (static) — screen-first transitional serif body; static-only keeps it benched.

---

## Worked briefs

### 1. Brutalist crypto landing page
- **Naive grep (the proven failure):** `/Expressive/Loud>=60` → Alien Block, Nabla, Honk,
  Kablammo — color/novelty fonts (all `/Theme/*`-only structurals, none has a `wght` axis).
- **Table resolution:** `brutalist-techno` (Space Grotesk / Zalando Sans). Crypto-infra audience
  wants technical credibility, not carnival: SG's `/Theme/Techno=100` + Neo Grotesque=100 delivers
  the mood structurally. Brief constraints copied from verified data: display weights 300–700
  ONLY, **no italic exists** — emphasis via weight/size; body gets wdth + full 200–900 range.
- **Alternate:** consumer-facing token/meme site → `brutalist-expanded` (Unbounded / Manrope) for
  the wide techno shout; `brutalist-poster` if the art direction is print-poster brutalism.

### 2. Calm healthcare SaaS
- **Naive grep (the proven failure):** Calm>=80 alone returns ABeeZee then a wall of Noto Sans
  variants (212 isNoto families drown the query).
- **Table resolution:** `calm-accessible` (Hanken Grotesk / Atkinson Hyperlegible Next). The body
  font's provenance (Braille Institute hyperlegibility program, 2025 revision) is itself a trust
  argument for the vertical; Calm scores 89/75; both variable wght with true italics.
- **Alternate:** more institutional/document-heavy product (insurance, EHR, gov-adjacent) →
  `calm-humanist` (Source Serif 4 / Source Sans 3) — the serif display reads established rather
  than friendly.

### 3. Editorial magazine
- **Naive grep (the proven failure):** `/Expressive/Sophisticated>=70` → Great Vibes, Imperial
  Script — wedding scripts.
- **Table resolution:** depends on one Phase-0 question — is the magazine text-led or image-led?
  Text-led longform → `editorial-opsz` (Newsreader vs itself; opsz 6–72 gives masthead-to-caption
  coherence from a single 20–30KB woff2). Image-led glossy → `editorial-didone` (Playfair /
  Source Sans 3) for hairline drama between photos.
- **Alternate:** indie/DTC-flavored publication → `editorial-wonky` (Fraunces / Hanken Grotesk)
  with WONK=1 + SOFT tuned per the brief's temperature.

---

## Constraints that must survive into the consumption card

1. Display-only families with a single 400 weight (Archivo Black, Dela Gothic One, Boldonse,
   Anton, Instrument Serif, DM Serif Display, Italiana, Prata, Young Serif): the brief's type
   scale must not request other weights — hierarchy via size.
2. Space Grotesk: no italic, no 100/200. Lexend (bench-adjacent): no italic. Verified — these are
   exactly the hallucinated-weight/CLS traps the shelf exists to end.
3. Cinzel is caps-led: never set body text in it.
4. Newsreader/Fraunces/Bodoni Moda/Big Shoulders: the opsz axis is load-bearing — the shelf must
   carry the opsz variable file, not the wght-only subset (see fonts-tsv-plan.md).
