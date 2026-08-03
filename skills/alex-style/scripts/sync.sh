#!/usr/bin/env bash
# alex-style sync — vendors all 17 sources into <skill>/vendor/ in one shot.
# Uses ONLY curl, git, tar, jq. No browser automation, no npm install, no code execution.
# Idempotent: re-run any time to refresh. Continues past individual failures and
# reports a summary; exits non-zero if any source failed entirely.
#
# Usage:  bash scripts/sync.sh [source ...]     # no args = all sources
# Sources: magicui kokonutui reactbits motion-primitives gsap motion lenis
#          phosphor animista vanta shadergradient recent layers
#          radix-colors paper-shaders svgl review-packs tailark origin fancy

set -u
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR="$SKILL_DIR/vendor"
UA="alex-style-sync/1.0 (local design asset aggregator)"
FAILURES=()
OK=()

# Pinned versions (bump deliberately; sync verifies latest via npm registry where noted)
PHOSPHOR_CORE_VERSION="2.1.1"
LENIS_VERSION="1.3.25"
# @radix-ui/colors is stable/frozen upstream since 2023-10 — annual check is enough.
RADIX_COLORS_VERSION="3.0.0"
# LICENSE BOUNDARY: @paper-design/shaders 0.0.47-0.0.76 are PolyForm Shield, NOT
# Apache-2.0 — sync_paper_shaders hard-fails below 0.0.77. Check CHANGELOG for
# prop renames before bumping.
PAPER_SHADERS_VERSION="0.0.78"
# engine + rule-descriptions.md must come from the SAME tag (doc regenerates per release)
AXE_CORE_VERSION="4.12.1"
# Tailark pins a COMMIT SHA: oss.tailark.com serves whatever main is deployed and the
# repo is young/fast-moving. sync_tailark refuses to run if live main differs from this
# pin. Bump deliberately: re-run the audit checks in sources/tailark.md first.
TAILARK_BLOCKS_SHA="8139698115c1341bfd2e3e286c04bb4d8146f472"
# Origin UI frozen post-acquisition snapshot; 3c6058e4 is the LAST commit touching
# apps/origin (2026-05-08). Only apps/origin/ is MIT — repo ROOT is AGPLv3.
ORIGIN_COSS_SHA="3c6058e484e51e1fc14849c9b59a9cca6269c539"
# danielpetho/fancy — curated 8-item PATCHED-FORK subset; sync_fancy applies four
# vendor-time patches with fail-loud anchor checks. Re-audit anchors before bumping.
FANCY_COMMIT="f9f62c61207b2dd3210476dd98af3c9a5be24094"

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

# ---------------------------------------------------------------- Radix Colors
sync_radix_colors() {
  local d="$VENDOR/radix-colors"
  say "Radix Colors: @radix-ui/colors $RADIX_COLORS_VERSION npm tarball → CSS scales only (no npm install)"
  local tgz="$TMP/radix-colors.tgz" ex="$TMP/radix-colors-pkg"
  fetch "https://registry.npmjs.org/@radix-ui/colors/-/colors-$RADIX_COLORS_VERSION.tgz" "$tgz" \
    || { fail "radix-colors tarball fetch (keeping previous copy)"; return; }
  rm -rf "$ex"; mkdir -p "$ex"
  tar -xzf "$tgz" -C "$ex" || { fail "radix-colors tarball extract (keeping previous copy)"; return; }
  # quality gate: 3.0.0 ships exactly 126 *.css (31 scales × light/dark/alpha/dark-alpha
  # + black/white alpha), ~138KB total, plus an MIT LICENSE. Anything else = bad tarball.
  local n bytes
  n=$(ls "$ex/package"/*.css 2>/dev/null | wc -l | tr -d ' ')
  bytes=$(wc -c "$ex/package"/*.css 2>/dev/null | tail -1 | awk '{print $1}')
  if [ "$n" -ne 126 ] || [ "${bytes:-0}" -lt 100000 ]; then
    fail "radix-colors gate: expected 126 css files / ≥100KB, got $n files / ${bytes:-0} bytes — keeping previous copy"
    return
  fi
  if ! grep -q "MIT License" "$ex/package/LICENSE" 2>/dev/null; then
    fail "radix-colors gate: LICENSE missing or not MIT — keeping previous copy"
    return
  fi
  # vendor the CSS only (skip index.js/.mjs/types — same data duplicated as JS modules);
  # stage then atomic swap so a partial copy can never clobber a good vendor dir
  rm -rf "$d.new"; mkdir -p "$d.new/css"
  cp "$ex/package"/*.css "$d.new/css/" || { fail "radix-colors css copy"; rm -rf "$d.new"; return; }
  cp "$ex/package/LICENSE" "$d.new/LICENSE" || { fail "radix-colors LICENSE copy"; rm -rf "$d.new"; return; }
  rm -rf "$d"; mv "$d.new" "$d"
  say "Radix Colors: $(ls "$d/css" | wc -l | tr -d ' ') CSS files vendored ($bytes bytes; upstream frozen since 2023-10)"
}

# ---------------------------------------------------------------- Paper Shaders
sync_paper_shaders() {
  local d="$VENDOR/paper-shaders"
  say "Paper Shaders: pinned core dist (no sourcemaps) + LICENSE/NOTICE + Mintlify docs"

  # LICENSE-BOUNDARY GUARD (judge mandate): versions 0.0.47-0.0.76 are PolyForm
  # Shield 1.0.0, NOT Apache-2.0. Never vendor below 0.0.77; never float this pin.
  local floor="0.0.77"
  if [ "$(printf '%s\n%s\n' "$floor" "$PAPER_SHADERS_VERSION" | sort -V | head -1)" != "$floor" ]; then
    fail "paper-shaders: pinned version $PAPER_SHADERS_VERSION is below the Apache-2.0 floor 0.0.77 (PolyForm Shield licensing) — refusing to vendor"
    return
  fi

  fetch "https://registry.npmjs.org/@paper-design/shaders/-/shaders-$PAPER_SHADERS_VERSION.tgz" \
    "$TMP/paper-shaders.tgz" || { fail "paper-shaders tarball"; return; }
  rm -rf "$TMP/paper-shaders"; mkdir -p "$TMP/paper-shaders"
  tar -xzf "$TMP/paper-shaders.tgz" -C "$TMP/paper-shaders" || { fail "paper-shaders tarball extract"; return; }
  local pkg="$TMP/paper-shaders/package"

  # verify the tarball IS the pinned version and IS Apache-2.0, from its own package.json
  local got_version got_license
  got_version="$(jq -r '.version // empty' "$pkg/package.json")" || { fail "paper-shaders package.json parse"; return; }
  got_license="$(jq -r '.license // empty' "$pkg/package.json")"
  [ "$got_version" = "$PAPER_SHADERS_VERSION" ] \
    || { fail "paper-shaders version mismatch: tarball says '$got_version', pinned $PAPER_SHADERS_VERSION"; return; }
  if [ "$(printf '%s\n%s\n' "$floor" "$got_version" | sort -V | head -1)" != "$floor" ]; then
    fail "paper-shaders: resolved version $got_version < 0.0.77 — PolyForm Shield territory, refusing to vendor"
    return
  fi
  [ "$got_license" = "Apache-2.0" ] \
    || { fail "paper-shaders license is '$got_license', expected Apache-2.0 — refusing to vendor"; return; }
  grep -q "Apache License" "$pkg/LICENSE" \
    || { fail "paper-shaders LICENSE text is not the Apache License — refusing to vendor"; return; }

  # stage everything; only replace the live vendor dir after every gate passes
  local stage="$TMP/paper-shaders-stage"
  rm -rf "$stage"; mkdir -p "$stage"
  cp -R "$pkg/dist" "$stage/dist"
  find "$stage/dist" -name '*.js.map' -delete   # ~436KB of dead weight; dist JS is readable source
  cp "$pkg/LICENSE" "$stage/LICENSE"
  [ -f "$pkg/NOTICE" ] && cp "$pkg/NOTICE" "$stage/NOTICE"       # Apache NOTICE must ship alongside
  [ -f "$pkg/README.md" ] && cp "$pkg/README.md" "$stage/README.md"
  cp "$pkg/package.json" "$stage/package.json"                    # keeps version+license auditable offline

  local shader_count dist_bytes
  shader_count="$(find "$stage/dist/shaders" -name '*.js' ! -name '*.map' 2>/dev/null | wc -l | tr -d ' ')"
  dist_bytes="$(find "$stage/dist" -type f \( -name '*.js' ! -name '*.map' \) -exec cat {} + | wc -c | tr -d ' ')"
  if [ "$shader_count" -lt 29 ] || [ "$dist_bytes" -lt 200000 ]; then
    fail "paper-shaders dist sanity: $shader_count shaders / $dist_bytes bytes (want >=29 / >=200000) — keeping previous copy"
    return
  fi

  # Mintlify docs: llms.txt index + per-shader pages (28 upstream + overview;
  # gem-smoke has no doc page — the catalog builder falls back to its dist source)
  mkdir -p "$stage/docs/shaders"
  fetch "https://paper-design-shaders.mintlify.app/llms.txt" "$stage/docs/llms.txt" \
    || { fail "paper-shaders docs llms.txt"; return; }
  grep -oE 'shaders/shaders/[a-z0-9-]+\.md' "$stage/docs/llms.txt" \
    | sed 's|shaders/shaders/||; s|\.md$||' | sort -u \
    | fetch_many "$stage/docs/shaders" "https://paper-design-shaders.mintlify.app/shaders/" ".md" ".md" \
    | sed 's/^MISS /  missing: /'
  local doc_count
  doc_count="$(ls "$stage/docs/shaders" 2>/dev/null | grep -c '\.md$' || true)"
  if [ "${doc_count:-0}" -lt 25 ]; then
    fail "paper-shaders docs sanity: only ${doc_count:-0} shader pages (want >=25) — keeping previous copy"
    return
  fi
  local f
  for f in "$stage/docs/shaders"/*.md; do
    if [ "$(wc -c < "$f" | tr -d ' ')" -lt 500 ]; then
      fail "paper-shaders doc $(basename "$f") suspiciously small (<500B) — keeping previous copy"
      return
    fi
  done

  # all gates passed — atomically swap in the new copy
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Paper Shaders: $shader_count shaders ($dist_bytes bytes dist) + $doc_count doc pages vendored @ $PAPER_SHADERS_VERSION"
}

# ---------------------------------------------------------------- SVGL
sync_svgl() {
  local d="$VENDOR/svgl"
  say "SVGL: brand-logo index (api.svgl.app) + full SVG library snapshot (pheralb/svgl@main)"
  # stage in $TMP and swap in only after every gate passes — never leave an empty/partial vendor dir
  local stage="$TMP/svgl-stage"
  rm -rf "$stage"; mkdir -p "$stage"
  fetch "https://api.svgl.app" "$stage/index.json" || { fail "svgl api index fetch"; return; }
  local count
  count=$(jq 'length' "$stage/index.json" 2>/dev/null) \
    || { fail "svgl index.json did not parse as JSON — keeping previous copy"; return; }
  [ "$count" -ge 500 ] \
    || { fail "svgl index has $count items (<500 floor; last audit: 665) — keeping previous copy"; return; }
  fetch "https://codeload.github.com/pheralb/svgl/tar.gz/refs/heads/main" "$stage/repo.tgz" \
    || { fail "svgl repo tarball fetch"; return; }
  mkdir -p "$stage/src"
  tar -xzf "$stage/repo.tgz" -C "$stage/src" --strip-components=1 \
    || { fail "svgl tarball extract"; return; }
  [ -d "$stage/src/static/library" ] \
    || { fail "svgl tarball layout changed (static/library missing) — keeping previous copy"; return; }
  local nfiles kb
  nfiles=$(find "$stage/src/static/library" -name '*.svg' | wc -l | tr -d ' ')
  kb=$(du -sk "$stage/src/static/library" | cut -f1)
  [ "$nfiles" -ge 900 ] \
    || { fail "svgl library has $nfiles SVGs (<900 floor; last audit: 1081) — keeping previous copy"; return; }
  [ "$kb" -ge 2000 ] \
    || { fail "svgl library is ${kb}KB (<2MB floor; last audit: ~5.6MB on disk) — keeping previous copy"; return; }
  grep -q "MIT License" "$stage/src/LICENSE" \
    || { fail "svgl LICENSE is no longer MIT — STOP and re-audit before vendoring"; return; }
  # quarterly-diff breadcrumb: rebrands age silently (upstream already ships a Stripe icon/wordmark era mismatch)
  if [ -f "$d/index.json" ]; then
    local prev; prev=$(jq 'length' "$d/index.json" 2>/dev/null || echo '?')
    say "SVGL: index $prev -> $count entries (diff quarterly; spot-check high-visibility marks for rebrands)"
  fi
  rm -rf "$d"; mkdir -p "$d/library"
  cp "$stage/src/static/library/"*.svg "$d/library/"
  cp "$stage/index.json" "$d/index.json"
  cp "$stage/src/LICENSE" "$d/LICENSE"
  say "SVGL: $count index entries, $nfiles SVGs (${kb}KB) vendored"
}

# ---------------------------------------------------------------- Review packs (WIG + axe-core)
# Bundled Phase 4 review sources: Vercel Web Interface Guidelines vendored
# VERBATIM (curation lives in sources/review-packs.md as a name-keyed exclusion
# list — never edit the vendored files) and the axe-core engine pinned to
# $AXE_CORE_VERSION with its rule reference pulled from the SAME version tag
# (rule-descriptions.md regenerates per release — fetching develop silently
# misdocuments rule tiers/IDs). Each sub-source validates in $TMP and installs
# only on pass, so a failed refresh keeps the previous vendored copy.
sync_review_packs() {
  local d="$VENDOR/review-packs"
  say "Review packs: Vercel WIG (verbatim) + axe-core $AXE_CORE_VERSION engine + rule reference"

  # -- wig/ : two-file MIT ruleset. NEVER vendor the web-design-guidelines
  #    skill wrapper instead — its live-WebFetch mechanism violates hard rule 1.
  local w="$TMP/wig" f
  rm -rf "$w"; mkdir -p "$w"
  for f in command.md AGENTS.md README.md LICENSE; do
    fetch "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/$f" "$w/$f" \
      || { fail "review-packs wig $f"; return; }
  done
  { [ "$(wc -c < "$w/command.md")" -ge 4000 ] && [ "$(grep -c '^- ' "$w/command.md")" -ge 80 ]; } \
    || { fail "review-packs wig command.md failed sanity check (empty/truncated/reshaped) — previous copy kept"; return; }
  grep -q 'MIT License' "$w/LICENSE" \
    || { fail "review-packs wig LICENSE no longer reads as MIT — inspect upstream before vendoring"; return; }
  mkdir -p "$d"; rm -rf "$d/wig"; cp -R "$w" "$d/wig"

  # -- axe/ : pinned npm tarball. MPL-2.0 file-level copyleft is satisfied by
  #    shipping axe.min.js UNMODIFIED (header intact) with its LICENSE alongside.
  local a="$TMP/axe" nrules
  rm -rf "$a"; mkdir -p "$a"
  fetch "https://registry.npmjs.org/axe-core/-/axe-core-$AXE_CORE_VERSION.tgz" "$a/axe-core.tgz" \
    || { fail "review-packs axe-core tarball"; return; }
  tar -xzf "$a/axe-core.tgz" -C "$a" package/axe.min.js package/LICENSE \
    || { fail "review-packs axe tarball extract"; return; }
  tar -xzf "$a/axe-core.tgz" -C "$a" package/LICENSE-3RD-PARTY.txt 2>/dev/null \
    || warn "review-packs axe LICENSE-3RD-PARTY.txt miss (non-fatal)"
  [ "$(wc -c < "$a/package/axe.min.js")" -ge 409600 ] \
    || { fail "review-packs axe.min.js under 400KB — truncated or wrong artifact"; return; }
  head -c 64 "$a/package/axe.min.js" | grep -q "axe v$AXE_CORE_VERSION" \
    || { fail "review-packs axe.min.js header is not v$AXE_CORE_VERSION"; return; }
  fetch "https://raw.githubusercontent.com/dequelabs/axe-core/v$AXE_CORE_VERSION/doc/rule-descriptions.md" \
    "$a/rule-descriptions.md" \
    || { fail "review-packs rule-descriptions.md at tag v$AXE_CORE_VERSION"; return; }
  nrules="$(grep -c '^| \[' "$a/rule-descriptions.md" || true)"
  [ "$nrules" -gt 100 ] \
    || { fail "review-packs rule-descriptions.md parsed $nrules rules (need >100) — format changed?"; return; }
  rm -rf "$d/axe"; mkdir -p "$d/axe"
  cp "$a/package/axe.min.js" "$a/package/LICENSE" "$d/axe/"
  [ -f "$a/package/LICENSE-3RD-PARTY.txt" ] && cp "$a/package/LICENSE-3RD-PARTY.txt" "$d/axe/"
  cp "$a/rule-descriptions.md" "$d/axe/rule-descriptions.md"

  # -- closed design-review allowlist: runOnly RULE values. Tag-based runOnly
  #    ('wcag2a', 'best-practice') is FORBIDDEN — it re-imports the landmark/
  #    region noise cluster wholesale. target-size is the only sanctioned opt-in.
  cat > "$d/axe/allowlist.json" <<'ALLOWLIST'
{
  "_law": "Closed 22-rule set for the Phase 4 axe pass (law lives in sources/review-packs.md). Never widen ad hoc; tag-based runOnly is forbidden; 'target-size' is the only sanctioned opt-in.",
  "runOnly": {
    "type": "rule",
    "values": [
      "color-contrast", "link-in-text-block",
      "button-name", "link-name", "input-button-name", "select-name", "label", "summary-name",
      "image-alt", "svg-img-alt", "role-img-alt",
      "aria-allowed-attr", "aria-valid-attr", "aria-valid-attr-value", "aria-required-attr",
      "aria-hidden-focus", "aria-command-name", "nested-interactive",
      "meta-viewport",
      "tabindex", "scrollable-region-focusable",
      "heading-order"
    ]
  },
  "optional_opt_in": ["target-size"]
}
ALLOWLIST
  jq -e '.runOnly.type == "rule" and (.runOnly.values | length == 22)' "$d/axe/allowlist.json" > /dev/null \
    || { fail "review-packs allowlist.json is not the closed 22-rule set"; return; }
  say "Review packs: wig 4 files + axe $AXE_CORE_VERSION ($nrules documented rules, 22-rule allowlist)"
}

# ---------------------------------------------------------------- Tailark
# RADIX BASE ONLY (judge mandate): the base-ui base would introduce a second
# primitive system (@base-ui/react) beside the arsenal's shadcn/Radix
# assumption — instant incoherence. Payloads come from oss.tailark.com
# (/r/radix/{name}.json, inline .content) which serves whatever main is
# deployed, so the pin gate below is what makes this a snapshot, not a float.
sync_tailark() {
  local d="$VENDOR/tailark"
  say "Tailark: radix-base marketing blocks (oss.tailark.com) @ tailark/blocks ${TAILARK_BLOCKS_SHA:0:12}"

  # BUNDLED DUPES — EXCLUDED (judge mandate): these five are copies of
  # components already vendored elsewhere in the arsenal; a second, staler home
  # for the same effect is a routing regression, not an addition.
  #   motion-primitives-*  -> vendor/motion-primitives/core/<name>.tsx
  #   magic-ui-border-beam -> vendor/magicui/r/border-beam.json
  local dupes="motion-primitives-animated-group
motion-primitives-infinite-slider
motion-primitives-progressive-blur
motion-primitives-text-effect
magic-ui-border-beam"

  # PIN GATE: upstream is young and moving (audit day: pushed 4 days prior).
  # If main has moved past the pin, oss.tailark.com no longer serves the
  # audited snapshot — keep the previous copy; re-audit (kit drift, new deps,
  # placeholder-copy changes) and bump TAILARK_BLOCKS_SHA deliberately.
  local sha
  sha="$(curl -fsSL --retry 3 -A "$UA" "https://api.github.com/repos/tailark/blocks/commits/main" | jq -r '.sha // empty')"
  [ -n "$sha" ] || { fail "tailark: cannot resolve tailark/blocks main SHA via GitHub API — keeping previous copy"; return; }
  if [ "$sha" != "$TAILARK_BLOCKS_SHA" ]; then
    fail "tailark: upstream main $sha != pinned $TAILARK_BLOCKS_SHA — payloads would not match the audited pin; re-audit and bump deliberately (keeping previous copy)"
    return
  fi

  local stage="$TMP/tailark-stage" raw="https://raw.githubusercontent.com/tailark/blocks/$TAILARK_BLOCKS_SHA"
  rm -rf "$stage"; mkdir -p "$stage/r" "$stage/extra/svgs"

  fetch "https://oss.tailark.com/r/radix/registry.json" "$stage/registry.json" \
    || { fail "tailark registry.json fetch"; return; }
  local total blocks pages
  total=$(jq '.items|length' "$stage/registry.json" 2>/dev/null) \
    || { fail "tailark registry.json did not parse as JSON — keeping previous copy"; return; }
  blocks=$(jq '[.items[]|select(.type=="registry:block")]|length' "$stage/registry.json")
  pages=$(jq '[.items[]|select(.type=="registry:page")]|length' "$stage/registry.json")
  { [ "$total" -ge 240 ] && [ "$blocks" -ge 140 ] && [ "$pages" -ge 10 ]; } \
    || { fail "tailark registry gate: $total items / $blocks blocks / $pages pages (floors 240/140/10; audit: 260/150/10) — keeping previous copy"; return; }

  # per-item payloads, minus the 5 dupes
  jq -r '.items[].name' "$stage/registry.json" | grep -vxF "$dupes" \
    | fetch_many "$stage/r" "https://oss.tailark.com/r/radix/" ".json" ".json" \
    | sed 's/^MISS /  missing: /'
  local expected got bytes
  expected=$((total - 5))
  got=$(ls "$stage/r" | wc -l | tr -d ' ')
  [ "$got" -eq "$expected" ] \
    || { fail "tailark payloads: fetched $got of $expected — keeping previous copy"; return; }
  bytes=$(find "$stage/r" -name '*.json' -exec cat {} + | wc -c | tr -d ' ')
  [ "$bytes" -ge 900000 ] \
    || { fail "tailark payloads total $bytes bytes (<900KB floor; audit: ~1.11MB for 255 payloads) — keeping previous copy"; return; }

  # every payload must parse and carry real inline source
  local f
  for f in "$stage/r"/*.json; do
    jq -e '[.files[].content | length] | add > 0' "$f" >/dev/null 2>&1 \
      || { fail "tailark payload $(basename "$f") unparseable or has empty content — keeping previous copy"; return; }
  done

  # CLOSURE GATE (judge mandate): every @tailark-oss/ registryDependency across
  # all vendored payloads must resolve to a vendored payload or to one of the 5
  # arsenal-mapped dupes — anything else means dangling imports in copied blocks.
  local missing_deps
  missing_deps=$(jq -rs --arg dupes "$dupes" '
      ([.[].name] + ($dupes | split("\n"))) as $have
      | [.[] | (.registryDependencies // [])[] | sub("^@tailark-oss/"; "")]
      | unique | map(select(. as $n | $have | index($n) | not)) | .[]' \
      "$stage/r"/*.json)
  [ -z "$missing_deps" ] \
    || { fail "tailark closure gate: unresolved registryDependencies: $(printf '%s ' $missing_deps) — keeping previous copy"; return; }

  # PIN ASSERTION (judge mandate): payloads must match the pinned commit. The
  # registry build rewrites only import paths, so spot-check three payloads
  # (one per kit, chosen because ALL their imports are covered by the known
  # rewrites) against raw@SHA; trailing-newline-insensitive compare.
  local name kit path
  for name in dusk-faqs-1 mist-pricing-1 veil-features-1; do
    kit="${name%%-*}"
    path=$(jq -r '.files[0].path' "$stage/r/$name.json")
    jq -r '.files[0].content' "$stage/r/$name.json" > "$TMP/tailark-payload"
    fetch "$raw/registry/bases/radix/$path" "$TMP/tailark-raw" \
      || { fail "tailark pin assertion: raw fetch of $path @ pin failed"; return; }
    sed -E "s|@/registry/bases/radix/$kit/ui/|@/components/ui/|g; s|@/registry/core/ui/|@/components/ui/|g; s|@/registry/core/hooks/|@/hooks/|g" \
      "$TMP/tailark-raw" > "$TMP/tailark-raw-rw"
    [ "$(cat "$TMP/tailark-payload")" = "$(cat "$TMP/tailark-raw-rw")" ] \
      || { fail "tailark pin assertion: $name payload != raw@$TAILARK_BLOCKS_SHA after import rewrite — served payloads drifted from the pin; keeping previous copy"; return; }
  done

  # perplexity mark: dusk-footer-2 imports @/components/ui/svgs/perplexity but
  # NO registry item ships it (upstream gap) — vendor the raw file at the pin
  # so nothing dangles ("nothing silently vanishes").
  fetch "$raw/registry/core/ui/svgs/perplexity.tsx" "$stage/extra/svgs/perplexity.tsx" \
    || { fail "tailark extra perplexity.tsx fetch @ pin"; return; }
  grep -q "Perplexity" "$stage/extra/svgs/perplexity.tsx" \
    || { fail "tailark extra perplexity.tsx does not look like the Perplexity component"; return; }

  # license: upstream file is LICENCE.md (British spelling), MIT
  fetch "$raw/LICENCE.md" "$stage/LICENSE" || { fail "tailark LICENCE.md fetch @ pin"; return; }
  grep -q "MIT License" "$stage/LICENSE" \
    || { fail "tailark LICENSE no longer reads as MIT — STOP and re-audit before vendoring"; return; }

  # pin record — keeps the snapshot auditable offline
  jq -n --arg sha "$TAILARK_BLOCKS_SHA" --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --argjson total "$total" --argjson vendored "$got" \
        '{repo: "github.com/tailark/blocks", base: "radix only", sha: $sha, synced_at: $date,
          registry_items: $total, vendored_payloads: $vendored, excluded_dupes: 5}' \
    > "$stage/PIN.json"

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Tailark: $got payloads ($bytes bytes) + registry + perplexity patch + LICENSE @ ${TAILARK_BLOCKS_SHA:0:12} (5 bundled dupes excluded; heavy-dep blocks flagged at index time)"
}

# ============================================================================
# ORIGIN FRAGMENT for scripts/sync.sh (Wave 2)
# Orchestrator integration:
#   1. Pin var (goes in the "Pinned versions" block at the top of sync.sh —
#      see pins.txt):
#        ORIGIN_COSS_SHA="3c6058e484e51e1fc14849c9b59a9cca6269c539"
#   2. Function below drops in alongside the other sync_* functions.
#   3. ALL_SOURCES gains "origin"; case statement gains:  origin) sync_origin ;;
#   4. MANIFEST jq gains: --arg origin_coss "$ORIGIN_COSS_SHA" and
#      "origin_coss: $origin_coss" inside .pinned (see pins.txt).
# ============================================================================

# ---------------------------------------------------------------- Origin UI
# Application/form/data UI registry (legacy Origin UI, frozen post-acquisition
# snapshot inside the cosscom/coss monorepo — upstream still lands compile-keeping
# patches, e.g. 2026-05-08 "patch Next/React"). LICENSE BOUNDARY (judge mandate):
# ONLY apps/origin/ is MIT ("Originally Copyright (c) 2025 Origin UI") — the
# monorepo ROOT is AGPLv3, so vendoring anything outside apps/origin/ is a
# license breach. This function extracts four apps/origin paths and hard-fails
# unless the fetched apps/origin/LICENSE.md reads as MIT.
# Transport decision (harness-verified 2026-08-02): ONE codeload tarball at the
# pinned SHA (~2.3MB, 0.7s), NOT 646 per-item fetches from coss.com/origin/r/.
# The tarball is a single atomic transaction, SHA-consistent with registry.json
# (a per-item pull is unpinnable and can interleave with an upstream deploy),
# and the same transaction carries the 10 navbar-components helpers + LICENSE.md,
# which the live endpoint cannot serve (they are not registry items). Repo
# payloads verified byte-identical to coss.com serving (comp-542, 118,964 B both).
sync_origin() {
  local d="$VENDOR/origin"
  say "Origin UI: pinned cosscom/coss tarball → 646 payloads + navbar helpers (apps/origin only)"

  local tgz="$TMP/origin.tgz" ex="$TMP/origin-ex" root
  fetch "https://codeload.github.com/cosscom/coss/tar.gz/$ORIGIN_COSS_SHA" "$tgz" \
    || { fail "origin tarball fetch @ $ORIGIN_COSS_SHA (keeping previous copy)"; return; }
  rm -rf "$ex"; mkdir -p "$ex"
  # scoped extraction — apps/origin paths ONLY; AGPL-rooted files never touch the stage.
  # codeload roots the tarball at coss-<SHA>/, so exact prefixes work on BSD and GNU tar.
  tar -xzf "$tgz" -C "$ex" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/LICENSE.md" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/registry.json" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/public/r" \
    "coss-$ORIGIN_COSS_SHA/apps/origin/registry/default/components/navbar-components" \
    || { fail "origin tarball extract (layout changed?) — keeping previous copy"; return; }
  root="$ex/coss-$ORIGIN_COSS_SHA/apps/origin"

  # LICENSE gate: apps/origin must be MIT; anything else means the subtree was
  # relicensed — STOP and re-audit, never vendor.
  grep -q "MIT License" "$root/LICENSE.md" \
    || { fail "origin apps/origin/LICENSE.md is not MIT — license boundary moved, refusing to vendor"; return; }

  # registry gates: the catalog is FROZEN at this SHA, so counts are EXACT
  # (646 = 600 component + 40 ui + 5 hook + 1 lib). Bumping ORIGIN_COSS_SHA is
  # a deliberate edit — re-verify these counts against the new registry then.
  local counts
  counts="$(jq -r '[(.items|length),
                    ([.items[]|select(.type=="registry:component")]|length),
                    ([.items[]|select(.type=="registry:ui")]|length),
                    ([.items[]|select(.type=="registry:hook")]|length),
                    ([.items[]|select(.type=="registry:lib")]|length)] | map(tostring) | join(" ")' \
             "$root/registry.json" 2>/dev/null)" \
    || { fail "origin registry.json did not parse — keeping previous copy"; return; }
  [ "$counts" = "646 600 40 5 1" ] \
    || { fail "origin registry gate: counts '$counts' != '646 600 40 5 1' — keeping previous copy"; return; }

  # payload gates: exactly 646 JSONs, all parse, every registry item has one, >=1.8MB total
  local n bytes
  n=$(ls "$root/public/r"/*.json 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -eq 646 ] \
    || { fail "origin payload gate: $n JSONs in public/r (want 646) — keeping previous copy"; return; }
  cat "$root/public/r"/*.json | jq -s 'length == 646' | grep -q true \
    || { fail "origin payload gate: payloads failed to parse as 646 JSON docs — keeping previous copy"; return; }
  bytes=$(find "$root/public/r" -name '*.json' -exec cat {} + | wc -c | tr -d ' ')
  [ "$bytes" -ge 1800000 ] \
    || { fail "origin payload gate: $bytes bytes total (<1.8MB floor; audit: ~2.18MB) — keeping previous copy"; return; }
  local unmatched
  unmatched="$(comm -23 <(jq -r '.items[].name' "$root/registry.json" | sort -u) \
                        <(ls "$root/public/r" | sed 's/\.json$//' | sort -u))"
  [ -z "$unmatched" ] \
    || { fail "origin payload gate: registry items missing payloads: $(echo "$unmatched" | tr '\n' ' ')"; return; }

  # closure gate (judge mandate): every registryDependencies URL in every payload
  # (absolute https://coss.com/origin/r/<name>.json form) must resolve to a LOCAL
  # payload by basename — this guarantees zero-network compiles for comp-542,
  # every navbar, every date picker. The 40 ui + 5 hooks + 1 lib are vendored
  # as ordinary payloads, so the closure is complete inside vendor/origin/r/.
  local missing_deps
  missing_deps="$(jq -r '.registryDependencies // [] | .[]' "$root/public/r"/*.json \
                   | sed 's|.*/||; s|\.json$||' | sort -u \
                   | comm -23 - <(ls "$root/public/r" | sed 's/\.json$//' | sort -u))"
  [ -z "$missing_deps" ] \
    || { fail "origin closure gate: registryDependencies without local payloads: $(echo "$missing_deps" | tr '\n' ' ')"; return; }

  # navbar helpers gate (judge mandate): the 20 navbar comps import these 10
  # files (logo, theme-toggle, user-menu, team-switcher, ...), which are NOT
  # registry items and ship in NO payload — without them every navbar item
  # fails to compile. Smallest upstream file is 963B, so 400B floor catches truncation.
  local nn f
  nn=$(ls "$root/registry/default/components/navbar-components"/*.tsx 2>/dev/null | wc -l | tr -d ' ')
  [ "$nn" -eq 10 ] \
    || { fail "origin navbar-helpers gate: $nn .tsx files (want 10) — keeping previous copy"; return; }
  for f in "$root/registry/default/components/navbar-components"/*.tsx; do
    [ "$(wc -c < "$f" | tr -d ' ')" -ge 400 ] \
      || { fail "origin navbar helper $(basename "$f") under 400B — truncated; keeping previous copy"; return; }
  done

  # all gates passed — stage, then atomic swap (a failed refresh keeps the previous copy)
  local stage="$TMP/origin-stage"
  rm -rf "$stage"; mkdir -p "$stage/r" "$stage/navbar-components"
  cp "$root/LICENSE.md" "$stage/LICENSE.md"
  cp "$root/registry.json" "$stage/registry.json"
  cp "$root/public/r"/*.json "$stage/r/"
  cp "$root/registry/default/components/navbar-components"/*.tsx "$stage/navbar-components/"
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Origin UI: 646 payloads ($bytes bytes) + 10 navbar helpers vendored @ ${ORIGIN_COSS_SHA:0:12} (apps/origin MIT subtree only)"
}

# ---------------------------------------------------------------- Fancy Components
# CURATED SUBSET ONLY — wild-tier physics/filter/path showpieces (8 items + 6
# support hooks/utils). The entire ~25-item fancy text tier is EXCLUDED BY
# DEFAULT: every fancy text effect lost its head-to-head source read against an
# existing vendored counterpart (scramble-hover is a strict feature subset of
# reactbits DecryptedText — same lineage, fewer triggers, worse state handling).
# A second, worse home for the same effect is a routing regression; any future
# fancy item enters ONLY after a documented source-level win over its closest
# components.tsv counterpart (adding-a-source.md step 3; law in sources/fancy.md).
#
# Vendored copies are a MAINTAINED FORK: four vendor-time patches below fix
# defects upstream still ships (each marked PATCHED(alex-style) in the payload).
# A raw re-fetch from the live site without the patches is a regression — that
# is why patch 1 rewrites registryDependencies to local paths: no agent or
# shadcn CLI may ever resolve against fancycomponents.dev.
#
# Fetch gotcha (verified): fancycomponents.dev 308-redirects /r/*.json to www.
# fetch()'s `curl -fsSL` includes -L and follows it — never swap in a bare curl
# without -L here.
sync_fancy() {
  local d="$VENDOR/fancy"
  say "Fancy Components: curated physics/filter/path subset — patched fork @ ${FANCY_COMMIT:0:7}"

  # Curation filter AS DATA — the only items allowed in. The components list
  # must mirror the FANCY_DESC map in build-catalogs.mjs (8 indexed rows).
  local components=(gravity cursor-attractor-and-gravity elastic-line
    gooey-svg-filter pixelate-svg-filter
    text-along-path element-along-svg-path marquee-along-svg-path)
  # Transitive registryDependencies closure (audited 2026-08): support files are
  # vendored so every payload resolves locally, but they are NOT index rows.
  local support=(calculate-position svg-path-to-vertices use-mouse-position-ref
    use-dimensions use-elastic-line-events use-mouse-position)

  # stage in $TMP; the live vendor dir is replaced only after every gate passes
  local stage="$TMP/fancy-stage"
  rm -rf "$stage"; mkdir -p "$stage/r"

  # LICENSE from the PINNED commit (registry JSON payloads carry no license text)
  fetch "https://raw.githubusercontent.com/danielpetho/fancy/$FANCY_COMMIT/LICENSE" "$stage/LICENSE" \
    || { fail "fancy LICENSE fetch at pinned commit"; return; }
  grep -q "MIT License" "$stage/LICENSE" \
    || { fail "fancy LICENSE is no longer MIT — STOP and re-audit before vendoring"; return; }

  local n
  for n in "${components[@]}" "${support[@]}"; do
    fetch "https://fancycomponents.dev/r/$n.json" "$stage/r/$n.json" \
      || { fail "fancy item $n fetch"; return; }
    # gate: parses as JSON, is the item we asked for, payload is not a stub
    jq -e --arg n "$n" '.name == $n and (.files[0].content | length >= 300)' "$stage/r/$n.json" > /dev/null \
      || { fail "fancy item $n: wrong/truncated payload (<300 chars or name mismatch) — keeping previous copy"; return; }
  done
  local count kb
  count=$(ls "$stage/r" | wc -l | tr -d ' ')
  kb=$(du -sk "$stage/r" | cut -f1)
  [ "$count" -eq 14 ] \
    || { fail "fancy: expected 14 item JSONs, got $count — keeping previous copy"; return; }
  [ "$kb" -ge 48 ] \
    || { fail "fancy: staged payloads are ${kb}KB (<48KB floor; last audit 104KB on disk) — keeping previous copy"; return; }

  # ---- vendor-time patches (maintained-fork mandate) ----
  local f
  # PATCH 1 — registryDependencies: absolute https://fancycomponents.dev/r/*.json
  # URLs -> local vendor/fancy/r/ paths. Live payloads are UNPATCHED; leaving the
  # URLs in would route agents/CLIs back to the defective upstream copies.
  # Every item (patched or not) also gets a _vendoredFrom provenance stamp so
  # build-catalogs.mjs can refuse to index a copy that bypassed this function.
  for f in "$stage/r"/*.json; do
    jq --arg commit "$FANCY_COMMIT" \
       '._vendoredFrom = "danielpetho/fancy@\($commit) via fancycomponents.dev/r — alex-style maintained fork (sync_fancy applies vendor-time patches); never re-fetch items from the live site"
        | if .registryDependencies then
            .registryDependencies |= map(sub("^https://(www\\.)?fancycomponents\\.dev/r/"; "vendor/fancy/r/"))
            | ._patches = ((._patches // []) + ["PATCHED(alex-style): registryDependencies rewritten to local vendor/fancy/r/ paths"])
          else . end' "$f" > "$f.patched" \
      || { fail "fancy patch 1 (registry deps) failed on $(basename "$f")"; return; }
    mv "$f.patched" "$f"
  done

  # PATCH 2 — missing "use client": all three path-following components use
  # React/motion hooks (useScroll/useRef/useState) but upstream omits the
  # directive — importing them from an RSC fails. scramble-hover HAS it; the
  # inconsistency is upstream's, confirmed at audit.
  for n in text-along-path element-along-svg-path marquee-along-svg-path; do
    f="$stage/r/$n.json"
    if jq -e '.files[0].content | startswith("\"use client\"")' "$f" > /dev/null; then
      warn "fancy $n: upstream now ships \"use client\" — patch 2 no-op (re-audit the other patches on next bump)"
      continue
    fi
    jq '.files[0].content |= ("\"use client\" // PATCHED(alex-style): directive missing upstream — component uses React/motion hooks and fails as an RSC import\n\n" + .)
        | ._patches = ((._patches // []) + ["PATCHED(alex-style): added missing use-client directive"])' \
      "$f" > "$f.patched" \
      || { fail "fancy patch 2 (use client) failed on $n"; return; }
    mv "$f.patched" "$f"
  done

  # PATCH 3 — require("poly-decomp") -> static ESM import. The CJS require in a
  # client component passes the build and then throws "require is not defined"
  # at RUNTIME on Vite/ESM stacks.
  # PATCH 4 — `import { debounce } from "lodash"` pulls full lodash for one
  # function -> lodash.debounce package (import AND dependencies[] rewritten;
  # .cancel() exists on lodash.debounce, used by the resize cleanup).
  for n in gravity cursor-attractor-and-gravity; do
    f="$stage/r/$n.json"
    # anchors must exist EXACTLY — if upstream moved them, refuse and re-audit
    # rather than silently vendoring a half-patched fork
    jq -e '.files[0].content | test("Common\\.setDecomp\\(require\\(\"poly-decomp\"\\)\\)") and test("import \\{ debounce \\} from \"lodash\"")' "$f" > /dev/null \
      || { fail "fancy $n: patch 3/4 anchors moved upstream — re-audit patches before vendoring; keeping previous copy"; return; }
    jq '.files[0].content |= (
          sub("^\"use client\"\n"; "\"use client\"\n\n// PATCHED(alex-style): the CJS require of poly-decomp breaks Vite/ESM at runtime — static import instead\n// @ts-ignore -- poly-decomp ships no type declarations\nimport decomp from \"poly-decomp\"\n")
          | sub("Common\\.setDecomp\\(require\\(\"poly-decomp\"\\)\\)"; "Common.setDecomp(decomp) // PATCHED(alex-style): was a CJS require of poly-decomp")
          | sub("import \\{ debounce \\} from \"lodash\""; "import debounce from \"lodash.debounce\" // PATCHED(alex-style): was a full-lodash import for one function")
        )
        | .dependencies |= map(if . == "lodash" then "lodash.debounce" else . end)
        | ._patches = ((._patches // []) + ["PATCHED(alex-style): poly-decomp require -> ESM import", "PATCHED(alex-style): lodash -> lodash.debounce (import + dependencies)"])' \
      "$f" > "$f.patched" \
      || { fail "fancy patches 3/4 failed on $n"; return; }
    mv "$f.patched" "$f"
  done

  # ---- post-patch verification gates (all fail-loud, previous copy kept) ----
  for n in gravity cursor-attractor-and-gravity; do
    f="$stage/r/$n.json"
    jq -r '.files[0].content' "$f" | grep -qF 'require(' \
      && { fail "fancy $n: require() still present after patch 3"; return; }
    jq -r '.files[0].content' "$f" | grep -qF 'import decomp from "poly-decomp"' \
      || { fail "fancy $n: poly-decomp ESM import missing after patch 3"; return; }
    jq -r '.files[0].content' "$f" | grep -qF 'from "lodash"' \
      && { fail "fancy $n: full-lodash import still present after patch 4"; return; }
    jq -e '(.dependencies | index("lodash")) == null and (.dependencies | index("lodash.debounce")) != null' "$f" > /dev/null \
      || { fail "fancy $n: dependencies[] not rewritten to lodash.debounce"; return; }
  done
  for n in text-along-path element-along-svg-path marquee-along-svg-path; do
    jq -e '.files[0].content | startswith("\"use client\"")' "$stage/r/$n.json" > /dev/null \
      || { fail "fancy $n: use-client directive missing after patch 2"; return; }
  done
  local dep
  for f in "$stage/r"/*.json; do
    # no payload may still reference the live site…
    jq -e '[(.registryDependencies // [])[] | select(test("fancycomponents"))] | length == 0' "$f" > /dev/null \
      || { fail "fancy: $(basename "$f") registryDependencies still reference the live site after patch 1"; return; }
    # …and every local dep must exist in the curated closure (catches upstream
    # adding a new registryDependency the support list doesn't cover yet)
    for dep in $(jq -r '(.registryDependencies // [])[]' "$f"); do
      [ -f "$stage/r/$(basename "$dep")" ] \
        || { fail "fancy: $(basename "$f") needs $(basename "$dep") — outside the curated closure; update the support list deliberately"; return; }
    done
  done

  # all gates passed — atomic swap
  rm -rf "$d"; mkdir -p "$VENDOR"
  cp -R "$stage" "$d"
  say "Fancy: $count curated item JSONs (${kb}KB) + MIT LICENSE vendored — patched fork pinned to danielpetho/fancy@${FANCY_COMMIT:0:7}"
}

# ---------------------------------------------------------------- main
ALL_SOURCES=(magicui kokonutui reactbits motion-primitives gsap motion lenis phosphor animista vanta shadergradient recent layers radix-colors paper-shaders svgl review-packs tailark origin fancy)
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
    radix-colors)       sync_radix_colors ;;
    paper-shaders)      sync_paper_shaders ;;
    svgl)               sync_svgl ;;
    review-packs)       sync_review_packs ;;
    tailark)            sync_tailark ;;
    origin)             sync_origin ;;
    fancy)              sync_fancy ;;
    *) warn "unknown source: $s" ;;
  esac
done

# manifest
jq -n --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      --arg phosphor "$PHOSPHOR_CORE_VERSION" --arg lenis "$LENIS_VERSION" \
      --arg radix_colors "$RADIX_COLORS_VERSION" --arg paper_shaders "$PAPER_SHADERS_VERSION" \
      --arg axe "$AXE_CORE_VERSION" --arg tailark_blocks "$TAILARK_BLOCKS_SHA" \
      --arg origin_coss "$ORIGIN_COSS_SHA" --arg fancy_commit "$FANCY_COMMIT" \
      --argjson failures "$(printf '%s\n' "${FAILURES[@]:-}" | jq -R . | jq -s 'map(select(length>0))')" \
      '{synced_at: $date, pinned: {phosphor_core: $phosphor, lenis: $lenis, radix_colors: $radix_colors, paper_shaders: $paper_shaders, axe_core: $axe, tailark_blocks: $tailark_blocks, origin_coss: $origin_coss, fancy_commit: $fancy_commit}, failures: $failures}' \
  > "$VENDOR/MANIFEST.json"

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  warn "sync finished with ${#FAILURES[@]} failure(s):"
  printf '  - %s\n' "${FAILURES[@]}" >&2
  exit 1
fi
say "sync complete — all sources vendored under $VENDOR"
