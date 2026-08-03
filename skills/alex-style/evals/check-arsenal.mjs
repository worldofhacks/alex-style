#!/usr/bin/env node
// Arsenal self-test — one runnable assertion per source (adding-a-source.md §11).
// Run after any sync or integration: node evals/check-arsenal.mjs
// Exits non-zero on the first broken contract; zero deps, <1s.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = dirname(dirname(fileURLToPath(import.meta.url)));
const V = join(SKILL, 'vendor');
const IDX = join(V, '_index');
let failures = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log(`ok   ${name}`);
  } catch (e) {
    failures++;
    console.error(`FAIL ${name}: ${e.message}`);
  }
};
const rows = (tsv) => readFileSync(join(IDX, tsv), 'utf8').split('\n').filter((l) => l && !l.startsWith('#'));
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const manifest = JSON.parse(readFileSync(join(V, 'MANIFEST.json'), 'utf8'));

// original 13
check('components.tsv has all four registries', () => {
  const srcs = new Set(rows('components.tsv').map((r) => r.split('\t')[0]));
  for (const s of ['magicui', 'kokonutui', 'reactbits', 'motion-primitives'])
    assert(srcs.has(s), `${s} missing from components.tsv`);
});
check('icons.tsv >= 1500 rows and get-icon.sh emits SVG', () => {
  assert(rows('icons.tsv').length >= 1500, 'icons.tsv too small');
  const svg = execFileSync('bash', [join(SKILL, 'scripts/get-icon.sh'), 'heart', 'regular'], { encoding: 'utf8' });
  assert(svg.includes('<svg'), 'get-icon.sh did not emit SVG');
});
check('animista.tsv >= 600 rows + license present', () => {
  assert(rows('animista.tsv').length >= 600, 'animista.tsv too small');
  assert(existsSync(join(V, 'animista/LICENSE.txt')), 'animista LICENSE.txt missing');
});
check('vanta.tsv 14 effects + pinned three r134 present', () => {
  assert(rows('vanta.tsv').length === 14, 'vanta.tsv != 14 effects');
  assert(existsSync(join(V, 'vanta/three.r134.min.js')), 'three.r134.min.js missing');
});
check('inspiration.tsv >= 1400 rows, palettes.tsv == 100', () => {
  assert(rows('inspiration.tsv').length >= 1400, 'inspiration.tsv too small');
  assert(rows('palettes.tsv').length === 100, 'palettes.tsv != 100');
});

// wave 1
check('radix-colors.tsv exactly 372 rows, pin matches MANIFEST', () => {
  assert(rows('radix-colors.tsv').length === 372, 'radix-colors.tsv != 372 rows');
  assert(manifest.pinned.radix_colors === '3.0.0', `pin drift: ${manifest.pinned.radix_colors}`);
  assert(readdirSync(join(V, 'radix-colors/css')).length === 126, 'radix css != 126 files');
});
check('paper-shaders.tsv >= 29 rows, pin >= 0.0.77 license floor', () => {
  assert(rows('paper-shaders.tsv').length >= 29, 'paper-shaders.tsv < 29 rows');
  const pin = manifest.pinned.paper_shaders;
  const [a, b, c] = pin.split('.').map(Number);
  assert(a > 0 || b > 0 || c >= 77, `pin ${pin} below Apache-2.0 floor 0.0.77`);
  assert(existsSync(join(V, 'paper-shaders/LICENSE')), 'paper-shaders LICENSE missing');
});
check('logos.tsv >= 500 rows and get-logo.sh emits SVG', () => {
  assert(rows('logos.tsv').length >= 500, 'logos.tsv too small');
  const svg = execFileSync('bash', [join(SKILL, 'scripts/get-logo.sh'), 'vercel', 'light'], { encoding: 'utf8' });
  assert(svg.includes('<svg'), 'get-logo.sh did not emit SVG');
});
check('review-rules.tsv allowlist is exactly the closed 22', () => {
  const yes = rows('review-rules.tsv').filter((r) => r.split('\t')[4] === 'yes');
  assert(yes.length === 22, `in_allowlist=yes count ${yes.length} != 22`);
  const allow = JSON.parse(readFileSync(join(V, 'review-packs/axe/allowlist.json'), 'utf8'));
  assert(allow.runOnly.values.length === 22, 'allowlist.json != 22 rules');
  assert(existsSync(join(V, 'review-packs/axe/LICENSE')), 'axe LICENSE must travel with axe.min.js');
});

// wave 2
check('sections.tsv 160 rows, 4 HEAVY flags, kit column live, pin matches', () => {
  const r = rows('sections.tsv');
  assert(r.length === 160, `sections.tsv ${r.length} != 160 rows`);
  assert(r.filter((x) => x.includes('HEAVY:')).length === 4, 'HEAVY flag count != 4 at this pin');
  assert(r.some((x) => x.split('\t')[1] === 'mist'), 'kit column missing mist rows');
  const pin = JSON.parse(readFileSync(join(V, 'tailark/PIN.json'), 'utf8'));
  assert(pin.sha === manifest.pinned.tailark_blocks, 'tailark PIN.json sha != MANIFEST pin');
});
check('application-ui.tsv 646 rows with normalized tags', () => {
  const r = rows('application-ui.tsv');
  assert(r.length === 646, `application-ui.tsv ${r.length} != 646 rows`);
  assert(!r.some((x) => /navbar, navigation/.test(x.split('\t')[2] ?? '')), 'malformed comma-joined tag survived normalization');
  assert(existsSync(join(V, 'origin/navbar-components')), 'navbar helper dir missing');
});
check('fancy: exactly 8 wild: rows, all payloads carry patch stamps', () => {
  const wild = rows('components.tsv').filter((x) => x.split('\t')[0] === 'fancy');
  assert(wild.length === 8, `fancy rows ${wild.length} != 8`);
  assert(wild.every((x) => x.includes('wild:')), 'a fancy row lost its wild: prefix');
  const g = JSON.parse(readFileSync(join(V, 'fancy/r/gravity.json'), 'utf8'));
  assert(g._vendoredFrom, 'gravity.json lacks _vendoredFrom stamp (unpatched copy)');
});

// wave 3
// wave 3 — atropos (insert after the fancy check; uses the existing check/assert/rows helpers + `manifest`)
check('atropos: 15-file allowlist intact, byte pins hold, pin matches MANIFEST', () => {
  const dir = join(V, 'atropos');
  const files = readdirSync(dir).filter((f) => f !== 'PIN.json').sort();
  const allow = ['LICENSE', 'README.md', 'atropos-element.d.ts', 'atropos-element.min.mjs',
    'atropos-element.mjs', 'atropos-react.d.ts', 'atropos-react.mjs', 'atropos.css',
    'atropos.d.ts', 'atropos.js', 'atropos.min.css', 'atropos.min.js', 'atropos.min.mjs',
    'atropos.mjs', 'package.json'];
  assert(files.length === 15 && files.join(',') === allow.join(','),
    `vendored files drifted from the 15-file allowlist: ${files.join(',')}`);
  const pin = JSON.parse(readFileSync(join(dir, 'PIN.json'), 'utf8'));
  assert(pin.version === '2.0.2', `atropos pin drift: ${pin.version}`);
  assert(pin.version === manifest.pinned.atropos, 'atropos PIN.json version != MANIFEST pin');
  assert(pin.allowlist_files === 15 && pin.total_bytes === 90744,
    `PIN.json byte manifest drifted (${pin.allowlist_files} files / ${pin.total_bytes} bytes)`);
  for (const f of pin.files)
    assert(statSync(join(dir, f.name)).size === f.bytes,
      `${f.name} on disk != pinned ${f.bytes} bytes — re-run: bash scripts/sync.sh atropos`);
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  assert(Object.keys(pkg.dependencies ?? {}).length === 0, 'atropos grew runtime deps — re-audit');
});
check('atropos: layered-scene engine present; card gate laws still have their targets', () => {
  const src = readFileSync(join(V, 'atropos/atropos.mjs'), 'utf8');
  assert(src.includes('data-atropos-offset'), 'per-layer offset engine marker missing — wrong artifact?');
  assert(src.includes('rotateTouch'), 'rotateTouch option gone — the scroll-y law in sources/atropos.md has no target');
  assert(!src.includes('prefers-reduced-motion'),
    'upstream added native reduced-motion handling — revise the mandatory gate in sources/atropos.md before trusting it');
  assert(readFileSync(join(V, 'atropos/atropos.css'), 'utf8').includes('touch-action: pan-y'),
    'scroll-y touch-action mapping missing from atropos.css');
  assert(readFileSync(join(V, 'atropos/LICENSE'), 'utf8').includes('MIT License'), 'atropos LICENSE is not MIT');
});
// NOTE for the evals owner: statSync must be added to the existing `node:fs`
// import line in check-arsenal.mjs (readFileSync, existsSync, readdirSync, statSync).
// wave 3 — curtains (insert with the other wave-3 checks; needs no new imports)
check('curtains: pins match MANIFEST, UMD byte-exact, MIT travels, ESM entry present', () => {
  assert(manifest.pinned.curtains === '8.1.6', `pin drift: ${manifest.pinned.curtains}`);
  assert(manifest.pinned.curtains_commit === '840acaf7d960931350a4e9334b78161aa9b471b7',
    `docs/examples commit pin drift: ${manifest.pinned.curtains_commit}`);
  const pkg = JSON.parse(readFileSync(join(V, 'curtains/package.json'), 'utf8'));
  assert(pkg.version === manifest.pinned.curtains, `vendored package.json ${pkg.version} != MANIFEST pin`);
  const umd = readFileSync(join(V, 'curtains/dist/curtains.umd.min.js'));
  assert(umd.length === 125310, `curtains.umd.min.js ${umd.length} B != audited exact 125310`);
  assert(readFileSync(join(V, 'curtains/LICENSE.txt'), 'utf8').includes('MIT License'), 'LICENSE.txt not MIT');
  assert(existsSync(join(V, 'curtains/src/index.mjs')), 'src/index.mjs missing (the only npm entry — ESM-only package)');
  assert(readdirSync(join(V, 'curtains/documentation')).filter((f) => f.endsWith('.html')).length === 18,
    'documentation != 18 html pages at this pin');
});
check('curtains: DOM-fallback contract + one-smoothing-layer strip law hold', () => {
  // runnable contract: the fallback IS the original DOM element — the UMD must
  // expose onError (fallback class hook) and updateScrollValues (lenis wiring)
  const umd = readFileSync(join(V, 'curtains/dist/curtains.umd.min.js'), 'utf8');
  assert(umd.includes('onError'), 'UMD lost onError — the .no-curtains fallback contract is dead');
  assert(umd.includes('updateScrollValues'), 'UMD lost updateScrollValues — the canonical lenis wiring is dead');
  // the vendored custom-scroll example anchors the card's lenis translation + fallback CSS
  const ex = join(V, 'curtains/examples/multiple-planes-scroll-effect-custom-scroll');
  assert(readFileSync(join(ex, 'js/multiple.planes.parallax.setup.js'), 'utf8').includes('updateScrollValues'),
    'custom-scroll example lost its updateScrollValues wiring');
  assert(readFileSync(join(ex, 'style.css'), 'utf8').includes('no-curtains'),
    'custom-scroll example lost its .no-curtains fallback CSS');
  // strip law: no third-party runtime dupe may exist anywhere in the vendor tree
  const files = readdirSync(join(V, 'curtains/examples'), { recursive: true }).map(String);
  assert(!files.some((f) => /locomotive-scroll|gsap\.min\.js/.test(f)),
    'stripped third-party runtime (locomotive-scroll / bundled gsap.min.js) resurfaced in examples');
  assert(files.some((f) => f.endsWith('VENDOR-NOTE.md')), 'examples/VENDOR-NOTE.md breadcrumb missing');
});
// MODEL-VIEWER checks for evals/check-arsenal.mjs (Wave 3) — append under a
// `// wave 3` comment. Uses only the file's existing helpers/imports
// (check, assert, readFileSync, join, V, manifest) — no new imports needed.
// Runnable contract (adding-a-source.md §11): the 4-file byte-pinned allowlist
// is intact, the Apache LICENSE travels with the dist files, the pin matches
// MANIFEST, the PRIMARY build is verifiably self-contained (r134-immunity is a
// structural fact, re-asserted every run), and no build writes a THREE global
// (the vanta co-load guarantee).

check('model-viewer: 4-file allowlist byte-pinned, Apache LICENSE travels, pin matches', () => {
  const pins = {
    'dist/model-viewer.min.js': 1068903,        // self-contained ESM (bundles its own three)
    'dist/model-viewer-module.min.js': 475096,  // external-three variant (^0.183 — card-scoped trap)
    'dist/model-viewer.d.ts': 89180,
    'LICENSE': 11358,
  };
  for (const [f, want] of Object.entries(pins)) {
    const got = readFileSync(join(V, 'model-viewer', f)).length;
    assert(got === want, `${f} is ${got} bytes, pinned ${want} — wrong/drifted artifact`);
  }
  assert(readFileSync(join(V, 'model-viewer/LICENSE'), 'utf8').includes('Apache License'),
    'LICENSE is not the Apache License text');
  assert(manifest.pinned.model_viewer === '4.3.1', `pin drift: ${manifest.pinned.model_viewer}`);
});
check('model-viewer: primary build self-contained (r134-immune), no THREE global, element defined', () => {
  const main = readFileSync(join(V, 'model-viewer/dist/model-viewer.min.js'), 'utf8');
  const mod = readFileSync(join(V, 'model-viewer/dist/model-viewer-module.min.js'), 'utf8');
  assert(!main.includes('from"three"'), 'primary build imports external three — not the self-contained build');
  assert(mod.includes('from"three"'), 'module build lost its external three import — wrong artifact');
  assert(main.includes('customElements.define'), 'custom element registration missing from primary build');
  assert(!/window\.THREE|globalThis\.THREE/.test(main) && !/window\.THREE|globalThis\.THREE/.test(mod),
    'a build writes a THREE global — vanta co-load guarantee broken, re-audit');
});
// check() blocks for evals/check-arsenal.mjs (wave 3 section).
// REQUIRES: (1) `statSync` added to the node:fs import at the top of
// check-arsenal.mjs; (2) the MANIFEST `khronos_gltf` pin from pins.txt
// (the last assertion fails until the orchestrator lands it — by design:
// pinned version must match MANIFEST, adding-a-source.md #11).

check('assets-3d: every indexed asset byte-matches its pin, HDRIs are real Radiance files', () => {
  const r = rows('assets-3d.tsv');
  assert(r.length >= 2, `assets-3d.tsv ${r.length} rows (< 2 — HDRI tier ships exactly 2)`);
  for (const line of r) {
    const [file, kind, , bytes] = line.split('\t');
    const p = join(SKILL, file);
    assert(existsSync(p), `${file} missing from disk`);
    assert(statSync(p).size === Number(bytes), `${file} bytes != indexed pin ${bytes} — content drifted`);
    if (kind === 'hdri')
      assert(readFileSync(p, 'latin1').startsWith('#?RADIANCE'), `${file} lost its Radiance magic header`);
    if (kind === 'model')
      assert(readFileSync(p, 'latin1').startsWith('glTF'), `${file} lost its binary-glTF magic header`);
  }
});
check('assets-3d: CC0 evidence + exclusion ledger intact, khronos pin matches MANIFEST', () => {
  const ledger = readFileSync(join(V, 'assets-3d/assets.tsv'), 'utf8');
  assert(/DamagedHelmet/.test(ledger) && /CC-BY-NC/.test(ledger),
    'DamagedHelmet NC-taint exclusion evidence missing from assets.tsv');
  assert(ledger.split('\n').filter((l) => l.split('\t')[8] === 'excluded').length === 8,
    'exclusion evidence rows != 8 — ledger reshaped');
  for (const m of ['SheenChair', 'ToyCar']) {
    const meta = JSON.parse(readFileSync(join(V, `assets-3d/models/${m}.metadata.json`), 'utf8'));
    assert(meta.legal.length >= 1 && meta.legal.every((e) => e.license === 'CC0'),
      `${m}.metadata.json legal[] no longer all-CC0 — model may not sit on the shelf`);
  }
  assert(manifest.pinned.khronos_gltf === '2bac6f8c57bf471df0d2a1e8a8ec023c7801dddf',
    `khronos pin drift: ${manifest.pinned.khronos_gltf}`);
});
// ============================================================================
// MEDIA-CHROME FRAGMENT for evals/check-arsenal.mjs (Wave 3)
// Two check() blocks in house style — drop in under a "// wave 3" comment.
// Uses the existing check/assert/rows helpers, manifest, V/IDX, existsSync,
// readFileSync, readdirSync, join. Activates once the orchestrator splices
// pins.txt into sync.sh (manifest.pinned.media_chrome).
// NOTE: the audit's full eval assertion — a keyboard-operable fixture player
// (arrow keys on the time range) passing axe via the Wave 1 review pack — is a
// Playwright-time fixture and belongs to evals/fixtures + evals.json (evals
// owner); these blocks assert the static half of that contract on every run.
// ============================================================================

check('media-chrome: 4.19.2 vanilla subset, dependency-free, a11y contract in dist', () => {
  assert(manifest.pinned.media_chrome === '4.19.2', `pin drift: ${manifest.pinned.media_chrome}`);
  const mc = join(V, 'media-chrome');
  const pin = JSON.parse(readFileSync(join(mc, 'PIN.json'), 'utf8'));
  assert(pin.version === manifest.pinned.media_chrome, 'PIN.json version != MANIFEST pin');
  assert(pin.themes_sha === manifest.pinned.player_style, 'PIN.json themes_sha != MANIFEST player_style pin');
  assert(readFileSync(join(mc, 'LICENSE'), 'utf8').includes('Permission is hereby granted'), 'LICENSE is not the MIT grant');
  // the 11 core controls + theme element must exist; react/cjs/menu must NOT
  for (const f of ['media-controller', 'media-control-bar', 'media-play-button', 'media-mute-button',
    'media-volume-range', 'media-time-range', 'media-time-display', 'media-duration-display',
    'media-fullscreen-button', 'media-poster-image', 'media-loading-indicator', 'media-theme-element'])
    assert(existsSync(join(mc, 'dist', `${f}.js`)), `dist/${f}.js missing`);
  for (const banned of ['dist/react', 'dist/cjs', 'dist/menu'])
    assert(!existsSync(join(mc, banned)), `${banned} vendored — vanilla-subset law broken`);
  // dependency-free subset: zero ce-la-react references in any vendored JS
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.js') ? [join(d, e.name)] : []);
  for (const f of walk(join(mc, 'dist')))
    assert(!readFileSync(f, 'utf8').includes('ce-la-react'), `${f} references ce-la-react`);
  // a11y contract (the audited adoption rationale): arrow-key ranges + i18n aria-labels
  assert(readFileSync(join(mc, 'dist/media-chrome-range.js'), 'utf8').includes('"ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"'),
    'arrow-key handling gone from media-chrome-range.js');
  assert(readFileSync(join(mc, 'dist/media-play-button.js'), 'utf8').includes('aria-label'),
    'aria-label wiring gone from media-play-button.js');
  assert(existsSync(join(mc, 'dist/lang/en.js')), 'lang/en.js missing — i18n aria-labels would fall back silently');
  // offline zero-build bundle: must be all.js (defines <media-theme>) and not truncated
  const iife = readFileSync(join(mc, 'dist/iife/all.js'), 'utf8');
  assert(iife.length >= 200000, 'iife/all.js under 200KB — truncated');
  assert(iife.includes('customElements.define("media-theme"'), 'iife/all.js no longer defines <media-theme> — themes would not render');
});

check('player-themes.tsv: exactly the 3 allowlisted themes, offline-safe, no lookalikes', () => {
  const r = rows('player-themes.tsv');
  assert(r.length === 3, `player-themes.tsv ${r.length} != 3 rows`);
  const names = r.map((x) => x.split('\t')[0]).sort();
  assert(JSON.stringify(names) === JSON.stringify(['microvideo', 'minimal', 'sutro']),
    `themes ${names.join(',')} != allowlist microvideo/minimal/sutro`);
  const tdir = join(V, 'media-chrome/themes');
  for (const banned of ['notflix', 'yt', 'vimeonova', 'winamp', 'instaplay'])
    assert(!existsSync(join(tdir, banned)), `brand-lookalike theme '${banned}' vendored — trade-dress law broken`);
  for (const t of names) {
    const tpl = readFileSync(join(tdir, t, 'template.html'), 'utf8');
    assert(tpl.length >= 10000, `${t} template.html truncated`);
    assert(tpl.includes('<media-controller'), `${t} template lost <media-controller>`);
    assert(!/src="https?:\/\/|href="https?:\/\/|url\(https?:\/\/|@import/.test(tpl),
      `${t} template references an external asset — offline contract broken`);
    assert(JSON.parse(readFileSync(join(tdir, t, 'package.json'), 'utf8')).license === 'MIT', `${t} theme not MIT`);
  }
});
// ============================================================================
// VFX-JS FRAGMENT for evals/check-arsenal.mjs (Wave 3) — drop these two
// check() blocks in under a "// wave 3" comment. Uses the existing helpers
// (check/rows/assert/manifest, readFileSync/readdirSync/existsSync, V/IDX/join).
// ============================================================================

check('vfx-presets.tsv exactly 22 rows, closed class set, pin + zero-dep contract', () => {
  const r = rows('vfx-presets.tsv');
  assert(r.length === 22, `vfx-presets.tsv ${r.length} != 22 rows (constants.js @1.1.0 ships 23 keys incl. identity 'none'; 22 are indexed)`);
  for (const x of r) {
    const cls = x.split('\t')[1];
    assert(['media-fx', 'motion-fx', 'transition'].includes(cls), `vfx preset '${x.split('\t')[0]}' has unknown class '${cls}' — closed set is media-fx|motion-fx|transition`);
  }
  assert(r.filter((x) => x.split('\t')[1] === 'transition').length === 4, 'vfx transition presets != 4 (warp/slitScan/pixelate/focus)');
  assert(manifest.pinned.vfx_js === '1.1.0', `vfx-js pin drift: ${manifest.pinned.vfx_js}`);
  assert(existsSync(join(V, 'vfx-js/LICENSE')), 'vfx-js LICENSE missing');
  // zero-dep tripwire (r134-class trap guard): a dependencies block reappearing
  // in the vendored package.json means the three.js dep came back
  const pkg = JSON.parse(readFileSync(join(V, 'vfx-js/package.json'), 'utf8'));
  assert(Object.keys(pkg.dependencies ?? {}).length === 0, 'vfx-js grew runtime deps — re-audit before trusting the vendor copy');
});

check('vfx-js runnable contract: shaders map + init/destroy anchors + clean curation', () => {
  const src = readFileSync(join(V, 'vfx-js/lib/esm/constants.js'), 'utf8');
  assert(/export const shaders = \{/.test(src), 'vfx-js shaders map export missing from constants.js');
  for (const p of ['glitch', 'rgbShift', 'duotone', 'focusTransition'])
    assert(new RegExp(`\\n    ${p}:`).test(src), `vfx-js preset '${p}' missing from constants.js`);
  // the two API anchors every card recipe depends on
  assert(/static init\(/.test(readFileSync(join(V, 'vfx-js/lib/esm/vfx.js'), 'utf8')), 'VFX.init (null-fallback contract) missing from vfx.js');
  assert(/cancelAnimationFrame/.test(readFileSync(join(V, 'vfx-js/lib/esm/vfx-player.js'), 'utf8')), 'rAF cancellation (destroy contract) missing from vfx-player.js');
  // curation filter held: no tests/sourcemaps/cjs in the vendored tree
  const walk = (dir) => readdirSync(join(V, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
  const files = walk('vfx-js/lib/esm');
  assert(files.length === 69, `vfx-js esm subset ${files.length} files != 69 at pin 1.1.0`);
  assert(files.every((f) => !f.includes('.test.') && !f.endsWith('.map')), 'tests/sourcemaps leaked into vendor/vfx-js');
  assert(!existsSync(join(V, 'vfx-js/lib/cjs')), 'lib/cjs vendored — curation filter excludes it');
});
// ---- noise (Wave 3) — drop into evals/check-arsenal.mjs alongside the other check() blocks
check('noise: 20 shader files with MIT headers, licenses, 23-row functions.tsv, pins match', () => {
  const dir = join(V, 'noise');
  const wn = readdirSync(join(dir, 'webgl-noise')).filter((f) => f.endsWith('.glsl'));
  const ps = readdirSync(join(dir, 'psrdnoise')).filter((f) => /\.(glsl|wgsl)$/.test(f));
  assert(wn.length === 11, `webgl-noise glsl census ${wn.length} != 11`);
  assert(ps.length === 9, `psrdnoise glsl/wgsl census ${ps.length} != 9`);
  // compliance contract: the in-file MIT header IS the license (psrdnoise has no upstream LICENSE file)
  for (const f of [...wn.map((f) => join(dir, 'webgl-noise', f)), ...ps.map((f) => join(dir, 'psrdnoise', f))])
    assert(/MIT/i.test(readFileSync(f, 'utf8')), `${f} lost its in-file MIT header`);
  assert(readFileSync(join(dir, 'webgl-noise/LICENSE'), 'utf8').includes('Permission is hereby granted'),
    'webgl-noise LICENSE missing or not the MIT grant');
  assert(existsSync(join(dir, 'psrdnoise/LICENSE-NOTICE.md')),
    'psrdnoise LICENSE-NOTICE.md missing (no upstream LICENSE file exists — the notice is mandatory)');
  // routing contract: the function TSV is BLOCKING (files without it are dead weight)
  const t = readFileSync(join(dir, 'functions.tsv'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#'));
  assert(t.length === 23, `functions.tsv ${t.length} != 23 rows`);
  const m = t.find((r) => r.startsWith('mpsrdnoise\t'));
  assert(m && /cheap/.test(m), 'mpsrdnoise row lost its mobile cost tier (mpsrdnoise2 must win on mobile over psrddnoise3)');
  // tiling contract: psrdnoise2 takes an arbitrary integer period (the seam-match eval fixture rides on this)
  assert(readFileSync(join(dir, 'psrdnoise/psrdnoise2.glsl'), 'utf8').includes('vec2 period'),
    'psrdnoise2 period parameter missing — tiling contract broken');
  assert(manifest.pinned.noise_webgl === '22434e04d7753f7e949e8d724ab3da2864c17a0f', `noise webgl pin drift: ${manifest.pinned.noise_webgl}`);
  assert(manifest.pinned.noise_psrd === '419175a270862ce7ae692038fafafb42ec0427e9', `noise psrd pin drift: ${manifest.pinned.noise_psrd}`);
});
// ---- r3f-drei (Wave 3) — drop into evals/check-arsenal.mjs alongside the other check() blocks
check('r3f-drei: grep-only doc artifacts sane, staleness-pinned, card carries the traps', () => {
  const d = join(V, 'r3f-drei');
  const r3f = readFileSync(join(d, 'r3f-llms-full.txt'), 'utf8');
  const drei = readFileSync(join(d, 'drei-llms-full.txt'), 'utf8');
  assert(r3f.length >= 150000, `r3f artifact ${r3f.length}B below 150KB floor`);
  assert(drei.length >= 190000, `drei artifact ${drei.length}B below 190KB floor`);
  assert(!/^\s*<!doctype|^\s*<html/i.test(r3f) && !/^\s*<!doctype|^\s*<html/i.test(drei),
    'an artifact is an HTML page, not the text export');
  assert((drei.match(/<page /g) || []).length >= 100, 'drei artifact lost its page structure (<100 pages)');
  assert(drei.includes('path="/staging/environment"'), 'drei /staging/environment page missing — the staging grammar is why this pack exists');
  const pin = JSON.parse(readFileSync(join(d, 'PIN.json'), 'utf8'));
  assert(pin.docs_valid_at.drei === manifest.pinned.drei_docs, `PIN.json drei ${pin.docs_valid_at.drei} != MANIFEST pin ${manifest.pinned.drei_docs}`);
  assert(pin.docs_valid_at.react_peer.includes('>=19 <19.3'), 'PIN.json lost the react peer window (TRAP 3)');
  // grep-routing contract: an environment-lighting answer must cite local HDRI files, never a preset —
  // the card must therefore carry both the raw.githack trap and the files= override.
  const card = readFileSync(join(SKILL, 'sources/r3f-drei.md'), 'utf8');
  assert(card.includes('raw.githack') && card.includes('files='), 'sources/r3f-drei.md lost TRAP 1 / the local-HDRI override');
  assert(card.includes('>=19 <19.3'), 'sources/r3f-drei.md lost the react peer pin (TRAP 3)');
});
// ---- video-policy (Wave 3) — drop into evals/check-arsenal.mjs alongside the other check() blocks
// Note: uses execFileSync, already imported at the top of check-arsenal.mjs.
check('video-policy: law card present, all three services dated, and NO video files vendored', () => {
  const card = readFileSync(join(SKILL, 'sources/video-policy.md'), 'utf8');
  for (const s of ['Coverr', 'Pexels', 'Pixabay']) assert(card.includes(s), `${s} row missing from the policy card`);
  assert(card.includes('2026-08-03'), 'rows lost their fetch-date stamps (staleness contract)');
  assert(/NEVER vendored/i.test(card), 'the never-vendor law line is gone from the card');
  assert(/Standalone basis/.test(card), 'Pixabay standalone-redistribution clause quote missing');
  assert(/Playwright/.test(card), 'the Playwright re-verification note is gone (Pixabay/Pexels 403 curl)');
  // the standing law, enforced mechanically: no video files may exist anywhere under vendor/
  const vids = execFileSync('find', [V, '-type', 'f', '(',
    '-name', '*.mp4', '-o', '-name', '*.webm', '-o', '-name', '*.mov', '-o', '-name', '*.m4v', '-o', '-name', '*.avi', ')'],
    { encoding: 'utf8' }).trim();
  assert(vids === '', `video files vendored — standing-law violation: ${vids.split('\n').slice(0, 3).join(', ')}`);
});

console.log(failures ? `\n${failures} arsenal contract(s) BROKEN` : '\narsenal self-test: all contracts hold');
process.exit(failures ? 1 : 0);
