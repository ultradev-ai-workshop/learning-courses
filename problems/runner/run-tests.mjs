#!/usr/bin/env node
// Run your solution against the official tests of a problem (same behaviour as run-tests.py).
//
// Usage:
//   node runner/run-tests.mjs E01 -- node my-solution.js
//   node runner/run-tests.mjs M13 -- java Main
//   node runner/run-tests.mjs O08 --timeout 5 -- ./lru
//
// Everything after `--` is the command that runs your program. Line endings, trailing spaces at
// the end of lines and blank lines at the very end are ignored; everything else must match exactly.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const tty = process.stdout.isTTY;
const [GREEN, RED, DIM, RESET] = tty ? ['\x1b[32m', '\x1b[31m', '\x1b[2m', '\x1b[0m'] : ['', '', '', ''];

const normalise = (text) => {
  const rows = text.replace(/\r\n?/g, '\n').split('\n').map((r) => r.trimEnd());
  while (rows.length && rows.at(-1) === '') rows.pop();
  return rows;
};
const firstDifference = (got, want) => {
  for (let i = 0; i < Math.max(got.length, want.length); i++) {
    const g = i < got.length ? got[i] : '<missing line>';
    const w = i < want.length ? want[i] : '<no more lines expected>';
    if (g !== w) return { line: i + 1, g, w };
  }
  return null;
};
const short = (s, n = 120) => (s.length <= n ? s : `${s.slice(0, n)}… (${s.length} chars)`);

const argv = process.argv.slice(2);
const split = argv.indexOf('--');
if (split < 0 || split === argv.length - 1) {
  console.error('usage: node runner/run-tests.mjs <PROBLEM-ID> [--timeout s] [--stop] -- <command that runs your solution>');
  process.exit(2);
}
const opts = argv.slice(0, split);
const command = argv.slice(split + 1);
const pid = opts.find((o) => !o.startsWith('--') && !/^\d+(\.\d+)?$/.test(o))?.toUpperCase();
const timeoutAt = opts.indexOf('--timeout');
const timeout = timeoutAt >= 0 ? Number(opts[timeoutAt + 1]) : 10;
const stop = opts.includes('--stop');

const folder = join(ROOT, 'tests', pid ?? '');
if (!pid || !existsSync(folder)) {
  console.error(`error: no tests for ${JSON.stringify(pid)} (expected a folder ${folder})`);
  process.exit(2);
}
const names = readdirSync(folder).filter((f) => f.endsWith('.in')).map((f) => f.slice(0, -3)).sort();

let passed = 0;
for (const name of names) {
  const given = readFileSync(join(folder, `${name}.in`), 'utf8');
  const want = normalise(readFileSync(join(folder, `${name}.out`), 'utf8'));
  const start = performance.now();
  const run = spawnSync(command[0], command.slice(1), { input: given, encoding: 'utf8', timeout: timeout * 1000, maxBuffer: 256 * 1024 * 1024 });
  const took = performance.now() - start;
  if (run.error?.code === 'ENOENT') {
    console.error(`error: command not found: ${command[0]}`);
    process.exit(2);
  }
  if (run.error?.code === 'ETIMEDOUT' || run.signal === 'SIGTERM') {
    console.log(`${RED}✗ test ${name}: time limit exceeded (${timeout}s)${RESET}`);
    if (stop) break;
    continue;
  }
  const diff = firstDifference(normalise(run.stdout ?? ''), want);
  if (!diff && run.status === 0) {
    passed++;
    console.log(`${GREEN}✓ test ${name}${RESET} ${DIM}${took.toFixed(0)} ms${RESET}`);
    continue;
  }
  if (!diff) {
    console.log(`${RED}✗ test ${name}: correct output but the program exited with code ${run.status}${RESET}`);
  } else {
    console.log(`${RED}✗ test ${name}: first difference on line ${diff.line}${RESET}`);
    console.log(`    expected: ${JSON.stringify(short(diff.w))}`);
    console.log(`    got:      ${JSON.stringify(short(diff.g))}`);
    console.log(`    input:    ${DIM}${given.length <= 300 ? JSON.stringify(given.trimEnd()) : join(folder, `${name}.in`)}${RESET}`);
  }
  const err = (run.stderr ?? '').trim();
  if (err) console.log(`    stderr:   ${DIM}${short(err.split('\n').at(-1))}${RESET}`);
  if (stop) break;
}
const colour = passed === names.length ? GREEN : RED;
console.log(`${colour}${pid}: ${passed}/${names.length} tests passed${RESET}`);
process.exit(passed === names.length ? 0 : 1);
