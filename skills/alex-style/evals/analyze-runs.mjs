#!/usr/bin/env node
// Call-monitoring analyzer for alex-style eval runs.
// Parses workflow subagent transcripts and writes monitor.json + timing.json into
// each matching run directory (iteration-N/<eval>/<config>/).
//
// Usage: node analyze-runs.mjs <workflow-transcript-dir> <iteration-dir>
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const [tdir, iterDir] = process.argv.slice(2);
if (!tdir || !iterDir) {
  console.error('usage: analyze-runs.mjs <workflow-transcript-dir> <iteration-dir>');
  process.exit(1);
}

// files an agent should never read in full (token discipline)
const FORBIDDEN_FULL_READ = [/llms-full\.txt$/, /animista\/keyframes\.css$/, /phosphor\/icons\.ts$/];

const rows = [];
for (const f of readdirSync(tdir).filter((f) => f.endsWith('.jsonl') && f.startsWith('agent-'))) {
  const lines = readFileSync(join(tdir, f), 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
  if (!lines.length) continue;

  // identify run from the first user prompt (contains .../iteration-N/<eval>/<config>/outputs)
  const firstUser = lines.find((l) => l.type === 'user');
  const promptText = typeof firstUser?.message?.content === 'string'
    ? firstUser.message.content
    : JSON.stringify(firstUser?.message?.content ?? '');
  const m = promptText.match(/iteration-\d+\/([a-z0-9-]+)\/(with_skill|without_skill)\//);
  if (!m) continue; // not an eval run (e.g. different workflow)
  const [, evalName, config] = m;

  const stats = {
    eval: evalName, config, transcript: basename(f),
    duration_s: 0, output_tokens: 0, peak_context_tokens: 0,
    tool_counts: {}, web_calls: [], curl_like_commands: [],
    files_fully_read: [], forbidden_reads: [], grep_count: 0,
    vendor_touches: 0, skill_md_read: false,
  };

  const ts = lines.map((l) => l.timestamp).filter(Boolean);
  if (ts.length > 1) stats.duration_s = Math.round((new Date(ts.at(-1)) - new Date(ts[0])) / 1000);

  for (const l of lines) {
    if (l.type !== 'assistant') continue;
    const u = l.message?.usage;
    if (u) {
      stats.output_tokens += u.output_tokens ?? 0;
      const ctx = (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);
      if (ctx > stats.peak_context_tokens) stats.peak_context_tokens = ctx;
    }
    for (const c of l.message?.content ?? []) {
      if (c.type !== 'tool_use') continue;
      stats.tool_counts[c.name] = (stats.tool_counts[c.name] ?? 0) + 1;
      const input = JSON.stringify(c.input ?? {});

      if (/^(WebFetch|WebSearch)$/.test(c.name))
        stats.web_calls.push(`${c.name}: ${(c.input?.url ?? c.input?.query ?? '').slice(0, 120)}`);
      else if (/browser|playwright|preview/i.test(c.name)) {
        const url = c.input?.url ?? '';
        if (/^https?:\/\//.test(url) && !/localhost|127\.0\.0\.1/.test(url))
          stats.web_calls.push(`${c.name}: ${url.slice(0, 120)}`);
        else stats.local_preview_calls = (stats.local_preview_calls ?? 0) + 1;
      }
      if (c.name === 'Bash') {
        const cmd = c.input?.command ?? '';
        if (/\b(curl|wget|npm (install|view|i)\b|npx |pip install)/.test(cmd))
          stats.curl_like_commands.push(cmd.slice(0, 160));
        if (/\bgrep\b|\brg\b|\bawk\b/.test(cmd)) stats.grep_count++;
      }
      if (c.name === 'Grep') stats.grep_count++;
      if (c.name === 'Read') {
        const p = c.input?.file_path ?? '';
        const partial = c.input?.offset != null || c.input?.limit != null;
        if (!partial) stats.files_fully_read.push(p);
        if (!partial && FORBIDDEN_FULL_READ.some((re) => re.test(p))) stats.forbidden_reads.push(p);
        if (/SKILL\.md$/.test(p) && /alex-style/.test(p)) stats.skill_md_read = true;
      }
      if (/\bvendor\/(_index|magicui|kokonutui|reactbits|motion-primitives|gsap|motion|lenis|phosphor|animista|vanta|shadergradient|recent|layers)\b/.test(input)
        || /alex-style\/vendor\//.test(input)) stats.vendor_touches++;
    }
  }

  const runDir = join(iterDir, evalName, config);
  if (!existsSync(runDir)) mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, 'monitor.json'), JSON.stringify(stats, null, 2));
  writeFileSync(join(runDir, 'timing.json'), JSON.stringify({
    total_tokens: stats.output_tokens, duration_ms: stats.duration_s * 1000,
    total_duration_seconds: stats.duration_s, peak_context_tokens: stats.peak_context_tokens,
  }, null, 2));
  rows.push(stats);
}

// summary table
rows.sort((a, b) => a.eval.localeCompare(b.eval) || a.config.localeCompare(b.config));
console.log('eval\tconfig\tdur_s\tout_tok\tctx_peak\ttools\tgreps\tvendor\tweb\tpreview\tnet_cmds\tforbidden');
for (const r of rows) {
  const tools = Object.values(r.tool_counts).reduce((a, b) => a + b, 0);
  console.log([r.eval, r.config, r.duration_s, r.output_tokens, r.peak_context_tokens, tools,
    r.grep_count, r.vendor_touches, r.web_calls.length, r.local_preview_calls ?? 0,
    r.curl_like_commands.length, r.forbidden_reads.length].join('\t'));
}
console.log(`\n${rows.length} runs analyzed → monitor.json + timing.json written per run dir`);
