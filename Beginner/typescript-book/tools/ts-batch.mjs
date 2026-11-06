// Compile many small TypeScript files at once with the pinned tsc, and run emitted JavaScript.
// Used by gen-questions.mjs (batch) and verify-questions.mjs (one file per project, independent).
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOOLS = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(TOOLS, "..");
const TSC = join(TOOLS, "node_modules", ".bin", "tsc");

export const BASE_OPTIONS = {
  target: "es2024", lib: ["es2024"], module: "nodenext", types: ["node"],
  strict: true, moduleDetection: "force", skipLibCheck: true, rootDir: ".", outDir: "out", pretty: false,
};

/** Shared module that question snippets may import as "./shared.js". */
export const SHARED = `export interface Book { id: string; title: string; year: number }
export type Format = "paperback" | "ebook";
export const books: Book[] = [{ id: "b1", title: "Dune", year: 1965 }, { id: "b2", title: "Emma", year: 1815 }];
export function find(id: string): Book | undefined { return books.find((b) => b.id === id); }
export default function count(): number { return books.length; }
`;

export function workdir(prefix = "tsq-") {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  writeFileSync(join(dir, "package.json"), '{ "type": "module" }\n');
  symlinkSync(join(TOOLS, "node_modules"), join(dir, "node_modules"));
  writeFileSync(join(dir, "shared.ts"), SHARED);
  return dir;
}

/**
 * Compile files (array of { name, code, flags }) grouped by flags; one tsc program per group.
 * Returns Map name → array of error lines ("(line,col): error TSxxxx: msg", file name removed).
 */
export function compileBatch(dir, files, { emit = false } = {}) {
  const groups = new Map();
  for (const f of files) {
    const key = JSON.stringify(f.flags ?? {});
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(f);
  }
  const errors = new Map(files.map((f) => [f.name, []]));
  let g = 0;
  // tsc reports only syntax errors when any file in the program has one, so files with syntax
  // errors are moved into programs of their own and the rest is compiled again.
  const SYNTAX = /expected\.$|Unterminated|Invalid character|Declaration or statement expected|Expression expected/;
  function run(key, group) {
    for (const f of group) errors.set(f.name, []);
    const cfg = `tsconfig.g${g++}.json`;
    const compilerOptions = { ...BASE_OPTIONS, ...JSON.parse(key), ...(emit ? {} : { noEmit: true }) };
    writeFileSync(join(dir, cfg), JSON.stringify({ compilerOptions, files: ["shared.ts", ...group.map((f) => f.name)] }));
    const r = spawnSync(TSC, ["-p", cfg], { cwd: dir, encoding: "utf8", maxBuffer: 1 << 28 });
    const syntax = new Set();
    for (const line of (r.stdout + r.stderr).split("\n")) {
      const m = line.match(/^(.+?\.ts)(\(\d+,\d+\): error TS\d+: .*)$/);
      if (m && errors.has(m[1])) { errors.get(m[1]).push(m[2]); if (SYNTAX.test(m[2])) syntax.add(m[1]); }
      else if (m) { if (m[1] !== "shared.ts") throw new Error(`error in unknown file: ${line}`); }
      else if (/^error TS/.test(line)) throw new Error(`config error: ${line}`);
    }
    return syntax;
  }
  for (const [key, group] of groups) {
    for (const f of group) {
      mkdirSync(dirname(join(dir, f.name)), { recursive: true });
      writeFileSync(join(dir, f.name), f.code + "\n");
    }
    const syntax = run(key, group);
    if (syntax.size && group.length > 1) {
      for (const f of group.filter((x) => syntax.has(x.name))) run(key, [f]);
      const rest = group.filter((x) => !syntax.has(x.name));
      if (rest.length) run(key, rest);
    }
  }
  return errors;
}

/** Run node on files (paths relative to dir), at most `limit` at a time. Returns Map path → output text. */
export async function runMany(dir, paths, limit = 8) {
  const out = new Map();
  let i = 0;
  async function worker() {
    while (i < paths.length) {
      const p = paths[i++];
      out.set(p, await new Promise((resolve) => {
        const child = spawn(process.execPath, [p], { cwd: dir, env: { ...process.env, NO_COLOR: "1" } });
        let stdout = "", stderr = "";
        child.stdout.on("data", (d) => (stdout += d));
        child.stderr.on("data", (d) => (stderr += d));
        const timer = setTimeout(() => child.kill(), 10000);
        child.on("close", (code) => {
          clearTimeout(timer);
          const err = code ? (stderr.match(/^(\w*Error)\b.*$/m) || [])[1] : null;
          resolve(stdout.replace(/\n$/, "") + (err ? (stdout ? "\n" : "") + `throws ${err}` : ""));
        });
      }));
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
}

export const emitted = (name) => join("out", name.replace(/\.ts$/, ".js"));
export const read = (p) => readFileSync(p, "utf8");
