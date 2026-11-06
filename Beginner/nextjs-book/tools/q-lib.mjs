// Shared helpers for the question generator and verifier: chapters, seeded randomness,
// building throwaway Next.js apps, parsing the route table, running Node snippets.
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_FILES } from "./check-snippets.mjs";

export const TOOLS = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(TOOLS, "..");
export const WORK = join(TOOLS, ".work", "questions");
const NEXT = join(TOOLS, "node_modules", ".bin", "next");

export const CHAPTERS = {
  what: ["1", "What Next.js Is (and Isn't)", "01-what.html"],
  install: ["2", "Installation & Project Structure", "02-install.html"],
  layouts: ["3", "Layouts and Pages", "03-layouts-pages.html"],
  linking: ["4", "Linking, Navigating & Dynamic Routes", "04-linking.html"],
  serverclient: ["5", "Server and Client Components", "05-server-client.html"],
  fetching: ["6", "Fetching Data & Streaming", "06-fetching.html"],
  mutating: ["7", "Mutating Data: Server Actions & Forms", "07-mutating.html"],
  caching: ["8", "Caching with Cache Components", "08-caching.html"],
  revalidating: ["9", "Revalidating", "09-revalidating.html"],
  errors: ["10", "Error Handling", "10-errors.html"],
  css: ["11", "CSS & Tailwind", "11-css.html"],
  images: ["12", "Images & Fonts", "12-images-fonts.html"],
  metadata: ["13", "Metadata & OG Images", "13-metadata.html"],
  routes: ["14", "Route Handlers", "14-route-handlers.html"],
  proxy: ["15", "Proxy", "15-proxy.html"],
  envauth: ["16", "Environment Variables & Auth Basics", "16-env-auth.html"],
  testing: ["17", "Testing with Vitest & Playwright", "17-testing.html"],
  deploying: ["18", "Deploying, Self-hosting & Upgrading", "18-deploying.html"],
  project: ["19", "Capstone: Reading List App", "19-project.html"],
  react: ["A", "React & TypeScript for Next.js", "appendix-react.html"],
  pages: ["B", "Pages Router & Migrating", "appendix-pages-router.html"],
};

export function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function makeRandom(seed) {
  const rand = mulberry32(seed);
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return { rand, shuffle, pick: (arr) => arr[Math.floor(rand() * arr.length)], sample: (arr, k) => shuffle(arr).slice(0, k) };
}

const env = { ...process.env, NO_COLOR: "1", NEXT_TELEMETRY_DISABLED: "1", CI: "1" };

/** Write files into a fresh app folder (on top of the create-next-app baseline) and run `next build`. */
export function buildApp(name, files, { config } = {}) {
  const dir = join(WORK, name);
  rmSync(dir, { recursive: true, force: true });
  const all = { ...BASE_FILES, ...(config ? { "next.config.ts": config } : {}), ...files };
  for (const [f, c] of Object.entries(all)) { const p = join(dir, f); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); }
  const r = spawnSync(NEXT, ["build"], { cwd: dir, env, encoding: "utf8", timeout: 300000, maxBuffer: 64 << 20 });
  const out = ((r.stdout || "") + (r.stderr || "")).replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "");
  return { ok: r.status === 0, out, dir };
}

/** Parse the route table: { "/path": "○" | "◐" | "ƒ" | "●" } (only lines with a symbol). */
export function parseRoutes(out) {
  const routes = {};
  const start = out.indexOf("Route (");
  if (start < 0) return routes;
  for (const line of out.slice(start).split("\n")) {
    const m = line.match(/([○◐ƒ●])\s+(\/\S*)/);
    if (m) routes[m[2]] = m[1];
  }
  return routes;
}

/** Classify a failed build's output into one of the book's error kinds. */
export function classifyBuildError(out) {
  if (/not compatible with `nextConfig\.cacheComponents`/.test(out)) return "segment-config";
  if (/unstable value|used `new Date\(\)`|used `Math\.random\(\)`|current time/.test(out)) return "unstable";
  if (/uncached or runtime data/.test(out)) return "runtime-data";
  if (/only available in Client Components|depends on `use(State|Effect|Ref|Reducer)`/.test(out)) return "client-only-api";
  if (/Event handlers cannot be passed|Functions cannot be passed directly/.test(out)) return "non-serializable";
  if (/server-only/.test(out)) return "server-only";
  if (/Type error|error TS\d+/.test(out)) return "type-error";
  return "other";
}

/** Run TypeScript/JavaScript snippets with Node (type stripping) in a folder that sees tools/node_modules. */
export function runNode(snippets) {
  const dir = join(WORK, "node");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "package.json"), '{ "type": "module" }\n');
  return snippets.map((code, i) => {
    const f = join(dir, `s${i}.ts`);
    writeFileSync(f, code + "\n");
    const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", f], { cwd: dir, env, encoding: "utf8", timeout: 30000 });
    return { ok: r.status === 0, out: (r.stdout || "").replace(/\n$/, ""), err: r.stderr };
  });
}
