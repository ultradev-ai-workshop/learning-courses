// Generates questions.json for the Next.js Study Book (1000 questions, all 21 topics).
//
// Computed questions are answered by really running things, never by the author's guess:
//   route    "Which URL does this file serve?"       → one Next.js app with many files is built and the
//                                                     route table of `next build` is parsed
//   symbol   "Which symbol does the build show?"     → variants are built; the symbol is read from the table
//   builds   "Does this build? If not, which error?" → each variant is built on its own; the output is classified
//   output   "What does this print?"                 → the snippet runs with Node (type stripping)
// Fact questions come from tables in the docs (import paths, file conventions, cacheLife profiles),
// and hand-written questions from questions-hand-*.mjs. tools/verify-questions.mjs re-runs every
// computed question independently.
//
// Usage: node tools/gen-questions.mjs && node tools/verify-questions.mjs && node tools/make-questions-js.mjs
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildApp, CHAPTERS, classifyBuildError, makeRandom, parseRoutes, ROOT, runNode } from "./q-lib.mjs";
import { addFacts } from "./questions-facts.mjs";
import { addHandwritten } from "./questions-handwritten.mjs";

const TARGET = 1000;
const R = makeRandom(20261106);
const questions = [];
const seen = new Set();

function addQ(q) {
  const key = q.question + "|" + [...q.options].sort().join("|");
  if (seen.has(key)) return false;
  if (!q.answer.length || q.answer.length === q.options.length) return false;
  if (new Set(q.options).size !== q.options.length || q.options.length < 4) return false;
  seen.add(key);
  const [number, title, file] = CHAPTERS[q.topic];
  if (q.explanation.length < 40) q.explanation += ` See ${/^\d/.test(number) ? "Chapter" : "Appendix"} ${number}, ${title}.`;
  questions.push({ id: 0, topic: q.topic, chapter: number, chapterFile: file, difficulty: q.difficulty, question: q.question,
    options: q.options, answer: q.answer, explanation: q.explanation, template: q.template, ...(q.run ? { run: q.run } : {}) });
  return true;
}
/** options: correct first, then wrong ones; shuffled here */
function single(base, correct, wrong) {
  const opts = R.shuffle([correct, ...[...new Set(wrong)].filter((w) => w !== correct).slice(0, 3)]);
  return { ...base, options: opts, answer: [opts.indexOf(correct)] };
}

// ================================================================ 1. route mapping (one real build)
const SEGMENTS = {
  plain: ["about", "books", "shop", "blog", "docs", "team", "help", "news", "reviews", "authors", "settings", "cart"],
  group: ["(marketing)", "(shop)", "(site)", "(admin)", "(auth)"],
  private: ["_components", "_lib", "_utils"],
  dynamic: ["[id]", "[slug]", "[user]"],
  catchall: ["[...slug]", "[...path]"],
  optional: ["[[...slug]]", "[[...rest]]"],
};
const routeFiles = new Map();   // file path -> { kind }
function addRouteFile(segs, file = "page.tsx") {
  const path = ["app", ...segs, file].join("/");
  if (!routeFiles.has(path)) routeFiles.set(path, true);
}
for (let i = 0; i < 1200; i++) {
  const n = 1 + Math.floor(R.rand() * 3);
  const segs = [];
  for (let j = 0; j < n; j++) {
    const kind = R.pick(["plain", "plain", "plain", "group", "dynamic", "private", "catchall", "optional"]);
    if ((kind === "catchall" || kind === "optional") && j !== n - 1) { segs.push(R.pick(SEGMENTS.plain)); continue; }
    segs.push(R.pick(SEGMENTS[kind]));
  }
  if (new Set(segs).size !== segs.length) continue;
  // a param name may appear only once per path
  const params = segs.filter((s) => s.startsWith("[")).map((s) => s.replace(/[[\].]/g, ""));
  if (new Set(params).size !== params.length) continue;
  addRouteFile(segs, R.rand() < 0.12 ? "layout.tsx" : R.rand() < 0.1 ? "route.ts" : "page.tsx");
}
// expected URL by the book's rules (checked against the real build below)
function urlOf(path) {
  const parts = path.split("/").slice(1, -1);
  const file = path.split("/").at(-1);
  if (file === "layout.tsx") return null;
  if (parts.some((p) => p.startsWith("_"))) return null;
  const url = "/" + parts.filter((p) => !(p.startsWith("(") && p.endsWith(")"))).join("/");
  return url === "/" ? "/" : url;
}
// drop files whose URLs would clash (two groups with the same URL, page + route on one URL, catch-all overlaps)
const byUrl = new Map();
for (const f of [...routeFiles.keys()]) {
  const u = urlOf(f);
  if (u === null) continue;
  const norm = u.replace(/\[\[?\.\.\.[^\]]+\]\]?|\[[^\]]+\]/g, "[x]");
  if (byUrl.has(norm)) { routeFiles.delete(f); continue; }
  byUrl.set(norm, f);
}
// Next.js rules: one dynamic name per position (no [id] next to [user]), nothing below a catch-all,
// and an optional catch-all [[...x]] also claims its parent URL
const N = (u) => u.replace(/\[\[?\.\.\.[^\]]+\]\]?|\[[^\]]+\]/g, "[x]");
const dynName = new Map();
for (const f of [...routeFiles.keys()]) {
  const parts = f.split("/").slice(1, -1).filter((p) => !(p.startsWith("(") && p.endsWith(")")));
  let prefix = "", bad = false;
  for (const p of parts) {
    if (p.startsWith("[")) {
      const key = prefix + "/[x]";
      if (dynName.has(key) && dynName.get(key) !== p) { bad = true; break; }
      dynName.set(key, p);
      prefix = key;
    } else prefix += "/" + p;
  }
  if (bad) routeFiles.delete(f);
}
for (const f of [...routeFiles.keys()]) {
  const u = urlOf(f);
  if (u && /\[\[\.\.\./.test(u)) {
    const parent = N(u.replace(/\/\[\[\.\.\.[^\]]+\]\]$/, "") || "/");
    for (const g of [...routeFiles.keys()]) { const v = urlOf(g); if (g !== f && v && N(v) === parent) routeFiles.delete(g); }
  }
  if (u && /\[\.\.\./.test(u)) {     // a catch-all claims every deeper URL too
    const base = N(u).replace(/\/\[x\]$/, "");
    for (const g of [...routeFiles.keys()]) { const v = urlOf(g); if (g !== f && v && N(v).startsWith(base + "/") && N(v) !== N(u)) routeFiles.delete(g); }
  }
}
const routeAppFiles = {};
let k = 0;
for (const f of routeFiles.keys()) {
  k++;
  if (f.endsWith("route.ts")) routeAppFiles[f] = `export async function GET() { return Response.json({ n: ${k} }); }\n`;
  else if (f.endsWith("layout.tsx")) routeAppFiles[f] = `export default function L({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }\n`;
  else {
    const dynamic = /\[/.test(f);
    routeAppFiles[f] = dynamic
      ? `import { Suspense } from "react";\nasync function P({ params }: { params: Promise<Record<string, unknown>> }) { return <p>{JSON.stringify(await params)}</p>; }\nexport default function Page(props: { params: Promise<Record<string, unknown>> }) { return <Suspense fallback={null}><P params={props.params} /></Suspense>; }\n`
      : `export default function Page() { return <p>page ${k}</p>; }\n`;
  }
}
console.log(`route app: ${routeFiles.size} files, building…`);
const routeBuild = buildApp("routes", routeAppFiles);
if (!routeBuild.ok) { console.log(routeBuild.out.slice(-3000)); throw new Error("route app failed to build"); }
const realRoutes = parseRoutes(routeBuild.out);
let routeQ = 0;
for (const f of routeFiles.keys()) {
  const expected = urlOf(f);
  const real = expected !== null && realRoutes[expected] ? expected : null;
  if (real !== expected) { console.log("route rule mismatch:", f, expected, "vs build"); continue; }
  const NOT = "It isn't a route";
  const correct = real ?? NOT;
  const parts = f.split("/").slice(1, -1);
  const wrong = [
    "/" + parts.join("/"),                                          // keeping groups and private folders
    "/" + parts.filter((p) => !p.startsWith("(")).map((p) => p.replace(/^_/, "")).join("/"),
    "/app/" + parts.filter((p) => !p.startsWith("(")).join("/"),
    "/" + parts.filter((p) => !p.startsWith("(")).map((p) => p.replace(/\[+\.*([^\]]+)\]+/, ":$1")).join("/"),
    "/" + (parts.at(-1) ?? "").replace(/[()_]/g, ""),
    "/" + parts.filter((p) => !p.startsWith("(")).join("-"),
    NOT,
  ].map((w) => w.replace(/\/+$/, "") || "/");
  const topic = /\[/.test(f) ? "linking" : "layouts";
  const why = real === null
    ? (f.endsWith("layout.tsx") ? "A layout wraps routes but doesn't make a URL public: only page or route files do." : "Folders starting with _ are private: Next.js never routes them or anything inside.")
    : `Folders are URL segments; route groups in parentheses are left out of the URL; ${/\[/.test(f) ? "bracket folders are dynamic segments that match any value" : "the page or route file makes the URL public"}. The real next build listed ${real}.`;
  if (addQ(single({ topic, difficulty: parts.length > 2 || /\(|_|\[\[/.test(f) ? "medium" : "easy", template: `${topic}-route`,
    question: `Which URL does this file serve?\n\n${f}`, explanation: why,
    run: { kind: "route", file: f, expect: correct } }, correct, wrong))) routeQ++;
}
console.log(`route questions: ${routeQ}`);

// ================================================================ 2. rendering symbols (two real builds)
const SYMBOL_VARIANTS = [
  ["serverclient", "A page that returns plain JSX", "export default function Page() {\n  return <h1>About us</h1>;\n}", "○"],
  ["caching", "A page that awaits a cached function", 'import { cacheLife } from "next/cache";\n\nasync function getBooks() {\n  "use cache";\n  cacheLife("hours");\n  await new Promise((r) => setTimeout(r, 50));\n  return ["Dune"];\n}\n\nexport default async function Page() {\n  return <p>{(await getBooks()).join()}</p>;\n}', "○"],
  ["caching", "A page that reads cookies inside Suspense", 'import { Suspense } from "react";\nimport { cookies } from "next/headers";\n\nasync function Theme() {\n  return <p>{(await cookies()).get("theme")?.value ?? "light"}</p>;\n}\n\nexport default function Page() {\n  return <><h1>Settings</h1><Suspense fallback={null}><Theme /></Suspense></>;\n}', "◐"],
  ["fetching", "A page that streams slow uncached data", 'import { Suspense } from "react";\n\nasync function Slow() {\n  await new Promise((r) => setTimeout(r, 50));\n  return <p>done</p>;\n}\n\nexport default function Page() {\n  return <Suspense fallback={<p>Loading…</p>}><Slow /></Suspense>;\n}', "◐"],
  ["linking", "A page that reads searchParams inside Suspense", 'import { Suspense } from "react";\n\nasync function Q({ sp }: { sp: Promise<{ q?: string }> }) {\n  return <p>{(await sp).q}</p>;\n}\n\nexport default function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {\n  return <Suspense fallback={null}><Q sp={searchParams} /></Suspense>;\n}', "◐"],
  ["caching", "A page that calls connection() inside Suspense", 'import { Suspense } from "react";\nimport { connection } from "next/server";\n\nasync function Id() {\n  await connection();\n  return <p>{crypto.randomUUID()}</p>;\n}\n\nexport default function Page() {\n  return <Suspense fallback={null}><Id /></Suspense>;\n}', "◐"],
  ["caching", 'A page whose cached component uses cacheLife("seconds"), inside Suspense', 'import { Suspense } from "react";\nimport { cacheLife } from "next/cache";\n\nasync function Score() {\n  "use cache";\n  cacheLife("seconds");\n  return <p>2–1</p>;\n}\n\nexport default function Page() {\n  return <Suspense fallback={null}><Score /></Suspense>;\n}', "◐"],
  ["serverclient", 'A "use client" page with a counter', '"use client";\nimport { useState } from "react";\n\nexport default function Page() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}', "○"],
  ["caching", "A page that reads a config file with readFileSync", 'import { readFileSync } from "node:fs";\n\nconst pkg = JSON.parse(readFileSync("package.json", "utf8"));\n\nexport default function Page() {\n  return <p>{pkg.name}</p>;\n}', "○"],
  ["routes", "A GET Route Handler that returns a constant", 'export async function GET() {\n  return Response.json({ name: "Reading List API" });\n}', "○", "route"],
  ["routes", "A GET Route Handler that reads the query string", 'export async function GET(request: Request) {\n  const q = new URL(request.url).searchParams.get("q");\n  return Response.json({ q });\n}', "ƒ", "route"],
  ["routes", "A Route Handler that only exports POST", 'export async function POST(request: Request) {\n  return Response.json(await request.json(), { status: 201 });\n}', "ƒ", "route"],
  ["routes", "A GET Route Handler that awaits a \"use cache\" helper", 'import { cacheLife } from "next/cache";\n\nasync function getGenres() {\n  "use cache";\n  cacheLife("days");\n  return ["fantasy", "sci-fi"];\n}\n\nexport async function GET() {\n  return Response.json(await getGenres());\n}', "○", "route"],
  ["routes", "A GET Route Handler that reads cookies()", 'import { cookies } from "next/headers";\n\nexport async function GET() {\n  return Response.json({ theme: (await cookies()).get("theme")?.value });\n}', "ƒ", "route"],
  ["routes", "A GET Route Handler that returns Math.random()", "export async function GET() {\n  return Response.json({ n: Math.random() });\n}", "ƒ", "route"],
  ["fetching", "A page with loading.tsx whose async page awaits slow uncached data", 'export default async function Page() {\n  await new Promise((r) => setTimeout(r, 50));\n  return <p>done</p>;\n}\n\n// app/<route>/loading.tsx: export default function Loading() { return <p>Loading…</p>; }', "◐", "page+loading"],
];
const symbolFiles = {};
SYMBOL_VARIANTS.forEach(([, , code, , kind], i) => {
  const base = `app/v${i}`;
  if (kind === "route") symbolFiles[`${base}/route.ts`] = code + "\n";
  else symbolFiles[`${base}/page.tsx`] = code.split("\n\n// app/")[0] + "\n";
  if (kind === "page+loading") symbolFiles[`${base}/loading.tsx`] = "export default function Loading() { return <p>Loading…</p>; }\n";
});
console.log("symbol app: building…");
const symBuild = buildApp("symbols", symbolFiles);
if (!symBuild.ok) { console.log(symBuild.out.slice(-3000)); throw new Error("symbol app failed to build"); }
const symRoutes = parseRoutes(symBuild.out);
const SYMBOL_TEXT = { "○": "○ Static: prerendered as static content", "◐": "◐ Partial Prerender: static shell with streamed dynamic content", "ƒ": "ƒ Dynamic: server-rendered on demand", "●": "● SSG: prerendered as static HTML (uses generateStaticParams)" };
const SYMBOL_WHY = {
  "○": "Nothing in it depends on the request or on uncached I/O (cached results and synchronous reads complete during prerendering), so it's fully prerendered.",
  "◐": "The static parts and the Suspense fallback form a prerendered shell; the part that needs request data, uncached I/O or a short-lived cache is streamed per request.",
  "ƒ": "It reads the request (or does something non-deterministic), so it runs on every request.",
};
let symQ = 0;
SYMBOL_VARIANTS.forEach(([topic, label, code, , kind], i) => {
  const real = symRoutes[`/v${i}`];
  if (!real) { console.log("no symbol for variant", i, label); return; }
  for (const dress of ["", "(file: route.ts)", "(in the Reading List app)"].slice(0, kind === "route" ? 2 : 2)) {
    const where = kind === "route" ? "app/api/example/route.ts" : "app/example/page.tsx";
    const q = single({ topic, difficulty: real === "○" && kind !== "route" ? "easy" : "medium", template: `${topic}-symbol`,
      question: `With Cache Components enabled, which symbol does next build show for this route? ${label}.${dress ? "" : ""}\n\n// ${where}\n${code}`,
      explanation: SYMBOL_WHY[real], run: { kind: "symbol", code, routeKind: kind ?? "page", expect: real } },
      SYMBOL_TEXT[real], Object.values(SYMBOL_TEXT));
    if (dress) q.question = q.question.replace("which symbol does next build show", "which symbol does the build's route table show");
    if (addQ(q)) symQ++;
  }
});
console.log(`symbol questions: ${symQ}`);

// ================================================================ 3. does it build? (one build each)
const BUILD_KINDS = {
  ok: "It builds successfully",
  "runtime-data": "Error: uncached or runtime data was accessed outside <Suspense>",
  unstable: "Error: an unstable value (current time or random) was used while prerendering",
  "client-only-api": "Error: a hook or API that is only available in Client Components",
  "segment-config": "Error: a route segment config option isn't compatible with cacheComponents",
  "non-serializable": "Error: a function or event handler can't be passed to a Client Component",
};
const BUILD_VARIANTS = [
  ["linking", 'export default async function Page({ params }: PageProps<"/books/[id]">) {\n  const { id } = await params;\n  return <h1>Book {id}</h1>;\n}', "app/books/[id]/page.tsx"],
  ["linking", 'export function generateStaticParams() {\n  return [{ id: "1" }];\n}\n\nexport default async function Page({ params }: PageProps<"/books/[id]">) {\n  const { id } = await params;\n  return <h1>Book {id}</h1>;\n}', "app/books/[id]/page.tsx"],
  ["linking", 'export const dynamicParams = false;\n\nexport function generateStaticParams() {\n  return [{ id: "1" }];\n}\n\nexport default async function Page({ params }: PageProps<"/books/[id]">) {\n  return <h1>Book {(await params).id}</h1>;\n}', "app/books/[id]/page.tsx"],
  ["caching", "export const revalidate = 60;\n\nexport default function Page() {\n  return <h1>News</h1>;\n}", "app/page.tsx"],
  ["caching", 'export const dynamic = "force-dynamic";\n\nexport default function Page() {\n  return <h1>News</h1>;\n}', "app/page.tsx"],
  ["caching", "export default function Page() {\n  return <p>Rendered at {Date.now()}</p>;\n}", "app/page.tsx"],
  ["caching", "export default function Page() {\n  return <p>Lucky number: {Math.floor(Math.random() * 100)}</p>;\n}", "app/page.tsx"],
  ["caching", 'import { cacheLife } from "next/cache";\n\nasync function Stamp() {\n  "use cache";\n  cacheLife("hours");\n  return <p>Built in {new Date().getFullYear()}</p>;\n}\n\nexport default function Page() {\n  return <Stamp />;\n}', "app/page.tsx"],
  ["fetching", "async function getBooks() {\n  await new Promise((r) => setTimeout(r, 100));\n  return [\"Dune\"];\n}\n\nexport default async function Page() {\n  const books = await getBooks();\n  return <p>{books.join()}</p>;\n}", "app/page.tsx"],
  ["fetching", 'import { Suspense } from "react";\n\nasync function Books() {\n  await new Promise((r) => setTimeout(r, 100));\n  return <p>Dune</p>;\n}\n\nexport default function Page() {\n  return <Suspense fallback={<p>Loading…</p>}><Books /></Suspense>;\n}', "app/page.tsx"],
  ["fetching", 'import { cookies } from "next/headers";\n\nexport default async function Page() {\n  const theme = (await cookies()).get("theme")?.value;\n  return <p>{theme}</p>;\n}', "app/page.tsx"],
  ["serverclient", 'import { useState } from "react";\n\nexport default function Page() {\n  const [n] = useState(0);\n  return <p>{n}</p>;\n}', "app/page.tsx"],
  ["serverclient", '"use client";\n\nimport { useState } from "react";\n\nexport default function Page() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}', "app/page.tsx"],
  ["serverclient", 'export default function Page() {\n  return <button onClick={() => console.log("hi")}>Say hi</button>;\n}', "app/page.tsx"],
  ["serverclient", 'import { useEffect } from "react";\n\nexport default function Page() {\n  useEffect(() => {}, []);\n  return <p>Hi</p>;\n}', "app/page.tsx"],
  ["errors", 'import { notFound } from "next/navigation";\n\nexport default function Page() {\n  notFound();\n}', "app/missing/page.tsx"],
  ["caching", 'import { Suspense } from "react";\nimport { connection } from "next/server";\n\nasync function Now() {\n  await connection();\n  return <p>{new Date().toISOString()}</p>;\n}\n\nexport default function Page() {\n  return <Suspense fallback={null}><Now /></Suspense>;\n}', "app/page.tsx"],
];
let buildQ = 0;
BUILD_VARIANTS.forEach(([topic, code, file], i) => {
  const r = buildApp(`build-${i}`, { [file]: code + "\n" });
  const kind = r.ok ? "ok" : classifyBuildError(r.out);
  if (!BUILD_KINDS[kind]) { console.log("unclassified build result", i, kind, r.out.slice(-600)); return; }
  const why = {
    ok: "Nothing here breaks the Cache Components rules: request and slow data (if any) are inside Suspense, cached, or known at build time.",
    "runtime-data": "Request data (params, cookies, searchParams) or slow uncached I/O was read outside a Suspense boundary, so no static shell could be prerendered.",
    unstable: "The current time or a random value was used during prerendering: call connection() first inside Suspense, cache it with \"use cache\", or render it on the client.",
    "client-only-api": "Hooks like useState and useEffect only work in Client Components: add \"use client\" or move them into a client file.",
    "segment-config": "Old route segment options (dynamicParams, revalidate, dynamic) are rejected with Cache Components; use cacheLife, notFound and Suspense instead.",
    "non-serializable": "A server-rendered element can't carry an event handler or function to the browser; interactive parts must be Client Components.",
  }[kind];
  const q = single({ topic, difficulty: kind === "ok" ? "medium" : "medium", template: `${topic}-builds`,
    question: `With Cache Components enabled (the create-next-app default), what happens when you run next build?\n\n// ${file}\n${code}`,
    explanation: why, run: { kind: "build", file, code, expect: kind } }, BUILD_KINDS[kind], R.shuffle(Object.values(BUILD_KINDS)));
  if (addQ(q)) buildQ++;
});
console.log(`build questions: ${buildQ}`);

// ================================================================ 4. output questions (Node)
const OUTPUT = [];   // [topic, difficulty, code, explanation]
const o = (topic, difficulty, code, explanation) => OUTPUT.push([topic, difficulty, code, explanation]);
// --- URLs, search params (linking, routes)
for (const [q, extra] of [["dune", ""], ["the hobbit", "&genre=fantasy"], ["Le Guin", "&genre=sci-fi&genre=fantasy"], ["", "&page=2"], ["a+b", "&genre=x"], ["100%", ""]]) {
  o("linking", "easy", `const url = new URL("/books?q=${encodeURIComponent(q)}${extra}", "http://localhost:3000");\nconsole.log(url.pathname, JSON.stringify(url.searchParams.get("q")), url.searchParams.getAll("genre").length);`,
    "URL parses the query string; get() returns the first value (decoded), getAll() every value.");
}
for (const pairs of [[["q", "dune"], ["sort", "title"]], [["genre", "sci-fi"], ["genre", "fantasy"]], [["q", "a b&c"]], [["page", "3"], ["q", "é"]]]) {
  o("linking", "medium", `const p = new URLSearchParams(${JSON.stringify(pairs)});\np.set("page", "1");\nconsole.log(p.toString());`,
    "URLSearchParams keeps insertion order, set() replaces all values of a key (or appends it), and toString() percent-encodes values (spaces become +).");
}
for (const name of ["Ada%20Lovelace", "J.R.R.%20Tolkien", "caf%C3%A9", "a%2Fb", "Le%20Guin%2C%20Ursula", "100%25"]) {
  o("linking", "easy", `const params = { name: "${name}" };          // what a dynamic segment receives\nconsole.log(decodeURIComponent(params.name));`,
    "Params arrive URL-encoded; decodeURIComponent turns %20 into a space and %C3%A9 into é.");
}
// --- Response / Request (routes)
for (const [body, init] of [[`{ ok: true }`, `{ status: 201 }`], [`{ error: "not found" }`, `{ status: 404 }`], [`[1, 2, 3]`, `{}`], [`{ title: "Dune" }`, `{ status: 200, headers: { "X-Book": "1" } }`]]) {
  o("routes", "medium", `const res = Response.json(${body}, ${init});\nconsole.log(res.status, res.headers.get("content-type"), await res.text());`,
    "Response.json serializes the body, sets Content-Type to application/json and uses status 200 unless init.status says otherwise.");
}
for (const [status, body] of [[204, "null"], [400, `"bad request"`], [302, "null"]]) {
  o("routes", "medium", `const res = new Response(${body}, { status: ${status} });\nconsole.log(res.status, res.ok, JSON.stringify(await res.text()));`,
    "res.ok is true only for statuses 200–299; a null body reads as an empty string.");
}
for (const json of [`{"title":"Dune","year":1965}`, `not json`, `{"title":""}`]) {
  o("routes", "hard", `const request = new Request("http://localhost/api/books", { method: "POST", body: ${JSON.stringify(json)} });\nconst body = await request.json().catch(() => null);\nconsole.log(body === null ? "invalid JSON" : typeof body.title === "string" && body.title.length > 0 ? "valid: " + body.title : "missing title");`,
    "request.json() rejects on invalid JSON (caught here and turned into null); a parsed body must still be validated.");
}
for (const [hdr, val] of [["user-agent", "book-client/1.0"], ["x-api-key", "demo"], ["Accept", "application/json"]]) {
  o("routes", "easy", `const request = new Request("http://localhost/api", { headers: { "${hdr}": "${val}" } });\nconsole.log(request.headers.get("${hdr.toLowerCase()}"), request.headers.get("missing"));`,
    "Header names are case-insensitive; get() returns null for a header that isn't there.");
}
// --- FormData (mutating, project)
for (const fields of [[["title", "Dune"], ["year", "1965"]], [["title", ""], ["tag", "a"], ["tag", "b"]], [["theme", "dark"]], [["tag", "x"], ["tag", "y"], ["tag", "z"]], [["q", "dune"], ["q", "hobbit"]], [["email", "ada@example.com"], ["password", "pw"]]]) {
  o("mutating", "medium", `const form = new FormData();\n${fields.map(([k, v]) => `form.append("${k}", "${v}");`).join("\n")}\nconsole.log(JSON.stringify(Object.fromEntries(form)), form.getAll("tag").length, form.get("missing"));`,
    "Server Actions receive FormData: Object.fromEntries keeps the last value per key, getAll returns every value, get returns null for missing keys.");
}
for (const v of ["1965", "19.5", "", "abc", " 42 ", "1e3", "-7"]) {
  o("mutating", "medium", `const form = new FormData();\nform.set("year", "${v}");\nconst year = Number(form.get("year"));\nconsole.log(year, Number.isInteger(year));`,
    "Form values are always strings (or files): Number(\"\") is 0, Number(\"abc\") is NaN; validate before trusting them.");
}
// --- Promises (fetching)
for (const [a, b] of [[300, 100], [100, 300], [200, 200]]) {
  o("fetching", "medium", `const log: string[] = [];\nconst wait = (ms: number, name: string) => new Promise((r) => setTimeout(() => { log.push(name); r(name); }, ms));\nconst result = await Promise.all([wait(${a}, "books"), wait(${b}, "reviews")]);\nconsole.log(log.join(" then "), "|", result.join(","));`,
    "Both promises start at once and finish in order of their delays, but Promise.all returns results in the order you passed them.");
}
for (const fail of ["reviews", "none"]) {
  o("fetching", "hard", `const ok = (v: string) => Promise.resolve(v);\nconst bad = (v: string) => Promise.reject(new Error(v + " failed"));\nconst results = await Promise.allSettled([ok("books"), ${fail === "reviews" ? 'bad("reviews")' : 'ok("reviews")'}]);\nconsole.log(results.map((r) => r.status).join(","));`,
    "Promise.allSettled never rejects: it reports each promise as fulfilled or rejected, which suits pages that can show partial results.");
}
o("fetching", "hard", `const order: string[] = [];\nasync function getUser() { order.push("user start"); await null; order.push("user end"); return 1; }\nasync function getOrders() { order.push("orders start"); await null; order.push("orders end"); return 2; }\nawait getUser(); await getOrders();\nconsole.log(order.join(", "));`, "Sequential awaits: the second request only starts after the first one finished.");
o("fetching", "hard", `const order: string[] = [];\nasync function getUser() { order.push("user start"); await null; order.push("user end"); return 1; }\nasync function getOrders() { order.push("orders start"); await null; order.push("orders end"); return 2; }\nawait Promise.all([getUser(), getOrders()]);\nconsole.log(order.join(", "));`, "Calling both functions before awaiting starts them together, so both 'start' entries come first.");
// --- the capstone's own logic (project)
const READING = `function readingStats(books: { read: boolean }[]) {\n  const read = books.filter((b) => b.read).length;\n  return { total: books.length, read, toRead: books.length - read, percent: books.length ? Math.round((read / books.length) * 100) : 0 };\n}`;
for (const arr of [[true, false, true], [false, false], [true], [], [true, true, false, false, false, true], [false, true], [true, true, true], [false, false, false, true], [true, false, false], [false, true, true, true, true], [true, false, true, false, true, false, true]]) {
  o("project", "easy", `${READING}\n\nconst s = readingStats(${JSON.stringify(arr.map((read) => ({ read })))});\nconsole.log(s.read, s.toRead, s.percent + "%");`, "readingStats counts read books and rounds the percentage; an empty list gives 0%.");
}
const ZOD = `import { z } from "zod";\n\nconst NewBook = z.object({\n  title: z.string().trim().min(1),\n  year: z.coerce.number().int().min(1450).max(2100),\n});`;
for (const input of [{ title: " Dune ", year: "1965" }, { title: "", year: "1965" }, { title: "Dune", year: "65000" }, { title: "Dune", year: "19.5" }, { title: "   ", year: "x" }, { title: "Beloved", year: "1449" }, { title: "Beloved", year: "2100" }, { title: "Kindred", year: " 1979 " }, { title: "", year: "" }, { year: "1965" }]) {
  o("project", "medium", `${ZOD}\n\nconst r = NewBook.safeParse(${JSON.stringify(input)});\nconsole.log(r.success ? JSON.stringify(r.data) : Object.keys(z.flattenError(r.error).fieldErrors).sort().join(","));`,
    "trim() runs before min(1), coerce turns the string into a number before int/min/max; flattenError lists the failing fields.");
}
// --- sessions (envauth)
o("envauth", "hard", `import { SignJWT, jwtVerify } from "jose";\nconst key = new TextEncoder().encode("a-very-long-demo-secret-for-signing-0123");\nconst token = await new SignJWT({ userId: "u1", role: "admin" }).setProtectedHeader({ alg: "HS256" }).sign(key);\nconst { payload } = await jwtVerify(token, key);\nconsole.log(token.split(".").length, payload.userId, payload.role);`, "A JWT has three dot-separated parts (header, payload, signature); jwtVerify checks the signature and returns the payload.");
o("envauth", "hard", `import { SignJWT, jwtVerify } from "jose";\nconst key = new TextEncoder().encode("a-very-long-demo-secret-for-signing-0123");\nconst other = new TextEncoder().encode("another-secret-another-secret-0123456789");\nconst token = await new SignJWT({ role: "reader" }).setProtectedHeader({ alg: "HS256" }).sign(key);\nconsole.log(await jwtVerify(token, other).then(() => "accepted", () => "rejected"));`, "A token signed with a different key fails verification: that's why a user can't forge their own session.");
o("envauth", "hard", `import { SignJWT, jwtVerify } from "jose";\nconst key = new TextEncoder().encode("a-very-long-demo-secret-for-signing-0123");\nconst token = await new SignJWT({ role: "reader" }).setProtectedHeader({ alg: "HS256" }).sign(key);\nconst [h, , s] = token.split(".");\nconst forged = [h, Buffer.from(JSON.stringify({ role: "admin" })).toString("base64url"), s].join(".");\nconsole.log(await jwtVerify(forged, key).then(() => "accepted", () => "rejected"));`, "Changing the payload invalidates the signature, so the edited 'admin' token is rejected.");
o("envauth", "medium", `import { scryptSync, timingSafeEqual } from "node:crypto";\nconst salt = "abc123";\nconst stored = scryptSync("correct horse", salt, 32);\nconst check = (pw: string) => timingSafeEqual(scryptSync(pw, salt, 32), stored);\nconsole.log(check("correct horse"), check("Correct horse"), stored.length);`, "scrypt derives the same 32 bytes for the same password and salt; any other password gives different bytes.");
// --- misc JS used in the book (react, errors)
o("react", "easy", `const books = [{ id: 2, title: "Dune" }, { id: 1, title: "Beloved" }];\nconst sorted = books.toSorted((a, b) => a.title.localeCompare(b.title));\nconsole.log(sorted.map((b) => b.title).join(", "), "|", books[0].title);`, "toSorted returns a new array and leaves the original unchanged, the way React state must be treated.");
o("react", "medium", `const state = { books: ["Dune"] };\nconst next = { ...state, books: [...state.books, "Beloved"] };\nconsole.log(state.books.length, next.books.length, state === next, state.books === next.books);`, "Spreading creates new objects and arrays, so React sees a change; the old state is untouched.");
o("react", "medium", `const items = [] as string[];\nconst rendered = items.length && "has items";\nconsole.log(JSON.stringify(rendered));`, "0 && … evaluates to 0, which React renders as the text 0: compare with > 0 instead.");
o("errors", "medium", `try {\n  JSON.parse("{ not json");\n} catch (e) {\n  console.log(e instanceof SyntaxError, (e as Error).name);\n}`, "JSON.parse throws a SyntaxError for invalid input; event handler code must catch such errors itself.");
o("errors", "hard", `type Result<T> = { ok: true; value: T } | { ok: false; error: string };\nfunction parseYear(s: string): Result<number> {\n  const y = Number(s);\n  return Number.isInteger(y) ? { ok: true, value: y } : { ok: false, error: "not a year" };\n}\nconsole.log(["1965", "x", "2001"].map(parseYear).filter((r) => r.ok).length);`, "Expected errors returned as values: two of the three inputs parse.");

const outputs = runNode(OUTPUT.map((x) => x[2]));
let outQ = 0;
OUTPUT.forEach(([topic, difficulty, code, explanation], i) => {
  const r = outputs[i];
  if (!r.ok) { console.log("output snippet failed", i, r.err.slice(0, 300)); return; }
  const shown = r.out.split("\n").join(" / ");
  if (addQ(single({ topic, difficulty, template: `${topic}-output`, question: `What does this print?\n\n${code}`, explanation,
    run: { kind: "output", code, expect: shown } }, shown, perturb(shown)))) outQ++;
});
console.log(`output questions: ${outQ}`);

function perturb(s) {
  const out = [];
  const nums = s.match(/-?\d+(\.\d+)?/g) ?? [];
  if (nums.length) { out.push(s.replace(nums[0], String(Number(nums[0]) + 1))); out.push(s.replace(nums.at(-1), String(Number(nums.at(-1)) * 2 || 1))); }
  if (/true/.test(s)) out.push(s.replace("true", "false"));
  if (/false/.test(s)) out.push(s.replace("false", "true"));
  if (/accepted/.test(s)) out.push(s.replace("accepted", "rejected"));
  if (/rejected/.test(s)) out.push(s.replace("rejected", "accepted"));
  if (/then/.test(s)) out.push(s.split(" | ")[0].split(" then ").reverse().join(" then ") + (s.includes(" | ") ? " | " + s.split(" | ")[1] : ""));
  if (/null/.test(s)) out.push(s.replace("null", "undefined"));
  if (/"/.test(s)) out.push(s.replaceAll('"', ""));
  out.push("throws an error");
  out.push(s.toUpperCase() !== s ? s.toUpperCase() : s + "!");
  return out.filter((x) => x !== s);
}

// ================================================================ 5. facts + hand-written
const before = questions.length;
addFacts((q) => {
  const opts = R.shuffle(q.options.map((o, i) => [o.replace(/^\*/, ""), o.startsWith("*")]));
  addQ({ ...q, options: opts.map((x) => x[0]), answer: opts.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) });
}, R);
console.log(`fact questions: ${questions.length - before}`);
const handStart = questions.length;
addHandwritten((topic, difficulty, question, options, explanation) => {
  const opts = R.shuffle(options.map((o) => [o.replace(/^\*/, ""), o.startsWith("*")]));
  const ok = addQ({ topic, difficulty, question, options: opts.map((x) => x[0]), answer: opts.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), explanation, template: `${topic}-hand-${difficulty}` });
  if (!ok) console.log("hand-written question rejected:", question.slice(0, 70));
});
console.log(`hand-written: ${questions.length - handStart}`);

// ================================================================ trim to TARGET and write
const countBy = (key) => questions.reduce((m, q) => ((m[q[key]] = (m[q[key]] || 0) + 1), m), {});
while (questions.length > TARGET) {
  const byTopic = countBy("topic");
  const biggest = Object.keys(byTopic).sort((a, b) => byTopic[b] - byTopic[a])[0];
  const i = questions.findLastIndex((q) => q.topic === biggest && q.run);
  const j = i >= 0 ? i : questions.findLastIndex((q) => q.topic === biggest);
  questions.splice(j, 1);
}
const order = Object.keys(CHAPTERS);
questions.sort((a, b) => order.indexOf(a.topic) - order.indexOf(b.topic));
questions.forEach((q, i) => { q.id = i + 1; });
writeFileSync(join(ROOT, "questions.json"), JSON.stringify({
  version: 1, topic: "Next.js (Beginner)", generated: "2026-11-06", total: questions.length,
  chapters: Object.fromEntries(Object.entries(CHAPTERS).map(([key, [number, title, file]]) => [key, { number, title, file }])), questions,
}, null, 1) + "\n");
const multi = questions.filter((q) => q.answer.length > 1).length;
console.log(`total ${questions.length} | multi-answer ${multi} | difficulty ${JSON.stringify(countBy("difficulty"))}`);
console.log("per topic:", Object.entries(countBy("topic")).map(([key, v]) => `${key} ${v}`).join(", "));
console.log("computed:", questions.filter((q) => q.run).length);
if (questions.length < TARGET) console.log(`⚠ only ${questions.length} questions: add more hand-written ones`);
