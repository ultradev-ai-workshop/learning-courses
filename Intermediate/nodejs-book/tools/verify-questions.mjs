// Independently re-checks questions.json: every question that stores a run spec is executed again in a
// fresh Node process, and its output must equal the option marked correct. "Select all" questions store
// one run spec per option (printing true/false), and the marked answers must be exactly the true ones.
// Knowledge questions (hand-written or table-based) are reported as not executable.
// Usage: node tools/verify-questions.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { applyDisplay, run } from "./qlib.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(ROOT, "questions.json"), "utf8"));

async function check(q) {
  if (q.optionRuns?.some(Boolean)) {
    const flags = [];
    for (const spec of q.optionRuns) flags.push(spec ? (await run(spec)) === "true" : null);
    const got = q.options.filter((_, i) => flags[i]);
    const want = q.answer.map((i) => q.options[i]);
    return [got.length === want.length && got.every((g) => want.includes(g)), JSON.stringify(got)];
  }
  if (q.run) {
    const got = applyDisplay(q.run.display, await run(q.run));
    return [q.answer.length === 1 && q.options[q.answer[0]] === got, got];
  }
  return null;
}

const stats = {}, failures = [];
const todo = data.questions;
let idx = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (idx < todo.length) {
    const q = todo[idx++];
    const key = q.template ?? "hand-written";
    const s = (stats[key] ??= { ok: 0, fail: 0, unverified: 0 });
    const result = await check(q);
    if (!result) { s.unverified++; continue; }
    const [ok, got] = result;
    if (ok) s.ok++; else { s.fail++; failures.push({ q, got }); }
  }
}));

for (const [t, s] of Object.entries(stats).sort()) console.log(`${t.padEnd(18)} ok=${s.ok} fail=${s.fail} unverified=${s.unverified}`);
const tot = Object.values(stats).reduce((a, s) => ({ ok: a.ok + s.ok, fail: a.fail + s.fail, unverified: a.unverified + s.unverified }), { ok: 0, fail: 0, unverified: 0 });
console.log("TOTAL", tot, `(Node ${process.version})`);
for (const { q, got } of failures.slice(0, 15)) {
  console.log(`\nFAIL #${q.id} [${q.template}] ${q.question}\n${q.code ?? ""}\n  marked: ${JSON.stringify(q.answer.map((i) => q.options[i]))}\n  real:   ${got}`);
}
process.exit(failures.length ? 1 : 0);
