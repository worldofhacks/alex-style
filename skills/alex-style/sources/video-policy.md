# Video Policy — stock footage sourcing law (Coverr / Pexels / Pixabay)
> Fully authored policy card, no vendored content and no sync function — the photo-policy pattern applied to stock video. Carries a standing arsenal law: **video FILES are NEVER vendored into the arsenal.** All three sanctioned services prohibit redistributing their files as standalone content, which is exactly what a vendored asset shelf would be.

## The law (with the clause that makes it law)
Every row verified against the live 2026 terms on **2026-08-03** (Pexels and Pixabay 403 curl/bots — verified via the Playwright browser path; re-verify the same way, never trust a cached summary):

| Service | Redistribution clause (why we never vendor) |
|---|---|
| **Pexels** (pexels.com/license, fetched 2026-08-03) | "Don't redistribute or sell the photos and videos on other stock photo or wallpaper platforms." Also: "Don't sell unaltered copies of a photo or video." |
| **Pixabay** (pixabay.com/service/license-summary, browser-verified 2026-08-03) | "You cannot sell or distribute Content (either in digital or physical form) on a Standalone basis. Standalone means where no creative effort has been applied to the Content and it remains in substantially the same form as it exists on our website." |
| **Coverr** (coverr.co/license, fetched 2026-08-03) | FAQ: "Am I allowed to sell or redistribute the videos I download from Coverr? … No you're not." License: no "compiling videos or music from Coverr.co to create a similar or competing service." |

Consequences, non-negotiable:
- **Never vendor** a video file under `vendor/` — not as a demo, not as a fixture, not "just one loop". The arsenal is a redistributed collection; a stock clip inside it is a standalone redistribution.
- **Projects fetch their own footage** at design time: download from the service into the project's `/public` (or asset pipeline). Shipping footage *inside a finished site/app* is the use all three licenses grant.
- **Hotlinking is banned.** Never embed `videos.pexels.com`/`cdn.coverr.co`/Pixabay CDN URLs in shipped pages: it violates hard rule 1 (runtime network fetch), breaks offline, leaks visitor data, and the CDN URLs are not contractual — they rot.
- Keep provenance: note each downloaded file's source URL in a project comment or `CREDITS.md` — auditable, and satisfies Coverr's attribution ask for free downloads.

## Per-service dos and don'ts (2026 terms, fetch-date-stamped 2026-08-03)

| | Coverr | Pexels | Pixabay |
|---|---|---|---|
| Commercial use | yes | yes | yes |
| Modify/edit | yes | yes | yes |
| Attribution | **YES for free-tier downloads** — the 2026 summary block says free downloads "must add an attribution credit" while the longform grant still says credit is not required; the terms contradict on-page, so the safe rule is: attribute (Coverr+ subscribers exempt) | no (appreciated) | no (appreciated) |
| Sell/redistribute the file standalone | NO (FAQ above) | NO | NO ("Standalone basis") |
| Use in AI training/datasets | **NO — explicit prohibition** | not addressed in license (ToS scraping limits apply) | not addressed in license (ToS scraping limits apply) |
| Brand/trademark clearance | NOT cleared — separate permission needed | don't imply endorsement by people/brands | no commercial use of content with recognisable trademarks/logos on goods for sale |
| People/model releases | releases obtained but NOT provided to users | identifiable people never in a bad light | no immoral/misleading use, esp. recognisable people |
| Use as trademark/logo | (not addressed — don't) | NO | NO |

## Sourcing workflow
1. Search Coverr (marketing/lifestyle loops), Pexels (broadest library), Pixabay (long tail) for the brief's mood.
2. Download the file into the project (`/public/video/…`); record the source URL; add attribution where the table requires it.
3. Encode/trim per the video craft rules — budgets, poster, autoplay contract, and the **reduced-data / mobile etiquette live in `recipes.md` #hero-video** (poster-only on Save-Data/narrow, `preload="none"` tiers, reduced-motion → static poster). This card governs *where footage comes from*; #hero-video governs *how it ships*.
4. Player chrome only for inline demo/testimonial players → media-chrome (`sources/media-chrome.md`); hero/background video ships with NO chrome; effects on media → vfx-js.

## Staleness / refresh
- No sync function — this card is the artifact. Refresh = re-read all three license pages and re-stamp the dates above. **Pixabay and Pexels 403 bot fetches: use the Playwright browser path.**
- If any service's terms tighten (e.g. Coverr's attribution flip-flop resolves, or a service adds hosted-embed-only clauses), update the table row AND re-check every project recipe that cites this card (#hero-video, #video-player).
- Only the services' full license/terms pages are binding — this table is a routing summary, not legal advice; unusual uses (broadcast, merch, political ads) → read the full terms.
