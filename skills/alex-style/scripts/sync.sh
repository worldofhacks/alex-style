#!/usr/bin/env bash
# alex-style sync — vendors all 18 sync-able sources into <skill>/vendor/ in one
# shot (the 19th source, typography, is a hand-curated TSV — no sync step).
# Uses ONLY curl, git, tar, jq. No browser automation, no npm install, no code execution.
# Idempotent: re-run any time to refresh. Continues past individual failures and
# reports a summary; exits non-zero if any source failed entirely.
#
# Usage:  bash scripts/sync.sh [source ...]     # no args = all sources
# Sources: magicui kokonutui reactbits motion-primitives gsap motion lenis
#          phosphor animista vanta shadergradient recent layers atropos
#          rough-notation roughjs paper-shaders fancy

set -u
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR="$SKILL_DIR/vendor"
UA="alex-style-sync/1.0 (local design asset aggregator)"
FAILURES=()
OK=()

# Pinned versions (bump deliberately; sync verifies latest via npm registry where noted)
PHOSPHOR_CORE_VERSION="2.1.1"
LENIS_VERSION="1.3.25"
# atropos: npm tarball at a pinned version is immutable — ATROPOS_TARBALL_SHA1
# (= registry dist.shasum) gates against republished/foreign artifacts.
ATROPOS_VERSION="2.0.2"
ATROPOS_TARBALL_SHA1="8024e845487a69662b70fdb83f5e81039c934def"
# rough-notation / roughjs: npm tarballs at pinned versions are immutable —
# the sha1s (= registry dist.shasum) gate against republished/foreign artifacts.
ROUGH_NOTATION_VERSION="0.5.1"
ROUGH_NOTATION_TARBALL_SHA1="32abbb16b973fb00fba83ab96b18704e98620e95"
ROUGHJS_VERSION="4.6.6"
ROUGHJS_TARBALL_SHA1="1059f49a5e0c80dee541a005b20cc322b222158b"
# paper-shaders: upstream ships breaking changes under 0.0.x — the pin is
# load-bearing. Both npm tarballs at a pinned version are immutable; the
# sha1s (= registry dist.shasum) gate against republished/foreign artifacts.
PAPER_SHADERS_VERSION="0.0.78"
PAPER_SHADERS_CORE_SHA1="4c866be9df2a50aea458c7f0b563637c7972f91d"
PAPER_SHADERS_REACT_SHA1="b9219503f718ec7c0204471ac12dc64cb3cdcc2e"

say()  { printf '\033[1;34m[sync]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*" >&2; }
fail() { warn "$1"; FAILURES+=("$1"); }

# fetch URL OUTFILE [extra curl args...]
fetch() {
  local url="$1" out="$2"; shift 2
  mkdir -p "$(dirname "$out")"
  if curl -fsSL --retry 3 --retry-delay 2 -A "$UA" "$@" -o "$out.tmp" "$url"; then
    mv "$out.tmp" "$out"; return 0
  else
    rm -f "$out.tmp"; return 1
  fi
}

# sparse_clone REPO_URL BRANCH DEST_TMP path...
sparse_clone() {
  local url="$1" branch="$2" dest="$3"; shift 3
  rm -rf "$dest"
  git clone --quiet --depth 1 --filter=blob:none --sparse --branch "$branch" "$url" "$dest" || return 1
  git -C "$dest" sparse-checkout set "$@" || return 1
}

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# tiny helper for parallel per-name fetches (BSD xargs -I with long inline commands fails)
# usage: <names on stdin> | fetch_many OUTDIR URL_PREFIX URL_SUFFIX OUT_SUFFIX
cat > "$TMP/fetch_one.sh" <<'HELPER'
#!/bin/sh
# $1=name $2=outdir $3=url_prefix $4=url_suffix $5=out_suffix
curl -fsSL --retry 2 -o "$2/$1$5" "$3$1$4" 2>/dev/null || echo "MISS $1"
HELPER
chmod +x "$TMP/fetch_one.sh"
fetch_many() {
  mkdir -p "$1"
  xargs -P 8 -I{} "$TMP/fetch_one.sh" {} "$1" "$2" "$3" "$4"
}

# ---------------------------------------------------------------- Magic UI
sync_magicui() {
  local d="$VENDOR/magicui"
  say "Magic UI: registry + llms docs + per-component JSON"
  fetch "https://magicui.design/r/registry.json" "$d/registry.json" || { fail "magicui registry.json"; return; }
  fetch "https://magicui.design/llms.txt" "$d/llms.txt" || fail "magicui llms.txt"
  fetch "https://magicui.design/llms-full.txt" "$d/llms-full.txt" || fail "magicui llms-full.txt"
  fetch "https://raw.githubusercontent.com/magicuidesign/magicui/main/LICENSE.md" "$d/LICENSE.md" || warn "magicui LICENSE miss"
  jq -r '.items[] | select(.type == "registry:ui") | .name' "$d/registry.json" \
    | fetch_many "$d/r" "https://magicui.design/r/" ".json" ".json" \
    | sed 's/^MISS /  missing: /'
  say "Magic UI: $(ls "$d/r" | wc -l | tr -d ' ') component JSONs vendored"
  # the maintainers' own agent skill (component reference + usage recipes)
  if sparse_clone "https://github.com/magicuidesign/magicui" main "$TMP/magicui-skill" skills; then
    rm -rf "$d/skill"
    cp -R "$TMP/magicui-skill/skills/magic-ui" "$d/skill" 2>/dev/null \
      || warn "magicui skills/magic-ui dir not found in clone"
  else
    warn "magicui skill clone failed"
  fi
}

# ---------------------------------------------------------------- KokonutUI
sync_kokonutui() {
  local d="$VENDOR/kokonutui"
  say "KokonutUI: registry + llms docs + per-component JSON"
  fetch "https://kokonutui.com/r/registry.json" "$d/registry.json" || { fail "kokonutui registry.json"; return; }
  fetch "https://kokonutui.com/llms.txt" "$d/llms.txt" || fail "kokonutui llms.txt"
  fetch "https://kokonutui.com/llms-full.txt" "$d/llms-full.txt" || fail "kokonutui llms-full.txt"
  fetch "https://raw.githubusercontent.com/kokonut-labs/kokonutui/main/LICENSE" "$d/LICENSE" || fail "kokonutui LICENSE"
  # registry.json names + extra published names not in the index (verified to exist)
  { jq -r '.items[].name' "$d/registry.json";
    printf '%s\n' flow-field spotlight-cards loader morphic-navbar mouse-effect-card slide-text-button ai-prompt; } \
    | sort -u \
    | fetch_many "$d/r" "https://kokonutui.com/r/" ".json" ".json" > /dev/null
  say "KokonutUI: $(ls "$d/r" | wc -l | tr -d ' ') component JSONs vendored"
}

# ---------------------------------------------------------------- React Bits
sync_reactbits() {
  local d="$VENDOR/reactbits"
  say "React Bits: llms index + registry + TS-Tailwind variant sources"
  fetch "https://reactbits.dev/llms.txt" "$d/llms.txt" || fail "reactbits llms.txt"
  fetch "https://reactbits.dev/r/registry.json" "$d/registry.json" || { fail "reactbits registry.json"; return; }
  fetch "https://raw.githubusercontent.com/DavidHDev/react-bits/main/LICENSE.md" "$d/LICENSE.md" || fail "reactbits LICENSE.md"
  jq -r '.items[].name | select(endswith("-TS-TW"))' "$d/registry.json" \
    | fetch_many "$d/r" "https://reactbits.dev/r/" "" ".json" \
    | sed 's/^MISS /  missing: /'
  say "React Bits: $(ls "$d/r" | wc -l | tr -d ' ') TS-TW component JSONs vendored"
}

# ---------------------------------------------------------------- Motion-Primitives
sync_motion_primitives() {
  local d="$VENDOR/motion-primitives"
  say "Motion-Primitives: sparse clone (core components + registry + docs)"
  if sparse_clone "https://github.com/ibelick/motion-primitives" main "$TMP/mp" \
      components/core public/c app/docs; then
    rm -rf "$d"; mkdir -p "$d"
    cp -R "$TMP/mp/components/core" "$d/core"
    cp "$TMP/mp/public/c/registry.json" "$d/registry.json"
    [ -d "$TMP/mp/app/docs" ] && cp -R "$TMP/mp/app/docs" "$d/docs"
    fetch "https://raw.githubusercontent.com/ibelick/motion-primitives/main/LICENCE.md" "$d/LICENSE.md" \
      || fetch "https://raw.githubusercontent.com/ibelick/motion-primitives/main/LICENSE.md" "$d/LICENSE.md" \
      || warn "motion-primitives license file not fetched"
    say "Motion-Primitives: $(ls "$d/core" | wc -l | tr -d ' ') core components vendored"
  else
    fail "motion-primitives sparse clone"
  fi
}

# ---------------------------------------------------------------- GSAP
sync_gsap() {
  local d="$VENDOR/gsap"
  say "GSAP: llms.txt + official gsap-skills repo"
  fetch "https://gsap.com/llms.txt" "$d/llms.txt" || fail "gsap llms.txt"
  if git clone --quiet --depth 1 "https://github.com/greensock/gsap-skills" "$TMP/gsap-skills"; then
    rm -rf "$d/skills"; mkdir -p "$d"
    cp -R "$TMP/gsap-skills/skills" "$d/skills" 2>/dev/null || cp -R "$TMP/gsap-skills" "$d/skills"
    rm -rf "$d/skills/.git"
    say "GSAP: official agent skills vendored ($(ls "$d/skills" | wc -l | tr -d ' ') entries)"
  else
    fail "gsap-skills clone"
  fi
}

# ---------------------------------------------------------------- Motion (motion.dev)
sync_motion() {
  local d="$VENDOR/motion"
  say "Motion: llms.txt master doc index"
  fetch "https://motion.dev/llms.txt" "$d/llms.txt" || fail "motion llms.txt"
}

# ---------------------------------------------------------------- Lenis
sync_lenis() {
  local d="$VENDOR/lenis"
  say "Lenis: llms.txt + READMEs + pinned dist for zero-build use"
  fetch "https://www.lenis.dev/llms.txt" "$d/llms.txt" || fail "lenis llms.txt"
  fetch "https://raw.githubusercontent.com/darkroomengineering/lenis/main/README.md" "$d/README.md" || fail "lenis README"
  fetch "https://raw.githubusercontent.com/darkroomengineering/lenis/main/packages/react/README.md" "$d/README.react.md" || warn "lenis react README miss"
  fetch "https://raw.githubusercontent.com/darkroomengineering/lenis/main/packages/snap/README.md" "$d/README.snap.md" || warn "lenis snap README miss"
  fetch "https://unpkg.com/lenis@$LENIS_VERSION/dist/lenis.min.js" "$d/dist/lenis.min.js" || fail "lenis dist js"
  fetch "https://unpkg.com/lenis@$LENIS_VERSION/dist/lenis.css" "$d/dist/lenis.css" || fail "lenis dist css"
}

# ---------------------------------------------------------------- Phosphor Icons
sync_phosphor() {
  local d="$VENDOR/phosphor"
  say "Phosphor: core tarball (9,072 SVGs, kept compressed) + icon catalog"
  mkdir -p "$d"
  if fetch "https://registry.npmjs.org/@phosphor-icons/core/-/core-$PHOSPHOR_CORE_VERSION.tgz" "$d/core.tgz"; then
    # extract only the small metadata files; SVGs stay inside the tarball
    tar -xzf "$d/core.tgz" -C "$TMP" package/LICENSE 2>/dev/null && cp "$TMP/package/LICENSE" "$d/LICENSE"
  else
    fail "phosphor core tarball"
  fi
  # canonical machine-readable catalog (1,512 entries with tags/categories)
  fetch "https://raw.githubusercontent.com/phosphor-icons/core/main/src/icons.ts" "$d/icons.ts" || fail "phosphor icons.ts"
}

# ---------------------------------------------------------------- Animista
sync_animista() {
  local d="$VENDOR/animista"
  say "Animista: full keyframes dump + per-family metadata + license"
  fetch "https://raw.githubusercontent.com/vikrantyadav611/tailwindcss-animistacss/master/CSS/animista__keyframes.css" \
    "$d/keyframes.css" || fail "animista keyframes.css"
  fetch "https://raw.githubusercontent.com/kekeh/angular-mydatepicker/master/CSS-ANIMATION-LICENSE" \
    "$d/LICENSE.txt" || warn "animista license copy miss (FreeBSD, (c) 2017 Ana Travas — add manually)"
  if git clone --quiet --depth 1 "https://github.com/amihhs/unocss-preset-animista" "$TMP/animista-meta"; then
    local metadir
    metadir="$(find "$TMP/animista-meta" -type d -name animista -path '*src*' | head -1)"
    if [ -n "$metadir" ]; then
      rm -rf "$d/meta"; cp -R "$metadir" "$d/meta"
      say "Animista: metadata families vendored ($(find "$d/meta" -name '*.ts' | wc -l | tr -d ' ') files)"
    else
      warn "animista meta dir not found in clone"
    fi
  else
    fail "animista meta clone"
  fi
}

# ---------------------------------------------------------------- Vanta.js
sync_vanta() {
  local d="$VENDOR/vanta"
  say "Vanta: dist builds + pinned three.r134 + readable src (defaultOptions)"
  if sparse_clone "https://github.com/tengbao/vanta" master "$TMP/vanta" dist src vendor; then
    rm -rf "$d"; mkdir -p "$d"
    cp -R "$TMP/vanta/dist" "$d/dist"
    mkdir -p "$d/src"; cp "$TMP/vanta/src"/*.js "$d/src/" 2>/dev/null  # includes _base.js + helpers
    cp "$TMP/vanta/vendor/three.r134.min.js" "$d/three.r134.min.js" 2>/dev/null || warn "vanta three.r134 miss"
    fetch "https://raw.githubusercontent.com/tengbao/vanta/master/README.md" "$d/README.md" || warn "vanta README miss"
    fetch "https://raw.githubusercontent.com/tengbao/vanta/master/LICENSE.md" "$d/LICENSE.md" || warn "vanta LICENSE miss"
    say "Vanta: $(ls "$d/dist" | grep -c 'min.js') dist builds vendored"
  else
    fail "vanta sparse clone"
  fi
}

# ---------------------------------------------------------------- ShaderGradient
sync_shadergradient() {
  local d="$VENDOR/shadergradient"
  say "ShaderGradient: presets catalog + README"
  fetch "https://raw.githubusercontent.com/ruucm/shadergradient/main/packages/shadergradient/src/presets.ts" \
    "$d/presets.ts" || fail "shadergradient presets.ts"
  fetch "https://raw.githubusercontent.com/ruucm/shadergradient/main/README.md" "$d/README.md" || fail "shadergradient README"
}

# ---------------------------------------------------------------- recent.design
sync_recent() {
  local d="$VENDOR/recent"
  say "recent.design: metadata-only catalog via public tRPC API (media stays on their CDN)"
  mkdir -p "$d"
  fetch "https://recent.design/sitemap.xml" "$d/sitemap.xml" || warn "recent sitemap miss"
  # categories
  fetch "https://api.recent.design/trpc/categories.list?input=%7B%7D" "$d/categories.json" || warn "recent categories miss"
  # paginated items pull per feed -> JSONL of trimmed metadata
  local feed cursor page input url out
  for feed in all tools skills; do
    out="$d/items.$feed.jsonl"; : > "$out"; cursor=""; page=0
    while [ $page -lt 30 ]; do
      page=$((page + 1))
      if [ -n "$cursor" ]; then
        input=$(jq -rn --arg c "$cursor" --arg f "$feed" '{limit:50, feed:$f, sort:"recent", cursor:$c} | tojson | @uri')
      else
        input=$(jq -rn --arg f "$feed" '{limit:50, feed:$f, sort:"recent"} | tojson | @uri')
      fi
      url="https://api.recent.design/trpc/items.list?input=$input"
      if ! curl -fsSL --retry 2 -o "$TMP/recent-page.json" "$url"; then
        warn "recent $feed page $page fetch failed"; break
      fi
      jq -c '(.result.data.json // .result.data)
             | (.items // [])[]
             | {id, title, tagline, description, category, format,
                creator: (.creator.name // .creator.handle // null),
                source: (.source.url // null),
                installCommand: (.installCommand // null),
                githubUrl: (.githubUrl // null), githubStars: (.githubStars // null)}' \
        "$TMP/recent-page.json" >> "$out" 2>/dev/null
      cursor=$(jq -r '(.result.data.json // .result.data) | .nextCursor // empty' "$TMP/recent-page.json")
      [ -z "$cursor" ] && break
    done
    say "recent.design [$feed]: $(wc -l < "$out" | tr -d ' ') items"
  done
  [ -s "$d/items.all.jsonl" ] || fail "recent items pull"
}

# ---------------------------------------------------------------- Layers
sync_layers() {
  local d="$VENDOR/layers"
  say "Layers: tags + color palettes + shot metadata (metadata only, no images)"
  mkdir -p "$d"
  fetch "https://layers.to/api/v1/tags?take=30" "$d/tags.json" || fail "layers tags"
  fetch "https://layers.to/palettes/list?take=100" "$d/palettes.json" || fail "layers palettes"
  local out="$d/shots.jsonl" cursor="" page=0 url
  : > "$out"
  while [ $page -lt 10 ]; do
    page=$((page + 1))
    url="https://layers.to/api/v1/layers?take=100"
    [ -n "$cursor" ] && url="$url&cursor=$cursor"
    if ! curl -fsSL --retry 2 -H "Referer: https://layers.to/" -o "$TMP/layers-page.json" "$url"; then
      warn "layers page $page fetch failed"; break
    fi
    jq -c '(.layers // .data // [])[]
           | {id, title, description,
              imageUrl: (.imageUrl // null),
              user: (.user.username // null), createdAt}' \
      "$TMP/layers-page.json" >> "$out" 2>/dev/null
    cursor=$(jq -r '.pagination.nextCursor // .nextCursor // empty' "$TMP/layers-page.json")
    [ -z "$cursor" ] && break
  done
  say "Layers: $(wc -l < "$out" | tr -d ' ') shot metadata records"
  [ -s "$out" ] || fail "layers shots pull"
}

# ---------------------------------------------------------------- Atropos
# Layered 3D hover-depth SCENES (per-layer [data-atropos-offset] translate
# planes + projected shadow + moving highlight sweep) — a different GENRE from
# single-plane tilt, which keeps routing to reactbits TiltedCard /
# motion-primitives tilt (class law in sources/atropos.md).
#
# CURATION ALLOWLIST AS DATA (judge mandate): exactly 15 files from package/,
# each with an EXACT byte pin. The npm tarball at a pinned version is immutable
# (registry policy forbids republish), so ANY size drift means a republished or
# foreign artifact — fail loud, keep the previous copy. Everything not named is
# STRUCTURALLY excluded: *.map (4 files, ~122KB dead weight), *.scss/*.less
# (source styles), atropos-element.js/.min.js (UMD element builds — the .mjs
# pair is kept), and any stray artifact. The round-2 audit reported a stray
# 572KB axe.min.js inside the upstream tarball; the registry tarball at
# dist.shasum 8024e84 (re-verified 2026-08-03) does NOT contain it — either
# way the allowlist makes the exclusion structural: nothing outside the 15 can
# ever land.
#
# Upstream is FEATURE-FROZEN (last feature release 2023-07; zero runtime deps
# at all 23 published versions, so no silent version floor is possible; repo
# alive, 482-line core we can patch in-vendor if a browser change ever bites).
# Bumping ATROPOS_VERSION is a deliberate edit: re-run the adding-a-source
# audit and re-pin the sha1 + all 15 byte sizes below.
sync_atropos() {
  local d="$VENDOR/atropos"
  say "Atropos: layered 3D hover scenes — pinned npm tarball @ $ATROPOS_VERSION (15-file allowlist)"

  # allowlist as data: <file> <exact bytes at 2.0.2>, verified against the
  # registry tarball at dist.shasum $ATROPOS_TARBALL_SHA1 on 2026-08-03
  local allow="atropos.mjs 16428
atropos.min.mjs 7015
atropos.js 17374
atropos.min.js 6925
atropos-react.mjs 4772
atropos-element.mjs 19005
atropos-element.min.mjs 9575
atropos.css 1957
atropos.min.css 1666
atropos.d.ts 932
atropos-react.d.ts 528
atropos-element.d.ts 1526
LICENSE 1077
README.md 304
package.json 1660"

  local tgz="$TMP/atropos.tgz" ex="$TMP/atropos-ex"
  fetch "https://registry.npmjs.org/atropos/-/atropos-$ATROPOS_VERSION.tgz" "$tgz" \
    || { fail "atropos tarball fetch @ $ATROPOS_VERSION (keeping previous copy)"; return; }

  # integrity gate: npm dist.shasum (sha1) is immutable at a pinned version —
  # a mismatch is a republished/tampered artifact, never vendor it. Tool is
  # best-effort portable (shasum on macOS, sha1sum on Linux); when neither
  # exists the per-file byte pins below still catch drift.
  local sha=""
  if command -v shasum >/dev/null 2>&1; then sha="$(shasum -a 1 "$tgz" | awk '{print $1}')"
  elif command -v sha1sum >/dev/null 2>&1; then sha="$(sha1sum "$tgz" | awk '{print $1}')"
  fi
  if [ -n "$sha" ] && [ "$sha" != "$ATROPOS_TARBALL_SHA1" ]; then
    fail "atropos tarball sha1 $sha != pinned $ATROPOS_TARBALL_SHA1 — republished/foreign artifact, refusing to vendor"
    return
  fi
  [ -n "$sha" ] || warn "atropos: no shasum/sha1sum on PATH — relying on per-file byte pins only"

  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "atropos tarball extract — keeping previous copy"; return; }

  # identity gates from the artifact itself: pinned version, MIT in
  # package.json AND in the LICENSE text, and the zero-dep invariant (held
  # across all 23 published versions at audit — a new runtime dep means the
  # library changed shape: re-audit, never auto-vendor)
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$ex/package/package.json")" \
    || { fail "atropos package.json parse — keeping previous copy"; return; }
  got_license="$(jq -r '.license // empty' "$ex/package/package.json")"
  [ "$got_version" = "$ATROPOS_VERSION" ] \
    || { fail "atropos version mismatch: tarball says '$got_version', pinned $ATROPOS_VERSION — keeping previous copy"; return; }
  [ "$got_license" = "MIT" ] \
    || { fail "atropos license is '$got_license', expected MIT — refusing to vendor"; return; }
  grep -q "MIT License" "$ex/package/LICENSE" \
    || { fail "atropos LICENSE text is not the MIT License — refusing to vendor"; return; }
  jq -e '(.dependencies // {}) | length == 0' "$ex/package/package.json" > /dev/null \
    || { fail "atropos grew runtime dependencies — re-audit before vendoring; keeping previous copy"; return; }

  # stage EXACTLY the allowlist — per-file existence + exact byte pins
  local stage="$TMP/atropos-stage" name bytes actual
  rm -rf "$stage"; mkdir -p "$stage"
  while read -r name bytes; do
    [ -f "$ex/package/$name" ] \
      || { fail "atropos: allowlisted file $name missing from tarball — keeping previous copy"; return; }
    actual=$(wc -c < "$ex/package/$name" | tr -d ' ')
    [ "$actual" -eq "$bytes" ] \
      || { fail "atropos: $name is $actual bytes, pinned $bytes — tarball drifted from the audited artifact; keeping previous copy"; return; }
    cp "$ex/package/$name" "$stage/$name" \
      || { fail "atropos: copy of $name failed — keeping previous copy"; return; }
  done <<< "$allow"

  # count + envelope gates (judge mandate: exactly 15 files, total under 200KB)
  local n total
  n=$(ls "$stage" | wc -l | tr -d ' ')
  [ "$n" -eq 15 ] \
    || { fail "atropos: staged $n files != 15 allowlisted — keeping previous copy"; return; }
  total=$(find "$stage" -type f -exec cat {} + | wc -c | tr -d ' ')
  { [ "$total" -ge 80000 ] && [ "$total" -lt 200000 ]; } \
    || { fail "atropos: staged total $total bytes outside the 80000-200000 envelope (audit: 90,744) — keeping previous copy"; return; }

  # PIN.json — the per-file byte manifest (auditable offline; the arsenal
  # self-test asserts version/count against it). NOTE: files_json is built in
  # a separate ASSIGNMENT on purpose — macOS bash 3.2 mis-parses a nested
  # single-quoted awk/jq program inside an argument-position "$(...)" (brace
  # expansion fires inside the quoted program); assignment position is safe.
  local files_json
  files_json="$(cd "$stage" && wc -c -- * | awk '$2 != "total" {print $2, $1}' \
    | jq -Rn '[inputs | split(" ") | {name: .[0], bytes: (.[1] | tonumber)}] | sort_by(.name)')" \
    || { fail "atropos PIN.json byte listing failed — keeping previous copy"; return; }
  jq -n --arg version "$ATROPOS_VERSION" --arg sha1 "$ATROPOS_TARBALL_SHA1" \
        --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson files "$files_json" \
        '{package: "atropos", version: $version, tarball_sha1: $sha1, synced_at: $date,
          allowlist_files: ($files | length), total_bytes: ([$files[].bytes] | add), files: $files,
          excluded: "everything not in files[] — *.map, *.scss, *.less, atropos-element(.min).js UMD builds, and any stray artifact (round-2 audit reported a 572KB axe.min.js; the registry tarball at this sha1 has none — the allowlist makes the exclusion structural either way)"}' \
    > "$stage/PIN.json" \
    || { fail "atropos PIN.json write failed — keeping previous copy"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Atropos: 15 files ($total bytes) + PIN.json vendored @ $ATROPOS_VERSION — layered-scene class only; card law: reduced-motion gate + rotateTouch:'scroll-y' (sources/atropos.md)"
}

# ---------------------------------------------------------- Rough Notation
# Hand-drawn ANNOTATIONS on live copy (underline/circle/box/bracket/highlight/
# strike-through as animated SVG over real DOM text) — the annotation engine;
# freeform sketchy shapes route to roughjs, draw-on of authored art to DrawSVG
# (class law in sources/rough-notation.md).
#
# CURATION ALLOWLIST AS DATA: exactly 10 files, each with an EXACT byte pin,
# flattened from package/lib/ into the vendor root (atropos precedent). The
# UNBUNDLED lib/{rough-notation,render,model,keyframes}.js are STRUCTURALLY
# excluded — they import from roughjs/bin/* and are not self-contained; the
# three bundled builds (esm/iife/cjs) inline that code, verified import-free
# at audit. Upstream is FEATURE-FROZEN (last release 2020): any fix is a
# PATCHED(alex-style) edit in-vendor, never a version float. Bumping
# ROUGH_NOTATION_VERSION is a deliberate edit: re-run the adding-a-source
# audit and re-pin the sha1 + all 10 byte sizes below.
sync_rough_notation() {
  local d="$VENDOR/rough-notation"
  say "Rough Notation: hand-drawn annotations — pinned npm tarball @ $ROUGH_NOTATION_VERSION (10-file allowlist)"

  # allowlist as data: <tarball path> <exact bytes at 0.5.1>, verified against
  # the registry tarball at dist.shasum $ROUGH_NOTATION_TARBALL_SHA1 on 2026-08-04
  local allow="lib/rough-notation.esm.js 10691
lib/rough-notation.iife.js 10781
lib/rough-notation.cjs.js 10755
lib/rough-notation.d.ts 290
lib/model.d.ts 1179
lib/render.d.ts 239
lib/keyframes.d.ts 49
LICENSE 1068
README.md 8677
package.json 980"

  local tgz="$TMP/rough-notation.tgz" ex="$TMP/rough-notation-ex"
  fetch "https://registry.npmjs.org/rough-notation/-/rough-notation-$ROUGH_NOTATION_VERSION.tgz" "$tgz" \
    || { fail "rough-notation tarball fetch @ $ROUGH_NOTATION_VERSION (keeping previous copy)"; return; }

  # integrity gate: npm dist.shasum (sha1) is immutable at a pinned version —
  # a mismatch is a republished/tampered artifact, never vendor it.
  local sha=""
  if command -v shasum >/dev/null 2>&1; then sha="$(shasum -a 1 "$tgz" | awk '{print $1}')"
  elif command -v sha1sum >/dev/null 2>&1; then sha="$(sha1sum "$tgz" | awk '{print $1}')"
  fi
  if [ -n "$sha" ] && [ "$sha" != "$ROUGH_NOTATION_TARBALL_SHA1" ]; then
    fail "rough-notation tarball sha1 $sha != pinned $ROUGH_NOTATION_TARBALL_SHA1 — republished/foreign artifact, refusing to vendor"
    return
  fi
  [ -n "$sha" ] || warn "rough-notation: no shasum/sha1sum on PATH — relying on per-file byte pins only"

  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "rough-notation tarball extract — keeping previous copy"; return; }

  # identity gates: pinned version, MIT in package.json AND in the LICENSE
  # text, zero-runtime-dep invariant, and the bundled builds import-free
  # (external import/require in a "bundled" file means the build changed
  # shape: re-audit, never auto-vendor)
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$ex/package/package.json")" \
    || { fail "rough-notation package.json parse — keeping previous copy"; return; }
  got_license="$(jq -r '.license // empty' "$ex/package/package.json")"
  [ "$got_version" = "$ROUGH_NOTATION_VERSION" ] \
    || { fail "rough-notation version mismatch: tarball says '$got_version', pinned $ROUGH_NOTATION_VERSION — keeping previous copy"; return; }
  [ "$got_license" = "MIT" ] \
    || { fail "rough-notation license is '$got_license', expected MIT — refusing to vendor"; return; }
  grep -q "MIT License" "$ex/package/LICENSE" \
    || { fail "rough-notation LICENSE text is not the MIT License — refusing to vendor"; return; }
  jq -e '(.dependencies // {}) | length == 0' "$ex/package/package.json" > /dev/null \
    || { fail "rough-notation grew runtime dependencies — re-audit before vendoring; keeping previous copy"; return; }
  local b
  for b in rough-notation.esm.js rough-notation.iife.js rough-notation.cjs.js; do
    if grep -qE "require\(['\"]|from[[:space:]]+['\"]" "$ex/package/lib/$b"; then
      fail "rough-notation: bundled $b contains external import/require — build changed shape, re-audit; keeping previous copy"
      return
    fi
  done

  # stage EXACTLY the allowlist — per-file existence + exact byte pins,
  # flattened (basename) into the vendor root
  local stage="$TMP/rough-notation-stage" name bytes actual
  rm -rf "$stage"; mkdir -p "$stage"
  while read -r name bytes; do
    [ -f "$ex/package/$name" ] \
      || { fail "rough-notation: allowlisted file $name missing from tarball — keeping previous copy"; return; }
    actual=$(wc -c < "$ex/package/$name" | tr -d ' ')
    [ "$actual" -eq "$bytes" ] \
      || { fail "rough-notation: $name is $actual bytes, pinned $bytes — tarball drifted from the audited artifact; keeping previous copy"; return; }
    cp "$ex/package/$name" "$stage/$(basename "$name")" \
      || { fail "rough-notation: copy of $name failed — keeping previous copy"; return; }
  done <<< "$allow"

  # count + envelope gates (exactly 10 files, total inside 40-80KB; audit: 44,709)
  local n total
  n=$(ls "$stage" | wc -l | tr -d ' ')
  [ "$n" -eq 10 ] \
    || { fail "rough-notation: staged $n files != 10 allowlisted — keeping previous copy"; return; }
  total=$(find "$stage" -type f -exec cat {} + | wc -c | tr -d ' ')
  { [ "$total" -ge 40000 ] && [ "$total" -lt 80000 ]; } \
    || { fail "rough-notation: staged total $total bytes outside the 40000-80000 envelope (audit: 44,709) — keeping previous copy"; return; }

  # PIN.json — per-file byte manifest (files_json in ASSIGNMENT position on
  # purpose; see the macOS bash 3.2 note in sync_atropos)
  local files_json
  files_json="$(cd "$stage" && wc -c -- * | awk '$2 != "total" {print $2, $1}' \
    | jq -Rn '[inputs | split(" ") | {name: .[0], bytes: (.[1] | tonumber)}] | sort_by(.name)')" \
    || { fail "rough-notation PIN.json byte listing failed — keeping previous copy"; return; }
  jq -n --arg version "$ROUGH_NOTATION_VERSION" --arg sha1 "$ROUGH_NOTATION_TARBALL_SHA1" \
        --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson files "$files_json" \
        '{package: "rough-notation", version: $version, tarball_sha1: $sha1, synced_at: $date,
          allowlist_files: ($files | length), total_bytes: ([$files[].bytes] | add), files: $files,
          excluded: "everything not in files[] — the unbundled lib/{rough-notation,render,model,keyframes}.js (they import from roughjs/bin/* and are NOT self-contained; the three bundled builds inline that code), rollup.config.js, .github/FUNDING.yml, and any stray artifact — the allowlist makes the exclusion structural"}' \
    > "$stage/PIN.json" \
    || { fail "rough-notation PIN.json write failed — keeping previous copy"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Rough Notation: 10 files ($total bytes) + PIN.json vendored @ $ROUGH_NOTATION_VERSION — annotation class only; card law: color never defaulted + reduced-motion gate (sources/rough-notation.md)"
}

# ---------------------------------------------------------------- rough.js
# Hand-sketched SHAPE PRIMITIVES (wobbly line/rect/ellipse/polygon/arc/path,
# 7 fill styles, SVG or canvas) — the shape engine; annotation of live copy
# routes to rough-notation, draw-on of authored art to DrawSVG (class law in
# sources/roughjs.md).
#
# CURATION ALLOWLIST AS DATA: exactly 14 files, each with an EXACT byte pin,
# flattened from package/bundled/ into the vendor root. roughjs declares 4 npm
# deps (hachure-fill, path-data-parser, points-on-curve, points-on-path) but
# the bundled/ builds INLINE all four — verified import-free at audit; the
# unbundled bin/ tree (which DOES import them) is STRUCTURALLY excluded, as
# are bundled/fillers/*.d.ts (internal filler types). Bumping ROUGHJS_VERSION
# is a deliberate edit: re-run the adding-a-source audit and re-pin the sha1 +
# all 14 byte sizes below.
sync_roughjs() {
  local d="$VENDOR/roughjs"
  say "rough.js: hand-sketched shape primitives — pinned npm tarball @ $ROUGHJS_VERSION (14-file allowlist)"

  # allowlist as data: <tarball path> <exact bytes at 4.6.6>, verified against
  # the registry tarball at dist.shasum $ROUGHJS_TARBALL_SHA1 on 2026-08-04
  local allow="bundled/rough.esm.js 27748
bundled/rough.js 27762
bundled/rough.cjs.js 30719
bundled/rough.d.ts 403
bundled/core.d.ts 2183
bundled/generator.d.ts 1217
bundled/canvas.d.ts 1208
bundled/svg.d.ts 1264
bundled/renderer.d.ts 1994
bundled/geometry.d.ts 229
bundled/math.d.ts 147
LICENSE 1068
README.md 6057
package.json 1291"

  local tgz="$TMP/roughjs.tgz" ex="$TMP/roughjs-ex"
  fetch "https://registry.npmjs.org/roughjs/-/roughjs-$ROUGHJS_VERSION.tgz" "$tgz" \
    || { fail "roughjs tarball fetch @ $ROUGHJS_VERSION (keeping previous copy)"; return; }

  # integrity gate: npm dist.shasum (sha1) is immutable at a pinned version —
  # a mismatch is a republished/tampered artifact, never vendor it.
  local sha=""
  if command -v shasum >/dev/null 2>&1; then sha="$(shasum -a 1 "$tgz" | awk '{print $1}')"
  elif command -v sha1sum >/dev/null 2>&1; then sha="$(sha1sum "$tgz" | awk '{print $1}')"
  fi
  if [ -n "$sha" ] && [ "$sha" != "$ROUGHJS_TARBALL_SHA1" ]; then
    fail "roughjs tarball sha1 $sha != pinned $ROUGHJS_TARBALL_SHA1 — republished/foreign artifact, refusing to vendor"
    return
  fi
  [ -n "$sha" ] || warn "roughjs: no shasum/sha1sum on PATH — relying on per-file byte pins only"

  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "roughjs tarball extract — keeping previous copy"; return; }

  # identity gates: pinned version, MIT in package.json AND in the LICENSE
  # text, dependency set EXACTLY the 4 audited inlined deps (a new dep means
  # the library changed shape: re-audit, never auto-vendor), and the bundled
  # builds import-free (the inlining invariant this vendoring depends on)
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$ex/package/package.json")" \
    || { fail "roughjs package.json parse — keeping previous copy"; return; }
  got_license="$(jq -r '.license // empty' "$ex/package/package.json")"
  [ "$got_version" = "$ROUGHJS_VERSION" ] \
    || { fail "roughjs version mismatch: tarball says '$got_version', pinned $ROUGHJS_VERSION — keeping previous copy"; return; }
  [ "$got_license" = "MIT" ] \
    || { fail "roughjs license is '$got_license', expected MIT — refusing to vendor"; return; }
  grep -q "MIT License" "$ex/package/LICENSE" \
    || { fail "roughjs LICENSE text is not the MIT License — refusing to vendor"; return; }
  jq -e '(.dependencies // {}) | keys == ["hachure-fill","path-data-parser","points-on-curve","points-on-path"]' \
    "$ex/package/package.json" > /dev/null \
    || { fail "roughjs dependency set changed from the 4 audited inlined deps — re-audit before vendoring; keeping previous copy"; return; }
  local b
  for b in rough.esm.js rough.js rough.cjs.js; do
    if grep -qE "require\(['\"]|from[[:space:]]+['\"]" "$ex/package/bundled/$b"; then
      fail "roughjs: bundled $b contains external import/require — deps no longer inlined, re-audit; keeping previous copy"
      return
    fi
  done

  # stage EXACTLY the allowlist — per-file existence + exact byte pins,
  # flattened (basename) into the vendor root
  local stage="$TMP/roughjs-stage" name bytes actual
  rm -rf "$stage"; mkdir -p "$stage"
  while read -r name bytes; do
    [ -f "$ex/package/$name" ] \
      || { fail "roughjs: allowlisted file $name missing from tarball — keeping previous copy"; return; }
    actual=$(wc -c < "$ex/package/$name" | tr -d ' ')
    [ "$actual" -eq "$bytes" ] \
      || { fail "roughjs: $name is $actual bytes, pinned $bytes — tarball drifted from the audited artifact; keeping previous copy"; return; }
    cp "$ex/package/$name" "$stage/$(basename "$name")" \
      || { fail "roughjs: copy of $name failed — keeping previous copy"; return; }
  done <<< "$allow"

  # count + envelope gates (exactly 14 files, total inside 90-200KB; audit: 103,290)
  local n total
  n=$(ls "$stage" | wc -l | tr -d ' ')
  [ "$n" -eq 14 ] \
    || { fail "roughjs: staged $n files != 14 allowlisted — keeping previous copy"; return; }
  total=$(find "$stage" -type f -exec cat {} + | wc -c | tr -d ' ')
  { [ "$total" -ge 90000 ] && [ "$total" -lt 200000 ]; } \
    || { fail "roughjs: staged total $total bytes outside the 90000-200000 envelope (audit: 103,290) — keeping previous copy"; return; }

  # PIN.json — per-file byte manifest (files_json in ASSIGNMENT position on
  # purpose; see the macOS bash 3.2 note in sync_atropos)
  local files_json
  files_json="$(cd "$stage" && wc -c -- * | awk '$2 != "total" {print $2, $1}' \
    | jq -Rn '[inputs | split(" ") | {name: .[0], bytes: (.[1] | tonumber)}] | sort_by(.name)')" \
    || { fail "roughjs PIN.json byte listing failed — keeping previous copy"; return; }
  jq -n --arg version "$ROUGHJS_VERSION" --arg sha1 "$ROUGHJS_TARBALL_SHA1" \
        --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson files "$files_json" \
        '{package: "roughjs", version: $version, tarball_sha1: $sha1, synced_at: $date,
          allowlist_files: ($files | length), total_bytes: ([$files[].bytes] | add), files: $files,
          excluded: "everything not in files[] — the entire bin/ unbundled tree (imports the 4 npm deps hachure-fill/path-data-parser/points-on-curve/points-on-path; the bundled/ builds inline all four), bundled/fillers/*.d.ts internal filler types, CHANGELOG.md, tsconfig.json, .eslintrc.json, .github/FUNDING.yml, and any stray artifact — the allowlist makes the exclusion structural"}' \
    > "$stage/PIN.json" \
    || { fail "roughjs PIN.json write failed — keeping previous copy"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "rough.js: 14 files ($total bytes) + PIN.json vendored @ $ROUGHJS_VERSION — shape class only; card law: accent-only 1-2/page + rough.svg over rough.canvas (sources/roughjs.md)"
}

sync_paper_shaders() {
  local d="$VENDOR/paper-shaders"
  say "Paper Shaders: 29 zero-dep WebGL2 shaders — BOTH pinned npm tarballs @ $PAPER_SHADERS_VERSION"

  # per-package pins verified against registry dist.shasum on 2026-08-04:
  #   <npm name> <sha1> <vendor subdir> <allowlist file count> <allowlist total bytes>
  local pkgs="@paper-design/shaders $PAPER_SHADERS_CORE_SHA1 core 82 387059
@paper-design/shaders-react $PAPER_SHADERS_REACT_SHA1 react 76 177351"

  local stage="$TMP/paper-shaders-stage"
  rm -rf "$stage"; mkdir -p "$stage"

  local name sha1 sub want_n want_bytes
  while read -r name sha1 sub want_n want_bytes; do
    local base="${name##*/}"                       # shaders / shaders-react
    local tgz="$TMP/$base-$PAPER_SHADERS_VERSION.tgz" ex="$TMP/$base-ex"
    fetch "https://registry.npmjs.org/$name/-/$base-$PAPER_SHADERS_VERSION.tgz" "$tgz" \
      || { fail "paper-shaders: $name tarball fetch @ $PAPER_SHADERS_VERSION (keeping previous copy)"; return; }

    # integrity gate: immutable tarball sha1 — a mismatch is a republished/
    # tampered artifact, never vendor it (tool best-effort portable)
    local sha=""
    if command -v shasum >/dev/null 2>&1; then sha="$(shasum -a 1 "$tgz" | awk '{print $1}')"
    elif command -v sha1sum >/dev/null 2>&1; then sha="$(sha1sum "$tgz" | awk '{print $1}')"
    fi
    if [ -n "$sha" ] && [ "$sha" != "$sha1" ]; then
      fail "paper-shaders: $name tarball sha1 $sha != pinned $sha1 — republished/foreign artifact, refusing to vendor"
      return
    fi
    [ -n "$sha" ] || warn "paper-shaders: no shasum/sha1sum on PATH — relying on count/byte envelope gates only"

    rm -rf "$ex"; mkdir -p "$ex"
    tar -xzf "$tgz" -C "$ex" || { fail "paper-shaders: $name extract — keeping previous copy"; return; }

    # identity gates from the artifact itself: pinned version + Apache-2.0 in
    # package.json AND in the LICENSE text, and NOTICE present — LICENSE+NOTICE
    # are an Apache-2.0 REDISTRIBUTION CONDITION, not optional docs
    local got_version got_license
    got_version="$(jq -r '.version // empty' "$ex/package/package.json")" \
      || { fail "paper-shaders: $name package.json parse — keeping previous copy"; return; }
    got_license="$(jq -r '.license // empty' "$ex/package/package.json")"
    [ "$got_version" = "$PAPER_SHADERS_VERSION" ] \
      || { fail "paper-shaders: $name version '$got_version' != pinned $PAPER_SHADERS_VERSION — keeping previous copy"; return; }
    [ "$got_license" = "Apache-2.0" ] \
      || { fail "paper-shaders: $name license is '$got_license', expected Apache-2.0 — refusing to vendor"; return; }
    grep -q "Apache License" "$ex/package/LICENSE" \
      || { fail "paper-shaders: $name LICENSE text is not the Apache License — refusing to vendor"; return; }
    [ -s "$ex/package/NOTICE" ] \
      || { fail "paper-shaders: $name NOTICE missing/empty — Apache-2.0 redistribution condition, refusing to vendor"; return; }

    # dependency invariants: core has ZERO runtime deps; react's ONLY runtime
    # dep is core at the exact pinned version. A new dep = the library changed
    # shape: re-audit, never auto-vendor.
    if [ "$sub" = "core" ]; then
      jq -e '(.dependencies // {}) | length == 0' "$ex/package/package.json" > /dev/null \
        || { fail "paper-shaders: core grew runtime dependencies — re-audit before vendoring; keeping previous copy"; return; }
    else
      jq -e --arg v "$PAPER_SHADERS_VERSION" \
        '(.dependencies // {}) == {"@paper-design/shaders": $v}' "$ex/package/package.json" > /dev/null \
        || { fail "paper-shaders: react deps drifted from {@paper-design/shaders: $PAPER_SHADERS_VERSION} — re-audit; keeping previous copy"; return; }
    fi

    # stage the allowlist: everything EXCEPT *.map (~half the tarball bytes),
    # preserving structure (dist/, dist/shaders/, LICENSE, NOTICE, README, package.json)
    mkdir -p "$stage/$sub"
    (cd "$ex/package" && find . -type f ! -name '*.map' | while read -r f; do
      mkdir -p "$stage/$sub/$(dirname "$f")" && cp "$f" "$stage/$sub/$f"
    done) || { fail "paper-shaders: $name staging failed — keeping previous copy"; return; }

    # count + envelope gates against the audited artifact
    local n total
    n=$(find "$stage/$sub" -type f | wc -l | tr -d ' ')
    [ "$n" -eq "$want_n" ] \
      || { fail "paper-shaders: $name staged $n files != $want_n audited — tarball drifted; keeping previous copy"; return; }
    total=$(find "$stage/$sub" -type f -exec cat {} + | wc -c | tr -d ' ')
    [ "$total" -eq "$want_bytes" ] \
      || { fail "paper-shaders: $name staged $total bytes != $want_bytes audited — tarball drifted; keeping previous copy"; return; }
    find "$stage/$sub" -name '*.map' | grep -q . \
      && { fail "paper-shaders: $name sourcemaps leaked into stage — keeping previous copy"; return; }
  done <<< "$pkgs"

  # PIN.json — one manifest covering both packages (atropos format + packages[]).
  # NOTE: files_json assignments are separate on purpose (macOS bash 3.2 quirk,
  # see sync_atropos).
  local core_files react_files
  core_files="$(cd "$stage/core" && find . -type f | sed 's|^\./||' | sort | while read -r f; do
    printf '%s %s\n' "$f" "$(wc -c < "$f" | tr -d ' ')"
  done | jq -Rn '[inputs | split(" ") | {name: .[0], bytes: (.[1] | tonumber)}]')" \
    || { fail "paper-shaders PIN.json core listing failed — keeping previous copy"; return; }
  react_files="$(cd "$stage/react" && find . -type f | sed 's|^\./||' | sort | while read -r f; do
    printf '%s %s\n' "$f" "$(wc -c < "$f" | tr -d ' ')"
  done | jq -Rn '[inputs | split(" ") | {name: .[0], bytes: (.[1] | tonumber)}]')" \
    || { fail "paper-shaders PIN.json react listing failed — keeping previous copy"; return; }
  jq -n --arg version "$PAPER_SHADERS_VERSION" --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --arg core_sha "$PAPER_SHADERS_CORE_SHA1" --arg react_sha "$PAPER_SHADERS_REACT_SHA1" \
        --argjson core "$core_files" --argjson react "$react_files" \
        '{name: "paper-shaders", version: $version, synced_at: $date,
          packages: [
            {package: "@paper-design/shaders", version: $version, tarball_sha1: $core_sha, dir: "core/",
             license: "Apache-2.0", allowlist_files: ($core | length), total_bytes: ([$core[].bytes] | add), files: $core},
            {package: "@paper-design/shaders-react", version: $version, tarball_sha1: $react_sha, dir: "react/",
             license: "Apache-2.0", allowlist_files: ($react | length), total_bytes: ([$react[].bytes] | add), files: $react}
          ],
          total_bytes: (([$core[].bytes] | add) + ([$react[].bytes] | add)),
          excluded: "everything not in files[] — all *.map sourcemaps (39 core + 36 react, ~669KB, about half the tarball bytes) and any stray artifact; the allowlist makes the exclusion structural. LICENSE and NOTICE are load-bearing (Apache-2.0 redistribution condition), never excludable.",
          pin_is_law: "upstream ships breaking changes under 0.0.x — never float this version; bumping is a deliberate re-audit + re-pin of both tarball sha1s"}' \
    > "$stage/PIN.json" \
    || { fail "paper-shaders PIN.json write failed — keeping previous copy"; return; }

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Paper Shaders: core (82 files) + react (76 files), 564410 bytes + PIN.json vendored @ $PAPER_SHADERS_VERSION — recolor law + speed=0 reduced-motion (sources/paper-shaders.md)"
}

# fancy: registry has no versions — pinned to danielpetho/fancy HEAD at audit time.
FANCY_COMMIT="f9f62c61207b2dd3210476dd98af3c9a5be24094"

# ------------------------------------------- Fancy Components (curated subset)
# 15 approved registry:ui items — the other ~30 were gated out as duplicates of
# already-vendored components (audit revert-lesson). NEVER fetch the whole registry.
FANCY_ITEMS="underline-center underline-comes-in-goes-out underline-goes-out-comes-in underline-to-background media-between-text marquee-along-svg-path element-along-svg-path letter-swap-forward-anim letter-swap-pingpong-anim text-along-path breathing-text variable-font-hover-by-letter elastic-line gooey-svg-filter pixelate-svg-filter"
# registry:hook dependency closure of elastic-line — deps, NOT extra components
FANCY_HOOKS="use-dimensions use-elastic-line-events use-mouse-position"

# literal replace inside .files[0].content; non-zero exit when the anchor is
# missing — i.e. upstream changed under an audited PATCHED(alex-style) edit.
fancy_sub() { # FILE OLD NEW
  jq -e --arg old "$2" --arg new "$3" '
    if (.files[0].content | contains($old))
    then .files[0].content |= (split($old) | join($new))
    else error("PATCH anchor missing") end' "$1" > "$1.tmp" && mv "$1.tmp" "$1"
}

fancy_use_client() { # FILE — prepend the directive; fail if upstream now ships one
  jq -e --arg uc '"use client" // PATCHED(alex-style): added — file uses React hooks but upstream item omits the directive' '
    if (.files[0].content | startswith("\"use client\""))
    then error("upstream now ships use client — drop this patch and re-audit")
    else .files[0].content |= ($uc + "\n\n" + .) end' "$1" > "$1.tmp" && mv "$1.tmp" "$1"
}

sync_fancy() {
  local d="$VENDOR/fancy" s="$TMP/fancy"
  say "Fancy: curated 15-item subset @ ${FANCY_COMMIT:0:12} (+3 elastic-line hooks) — never the whole registry"

  # drift beacon: the registry serves upstream HEAD, not our pin
  local head
  head="$(curl -fsSL --retry 2 -A "$UA" https://api.github.com/repos/danielpetho/fancy/commits/main 2>/dev/null | jq -r '.sha // "unknown"')"
  [ "$head" = "$FANCY_COMMIT" ] \
    || warn "fancy upstream HEAD ${head:0:12} != pinned ${FANCY_COMMIT:0:12} — expect PIN drift below; re-audit before bumping"

  # stage in TMP; the vendor copy is replaced only after every gate passes
  rm -rf "$s"; mkdir -p "$s/r"
  fetch "https://raw.githubusercontent.com/danielpetho/fancy/$FANCY_COMMIT/LICENSE" "$s/LICENSE" \
    || { fail "fancy LICENSE"; return; }
  local n bad=0
  for n in $FANCY_ITEMS $FANCY_HOOKS; do
    fetch "https://www.fancycomponents.dev/r/$n.json" "$s/r/$n.json" || { warn "fancy: missing item $n"; bad=1; }
  done
  [ "$bad" = 0 ] || { fail "fancy: item fetch incomplete — keeping previous copy"; return; }

  # re-apply audited PATCHED(alex-style) edits (SSR-safe useId + use client).
  # Any anchor miss = upstream changed under a patch -> loud failure, keep previous copy.
  local id_cmt='  // PATCHED(alex-style): Math.random() id breaks SSR hydration — useId() is stable across server/client'
  local id_old_a='  // naive id for the path. you should rather use yours :)
  const id =
    pathId || `animated-path-${Math.random().toString(36).substring(7)}`'
  local id_new_a="$id_cmt"'
  const generatedId = useId()
  const id = pathId || `animated-path-${generatedId}`'
  local id_old_m='  // Generate a random ID for the path if not provided
  const id = pathId || `marquee-path-${Math.random().toString(36).substring(7)}`'
  local id_new_m="$id_cmt"'
  const generatedId = useId()
  const id = pathId || `marquee-path-${generatedId}`'
  {
    fancy_use_client "$s/r/text-along-path.json" &&
    fancy_sub "$s/r/text-along-path.json" \
      'import { RefObject, useEffect, useRef } from "react"' \
      'import { RefObject, useEffect, useId, useRef } from "react"' &&
    fancy_sub "$s/r/text-along-path.json" "$id_old_a" "$id_new_a" &&
    fancy_use_client "$s/r/element-along-svg-path.json" &&
    fancy_sub "$s/r/element-along-svg-path.json" \
      '  useEffect,
  useRef,
  useState,
} from "react"' \
      '  useEffect,
  useId,
  useRef,
  useState,
} from "react"' &&
    fancy_sub "$s/r/element-along-svg-path.json" "$id_old_a" "$id_new_a" &&
    fancy_use_client "$s/r/marquee-along-svg-path.json" &&
    fancy_sub "$s/r/marquee-along-svg-path.json" \
      'import React, { RefObject, useCallback, useEffect, useRef } from "react"' \
      'import React, { RefObject, useCallback, useEffect, useId, useRef } from "react"' &&
    fancy_sub "$s/r/marquee-along-svg-path.json" "$id_old_m" "$id_new_m"
  } || { fail "fancy: PATCHED(alex-style) re-apply failed — upstream source changed; re-audit patches + PIN.json; keeping previous copy"; return; }

  # integrity gate: post-patch files must equal the PIN.json sha256 pins
  local sha_tool="" want got drift=0
  if command -v shasum >/dev/null 2>&1; then sha_tool="shasum -a 256"
  elif command -v sha256sum >/dev/null 2>&1; then sha_tool="sha256sum"
  else warn "fancy: no shasum/sha256sum on PATH — skipping PIN integrity gate"; fi
  if [ -n "$sha_tool" ] && [ -f "$d/PIN.json" ]; then
    for n in $FANCY_ITEMS $FANCY_HOOKS; do
      want="$(jq -r --arg n "$n" '(.items + .hook_items)[] | select(.name == $n).sha256' "$d/PIN.json")"
      got="$($sha_tool "$s/r/$n.json" | awk '{print $1}')"
      [ "$got" = "$want" ] || { warn "fancy: $n sha256 drift vs PIN.json"; drift=1; }
    done
    [ "$drift" = 0 ] || { fail "fancy: upstream drifted from PIN — diff, re-audit, update PIN.json deliberately; keeping previous copy"; return; }
  fi

  mkdir -p "$d"; rm -rf "$d/r"; cp -R "$s/r" "$d/r"; cp "$s/LICENSE" "$d/LICENSE"
  say "Fancy: $(ls "$d/r" | wc -l | tr -d ' ') pinned item JSONs vendored (15 components + 3 hooks)"
}

# ---------------------------------------------------------------- main
ALL_SOURCES=(magicui kokonutui reactbits motion-primitives gsap motion lenis phosphor animista vanta shadergradient recent layers atropos rough-notation roughjs paper-shaders fancy)
SOURCES=("${@:-}")
[ -z "${SOURCES[0]:-}" ] && SOURCES=("${ALL_SOURCES[@]}")

mkdir -p "$VENDOR"
for s in "${SOURCES[@]}"; do
  case "$s" in
    magicui)            sync_magicui ;;
    kokonutui)          sync_kokonutui ;;
    reactbits)          sync_reactbits ;;
    motion-primitives)  sync_motion_primitives ;;
    gsap)               sync_gsap ;;
    motion)             sync_motion ;;
    lenis)              sync_lenis ;;
    phosphor)           sync_phosphor ;;
    animista)           sync_animista ;;
    vanta)              sync_vanta ;;
    shadergradient)     sync_shadergradient ;;
    recent)             sync_recent ;;
    layers)             sync_layers ;;
    atropos)            sync_atropos ;;
    rough-notation)     sync_rough_notation ;;
    roughjs)            sync_roughjs ;;
    paper-shaders)      sync_paper_shaders ;;
    fancy)              sync_fancy ;;
    *) warn "unknown source: $s" ;;
  esac
done

# manifest
jq -n --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      --arg phosphor "$PHOSPHOR_CORE_VERSION" --arg lenis "$LENIS_VERSION" --arg atropos "$ATROPOS_VERSION" \
      --arg rough_notation "$ROUGH_NOTATION_VERSION" --arg roughjs "$ROUGHJS_VERSION" \
      --arg paper "$PAPER_SHADERS_VERSION" --arg fancy "$FANCY_COMMIT" \
      --argjson failures "$(printf '%s\n' "${FAILURES[@]:-}" | jq -R . | jq -s 'map(select(length>0))')" \
      '{synced_at: $date, pinned: {phosphor_core: $phosphor, lenis: $lenis, atropos: $atropos,
                                  "rough-notation": $rough_notation, roughjs: $roughjs,
                                  paper_shaders: $paper, fancy: ($fancy[0:12])}, failures: $failures}' \
  > "$VENDOR/MANIFEST.json"

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  warn "sync finished with ${#FAILURES[@]} failure(s):"
  printf '  - %s\n' "${FAILURES[@]}" >&2
  exit 1
fi
say "sync complete — all sources vendored under $VENDOR"
