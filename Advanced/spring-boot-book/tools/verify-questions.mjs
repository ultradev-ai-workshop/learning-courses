// Re-runs every computed question's harness tasks independently of the generator and checks that
// (1) the results are unchanged and (2) the marked answer options agree with them.
// Usage: node tools/verify-questions.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runHarness } from "./qharness.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { questions } = JSON.parse(readFileSync(join(ROOT, "questions.json"), "utf8"));
const computed = questions.filter((q) => q.run);
const tasks = computed.flatMap((q) => q.run.tasks);
const results = runHarness(tasks);

let i = 0, bad = 0;
for (const q of computed) {
  const got = results.slice(i, i + q.run.tasks.length);
  i += q.run.tasks.length;
  const problem = (msg) => { bad++; console.log(`✘ #${q.id} (${q.template}): ${msg}`); };
  if (got.join("\u0000") !== q.run.expect.join("\u0000")) { problem(`results changed: ${JSON.stringify(q.run.expect)} → ${JSON.stringify(got)}`); continue; }
  if (q.run.tasks.length === 1 && q.answer.length === 1) {
    const marked = q.options[q.answer[0]];
    const value = got[0];
    const ok = marked === value || (value.startsWith("ERROR") && /fails/.test(marked));
    if (!ok) problem(`marked "${marked}" but the harness computed "${value}"`);
    if (q.options.filter((o, k) => k !== q.answer[0]).includes(value)) problem(`the computed value also appears as a distractor`);
  }
}
console.log(`${computed.length} computed questions (${tasks.length} harness tasks) re-run: ${bad ? bad + " problem(s)" : "all answers confirmed"}`);
process.exit(bad ? 1 : 0);
