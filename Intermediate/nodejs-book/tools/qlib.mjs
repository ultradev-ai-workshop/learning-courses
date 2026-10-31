// Shared helpers for the question generator and verifier: a seeded RNG and a real-process runner.
//
// run(spec) executes code in a FRESH Node process (the same Node that runs this script) inside a
// temporary folder, and returns stdout lines joined with " / ". If the process printed an error
// (an uncaught exception or rejection), "throws <ErrorName>" is appended. Options:
//   ext: "mjs" (default) | "cjs" | "ts"    files: { "name": "content" } written next to the snippet
//   args: [..]  env: { .. }  stdin: "text"  execArgv: [..]  showExit: true → append "exit N"
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const ROOT_TMP = mkdtempSync(join(tmpdir(), "nodeq-"));
let counter = 0;
process.on("exit", () => rmSync(ROOT_TMP, { recursive: true, force: true }));

export function run({ code, ext = "mjs", files = {}, args = [], env = {}, stdin, execArgv = [], showExit = false, timeout = 15000 }) {
  const dir = join(ROOT_TMP, `r${counter++}`);
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), content);
  }
  const file = `main.${ext}`;
  writeFileSync(join(dir, file), code + "\n");
  const childEnv = { PATH: process.env.PATH, HOME: process.env.HOME, NO_COLOR: "1", ...env };
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [...execArgv, file, ...args], { cwd: dir, env: childEnv });
    let out = "", err = "";
    child.stdout.on("data", (c) => (out += c));
    child.stderr.on("data", (c) => (err += c));
    const timer = setTimeout(() => child.kill("SIGKILL"), timeout);
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      rmSync(dir, { recursive: true, force: true });
      const lines = out.split("\n").filter((l, i, a) => !(l === "" && i === a.length - 1));
      const m = err.match(/^\s*(?:Uncaught )?([A-Z]\w*(?:Error|Exception))\b(?: \[\w+\])?:/m) ?? err.match(/^(\w*Error)\b/m);
      if (m) lines.push(`throws ${m[1]}`);
      if (signal) lines.push("timeout");
      if (showExit) lines.push(`exit ${code}`);
      resolve(lines.join(" / "));
    });
    if (stdin !== undefined) child.stdin.end(stdin);
    else child.stdin.end();
  });
}

// Run many specs with limited parallelism, preserving order.
export async function runAll(specs, limit = 8) {
  const results = new Array(specs.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, specs.length) }, async () => {
    while (next < specs.length) { const i = next++; results[i] = await run(specs[i]); }
  }));
  return results;
}

// How a raw run output is shown as an answer option (shared by the generator and the verifier).
export function applyDisplay(rule, out) {
  if (rule === "stderr") return out.replace(/ \/ throws \w+/, " / (error on stderr)").replace(/^throws \w+ \/ /, "(error on stderr) / ");
  if (rule === "empty") return out === "" ? "(nothing)" : out;
  return out;
}
