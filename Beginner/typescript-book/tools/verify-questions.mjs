// Independently re-checks every computed question in questions.json.
//
// Unlike gen-questions.mjs (which compiles everything in a few big batches), this compiles every
// check as its OWN tsc project, in a fresh folder, and runs every output snippet in a fresh Node
// process, then compares with the stored answer:
//   compiles/assign/typeEq → the set of options that compile must equal `answer`
//   lines                  → the set of lines with errors must equal `answer`
//   output                 → the printed text must equal the option at `answer[0]`
// Hand-written (knowledge) questions are counted but can't be executed.
//
// Usage: node tools/verify-questions.mjs
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASE_OPTIONS, ROOT, workdir } from "./ts-batch.mjs";

const TSC = join(ROOT, "tools", "node_modules", ".bin", "tsc");
const data = JSON.parse(readFileSync(join(ROOT, "questions.json"), "utf8"));
const base = workdir("tsverify-");
let n = 0;

function exec(cmd, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, env: { ...process.env, NO_COLOR: "1" } });
    let out = "", err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    const timer = setTimeout(() => child.kill(), 30000);
    child.on("close", (code) => { clearTimeout(timer); resolve({ code, out, err }); });
  });
}

/** Compile one snippet in its own project folder; returns { errors: [lines], dir }. */
async function compileOne(code, flags, emit = false) {
  const dir = join(base, `p${n++}`);
  mkdirSync(dir);
  writeFileSync(join(dir, "package.json"), '{ "type": "module" }\n');
  writeFileSync(join(dir, "shared.ts"), readFileSync(join(base, "shared.ts")));
  writeFileSync(join(dir, "main.ts"), code + "\n");
  writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({
    compilerOptions: { ...BASE_OPTIONS, typeRoots: [join(base, "node_modules", "@types")], ...flags, ...(emit ? {} : { noEmit: true }) },
    files: ["shared.ts", "main.ts"],
  }));
  const r = await exec(TSC, ["-p", "tsconfig.json"], dir);
  const errors = (r.out + r.err).split("\n").filter((l) => /^main\.ts\(\d+,\d+\): error/.test(l));
  return { errors, dir };
}

async function verify(q) {
  const run = q.run;
  if (run.kind === "compiles") {
    const results = await Promise.all(run.checks.map((c) => compileOne(c, run.flags)));
    const got = results.map((r, i) => (r.errors.length === 0 ? i : -1)).filter((i) => i >= 0);
    return [JSON.stringify(got) === JSON.stringify([...q.answer].sort((a, b) => a - b)), `compiling options: ${JSON.stringify(got)}`];
  }
  if (run.kind === "lines") {
    const { errors } = await compileOne(run.code, run.flags);
    const lineSet = [...new Set(errors.map((e) => Number(e.match(/\((\d+),/)[1])))].sort((a, b) => a - b);
    const want = q.answer.map((i) => q.options[i]).map((o) => (o.startsWith("Line ") ? Number(o.slice(5)) : 0)).filter(Boolean).sort((a, b) => a - b);
    return [JSON.stringify(lineSet) === JSON.stringify(want), `error lines: ${JSON.stringify(lineSet)}`];
  }
  const { errors, dir } = await compileOne(run.code, run.flags, true);
  if (errors.length) return [false, `type errors: ${errors[0]}`];
  const r = await exec(process.execPath, ["out/main.js"], dir);
  const err = r.code ? (r.err.match(/^(\w*Error)\b/m) || [])[1] : null;
  const shown = (r.out.replace(/\n$/, "") + (err ? (r.out ? "\n" : "") + `throws ${err}` : "")).split("\n").join(" / ");
  return [shown === q.options[q.answer[0]], `printed: ${shown}`];
}

const computed = data.questions.filter((q) => q.run);
const kinds = {};
let ok = 0, bad = 0, i = 0;
async function worker() {
  while (i < computed.length) {
    const q = computed[i++];
    const [pass, detail] = await verify(q);
    kinds[q.run.kind] = (kinds[q.run.kind] || 0) + 1;
    if (pass) ok++;
    else { bad++; console.log(`✘ #${q.id} (${q.topic}, ${q.template}): ${detail}\n   stored answer: ${JSON.stringify(q.answer.map((a) => q.options[a]))}`); }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
const hand = data.questions.length - computed.length;
console.log(`verified ${ok}/${computed.length} computed questions (${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(", ")}); ${hand} hand-written questions are not executable`);
process.exit(bad ? 1 : 0);
