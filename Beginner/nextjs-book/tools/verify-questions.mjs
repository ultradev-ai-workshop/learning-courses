// Independently re-checks every computed question in questions.json:
//   route   → all route files are written into a fresh app, built, and each URL looked up in the route table
//   symbol  → all variants are written into a fresh app, built, and each symbol read from the table
//   build   → each variant is built on its own and the result classified again
//   output  → each snippet runs again with Node
// and checks that the stored answer is the option matching the fresh result.
// Usage: node tools/verify-questions.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildApp, classifyBuildError, parseRoutes, ROOT, runNode } from "./q-lib.mjs";

const data = JSON.parse(readFileSync(join(ROOT, "questions.json"), "utf8"));
const qs = data.questions.filter((q) => q.run);
let ok = 0, bad = 0;
const fail = (q, msg) => { bad++; console.log(`✘ #${q.id} (${q.run.kind}) ${msg}`); };
const answerText = (q) => q.options[q.answer[0]];

// route
const routeQs = qs.filter((q) => q.run.kind === "route");
if (routeQs.length) {
  const files = {};
  for (const q of routeQs) {
    const f = q.run.file;
    files[f] = f.endsWith("route.ts") ? "export async function GET() { return Response.json({}); }\n"
      : f.endsWith("layout.tsx") ? "export default function L({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }\n"
      : /\[/.test(f) ? 'import { Suspense } from "react";\nasync function P({ params }: { params: Promise<Record<string, unknown>> }) { return <p>{JSON.stringify(await params)}</p>; }\nexport default function Page(props: { params: Promise<Record<string, unknown>> }) { return <Suspense fallback={null}><P params={props.params} /></Suspense>; }\n'
      : "export default function Page() { return <p>page</p>; }\n";
  }
  const r = buildApp("verify-routes", files);
  if (!r.ok) { console.log(r.out.slice(-2000)); process.exit(1); }
  const routes = parseRoutes(r.out);
  for (const q of routeQs) {
    const expect = q.run.expect;
    const isRoute = expect !== "It isn't a route";
    if (isRoute !== Boolean(routes[expect])) fail(q, `${q.run.file}: build says ${isRoute ? "missing" : "present"}`);
    else if (answerText(q) !== expect) fail(q, "stored answer doesn't match");
    else ok++;
  }
}

// symbol
const symQs = qs.filter((q) => q.run.kind === "symbol");
if (symQs.length) {
  const files = {}, where = new Map();
  [...new Set(symQs.map((q) => q.run.code + "\u0000" + q.run.routeKind))].forEach((key, i) => {
    const [code, kind] = key.split("\u0000");
    if (kind === "route") files[`app/v${i}/route.ts`] = code + "\n";
    else files[`app/v${i}/page.tsx`] = code.split("\n\n// app/")[0] + "\n";
    if (kind === "page+loading") files[`app/v${i}/loading.tsx`] = "export default function Loading() { return <p>Loading…</p>; }\n";
    where.set(key, `/v${i}`);
  });
  const r = buildApp("verify-symbols", files);
  if (!r.ok) { console.log(r.out.slice(-2000)); process.exit(1); }
  const routes = parseRoutes(r.out);
  for (const q of symQs) {
    const real = routes[where.get(q.run.code + "\u0000" + q.run.routeKind)];
    if (real !== q.run.expect) fail(q, `symbol is ${real}, stored ${q.run.expect}`);
    else if (!answerText(q).startsWith(real)) fail(q, "stored answer doesn't match");
    else ok++;
  }
}

// build
for (const q of qs.filter((x) => x.run.kind === "build")) {
  const r = buildApp(`verify-build-${q.id}`, { [q.run.file]: q.run.code + "\n" });
  const kind = r.ok ? "ok" : classifyBuildError(r.out);
  if (kind !== q.run.expect) fail(q, `build result is ${kind}, stored ${q.run.expect}`);
  else ok++;
}

// output
const outQs = qs.filter((q) => q.run.kind === "output");
const outs = runNode(outQs.map((q) => q.run.code));
outQs.forEach((q, i) => {
  const shown = outs[i].out.split("\n").join(" / ");
  if (!outs[i].ok) fail(q, "snippet failed: " + outs[i].err.slice(0, 200));
  else if (shown !== q.run.expect || answerText(q) !== shown) fail(q, `prints ${JSON.stringify(shown)}, stored ${JSON.stringify(q.run.expect)}`);
  else ok++;
});

const hand = data.questions.length - qs.length;
console.log(`verified ${ok}/${qs.length} computed questions${bad ? `, ${bad} FAILED` : ""} (${hand} hand-written/fact questions not executable)`);
process.exit(bad ? 1 : 0);
