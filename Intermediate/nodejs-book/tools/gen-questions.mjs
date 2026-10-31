// Generates questions.json for the Node.js Study Book.
//
// Every code question's answer is computed by RUNNING the snippet in a fresh Node process (tools/qlib.mjs):
// module systems, exit codes, event-loop order, permissions and TypeScript stripping are real behaviour.
// Distractors come from running deliberately "wrong" variants (CJS instead of ESM, on instead of once,
// without await…) plus plausible perturbations. Each question stores its run spec, so
// tools/verify-questions.mjs can re-run everything independently.
//
// Usage (Node 26+):  node tools/gen-questions.mjs && node tools/make-questions-js.mjs
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { addHandwritten } from "./questions-handwritten.mjs";
import { applyDisplay, mulberry32, run, runAll } from "./qlib.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = join(ROOT, "playground", "reference", "src");
const TARGET = 1000;
const SHARE = { easy: 0.4, medium: 0.45, hard: 0.15 };

export const CHAPTERS = {
  intro: ["1", "Introduction to Node.js", "01-intro.html"],
  cli: ["2", "The Command Line: Run, REPL, Input & Output", "02-cli.html"],
  modules: ["3", "Modules: CommonJS & ES Modules", "03-modules.html"],
  npm: ["4", "npm, Packages & Versions", "04-npm.html"],
  callbacks: ["5", "Callbacks & Asynchronous Flow Control", "05-callbacks.html"],
  promises: ["6", "Promises & async/await in Node", "06-promises.html"],
  loop: ["7", "Timers & the Event Loop", "07-event-loop.html"],
  events: ["8", "The Event Emitter", "08-events.html"],
  files: ["9", "Working with Files & Folders", "09-files.html"],
  streams: ["10", "Buffers & Streams", "10-streams.html"],
  http: ["11", "Building HTTP Servers", "11-http.html"],
  fetch: ["12", "fetch, HTTP Clients & WebSockets", "12-fetch.html"],
  concurrency: ["13", "Don't Block the Event Loop: Workers & Processes", "13-concurrency.html"],
  testing: ["14", "Testing with node:test", "14-testing.html"],
  production: ["15", "Debugging, Security & Production", "15-production.html"],
  project: ["16", "Project: Notes API Server", "16-project.html"],
  typescript: ["A", "TypeScript in Node.js", "appendix-typescript.html"],
  migrations: ["B", "From the Browser & Userland Libraries", "appendix-migrations.html"],
};

// ---------------------------------------------------------------- seeded random
const rand = mulberry32(20261031);
const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const chance = (p) => rand() < p;
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (arr, k) => shuffle(arr).slice(0, k);
const uniq = (arr) => [...new Set(arr)];
const js = (v) => JSON.stringify(v);

// ---------------------------------------------------------------- question store
const questions = [];
const seen = new Set();
const perTemplate = {};

function finalize(q) {
  const correct = uniq(q.correct.map(String)).filter((x) => x !== "");
  const clean = (list) => uniq(list.map(String)).filter((w) => w !== "" && !correct.includes(w) && !(q.template && /^timeout$| \/ timeout$/.test(w)));
  const wrong = clean(q.wrong);
  const fallback = clean(q.fallback ?? []).filter((w) => !wrong.includes(w));
  let options;
  if (q.exact) options = shuffle([...correct, ...wrong]);
  else {
    const n = correct.length > 1 ? Math.min(6, Math.max(4, correct.length + 2)) : 4;
    const pool = [...shuffle(wrong), ...shuffle(fallback)];          // meaningful distractors first
    if (pool.length < n - correct.length) return null;
    options = shuffle([...correct, ...pool.slice(0, n - correct.length)]);
  }
  if (!correct.length || options.length < 4 || options.length > 6) return null;
  const [number, , file] = CHAPTERS[q.topic];
  const out = { id: 0, topic: q.topic, chapter: number, chapterFile: file, difficulty: q.difficulty, question: q.question };
  const shown = q.hideCode ? null : q.displayCode ?? q.code;
  if (shown) out.code = shown;
  out.options = options;
  out.answer = options.map((o, i) => (correct.includes(o) ? i : -1)).filter((i) => i >= 0);
  out.explanation = q.explanation;
  if (q.template) out.template = q.template;
  if (q.runSpec) out.run = { ...q.runSpec, ...(q.displayRule && { display: q.displayRule }) };   // for the verifier
  if (q.optionSpecs) out.optionRuns = options.map((o) => q.optionSpecs[o] ?? null);
  return out;
}
function add(q) {
  const out = finalize(q);
  if (!out) return false;
  const key = out.question + "|" + (out.code || "") + "|" + [...out.options].sort().join("|");
  if (seen.has(key)) return false;
  seen.add(key);
  questions.push(out);
  return true;
}
function h(topic, difficulty, question, options, explanation, code) {
  const correct = options.filter((o) => o.startsWith("*")).map((o) => o.slice(1));
  const wrong = options.filter((o) => !o.startsWith("*"));
  if (!add({ topic, difficulty, question, code, correct, wrong, explanation, exact: true })) throw new Error("bad hand-written: " + question);
}

// Plausible wrong orders: swap two neighbouring parts of a " / "-separated output.
function orderSwaps(s) {
  const parts = s.split(" / ");
  const outs = [];
  for (let i = 0; i + 1 < parts.length; i++) {
    const p = parts.slice();
    [p[i], p[i + 1]] = [p[i + 1], p[i]];
    outs.push(p.join(" / "));
  }
  return outs.filter((x) => x !== s);
}
function perturb(s) {
  const outs = [];
  const m = s.match(/-?\d+(\.\d+)?/);
  if (m) { const n = Number(m[0]); outs.push(s.replace(m[0], String(n + 1)), s.replace(m[0], String(n - 1))); }
  outs.push("undefined", "throws TypeError", s.includes("true") ? s.replace("true", "false") : s.replace("false", "true"));
  const parts = s.split(" / ");
  if (parts.length > 1) outs.push([...parts].reverse().join(" / "), parts.slice(1).join(" / "), parts[0]);
  return outs.filter((x) => x !== s);
}

// ---------------------------------------------------------------- templates
const TEMPLATES = [];
const template = (id, topic, quota, gen) => TEMPLATES.push({ id, topic, quota, gen });

// A spec with `code` and no `correct` gets its answer by running; `variants` (run specs) give distractors.
// A spec with `items` (select-all) runs each item's check spec; output "true" means "correct".
async function evaluate(spec) {
  if (spec.items) {
    const outs = await runAll(spec.items.map((it) => it.check));
    if (outs.some((o) => o !== "true" && o !== "false")) return null;
    const correct = spec.items.filter((_, i) => outs[i] === "true").map((it) => it.label);
    const wrong = spec.items.filter((_, i) => outs[i] === "false").map((it) => it.label);
    if (!correct.length || !wrong.length) return null;
    return { ...spec, exact: true, correct, wrong, optionSpecs: Object.fromEntries(spec.items.map((it) => [it.label, it.check])) };
  }
  if (spec.code !== undefined && !spec.correct) {
    const runSpec = { code: spec.code, ...spec.run };
    const [answer, ...variantOuts] = await runAll([runSpec, ...(spec.variants ?? []).map((v) => ({ ...runSpec, ...v }))]);
    if (!answer || /timeout/.test(answer)) return null;
    const show = (o) => applyDisplay(spec.displayRule, o);
    const display = show(answer);
    return { ...spec, runSpec, correct: [display],
      wrong: [...variantOuts.map(show), ...(spec.wrongFrom?.(display) ?? []), ...orderSwaps(display), ...(spec.wrong ?? [])],
      fallback: perturb(display) };
  }
  return spec;
}

async function runTemplate(t, quota) {
  let made = 0, fails = 0;
  while (made < quota && fails < 40) {
    const batch = await Promise.all(Array.from({ length: Math.min(6, quota - made + 2) }, async () => {
      const spec = await t.gen();
      return spec ? evaluate(spec) : null;
    }));
    for (const q of batch) {
      if (made >= quota) break;
      if (q && add({ ...q, topic: t.topic, template: t.id })) { made++; fails = 0; } else fails++;
    }
  }
  perTemplate[t.id] = (perTemplate[t.id] ?? 0) + made;
  return made;
}

// ================================================================ 1 intro
template("intro-globals", "intro", 20, () => {
  const ext = pick(["mjs", "cjs"]);
  const exprs = sample(["typeof window", "typeof document", "typeof process", "typeof globalThis", "typeof fetch", "typeof require", "typeof module", "typeof __dirname", "typeof setImmediate", "typeof structuredClone", "typeof Buffer", "typeof localStorage"], ri(2, 3));
  const code = `console.log(${exprs.join(", ")});`;
  return { difficulty: exprs.some((e) => /require|module|__dirname/.test(e)) ? "medium" : "easy",
    question: `What does this print when saved as main.${ext} and run with node?`, code, run: { ext }, variants: [{ ext: ext === "mjs" ? "cjs" : "mjs" }],
    wrong: [exprs.map(() => "object").join(" "), exprs.map(() => "undefined").join(" "), exprs.map(() => "function").join(" ")],
    explanation: "Node has no window/document/localStorage. require, module and __dirname exist only in CommonJS (.cjs); ES modules use import and import.meta instead." };
});
template("intro-lts", "intro", 12, () => {
  const majors = sample([18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], 5);
  const yes = majors.filter((m) => m % 2 === 0).map(String), no = majors.filter((m) => m % 2 === 1).map(String);
  if (!yes.length || !no.length) return null;
  return { difficulty: "easy", exact: true, question: "Which of these Node major versions become (or became) LTS releases? (select all that apply)", correct: yes.map((v) => `Node ${v}`), wrong: no.map((v) => `Node ${v}`),
    explanation: "Even-numbered majors are promoted to LTS in October of their release year; odd-numbered majors are Current-only." };
});
template("intro-busy", "intro", 26, () => {
  const d = ri(1, 5) * 10, block = d + ri(2, 5) * 10;
  const code = `const start = Date.now();\nsetTimeout(() => console.log("timer"), ${d});\nconsole.log("A");\nwhile (Date.now() - start < ${block}) {}\nconsole.log("B");`;
  return { difficulty: "easy", question: "In what order are the lines printed?", code, wrong: ["A / timer / B", "timer / A / B", "A / B"],
    explanation: `The timer is due after ${d} ms, but its callback can only run when the thread is free — after the ${block} ms busy loop and the last synchronous line.` };
});
const LAYERS = [["parses, compiles and runs JavaScript", "V8"], ["provides the event loop", "libuv"], ["runs file system operations on a thread pool", "libuv"],
  ["manages JavaScript memory with a garbage collector", "V8"], ["exposes APIs like fs, http and events to your code", "the core modules"], ["compiles hot functions to optimised machine code", "V8"],
  ["handles asynchronous network I/O with the operating system", "libuv"], ["is the same component Chrome uses to run JavaScript", "V8"]];
template("intro-layer", "intro", 18, () => {
  const [task, layer] = pick(LAYERS);
  return { difficulty: "medium", question: `Which part of Node.js ${task}?`, correct: [layer], wrong: ["V8", "libuv", "the core modules", "npm", "the browser"].filter((x) => x !== layer),
    explanation: "V8 runs JavaScript (JIT, GC); libuv provides the event loop, async I/O and the thread pool; core modules are the API layer." };
});

// ================================================================ 2 cli
template("cli-argv", "cli", 18, () => {
  const args = sample(["--fast", "-v", "orders.csv", "3", "Ana", "--limit=5"], ri(1, 3));
  const exprs = [["process.argv.length", "medium"], ["process.argv[2]", "easy"], ["process.argv.slice(2).join(\",\")", "easy"], ["typeof process.argv[2]", "easy"], ["process.argv[3] ?? \"none\"", "medium"], ["process.argv.at(-1)", "medium"]];
  const [e, diff] = pick(exprs);
  return { difficulty: diff, question: `You run: node main.mjs ${args.join(" ")} — what does this print?`, code: `console.log(${e});`, run: { args },
    wrong: [String(args.length), String(args.length + 1), "main.mjs", "node", "number", "undefined", args[0]],
    explanation: "process.argv[0] is the node executable, [1] the script path, and user arguments (always strings) start at index 2." };
});
template("cli-parseargs", "cli", 20, () => {
  const n = ri(2, 9);
  const forms = [[["-l", String(n), "data.csv"], "values.limit, positionals"], [["--limit", String(n)], "values.limit, values.verbose"], [["-v", "--limit=" + n], "values.verbose, Number(values.limit) + 1"],
    [["x.csv", "y.csv"], "positionals.length, values.limit"], [["-v", "-l", String(n), "z"], "Object.keys(values).sort().join(\"+\"), positionals[0]"]];
  const [args, show] = pick(forms);
  const code = `import { parseArgs } from "node:util";\nconst { values, positionals } = parseArgs({\n  options: {\n    limit: { type: "string", short: "l", default: "10" },\n    verbose: { type: "boolean", short: "v", default: false },\n  },\n  allowPositionals: true,\n});\nconsole.log(${show});`;
  return { difficulty: "medium", question: `You run: node main.mjs ${args.join(" ")} — what does this print?`, code, run: { args },
    wrong: ["10 []", `${n} []`, "false 10", "undefined", "true 11"],
    explanation: "parseArgs returns string values for type \"string\" (no conversion), applies defaults, maps short aliases, and collects the rest in positionals." };
});
template("cli-env", "cli", 16, () => {
  const port = String(ri(3001, 9999));
  const forms = [[`const port = Number(process.env.PORT ?? 3000);\nconsole.log(port + 1);`, { PORT: port }], [`const port = Number(process.env.PORT ?? 3000);\nconsole.log(port + 1);`, {}],
    [`console.log(process.env.PORT + 1);`, { PORT: port }], [`console.log(process.env.DEBUG === "true", Boolean(process.env.DEBUG));`, { DEBUG: "false" }],
    [`console.log(typeof process.env.MISSING, process.env.MISSING ?? "default");`, {}], [`console.log(process.env.NAME || "anonymous");`, { NAME: "" }]];
  const [code, env] = pick(forms);
  const envText = Object.keys(env).length ? Object.entries(env).map(([k, v]) => `${k}=${js(v)}`).join(" ") : "(no extra variables)";
  return { difficulty: /DEBUG|PORT \+ 1/.test(code) ? "medium" : "easy", question: `The environment contains ${envText}. What does this print?`, code, run: { env },
    wrong: [String(Number(port) + 1), "3001", `${port}1`, "false false", "true true", "undefined default", "anonymous", ""],
    explanation: "Environment variables are strings or undefined: \"false\" is truthy, + concatenates strings, and ?? only replaces undefined/null while || also replaces \"\"." };
});
template("cli-streams", "cli", 14, () => {
  const lines = sample([["log", "result"], ["error", "warning"], ["info", "info line"], ["warn", "careful"], ["error", "failed"], ["log", "data"]], 3);
  const code = lines.map(([m, t]) => `console.${m}(${js(t)});`).join("\n");
  const stdout = lines.filter(([m]) => m === "log" || m === "info").map(([, t]) => t);
  const all = lines.map(([, t]) => t);
  return { difficulty: "medium", question: "You run `node main.mjs > out.txt`. What ends up in out.txt?", code, displayRule: "empty",
    wrong: [all.join(" / "), lines.filter(([m]) => m === "error" || m === "warn").map(([, t]) => t).join(" / ") || "(nothing)", "(nothing)", all[0], stdout.length ? "(nothing)" : all[0]],
    explanation: "console.log/info write to stdout (redirected by >); console.error/warn write to stderr, which still goes to the terminal." };
});
template("cli-exit", "cli", 18, () => {
  const n = ri(2, 9);
  const forms = [[`process.exitCode = ${n};\nconsole.log("done");`, "medium"], [`console.log("start");\nthrow new Error("boom");`, "easy"], [`process.exitCode = ${n};\nprocess.exit();`, "medium"],
    [`setTimeout(() => console.log("later"), 10);\nprocess.exit(${n});`, "hard"], [`Promise.reject(new Error("x"));\nconsole.log("sync end");`, "medium"], [`console.log("ok");`, "easy"],
    [`try { JSON.parse("{"); } catch { process.exitCode = ${n}; }\nconsole.log("handled");`, "medium"]];
  const [code, diff] = pick(forms);
  return { difficulty: diff, question: "What does this print, and with which exit code does the process end?", code, run: { showExit: true }, displayRule: "stderr",
    wrongFrom: (a) => [0, 1, n].map((c) => a.replace(/exit \d+$/, `exit ${c}`)).concat(a.includes("(error on stderr)") ? [a.replace(" / (error on stderr)", "")] : [a.replace(/ \/ exit/, " / (error on stderr) / exit")]),
    explanation: "Uncaught exceptions and unhandled rejections exit with 1; process.exitCode sets the code for a normal exit; process.exit() ends immediately (pending timers never run)." };
});
template("cli-inspect", "cli", 10, () => {
  const depth = ri(3, 5);
  let obj = "\"deep\""; for (let i = depth; i > 0; i--) obj = `{ l${i}: ${obj} }`;
  const how = pick(["console.log(o);", "console.log(JSON.stringify(o));", "console.log(util.inspect(o, { depth: 0 }));"]);
  return { difficulty: "hard", question: "What does this print?", code: `import util from "node:util";\nconst o = ${obj};\n${how}`, wrong: ["[Object]", "{ l1: [Object] }", "{ l1: { l2: [Object] } }", "{}"],
    explanation: "console.log inspects objects to depth 2, printing deeper levels as [Object]; util.inspect's depth option controls it; JSON.stringify always prints everything." };
});
template("cli-stdin", "cli", 10, () => {
  const nums = Array.from({ length: ri(3, 5) }, () => ri(1, 20));
  const input = nums.join(pick([" ", "\n", "  "])) + "\n";
  const forms = ["let text = \"\";\nfor await (const chunk of process.stdin) text += chunk;\nconst n = text.split(/\\s+/).filter(Boolean).map(Number);\nconsole.log(n.length, n.reduce((a, b) => a + b, 0));",
    "import { createInterface } from \"node:readline\";\nlet lines = 0;\nfor await (const line of createInterface({ input: process.stdin })) lines++;\nconsole.log(lines);"];
  const code = pick(forms);
  return { difficulty: "medium", question: `The input ${js(input)} is piped to this script. What does it print?`, code, run: { stdin: input }, wrong: [String(nums.length), "1", "0", `${nums.length} 0`],
    explanation: "process.stdin is an async iterable of chunks; readline splits it into lines. Splitting on /\\s+/ handles any whitespace." };
});

// ================================================================ 3 modules
template("mod-system", "modules", 20, () => {
  const ext = pick([".js", ".mjs", ".cjs"]);
  const type = pick(["module", "commonjs", null]);
  const syntax = pick(["esm", "cjs", "plain"]);
  const sample_ = { esm: 'export const x = 1;\nconsole.log(typeof require === "undefined" ? "ESM" : "CJS");', cjs: 'module.exports = 1;\nconsole.log(typeof require === "undefined" ? "ESM" : "CJS");', plain: 'console.log(typeof require === "undefined" ? "ESM" : "CJS");' }[syntax];
  const files = { [`app${ext}`]: sample_, ...(type ? { "package.json": js({ type }) } : {}) };
  const code = `import { spawnSync } from "node:child_process";\nconst r = spawnSync(process.execPath, ["app${ext}"], { encoding: "utf8" });\nconsole.log(r.stdout.trim() || (r.stderr.match(/(\\w+Error)/)?.[1] ?? "error"));`;
  return { difficulty: ext === ".js" ? (type ? "medium" : "hard") : "easy",
    question: `A folder contains app${ext} with the code below${type ? ` and a package.json with "type": "${type}"` : " and no package.json"}. Running \`node app${ext}\` prints…`,
    displayCode: sample_, code, run: { files }, wrong: ["ESM", "CJS", "SyntaxError", "ReferenceError", "TypeError"],
    explanation: ".mjs is always ESM and .cjs always CommonJS. A .js file follows \"type\" in the nearest package.json; without one, Node detects ESM syntax (export/import) and otherwise uses CommonJS. Mismatched syntax throws." };
});
template("mod-cache", "modules", 16, () => {
  const k = ri(2, 4);
  const files = { "counter.cjs": `console.log("load");\nlet n = 0;\nmodule.exports = { next: () => ++n };` };
  const code = `const a = require("./counter.cjs");\nconst b = require("./counter.cjs");\n${Array.from({ length: k }, () => "a.next();").join(" ")}\nconsole.log(b.next(), a === b);`;
  return { difficulty: "medium", question: "counter.cjs prints \"load\" and exports { next } incrementing a private counter. What does main.cjs print?", code, run: { ext: "cjs", files },
    wrong: [`load / load / 1 false`, `load / 1 false`, `load / ${k} true`, `load / load / ${k + 1} false`, `${k + 1} true`],
    explanation: "A module runs once; require returns the cached exports object, so a and b share the same counter." };
});
template("mod-exports", "modules", 14, () => {
  const forms = [["exports.a = 1;\nexports.b = 2;", "medium"], ["exports = { a: 1 };", "medium"], ["module.exports = { a: 1 };\nexports.b = 2;", "hard"], ["module.exports.a = 1;\nexports.b = 2;", "medium"], ["module.exports = function f() {};\nmodule.exports.a = 1;", "hard"]];
  const [lib, diff] = pick(forms);
  const code = `const m = require("./lib.cjs");\nconsole.log(typeof m, JSON.stringify(m), m.a);`;
  return { difficulty: diff, question: "lib.cjs contains the lines below. What does main.cjs print?", displayCode: lib, code, run: { ext: "cjs", files: { "lib.cjs": lib } },
    wrong: ["object {} undefined", 'object {"a":1,"b":2} 1', 'object {"a":1} 1', "function undefined 1", 'object {"b":2} undefined'],
    explanation: "require returns module.exports. exports starts as an alias of it: adding properties works, but reassigning exports (or replacing module.exports afterwards) breaks the link." };
});
template("mod-live", "modules", 12, () => {
  const k = ri(1, 4);
  const files = { "counter.mjs": "export let count = 0;\nexport function inc() { count++; }", "counter.cjs": "let count = 0;\nmodule.exports = { count, inc() { count++; } };" };
  const which = pick(["mjs", "cjs"]);
  const code = which === "mjs" ? `import { count, inc } from "./counter.mjs";\n${"inc(); ".repeat(k).trim()}\nconsole.log(count);` : `import c from "./counter.cjs";\n${"c.inc(); ".repeat(k).trim()}\nconsole.log(c.count);`;
  return { difficulty: "hard", question: which === "mjs" ? "counter.mjs exports a let count and an inc() that increments it. What does this print?" : "counter.cjs does module.exports = { count, inc() { count++ } } with a local count = 0. What does this print?",
    code, run: { files }, wrong: ["0", String(k), String(k + 1), "undefined", "throws TypeError"],
    explanation: "ESM imports are live bindings to the exporter's variable; a CommonJS export copies the value at the time module.exports was built." };
});
template("mod-order", "modules", 12, () => {
  const names = sample(["a", "b", "c"], 3);
  const [x, y, z] = names;
  const files = { [`${x}.mjs`]: `console.log("${x}");\nexport const v = 1;`, [`${y}.mjs`]: `import "./${x}.mjs";\nconsole.log("${y}");`, [`${z}.mjs`]: `import "./${y}.mjs";\nimport "./${x}.mjs";\nconsole.log("${z}");` };
  return { difficulty: "medium", question: `${z}.mjs imports ${y}.mjs then ${x}.mjs; ${y}.mjs imports ${x}.mjs. Each logs its own name. What does \`node ${z}.mjs\` print?`,
    code: `await import("./${z}.mjs");`, run: { files }, wrong: [`${z} / ${y} / ${x}`, `${x} / ${y} / ${x} / ${z}`, `${y} / ${x} / ${z}`, `${x} / ${z} / ${y}`],
    explanation: "Dependencies are evaluated depth-first before the importing module, and each module runs only once." };
});
template("mod-paths", "modules", 12, () => {
  const ext = pick(["mjs", "cjs"]);
  const exprs = sample(["typeof __dirname", "typeof __filename", "typeof import.meta", "typeof require", "typeof exports"], 2).filter((e) => !(ext === "cjs" && e.includes("import.meta")));
  if (exprs.length < 2) return null;
  return { difficulty: "medium", question: `What does this print in main.${ext}?`, code: `console.log(${exprs.join(", ")});`, run: { ext }, variants: [{ ext: ext === "mjs" ? "cjs" : "mjs" }],
    wrong: ["string string", "undefined undefined", "object object", "function function", "throws SyntaxError"],
    explanation: "CommonJS gets __dirname, __filename, require, exports and module from its wrapper function; ES modules have import.meta (dirname, filename, url) instead." };
});
template("mod-resolve", "modules", 12, () => {
  const spec = pick(["./utils", "./utils.js", "./lib", "./lib/index.js", "./Utils.js"]);
  const files = { "utils.js": "export const ok = 'found';", "lib/index.js": "export const ok = 'found';", "package.json": '{"type":"module"}' };
  const code = `try {\n  const m = await import(${js(spec)});\n  console.log(m.ok);\n} catch (err) {\n  console.log(err.code);\n}`;
  if (spec === "./Utils.js") return null;   // case sensitivity depends on the file system
  return { difficulty: spec.endsWith(".js") ? "easy" : "medium", question: `In an ESM project containing utils.js and lib/index.js, what does importing ${js(spec)} print?`, code, run: { files },
    wrong: ["found", "ERR_MODULE_NOT_FOUND", "ERR_UNSUPPORTED_DIR_IMPORT", "undefined"],
    explanation: "ES module resolution needs the exact file name: no extension guessing and no automatic index.js for folders (ERR_UNSUPPORTED_DIR_IMPORT)." };
});

// ================================================================ 4 npm
const semver = createRequire(import.meta.url)(join(dirname(process.execPath), "..", "lib", "node_modules", "npm", "node_modules", "semver"));
const semverCheck = (v, range) => ({ code: `import { createRequire } from "node:module";\nimport { dirname, join } from "node:path";\nconst semver = createRequire(join(dirname(process.execPath), "..", "lib", "node_modules", "npm", "package.json"))("semver");\nconsole.log(semver.satisfies(${js(v)}, ${js(range)}));` });
template("npm-semver", "npm", 22, () => {
  const X = ri(1, 5), Y = ri(0, 6), Z = ri(0, 4);
  const range = pick([`^${X}.${Y}.${Z}`, `~${X}.${Y}.${Z}`, `>=${X}.${Y}.0 <${X + 1}.0.0`, `${X}.x`, `^0.${Y}.${Z}`, `${X}.${Y}.${Z}`]);
  const cands = uniq([`${X}.${Y}.${Z}`, `${X}.${Y}.${Z + 2}`, `${X}.${Y + 1}.0`, `${X + 1}.0.0`, `${X}.${Math.max(0, Y - 1)}.9`, `0.${Y}.${Z + 1}`, `0.${Y + 1}.0`]);
  const items = sample(cands, 5).map((v) => ({ label: v, check: semverCheck(v, range) }));
  return { difficulty: range.startsWith("^0") || range.startsWith("~") ? "hard" : "medium", question: `Which versions satisfy the npm range "${range}"? (select all that apply)`, items,
    explanation: "^ allows changes that don't modify the left-most non-zero part (^1.2.3 → <2.0.0, ^0.2.3 → <0.3.0); ~ allows patch updates (~1.2.3 → <1.3.0); x is a wildcard; a bare version is exact." };
});
template("npm-pick", "npm", 14, () => {
  const X = ri(1, 4), Y = ri(1, 5);
  const published = uniq([`${X}.${Y}.0`, `${X}.${Y}.3`, `${X}.${Y + 1}.0`, `${X}.${Y + 2}.1`, `${X + 1}.0.0`, `${X + 1}.1.0`]);
  const range = pick([`^${X}.${Y}.0`, `~${X}.${Y}.0`, `^${X}.${Y + 1}.0`]);
  if (!semver.maxSatisfying(published, range)) return null;
  const code = semverCheck("0.0.0", range).code.replace(/console\.log\(.*\);$/, `console.log(semver.maxSatisfying(${js(published)}, ${js(range)}));`);
  return { difficulty: range.startsWith("~") ? "medium" : "easy", question: `The registry has versions ${published.join(", ")}. package.json says "${range}". Which version does a fresh npm install pick?`,
    code, hideCode: true, wrong: published,
    explanation: "npm installs the highest published version that satisfies the range." };
});
const NPM_TASKS = [["install exactly what package-lock.json records, from scratch", "npm ci"], ["add a test framework as a development dependency", "npm install -D vitest"],
  ["run the \"dev\" script", "npm run dev"], ["run a package's CLI without installing it globally", "npx eslint ."], ["list dependencies with newer versions", "npm outdated"],
  ["create a package.json with default values", "npm init -y"], ["check installed packages for known vulnerabilities", "npm audit"], ["show what would be published", "npm pack --dry-run"],
  ["bump the patch version (1.2.3 → 1.2.4)", "npm version patch"], ["run a package.json script without starting npm", "node --run test"], ["set a field in package.json from the command line", "npm pkg set type=module"],
  ["remove a dependency", "npm uninstall lodash"], ["show the installed dependency tree", "npm ls"]];
template("npm-command", "npm", 32, () => {
  const [task, cmd] = pick(NPM_TASKS);
  return { difficulty: "easy", question: `Which command will ${task}?`, correct: [cmd], wrong: NPM_TASKS.map((t) => t[1]).filter((c) => c !== cmd),
    explanation: `${cmd} — see Chapter 4.` };
});
const DEP_KINDS = [["express", "dependencies"], ["pg (PostgreSQL driver)", "dependencies"], ["zod (validation)", "dependencies"], ["typescript", "devDependencies"], ["eslint", "devDependencies"],
  ["vitest", "devDependencies"], ["@types/node", "devDependencies"], ["prettier", "devDependencies"], ["pino (logger)", "dependencies"], ["dotenv used only in local scripts", "devDependencies"]];
template("npm-depkind", "npm", 12, () => {
  const items = sample(DEP_KINDS, 5);
  const yes = items.filter((d) => d[1] === "devDependencies").map((d) => d[0]), no = items.filter((d) => d[1] === "dependencies").map((d) => d[0]);
  if (!yes.length || !no.length) return null;
  return { difficulty: "medium", exact: true, question: "For a web API, which packages belong in devDependencies? (select all that apply)", correct: yes, wrong: no,
    explanation: "Run-time needs (framework, drivers, validation, logging) are dependencies; tools for building, typing, linting and testing are devDependencies." };
});
template("npm-scripts", "npm", 10, () => {
  const hooks = { pre: chance(0.7), post: chance(0.7) };
  const scripts = { ...(hooks.pre ? { prebuild: "echo clean" } : {}), build: "echo compile", ...(hooks.post ? { postbuild: "echo report" } : {}) };
  if (!hooks.pre && !hooks.post) return null;
  const runner = pick(["npm run build --silent", "node --run build"]);
  const code = `import { execSync } from "node:child_process";\nimport { writeFileSync } from "node:fs";\nimport { dirname } from "node:path";\nwriteFileSync("package.json", ${js(js({ name: "x", scripts }))});\nconst out = execSync(${js(runner)}, { encoding: "utf8", env: { ...process.env, PATH: dirname(process.execPath) + ":" + process.env.PATH } });\nconsole.log(out.trim().split("\\n").join(" / "));`;
  return { difficulty: "medium", question: `package.json scripts are ${js(scripts)}. What does \`${runner}\` print?`, code, hideCode: true,
    wrong: ["clean / compile / report", "compile", "clean / compile", "compile / report", "report / compile / clean"],
    explanation: "npm runs pre<name> and post<name> scripts automatically around <name>; node --run runs only the named script." };
});

// ================================================================ 5 callbacks
template("cb-order", "callbacks", 20, () => {
  const d1 = ri(1, 3) * 10, d2 = d1 + ri(1, 3) * 10;
  const forms = [
    [`console.log("1");\nsetTimeout(() => console.log("2"), ${d2});\nsetTimeout(() => console.log("3"), ${d1});\n[4, 5].forEach((n) => console.log(n));\nconsole.log("6");`, "easy"],
    [`function later(v, cb) { setTimeout(() => cb(null, v), ${d1}); }\nlater("a", (err, v) => console.log(v));\nconsole.log("b");\nlater("c", (err, v) => { console.log(v); later("d", (e, w) => console.log(w)); });`, "medium"],
    [`import { readFile } from "node:fs";\nreadFile(import.meta.filename, () => console.log("read"));\nconsole.log("sync");\nsetTimeout(() => console.log("timer"), ${d2 + 40});`, "medium"],
  ];
  const [code, diff] = pick(forms);
  return { difficulty: diff, question: "In what order are the lines printed?", code, wrong: [],
    explanation: "Synchronous code (including forEach's callback) runs first; asynchronous callbacks run later, in the order their operations complete." };
});
template("cb-errorfirst", "callbacks", 16, () => {
  const v = ri(2, 9);
  const forms = [
    [`function div(a, b, cb) {\n  setTimeout(() => {\n    if (b === 0) return cb(new Error("zero"));\n    cb(null, a / b);\n  }, 5);\n}\ndiv(${v * 2}, 2, (err, r) => console.log(err ? err.message : r));\ndiv(1, 0, (err, r) => console.log(err ? err.message : r));`, "easy"],
    [`function load(id, cb) {\n  setTimeout(() => {\n    if (!id) cb(new Error("no id"));\n    cb(null, "item " + id);\n  }, 5);\n}\nload(0, (err, v) => console.log(err ? "error" : v));`, "medium"],
    [`function maybe(n, cb) {\n  if (n > ${v}) return cb(null, "big");\n  setTimeout(() => cb(null, "small"), 0);\n}\nlet tag = "before";\nmaybe(${v + 1}, (e, r) => console.log(r, tag));\nmaybe(${v - 1}, (e, r) => console.log(r, tag));\ntag = "after";`, "hard"],
    [`import { promisify } from "node:util";\nfunction legacy(x, cb) { setTimeout(() => (x < 0 ? cb(new RangeError("neg")) : cb(null, x * 10)), 5); }\nconst p = promisify(legacy);\nconsole.log(await p(${v}));\nawait p(-1).catch((e) => console.log(e.name));`, "medium"],
  ];
  const [code, diff] = pick(forms);
  return { difficulty: diff, question: "What does this print?", code, wrong: ["error / item 0", "item 0", "big after / small after", "big before / small before"],
    explanation: "Error-first callbacks get (err, result). Without `return` after the error, the callback runs twice. A callback that's sometimes sync and sometimes async (Zalgo) sees different state." };
});
template("cb-flow", "callbacks", 16, () => {
  const ms = sample([10, 20, 30, 40], 3);
  const mode = pick(["series", "parallel"]);
  const task = `const log = [];\nconst task = (name, ms, cb) => { log.push("start " + name); setTimeout(() => { log.push("end " + name); cb(null, name); }, ms); };\n`;
  const body = mode === "series"
    ? `function series(items, done) {\n  const out = [];\n  (function next(i) {\n    if (i === items.length) return done(out);\n    task(items[i][0], items[i][1], (e, r) => { out.push(r); next(i + 1); });\n  })(0);\n}\nseries([["a", ${ms[0]}], ["b", ${ms[1]}], ["c", ${ms[2]}]], (out) => console.log(log.join(", ")));`
    : `let left = 3;\nfor (const [n, ms] of [["a", ${ms[0]}], ["b", ${ms[1]}], ["c", ${ms[2]}]]) task(n, ms, () => { if (--left === 0) console.log(log.join(", ")); });`;
  return { difficulty: mode === "series" ? "easy" : "medium", question: `These tasks run ${mode === "series" ? "in series" : "fully in parallel"} (a: ${ms[0]} ms, b: ${ms[1]} ms, c: ${ms[2]} ms). What is logged?`, code: task + body,
    wrong: ["start a, end a, start b, end b, start c, end c", "start a, start b, start c, end a, end b, end c", "start a, start b, start c, end c, end b, end a"],
    explanation: "In series each task starts after the previous one ends; in parallel all start at once and end in order of duration." };
});

// ================================================================ 6 promises
template("pr-combinators", "promises", 22, () => {
  const items = sample([[10, "ok", "A"], [20, "ok", "B"], [15, "fail", "C"], [5, "fail", "D"], [25, "ok", "E"]], 3);
  const comb = pick(["all", "allSettled", "any", "race"]);
  const make = items.map(([ms, kind, v]) => kind === "ok" ? `sleep(${ms}).then(() => "${v}")` : `sleep(${ms}).then(() => { throw new Error("${v} failed"); })`);
  const show = { all: "(r) => r.join(\",\")", allSettled: "(r) => r.map((x) => x.status[0]).join(\"\")", any: "(r) => r", race: "(r) => r" }[comb];
  const code = `import { setTimeout as sleep } from "node:timers/promises";\nawait Promise.${comb}([\n  ${make.join(",\n  ")},\n]).then(${show}, (e) => (e.errors ? "all failed" : e.message)).then(console.log);`;
  const values = items.map(([, kind, v]) => (kind === "ok" ? v : `${v} failed`));
  return { difficulty: comb === "allSettled" || comb === "any" ? "medium" : "easy", question: `What does Promise.${comb} produce here?`, code,
    wrong: [...values, "all failed", items.filter((i) => i[1] === "ok").map((i) => i[2]).join(",")],
    variants: ["all", "allSettled", "any", "race"].filter((c) => c !== comb).map((c) => ({ code: code.replace(`Promise.${comb}`, `Promise.${c}`).replace(show, { all: "(r) => r.join(\",\")", allSettled: "(r) => r.map((x) => x.status[0]).join(\"\")", any: "(r) => r", race: "(r) => r" }[c]) })),
    explanation: "all: every value or the first rejection; allSettled: each outcome (f = fulfilled, r = rejected); any: the first fulfilment (AggregateError if all fail); race: the first to settle either way." };
});
template("pr-seq-par", "promises", 24, () => {
  const n = ri(2, 4), ms = ri(3, 6) * 10;
  const par = chance(0.5);
  const body = par ? `await Promise.all(Array.from({ length: ${n} }, () => sleep(${ms})));` : `for (let i = 0; i < ${n}; i++) await sleep(${ms});`;
  const code = `import { setTimeout as sleep } from "node:timers/promises";\nconst t = Date.now();\n${body}\nconst took = Date.now() - t;\nconsole.log(took >= ${n * ms - 5} ? "about ${n * ms} ms" : "about ${ms} ms");`;
  return { difficulty: "easy", question: `About how long does this take (${n} sleeps of ${ms} ms)?`, code, wrong: [`about ${n * ms} ms`, `about ${ms} ms`], correctFromRun: true,
    explanation: "Awaiting inside a loop runs the waits one after another; Promise.all starts them all at once, so the total is about the longest single wait." };
});
template("pr-return-await", "promises", 14, () => {
  const ret = pick(["return save();", "return await save();", "await save();"]);
  const code = `async function save() { throw new Error("disk full"); }\nasync function main() {\n  try {\n    ${ret}\n  } catch (err) {\n    console.log("caught:", err.message);\n  }\n}\nawait main().catch((e) => console.log("escaped:", e.message));`;
  return { difficulty: ret === "return save();" ? "hard" : "medium", question: "What does this print?", code, wrong: ["caught: disk full", "escaped: disk full", "throws Error", "caught: disk full / escaped: disk full"],
    explanation: "`return save()` returns the promise before it settles, so the rejection escapes the try block. `return await` (or `await`) settles inside the try." };
});
template("pr-foreach", "promises", 12, () => {
  const loop = pick(["forEach", "for…of", "map + Promise.all"]);
  const body = { "forEach": "[1, 2, 3].forEach(async (n) => { await sleep(10); out.push(n); });", "for…of": "for (const n of [1, 2, 3]) { await sleep(10); out.push(n); }", "map + Promise.all": "await Promise.all([1, 2, 3].map(async (n) => { await sleep(10); out.push(n); }));" }[loop];
  const code = `import { setTimeout as sleep } from "node:timers/promises";\nconst out = [];\n${body}\nconsole.log(out.length);`;
  return { difficulty: loop === "forEach" ? "medium" : "easy", question: "What does this print?", code, wrong: ["0", "3", "1", "undefined"],
    explanation: "forEach doesn't wait for async callbacks, so the log runs before any push; for…of with await and Promise.all both wait." };
});
template("pr-abort", "promises", 14, () => {
  const ms = ri(2, 6) * 10, t = ri(1, 3) * 10;
  const forms = [`await sleep(${ms}, null, { signal: AbortSignal.timeout(${t}) }).then(() => console.log("done"), (e) => console.log(e.name, e.cause?.name ?? "-"));`,
    `const ac = new AbortController();\nsetTimeout(() => ac.abort(), ${t});\nawait sleep(${ms}, null, { signal: ac.signal }).then(() => console.log("done"), (e) => console.log(e.name, e.cause?.name ?? "-"));`,
    `await sleep(${t}, null, { signal: AbortSignal.timeout(${ms + 40}) }).then(() => console.log("done"), (e) => console.log(e.name));`];
  const code = `import { setTimeout as sleep } from "node:timers/promises";\n${pick(forms)}`;
  return { difficulty: "medium", question: "What does this print?", code, wrong: ["done", "AbortError -", "TimeoutError -", "AbortError TimeoutError", "throws AbortError"],
    explanation: "Aborting rejects with an AbortError; with AbortSignal.timeout, the AbortError's cause is a TimeoutError. A signal that fires after completion has no effect." };
});
template("pr-unhandled", "promises", 10, () => {
  const forms = [["async function f() { throw new Error(\"x\"); }\nf();\nsetTimeout(() => console.log(\"later\"), 20);", "medium"], ["async function f() { throw new Error(\"x\"); }\nf().catch(() => console.log(\"handled\"));\nsetTimeout(() => console.log(\"later\"), 20);", "easy"],
    ["const p = Promise.reject(new Error(\"x\"));\nsetTimeout(() => p.catch(() => console.log(\"late handler\")), 20);", "hard"]];
  const [code, diff] = pick(forms);
  return { difficulty: diff, question: "What does this print, and how does the process end?", code, run: { showExit: true }, displayRule: "stderr",
    wrongFrom: (a) => [a.replace(/exit \d+$/, a.endsWith("exit 0") ? "exit 1" : "exit 0"), a.replace(" / (error on stderr)", ""), "later / exit 0", "handled / later / exit 0", "late handler / exit 0"],
    explanation: "An unhandled rejection (no catch attached by the time microtasks drain) crashes Node with exit code 1; attaching a handler later is too late." };
});

// ================================================================ 7 loop
template("loop-order", "loop", 26, () => {
  const parts = sample([["sync", 'console.log("sync")'], ["tick", 'process.nextTick(() => console.log("tick"))'], ["promise", 'Promise.resolve().then(() => console.log("promise"))'],
    ["micro", 'queueMicrotask(() => console.log("micro"))'], ["timer", 'setTimeout(() => console.log("timer"), 5)']], ri(3, 5));
  const ext = pick(["cjs", "cjs", "mjs"]);
  const code = parts.map((p) => p[1] + ";").join("\n");
  return { difficulty: ext === "mjs" && parts.some((p) => p[0] === "tick") && parts.some((p) => p[0] === "promise" || p[0] === "micro") ? "hard" : "medium",
    question: `In what order are the lines printed (file main.${ext})?`, code, run: { ext }, variants: [{ ext: ext === "cjs" ? "mjs" : "cjs" }],
    explanation: "Synchronous code first, then the nextTick queue, then promise microtasks, then timers. At the top level of an ES module, promise microtasks run before the nextTick queue." };
});
template("loop-io", "loop", 18, () => {
  const parts = sample([["immediate", 'setImmediate(() => console.log("immediate"))'], ["timeout", 'setTimeout(() => console.log("setTimeout"), 0)'], ["tick", 'process.nextTick(() => console.log("tick"))'], ["promise", 'Promise.resolve().then(() => console.log("promise"))']], ri(3, 4));
  if (!parts.some((p) => p[0] === "immediate") || !parts.some((p) => p[0] === "timeout")) return null;
  const code = `const { readFile } = require("node:fs");\nreadFile(__filename, () => {\n  ${parts.map((p) => p[1] + ";").join("\n  ")}\n});`;
  return { difficulty: "hard", question: "What order do these callbacks run in, scheduled from inside an I/O callback?", code, run: { ext: "cjs" },
    explanation: "Inside an I/O callback (poll phase): nextTick, then promises, then the check phase (setImmediate), and only on the next iteration the timers phase." };
});
template("loop-phase", "loop", 24, () => {
  const facts = [["a setTimeout callback", "timers"], ["an fs.readFile callback", "poll"], ["a setImmediate callback", "check"], ["socket.on(\"close\") callbacks", "close callbacks"], ["a setInterval callback", "timers"], ["an incoming HTTP request callback", "poll"]];
  const [what, phase] = pick(facts);
  return { difficulty: "easy", question: `In which event-loop phase does ${what} run?`, correct: [phase], wrong: ["timers", "poll", "check", "close callbacks", "pending callbacks"].filter((p) => p !== phase),
    explanation: "timers → pending callbacks → idle/prepare → poll (I/O) → check (setImmediate) → close callbacks." };
});
template("loop-interval", "loop", 20, () => {
  const every = ri(1, 3) * 10, stopAt = ri(2, 4), after = stopAt * every + every / 2;
  const code = `let n = 0;\nconst id = setInterval(() => {\n  n++;\n  if (n === ${stopAt}) clearInterval(id);\n}, ${every});\nsetTimeout(() => console.log(n), ${after + every * 2});`;
  return { difficulty: "easy", question: `What does this print?`, code, wrong: [String(stopAt + 1), String(stopAt - 1), String(stopAt + 2), "0"],
    explanation: "clearInterval stops further runs, so the counter stays where it was cleared." };
});
template("loop-unref", "loop", 10, () => {
  const ref = chance(0.5);
  const code = `const t = setInterval(() => console.log("tick"), 15);\n${ref ? "" : "t.unref();\n"}setTimeout(() => {\n  console.log("main done");\n  ${ref ? "clearInterval(t);" : ""}\n}, 40);`;
  return { difficulty: "medium", question: "What does this print before the process exits?", code, wrong: ["main done", "tick / main done", "tick / tick / tick / main done", "tick / tick / main done / tick"],
    explanation: "Both versions run until the 40 ms timeout; an unref'd interval still fires while something else keeps the process alive, but doesn't keep it alive by itself." };
});

// ================================================================ 8 events
template("ev-basic", "events", 24, () => {
  const ops = [];
  const n = ri(3, 5);
  for (let i = 0; i < n; i++) ops.push(pick(["on", "once", "emit", "emit", "prepend"]));
  if (!ops.includes("emit")) ops.push("emit");
  let lines = ['import { EventEmitter } from "node:events";', "const e = new EventEmitter();", "const out = [];"];
  ops.forEach((op, i) => {
    if (op === "on") lines.push(`e.on("x", () => out.push("on${i}"));`);
    if (op === "once") lines.push(`e.once("x", () => out.push("once${i}"));`);
    if (op === "prepend") lines.push(`e.prependListener("x", () => out.push("pre${i}"));`);
    if (op === "emit") lines.push(`out.push(e.emit("x"));`);
  });
  lines.push('console.log(out.join(" "));');
  const code = lines.join("\n");
  return { difficulty: ops.includes("prepend") || ops.includes("once") ? "medium" : "easy", question: "What does this print?", code,
    variants: [{ code: code.replaceAll("e.once(", "e.on(") }, { code: code.replaceAll("prependListener", "on") }],
    explanation: "emit calls listeners synchronously in order (prependListener puts one first) and returns true if there were listeners; once listeners are removed after their first call." };
});
template("ev-error", "events", 14, () => {
  const has = pick(["none", "error", "monitor"]);
  const listen = { none: "", error: 'e.on("error", (err) => console.log("handled:", err.message));\n', monitor: 'e.on(errorMonitor, (err) => console.log("monitored:", err.message));\n' }[has];
  const code = `import { EventEmitter, errorMonitor } from "node:events";\nconst e = new EventEmitter();\n${listen}try {\n  e.emit("error", new Error("boom"));\n  console.log("after emit");\n} catch (err) {\n  console.log("thrown:", err.message);\n}`;
  return { difficulty: has === "monitor" ? "hard" : "medium", question: "What does this print?", code,
    wrong: ["after emit", "handled: boom / after emit", "thrown: boom", "monitored: boom / after emit", "(nothing)"],
    explanation: "Emitting 'error' with no 'error' listener throws the error; errorMonitor listeners observe it first but don't count as handlers." };
});
template("ev-sync", "events", 14, () => {
  const code = pick([`import { EventEmitter } from "node:events";\nconst e = new EventEmitter();\ne.on("a", () => { console.log("1"); e.emit("b"); console.log("3"); });\ne.on("b", () => console.log("2"));\nconsole.log("0");\ne.emit("a");\nconsole.log("4");`,
    `import { EventEmitter } from "node:events";\nconst e = new EventEmitter();\ne.on("x", () => setImmediate(() => console.log("deferred")));\ne.on("x", () => console.log("direct"));\ne.emit("x");\nconsole.log("after");`,
    `import { EventEmitter } from "node:events";\nclass Conn extends EventEmitter { constructor() { super(); this.emit("ready"); } }\nconst c = new Conn();\nc.on("ready", () => console.log("ready"));\nconsole.log("created");`,
    `import { EventEmitter } from "node:events";\nclass Conn extends EventEmitter { constructor() { super(); process.nextTick(() => this.emit("ready")); } }\nconst c = new Conn();\nc.on("ready", () => console.log("ready"));\nconsole.log("created");`]);
  return { difficulty: code.includes("Conn") ? "hard" : "medium", question: "What does this print?", code, wrong: ["0 / 1 / 3 / 2 / 4", "direct / after / deferred", "ready / created", "created"],
    explanation: "emit is synchronous; listeners added after an event was emitted miss it, which is why constructors defer events with process.nextTick." };
});
template("ev-count", "events", 12, () => {
  const k = ri(2, 4);
  const code = `import { EventEmitter } from "node:events";\nconst e = new EventEmitter();\nconst f = () => {};\n${Array.from({ length: k }, () => 'e.on("x", f);').join(" ")}\ne.once("x", () => {});\ne.off("x", f);\ne.off("x", () => {});\nconsole.log(e.listenerCount("x"));\ne.emit("x");\nconsole.log(e.listenerCount("x"));`;
  return { difficulty: "hard", question: "What does this print?", code, wrong: [`${k} / ${k - 1}`, `${k + 1} / ${k}`, "1 / 0", `${k - 1} / ${k - 2}`],
    explanation: "Adding the same function several times registers it several times; off removes one occurrence (and only for the same reference); once listeners disappear after emit." };
});
template("ev-once-promise", "events", 10, () => {
  const ms = ri(1, 3) * 10, kind = pick(["ready", "error"]);
  const code = `import { EventEmitter, once } from "node:events";\nconst db = new EventEmitter();\nsetTimeout(() => db.emit(${js(kind)}, ${kind === "error" ? 'new Error("auth failed")' : '"pg", 5432'}), ${ms});\ntry {\n  const args = await once(db, "ready");\n  console.log(args);\n} catch (err) {\n  console.log("rejected:", err.message);\n}`;
  return { difficulty: "medium", question: "What does this print?", code, wrong: ["pg", "[ 'pg', 5432 ]", "rejected: auth failed", "undefined", "pg 5432"],
    explanation: "events.once resolves with an array of the event's arguments, and rejects if 'error' is emitted first." };
});

// ================================================================ 9 files
const PATH_CASES = () => {
  const dir = pick(["/srv/app", "/home/ana/shop", "reports/2026"]);
  const file = pick(["invoice.final.pdf", "notes.txt", "archive.tar.gz", ".env", "README"]);
  return [[`path.basename(${js(dir + "/" + file)})`, "easy"], [`path.extname(${js(dir + "/" + file)})`, "medium"], [`path.dirname(${js(dir + "/" + file)})`, "easy"],
    [`path.basename(${js(file)}, path.extname(${js(file)}))`, "medium"], [`path.join(${js(dir)}, "..", "logs", "app.log")`, "easy"], [`path.join("a", "/b", "../c")`, "medium"],
    [`path.resolve("/srv", "app", "../logs")`, "medium"], [`path.resolve("/srv/app", "/tmp", "x.log")`, "hard"], [`path.relative("/data/users", "/data/orders/1.json")`, "hard"],
    [`path.normalize("/a/./b/../../c//d")`, "medium"], [`path.parse(${js(dir + "/" + file)}).name`, "medium"], [`path.isAbsolute(${js(dir)})`, "easy"]];
};
template("fs-path", "files", 26, () => {
  const [expr, diff] = pick(PATH_CASES());
  return { difficulty: diff, question: "What does this print (on macOS/Linux)?", code: `import path from "node:path";\nconsole.log(${expr});`, wrong: ["''", "undefined", "/", ".", "throws TypeError"],
    explanation: "basename/dirname/extname split a path (extname is only the last extension); join and normalize clean up . and ..; resolve works like cd from the left, restarting at absolute segments." };
});
template("fs-errors", "files", 18, () => {
  const ops = [["readFile(\"missing.txt\")", "medium"], ["readFile(\".\")", "medium"], ["mkdir(\"existing\")", "easy"], ["mkdir(\"a/b/c\")", "medium"], ["mkdir(\"existing\", { recursive: true })", "medium"],
    ["writeFile(\"existing/x.txt\", \"hi\")", "easy"], ["writeFile(\"note.txt\", \"x\", { flag: \"wx\" })", "medium"], ["rmdir(\"existing\")", "hard"], ["readdir(\"note.txt\")", "hard"], ["rm(\"nope\", { force: true })", "hard"]];
  const [op, diff] = pick(ops);
  const code = `import { mkdir, writeFile, readFile, rmdir, readdir, rm } from "node:fs/promises";\nawait mkdir("existing");\nawait writeFile("existing/keep.txt", "");\nawait writeFile("note.txt", "");\ntry {\n  await ${op};\n  console.log("ok");\n} catch (err) {\n  console.log(err.code);\n}`;
  return { difficulty: diff, question: `The folder "existing" (containing keep.txt) and the file "note.txt" exist. What does this print?`, code, wrong: ["ok", "ENOENT", "EEXIST", "EISDIR", "ENOTDIR", "ENOTEMPTY"],
    explanation: "ENOENT: missing path/parent; EEXIST: already exists (mkdir without recursive, flag wx); EISDIR/ENOTDIR: wrong type; ENOTEMPTY: rmdir on a non-empty folder; recursive/force options make mkdir/rm tolerant." };
});
template("fs-flags", "files", 20, () => {
  const steps = sample([['writeFile("f.txt", "A")', "w"], ['appendFile("f.txt", "B")', "a"], ['writeFile("f.txt", "C", { flag: "a" })', "a"], ['writeFile("f.txt", "D")', "w"]], 3);
  const code = `import { writeFile, appendFile, readFile } from "node:fs/promises";\n${steps.map((s) => `await ${s[0]};`).join("\n")}\nconsole.log(await readFile("f.txt", "utf8"));`;
  return { difficulty: "easy", question: "What does this print?", code, wrong: ["ABCD", "A", "D", "ABC", "BC"],
    explanation: "writeFile replaces the content; appendFile and the 'a' flag add to the end." };
});
template("fs-stat", "files", 18, () => {
  const size = ri(1, 9) * 100;
  const what = pick(["s.size", "s.isFile()", "s.isDirectory()", "(await stat(\".\")).isDirectory()", "typeof s.mtimeMs"]);
  const code = `import { writeFile, stat } from "node:fs/promises";\nawait writeFile("data.bin", Buffer.alloc(${size}));\nconst s = await stat("data.bin");\nconsole.log(${what});`;
  return { difficulty: "easy", question: "What does this print?", code, wrong: [String(size), String(size * 8), "true", "false", "number", "object"],
    explanation: "stat returns size in bytes, type checks (isFile, isDirectory) and timestamps (mtime as a Date, mtimeMs as a number)." };
});

// ================================================================ 10 streams
template("st-buffer", "streams", 22, () => {
  const s = pick(["héllo", "€5", "naïve", "abc", "😀!", "ñandú"]);
  const exprs = [[`${js(s)}.length`, "easy"], [`Buffer.byteLength(${js(s)})`, "medium"], [`Buffer.from(${js(s)}).length`, "medium"], [`[...${js(s)}].length`, "medium"],
    [`Buffer.from(${js(s)}).toString("hex").length`, "hard"], [`Buffer.from("${s}").toString("base64")`, "hard"], [`Buffer.from([72, 105]).toString()`, "easy"]];
  const [e, diff] = pick(exprs);
  return { difficulty: diff, question: "What does this print?", code: `console.log(${e});`, wrong: [],
    explanation: "UTF-8 uses 1 byte for ASCII and 2–4 bytes for other characters; .length counts UTF-16 code units; spreading counts code points; hex uses 2 characters per byte." };
});
template("st-subarray", "streams", 10, () => {
  const how = pick(["subarray(0, 3)", "slice(0, 3)", "from(whole.subarray(0, 3))"]);
  const code = `const whole = Buffer.from("HELLO");\nconst part = ${how.startsWith("from") ? `Buffer.${how}` : `whole.${how}`};\npart[0] = 0x4a;\nconsole.log(whole.toString(), part.toString());`;
  return { difficulty: "hard", question: "What does this print?", code, wrong: ["HELLO JEL", "JELLO JEL", "HELLO HEL", "JELLO HEL"],
    explanation: "Buffer subarray (and Buffer slice) return views sharing memory with the original; Buffer.from(view) makes an independent copy." };
});
template("st-chunks", "streams", 14, () => {
  const size = ri(2, 9) * 10_000, hwm = pick([16_384, 32_768, 50_000, 65_536]);
  const code = `import { createReadStream } from "node:fs";\nimport { writeFile } from "node:fs/promises";\nawait writeFile("f.bin", Buffer.alloc(${size}));\nlet chunks = 0;\nfor await (const c of createReadStream("f.bin", { highWaterMark: ${hwm} })) chunks++;\nconsole.log(chunks);`;
  return { difficulty: "medium", question: `A ${size}-byte file is read with highWaterMark ${hwm}. How many chunks?`, code, wrong: [String(Math.ceil(size / hwm) + 1), String(Math.max(1, Math.ceil(size / hwm) - 1)), "1", String(Math.ceil(size / 65536))],
    explanation: "Each chunk holds up to highWaterMark bytes (64 KB by default for file streams), so the count is the size divided by it, rounded up." };
});
template("st-pipeline", "streams", 16, () => {
  const words = sample(["node", "streams", "flow", "pipe", "data"], 3);
  const t1 = pick([["upper", "yield c.toUpperCase();"], ["len", "yield String(c.length);"], ["rev", "yield [...c].reverse().join(\"\");"]]);
  const t2 = pick([["filter", "if (c.length > 3) yield c;"], ["prefix", "yield \">\" + c;"], ["pass", "yield c;"]]);
  const code = `import { Readable } from "node:stream";\nimport { pipeline } from "node:stream/promises";\nconst out = [];\nawait pipeline(\n  Readable.from(${js(words)}),\n  async function* (src) { for await (const c of src) { ${t1[1]} } },\n  async function* (src) { for await (const c of src) { ${t2[1]} } },\n  async function (src) { for await (const c of src) out.push(c); },\n);\nconsole.log(out.join(" "));`;
  return { difficulty: "medium", question: "What does this pipeline print?", code, wrong: [words.join(" "), words.map((w) => w.toUpperCase()).join(" ")],
    explanation: "Readable.from emits each array item; each async generator stage transforms the values flowing through, in order." };
});
const STREAM_KINDS = [["process.stdout", "Writable"], ["process.stdin", "Readable"], ["zlib.createGzip()", "Transform"], ["a net.Socket (TCP connection)", "Duplex"], ["fs.createReadStream(\"a.txt\")", "Readable"],
  ["fs.createWriteStream(\"a.txt\")", "Writable"], ["an incoming HTTP request (server side)", "Readable"], ["an HTTP response (server side)", "Writable"], ["crypto.createHash(\"sha256\")", "Transform"]];
template("st-kind", "streams", 20, () => {
  const [what, kind] = pick(STREAM_KINDS);
  return { difficulty: "easy", question: `What kind of stream is ${what}?`, correct: [kind], wrong: ["Readable", "Writable", "Duplex", "Transform", "not a stream"].filter((k) => k !== kind),
    explanation: "Readable: a source; Writable: a destination; Duplex: both, independently (sockets); Transform: in → changed → out (gzip, hashes)." };
});

// ================================================================ 11 http
template("http-url", "http", 18, () => {
  const q = pick(["/search?q=node%20streams&page=2", "/users/42?fields=name&fields=email", "/a/b?empty=&flag", "/shop?tag=io&tag=fs&sort=-price"]);
  const exprs = ["u.pathname", "u.searchParams.get(\"page\")", "u.searchParams.getAll(\"fields\")", "u.searchParams.get(\"q\")", "u.searchParams.has(\"flag\")", "u.searchParams.get(\"empty\")", "Object.fromEntries(u.searchParams).tag", "u.searchParams.get(\"missing\")"];
  const e = pick(exprs);
  return { difficulty: e.includes("fromEntries") || e.includes("empty") ? "hard" : "medium", question: `A request arrives for ${q}. What does this print?`, code: `const u = new URL(${js(q)}, "http://localhost");\nconsole.log(${e});`,
    wrong: ["null", "undefined", "''", "true", "[]", "node%20streams"],
    explanation: "URLSearchParams decodes values; get returns the first value or null; getAll returns every value; Object.fromEntries keeps the last value of a repeated key." };
});
const STATUS = [["created a new resource", "201"], ["deleted successfully, nothing to return", "204"], ["the JSON body is malformed", "400"], ["the user is not logged in", "401"], ["the user is logged in but not allowed", "403"],
  ["no such resource", "404"], ["the path exists but not with this method", "405"], ["the body exceeds the size limit", "413"], ["the content type isn't JSON", "415"], ["valid JSON that fails validation", "422"],
  ["too many requests from this client", "429"], ["an unexpected bug in the handler", "500"], ["the server is starting or shutting down", "503"]];
template("http-status", "http", 26, () => {
  const [what, code] = pick(STATUS);
  return { difficulty: ["401", "403", "415", "422", "405"].includes(code) ? "medium" : "easy", question: `Which status code fits: ${what}?`, correct: [code], wrong: STATUS.map((s) => s[1]).filter((c) => c !== code),
    explanation: "2xx success, 4xx client mistakes (400 malformed, 401 unauthenticated, 403 forbidden, 404 missing, 405 method, 413 too large, 415 media type, 422 invalid, 429 rate limit), 5xx server problems." };
});
template("http-server", "http", 18, () => {
  const forms = [
    ['if (req.url === "/") { res.writeHead(200); res.end("home"); } else { res.statusCode = 404; res.end("nope"); }', ["/", "/x"]],
    ['res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ m: req.method, u: req.url }));', ["/a?b=1"]],
    ['let body = ""; for await (const c of req) body += c; res.end(String(body.length));', ["/"], { method: "POST", body: "hello world" }],
    ['const u = new URL(req.url, "http://x"); res.end(u.searchParams.get("name") ?? "anon");', ["/?name=Ana", "/"]],
    ['res.writeHead(req.method === "GET" ? 200 : 405).end();', ["/"], { method: "DELETE" }],
  ];
  const [handler, paths, init] = pick(forms);
  const code = `import http from "node:http";\nconst server = http.createServer(async (req, res) => {\n  ${handler}\n});\nserver.listen(0, async () => {\n  for (const p of ${js(paths)}) {\n    const r = await fetch("http://localhost:" + server.address().port + p${init ? `, ${js(init)}` : ""});\n    console.log(r.status, await r.text());\n  }\n  server.close();\n});`;
  return { difficulty: "medium", question: "What does this print?", code, wrong: ["200 home / 200 nope", "200", "404 nope", "200 0", "200 anon"],
    explanation: "The handler sets the status (default 200) and the body with res.end; the request body is a stream read with for await; query values come from a URL object." };
});

// ================================================================ 12 fetch
template("fetch-ok", "fetch", 22, () => {
  const status = pick([200, 201, 204, 301, 400, 404, 418, 500, 503]);
  const show = pick(["res.ok", "res.status", "res.ok ? \"ok\" : \"not ok\""]);
  const code = `import http from "node:http";\nconst server = http.createServer((req, res) => res.writeHead(${status}${status === 301 ? ', { Location: "/" }' : ""}).end());\nserver.listen(0, async () => {\n  try {\n    const res = await fetch("http://localhost:" + server.address().port + "/x"${status === 301 ? ', { redirect: "manual" }' : ""});\n    console.log(${show});\n  } catch (err) {\n    console.log("rejected");\n  }\n  server.close();\n});`;
  return { difficulty: status >= 400 ? "medium" : "easy", question: `The server answers ${status}. What does this print?`, code, wrong: ["rejected", "true", "false", "ok", "not ok", String(status)],
    explanation: "fetch resolves for every HTTP status; res.ok is true only for 200–299. It rejects only on network errors." };
});
template("fetch-timeout", "fetch", 12, () => {
  const delay = ri(4, 8) * 10, limit = pick([delay - 30, delay + 60]);
  const code = `import http from "node:http";\nconst server = http.createServer((req, res) => setTimeout(() => res.end("slow"), ${delay}));\nserver.listen(0, async () => {\n  try {\n    const r = await fetch("http://localhost:" + server.address().port, { signal: AbortSignal.timeout(${limit}) });\n    console.log(await r.text());\n  } catch (err) {\n    console.log(err.name);\n  }\n  server.closeAllConnections();\n  server.close();\n});`;
  return { difficulty: "medium", question: `The server answers after ${delay} ms; the client's timeout is ${limit} ms. What is printed?`, code, wrong: ["slow", "TimeoutError", "AbortError", "TypeError"],
    explanation: "AbortSignal.timeout aborts fetch with a TimeoutError if the response doesn't arrive in time." };
});
template("fetch-idempotent", "fetch", 12, () => {
  const all = [["GET /orders", true], ["PUT /orders/7", true], ["DELETE /orders/7", true], ["HEAD /health", true], ["POST /orders", false], ["POST /payments", false], ["PATCH /orders/7 { \"increment\": 1 }", false]];
  const items = sample(all, 5);
  const yes = items.filter((x) => x[1]).map((x) => x[0]), no = items.filter((x) => !x[1]).map((x) => x[0]);
  if (!yes.length || !no.length) return null;
  return { difficulty: "medium", exact: true, question: "Which requests are safe to retry automatically after a timeout? (select all that apply)", correct: yes, wrong: no,
    explanation: "GET, HEAD, PUT and DELETE are idempotent; POST (and non-idempotent PATCH) may apply twice unless the API supports idempotency keys." };
});

// ================================================================ 13 concurrency
const POOL = [["fs.promises.readFile", true], ["crypto.scrypt", true], ["crypto.pbkdf2", true], ["zlib.gzip", true], ["dns.lookup", true], ["an incoming TCP connection", false],
  ["JSON.parse of a large string", false], ["a for loop summing an array", false], ["fetch to another server", false], ["setTimeout", false]];
template("cc-pool", "concurrency", 14, () => {
  const items = sample(POOL, 5);
  const yes = items.filter((x) => x[1]).map((x) => x[0]), no = items.filter((x) => !x[1]).map((x) => x[0]);
  if (!yes.length || !no.length) return null;
  return { difficulty: "medium", exact: true, question: "Which of these use libuv's worker (thread) pool? (select all that apply)", correct: yes, wrong: no,
    explanation: "The pool runs file system work, dns.lookup, async crypto (pbkdf2, scrypt, randomBytes) and zlib. Network I/O uses OS async mechanisms; JavaScript (JSON.parse, loops) runs on the main thread." };
});
template("cc-child", "concurrency", 14, () => {
  const n = ri(0, 5);
  const forms = [`const { stdout } = await run(process.execPath, ["-p", "${ri(2, 9)} * ${ri(2, 9)}"]);\nconsole.log(stdout.trim());`,
    `try {\n  await run(process.execPath, ["-e", "process.exit(${n})"]);\n  console.log("success");\n} catch (err) {\n  console.log("exit code", err.code);\n}`,
    `const { stdout } = await run(process.execPath, ["-e", "console.log(process.argv.length)", "a", "b"]);\nconsole.log(stdout.trim());`];
  const code = `import { execFile } from "node:child_process";\nimport { promisify } from "node:util";\nconst run = promisify(execFile);\n${pick(forms)}`;
  return { difficulty: "medium", question: "What does this print?", code, wrong: ["success", "exit code 1", "exit code 0", "3", "4", "undefined"],
    explanation: "execFile resolves with stdout/stderr for exit code 0 and rejects (err.code = exit code) otherwise. In `node -e code a b`, process.argv is [node, a, b] — no script path." };
});
template("cc-worker", "concurrency", 12, () => {
  const n = ri(5, 25), op = pick([["n * n", (x) => x * x], ["n + 1", (x) => x + 1], ["String(n).length", (x) => String(x).length]]);
  const code = `import { Worker } from "node:worker_threads";\nimport { once } from "node:events";\nconst w = new Worker(\`\n  const { parentPort, workerData } = require("node:worker_threads");\n  const n = workerData;\n  parentPort.postMessage(${op[0]});\n\`, { eval: true, workerData: ${n} });\nconst [result] = await once(w, "message");\nconsole.log(result, typeof result);`;
  return { difficulty: "medium", question: "What does this print?", code, wrong: [`${n} number`, `${op[1](n)} string`, "undefined undefined", `${op[1](n) + 1} number`],
    explanation: "workerData is copied into the worker; postMessage sends a structured clone of the result back, received through the 'message' event." };
});
const TOOL_CHOICE = [["resizing thousands of images in JavaScript while the API keeps serving", "worker_threads"], ["running the ffmpeg program to convert a video", "child_process"],
  ["calling three REST APIs for one page", "async I/O with Promise.all"], ["using all 16 CPU cores for HTTP traffic", "cluster or multiple replicas"], ["a medium loop that must not freeze the server, without threads", "partitioning with setImmediate"],
  ["running a Python script from Node", "child_process"], ["hashing a large file", "async crypto with streams"]];
template("cc-choice", "concurrency", 16, () => {
  const [task, tool] = pick(TOOL_CHOICE);
  return { difficulty: "medium", question: `Which approach fits best: ${task}?`, correct: [tool], wrong: uniq(TOOL_CHOICE.map((t) => t[1])).filter((t) => t !== tool),
    explanation: "I/O → async APIs; CPU-heavy JS → worker_threads (or partitioning); other programs → child_process; more cores for a server → cluster/replicas." };
});

// ================================================================ 14 testing
const ASSERTS = [["assert.equal(1, \"1\")", "medium"], ["assert.equal(0.1 + 0.2, 0.3)", "medium"], ["assert.deepEqual({ a: [1, 2] }, { a: [1, 2] })", "easy"], ["assert.deepEqual([1, 2], [2, 1])", "easy"],
  ["assert.equal(NaN, NaN)", "hard"], ["assert.deepEqual({ a: 1 }, { a: 1, b: undefined })", "hard"], ["assert.match(\"order-12\", /^order-\\d+$/)", "easy"], ["assert.throws(() => JSON.parse(\"{\"), SyntaxError)", "easy"],
  ["assert.throws(() => 1)", "medium"], ["assert.ok(\"\")", "easy"], ["assert.ok([])", "medium"], ["assert.notEqual({}, {})", "medium"], ["assert.deepEqual(new Date(0), new Date(0))", "medium"], ["assert.equal([1], [1])", "medium"]];
template("test-assert", "testing", 22, () => {
  const items = sample(ASSERTS, 5).map(([a]) => ({ label: a, check: { code: `import assert from "node:assert/strict";\ntry { ${a}; console.log(false); } catch { console.log(true); }` } }));
  return { difficulty: "medium", question: "Using node:assert/strict, which of these assertions THROW (fail)? (select all that apply)", items,
    explanation: "Strict assertions compare with Object.is/===: '1' ≠ 1, 0.1+0.2 ≠ 0.3, distinct objects aren't equal (use deepEqual), but NaN equals NaN under Object.is. deepEqual checks structure and types strictly." };
});
template("test-count", "testing", 14, () => {
  const tests = Array.from({ length: ri(3, 5) }, (_, i) => pick([`test("t${i}", () => assert.equal(${i}, ${i}));`, `test("t${i}", () => assert.equal(${i}, ${i + 1}));`, `test.skip("t${i}", () => {});`, `test.todo("t${i}");`, `test("t${i}", async () => { await assert.rejects(Promise.reject(new Error("x"))); });`]));
  const code = `import { spawnSync } from "node:child_process";\nimport { writeFileSync } from "node:fs";\nwriteFileSync("x.test.mjs", ${js(`import { test } from "node:test";\nimport assert from "node:assert/strict";\n${tests.join("\n")}`)});\nconst out = spawnSync(process.execPath, ["--test", "x.test.mjs"], { encoding: "utf8" }).stdout;\nconst get = (k) => out.match(new RegExp("ℹ " + k + " (\\\\d+)"))[1];\nconsole.log("pass", get("pass"), "fail", get("fail"), "skipped", get("skipped"), "todo", get("todo"));`;
  return { difficulty: "medium", question: "A test file contains these tests. What does the summary of `node --test` report?", displayCode: tests.join("\n"), code,
    wrong: [], explanation: "Skipped tests don't run; todo tests are reported as todo (they don't fail the run); an assertion error fails a test." };
});
template("test-mock", "testing", 12, () => {
  const n = ri(2, 4), ret = ri(1, 9);
  const code = `import { mock } from "node:test";\nconst fn = mock.fn((x) => x * ${ret});\n${Array.from({ length: n }, (_, i) => `fn(${i + 1});`).join(" ")}\nconsole.log(fn.mock.callCount(), fn.mock.calls.at(-1).arguments, fn.mock.calls.at(-1).result);`;
  return { difficulty: "medium", question: "What does this print?", code, wrong: [`${n - 1} [ ${n} ] ${n * ret}`, `${n} [ ${n} ] ${ret}`, `${n} ${n} ${n * ret}`],
    explanation: "mock.fn records every call: callCount(), and calls[i].arguments / .result." };
});
template("test-timers", "testing", 10, () => {
  const delay = ri(2, 6) * 100, tick = pick([delay - 100, delay, delay + 100]);
  const code = `import { mock } from "node:test";\nmock.timers.enable({ apis: ["setTimeout"] });\nlet fired = false;\nsetTimeout(() => (fired = true), ${delay});\nmock.timers.tick(${tick});\nconsole.log(fired);\nmock.timers.reset();`;
  return { difficulty: "medium", question: "What does this print?", code, wrong: ["true", "false"],
    explanation: "With fake timers, time only advances when you call tick(); a timer fires once the fake clock reaches its delay." };
});

// ================================================================ 15 production
template("prod-pollution", "production", 14, () => {
  const key = pick(["__proto__", "constructor", "theme"]);
  const container = pick(["{}", "Object.create(null)", "new Map()"]);
  const code = container === "new Map()"
    ? `const store = new Map();\nstore.set(${js(key)}, { isAdmin: true });\nconsole.log(({}).isAdmin, store.get(${js(key)}).isAdmin);`
    : `const store = ${container};\nconst input = JSON.parse('{"isAdmin": true}');\nstore[${js(key)}] ??= {};\nObject.assign(store[${js(key)}], input);\nconsole.log(({}).isAdmin, Object.keys(store).length);`;
  return { difficulty: "hard", question: "What does this print?", code, wrong: ["undefined 1", "true 0", "true 1", "undefined true", "undefined 0", "throws TypeError"],
    explanation: "On a plain object, the key \"__proto__\" reaches Object.prototype, so assigning into it pollutes every object. Object.create(null) and Map have no prototype chain to pollute." };
});
template("prod-timingsafe", "production", 10, () => {
  const a = pick(["secret", "tok3n"]), b = pick([a, a + "x", a.toUpperCase()]);
  const code = `import { timingSafeEqual } from "node:crypto";\ntry {\n  console.log(timingSafeEqual(Buffer.from(${js(a)}), Buffer.from(${js(b)})));\n} catch (err) {\n  console.log(err.code);\n}`;
  return { difficulty: "hard", question: "What does this print?", code, wrong: ["true", "false", "ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH", "throws TypeError"],
    explanation: "timingSafeEqual compares equal-length buffers in constant time and throws for different lengths — hash both values first to compare arbitrary strings." };
});
template("prod-permission", "production", 14, () => {
  const action = pick([["readFileSync(\"data/a.txt\", \"utf8\").trim()", "read inside the allowed folder"], ["writeFileSync(\"data/b.txt\", \"x\") ?? \"written\"", "write a file"],
    ["readFileSync(\"/etc/hosts\").length > 0", "read outside the folder"], ["execSync(\"echo hi\").toString().trim()", "spawn a process"]]);
  const flags = pick([["--permission", "--allow-fs-read=./"], ["--permission", "--allow-fs-read=./", "--allow-fs-write=./data"], ["--permission", "--allow-fs-read=*"]]);
  const code = `import { readFileSync, writeFileSync } from "node:fs";\nimport { execSync } from "node:child_process";\ntry {\n  console.log(${action[0]});\n} catch (err) {\n  console.log(err.code);\n}`;
  return { difficulty: "hard", question: `Run with \`node ${flags.join(" ")} main.mjs\` (data/a.txt contains "hello"). The script tries to ${action[1]}. What does it print?`, code,
    run: { execArgv: flags, files: { "data/a.txt": "hello" } }, wrong: ["hello", "written", "true", "hi", "ERR_ACCESS_DENIED", "EACCES"],
    explanation: "Under --permission everything is denied unless allowed: --allow-fs-read/--allow-fs-write grant paths, and child processes need --allow-child-process. Denials throw ERR_ACCESS_DENIED." };
});
const THREATS = [["comparing an API token with ===", "use crypto.timingSafeEqual"], ["merging user JSON into objects with a naive deep merge", "skip __proto__/constructor keys or use Map"],
  ["exec(`convert ${name}`) with a user-supplied name", "use execFile/spawn with an argument array"], ["a request body of several gigabytes", "enforce a body size limit"], ["a regex like /^(a+)+$/ on user input", "avoid nested quantifiers and limit input length"],
  ["writing uploads to path.join(\"uploads\", userName)", "resolve the path and check it stays inside the folder"], ["a compromised dependency reading ~/.ssh", "run with the permission model"], ["stack traces in API error responses", "send generic messages and log details server-side"]];
template("prod-threat", "production", 18, () => {
  const [threat, fix] = pick(THREATS);
  return { difficulty: "medium", question: `What is the best defence against: ${threat}?`, correct: [fix], wrong: THREATS.map((t) => t[1]).filter((f) => f !== fix),
    explanation: "See the threat table in Chapter 15: each class of attack has a specific defence." };
});

// ================================================================ 16 project
const appUrl = (f) => js("file://" + join(REF, f));
// Show project imports the way a reader would write them, not with this machine's absolute path.
const friendly = (code) => code.replace(/const \{ (\w+) \} = await import\("file:[^"]+\/src\/([\w-]+\.js)"\);/, 'import { $1 } from "./src/$2";');
template("proj-validate", "project", 18, () => {
  const bodies = [[{ text: "  buy milk " }, false], [{ text: "" }, false], [{ text: "x", tags: ["a", "a", "b"] }, false], [{ text: "x", tags: "home" }, false], [{ text: "x", done: "yes" }, false],
    [{}, true], [{ done: true }, true], [{ text: "y".repeat(501) }, false], [{ text: "ok", tags: ["Has Space"] }, false]];
  const [body, partial] = pick(bodies);
  const code = `const { validateNote } = await import(${appUrl("app.js")});\ntry {\n  console.log(JSON.stringify(validateNote(${js(body)}${partial ? ", { partial: true }" : ""})));\n} catch (err) {\n  console.log(err.status, err.details.length);\n}`;
  return { displayCode: friendly(code), difficulty: partial ? "hard" : "medium", question: `In the Chapter 16 project, what does validateNote(${js(body).slice(0, 60)}${partial ? ", { partial: true }" : ""}) produce?`, code,
    wrong: ['{"text":"buy milk"}', '{"text":"  buy milk "}', "422 1", "422 2", "400 1", '{"done":true}', '{"text":"x","tags":["a","b"]}'],
    explanation: "validateNote trims text, removes duplicate tags, checks types and lengths, collects every problem in err.details (status 422), and with partial: true requires at least one known field." };
});
template("proj-route", "project", 16, () => {
  const [method, path] = pick([["GET", "/notes"], ["POST", "/notes"], ["PUT", "/notes"], ["GET", "/notes/7"], ["PATCH", "/notes/7"], ["DELETE", "/notes/abc"], ["GET", "/nothing"], ["GET", "/health"], ["POST", "/health"], ["GET", "/events"]]);
  const code = `const { Router } = await import(${appUrl("router.js")});\nconst r = new Router().get("/health", 1).get("/notes", 2).post("/notes", 3).get("/notes/:id", 4).patch("/notes/:id", 5).delete("/notes/:id", 6).get("/events", 7);\nconst m = r.match(${js(method)}, ${js(path)});\nconsole.log(m.handler ? "handler " + m.handler + " " + JSON.stringify(m.params ?? {}) : "status " + m.status);`;
  return { displayCode: friendly(code), difficulty: "medium", question: `In the project's Router (routes: GET /health, GET+POST /notes, GET+PATCH+DELETE /notes/:id, GET /events), what does match("${method}", "${path}") return?`, code,
    wrong: ["status 404", "status 405", "handler 4 {\"id\":\"7\"}", "handler 2 {}", "handler 6 {\"id\":\"abc\"}"],
    explanation: "match returns the first route whose method and URLPattern match (with path parameters as strings); 405 when the path exists only with other methods; 404 otherwise. (Validating :id is the handler's job.)" };
});
template("proj-config", "project", 12, () => {
  const env = pick([{}, { PORT: "8080" }, { PORT: "abc" }, { PORT: "70000" }, { MAX_BODY_BYTES: "50" }, { LOG_LEVEL: "debug", PORT: "0" }, { DATA_FILE: "/tmp/n.json" }]);
  const code = `const { loadConfig } = await import(${appUrl("config.js")});\ntry {\n  const c = loadConfig(${js(env)});\n  console.log(c.port, c.maxBodyBytes, c.logLevel, Object.isFrozen(c));\n} catch (err) {\n  console.log("error:", err.message.split(" must")[0]);\n}`;
  return { displayCode: friendly(code), difficulty: "easy", question: `What does the project's loadConfig(${js(env)}) give?`, code, wrong: ["3000 10000 info true", "8080 10000 info true", "error: PORT", "error: MAX_BODY_BYTES", "3000 10000 info false", "0 10000 debug true"],
    explanation: "loadConfig applies defaults (PORT 3000, MAX_BODY_BYTES 10000, LOG_LEVEL info), validates integer ranges, and returns a frozen object." };
});

// ================================================================ A typescript
const TS_SNIPPETS = [["let id: number = 5;", true], ["interface User { name: string }", true], ["type Id = string | number;", true], ["const v = (\"x\" as unknown) as number;", true],
  ["function f<T>(x: T): T { return x; }", true], ["enum Color { Red }", false], ["class A { constructor(public n: number) {} }", false], ["namespace NS { export const x = 1; }", false],
  ["const n = 5 satisfies number;", true], ["let x!: number;", true], ["abstract class Shape { abstract area(): number }", true], ["declare const VERSION: string;", true]];
template("ts-erasable", "typescript", 20, () => {
  const items = sample(TS_SNIPPETS, 5).map(([s]) => ({ label: s, check: { code: `import { spawnSync } from "node:child_process";\nimport { writeFileSync } from "node:fs";\nwriteFileSync("t.ts", ${js(s + "\nconsole.log('ran');")});\nconsole.log(spawnSync(process.execPath, ["t.ts"], { encoding: "utf8" }).stdout.trim() === "ran");` } }));
  return { difficulty: "medium", question: "Which of these lines run with `node file.ts` (type stripping)? (select all that apply)", items,
    explanation: "Only erasable syntax works: annotations, interfaces, type aliases, generics, as/satisfies/!, abstract and declare. enum, parameter properties and value namespaces need code generation." };
});
template("ts-output", "typescript", 16, () => {
  const v = ri(2, 9);
  const forms = [`function double(n: number): number { return n * 2; }\nconst input: any = "${v}";\nconsole.log(double(input));`, `const price: number = "${v}.99" as unknown as number;\nconsole.log(price + 1);`,
    `type Pair = [string, number];\nconst p: Pair = ["a", ${v}];\nconsole.log(typeof p, p.length);`, `interface Box<T> { value: T }\nconst b: Box<number> = { value: ${v} };\nconsole.log(b.value * 2, typeof (b as unknown));`,
    `const Level = { Low: "low", High: "high" } as const;\ntype Level = (typeof Level)[keyof typeof Level];\nconst l: Level = Level.High;\nconsole.log(l, Object.keys(Level).length);`];
  return { difficulty: "medium", question: "What does `node main.ts` print?", code: pick(forms), run: { ext: "ts" }, wrong: ["throws TypeError", "throws SyntaxError", String(v * 2), `${v}.991`, "undefined"],
    explanation: "Type stripping deletes types without checking them, so values behave exactly as plain JavaScript at run time (strings stay strings, casts check nothing)." };
});
template("ts-import", "typescript", 10, () => {
  const imp = pick(["import { describe, type User } from \"./user.ts\";", "import type { User } from \"./user.ts\";\nimport { describe } from \"./user.ts\";", "import { describe, User } from \"./user.ts\";", "import { describe } from \"./user\";"]);
  const files = { "user.ts": "export interface User { name: string }\nexport const describe = (u: User): string => `user ${u.name}`;" };
  const code = `${imp}\nconst u = { name: "Ana" };\nconsole.log(describe(u));`;
  return { difficulty: "hard", question: "user.ts exports an interface User and a function describe. What does `node main.ts` print?", code, run: { ext: "ts", files }, wrong: ["user Ana", "throws SyntaxError", "throws Error", "undefined"],
    explanation: "Interfaces vanish at run time, so a value import of User fails (use import type), and relative imports need the full .ts extension." };
});

// ================================================================ B migrations
const MIGRATE = [["chalk", "util.styleText"], ["dotenv", "node --env-file"], ["nodemon", "node --watch"], ["axios", "fetch"], ["uuid", "crypto.randomUUID"], ["rimraf", "fs.rm with recursive and force"],
  ["mkdirp", "fs.mkdir with recursive"], ["glob", "fs.glob"], ["minimist", "util.parseArgs"], ["lodash.clonedeep", "structuredClone"], ["mocha", "node:test"], ["ws (as a client)", "the WebSocket global"],
  ["node-fetch", "fetch"], ["ts-node (erasable TypeScript)", "node file.ts"], ["nyc / c8", "--experimental-test-coverage"]];
template("mig-map", "migrations", 30, () => {
  const [pkg, builtin] = pick(MIGRATE);
  return { difficulty: "easy", question: `Which built-in Node feature replaces the ${pkg} package (for typical use)?`, correct: [builtin], wrong: uniq(MIGRATE.map((m) => m[1])).filter((b) => b !== builtin),
    explanation: `${pkg} → ${builtin}. Appendix B lists the common replacements.` };
});
template("mig-output", "migrations", 22, () => {
  const forms = [["import { styleText } from \"node:util\";\nconsole.log(JSON.stringify(styleText(\"green\", \"ok\")));", "medium"],
    ["const a = { d: new Date(0), list: [1] };\nconst b = structuredClone(a);\nb.list.push(2);\nconsole.log(a.list.length, b.d instanceof Date);", "easy"],
    ["const a = { d: new Date(0) };\nconst b = JSON.parse(JSON.stringify(a));\nconsole.log(b.d instanceof Date, typeof b.d);", "medium"],
    ["import { randomUUID } from \"node:crypto\";\nconst id = randomUUID();\nconsole.log(id.length, id[14]);", "hard"],
    ["import { parseArgs } from \"node:util\";\nconst { values } = parseArgs({ args: [\"-t\", \"a\", \"-t\", \"b\"], options: { tag: { type: \"string\", short: \"t\", multiple: true } } });\nconsole.log(values.tag);", "medium"]];
  const [code, diff] = pick(forms);
  return { difficulty: diff, question: "What does this print?", code, wrong: ["\"\\u001b[32mok\\u001b[39m\"", "1 false", "true object", "36 4", "[ 'b' ]", "2 true"],
    explanation: "styleText drops colour codes when output isn't a terminal; structuredClone deep-copies (keeping Dates); JSON round-trips turn Dates into strings; randomUUID returns v4 UUIDs (36 chars, '4' at index 14); parseArgs with multiple collects every value." };
});

// ================================================================ build
addHandwritten(h);
const handCount = questions.length;
for (const t of TEMPLATES) {
  const made = await runTemplate(t, t.quota);
  process.stderr.write(`${t.id}: ${made}/${t.quota}\n`);
}
for (let guard = 0; questions.length < TARGET * 1.3 && guard < 400; guard++) await runTemplate(TEMPLATES[guard % TEMPLATES.length], 1);

const countBy = (k) => questions.reduce((m, q) => ((m[q[k]] = (m[q[k]] || 0) + 1), m), {});
console.log("before trim:", questions.length, JSON.stringify(countBy("difficulty")));
while (questions.length > TARGET) {
  const byDiff = countBy("difficulty"), byTopic = countBy("topic");
  const over = Object.keys(SHARE).sort((a, b) => (byDiff[b] || 0) / SHARE[b] - (byDiff[a] || 0) / SHARE[a])[0];
  const cands = questions.map((q, i) => [q, i]).filter(([q]) => q.template && q.difficulty === over && q.answer.length === 1 && perTemplate[q.template] > 4 && byTopic[q.topic] > 40);
  if (!cands.length) { console.log("cannot trim further"); break; }
  const max = Math.max(...cands.map(([q]) => byTopic[q.topic]));
  const [q, i] = pick(cands.filter(([c]) => byTopic[c.topic] >= max - 3));
  questions.splice(i, 1); perTemplate[q.template]--;
}

const order = Object.keys(CHAPTERS);
questions.sort((a, b) => order.indexOf(a.topic) - order.indexOf(b.topic));
questions.forEach((q, i) => { q.id = i + 1; });
writeFileSync(join(ROOT, "questions.json"), JSON.stringify({
  version: 1, topic: "Node.js (Basics → Intermediate)", generated: new Date().toISOString().slice(0, 10), total: questions.length,
  chapters: Object.fromEntries(Object.entries(CHAPTERS).map(([k, [number, title, file]]) => [k, { number, title, file }])), questions,
}, null, 1) + "\n");

const multi = questions.filter((q) => q.answer.length > 1).length;
const pct = (n) => `${n} (${((100 * n) / questions.length).toFixed(1)}%)`;
console.log(`total: ${questions.length}  hand-written: ${handCount}  generated: ${questions.length - handCount}  multi-answer: ${pct(multi)}`);
console.log("difficulty:", Object.entries(countBy("difficulty")).map(([k, v]) => `${k} ${pct(v)}`).join(", "));
console.log("per topic:", Object.entries(countBy("topic")).map(([k, v]) => `${k} ${v}`).join(", "));
console.log("per template:", Object.entries(perTemplate).map(([k, v]) => `${k} ${v}`).join(", "));
