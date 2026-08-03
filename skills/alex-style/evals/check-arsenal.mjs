#!/usr/bin/env node
// Arsenal self-test — one runnable assertion per source (adding-a-source.md §11).
// Run after any sync or integration: node evals/check-arsenal.mjs
// Exits non-zero on the first broken contract; zero deps, <1s.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
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

console.log(failures ? `\n${failures} arsenal contract(s) BROKEN` : '\narsenal self-test: all contracts hold');
process.exit(failures ? 1 : 0);
