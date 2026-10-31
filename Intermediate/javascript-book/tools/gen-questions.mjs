// Generates questions.json for the JavaScript Study Book.
//
// Every template answer is computed by RUNNING its snippet: synchronous snippets run in a strict
// vm sandbox (module-like: strict mode, `this` undefined), async ones with real timers and
// microtasks. Distractors come from running deliberately "wrong" variants of the snippet (var
// instead of let, || instead of ??, a sort without comparator, …) or from naive mental models.
// tools/verify-questions.mjs then re-runs every snippet as a real ES module in a fresh Node process.
//
// Usage (Node 26+):  node tools/gen-questions.mjs && node tools/make-questions-js.mjs
import { writeFileSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import util from "node:util";
import vm from "node:vm";
import { addHandwritten } from "./questions-handwritten.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = 1000;
const SHARE = { easy: 0.4, medium: 0.45, hard: 0.15 };

const CHAPTERS = {
  intro: ["1", "Modern JavaScript & ECMAScript", "01-intro.html"],
  types: ["2", "Grammar, Types & Declarations", "02-types.html"],
  control: ["3", "Control Flow, Errors & Loops", "03-control.html"],
  functions: ["4", "Functions & Closures", "04-functions.html"],
  operators: ["5", "Operators, Destructuring & Equality", "05-operators.html"],
  text: ["6", "Numbers, Strings, Dates & Intl", "06-text.html"],
  regex: ["7", "Regular Expressions", "07-regex.html"],
  arrays: ["8", "Arrays & Typed Arrays", "08-arrays.html"],
  collections: ["9", "Maps, Sets & Weak Collections", "09-collections.html"],
  objects: ["10", "Working with Objects", "10-objects.html"],
  classes: ["11", "Classes & the Prototype Chain", "11-classes.html"],
  async: ["12", "Promises, async/await & the Event Loop", "12-async.html"],
  iterators: ["13", "Iterators & Generators", "13-iterators.html"],
  modules: ["14", "JavaScript Modules", "14-modules.html"],
  meta: ["15", "Metaprogramming & Resource Management", "15-meta.html"],
  project: ["16", "Project: Async Order Processor", "16-project.html"],
  es5: ["A", "ES5 to ES6+ Refresher", "appendix-es5.html"],
  tooling: ["B", "Node.js, npm & DevTools", "appendix-tooling.html"],
};

// ---------------------------------------------------------------- seeded random
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rand = mulberry32(20261030);
const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const chance = (p) => rand() < p;
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (arr, k) => shuffle(arr).slice(0, k);
const uniq = (arr) => [...new Set(arr)];
const js = (v) => JSON.stringify(v);

// ---------------------------------------------------------------- snippet runner
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function context(out, timers) {
  const log = (...a) => out.push(util.format(...a));
  const st = (fn, ms = 0, ...args) => { timers.n++; return setTimeout(() => { timers.n--; fn(...args); }, ms); };
  return vm.createContext({
    console: { log, error: log, info: log }, setTimeout: st, clearTimeout: (id) => { if (id) { clearTimeout(id); timers.n--; } },
    queueMicrotask, structuredClone, AbortController, AbortSignal, TextEncoder,
  });
}
// mode: "strict" (default, module-like), "async" (strict + await + timers), "sloppy" (classic script)
async function run(code, mode = "strict") {
  const out = [], timers = { n: 0 };
  const ctx = context(out, timers);
  const src = mode === "sloppy" ? code
    : mode === "async" ? `(async function () { "use strict";\n${code}\n}).call(undefined)`
      : `(function () { "use strict";\n${code}\n}).call(undefined)`;
  try {
    const result = vm.runInContext(src, ctx, { timeout: 2000 });
    if (mode === "async") {
      await Promise.race([result, sleep(3000).then(() => { throw new Error("timeout"); })]);
      for (let i = 0; i < 400 && timers.n > 0; i++) await sleep(5);
      await new Promise((r) => setImmediate(r));
    }
  } catch (e) {
    out.push(`throws ${e?.name ?? typeof e}`);
  }
  return out.join(" / ");
}

// ---------------------------------------------------------------- question store
const questions = [];
const seen = new Set();
const perTemplate = {};

function finalize(q) {
  const correct = uniq(q.correct.map(String)).filter((x) => x !== "");
  const wrong = uniq(q.wrong.map(String)).filter((w) => w !== "" && !correct.includes(w) && !/throws Error|timeout/.test(w));
  let options;
  if (q.exact) options = shuffle([...correct, ...wrong]);
  else {
    const n = correct.length > 1 ? Math.min(6, Math.max(4, correct.length + 2)) : 4;
    if (wrong.length < n - correct.length) return null;
    options = shuffle([...correct, ...shuffle(wrong).slice(0, n - correct.length)]);
  }
  if (!correct.length || options.length < 4 || options.length > 6) return null;
  const [number, , file] = CHAPTERS[q.topic];
  const out = { id: 0, topic: q.topic, chapter: number, chapterFile: file, difficulty: q.difficulty, question: q.question };
  if (q.code) out.code = q.code;
  out.options = options;
  out.answer = options.map((o, i) => (correct.includes(o) ? i : -1)).filter((i) => i >= 0);
  out.explanation = q.explanation;
  if (q.template) out.template = q.template;
  if (q.mode && q.mode !== "strict") out.mode = q.mode;           // used by the verifier
  if (q.args) out.args = q.args;
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

// Generic plausible perturbations of an output string (fallback distractors)
function perturb(s) {
  const outs = [];
  const m = s.match(/-?\d+(\.\d+)?/);
  if (m) {
    const n = Number(m[0]);
    outs.push(s.replace(m[0], String(n + 1)), s.replace(m[0], String(n - 1)));
  }
  outs.push("undefined", "throws TypeError", s.includes("true") ? s.replace("true", "false") : s.replace("false", "true"));
  return outs.filter((x) => x !== s);
}

const TEMPLATES = [];
const template = (id, topic, quota, gen) => TEMPLATES.push({ id, topic, quota, gen });
async function runTemplate(t, quota) {
  let made = 0, fails = 0;
  while (made < quota && fails < 60) {
    const spec = await t.gen();
    if (!spec) { fails++; continue; }
    let q = spec;
    if (spec.code && !spec.correct) {                       // compute the answer by running the snippet
      const correct = await run(spec.code, spec.mode);
      if (/timeout|throws Error/.test(correct)) { fails++; continue; }
      const variantOuts = [];
      for (const v of spec.variants ?? []) variantOuts.push(await run(v, spec.mode));
      q = { ...spec, correct: [correct], wrong: [...variantOuts, ...(spec.wrong ?? []), ...perturb(correct)] };
    }
    if (add({ ...q, topic: t.topic, template: t.id })) { made++; fails = 0; } else fails++;
  }
  perTemplate[t.id] = (perTemplate[t.id] ?? 0) + made;
  return made;
}

// ================================================================ pools
const WORDS = ["bookshop", "Dune", "invoice", "Temporal", "receipt", "category", "promise", "iterator"];
const NAMES = ["Ana", "Ben", "Chen", "Dee"];
const VALUE_POOL = ['0', '""', '" "', '"0"', '[]', '{}', 'null', 'undefined', 'NaN', '0n', '1n', '-0', '"false"', '[0]',
  'new Map()', 'Symbol("x")', '() => {}', 'class {}', 'new Date(0)', 'Infinity', '[[]]', '/x/', '42', '"text"', 'true', 'false'];

// ================================================================ Chapter 1: intro
const FEATURES = [["let and const", 2015], ["arrow functions", 2015], ["class syntax", 2015], ["Promise", 2015], ["template literals", 2015],
  ["destructuring", 2015], ["Map and Set", 2015], ["Symbol", 2015], ["Proxy and Reflect", 2015], ["import/export modules", 2015], ["for…of", 2015],
  ["generators (function*)", 2015], ["default parameters", 2015], ["the ** operator", 2016], ["Array.prototype.includes", 2016],
  ["async/await", 2017], ["Object.entries", 2017], ["String.prototype.padStart", 2017], ["object rest/spread", 2018],
  ["for await…of", 2018], ["regex named groups", 2018], ["Array.prototype.flat", 2019], ["Object.fromEntries", 2019],
  ["optional catch binding", 2019], ["optional chaining ?.", 2020], ["nullish coalescing ??", 2020], ["BigInt", 2020],
  ["Promise.allSettled", 2020], ["dynamic import()", 2020], ["globalThis", 2020], ["logical assignment ??=", 2021],
  ["String.prototype.replaceAll", 2021], ["Promise.any", 2021], ["numeric separators 1_000", 2021], ["WeakRef", 2021],
  ["#private class fields", 2022], ["class static blocks", 2022], ["top-level await", 2022], ["Array.prototype.at", 2022],
  ["Error cause", 2022], ["Object.hasOwn", 2022], ["Array.prototype.toSorted", 2023], ["Array.prototype.findLast", 2023],
  ["Object.groupBy", 2024], ["Promise.withResolvers", 2024], ["the regex v flag", 2024], ["iterator helpers", 2025],
  ["Set.prototype.union", 2025], ["Promise.try", 2025], ["RegExp.escape", 2025], ["JSON modules (import … with)", 2025]];
template("es-version", "intro", 45, async () => {
  const [f, y] = pick(FEATURES);
  const label = (yr) => (yr === 2015 ? "ES2015 (ES6)" : `ES${yr}`);
  return {
    difficulty: y <= 2017 ? "easy" : y <= 2021 ? "medium" : "hard",
    question: `In which ECMAScript edition did ${f} arrive?`,
    correct: [label(y)], wrong: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, "5"].filter((x) => x !== y).map((x) => (x === "5" ? "ES5" : label(x))),
    explanation: `${f} became part of the language in ${label(y)}.${y === 2015 ? " ES2015 (ES6) was the big modernisation release." : ""}`,
  };
});

const STRICT_STMTS = ['undeclaredVar = 1', 'Object.freeze({ a: 1 }).a = 2', 'undefined = 1', 'var o = {}; Object.defineProperty(o, "x", { value: 1 }); o.x = 2',
  '"abc".length = 1', 'var x = 1; delete x', 'function f(a, a) {}', 'var n = 010', 'with (Math) { cos(0) }', 'let y = 1; y = 2',
  'var s = "a"; s.toUpperCase()', 'Math.max(1, 2)', 'var arr = [1]; arr.push(2)', 'delete Object.prototype', 'var obj = {}; obj.a = 1'];
const strictCache = new Map();
async function strictOnly(stmt) {
  if (!strictCache.has(stmt)) {
    const sloppy = await run(stmt, "sloppy"), strict = await run(`"use strict";\n${stmt}`, "sloppy");
    strictCache.set(stmt, strict.includes("throws") && !sloppy.includes("throws"));
  }
  return strictCache.get(stmt);
}
template("strict-select", "intro", 18, async () => {
  const items = sample(STRICT_STMTS, 5);
  const flags = await Promise.all(items.map(strictOnly));
  const yes = items.filter((_, i) => flags[i]), no = items.filter((_, i) => !flags[i]);
  if (!yes.length || !no.length) return null;
  return {
    difficulty: "hard", exact: true, question: "Which statements throw an error in strict mode but run silently in sloppy mode? (select all that apply)",
    correct: yes, wrong: no,
    explanation: "Strict mode turns silent failures (undeclared assignments, writes to read-only properties, deleting non-deletable things) into errors, and forbids syntax like duplicate parameters, octal literals and with.",
  };
});

// ================================================================ Chapter 2: types
template("typeof-out", "types", 30, async () => {
  const e = pick(VALUE_POOL);
  return { difficulty: /null|NaN|class|\[\]|Map|Date/.test(e) ? "medium" : "easy", question: "What does this print?", code: `console.log(typeof (${e}));`,
    wrong: ["object", "function", "undefined", "number", "string", "boolean", "symbol", "bigint", "array", "null", "class"],
    explanation: "typeof returns one of 8 strings; quirks: null → \"object\", functions and classes → \"function\", arrays and dates → \"object\", NaN → \"number\"." };
});
template("tdz-hoist", "types", 30, async () => {
  const v = ri(1, 9);
  const forms = [
    [`console.log(x);\nvar x = ${v};`, [`console.log(x);\nlet x = ${v};`]],
    [`try {\n  console.log(x);\n} catch (e) {\n  console.log(e.name);\n}\nlet x = ${v};`, [`try {\n  console.log(x);\n} catch (e) {\n  console.log(e.name);\n}\nvar x = ${v};`]],
    [`console.log(f());\nfunction f() { return ${v}; }`, [`try { console.log(f()); } catch (e) { console.log(e.name); }\nconst f = () => ${v};`]],
    [`try {\n  console.log(g());\n} catch (e) {\n  console.log(e.name);\n}\nconst g = () => ${v};`, [`console.log(g());\nfunction g() { return ${v}; }`]],
    [`console.log(typeof notDeclared);`, []],
    [`let total = ${v};\nfunction show() { return total; }\ntotal = ${v + 1};\nconsole.log(show());`, [`let total = ${v};\nconsole.log(total);`]],
    [`let n = ${v};\n{\n  let n = ${v + 10};\n  console.log(n);\n}\nconsole.log(n);`, [`var n = ${v};\n{\n  var n = ${v + 10};\n  console.log(n);\n}\nconsole.log(n);`]],
  ];
  const [code, variants] = pick(forms);
  return { difficulty: code.includes("let x") || code.includes("const g") ? "medium" : code.includes("{\n  let n") ? "medium" : "easy",
    question: "What does this print?", code, variants, wrong: [String(v), "undefined", "ReferenceError", "TypeError"],
    explanation: "var is hoisted as undefined; function declarations are hoisted fully; let/const are in the temporal dead zone until their line runs; block-scoped let shadows the outer variable." };
});
template("const-ref", "types", 26, async () => {
  const xs = Array.from({ length: ri(2, 3) }, () => ri(1, 9));
  const copies = [["const b = a;", "same"], ["const b = [...a];", "spread"], ["const b = structuredClone(a);", "clone"], ["const b = Object.freeze(a);", "freeze"]];
  const [line, kind] = pick(copies);
  const code = `const a = ${js(xs)};\n${line}\nb.push(${ri(10, 20)});\nconsole.log(a.length, a === b);`;
  const variants = copies.filter((c) => c[1] !== kind).map(([l]) => `const a = ${js(xs)};\n${l}\nb.push(1);\nconsole.log(a.length, a === b);`);
  return { difficulty: kind === "freeze" ? "hard" : "medium", question: "What does this print?", code, variants,
    explanation: "const prevents re-assignment, not mutation. b = a shares the array; spread and structuredClone copy it; a frozen array can't grow, and in strict code push throws a TypeError." };
});

// ================================================================ Chapter 3: control
template("truthy-select", "control", 16, async () => {
  const items = sample(VALUE_POOL, 5);
  const vals = await Promise.all(items.map((e) => run(`console.log(Boolean(${e}))`)));
  const yes = items.filter((_, i) => vals[i] === "true"), no = items.filter((_, i) => vals[i] === "false");
  if (!yes.length || !no.length || yes.length + no.length !== 5) return null;
  return { difficulty: "medium", exact: true, question: "Which of these values are truthy? (select all that apply)", correct: yes, wrong: no,
    explanation: "Only false, 0, -0, 0n, \"\", null, undefined and NaN are falsy; every object (even [] and {}) and every non-empty string is truthy." };
});
template("switch-fall", "control", 26, async () => {
  const cases = sample([1, 2, 3, 4], 3).toSorted();
  const brk = cases.map(() => chance(0.5));
  const subject = pick([...cases, "\"" + cases[0] + "\"", 9]);
  const body = (withBreaks) => cases.map((c, i) => `  case ${c}:\n    out.push(${c});${withBreaks[i] ? "\n    break;" : ""}`).join("\n");
  const make = (wb) => `const out = [];\nswitch (${subject}) {\n${body(wb)}\n  default:\n    out.push("default");\n}\nconsole.log(out.join(" "));`;
  return { difficulty: subject === `"${cases[0]}"` ? "hard" : "medium", question: "What does this print?", code: make(brk),
    variants: [make(cases.map(() => true)), make(cases.map(() => false))],
    explanation: "switch compares with ===, then falls through into later cases (including default) until a break." };
});
template("try-flow", "control", 26, async () => {
  const forms = [
    () => `function f() {\n  try {\n    return "try";\n  } finally {\n    console.log("finally");\n  }\n}\nconsole.log(f());`,
    () => `function f() {\n  try {\n    throw new Error("x");\n  } catch (e) {\n    return "catch";\n  } finally {\n    console.log("cleanup");\n  }\n}\nconsole.log(f());`,
    () => `function f() {\n  try {\n    throw new Error("lost");\n  } finally {\n    return "finally wins";\n  }\n}\nconsole.log(f());`,
    () => `const log = [];\ntry {\n  log.push("a");\n  JSON.parse("{bad");\n  log.push("b");\n} catch {\n  log.push("c");\n} finally {\n  log.push("d");\n}\nconsole.log(log.join(""));`,
    () => `const log = [];\nfor (const n of [1, 2, 3]) {\n  try {\n    if (n === 2) continue;\n    log.push(n);\n  } finally {\n    log.push("f");\n  }\n}\nconsole.log(log.join(" "));`,
  ];
  const code = pick(forms)();
  return { difficulty: code.includes("finally wins") || code.includes("continue") ? "hard" : "medium", question: "What does this print?", code,
    wrong: ["try", "catch", "finally / try", "abd", "abcd", "1 f 3 f", "throws Error"],
    explanation: "finally always runs (after the return value is computed, after catch, even on continue); a return inside finally overrides everything." };
});
template("for-in-of", "control", 22, async () => {
  const xs = sample(["Dune", "Emma", "Hamlet", "Ulysses"], ri(2, 3));
  const forms = [
    [`const books = ${js(xs)};\nbooks.extra = "x";\nconst seen = [];\nfor (const k in books) seen.push(k);\nconsole.log(seen.join(","));`, "in"],
    [`const books = ${js(xs)};\nbooks.extra = "x";\nconst seen = [];\nfor (const k of books) seen.push(k);\nconsole.log(seen.join(","));`, "of"],
    [`let s = 0;\nfor (const i in [10, 20]) s += i;\nconsole.log(s);`, "in"],
    [`let s = 0;\nfor (const i of [10, 20]) s += i;\nconsole.log(s);`, "of"],
  ];
  const [code, kind] = pick(forms);
  return { difficulty: code.includes("s +=") ? "hard" : "easy", question: "What does this print?", code,
    variants: [kind === "in" ? code.replace(" in ", " of ") : code.replace(" of ", " in ")],
    explanation: "for…in walks enumerable string KEYS (including added properties like extra); for…of walks the iterable's VALUES." };
});
const ERR_STMTS = [['null.title', "TypeError"], ['undefinedName + 1', "ReferenceError"], ['new Array(-1)', "RangeError"], ['JSON.parse("{bad}")', "SyntaxError"],
  ['(1).toFixed(200)', "RangeError"], ['const k = 1; k = 2;', "TypeError"], ['decodeURIComponent("%")', "URIError"], ['Symbol() + ""', "TypeError"],
  ['1n + 1', "TypeError"], ['({}).run()', "TypeError"], ['"abc".repeat(-1)', "RangeError"], ['new (() => {})()', "TypeError"], ['BigInt(1.5)', "RangeError"],
  ['Object.defineProperty(Object.freeze({}), "x", { value: 1 })', "TypeError"], ['x; let x = 1;', "ReferenceError"]];
template("error-name", "control", 26, async () => {
  const [stmt] = pick(ERR_STMTS);
  return { difficulty: /toFixed|repeat|BigInt|URI|Symbol|=>|defineProperty/.test(stmt) ? "medium" : "easy",
    question: "What does this print?", code: `try {\n  ${stmt}\n} catch (e) {\n  console.log(e.name);\n}`,
    wrong: ["TypeError", "ReferenceError", "RangeError", "SyntaxError", "URIError", "Error"],
    explanation: "TypeError: wrong use of a value; ReferenceError: unknown name or TDZ; RangeError: number out of range; SyntaxError: invalid code or JSON; URIError: bad URI encoding." };
});

// ================================================================ Chapter 4: functions
template("this-call", "functions", 30, async () => {
  const [o1, o2] = sample(NAMES, 2);
  const head = `const shop = {\n  name: "${o1}",\n  who() { return this?.name ?? "undefined"; },\n  arrow: () => typeof this,\n  later() { return [1].map(() => this.name)[0]; },\n};\n`;
  const calls = [`shop.who()`, `const f = shop.who;\nconsole.log(f());`, `shop.who.call({ name: "${o2}" })`, `shop.who.bind({ name: "${o2}" }).call({ name: "x" })`,
    `shop.arrow()`, `shop.later()`, `const { who } = shop;\nconsole.log(who());`];
  const c = pick(calls);
  const code = head + (c.includes("console.log") ? c : `console.log(${c});`);
  return { difficulty: c.includes("bind") || c.includes("arrow") ? "hard" : c.startsWith("shop.who()") ? "easy" : "medium",
    question: "What does this print (in a module)?", code, wrong: [o1, o2, "undefined", "object", "x", "throws TypeError"],
    explanation: "this is set by how a function is called: method call → the object; plain call → undefined in strict code; call/bind set it explicitly (bind wins permanently); arrows use the surrounding this." };
});
template("default-param", "functions", 26, async () => {
  const d = ri(2, 9);
  const arg = pick(["", "undefined", "null", "0", '""', "5"]);
  const code = `function f(a, b = ${d}) {\n  return [a, b];\n}\nconsole.log(JSON.stringify(f(1${arg ? ", " + arg : ""})));`;
  const es5 = `function f(a, b) {\n  b = b || ${d};\n  return [a, b];\n}\nconsole.log(JSON.stringify(f(1${arg ? ", " + arg : ""})));`;
  return { difficulty: ["null", "0", '""'].includes(arg) ? "medium" : "easy", question: "What does this print?", code, variants: [es5],
    wrong: [`[1,${d}]`, "[1,null]", "[1,0]"],
    explanation: "A default parameter applies only when the argument is undefined (or missing); null, 0 and \"\" are kept. The old b = b || default trick would replace them." };
});
template("closure-loop", "functions", 26, async () => {
  const n = ri(2, 4), k = ri(1, 3), kw = pick(["var", "let"]);
  const make = (w) => `const fns = [];\nfor (${w} i = 0; i < ${n}; i++) {\n  fns.push(() => i * ${k});\n}\nconsole.log(fns.map((f) => f()).join(","));`;
  return { difficulty: kw === "var" ? "hard" : "medium", question: "What does this print?", code: make(kw), variants: [make(kw === "var" ? "let" : "var")],
    explanation: "Closures capture variables, not values. var has one function-scoped i (already at its final value when the functions run); let creates a fresh i for every iteration." };
});
template("rest-args", "functions", 20, async () => {
  const args = Array.from({ length: ri(0, 4) }, () => ri(1, 9));
  const code = `function f(first, ...rest) {\n  return \`\${first} | \${rest.length} | \${arguments.length}\`;\n}\nconsole.log(f(${args.join(", ")}));`;
  return { difficulty: args.length < 2 ? "medium" : "easy", question: "What does this print?", code,
    wrong: [`${args[0]} | ${args.length} | ${args.length}`, `${args[0]} | ${Math.max(0, args.length - 1)} | ${Math.max(0, args.length - 1)}`, `undefined | 0 | 0`],
    explanation: "...rest collects the arguments after the named ones into a real array; the legacy arguments object still counts all of them (regular functions only)." };
});

// ================================================================ Chapter 5: operators
const OPERANDS = ["0", "1", '""', '"a"', "null", "undefined", "false", "NaN", "[]"];
template("nullish-or", "operators", 30, async () => {
  const [a, b, c] = [pick(OPERANDS), pick(OPERANDS), pick(OPERANDS)];
  const forms = [[`${a} ?? ${b}`, `${a} || ${b}`], [`${a} || ${b}`, `${a} ?? ${b}`], [`${a} && ${b}`, `${a} || ${b}`], [`(${a} ?? ${b}) || ${c}`, `(${a} || ${b}) ?? ${c}`]];
  const [expr, alt] = pick(forms);
  return { difficulty: expr.includes("(") ? "hard" : "medium", question: "What does this print?", code: `console.log(${expr});`, variants: [`console.log(${alt});`],
    wrong: ["true", "false", "null", "undefined"],
    explanation: "|| returns the first truthy operand (else the last); && the first falsy (else the last); ?? replaces only null and undefined, so 0, \"\", false and NaN survive it." };
});
template("logical-assign", "operators", 24, async () => {
  const fields = { a: pick([0, 5, null]), b: pick(['""', '"x"', "null"]), c: pick(["true", "false", "undefined"]) };
  const ops = sample(["??=", "||=", "&&="], 3);
  const lines = ["a", "b", "c"].map((k, i) => `o.${k} ${ops[i]} ${k === "a" ? 9 : k === "b" ? '"y"' : '"z"'};`);
  const make = (ls) => `const o = { a: ${fields.a}, b: ${fields.b}, c: ${fields.c} };\n${ls.join("\n")}\nconsole.log(JSON.stringify(o));`;
  const rotated = ["a", "b", "c"].map((k, i) => `o.${k} ${ops[(i + 1) % 3]} ${k === "a" ? 9 : k === "b" ? '"y"' : '"z"'};`);
  return { difficulty: "hard", question: "What does this print?", code: make(lines), variants: [make(rotated), make(lines.map((l) => l.replace(/\S+=/, "=")))],
    explanation: "??= assigns when the value is null/undefined, ||= when it is falsy, &&= when it is truthy. (JSON.stringify drops properties whose value is undefined.)" };
});
template("destructure", "operators", 26, async () => {
  const forms = [
    () => { const src = js({ a: pick([1, null, undefined, 0]) }); return [`const { a = 5, b = 6 } = ${src.replace('"a"', "a")};\nconsole.log(a, b);`, `const { a, b } = ${src.replace('"a"', "a")};\nconsole.log(a, b);`]; },
    () => { const arr = Array.from({ length: ri(1, 4) }, () => ri(1, 9)); return [`const [x, , y = "none", ...rest] = ${js(arr)};\nconsole.log(x, y, rest.length);`, `const [x, y = "none", ...rest] = ${js(arr)};\nconsole.log(x, y, rest.length);`]; },
    () => [`const { title: t, price: p = 0, ...others } = { title: "Dune", stock: 3, tags: [] };\nconsole.log(t, p, Object.keys(others).join("+"));`, `const { title: t, price: p = 0, others } = { title: "Dune", stock: 3, tags: [] };\nconsole.log(t, p, others);`],
    () => [`let a = 1, b = 2;\n[a, b] = [b, a + b];\nconsole.log(a, b);`, `let a = 1, b = 2;\na = b;\nb = a + b;\nconsole.log(a, b);`],
  ];
  const [code, variant] = pick(forms)();
  return { difficulty: code.includes("...") ? "medium" : "easy", question: "What does this print?", code, variants: [variant],
    explanation: "Destructuring defaults apply only for undefined (not null or 0); holes skip positions; ...rest collects the remainder; the right side of a swap is evaluated before assigning." };
});
const EQ_POOL = ['"1" == 1', '"1" === 1', 'null == undefined', 'null === undefined', 'null == 0', 'NaN == NaN', 'Object.is(NaN, NaN)', '0 === -0',
  'Object.is(0, -0)', '[NaN].includes(NaN)', '[NaN].indexOf(NaN) !== -1', '[] == false', '"" == 0', '[1, 2] == "1,2"', '({}) === ({})', '"b" > "a"', '"B" > "a"'];
template("equality-select", "operators", 20, async () => {
  const items = sample(EQ_POOL, 5);
  const vals = await Promise.all(items.map((e) => run(`console.log(${e})`)));
  const yes = items.filter((_, i) => vals[i] === "true"), no = items.filter((_, i) => vals[i] === "false");
  if (!yes.length || !no.length) return null;
  return { difficulty: "hard", exact: true, question: "Which expressions evaluate to true? (select all that apply)", correct: yes, wrong: no,
    explanation: "== converts types first; === doesn't; Object.is also distinguishes -0 and equates NaN; includes uses SameValueZero (finds NaN) while indexOf uses ===; objects compare by identity; strings by code unit." };
});
template("spread-merge", "operators", 20, async () => {
  const a = { x: ri(1, 5), y: ri(1, 5) }, b = { y: ri(6, 9), z: ri(6, 9) };
  const code = `const a = ${js(a).replace(/"(\w)":/g, "$1: ")};\nconst b = ${js(b).replace(/"(\w)":/g, "$1: ")};\nconsole.log(JSON.stringify({ ...a, ...b, x: 0 }));`;
  return { difficulty: "medium", question: "What does this print?", code,
    variants: [code.replace("{ ...a, ...b, x: 0 }", "{ ...b, ...a, x: 0 }"), code.replace("{ ...a, ...b, x: 0 }", "{ x: 0, ...a, ...b }")],
    explanation: "Spread copies properties left to right; a later property with the same key overrides the value but keeps the key's original position." };
});

// ================================================================ Chapter 6: text
const NUM_STRS = ['"12px"', '"  42 "', '"0x1A"', '""', '"3.9e2"', '"1_000"', '"08"', '"-0"', '"Infinity"', '"12.50"'];
template("number-conv", "text", 30, async () => {
  const s = pick(NUM_STRS);
  const fns = ["Number", "parseInt", "parseFloat", "+"];
  const fn = pick(fns);
  const call = (f) => (f === "+" ? `+${s}` : `${f}(${s})`);
  return { difficulty: fn === "+" || s === '""' || s === '"1_000"' ? "medium" : "easy", question: "What does this print?", code: `console.log(${call(fn)});`,
    variants: fns.filter((f) => f !== fn).map((f) => `console.log(${call(f)});`), wrong: ["NaN", "0"],
    explanation: "Number()/+ need the whole (trimmed) string to be numeric and treat \"\" as 0; parseInt/parseFloat read a numeric prefix and stop at the first invalid character (parseInt also stops at the decimal point)." };
});
template("string-op", "text", 30, async () => {
  const w = pick(WORDS), n = w.length;
  const ops = [`slice(${ri(0, 2)}, ${ri(3, n)})`, `slice(-${ri(1, 4)})`, `at(-${ri(1, 3)})`, `padStart(${n + ri(1, 3)}, "*")`, `padEnd(${n + 2}, ".")`,
    `split("${w[ri(1, n - 2)]}")`, `replaceAll("${w[ri(0, n - 1)]}", "_")`, `replace("${w[ri(0, n - 1)]}", "_")`, `substring(${ri(3, n)}, ${ri(0, 2)})`, `indexOf("${w[ri(0, n - 1)]}")`, `repeat(2).length`];
  const op = pick(ops);
  const code = `console.log(JSON.stringify("${w}".${op}));`;
  const variants = [code.replace(/(\d+)\)/, (m, d) => `${Number(d) + 1})`), code.replace("replaceAll", "replace"), code.replace("slice", "substring")].filter((v) => v !== code);
  return { difficulty: /substring|split|replace\(/.test(op) ? "medium" : "easy", question: "What does this print?", code, variants,
    explanation: "slice/substring take start (inclusive) and end (exclusive) — substring swaps reversed arguments, slice accepts negatives; at accepts negatives; replace changes only the first match, replaceAll every one." };
});
template("date-utc", "text", 22, async () => {
  const y = 2026, m = pick([0, 1, 9, 11, 12]), d = pick([1, 15, 28, 0, 31, 32]);
  const code = `const d = new Date(Date.UTC(${y}, ${m}, ${d}));\nconsole.log(d.toISOString().slice(0, 10));`;
  return { difficulty: m === 12 || d === 0 || d >= 31 ? "hard" : "medium", question: "What does this print?", code,
    variants: [code.replace(`Date.UTC(${y}, ${m},`, `Date.UTC(${y}, ${m + 1},`), code.replace(`Date.UTC(${y}, ${m},`, `Date.UTC(${y}, ${Math.max(0, m - 1)},`)],
    explanation: "Date months are 0-based (0 = January) and out-of-range parts roll over: month 12 is January of the next year, day 0 is the last day of the previous month." };
});

// ================================================================ Chapter 7: regex
const TEXTS = ["Dune 1299, Emma 899 and Hamlet 650", "ORD-0042 3x b1, 1x b7", "Ana: ana@example.com, Ben: ben@test.org", "2026-10-30 and 2026-11-02"];
const PATTERNS = ["\\d+", "\\b[A-Z]\\w*", "\\d{4}-\\d{2}", "(\\w+)@(\\w+)", "b\\d", "[aeiou]{2}", "\\d+(?=x)"];
template("regex-match", "regex", 30, async () => {
  const t = pick(TEXTS), p = pick(PATTERNS), g = chance(0.6);
  const code = `console.log(JSON.stringify(${js(t)}.match(/${p}/${g ? "g" : ""})));`;
  return { difficulty: p.includes("(") ? "hard" : g ? "easy" : "medium", question: "What does this print?", code,
    variants: [g ? code.replace(`/${p}/g`, `/${p}/`) : code.replace(`/${p}/`, `/${p}/g`)], wrong: ["null", "[]"],
    explanation: "Without g, match returns the first match plus its groups (or null); with g, it returns an array of every matched string, without groups." };
});
template("regex-replace", "regex", 26, async () => {
  const forms = [
    [`"2026-10-30".replace(/(\\d+)-(\\d+)-(\\d+)/, "$3/$2/$1")`, `"2026-10-30".replace(/(\\d+)-(\\d+)-(\\d+)/, "$1/$2/$3")`],
    [`"Herbert, Frank".replace(/^(?<last>[^,]+),\\s*(?<first>.+)$/, "$<first> $<last>")`, `"Herbert, Frank".replace(/^(?<last>[^,]+),\\s*(?<first>.+)$/, "$<last> $<first>")`],
    [`"a-b-c".replace(/-/, "+")`, `"a-b-c".replace(/-/g, "+")`],
    [`"a-b-c".replace(/-/g, "+")`, `"a-b-c".replace(/-/, "+")`],
    [`"b1:3, b2:10".replace(/(\\d+)(?=,|$)/g, (q) => q * 2)`, `"b1:3, b2:10".replace(/(\\d+)/g, (q) => q * 2)`],
    [`"price 100 qty 3".replace(/\\d+(?! qty)/g, "#")`, `"price 100 qty 3".replace(/\\d+/g, "#")`],
    [`"<b>a</b><b>b</b>".replace(/<b>.*<\\/b>/, "X")`, `"<b>a</b><b>b</b>".replace(/<b>.*?<\\/b>/, "X")`],
  ];
  const [expr, alt] = pick(forms);
  return { difficulty: /\?!|\.\*|=>/.test(expr) ? "hard" : "medium", question: "What does this print?", code: `console.log(${expr});`, variants: [`console.log(${alt});`],
    explanation: "Without g only the first match is replaced; $1/$<name> insert groups; a function receives each match; greedy .* grabs as much as possible; lookarounds may make the engine backtrack to a shorter match." };
});
template("lastindex", "regex", 14, async () => {
  const s = pick(["book", "aa", "Dune", "xox"]), ch = pick(["o", "a", "x"]);
  const make = (f) => `const re = /${ch}/${f};\nconsole.log(re.test("${s}"), re.test("${s}"), re.test("${s}"));`;
  return { difficulty: "hard", question: "What does this print?", code: make("g"), variants: [make("")],
    explanation: "A g (or y) regex remembers lastIndex between test()/exec() calls, so repeated calls on the same string continue from the previous match and eventually fail (resetting lastIndex to 0)." };
});

// ================================================================ Chapter 8: arrays
template("array-chain", "arrays", 30, async () => {
  const xs = Array.from({ length: ri(4, 6) }, () => ri(1, 20));
  const steps = [["map((n) => n * 2)"], ["filter((n) => n % 2 === 0)"], ["filter((n) => n > 10)"], ["slice(1, 3)"], ["map((n) => n % 7)"]];
  const chain = sample(steps, ri(2, 3)).map((s) => s[0]);
  const tail = pick([".join(\",\")", ".reduce((a, b) => a + b, 0)", ".length"]);
  const make = (c) => `const nums = ${js(xs)};\nconsole.log(nums.${c.join(".")}${tail});`;
  return { difficulty: chain.length > 2 ? "hard" : "medium", question: "What does this print?", code: make(chain), variants: [make([...chain].reverse()), make(chain.slice(1))],
    explanation: "Each array method returns a new array that the next one works on, so the order of map/filter/slice matters." };
});
template("default-sort", "arrays", 24, async () => {
  const xs = uniq(Array.from({ length: 5 }, () => pick([1, 2, 5, 9, 10, 25, 100, 3, 40]))).slice(0, 4);
  if (xs.length < 3) return null;
  const cmp = pick(["", "(a, b) => a - b", "(a, b) => b - a"]);
  const make = (c) => `console.log(${js(xs)}.toSorted(${c}).join(","));`;
  return { difficulty: cmp === "" ? "medium" : "easy", question: "What does this print?", code: make(cmp), variants: ["", "(a, b) => a - b", "(a, b) => b - a"].filter((c) => c !== cmp).map(make),
    explanation: "Without a comparator, sort/toSorted compare items as strings (so 10 comes before 9); pass (a, b) => a - b for numeric order." };
});
const METHODS = ["push(4)", "pop()", "shift()", "unshift(0)", "splice(0, 1)", "sort()", "reverse()", "fill(0)", "slice(1)", "map((x) => x)", "toSorted()", "toReversed()", "with(0, 9)", "concat([4])", "at(-1)", "copyWithin(0, 1)", "filter(Boolean)", "flat()"];
template("mutate-select", "arrays", 20, async () => {
  const items = sample(METHODS, 5);
  const flags = await Promise.all(items.map((m) => run(`const a = [3, 1, 2];\nconst before = JSON.stringify(a);\na.${m};\nconsole.log(JSON.stringify(a) !== before);`)));
  const yes = items.filter((_, i) => flags[i] === "true"), no = items.filter((_, i) => flags[i] === "false");
  if (!yes.length || !no.length) return null;
  return { difficulty: "medium", exact: true, question: "Called on const a = [3, 1, 2], which of these change a itself? (select all that apply)", correct: yes.map((m) => `a.${m}`), wrong: no.map((m) => `a.${m}`),
    explanation: "push/pop/shift/unshift/splice/sort/reverse/fill/copyWithin mutate; slice, map, filter, concat, flat, at and the ES2023 toSorted/toReversed/toSpliced/with return new values." };
});
template("copy-methods", "arrays", 24, async () => {
  const xs = Array.from({ length: 4 }, () => ri(1, 9));
  const forms = [["toSpliced(1, 2)", "splice(1, 2)"], ["with(1, 0)", "fill(0, 1, 2)"], ["toReversed()", "reverse()"], ["toSorted()", "sort()"]];
  const [good, bad] = pick(forms);
  const make = (m) => `const a = ${js(xs)};\nconst b = a.${m};\nconsole.log(JSON.stringify(a), JSON.stringify(b));`;
  return { difficulty: "medium", question: "What does this print?", code: make(good), variants: [make(bad)],
    explanation: "The ES2023 copy methods return a changed copy and leave the original alone; their older counterparts mutate (and splice returns the removed items)." };
});
template("flat", "arrays", 18, async () => {
  const nested = pick(["[1, [2, [3, [4]]]]", "[[1, 2], [3], []]", "[[\"a\", [\"b\"]], \"c\"]", "[1, , 3]"]);
  const op = pick(["flat()", "flat(2)", "flat(Infinity)", "flatMap((x) => [x, x])"]);
  return { difficulty: op.includes("flatMap") || nested.includes(", ,") ? "hard" : "medium", question: "What does this print?",
    code: `console.log(JSON.stringify(${nested}.${op}));`, variants: ["flat()", "flat(2)", "flat(Infinity)"].filter((o) => o !== op).map((o) => `console.log(JSON.stringify(${nested}.${o}));`),
    explanation: "flat(depth) flattens that many levels (default 1) and drops holes; flatMap maps then flattens one level." };
});

// ================================================================ Chapter 9: collections
template("map-ops", "collections", 26, async () => {
  const keys = sample(['"b"', '"a"', "2", "1", '"10"'], 4);
  const lines = keys.map((k) => `m.set(${k}, ${ri(1, 9)});`);
  if (chance(0.5)) lines.push(`m.set(${keys[0]}, 0);`);
  if (chance(0.5)) lines.push(`m.delete(${keys[1]});`);
  const code = `const m = new Map();\n${lines.join("\n")}\nconsole.log(m.size, [...m.keys()].join(","));`;
  const asObject = `const m = {};\n${lines.map((l) => l.replace(/m\.set\(([^,]+), ([^)]+)\);/, "m[$1] = $2;").replace(/m\.delete\(([^)]+)\);/, "delete m[$1];")).join("\n")}\nconsole.log(Object.keys(m).length, Object.keys(m).join(","));`;
  return { difficulty: keys.some((k) => /^\d/.test(k)) ? "medium" : "easy", question: "What does this print?", code, variants: [asObject],
    explanation: "A Map keeps insertion order (updating a key keeps its place), counts entries in size, and distinguishes 1 from \"1\"; a plain object would list integer-like keys first and turn every key into a string." };
});
template("set-methods", "collections", 22, async () => {
  const A = sample([1, 2, 3, 4, 5, 6], ri(2, 4)), B = sample([1, 2, 3, 4, 5, 6], ri(2, 4));
  const ops = ["union", "intersection", "difference", "symmetricDifference"];
  const op = pick(ops);
  const make = (o) => `const a = new Set(${js(A)});\nconst b = new Set(${js(B)});\nconsole.log([...a.${o}(b)].join(","));`;
  return { difficulty: op === "symmetricDifference" || op === "difference" ? "medium" : "easy", question: "What does this print?", code: make(op), variants: ops.filter((o) => o !== op).map(make),
    explanation: "ES2025 Set methods: union (in either), intersection (in both), difference (in a only), symmetricDifference (in exactly one); results keep a's insertion order first." };
});
template("groupby", "collections", 18, async () => {
  const xs = Array.from({ length: ri(4, 6) }, () => ri(1, 30));
  const fns = [["(n) => (n % 2 ? \"odd\" : \"even\")"], ["(n) => (n > 15 ? \"big\" : \"small\")"], ["(n) => String(n).length"]];
  const [fn] = pick(fns);
  const code = `const g = Object.groupBy(${js(xs)}, ${fn});\nconsole.log(Object.keys(g).join(","), Object.values(g).map((v) => v.length).join(","));`;
  return { difficulty: "easy", question: "What does this print?", code, variants: [code.replace("Object.keys(g).join(\",\")", "Object.keys(g).toSorted().join(\",\")")],
    explanation: "Object.groupBy creates one array per key returned by the callback; keys appear in the order they are first produced." };
});

// ================================================================ Chapter 10: objects
template("key-order", "objects", 24, async () => {
  const keys = sample(["b", "10", "a", "2", "-1", "01", "z", "1"], 5);
  const lit = keys.map((k) => (/^\d+$/.test(k) && !k.startsWith("0") ? `${k}: 0` : `"${k}": 0`)).join(", ");
  const code = `console.log(Object.keys({ ${lit} }).join(","));`;
  return { difficulty: keys.some((k) => /^(-1|01)$/.test(k)) ? "hard" : "medium", question: "What does this print?", code,
    variants: [`console.log([...new Map([${keys.map((k) => `["${k}", 0]`).join(", ")}]).keys()].join(","));`], wrong: [keys.toSorted().join(",")],
    explanation: "Integer-like keys (canonical array indexes) come first in ascending order, then other string keys in insertion order; \"-1\" and \"01\" count as ordinary strings." };
});
template("listing", "objects", 22, async () => {
  const methods = ["Object.keys(obj)", "Object.getOwnPropertyNames(obj)", "Reflect.ownKeys(obj).map(String)", "Object.keys({ ...obj })", "Object.keys(JSON.parse(JSON.stringify(obj)))", "inKeys(obj)"];
  const m = pick(methods);
  const setup = `const base = { inherited: 1 };\nconst obj = Object.create(base);\nobj.own = 2;\nobj[Symbol("id")] = 3;\nObject.defineProperty(obj, "hidden", { value: 4 });\nconst inKeys = (o) => { const ks = []; for (const k in o) ks.push(k); return ks; };\n`;
  return { difficulty: "hard", question: "What does this print?", code: setup + `console.log(${m}.join(","));`, variants: methods.filter((x) => x !== m).map((x) => setup + `console.log(${x}.join(","));`),
    explanation: "keys/spread/JSON: own enumerable string keys; for…in adds inherited enumerable keys; getOwnPropertyNames adds non-enumerable ones; Reflect.ownKeys adds symbols too." };
});
template("shallow-copy", "objects", 20, async () => {
  const how = pick(["{ ...order }", "Object.assign({}, order)", "structuredClone(order)"]);
  const make = (c) => `const order = { id: "o1", meta: { gift: true } };\nconst copy = ${c};\ncopy.id = "o2";\ncopy.meta.gift = false;\nconsole.log(order.id, order.meta.gift);`;
  return { difficulty: how.startsWith("structured") ? "easy" : "medium", question: "What does this print?", code: make(how), variants: ["{ ...order }", "structuredClone(order)", "order"].filter((c) => c !== how).map(make),
    explanation: "Spread and Object.assign copy only the top level (nested objects are shared); structuredClone copies deeply; plain assignment shares everything." };
});

// ================================================================ Chapter 11: classes
template("class-inherit", "classes", 26, async () => {
  const [p, c] = sample(["Product", "Item", "Thing"], 2);
  const useSuper = chance(0.6);
  const make = (s) => `class ${p} {\n  constructor(name) { this.name = name; }\n  label() { return "${p}:" + this.name; }\n}\nclass ${c} extends ${p} {\n  label() { return ${s ? "super.label() + \"+\"" : `"${c}:" + this.name`}; }\n}\nconst x = new ${c}("${pick(WORDS)}");\nconsole.log(x.label(), x instanceof ${p});`;
  return { difficulty: useSuper ? "medium" : "easy", question: "What does this print?", code: make(useSuper), variants: [make(!useSuper)],
    explanation: "The subclass inherits the constructor, overrides label, and super.label() calls the parent's version; an instance of the subclass is also instanceof the parent." };
});
template("class-fields", "classes", 22, async () => {
  const n = ri(2, 4);
  const code = `class Ticket {\n  static issued = 0;\n  #secret = "s";\n  number = ++Ticket.issued;\n  hasSecret() { return #secret in this; }\n}\nconst ts = Array.from({ length: ${n} }, () => new Ticket());\nconsole.log(ts.at(-1).number, Ticket.issued, Object.keys(ts[0]).join(","), ts[0].hasSecret(), ts[0].secret);`;
  return { difficulty: "hard", question: "What does this print?", code, wrong: [`${n} ${n} number,#secret true s`, `1 ${n} number true undefined`, `${n} 0 number true undefined`],
    explanation: "Static fields belong to the class; instance fields are initialised per object (in order); #private fields are invisible to Object.keys and to ordinary property access, but #x in obj can test for them." };
});
template("proto-shadow", "classes", 18, async () => {
  const code = `class Book {\n  describe() { return "proto"; }\n}\nconst b = new Book();\nb.describe = () => "own";\nconst first = b.describe();\ndelete b.describe;\nconsole.log(first, b.describe(), Object.hasOwn(b, "describe"));`;
  const variant = pick([code, code.replace("delete b.describe;\n", "")]);
  return { difficulty: "medium", question: "What does this print?", code: variant, variants: [variant === code ? code.replace("delete b.describe;\n", "") : code],
    explanation: "An own property shadows the same name on the prototype; deleting it reveals the prototype's method again." };
});

// ================================================================ Chapter 12: async (mode: async)
const EVENTS = [
  (t) => [`console.log("${t}");`, "sync"],
  (t) => [`setTimeout(() => console.log("${t}"), 0);`, "macro"],
  (t) => [`Promise.resolve().then(() => console.log("${t}"));`, "micro"],
  (t) => [`queueMicrotask(() => console.log("${t}"));`, "micro"],
  (t) => [`(async () => { await null; console.log("${t}"); })();`, "micro"],
];
template("event-loop", "async", 40, async () => {
  const labels = ["A", "B", "C", "D", "E"].slice(0, ri(3, 5));
  const evs = labels.map((l) => pick(EVENTS)(l));
  if (new Set(evs.map((e) => e[1])).size < 2) return null;
  const code = evs.map((e) => e[0]).join("\n");
  const naive = labels.join(" / ");                                              // "runs in written order"
  const timersFirst = [...labels.filter((_, i) => evs[i][1] === "sync"), ...labels.filter((_, i) => evs[i][1] === "macro"), ...labels.filter((_, i) => evs[i][1] === "micro")].join(" / ");
  return { mode: "async", difficulty: labels.length > 3 ? "hard" : "medium", question: "In what order are the letters printed?", code, wrong: [naive, timersFirst, [...labels].reverse().join(" / ")],
    explanation: "Synchronous code runs first, then ALL microtasks (promise callbacks, queueMicrotask, code after await) in the order they were queued, then macrotasks such as setTimeout callbacks." };
});
template("combinator", "async", 30, async () => {
  const tasks = Array.from({ length: 3 }, (_, i) => ({ v: `t${i + 1}`, ms: ri(1, 6) * 5, fail: chance(0.35) }));
  if (new Set(tasks.map((t) => t.ms)).size < 3) return null;
  const comb = pick(["all", "allSettled", "any", "race"]);
  const head = `const delay = (ms, v, fail) => new Promise((res, rej) => setTimeout(() => (fail ? rej(new Error(v)) : res(v)), ms));\nconst tasks = () => [${tasks.map((t) => `delay(${t.ms}, "${t.v}", ${t.fail})`).join(", ")}];\n`;
  const body = (c) => `try {\n  const r = await Promise.${c}(tasks());\n  console.log(${c === "allSettled" ? 'r.map((x) => x.status[0]).join("")' : "String(r)"});\n} catch (e) {\n  console.log("rejected:", e.constructor.name, e.message);\n}`;
  return { mode: "async", difficulty: comb === "any" || comb === "race" ? "hard" : "medium", question: `What does this print? (each task: ${tasks.map((t) => `${t.v} ${t.fail ? "rejects" : "fulfils"} after ${t.ms} ms`).join(", ")})`,
    code: head + body(comb), variants: ["all", "allSettled", "any", "race"].filter((c) => c !== comb).map((c) => head + body(c)),
    explanation: "all: every value in input order, or the first rejection; allSettled: each outcome; any: the first fulfilment, or AggregateError if all reject; race: whatever settles first, fulfilled or rejected." };
});
template("async-flow", "async", 22, async () => {
  const failAt = pick([0, 1, 2]);
  const code = `const step = async (n) => { if (n === ${failAt}) throw new Error("step " + n); return n; };\nconst log = [];\nasync function run() {\n  try {\n    for (const n of [1, 2]) log.push(await step(n));\n    return "done";\n  } catch (e) {\n    log.push(e.message);\n    return "failed";\n  } finally {\n    log.push("cleanup");\n  }\n}\nconst result = await run();\nconsole.log(result, log.join(","));`;
  return { mode: "async", difficulty: failAt === 0 ? "easy" : "medium", question: "What does this print?", code, wrong: ["done 1,2", "failed step 1,cleanup", "done 1,2,step 2,cleanup", "failed 1,cleanup"],
    explanation: "await turns a rejection into an exception at that line, so try/catch/finally work like synchronous code; finally runs before the function's promise settles." };
});

// ================================================================ Chapter 13: iterators
template("gen-next", "iterators", 26, async () => {
  const a = ri(1, 9), b = ri(10, 19);
  const sends = Array.from({ length: 3 }, () => ri(1, 5));
  const code = `function* g() {\n  const x = yield ${a};\n  const y = yield x + ${b};\n  return x * y;\n}\nconst it = g();\nconsole.log(it.next(${sends[0]}).value, it.next(${sends[1]}).value, it.next(${sends[2]}).value, it.next().done);`;
  return { difficulty: "hard", question: "What does this print?", code,
    wrong: [`${a} ${sends[0] + b} ${sends[0] * sends[1]} true`, `${sends[0]} ${sends[1] + b} ${sends[1] * sends[2]} true`, `${a} ${b} undefined false`],
    explanation: "The first next() only starts the generator (its argument is ignored); each later next(v) makes the paused yield evaluate to v; return gives the final value with done: true." };
});
template("iter-helpers", "iterators", 24, async () => {
  const k = pick([2, 3]), n = ri(2, 4), d = ri(0, 2);
  const make = (f, m) => `function* naturals() { for (let i = 1; ; i++) yield i; }\nconsole.log(naturals().${f}.${m}.drop(${d}).take(${n}).toArray().join(","));`;
  const f = `filter((x) => x % ${k} === 0)`, m = `map((x) => x * x)`;
  return { difficulty: "medium", question: "What does this print?", code: make(f, m), variants: [make(m, f)],
    explanation: "Iterator helpers are lazy: each value flows through filter → map → drop → take in order, and take stops pulling once it has n values, so the infinite generator is safe." };
});
template("iter-exhaust", "iterators", 18, async () => {
  const xs = Array.from({ length: ri(2, 4) }, () => ri(1, 9));
  const forms = [
    `const it = ${js(xs)}.values();\nconsole.log([...it].length, [...it].length);`,
    `const arr = ${js(xs)};\nconsole.log([...arr].length, [...arr].length);`,
    `function* g() {\n  try { yield 1; yield 2; yield 3; }\n  finally { console.log("cleanup"); }\n}\nconst [first] = g();\nconsole.log(first);`,
    `const it = ${js(xs)}.values();\nfor (const x of it) break;\nconsole.log([...it].length);`,
  ];
  const code = pick(forms);
  return { difficulty: code.includes("break") || code.includes("cleanup") ? "hard" : "medium", question: "What does this print?", code,
    wrong: [`${xs.length} ${xs.length}`, `${xs.length} 0`, "1 / cleanup", "cleanup / 1", String(xs.length - 1), "0"],
    explanation: "An iterator is single-use: once consumed (or closed by break/destructuring, which calls return()) it yields nothing more; an array hands out a fresh iterator each time." };
});

// ================================================================ Chapter 14: modules
const MOD_STMTS = ['import { a } from "./m.js";', 'import a, { b } from "./m.js";', 'import * as ns from "./m.js";', 'import "./m.js";',
  'export const x = 1;', 'export default function () {}', 'export { x as y };', 'export * from "./m.js";', 'export * as ns from "./m.js";',
  'import { a: b } from "./m.js";', 'export default const x = 1;', 'import * from "./m.js";', 'export x;', 'import { default } from "./m.js";',
  'const m = await import("./m.js");', 'import data from "./d.json" with { type: "json" };', 'export { default } from "./m.js";'];
const modCache = new Map();
const MOD_DIR = mkdtempSync(join(tmpdir(), "jsq-"));
function moduleValid(stmt) {
  if (!modCache.has(stmt)) {
    const file = join(MOD_DIR, `s${modCache.size}.mjs`);
    writeFileSync(file, (stmt.startsWith("export {") || stmt.startsWith("export x") ? "const x = 1;\n" : "") + stmt + "\n");
    let ok = true;
    try { execFileSync(process.execPath, ["--check", file], { stdio: "pipe" }); } catch { ok = false; }
    modCache.set(stmt, ok);
  }
  return modCache.get(stmt);
}
template("module-syntax", "modules", 24, async () => {
  const items = sample(MOD_STMTS, 5);
  const yes = items.filter(moduleValid), no = items.filter((s) => !moduleValid(s));
  if (!yes.length || !no.length) return null;
  return { difficulty: "hard", exact: true, question: "Which lines are valid syntax at the top level of an ES module? (select all that apply)", correct: yes, wrong: no,
    explanation: "Rename imports with as (not :), export default takes an expression or declaration but not const, import * needs as name, and you can't export an undeclared or bare identifier without braces." };
});
const MOD_SCEN = [["A module that only does `console.log(\"hi\")` is imported by 3 other modules. How many times is \"hi\" printed?", "1", ["3", "4", "0"]],
  ["Module a.js has `export let n = 0; export const inc = () => n++;`. b.js imports n and inc, calls inc() twice, then logs n. What is logged?", "2", ["0", "1", "throws TypeError"]],
  ["b.js does `import { n } from \"./a.js\"; n = 5;`. What happens?", "TypeError: Assignment to constant variable.", ["n becomes 5 in both modules", "n becomes 5 only in b.js", "SyntaxError at load time"]],
  ["Which specifier works in Node ESM to import ./utils.js?", "\"./utils.js\"", ["\"./utils\"", "\"utils\"", "\"/utils\""]],
  ["In a package without \"type\" in package.json, how is app.js treated by modern Node if it contains import statements?", "As an ES module (syntax detection)", ["Always CommonJS", "As JSON", "It fails to load in every Node version"]],
  ["What is import.meta.dirname in Node?", "The directory of the current module file", ["The process working directory", "The package root", "The node_modules folder"]],
  ["What does await import(\"./x.js\") resolve to?", "The module namespace object", ["The default export", "A string of source code", "undefined"]],
  ["Which file extension is always CommonJS in Node?", ".cjs", [".mjs", ".js", ".json"]]];
template("module-scenario", "modules", 16, async () => {
  const [q, a, w] = pick(MOD_SCEN);
  return { difficulty: q.includes("inc()") || q.includes("n = 5") ? "hard" : /extension|evaluated|specifier/.test(q) || q.includes("times") ? "easy" : "medium", question: q, correct: [a], wrong: w,
    explanation: "Modules are evaluated once and shared; imports are live, read-only bindings; ESM specifiers need extensions; .mjs is ESM and .cjs is CommonJS." };
});

// ================================================================ Chapter 15: meta
template("proxy-out", "meta", 22, async () => {
  const forms = [
    `const p = new Proxy({ a: 1 }, { get: (t, k) => (k in t ? t[k] : "default") });\nconsole.log(p.a, p.b, "b" in p);`,
    `const p = new Proxy({}, { has: () => true });\nconsole.log("anything" in p, p.anything);`,
    `const log = [];\nconst p = new Proxy({}, { set(t, k, v) { log.push(k); t[k] = v * 2; return true; } });\np.x = 1;\np.y = 2;\nconsole.log(log.join(","), p.x + p.y);`,
    `const p = new Proxy([1, 2, 3], { get: (t, k, r) => (k === "length" ? 99 : Reflect.get(t, k, r)) });\nconsole.log(p.length, p[1], Array.isArray(p));`,
    `const { proxy, revoke } = Proxy.revocable({ a: 1 }, {});\nconst before = proxy.a;\nrevoke();\ntry { proxy.a; } catch (e) { console.log(before, e.name); }`,
  ];
  const code = pick(forms);
  return { difficulty: code.includes("revocable") || code.includes("length") ? "hard" : "medium", question: "What does this print?", code,
    wrong: ["1 default true", "1 undefined false", "true undefined", "x,y 3", "x,y 6", "99 2 false", "3 2 true", "1 undefined"],
    explanation: "Traps intercept only the operations they define (get, has, set, …); everything else reaches the target unchanged; a revoked proxy throws TypeError on any operation." };
});
template("using-order", "meta", 20, async () => {
  const ids = ["a", "b", "c"].slice(0, ri(2, 3));
  const nested = chance(0.5);
  const res = (n) => `using ${n} = r("${n}");`;
  const code = `const r = (n) => ({ [Symbol.dispose]: () => console.log("dispose " + n) });\n{\n  ${res(ids[0])}\n${nested ? "  {\n    " + res(ids[1]) + "\n    console.log(\"inner\");\n  }\n" : "  " + res(ids[1]) + "\n"}${ids[2] ? "  " + res(ids[2]) + "\n" : ""}  console.log("work");\n}`;
  const forward = ["inner", ...(nested ? [] : []), "work", ...ids.map((i) => "dispose " + i)].filter((x) => nested || x !== "inner").join(" / ");
  return { difficulty: "hard", question: "What does this print?", code, wrong: [forward, ids.map((i) => "dispose " + i).join(" / ") + " / work"],
    explanation: "using disposes resources when their block exits, in reverse order of declaration; an inner block disposes its own resources first." };
});
template("toprimitive", "meta", 18, async () => {
  const expr = pick(["`${m}`", "+m", "m + 1", "m + \"\"", "m > 100", "String(m)", "Number(m) * 2"]);
  const code = `const m = { [Symbol.toPrimitive](hint) { return hint === "number" ? 150 : hint === "string" ? "€1.50" : "default!"; } };\nconsole.log(${expr});`;
  return { difficulty: "hard", question: "What does this print?", code, wrong: ["€1.50", "150", "151", "default!1", "default!", "true", "300", "NaN"],
    explanation: "Symbol.toPrimitive receives a hint: \"string\" for template literals and String(), \"number\" for unary +, Number() and comparisons, \"default\" for + and ==." };
});

// ================================================================ Chapter 16: project (uses the real reference code)
const ref = (p) => pathToFileURL(join(ROOT, "playground", "reference", "src", p)).href;
const { Catalog } = await import(ref("catalog.js"));
const { processOrder } = await import(ref("processor.js"));
const { resetGateway } = await import(ref("payments.js"));
template("processor-outcome", "project", 26, async () => {
  const stock = ri(0, 3), qty = pick([0, 1, 2, 3]), card = pick(["4111-0001", "4111-0002", "4111-0119"]), book = pick(["b1", "b9"]);
  resetGateway();
  const catalog = new Catalog([{ id: "b1", title: "Dune", price: 1299, stock }]);
  const order = { id: "q1", customer: "Ana", card, items: [{ bookId: book, qty }] };
  const r = await processOrder(order, catalog, { timeoutMs: 500 });
  const ans = r.status === "paid" ? `paid ${r.cents} cents, stock left ${catalog.get("b1").stock}` : `failed (${r.reason.split(":")[0]}), stock left ${catalog.get("b1").stock}`;
  return { difficulty: card.endsWith("0119") || r.reason?.startsWith("Validation") ? "hard" : r.status === "paid" ? "easy" : "medium",
    question: `In the Chapter 16 project, Dune (b1, €12.99) has stock ${stock}. What is the outcome of an order for ${qty} × ${book} paid with card ${card}?`,
    correct: [ans], wrong: [`paid ${1299 * Math.max(1, qty)} cents, stock left ${Math.max(0, stock - qty)}`, `failed (PaymentError), stock left ${stock}`, `failed (OutOfStockError), stock left ${stock}`,
      `failed (ValidationError), stock left ${stock}`, `failed (PaymentError), stock left ${Math.max(0, stock - qty)}`],
    explanation: "processOrder validates (qty ≥ 1, known book), reserves stock, charges (card …0002 always declines, …0119 succeeds after two retried timeouts) and releases the reservation on any failure." };
});
const PROJ = [["Which part of the project decides whether a payment error is retried?", "withRetry, based on err.cause.retryable", ["The catalog", "cli.js", "Every error is retried"]],
  ["What does processAll yield?", "One result object per order, as each finishes", ["One array at the end", "Promises", "Only successful orders"]],
  ["Where are progress lines written with -v?", "stderr (console.error)", ["stdout", "a log file", "nowhere"]],
  ["How does the CLI limit how many orders run at once?", "The concurrency option of processAll (-c)", ["Promise.all on everything", "A setInterval", "It runs one at a time always"]],
  ["What makes the payment step testable without the fake gateway?", "Injecting a pay function through options", ["Mocking Node internals", "Editing payments.js in tests", "Network stubs"]],
  ["Which built-in is used to give each order a total time budget?", "AbortSignal.timeout", ["setInterval", "Promise.race only", "process.hrtime"]]];
template("project-design", "project", 14, async () => {
  const [q, a, w] = pick(PROJ);
  return { difficulty: "easy", question: `In the Chapter 16 order processor: ${q}`, correct: [a], wrong: w,
    explanation: "The processor separates concerns: catalog (stock), payments (gateway), processor (retry/timeout/rollback/concurrency), report and cli." };
});

// ================================================================ Appendix A: es5 (sloppy mode)
template("es5-sloppy", "es5", 26, async () => {
  const v = ri(1, 9);
  const forms = [
    [`var x = ${v};\nfunction f() {\n  console.log(x);\n  var x = ${v + 1};\n}\nf();`, `var x = ${v};\nfunction f() {\n  console.log(x);\n}\nf();`],
    [`function who() { return typeof this; }\nconsole.log(who());`, `"use strict";\nfunction who() { return typeof this; }\nconsole.log(who());`],
    [`var fns = [];\nfor (var i = 0; i < 3; i++) fns.push(function () { return i; });\nconsole.log(fns[0]());`, `var fns = [];\nfor (let i = 0; i < 3; i++) fns.push(function () { return i; });\nconsole.log(fns[0]());`],
    [`var c = (function () { var n = ${v}; return { inc: function () { return ++n; } }; })();\nc.inc();\nconsole.log(c.inc(), typeof n);`, `var n = ${v};\nvar c = { inc: function () { return ++n; } };\nc.inc();\nconsole.log(c.inc(), typeof n);`],
    [`function sum() { return Array.prototype.slice.call(arguments).length; }\nconsole.log(sum(${v}, 2, 3));`, `function sum(a) { return 1; }\nconsole.log(sum(${v}, 2, 3));`],
    [`function Book(t) { this.t = t; }\nvar b = Book("Dune");\nconsole.log(typeof b, typeof t);`, `function Book(t) { this.t = t; }\nvar b = new Book("Dune");\nconsole.log(typeof b, typeof t);`],
    [`var q = 0;\nq = q || ${v};\nconsole.log(q);`, `var q = 0;\nq = q ?? ${v};\nconsole.log(q);`],
  ];
  const [code, variant] = pick(forms);
  return { mode: "sloppy", difficulty: /Book|who|fns/.test(code) ? "hard" : "medium", question: "What does this classic (sloppy-mode) script print?", code, variants: [variant],
    explanation: "Old-style JavaScript traps: var hoisting, function-scoped loop variables, this as the global object in plain calls, constructor calls without new leaking globals, and || replacing valid 0 values." };
});
const ES5_MAP = [["var self = this; …function () { self.x }", "an arrow function using this"], ["Array.prototype.slice.call(arguments)", "rest parameters (...args)"],
  ["arr.indexOf(x) !== -1", "arr.includes(x)"], ["\"Hi \" + name + \"!\"", "`Hi ${name}!`"], ["x = x || 10", "a default parameter or x ?? 10"],
  ["(function () { var private = 1; })()", "module scope or a block with let/const"], ["Child.prototype = Object.create(Parent.prototype)", "class Child extends Parent"],
  ["Parent.call(this, name)", "super(name)"], ["callback(err, result)", "a promise with async/await"], ["for (var k in obj) if (obj.hasOwnProperty(k))", "Object.entries(obj) or Object.hasOwn"],
  ["var a = obj.a, b = obj.b;", "const { a, b } = obj;"], ["arr1.concat(arr2)", "[...arr1, ...arr2]"], ["for (var i = 0; i < arr.length; i++) { var x = arr[i]; … }", "for (const x of arr)"],
  ["fn.apply(null, args)", "fn(...args)"], ["var Counter = (function () { … return { inc: inc }; })()", "an ES module exporting inc"]];
template("es5-modern", "es5", 22, async () => {
  const [old, modern] = pick(ES5_MAP);
  return { difficulty: "easy", question: `Which is the modern (ES6+) replacement for the ES5 idiom: ${old}`, correct: [modern], wrong: ES5_MAP.map((m) => m[1]).filter((m) => m !== modern),
    explanation: `${old} → ${modern}.` };
});

// ================================================================ Appendix B: tooling
const semver = createRequire(import.meta.url)(join(dirname(process.execPath), "..", "lib", "node_modules", "npm", "node_modules", "semver"));
template("semver-select", "tooling", 22, async () => {
  const X = ri(1, 5), Y = ri(0, 6), Z = ri(0, 4);
  const range = pick([`^${X}.${Y}.${Z}`, `~${X}.${Y}.${Z}`, `>=${X}.${Y}.0 <${X + 1}.0.0`, `${X}.x`, `^0.${Y}.${Z}`]);
  const cands = uniq([`${X}.${Y}.${Z}`, `${X}.${Y}.${Z + 2}`, `${X}.${Y + 1}.0`, `${X + 1}.0.0`, `${X}.${Math.max(0, Y - 1)}.9`, `0.${Y}.${Z + 1}`, `0.${Y + 1}.0`]);
  const items = sample(cands, 5);
  const yes = items.filter((v) => semver.satisfies(v, range)), no = items.filter((v) => !semver.satisfies(v, range));
  if (!yes.length || !no.length) return null;
  return { difficulty: range.startsWith("^0") || range.startsWith("~") ? "hard" : "medium", exact: true,
    question: `Which versions satisfy the npm range "${range}"? (select all that apply)`, correct: yes, wrong: no,
    explanation: "^ allows changes that don't modify the left-most non-zero part (^1.2.3 → <2.0.0, ^0.2.3 → <0.3.0); ~ allows patch updates (~1.2.3 → <1.3.0); x is a wildcard." };
});
const NPM_CMDS = [["install exactly what package-lock.json records, from scratch", "npm ci"], ["add a test framework as a development dependency", "npm install -D vitest"],
  ["run the \"dev\" script from package.json", "npm run dev"], ["run a tool from a package without installing it globally", "npx eslint ."], ["list dependencies with newer versions available", "npm outdated"],
  ["create a package.json with defaults", "npm init -y"], ["run the test script", "npm test"], ["print the value of an expression with Node", "node -p \"1 + 1\""],
  ["re-run a script whenever files change", "node --watch app.js"], ["load variables from a .env file", "node --env-file=.env app.js"],
  ["start Node paused, waiting for a debugger", "node --inspect-brk app.js"], ["run the built-in test runner", "node --test"]];
template("npm-command", "tooling", 24, async () => {
  const [task, cmd] = pick(NPM_CMDS);
  return { difficulty: "easy", question: `Which command will ${task}?`, correct: [cmd], wrong: NPM_CMDS.map((c) => c[1]).filter((c) => c !== cmd).concat(["npm install --global", "node --run test"]),
    explanation: `${cmd} — see Appendix B.` };
});
template("argv", "tooling", 16, async () => {
  const args = sample(["--fast", "-v", "orders.json", "3", "Ana"], ri(1, 3));
  const exprs = [["process.argv.length", String(args.length + 2)], ["process.argv[2]", args[0]], ["process.argv.slice(2).join(\",\")", args.join(",")], ["typeof process.argv[2]", "string"], ["process.argv[3] ?? \"none\"", args[1] ?? "none"]];
  const [e, a] = pick(exprs);
  return { difficulty: "easy", question: `You run: node app.js ${args.join(" ")} — and app.js contains console.log(${e}). What is printed?`, args, code: `console.log(${e});`,
    correct: [a], wrong: [String(args.length), String(args.length + 1), "app.js", "node", args.at(-1), "number", "undefined"].filter((x) => x !== a),
    explanation: "process.argv[0] is the node executable, [1] the script path, and the user's arguments (always strings) start at index 2." };
});

// ================================================================ build
addHandwritten(h);
const handCount = questions.length;
for (const t of TEMPLATES) await runTemplate(t, t.quota);
for (let guard = 0; questions.length < TARGET * 1.5 && guard < 3000; guard++) await runTemplate(TEMPLATES[guard % TEMPLATES.length], 1);

const countBy = (k) => questions.reduce((m, q) => ((m[q[k]] = (m[q[k]] || 0) + 1), m), {});
console.log("before trim:", questions.length, JSON.stringify(countBy("difficulty")));
while (questions.length > TARGET) {
  const byDiff = countBy("difficulty"), byTopic = countBy("topic");
  const over = Object.keys(SHARE).sort((a, b) => (byDiff[b] || 0) / SHARE[b] - (byDiff[a] || 0) / SHARE[a])[0];
  const cands = questions.map((q, i) => [q, i]).filter(([q]) => q.template && q.difficulty === over && q.answer.length === 1 && perTemplate[q.template] > 4 && byTopic[q.topic] > 35);
  if (!cands.length) { console.log("cannot trim further"); break; }
  const max = Math.max(...cands.map(([q]) => byTopic[q.topic]));
  const [q, i] = pick(cands.filter(([c]) => byTopic[c.topic] >= max - 3));
  questions.splice(i, 1); perTemplate[q.template]--;
}

const order = Object.keys(CHAPTERS);
questions.sort((a, b) => order.indexOf(a.topic) - order.indexOf(b.topic));
questions.forEach((q, i) => { q.id = i + 1; });
writeFileSync(join(ROOT, "questions.json"), JSON.stringify({
  version: 1, topic: "JavaScript (Intermediate)", generated: new Date().toISOString().slice(0, 10), total: questions.length,
  chapters: Object.fromEntries(Object.entries(CHAPTERS).map(([k, [number, title, file]]) => [k, { number, title, file }])), questions,
}, null, 1) + "\n");

const multi = questions.filter((q) => q.answer.length > 1).length;
const pct = (n) => `${n} (${((100 * n) / questions.length).toFixed(1)}%)`;
console.log(`total: ${questions.length}  hand-written: ${handCount}  generated: ${questions.length - handCount}  multi-answer: ${pct(multi)}`);
console.log("difficulty:", Object.entries(countBy("difficulty")).map(([k, v]) => `${k} ${pct(v)}`).join(", "));
console.log("per topic:", Object.entries(countBy("topic")).map(([k, v]) => `${k} ${v}`).join(", "));
console.log("per template:", Object.entries(perTemplate).map(([k, v]) => `${k} ${v}`).join(", "));
