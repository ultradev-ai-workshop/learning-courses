// Independently re-checks questions.json by running every code-based question as a REAL
// file in a fresh Node process (.mjs, or .cjs for sloppy-mode questions), and every
// "select all" item one by one. Knowledge questions are reported as not executable.
// Usage: node tools/verify-questions.mjs
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = mkdtempSync(join(tmpdir(), "jsverify-"));
const data = JSON.parse(readFileSync(join(ROOT, "questions.json"), "utf8"));
let n = 0;

async function runFile(code, ext = "mjs", args = []) {
  const file = join(DIR, `q${n++}.${ext}`);
  writeFileSync(file, code + "\n");
  let stdout = "", stderr = "";
  try { ({ stdout, stderr } = await exec(process.execPath, [file, ...args], { timeout: 10000 })); }
  catch (e) { stdout = e.stdout ?? ""; stderr = e.stderr ?? ""; }
  const lines = stdout.split("\n").filter((l, i, a) => !(l === "" && i === a.length - 1));
  const err = stderr.match(/^(\w*Error)\b/m) ?? stderr.match(/^Uncaught (\w+)/m);
  if (err) lines.push(`throws ${err[1]}`);
  return lines.join(" / ");
}
const truth = async (expr) => (await runFile(`console.log(${expr});`)) === "true";

const checks = {
  async default(q) {
    const got = await runFile(q.code, q.mode === "sloppy" ? "cjs" : "mjs", q.args ?? []);
    return [q.options[q.answer[0]] === got, got];
  },
  async "truthy-select"(q) { return sel(q, (o) => truth(`Boolean(${o})`)); },
  async "equality-select"(q) { return sel(q, (o) => truth(o)); },
  async "mutate-select"(q) {
    return sel(q, async (o) => (await runFile(`const a = [3, 1, 2];\nconst before = JSON.stringify(a);\n${o};\nconsole.log(JSON.stringify(a) !== before);`)) === "true");
  },
  async "strict-select"(q) {
    return sel(q, async (o) => {
      const sloppy = await runFile(o, "cjs"), strict = await runFile(`"use strict";\n${o}`, "cjs");
      return strict.includes("throws") && !sloppy.includes("throws");
    });
  },
  async "module-syntax"(q) {
    return sel(q, async (o) => {
      const file = join(DIR, `m${n++}.mjs`);
      writeFileSync(file, (o.startsWith("export {") || o.startsWith("export x") ? "const x = 1;\n" : "") + o + "\n");
      try { await exec(process.execPath, ["--check", file]); return true; } catch { return false; }
    });
  },
  async "processor-outcome"(q) {
    const [, stock, qty, book, card] = q.question.match(/stock (\d+)\. .*order for (\d+) × (\w+) paid with card ([\d-]+)/);
    const ref = (p) => pathToFileURL(join(ROOT, "playground", "reference", "src", p)).href;
    const code = `import { Catalog } from ${JSON.stringify(ref("catalog.js"))};
import { processOrder } from ${JSON.stringify(ref("processor.js"))};
const catalog = new Catalog([{ id: "b1", title: "Dune", price: 1299, stock: ${stock} }]);
const r = await processOrder({ id: "q1", customer: "Ana", card: "${card}", items: [{ bookId: "${book}", qty: ${qty} }] }, catalog, { timeoutMs: 500 });
console.log(r.status === "paid" ? \`paid \${r.cents} cents, stock left \${catalog.get("b1").stock}\` : \`failed (\${r.reason.split(":")[0]}), stock left \${catalog.get("b1").stock}\`);`;
    const got = await runFile(code);
    return [q.options[q.answer[0]] === got, got];
  },
};
async function sel(q, isTrue) {
  const flags = await Promise.all(q.options.map(isTrue));
  const got = q.options.filter((_, i) => flags[i]);
  const want = q.answer.map((i) => q.options[i]);
  return [got.length === want.length && got.every((g) => want.includes(g)), JSON.stringify(got)];
}

const KNOWLEDGE = new Set(["es-version", "module-scenario", "project-design", "es5-modern", "npm-command", "semver-select"]);
const stats = {}, failures = [];
const todo = data.questions.filter((q) => q.template);
let idx = 0;
async function worker() {
  while (idx < todo.length) {
    const q = todo[idx++];
    const s = (stats[q.template] ??= { ok: 0, fail: 0, unverified: 0 });
    if (KNOWLEDGE.has(q.template)) { s.unverified++; continue; }
    const check = checks[q.template] ?? (q.code ? checks.default : null);
    if (!check) { s.unverified++; continue; }
    const [ok, got] = await check(q);
    if (ok) s.ok++; else { s.fail++; failures.push({ q, got }); }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

for (const [t, s] of Object.entries(stats).sort()) console.log(`${t.padEnd(20)} ok=${s.ok} fail=${s.fail} unverified=${s.unverified}`);
const tot = Object.values(stats).reduce((a, s) => ({ ok: a.ok + s.ok, fail: a.fail + s.fail, unverified: a.unverified + s.unverified }), { ok: 0, fail: 0, unverified: 0 });
console.log("TOTAL", tot, `(Node ${process.version})`);
for (const { q, got } of failures.slice(0, 20)) {
  console.log(`\nFAIL #${q.id} [${q.template}] ${q.question}\n${q.code ?? ""}\n  marked: ${JSON.stringify(q.answer.map((i) => q.options[i]))}\n  real:   ${got}`);
}
process.exit(failures.length ? 1 : 0);
