// Generates questions.json for the TypeScript Study Book.
//
// Every computed answer comes from the real compiler (TypeScript 7.0.2, strict):
//   typeEq   "what is this type?"           → each option is checked with an exact Equal<> test
//   assign   "which values fit type T?"      → each option is compiled as `const x: T = option`
//   compiles "which snippets compile?"       → each option is compiled on its own
//   lines    "which lines have errors?"      → the snippet is compiled and error lines collected
//   output   "what does this print?"         → the snippet is compiled and run with Node
// The author's "intended" answers are never trusted: options are classified by tsc, and a
// question is dropped if the result has no correct option (or every option is correct).
// tools/verify-questions.mjs re-checks every computed question independently.
//
// Usage: node tools/gen-questions.mjs && node tools/verify-questions.mjs && node tools/make-questions-js.mjs
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { compileBatch, emitted, ROOT, runMany, workdir } from "./ts-batch.mjs";
import { addHandwritten } from "./questions-handwritten.mjs";

const TARGET = 1000;
export const CHAPTERS = {
  why: ["1", "Why TypeScript?", "01-why.html"],
  basics: ["2", "The Basics: tsc & Strictness", "02-basics.html"],
  everyday: ["3", "Everyday Types", "03-everyday.html"],
  narrowing: ["4", "Narrowing", "04-narrowing.html"],
  functions: ["5", "More on Functions", "05-functions.html"],
  objects: ["6", "Object Types", "06-objects.html"],
  classes: ["7", "Classes", "07-classes.html"],
  generics: ["8", "Generics", "08-generics.html"],
  keyof: ["9", "keyof, typeof & Indexed Access", "09-keyof.html"],
  conditional: ["10", "Conditional Types & infer", "10-conditional.html"],
  mapped: ["11", "Mapped & Template Literal Types", "11-mapped.html"],
  utility: ["12", "Utility Types", "12-utility.html"],
  enums: ["13", "Enums, Literal Unions & Symbols", "13-enums.html"],
  compat: ["14", "Type Compatibility & Inference", "14-compat.html"],
  modules: ["15", "Modules, Namespaces & Merging", "15-modules.html"],
  decorators: ["16", "Decorators & Mixins", "16-decorators.html"],
  declarations: ["17", "Declaration Files & JSDoc", "17-declarations.html"],
  config: ["18", "Project Configuration", "18-config.html"],
  project: ["19", "Capstone: Migrate JS to TS", "19-project.html"],
  javacs: ["A", "TS for Java & C# Developers", "appendix-java-csharp.html"],
  tooling: ["B", "Tooling & TypeScript 7", "appendix-tooling.html"],
};

// ---------------------------------------------------------------- seeded random
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rand = mulberry32(20261105);
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (arr, k) => shuffle(arr).slice(0, k);

// ---------------------------------------------------------------- pending questions
const EQ = "type __Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;\ntype __Expect<T extends true> = T;";
const pending = [];   // { q, checks: [{name, code, flags}], resolve(errorsByName, outputs) }
let fileNo = 0;
const newName = () => `q${fileNo++}.ts`;

const block = (code) => "\n\n" + code.trim();

/** "Given <setup>, what is the type <subject>?"  options: type expressions */
function typeEq(topic, difficulty, setup, subject, options, explanation, { flags, question } = {}) {
  const checks = options.map((opt) => ({ name: newName(), flags, code: `${setup}\n${EQ}\ntype __Check = __Expect<__Equal<${subject}, ${opt}>>;` }));
  pending.push({
    q: { topic, difficulty, template: "typeEq", question: (question ?? `What is the type \`${subject}\`?`) + block(setup), options, explanation },
    checks, kind: "compiles", flags,
  });
}
/** "Which values can be assigned to T?" options: expressions */
function assign(topic, difficulty, setup, type, options, explanation, { flags } = {}) {
  const checks = options.map((opt) => ({ name: newName(), flags, code: `${setup}\nconst __x: ${type} = ${opt};\nexport { __x };` }));
  pending.push({
    q: { topic, difficulty, template: "assign", question: `Which values can be assigned to a variable of type \`${type}\`? (select all that apply)` + (setup.trim() ? block(setup) : ""), options, explanation },
    checks, kind: "compiles", flags,
  });
}
/** "Which snippets compile without errors?" options: code lines */
function compiles(topic, difficulty, setup, options, explanation, { flags, question } = {}) {
  const checks = options.map((opt) => ({ name: newName(), flags, code: `${setup}\n${opt}` }));
  pending.push({
    q: { topic, difficulty, template: "compiles", question: (question ?? "Which of these lines compile without errors? (select all that apply)") + (setup.trim() ? block(setup) : ""), options, explanation },
    checks, kind: "compiles", flags,
  });
}
/** "Which numbered lines have compile errors?" */
function lines(topic, difficulty, code, explanation, { flags } = {}) {
  const name = newName();
  const ls = code.trim().split("\n");
  const numbered = ls.map((l, i) => `/* ${i + 1} */ ${l}`).join("\n");
  pending.push({
    q: { topic, difficulty, template: "lines", question: "Which numbered lines does the compiler report errors on? (select all that apply)" + block(numbered), options: [...ls.map((_, i) => `Line ${i + 1}`)], explanation },
    checks: [{ name, flags, code: ls.join("\n") }], kind: "lines", flags,
  });
}
/** "What does this print?" (compiled with tsc, then run) */
function output(topic, difficulty, code, wrong, explanation, { flags } = {}) {
  const name = newName();
  pending.push({
    q: { topic, difficulty, template: "output", question: "This file compiles without errors. What does it print?" + block(code), options: null, explanation },
    checks: [{ name, flags, code: code.trim() }], kind: "output", wrong, flags,
  });
}

// ================================================================ Chapter 1-2: why / basics
for (const [decl, val, wrong] of [["let", '"Dune"', '"Dune"'], ["const", '"Dune"', "string"], ["let", "412", "412"], ["const", "412", "number"], ["let", "true", "true"], ["const", "false", "boolean"], ["const", "[1, 2]", "[1, 2]"], ["let", "null", "never"]]) {
  const t = val === "null" ? "null" : null;
  typeEq("why", decl === "const" && !val.startsWith("[") ? "medium" : "easy", `${decl} value = ${val};`, "typeof value",
    [...new Set([wrong, decl === "const" && !val.startsWith("[") ? val : (val.startsWith('"') ? "string" : val === "true" ? "boolean" : val.startsWith("[") ? "number[]" : t ?? "number"), "any", "unknown", "string | number"])].slice(0, 4),
    "TypeScript infers a variable's type from its initial value. A const can never change, so it gets the literal type; a let gets the wider type (null stays null under strictNullChecks).");
}
for (const [code, expl] of [
  ['function addTax(price: number): number { return price * 1.2; }\nconsole.log(addTax("100" as any));', "Types are erased: `as any` silences the checker, and at runtime \"100\" * 1.2 converts the string to a number."],
  ['const n: number = Number("42");\nconsole.log(n + 1, typeof n);', "Number() converts at runtime; the annotation only describes the result."],
  ['let x = "7" as unknown as number;\nconsole.log(typeof x, x + 1);', "Assertions never convert: x is still the string \"7\", so + concatenates."],
  ['const book = { title: "Dune" };\nconst t: string = (book as any).titel ?? "missing";\nconsole.log(t);', "The typo hides behind `as any`, so it compiles; at runtime the property is undefined."],
]) output("why", "medium", code, [], expl);
lines("why", "easy", 'const book = { title: "Dune", pages: 412 };\nconsole.log(book.title.toUpperCase());\nconsole.log(book.tilte);\nconsole.log(book.pages.toFixed(0));', "Line 3 reads a property that doesn't exist on the inferred type { title: string; pages: number }; TypeScript reports TS2551 and suggests 'title'.");
lines("why", "easy", 'let copies = 3;\ncopies = copies + 1;\ncopies = "four";\nconst label = `${copies} copies`;', "copies was inferred as number from its first value, so assigning a string on line 3 is TS2322.");
lines("basics", "medium", 'function greet(person: string, date: Date) { return `${person} ${date.getDay()}`; }\ngreet("Ana", new Date());\ngreet("Ana", "Thursday");\ngreet("Ana");', "Line 3 passes a string where a Date is expected (TS2345); line 4 is missing the second argument (TS2554).");
lines("basics", "medium", 'function f(cents) { return cents / 100; }\nconst g = (x: number) => x * 2;\nlet h: (s: string) => number = (s) => s.length;\nlet k = [];', "Under strict (noImplicitAny), line 1's parameter has an implicit any type (TS7006). An empty array with let is an evolving array, which is allowed.");
compiles("basics", "medium", "", ['function a(x: string | null) { return x.length; }', 'function b(x: string | null) { return x?.length ?? 0; }', 'function c(x: string | null) { if (x === null) return 0; return x.length; }', 'function d(x?: string) { return x!.length; }'],
  "With strictNullChecks, a possibly-null value must be narrowed (?., an if check) or asserted with ! before use. Reading .length directly on string | null is an error.");
compiles("basics", "hard", "", ['function a(cents) { return cents; }', 'function b(cents: number) { return cents; }', 'const c = (cents) => cents;', 'const d: (n: number) => number = (cents) => cents;'],
  "Without strict, parameters without types silently become any. With strict=false nothing is reported.", { flags: { strict: false }, question: "With `strict: false`, which of these compile without errors? (select all that apply)" });
compiles("basics", "medium", "", ['function a(cents) { return cents; }', 'function b(cents: number) { return cents; }', 'const c = (cents) => cents;', 'const d: (n: number) => number = (cents) => cents;'],
  "Under strict (noImplicitAny), a, c have untyped parameters (TS7006); d's parameter is typed by context.", { question: "With `strict: true`, which of these compile without errors? (select all that apply)" });

// ================================================================ Chapter 3: everyday
const EVERYDAY_TYPES = [
  ["string | number", ['"b1"', "42", "true", "null", "[1]", '"" as string']],
  ['"left" | "right" | "center"', ['"left"', '"middle"', '"right" as const', '"Left"', '"center"']],
  ["number[]", ["[]", "[1, 2, 3]", '[1, "2"]', "[1, 2] as const", "new Array<number>(3)"]],
  ["(string | number)[]", ['["a", 1]', "[]", "[true]", '["a", "b"]', "[null]"]],
  ["string[] | number[]", ['["a", 1]', '["a"]', "[1, 2]", "[]"]],
  ["{ first: string; last?: string }", ['{ first: "Ana" }', '{ first: "Ana", last: "Lima" }', '{ last: "Lima" }', '{ first: "Ana", last: undefined }', '{ first: "Ana", age: 3 }']],
  ["boolean", ["true", "!0", '"false"', "Boolean(1)", "0"]],
  ["string | undefined", ['"x"', "undefined", "null", "void 0", '[].join("")']],
  ["any", ["1", '"a"', "null", "{ anything: true }"]],
  ["Date | null", ["new Date()", "null", "undefined", "Date.now()", '"2026-11-05"']],
];
for (const [type, values] of EVERYDAY_TYPES) for (let k = 0; k < 3; k++) assign("everyday", type.includes("?") || type.includes("|") ? "medium" : "easy", "", type, sample(values, Math.min(4, values.length)), `Each option is checked against \`${type}\`: object literals get an excess property check, literals must match exactly, and null/undefined are separate types under strictNullChecks.`);
for (const [setup, subject, opts, d] of [
  ['const req = { url: "/books", method: "GET" };', 'typeof req.method', ['string', '"GET"', 'any', '"GET" | "POST"'], "medium"],
  ['const req = { url: "/books", method: "GET" } as const;', 'typeof req.method', ['string', '"GET"', 'readonly "GET"', 'unknown'], "medium"],
  ['const ids = ["b1", "b2"];', 'typeof ids', ['string[]', '["b1", "b2"]', 'readonly string[]', '("b1" | "b2")[]'], "easy"],
  ['const ids = ["b1", "b2"] as const;', 'typeof ids', ['string[]', 'readonly ["b1", "b2"]', '["b1", "b2"]', 'readonly string[]'], "medium"],
  ['const mixed = [1, "b2", null];', 'typeof mixed', ['(string | number | null)[]', '[number, string, null]', 'any[]', '(string | number)[]'], "medium"],
  ['async function f() { return 42; }', 'ReturnType<typeof f>', ['number', 'Promise<number>', 'Promise<42>', 'Promise<any>'], "medium"],
  ['let anything: any = 1;\nconst copy = anything.title;', 'typeof copy', ['any', 'unknown', 'string', 'undefined'], "easy"],
  ['function fee(days: number) { return days > 10 ? "capped" : days * 25; }', 'ReturnType<typeof fee>', ['number', 'string', '"capped" | number', 'string | number'], "medium"],
  ['const point = { x: 1, y: 2 };', 'typeof point', ['{ x: number; y: number }', '{ x: 1; y: 2 }', '{ readonly x: number; readonly y: number }', 'object'], "easy"],
  ['type Id = number | string;\ntype Point = { x: number; y: number };', 'Id | Point', ['string | number | Point', 'Point', 'never', 'unknown'], "easy"],
]) typeEq("everyday", d, setup, subject, opts, "TypeScript infers the narrowest safe type: literals stay literal only where the value can't change (const, as const); arrays of mixed values become arrays of unions; async functions wrap results in Promise.");
compiles("everyday", "medium", 'interface Member { name: string }\ninterface Member { email: string }\ntype Point = { x: number };', ['const m: Member = { name: "Ana", email: "a@x" };', 'const m: Member = { name: "Ana" };', 'type Point = { y: number };', 'interface Staff extends Member { role: string }'], "Interfaces with the same name merge (Member has name and email); a type alias can't be declared twice (Duplicate identifier).");
compiles("everyday", "medium", "", ['const n = "Dune" as number;', 'const n = "Dune" as unknown as number;', 'const s = "Dune" as string;', 'const v = 42 as const;'], "Assertions between types that don't overlap (string → number) are rejected (TS2352); going through unknown forces it.");
output("everyday", "easy", 'function printId(id: number | string) {\n  if (typeof id === "string") console.log(id.toUpperCase());\n  else console.log(id.toFixed(1));\n}\nprintId("b7");\nprintId(3);', [], "typeof narrows the union: the string branch upper-cases, the number branch formats with one decimal.");
output("everyday", "medium", 'const shelf = new Map<string, string>([["b1", "Dune"]]);\nconst t = shelf.get("b1")!;\nconsole.log(t.length, shelf.get("b2")?.length);', [], "The ! assertion is unchecked; for a missing key, ?. gives undefined.");

// ================================================================ Chapter 4: narrowing
for (const [setup, subject, opts, d] of [
  ['declare const v: string | string[] | null;\nfunction f() { if (typeof v === "object") return v; return undefined; }', 'NonNullable<ReturnType<typeof f>>', ['string[]', 'string[] | null', 'object', 'never'], "hard"],
  ['type Printed = { pages: number };\ntype Audio = { minutes: number };\nfunction f(item: Printed | Audio) { if ("pages" in item) return item; throw 0; }', 'ReturnType<typeof f>', ['Printed', 'Audio', 'Printed | Audio', 'never'], "medium"],
  ['function f(x: string | number) { if (typeof x === "number") return; return x; }', 'ReturnType<typeof f>', ['string | undefined', 'string', 'number | undefined', 'void'], "hard"],
  ['const items = [1, null, 2, undefined];\nconst nums = items.filter((x) => x != null);', 'typeof nums', ['number[]', '(number | null | undefined)[]', '(number | null)[]', 'any[]'], "medium"],
  ['type Shape = { kind: "circle"; r: number } | { kind: "rect"; w: number };\nfunction f(s: Shape) { if (s.kind === "rect") return s; throw 0; }', 'ReturnType<typeof f>', ['{ kind: "rect"; w: number }', 'Shape', '{ kind: "circle"; r: number }', 'never'], "medium"],
  ['function f(x: Date | string) { return x instanceof Date ? 1 : x; }', 'ReturnType<typeof f>', ['string | 1', 'Date | string', 'number | string', '1'], "medium"],
]) typeEq("narrowing", d, setup, subject, opts, "Each check (typeof, in, instanceof, ===, filter with a predicate) narrows the union along that path; control flow analysis combines the results of all return paths.");
lines("narrowing", "medium", 'function len(v: string | null) {\n  if (v) return v.length;\n  return v.length;\n}', "After `if (v) return …`, v is null or the empty string, so v.length on line 3 is 'possibly null' (TS18047).");
lines("narrowing", "medium", 'const data: unknown = JSON.parse("{}");\nconsole.log(data.title);\nif (typeof data === "object" && data !== null && "title" in data) console.log(data.title);\nconst n: number = data;', "unknown can't be used until narrowed (line 2, TS18046) and isn't assignable to number (line 4); line 3 narrows first.");
lines("narrowing", "hard", 'type F = "a" | "b" | "c";\nfunction f(x: F): number {\n  switch (x) { case "a": return 1; case "b": return 2; default: { const n: never = x; return n; } }\n}', "The default branch still receives \"c\", which isn't assignable to never: the exhaustiveness check reports the missing case on line 3.");
for (const [code, wrong, d] of [
  ['function printAll(s: string | string[] | null) {\n  if (s && typeof s === "object") for (const x of s) console.log(x);\n  else if (typeof s === "string") console.log(s);\n  else console.log("nothing");\n}\nprintAll(["a", "b"]); printAll(""); printAll(null);', [], "medium"],
  ['function isStr(v: unknown): v is string { return typeof v === "string"; }\nconst xs: unknown[] = ["Dune", 1, "Emma", null];\nconsole.log(xs.filter(isStr).join("+"));', [], "easy"],
  ['type R = { ok: true; value: number } | { ok: false; error: string };\nconst rs: R[] = [{ ok: true, value: 3 }, { ok: false, error: "x" }];\nfor (const r of rs) console.log(r.ok ? r.value * 2 : r.error.toUpperCase());', [], "easy"],
  ['let x: string | number = "hi";\nx = 5;\nconsole.log(typeof x, x.toFixed(1));', [], "easy"],
  ['function len(v: string | null | undefined) { return v != null ? v.length : -1; }\nconsole.log(len(""), len(null), len(undefined), len("ab"));', [], "medium"],
  ['try { JSON.parse("{bad"); } catch (e) { console.log(e instanceof SyntaxError, (e as Error).name); }', [], "medium"],
]) output("narrowing", d, code, wrong, "Narrowing only affects types; the runtime behaviour is ordinary JavaScript: truthiness, typeof and instanceof checks.");

// ================================================================ Chapter 5: functions
for (const [setup, subject, opts, d] of [
  ['function firstElement<T>(arr: T[]) { return arr[0]; }\nconst x = firstElement(["a", "b"]);', 'typeof x', ['string', 'string | undefined', '"a"', 'any'], "medium"],
  ['function oops(msg: string) { throw new Error(msg); }', 'ReturnType<typeof oops>', ['void', 'never', 'undefined', 'Error'], "hard"],
  ['const oops = (msg: string) => { throw new Error(msg); };', 'ReturnType<typeof oops>', ['void', 'never', 'undefined', 'Error'], "hard"],
  ['function renew(id: string, extra = 7) { return `${id}+${extra}`; }', 'Parameters<typeof renew>', ['[id: string, extra?: number]', '[string, number]', '[id: string, extra: number]', 'string[]'], "medium"],
  ['function tag(label: string, ...ids: string[]) { return label + ids.length; }', 'Parameters<typeof tag>', ['[label: string, ...ids: string[]]', 'string[]', '[string, string[]]', '[label: string, ids: string[]]'], "medium"],
  ['function makeDate(ts: number): Date;\nfunction makeDate(y: number, m: number, d: number): Date;\nfunction makeDate(a: number, m?: number, d?: number): Date { return new Date(a); }', 'ReturnType<typeof makeDate>', ['Date', 'Date | undefined', 'Date[]', 'never'], "easy"],
  ['function longest<T extends { length: number }>(a: T, b: T) { return a.length >= b.length ? a : b; }\nconst r = longest([1, 2], [3]);', 'typeof r', ['number[]', '{ length: number }', '[1, 2] | [3]', 'any'], "medium"],
]) typeEq("functions", d, setup, subject, opts, "Return types are inferred from the body (a declaration that only throws is void; an arrow that only throws is never); Parameters keeps names, optional and rest markers.");
lines("functions", "medium", 'function makeDate(ts: number): Date;\nfunction makeDate(y: number, m: number, d: number): Date;\nfunction makeDate(a: number, m?: number, d?: number): Date { return new Date(a); }\nmakeDate(2026, 11);', "Callers only see the overload signatures: there's no 2-argument overload, so line 4 is TS2575.");
lines("functions", "medium", 'function increment(this: { count: number }, by: number) { return this.count + by; }\nconst c = { count: 1, increment };\nc.increment(2);\nincrement(2);', "A declared this parameter makes the plain call on line 4 an error: its this is void (TS2684).");
lines("functions", "hard", 'function noReturn(): void { return 42; }\nconst cb: () => void = () => 42;\n[1, 2].forEach((n) => [].push(n as never));\nconst f: (s: string) => void = (s: string, n: number) => {};', "A declared : void function can't return a value (line 1), but a void function TYPE accepts functions returning values (lines 2, 3). Line 4 needs a second parameter callers won't pass.");
compiles("functions", "medium", 'type Handler = (event: string, at: Date) => void;', ['const a: Handler = () => {};', 'const b: Handler = (e) => console.log(e);', 'const c: Handler = (e: string, at: Date, extra: number) => {};', 'const d: Handler = (e: number) => {};'], "Fewer parameters are always fine; extra required parameters or wrong parameter types are not.");
for (const [code, d] of [
  ['function order(title: string, qty = 1, total = qty * 10) { return `${qty}x ${title}=${total}`; }\nconsole.log(order("Dune"), order("Dune", 3), order("Dune", undefined, 5));', "medium"],
  ['function sum(...cents: number[]) { return cents.reduce((a, b) => a + b, 0); }\nconsole.log(sum(), sum(1, 2, 3));', "easy"],
  ['function search({ query, limit = 10 }: { query: string; limit?: number }) { return `${query}:${limit}`; }\nconsole.log(search({ query: "dune" }), search({ query: "emma", limit: 2 }));', "easy"],
  ['function parse(input: string): number;\nfunction parse(input: string[]): number[];\nfunction parse(input: string | string[]) { return Array.isArray(input) ? input.map(Number) : Number(input); }\nconsole.log(parse("4") + 1, parse(["1", "2"]).length);', "medium"],
  ['const make = <T,>(Kind: new (t: string) => T, t: string) => new Kind(t);\nclass Book { constructor(public title: string) {} }\nconsole.log(make(Book, "Dune").title);', "medium"],
]) output("functions", d, code, [], "Defaults apply only to undefined, rest parameters collect an array, overloads share one implementation, and a constructor can be passed as a value.");

// ================================================================ Chapter 6: objects
const OBJ_TYPES = [
  ["{ readonly id: string; days: number }", ['{ id: "L1", days: 14 }', '{ id: "L1" }', '{ id: "L1", days: 14, extra: 1 }', '{ id: 1, days: 14 }']],
  ["{ [bookId: string]: number }", ['{ b1: 3, b2: 0 }', "{}", '{ b1: "3" }', '{ "any key": 1 }']],
  ["[bookId: string, copies: number]", ['["b1", 3]', '["b1"]', '[3, "b1"]', '["b1", 3, true]', '["b2", 0] as [string, number]']],
  ["[start: number, end?: number]", ["[10]", "[10, 20]", "[]", "[1, 2, 3]"]],
  ["[string, ...number[]]", ['["shelf", 3, 5]', '["shelf"]', "[3, 5]", '["a", "b"]']],
  ["readonly number[]", ["[1, 2]", "[] as number[]", "[1, 2] as const", '["1"]']],
  ["Record<\"a\" | \"b\", number>", ["{ a: 1, b: 2 }", "{ a: 1 }", "{ a: 1, b: 2, c: 3 }", '{ a: 1, b: "2" }']],
];
for (const [type, values] of OBJ_TYPES) for (let k = 0; k < 3; k++) assign("objects", type.startsWith("[") || type.includes("readonly") ? "medium" : "easy", "", type, sample(values, 4), "Tuples check length and position types; index signatures check every value; fresh object literals get the excess property check.");
lines("objects", "easy", 'interface Loan { readonly id: string; member: { name: string }; days: number }\nconst loan: Loan = { id: "L1", member: { name: "Ana" }, days: 14 };\nloan.days = 21;\nloan.member.name = "Ben";\nloan.id = "L2";', "readonly blocks assigning id (line 5) but isn't deep: line 4 is allowed.");
lines("objects", "medium", 'interface SearchOptions { query: string; limit?: number }\nfunction search(o: SearchOptions) { return o.query; }\nsearch({ query: "dune", limt: 5 });\nconst opts = { query: "dune", limt: 5 };\nsearch(opts);', "The excess property check applies only to the fresh object literal on line 3; the variable on line 5 passes.");
lines("objects", "medium", 'interface A { id: string }\ninterface B extends A { id: number }\ntype C = { id: string } & { id: number };\nconst c: C = { id: 1 };', "extends reports the conflict at the declaration (line 2); an intersection silently makes id never, so the assignment fails (line 4).");
lines("objects", "hard", 'interface Dict { [key: string]: number; count: number; label: string }\nconst d: Record<string, number> = { a: 1 };\nconst n: number = d["zzz"];\nconst arr = [1, 2]; const m: number = arr[5];', "Line 1: every property must fit the index signature (label: string doesn't). Lines 3-4 compile unless noUncheckedIndexedAccess is on.");
lines("objects", "hard", 'interface Dict { [key: string]: number; count: number; label: string }\nconst d: Record<string, number> = { a: 1 };\nconst n: number = d["zzz"];\nconst arr = [1, 2]; const m: number = arr[5];', "With noUncheckedIndexedAccess, indexing returns number | undefined, so lines 3 and 4 fail too.", { flags: { noUncheckedIndexedAccess: true } });
for (const [setup, subject, opts, d] of [
  ['type Entry = [bookId: string, copies: number];', 'Entry[1]', ['number', 'string', 'string | number', 'undefined'], "easy"],
  ['type Entry = [bookId: string, copies: number];', 'Entry["length"]', ['2', 'number', '1', 'string'], "medium"],
  ['type Path = [string, ...number[]];', 'Path[number]', ['string | number', 'number', 'string', 'number[]'], "medium"],
  ['interface Box<T> { contents: T }', 'Box<string>["contents"]', ['string', 'T', 'unknown', 'Box<string>'], "easy"],
  ['type C = { id: string } & { id: number };', 'C["id"]', ['never', 'string | number', 'string', 'number'], "hard"],
]) typeEq("objects", d, setup, subject, opts, "Indexing a tuple by position gives that element's type; [\"length\"] of a fixed tuple is a literal; conflicting intersections give never.");

// ================================================================ Chapter 7: classes
lines("classes", "easy", 'class Book {\n  title: string;\n  isbn: string;\n  copies = 1;\n  constructor(title: string) { this.title = title; }\n}', "strictPropertyInitialization: isbn (line 3) is never assigned.");
lines("classes", "medium", 'class Card { private pin = "1234"; #secret = 1; check() { return this.#secret; } }\nconst c = new Card();\nconsole.log(c.pin);\nconsole.log((c as any).pin);\nconsole.log(c["pin"]);', "Only the dot access on line 3 is an error; as any and bracket access are deliberate escape hatches for soft private.");
lines("classes", "medium", 'abstract class Notifier { abstract send(t: string): string; }\nclass Email extends Notifier { send(t: string) { return t; } }\nconst a = new Notifier();\nconst b: Notifier = new Email();', "An abstract class can't be instantiated (line 3); subclasses can.");
lines("classes", "hard", 'class Item { label() { return "i"; } loanDays() { return 21; } }\nclass Dvd extends Item {\n  override loanDays() { return 7; }\n  label() { return "dvd"; }\n  override describe() { return "?"; }\n}', "With noImplicitOverride: line 4 lacks override (TS4114), line 5 overrides nothing (TS4113).", { flags: { noImplicitOverride: true } });
lines("classes", "medium", 'interface Lendable { id: string; lend(m: string): string }\nclass Book implements Lendable { constructor(public id: string) {} lend(m: string) { return m; } }\nclass Dvd implements Lendable { constructor(public id: string) {} }\nconst items: Lendable[] = [{ id: "x", lend: (m) => m }];', "Dvd says implements but has no lend (line 3); a plain object of the right shape is fine (line 4).");
compiles("classes", "medium", 'class Point { x = 0; y = 0 }\nclass Pixel { x = 0; y = 0 }\nclass Secret { #k = 1; x = 0 }\nclass Empty {}', ['const p: Point = new Pixel();', 'const p: Point = { x: 1, y: 2 };', 'const s: Secret = { x: 0 };', 'const e: Empty = "anything";'], "Classes are compared structurally, except that private and # members make a class nominal.");
for (const [code, d] of [
  ['class Counter { count = 0; inc = () => { this.count++; }; }\nconst c = new Counter();\nconst { inc } = c; inc(); inc();\nconsole.log(c.count);', "medium"],
  ['class Loan { constructor(readonly id: string, private days: number) {} describe() { return `${this.id}:${this.days}`; } }\nconsole.log(new Loan("L1", 14).describe(), JSON.stringify(new Loan("L2", 7)));', "medium"],
  ['class Policy { static #n = 0; static next() { return ++Policy.#n; } }\nconsole.log(Policy.next(), Policy.next(), Policy.next());', "easy"],
  ['class Item { constructor(public title: string) {} loanDays() { return 21; } }\nclass Dvd extends Item { override loanDays() { return Math.min(super.loanDays(), 7); } }\nconsole.log([new Item("a"), new Dvd("b")].map((i) => i.loanDays()).join(","));', "easy"],
  ['class Point { x = 0; y = 0 }\nclass Pixel { x = 0; y = 0 }\nconst p: Point = new Pixel();\nconsole.log(p instanceof Point, p instanceof Pixel);', "hard"],
  ['class Account { private _b = 0; get balance() { return this._b; } set balance(v: number) { if (v < 0) throw new RangeError("neg"); this._b = v; } }\nconst a = new Account(); a.balance = 5;\ntry { a.balance = -1; } catch (e) { console.log((e as Error).name, a.balance); }', "medium"],
]) output("classes", d, code, [], "Parameter properties become real fields; private is visible at runtime (JSON.stringify), # is not; instanceof checks the prototype chain, not the shape.");

// ================================================================ Chapter 8: generics
for (const [setup, subject, opts, d] of [
  ['function identity<T>(arg: T): T { return arg; }\nconst a = identity("Dune");', 'typeof a', ['"Dune"', 'string', 'any', 'unknown'], "medium"],
  ['function identity<T>(arg: T): T { return arg; }\nlet a = identity("Dune");', 'typeof a', ['string', '"Dune"', 'any', 'unknown'], "hard"],
  ['function wrap<T>(value: T) { return { value }; }\nconst w = wrap([1, 2]);', 'typeof w', ['{ value: number[] }', '{ value: [1, 2] }', '{ value: unknown }', 'number[]'], "easy"],
  ['function exact<const T extends readonly string[]>(v: T) { return v; }\nconst b = exact(["asc", "desc"]);', 'typeof b', ['readonly ["asc", "desc"]', 'string[]', '("asc" | "desc")[]', '["asc", "desc"]'], "hard"],
  ['interface Ev<P = string> { name: string; payload: P }', 'Ev["payload"]', ['string', 'unknown', 'P', 'any'], "medium"],
  ['function getProperty<T, K extends keyof T>(o: T, k: K) { return o[k]; }\nconst y = getProperty({ title: "Dune", year: 1965 }, "year");', 'typeof y', ['number', 'string | number', '1965', 'unknown'], "medium"],
  ['type Pair<A, B> = [first: A, second: B];', 'Pair<string, boolean>[1]', ['boolean', 'string', 'string | boolean', 'B'], "easy"],
  ['function first<T>(arr: T[]) { return arr[0]; }\nconst f = first([1, 2]);', 'typeof f', ['number', 'number | undefined', '1', 'any'], "medium"],
]) typeEq("generics", d, setup, subject, opts, "Type parameters are inferred from arguments (literals for primitives, widened for let and arrays); const type parameters keep literal tuples; defaults apply when no argument is given.");
lines("generics", "medium", 'function logLength<T>(arg: T) { return arg.length; }\nfunction ok<T extends { length: number }>(arg: T) { return arg.length; }\nok("Dune");\nok(42);', "T can be anything, so .length isn't known (line 1); with the constraint, numbers are rejected (line 4).");
lines("generics", "medium", 'function pick<T extends string>(options: T[], fallback: NoInfer<T>) { return options[0] ?? fallback; }\npick(["a", "b"], "b");\npick(["a", "b"], "c");\nfunction loose<T extends string>(options: T[], fallback: T) { return fallback; }\nloose(["a", "b"], "c");', "NoInfer stops the fallback from widening T, so \"c\" is rejected on line 3; without it (line 5) T becomes \"a\" | \"b\" | \"c\".");
compiles("generics", "medium", 'interface HasId { id: string }\nfunction indexById<T extends HasId>(items: T[]) { return new Map(items.map((i) => [i.id, i])); }', ['indexById([{ id: "b1", title: "Dune" }]).get("b1")?.title;', 'indexById([{ title: "no id" }]);', 'indexById<{ id: string; n: number }>([{ id: "a", n: 1 }]);', 'indexById([]);'], "The constraint requires id; the type parameter keeps the rest of the shape (title).");
for (const [code, d] of [
  ['class Cache<K, V> { #m = new Map<K, V>(); constructor(private load: (k: K) => V) {} get(k: K) { if (!this.#m.has(k)) { console.log("load", k); this.#m.set(k, this.load(k)); } return this.#m.get(k)!; } }\nconst c = new Cache((id: string) => id.length);\nconsole.log(c.get("abc"), c.get("abc"));', "medium"],
  ['function groupBy<T, K extends string>(xs: T[], key: (x: T) => K) { const o = {} as Record<K, T[]>; for (const x of xs) (o[key(x)] ??= []).push(x); return o; }\nconst g = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 ? "odd" : "even"));\nconsole.log(g.odd.length, g.even.length);', "medium"],
  ['function pluck<T, K extends keyof T>(xs: T[], k: K): T[K][] { return xs.map((x) => x[k]); }\nconsole.log(pluck([{ y: 1965 }, { y: 1815 }], "y"));', "easy"],
]) output("generics", d, code, [], "Generics are erased; the emitted JavaScript is the plain logic.");

// ================================================================ Chapter 9: keyof
for (const [setup, subject, opts, d] of [
  ['interface Book { id: string; title: string; year: number }', 'keyof Book', ['"id" | "title" | "year"', 'string', 'string | number', 'Book'], "easy"],
  ['type Dict = { [k: string]: boolean };', 'keyof Dict', ['string | number', 'string', 'number', 'boolean'], "hard"],
  ['type Arr = { [n: number]: unknown };', 'keyof Arr', ['number', 'string | number', 'string', 'unknown'], "medium"],
  ['interface Member { type: "student" | "staff"; address: { city: string } }', 'Member["type"]', ['"student" | "staff"', 'string', 'Member', '"type"'], "easy"],
  ['interface Member { type: "student" | "staff"; address: { city: string } }', 'Member["address"]["city"]', ['string', '{ city: string }', '"city"', 'unknown'], "easy"],
  ['const FORMATS = ["hardcover", "ebook"] as const;', '(typeof FORMATS)[number]', ['"hardcover" | "ebook"', 'string', 'readonly ["hardcover", "ebook"]', 'number'], "medium"],
  ['const LIMITS = { student: 3, staff: 10 } as const;', 'keyof typeof LIMITS', ['"student" | "staff"', 'string', '3 | 10', 'number'], "medium"],
  ['const LIMITS = { student: 3, staff: 10 } as const;', '(typeof LIMITS)[keyof typeof LIMITS]', ['3 | 10', 'number', '"student" | "staff"', '13'], "hard"],
  ['const defaults = { loanDays: 21, notify: true };', 'typeof defaults', ['{ loanDays: number; notify: boolean }', '{ loanDays: 21; notify: true }', 'object', '{ readonly loanDays: 21; readonly notify: true }'], "easy"],
  ['interface M { id: string; n: number; ok: boolean }', 'M[keyof M]', ['string | number | boolean', '"id" | "n" | "ok"', 'never', 'unknown'], "medium"],
  ['const books = [{ title: "Dune", year: 1965 }];', '(typeof books)[number]["year"]', ['number', '1965', 'string | number', 'undefined'], "medium"],
]) typeEq("keyof", d, setup, subject, opts, "keyof gives the union of keys (index signatures give string | number or number); T[K] looks up property types; typeof turns a value into its type; [number] gives an array's element type.");
lines("keyof", "medium", 'function makeLoan(id: string) { return { id, days: 14 }; }\ntype A = ReturnType<typeof makeLoan>;\ntype B = ReturnType<makeLoan>;\ntype C = ReturnType<typeof makeLoan>["days"];', "makeLoan is a value, so a type position needs typeof makeLoan (line 3 is TS2749). Indexed access on the ReturnType (line 4) is fine.");
compiles("keyof", "medium", 'interface Book { id: string; title: string }', ['const k: keyof Book = "title";', 'const k: keyof Book = "pages";', 'type T = Book["id" | "title"];', 'type T = Book["email"];'], "keyof Book is \"id\" | \"title\"; indexed access only accepts existing keys.");
for (const [code, d] of [
  ['const FORMATS = ["paperback", "ebook"] as const;\ntype Format = (typeof FORMATS)[number];\nconst isFormat = (s: string): s is Format => (FORMATS as readonly string[]).includes(s);\nconsole.log(["ebook", "scroll"].map(isFormat));', "easy"],
  ['function field<T, K extends keyof T>(o: T, k: K): T[K] { return o[k]; }\nconst m = { name: "Ana", max: 3 };\nconsole.log(field(m, "max") * 2, field(m, "name").length);', "easy"],
  ['const L = { book: 21, dvd: 7 } as const;\nfunction days(k: keyof typeof L) { return L[k]; }\nconsole.log(days("dvd") + days("book"));', "easy"],
]) output("keyof", d, code, [], "keyof and typeof are erased; the lookups are ordinary property accesses.");

// ================================================================ Chapter 10: conditional
for (const [setup, subject, opts, d] of [
  ['type IsString<T> = T extends string ? "yes" : "no";', 'IsString<"Dune">', ['"yes"', '"no"', '"yes" | "no"', 'never'], "easy"],
  ['type IsString<T> = T extends string ? "yes" : "no";', 'IsString<string | number>', ['"yes" | "no"', '"no"', '"yes"', 'never'], "hard"],
  ['type IsString<T> = T extends string ? "yes" : "no";', 'IsString<never>', ['never', '"no"', '"yes"', '"yes" | "no"'], "hard"],
  ['type IsString<T> = [T] extends [string] ? "yes" : "no";', 'IsString<string | number>', ['"no"', '"yes" | "no"', '"yes"', 'never'], "hard"],
  ['type ToArray<T> = T extends any ? T[] : never;', 'ToArray<string | number>', ['string[] | number[]', '(string | number)[]', 'never', 'any[]'], "medium"],
  ['type ElementOf<T> = T extends (infer I)[] ? I : T;', 'ElementOf<boolean[]>', ['boolean', 'boolean[]', 'never', 'unknown'], "easy"],
  ['type ElementOf<T> = T extends (infer I)[] ? I : T;', 'ElementOf<number>', ['number', 'never', 'unknown', 'number[]'], "easy"],
  ['type Unwrap<T> = T extends Promise<infer V> ? V : T;', 'Unwrap<Promise<Promise<string>>>', ['Promise<string>', 'string', 'never', 'Promise<Promise<string>>'], "hard"],
  ['type Ret<F> = F extends (...a: any[]) => infer R ? R : never;', 'Ret<(x: string) => boolean>', ['boolean', 'string', 'never', '(x: string) => boolean'], "easy"],
  ['type First<F> = F extends (a: infer A, ...r: any[]) => any ? A : never;', 'First<(id: string, n: number) => void>', ['string', 'number', '[string, number]', 'never'], "medium"],
  ['type Status = "active" | "overdue" | "returned";', 'Exclude<Status, "returned">', ['"active" | "overdue"', '"returned"', 'Status', 'never'], "easy"],
  ['type Status = "active" | "overdue" | "returned";', 'Extract<Status, "overdue" | "lost">', ['"overdue"', '"overdue" | "lost"', 'never', 'Status'], "medium"],
  ['type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;', 'MessageOf<{ message: number[] }>', ['number[]', 'unknown', 'never', '{ message: number[] }'], "medium"],
  ['type IdNum<T> = T extends `b${infer N extends number}` ? N : never;', 'IdNum<"b42">', ['42', 'number', '"42"', 'never'], "hard"],
  ['type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;', 'Last<[1, 2, 3]>', ['3', '1', '1 | 2 | 3', 'never'], "medium"],
]) typeEq("conditional", d, setup, subject, opts, "A conditional type picks a branch by assignability; over a bare type parameter it distributes across unions (and never gives never); infer extracts the matched part.");
for (const [code, d] of [
  ['type Flag<S extends boolean> = S extends true ? string : string | undefined;\nfunction title<S extends boolean>(id: string, strict: S): Flag<S> {\n  const t = ({ b1: "Dune" } as Record<string, string>)[id];\n  if (strict && t === undefined) throw new Error("none");\n  return t as Flag<S>;\n}\nconsole.log(title("b1", true), title("b9", false) ?? "(none)");', "medium"],
]) output("conditional", d, code, [], "Conditional types only describe the result; the runtime logic decides it.");

// ================================================================ Chapter 11: mapped
for (const [setup, subject, opts, d] of [
  ['type Flags<T> = { [K in keyof T]: boolean };', 'Flags<{ a: string; b: number }>', ['{ a: boolean; b: boolean }', '{ a: string; b: number }', 'boolean', 'Record<string, boolean>'], "easy"],
  ['type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };', 'keyof Getters<{ name: string; age: number }>', ['"getName" | "getAge"', '"name" | "age"', '"getname" | "getage"', 'string'], "medium"],
  ['type Mutable<T> = { -readonly [K in keyof T]: T[K] };', 'Mutable<{ readonly id: string }>', ['{ id: string }', '{ readonly id: string }', '{ id?: string }', 'never'], "medium"],
  ['type Req<T> = { [K in keyof T]-?: T[K] };', 'Req<{ a?: number }>', ['{ a: number }', '{ a?: number }', '{ a: number | undefined }', '{ a: undefined }'], "medium"],
  ['type Shelf = "A" | "B";\ntype Level = 1 | 2;', '`${Shelf}${Level}`', ['"A1" | "A2" | "B1" | "B2"', '"A1" | "B2"', 'string', '"AB12"'], "easy"],
  ['type Status = "active" | "overdue";', '`on${Capitalize<Status>}`', ['"onActive" | "onOverdue"', '"onactive" | "onoverdue"', '"onActive"', 'string'], "easy"],
  ['type S = "Dune";', 'Uppercase<S> | Uncapitalize<S>', ['"DUNE" | "dune"', '"DUNE"', '"Dune" | "dune"', 'string'], "easy"],
  ['type OnlyStrings<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };', 'keyof OnlyStrings<{ kind: "c"; r: number; label: string }>', ['"kind" | "label"', '"label"', '"r"', '"kind" | "r" | "label"'], "hard"],
  ['type RouteParams<S extends string> = S extends `${string}:${infer P}/${infer Rest}` ? P | RouteParams<`/${Rest}`> : S extends `${string}:${infer P}` ? P : never;', 'RouteParams<"/books/:id/copies/:copy">', ['"id" | "copy"', '"id"', 'string', 'never'], "hard"],
]) typeEq("mapped", d, setup, subject, opts, "Mapped types produce one property per key; as renames (never removes); -/+ change modifiers; template literals multiply union members.");
assign("mapped", "medium", 'type BookId = `b${number}`;', "BookId", ['"b42"', '"b1.5"', '"book-42"', '"b"', '"B7"'], "`b${number}` accepts \"b\" followed by anything that is a valid number string.");
assign("mapped", "medium", 'type Route = `${"GET" | "POST"} /${string}`;', "Route", ['"GET /books"', '"POST /"', '"PUT /books"', '"get /books"', '"GET books"'], "Each placeholder must match: the method from the union, a space, a slash, then any string.");
assign("mapped", "hard", 'type Size = `${number}${"px" | "rem"}`;', "Size", ['"12px"', '"1.5rem"', '"12"', '"px"', '"-3px"'], "A number followed by one of the units; a missing number or unit doesn't fit.");

// ================================================================ Chapter 12: utility
const UT_SETUP = 'interface Book { id: string; title: string; author: string; year: number; isbn?: string }';
for (const [subject, opts, d] of [
  ['keyof Pick<Book, "id" | "title">', ['"id" | "title"', '"author" | "year" | "isbn"', 'keyof Book', 'never'], "easy"],
  ['keyof Omit<Book, "id" | "isbn">', ['"title" | "author" | "year"', '"id" | "isbn"', 'keyof Book', '"title"'], "easy"],
  ['Partial<Pick<Book, "year">>', ['{ year?: number }', '{ year: number }', '{ year: number | undefined }', 'Partial<Book>'], "medium"],
  ['Required<Pick<Book, "isbn">>', ['{ isbn: string }', '{ isbn?: string }', '{ isbn: string | undefined }', 'never'], "medium"],
  ['Record<"a" | "b", Book["year"]>', ['{ a: number; b: number }', '{ [k: string]: number }', 'number[]', '{ a: Book; b: Book }'], "easy"],
  ['NonNullable<Date | null | undefined>', ['Date', 'Date | null', 'Date | undefined', 'never'], "easy"],
  ['Parameters<(id: string, days?: number) => void>', ['[id: string, days?: number]', '[string, number]', 'string[]', '(id: string, days?: number)'], "medium"],
  ['ReturnType<() => Promise<Book[]>>', ['Promise<Book[]>', 'Book[]', 'Book', 'void'], "easy"],
  ['Awaited<ReturnType<() => Promise<Book[]>>>', ['Book[]', 'Promise<Book[]>', 'Book', 'unknown'], "medium"],
  ['Awaited<Promise<Promise<number>>>', ['number', 'Promise<number>', 'never', 'unknown'], "medium"],
  ['InstanceType<typeof Date>', ['Date', 'typeof Date', 'DateConstructor', 'object'], "medium"],
  ['ConstructorParameters<typeof Map<string, number>>[0] extends undefined ? "no" : "yes"', ['"yes"', '"no"', '"yes" | "no"', 'never'], "hard"],
  ['Extract<"a" | "b" | 1 | 2, string>', ['"a" | "b"', '1 | 2', 'string', 'never'], "easy"],
  ['Exclude<string | number | boolean, number | boolean>', ['string', 'number | boolean', 'never', 'string | number'], "easy"],
  ['Readonly<{ tags: string[] }>["tags"]', ['string[]', 'readonly string[]', 'ReadonlyArray<string> | string[]', 'never'], "hard"],
]) typeEq("utility", d, UT_SETUP, subject, opts, "Pick/Omit select keys, Partial/Required change ?, Record builds a dictionary, Readonly is shallow, Awaited unwraps promises recursively, and the function helpers use infer.");
lines("utility", "medium", 'interface Member { id: string; name: string }\ntype A = Pick<Member, "phone">;\ntype B = Omit<Member, "phone">;\nconst r: Record<"x" | "y", number> = { x: 1 };', "Pick checks keys (line 2), Omit doesn't (line 3 compiles), and Record with literal keys needs every key (line 4).");
compiles("utility", "medium", 'interface Config { loanDays: number; currency: "EUR" | "USD" }', ['const c: Partial<Config> = {};', 'const c: Required<Config> = { loanDays: 1 };', 'const c: Readonly<Config> = { loanDays: 1, currency: "EUR" }; c.loanDays = 2;', 'const c: Pick<Config, "currency"> = { currency: "USD" };'], "Partial allows {}; Required needs every key; Readonly forbids assignment.");

// ================================================================ Chapter 13: enums
for (const [code, d] of [
  ['enum Direction { Up, Down, Left, Right }\nconsole.log(Direction.Left, Direction[1]);', "easy"],
  ['enum Priority { Low = 1, Medium, High }\nconsole.log(Priority.High, Priority[2]);', "easy"],
  ['enum E { A = 3, B, C }\nconsole.log(E.C, E[4]);', "medium"],
  ['enum Status { Active = "ACTIVE", Overdue = "OVERDUE" }\nconsole.log(Object.values(Status).join(","), Object.keys(Status).length);', "medium"],
  ['enum Direction { Up, Down }\nconsole.log(Object.keys(Direction).length);', "hard"],
  ['const S = { Active: "active", Overdue: "overdue" } as const;\ntype S = (typeof S)[keyof typeof S];\nconst s: S = "overdue";\nconsole.log(s === S.Overdue, Object.keys(S));', "medium"],
  ['const id: unique symbol = Symbol("id");\nconst b = { title: "Dune", [id]: 7 };\nconsole.log(b[id], Object.keys(b), JSON.stringify(b));', "medium"],
  ['function* ids(n: number) { for (let i = 1; i <= n; i++) yield `b${i}`; return n; }\nconst g = ids(2);\nconsole.log([...ids(3)].join(","), g.next().value, g.next().value, g.next().value);', "hard"],
]) output("enums", d, code, [], "Numeric enums auto-increment and have reverse mappings (so twice the keys); string enums don't; symbols aren't listed by Object.keys or JSON; a generator's return value appears only as the final next().value.");
lines("enums", "medium", 'enum LoanStatus { Active = "ACTIVE", Overdue = "OVERDUE" }\nfunction badge(s: LoanStatus) { return s; }\nbadge(LoanStatus.Overdue);\nbadge("OVERDUE");', "String enums are nominal: the matching plain string on line 4 isn't accepted.");
lines("enums", "medium", 'enum Color { Red, Green }\nconst enum Shelf { A = "A" }\nnamespace N { export const x = 1; }\nclass P { constructor(private x: number) {} }', "erasableSyntaxOnly rejects every non-erasable feature: enums, const enums, namespaces with values and parameter properties.", { flags: { erasableSyntaxOnly: true } });
typeEq("enums", "medium", 'const LoanStatus = { Active: "active", Overdue: "overdue", Returned: "returned" } as const;', '(typeof LoanStatus)[keyof typeof LoanStatus]', ['"active" | "overdue" | "returned"', '"Active" | "Overdue" | "Returned"', 'string', 'typeof LoanStatus'], "The as const object keeps literal values; indexing by its keys gives the union of values.");

// ================================================================ Chapter 14: compat
const COMPAT_ASSIGN = [
  ["(dog: { name: string; owner: string }) => void", ['(p: { name: string }) => {}', '(d: { name: string; owner: string; chip: string }) => {}', '() => {}', '(d: { name: string; owner: string }, extra: number) => {}']],
  ["unknown", ["1", '"a"', "null", "undefined", "{ a: 1 }"]],
  ["never", ["null as never", "undefined", "(() => { throw 0; })()", "{} as unknown"]],
  ["{ name: string }", ['{ name: "Rex", owner: "Ana" } as { name: string; owner: string }', '{ name: "Rex" }', '{}', '{ name: 1 }']],
  ["number", ['1 as any', '1 as unknown', '"1" as any', "null as never"]],
];
for (const [type, values] of COMPAT_ASSIGN) for (let k = 0; k < 2; k++) assign("compat", "hard", "", type, sample(values, 4), "unknown accepts everything; never accepts only never; any is assignable to everything; function parameters must accept at least what callers pass.");
lines("compat", "hard", 'interface WithMethod { handle(x: string | number): void }\ninterface WithProp { handle: (x: string | number) => void }\nconst onlyStrings = { handle(x: string) {} };\nconst a: WithMethod = onlyStrings;\nconst b: WithProp = onlyStrings;', "Method-style declarations are checked bivariantly (line 4 OK); function-property declarations get strictFunctionTypes (line 5 fails).");
lines("compat", "medium", 'type Colors = "red" | "green";\nconst p1 = { red: "#f00", green: "#0f0" } satisfies Record<Colors, string>;\nconst p2 = { red: "#f00", gren: "#0f0" } satisfies Record<Colors, string>;\nconst up = p1.green.toUpperCase();', "satisfies runs the excess property check (line 3) but keeps the precise type, so line 4 works.");
lines("compat", "medium", 'type BookId = string & { readonly __b: "Book" };\ntype MemberId = string & { readonly __b: "Member" };\nconst b = "b1" as BookId;\nconst m: MemberId = b;\nconst s: string = b;', "Different brands are incompatible (line 4), but a branded string is still a string (line 5).");
for (const [setup, subject, opts, d] of [
  ['class Book { constructor(public id: string) {} }\nclass Dvd { constructor(public id: string) {} }\nconst shelf = [new Book("b1"), new Dvd("d1")];', '(typeof shelf)[number]', ['Book | Dvd', 'Book', 'Dvd', 'object'], "medium"],
  ['const limits = { student: 3, staff: 10 } satisfies Record<string, number>;', 'keyof typeof limits', ['"student" | "staff"', 'string', 'string | number', 'never'], "medium"],
  ['const limits: Record<string, number> = { student: 3, staff: 10 };', 'keyof typeof limits', ['string', '"student" | "staff"', 'string | number', 'never'], "medium"],
]) typeEq("compat", d, setup, subject, opts, "Best common type gives a union of element types; an annotation replaces the inferred type, while satisfies keeps it.");

// ================================================================ Chapter 15: modules
compiles("modules", "medium", "", ['import { type Book, find } from "./shared.js";\nconst b: Book | undefined = find("b1");', 'import { Book } from "./shared.js";\nconst b: Book | null = null;', 'import type { Book } from "./shared.js";\nconst b: Book | null = null;', 'import count from "./shared.js";\nconst n: number = count();'], "With verbatimModuleSyntax, importing a type without the type marker is TS1484; default and named value imports are fine.", { flags: { verbatimModuleSyntax: true }, question: "With `verbatimModuleSyntax` on, which of these files compile? (select all that apply)" });
compiles("modules", "medium", "", ['import { find } from "./shared.js";\nfind("b1");', 'import { find } from "./shared";\nfind("b1");', 'import * as lib from "./shared.js";\nlib.find("b1");', 'import { find } from "./shared.ts";\nfind("b1");'], "With module nodenext, relative imports need the runtime extension (.js); .ts paths need allowImportingTsExtensions.", { question: "With `module: \"nodenext\"`, which imports compile? (select all that apply)" });
for (const [code, d] of [
  ['import count, { books } from "./shared.js";\nimport * as lib from "./shared.js";\nconsole.log(count(), lib.books === books, lib.find("b2")?.title);', "easy"],
  ['function money(c: number) { return (c / 100).toFixed(2); }\nnamespace money { export const zero = money(0); }\ninterface L { id: string }\ninterface L { days: number }\nconst l: L = { id: "L1", days: 3 };\nconsole.log(money(1299), money.zero, Object.keys(l).length);', "hard"],
  ['const mod = await import("./shared.js");\nconsole.log(mod.default(), typeof mod.find);', "medium"],
  ['namespace Validation { const digits = /^\\d+$/; export const zip = (s: string) => s.length === 5 && digits.test(s); }\nconsole.log(Validation.zip("12345"), Validation.zip("1234a"), "digits" in Validation);', "medium"],
]) output("modules", d, code, [], "Namespaces and merged functions are real objects; interfaces merge and vanish; non-exported namespace members stay private.");

// ================================================================ Chapter 16: decorators
for (const [code, d] of [
  ['const tag = (name: string) => (m: Function, c: ClassMethodDecoratorContext) => { console.log("apply", name); };\nclass A { @tag("outer") @tag("inner") run() {} }\nconsole.log("defined");', "medium"],
  ['function logged<T, A extends unknown[], R>(m: (this: T, ...a: A) => R, c: ClassMethodDecoratorContext<T, (this: T, ...a: A) => R>) {\n  return function (this: T, ...a: A): R { console.log("call", String(c.name)); return m.call(this, ...a); };\n}\nclass L { @logged fee(d: number) { return d * 25; } }\nconst l = new L();\nconsole.log(l.fee(2), l.fee(1));', "medium"],
  ['function trimmed(_: undefined, c: ClassFieldDecoratorContext<unknown, string>) { return (v: string) => v.trim(); }\nclass M { @trimmed name = "  Ana  "; }\nconsole.log(`[${new M().name}]`);', "easy"],
  ['type Ctor<T = {}> = new (...a: any[]) => T;\nconst Named = <B extends Ctor>(Base: B) => class extends Base { name = "unnamed"; };\nconst Tagged = <B extends Ctor>(Base: B) => class extends Base { tags = ["new"]; };\nclass Thing {}\nconst x = new (Tagged(Named(Thing)))();\nconsole.log(x.name, x.tags.length, x instanceof Thing);', "medium"],
  ['const reg: string[] = [];\nfunction register(n: string) { return (cls: Function, c: ClassDecoratorContext) => { c.addInitializer(() => reg.push(n)); }; }\n@register("book") class Book {}\n@register("dvd") class Dvd {}\nconsole.log(reg.join(","), new Book() instanceof Book);', "medium"],
]) output("decorators", d, code, [], "Decorators run once when the class is defined, bottom-up; the replacement method runs on each call; field decorators return initializers; mixins stack subclasses.");
lines("decorators", "hard", 'function positive<T>(t: ClassAccessorDecoratorTarget<T, number>, c: ClassAccessorDecoratorContext<T, number>) {}\nfunction logged(t: Function, c: ClassMethodDecoratorContext) {}\nclass Pages { @positive accessor pages = 1; }\nclass Title { @positive accessor title = "Dune"; }\nclass Run { @logged run() {} }\nclass Count { @logged count = 0; }', "Typed decorators reject the wrong target: a number-accessor decorator on a string accessor (line 4) and a method decorator on a field (line 6).");
lines("decorators", "medium", 'type Ctor<T = {}> = new (...a: any[]) => T;\nfunction Shout<B extends Ctor<{ title: string }>>(Base: B) { return class extends Base { shout() { return this.title + "!"; } }; }\nclass Book { constructor(public title: string) {} }\nclass Laptop { constructor(public serial: string) {} }\nconst A = Shout(Book);\nconst B = Shout(Laptop);', "The constrained mixin requires a title member: Laptop doesn't have one (line 6).");

// ================================================================ Chapter 17: declarations
compiles("declarations", "medium", 'declare function greet(name: string): string;\ndeclare const VERSION: string;', ['const s: string = greet("Ana") + VERSION;', 'greet(42);', 'declare function slug(s: string): string;\nconst t = slug("x").toUpperCase;', 'declare function bad(): void { }'], "declare describes values that exist elsewhere: it type-checks uses, and an ambient declaration can't have a body.");
lines("declarations", "medium", '// @ts-expect-error: deliberately wrong\nconst a: number = "x";\n// @ts-expect-error\nconst b: number = 1;', "@ts-expect-error requires an error on the next line: line 3's directive is unused (TS2578).");
for (const [subject, opts, d] of [
  ['ReturnType<typeof parseInt>', ['number', 'string', 'bigint', 'any'], "easy"],
  ['Parameters<typeof setTimeout>[1]', ['number | undefined', 'number', 'string', 'Function'], "hard"],
]) typeEq("declarations", d, "", subject, opts, "Built-in and Node APIs are typed by declaration files (lib.*.d.ts and @types/node); the utility types read those declarations.");

// ================================================================ Chapter 18: config
compiles("config", "medium", "", ['const s: string = [1, 2][5]!.toString();', 'const n: number = [1, 2][5];', 'const r: Record<string, number> = {}; const v: number = r.x;', 'const r: Record<string, number> = {}; const v = r.x ?? 0;'], "noUncheckedIndexedAccess adds | undefined to index access, so assigning the result straight to number fails.", { flags: { noUncheckedIndexedAccess: true }, question: "With `noUncheckedIndexedAccess` on, which lines compile? (select all that apply)" });
compiles("config", "medium", "", ['interface S { theme?: "light" | "dark" }\nconst s: S = {};', 'interface S { theme?: "light" | "dark" }\nconst s: S = { theme: undefined };', 'interface S { theme?: "light" | "dark" | undefined }\nconst s: S = { theme: undefined };', 'interface S { theme?: "light" | "dark" }\nconst s: S = { theme: "dark" };'], "exactOptionalPropertyTypes separates a missing property from one set to undefined.", { flags: { exactOptionalPropertyTypes: true }, question: "With `exactOptionalPropertyTypes` on, which snippets compile? (select all that apply)" });
compiles("config", "hard", "", ['function f(x) { return x; }', 'class A { name: string; }', 'function g(this: any) { return this; }', 'let s: string = null as any;'], "With strict off, untyped parameters and uninitialized fields are allowed; this: any and as any always compile.", { flags: { strict: false }, question: "With `strict: false`, which lines compile? (select all that apply)" });

// ================================================================ Chapter 19 / A / B: project, javacs, tooling
for (const [code, d] of [
  ['function lateFee(daysLate: number, { perDay = 25, cap = 500 }: { perDay?: number; cap?: number } = {}) { return daysLate <= 0 ? 0 : Math.min(daysLate * perDay, cap); }\nconsole.log(lateFee(0), lateFee(3), lateFee(30), lateFee(3, { perDay: 50 }));', "easy"],
  ['type Result<T> = { ok: true; value: T } | { ok: false; reason: string };\nfunction borrow(open: number, max: number): Result<string> { return open >= max ? { ok: false, reason: `limit (${max}) reached` } : { ok: true, value: "L1" }; }\nfor (const [o, m] of [[0, 1], [1, 1], [2, 3]]) { const r = borrow(o!, m!); console.log(r.ok ? r.value : r.reason); }', "medium"],
  ['const LOAN_POLICY = { student: { maxLoans: 3, days: 21 }, guest: { maxLoans: 1, days: 7 } } as const;\ntype MemberType = keyof typeof LOAN_POLICY;\nconst daysFor = (t: MemberType) => LOAN_POLICY[t].days;\nconsole.log(daysFor("guest") + daysFor("student"));', "easy"],
  ['function daysBetween(a: Date, b: Date) { return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000); }\nconsole.log(daysBetween(new Date(2026, 10, 9), new Date(2026, 10, 12)), daysBetween(new Date(2026, 10, 12), new Date(2026, 10, 9)));', "medium"],
  ['const loans = [{ memberId: "m3" }];\nconst open = loans.filter((l) => (l as any).memberID === "m3").length;\nconsole.log(open);', "medium"],
]) output("project", d, code, [], "The capstone's rules: fees capped at 500, Result values instead of exceptions, limits derived from LOAN_POLICY; and the memberID typo made the open-loan count always 0.");
lines("project", "medium", 'interface Loan { id: string; memberId: string; returnedOn?: Date }\nfunction lateFee(days: number, options?: { perDay?: number }) { return days * (options.perDay || 25); }\nconst open = (ls: Loan[], m: string) => ls.filter((l) => l.memberID === m);\nconst policy = (p: Record<string, { max: number }>, t: string) => p[t].max;', "The three capstone bugs: options possibly undefined (line 2) and the memberID typo (line 3). Line 4 compiles unless noUncheckedIndexedAccess is on.");
lines("project", "hard", 'interface Loan { id: string; memberId: string; returnedOn?: Date }\nfunction lateFee(days: number, options?: { perDay?: number }) { return days * (options.perDay || 25); }\nconst open = (ls: Loan[], m: string) => ls.filter((l) => l.memberID === m);\nconst policy = (p: Record<string, { max: number }>, t: string) => p[t].max;', "With noUncheckedIndexedAccess, p[t] is possibly undefined too (line 4), on top of the lines 2 and 3 bugs.", { flags: { noUncheckedIndexedAccess: true } });
for (const [code, d] of [
  ['const a = { id: "b1" }, b = { id: "b1" };\nconsole.log(a === b, new Set([a, b]).size, new Set([a.id, b.id]).size);', "easy"],
  ['console.log(0.1 + 0.2 === 0.3, 10 + 20 === 30);', "easy"],
  ['type Payment = { kind: "card"; last4: string } | { kind: "cash" };\nconst d = (p: Payment) => (p.kind === "card" ? `card ${p.last4}` : "cash");\nconsole.log([{ kind: "card", last4: "4242" } as Payment, { kind: "cash" } as Payment].map(d).join(" / "));', "easy"],
  ['interface Clock { now(): Date }\nconst fixed = (d: Date): Clock => ({ now: () => d });\nconst overdue = (due: Date, c: Clock) => c.now() > due;\nconsole.log(overdue(new Date(2026, 10, 19), fixed(new Date(2026, 10, 20))));', "medium"],
]) output("javacs", d, code, [], "Objects compare by reference, numbers are binary doubles, unions replace class hierarchies, and structural typing makes test doubles trivial.");
lines("javacs", "medium", 'interface Book { title: string }\nconst x: unknown = {};\nconsole.log(x instanceof Book);\nclass Dvd { title = "" }\nconsole.log(x instanceof Dvd);', "An interface doesn't exist at runtime, so instanceof can't use it (line 3); a class can.");
lines("tooling", "medium", 'const fruits = ["apple"] as const;\n// @ts-expect-error\nconst n: number = "one";\nconst u: undefined = void 0;', "Everything here is valid: @ts-expect-error is satisfied by the error on the next line.");
compiles("tooling", "medium", "", ['enum A { X }', 'const enum B { Y = 1 }', 'type C = "x" | "y";', 'const D = { X: "x" } as const;'], "Type stripping (Node, erasableSyntaxOnly) can only delete types; enums generate code, unions and as const objects don't.", { flags: { erasableSyntaxOnly: true }, question: "With `erasableSyntaxOnly` on (the rule Node's type stripping follows), which lines compile? (select all that apply)" });

// ================================================================ parameterised families (random values, compiler-checked)
const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const KEYS = ["id", "title", "author", "year", "isbn"];
for (let n = 0; n < 22; n++) {
  const keys = sample(KEYS, ri(1, 3)).sort((a, b) => KEYS.indexOf(a) - KEYS.indexOf(b));
  const rest = KEYS.filter((k) => !keys.includes(k));
  const lit = (ks) => ks.map((k) => `"${k}"`).join(" | ") || "never";
  const util = pick(["Pick", "Omit"]);
  const right = util === "Pick" ? keys : rest;
  const wrongs = [util === "Pick" ? rest : keys, KEYS, right.slice(0, -1).length ? right.slice(0, -1) : KEYS.slice(0, 2)].map(lit);
  typeEq("utility", "easy", UT_SETUP, `keyof ${util}<Book, ${lit(keys)}>`, [...new Set([lit(right), ...wrongs])], `${util} keeps ${util === "Pick" ? "only the listed keys" : "every key except the listed ones"}.`);
}
const WORDS = ["borrow", "return", "renew", "fine", "reserve", "close"];
for (let n = 0; n < 14; n++) {
  const ws = sample(WORDS, ri(1, 3));
  const fn = pick(["Capitalize", "Uppercase"]);
  const conv = (w) => (fn === "Capitalize" ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase());
  const prefix = pick(["on", "can", "did"]);
  const good = ws.map((w) => `"${prefix}${conv(w)}"`).join(" | ");
  const bad1 = ws.map((w) => `"${prefix}${w}"`).join(" | ");
  const bad2 = ws.map((w) => `"${prefix}${conv(w)}"`).slice(0, 1).join(" | ") + (ws.length > 1 ? "" : ' | "' + prefix + '"');
  typeEq("mapped", "medium", `type E = ${ws.map((w) => `"${w}"`).join(" | ")};`, `\`${prefix}\${${fn}<E>}\``, [...new Set([good, bad1, bad2, "string"])], `${fn} transforms each union member, and the template literal maps over the union.`);
}
for (let n = 0; n < 10; n++) {
  const a = sample(["A", "B", "C"], ri(1, 2)), b = sample([1, 2, 3], ri(1, 3)).sort();
  const combos = a.flatMap((x) => b.map((y) => `"${x}${y}"`));
  const wrong1 = a.map((x, i) => `"${x}${b[i % b.length]}"`).join(" | ");
  typeEq("mapped", "easy", `type Shelf = ${a.map((x) => `"${x}"`).join(" | ")};\ntype Level = ${b.join(" | ")};`, "`${Shelf}-${Level}`", [...new Set([combos.map((c) => c.replace(/"(\w)(\d)"/, '"$1-$2"')).join(" | "), wrong1, combos.join(" | "), "string"])], "Unions in template placeholders multiply: every Shelf is combined with every Level.");
}
const STATUSES = ["active", "overdue", "returned", "lost", "reserved"];
for (let n = 0; n < 12; n++) {
  const all = sample(STATUSES, ri(3, 5));
  const drop = sample(all, ri(1, 2));
  const op = pick(["Exclude", "Extract"]);
  const keep = op === "Exclude" ? all.filter((x) => !drop.includes(x)) : drop;
  const lit = (xs) => xs.map((x) => `"${x}"`).join(" | ") || "never";
  typeEq("conditional", op === "Extract" ? "medium" : "easy", `type Status = ${lit(all)};`, `${op}<Status, ${lit(drop)}>`, [...new Set([lit(keep), lit(op === "Exclude" ? drop : all.filter((x) => !drop.includes(x))), lit(all), "never"])], `${op} is a distributive conditional type: it ${op === "Exclude" ? "drops" : "keeps"} the members assignable to the second argument.`);
}
for (let n = 0; n < 12; n++) {
  const keys = sample(["student", "staff", "guest", "vip", "alumni"], ri(2, 4));
  const vals = keys.map(() => ri(1, 12));
  const obj = `{ ${keys.map((k, i) => `${k}: ${vals[i]}`).join(", ")} }`;
  const asConst = rand() < 0.5;
  const lit = keys.map((k) => `"${k}"`).join(" | ");
  if (rand() < 0.5) typeEq("keyof", "medium", `const LIMITS = ${obj}${asConst ? " as const" : ""};`, "keyof typeof LIMITS", [lit, "string", [...new Set(vals)].join(" | "), "number"], "keyof typeof gives the union of the object's keys, with or without as const.");
  else typeEq("keyof", asConst ? "hard" : "medium", `const LIMITS = ${obj}${asConst ? " as const" : ""};`, "(typeof LIMITS)[keyof typeof LIMITS]", [...new Set([[...new Set(vals)].join(" | "), "number", lit, "string"])], "Indexing by every key gives the union of value types: literals with as const, number without.");
}
for (let n = 0; n < 18; n++) {
  const start = ri(0, 5), names = sample(["Low", "Medium", "High", "Urgent", "Later"], ri(3, 4));
  const idx = ri(0, names.length - 1);
  output("enums", "medium", `enum Priority { ${names.map((x, i) => (i === 0 ? `${x} = ${start}` : x)).join(", ")} }\nconsole.log(Priority.${names[idx]}, Priority[${start + names.length - 1}]);`, [`${idx} ${names.at(-1)}`, `${start + idx + 1} ${names.at(-1)}`, `${start + idx} undefined`], "Numeric enum members count up from the first initializer, and numeric enums have reverse mappings (value → name).");
}
for (let n = 0; n < 16; n++) {
  const days = ri(-2, 30), per = pick([10, 25, 50]), cap = pick([200, 500, 1000]);
  const useOpts = rand() < 0.6;
  output("project", days > 20 ? "medium" : "easy", `function lateFee(daysLate: number, { perDay = 25, cap = 500 }: { perDay?: number; cap?: number } = {}) {\n  return daysLate <= 0 ? 0 : Math.min(daysLate * perDay, cap);\n}\nconsole.log(lateFee(${days}${useOpts ? `, { perDay: ${per}, cap: ${cap} }` : ""}));`, [String(Math.max(0, days) * (useOpts ? per : 25)), String(useOpts ? cap : 500), String(days * 25)], "The fee is days × perDay, capped, and 0 when the book isn't late; destructuring defaults fill in missing options.");
}
for (let n = 0; n < 10; n++) {
  const due = ri(5, 25), today = ri(1, 30), returned = rand() < 0.3;
  output("project", "medium", `const day = (d: number) => new Date(2026, 10, d);\nfunction statusOf(loan: { due: Date; returnedOn?: Date }, today: Date) {\n  if (loan.returnedOn !== undefined) return "returned";\n  return today > loan.due ? "overdue" : "active";\n}\nconsole.log(statusOf({ due: day(${due})${returned ? ", returnedOn: day(3)" : ""} }, day(${today})));`, ["active", "overdue", "returned"], "statusOf checks returnedOn first, then compares today with the due date.");
}
for (let n = 0; n < 18; n++) {
  const v = pick(['"Dune"', "42", "0", '""', "null", "true", "[1, 2]", "undefined", "3.5"]);
  output("narrowing", "medium", `function describe(v: unknown): string {\n  if (typeof v === "string") return v.length ? "text" : "empty text";\n  if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";\n  if (Array.isArray(v)) return "list of " + v.length;\n  if (v === null || v === undefined) return "nothing";\n  return typeof v;\n}\nconsole.log(describe(${v}));`, ["text", "int", "object", "nothing", "boolean", "empty text", "float", "list of 2"], "Each typeof / Array.isArray / === check narrows unknown, and the first matching branch returns.");
}
for (let n = 0; n < 12; n++) {
  const a = pick(["undefined", "1", "3", "null as any"]), b = pick(["", ", undefined", ", 2", ", 0"]);
  output("functions", "medium", `function order(qty = 1, price = 10) { return qty * price; }\nconsole.log(order(${a}${b}));`, ["10", "0", "NaN", "20", "30", "1"], "Default values apply only when the argument is undefined; null is a real value (and null * 10 is 0).");
}
for (let n = 0; n < 14; n++) {
  const base = ri(7, 30), cap = ri(3, 14);
  output("classes", "easy", `class Item { loanDays() { return ${base}; } }\nclass Dvd extends Item { override loanDays() { return Math.min(super.loanDays(), ${cap}); } }\nconst items: Item[] = [new Item(), new Dvd()];\nconsole.log(items.map((i) => i.loanDays()).join(","));`, [`${base},${base}`, `${cap},${cap}`, `${base},${Math.max(base, cap)}`], "Methods are virtual: the Dvd instance uses its override, which calls super.loanDays() for the base value.");
}
for (let n = 0; n < 10; n++) {
  const xs = Array.from({ length: ri(3, 6) }, () => ri(1, 9));
  output("generics", "easy", `function groupBy<T, K extends string>(xs: T[], key: (x: T) => K) {\n  const o = {} as Record<K, T[]>;\n  for (const x of xs) (o[key(x)] ??= []).push(x);\n  return o;\n}\nconst g = groupBy([${xs.join(", ")}], (n) => (n > 4 ? "big" : "small"));\nconsole.log(g.big?.length ?? 0, g.small?.length ?? 0);`, [], "groupBy pushes each item into the bucket named by key(x); types don't change the runtime result.");
}
for (let n = 0; n < 10; n++) {
  const len = ri(2, 4), types = sample(["string", "number", "boolean", "Date"], len);
  const i = ri(0, len - 1);
  typeEq("objects", "easy", `type Row = [${types.map((t, k) => `f${k}: ${t}`).join(", ")}];`, `Row[${i}]`, [...new Set([types[i], types.join(" | "), types[(i + 1) % len], "unknown"])], "Indexing a tuple type with a position gives that element's type.");
}

// ---------------------------------------------------------------- more families for thinner topics
const NULL_TYPES = ["string | null", "string | undefined", "string", "string | null | undefined"];
const NULL_EXPRS = ["v.length", "v?.length", "v!.length", '(v ?? "").length', 'typeof v === "string" ? v.length : 0', "v && v.length", 'String(v).length', 'v?.length ?? -1'];
for (let n = 0; n < 16; n++) {
  const t = pick(NULL_TYPES);
  compiles("basics", "medium", `declare const v: ${t};`, sample(NULL_EXPRS, 4).map((e) => `const n: number | string | null | undefined = ${e};`), `With strictNullChecks, \`v\` of type ${t} must be narrowed (typeof, ??, ?.) or asserted (!) before reading .length.`);
}
const FLAG_POOLS = [
  [{ noUncheckedIndexedAccess: true }, "noUncheckedIndexedAccess", ["const a = [1, 2]; const x: number = a[0];", "const a = [1, 2]; const x: number = a[0]!;", "const a = [1, 2]; const x = a[0] ?? 0;", "const r: Record<string, string> = {}; const s: string = r.k;", "const t: [number, number] = [1, 2]; const x: number = t[0];", "const m = new Map<string, number>(); const x: number | undefined = m.get(\"a\");", "const a = [1, 2]; for (const x of a) { const y: number = x; }"], "noUncheckedIndexedAccess adds | undefined to array and index-signature lookups, but not to fixed tuple positions or for...of values."],
  [{ exactOptionalPropertyTypes: true }, "exactOptionalPropertyTypes", ['interface S { t?: string } const s: S = {};', 'interface S { t?: string } const s: S = { t: undefined };', 'interface S { t?: string | undefined } const s: S = { t: undefined };', 'interface S { t?: string } const s: S = { t: "x" };', 'interface S { t?: string } const s: S = {}; s.t = undefined;', 'interface S { t?: string } const s: S = {}; delete s.t;'], "With exactOptionalPropertyTypes, an optional property may be missing but may not be set to undefined unless its type says so."],
  [{ noImplicitReturns: true }, "noImplicitReturns", ['function f(x: number) { if (x > 0) return "pos"; }', 'function f(x: number) { if (x > 0) return "pos"; return "neg"; }', 'function f(x: number): string | undefined { if (x > 0) return "pos"; return undefined; }', 'function f(x: number) { if (x > 0) { console.log(x); } }'], "noImplicitReturns reports functions where some paths return a value and others fall off the end."],
  [{ noFallthroughCasesInSwitch: true }, "noFallthroughCasesInSwitch", ['function f(x: number) { switch (x) { case 1: console.log(1); case 2: return 2; } return 0; }', 'function f(x: number) { switch (x) { case 1: case 2: return 2; } return 0; }', 'function f(x: number) { switch (x) { case 1: console.log(1); break; case 2: return 2; } return 0; }', 'function f(x: number) { switch (x) { case 1: return 1; default: return 0; } }'], "noFallthroughCasesInSwitch reports a non-empty case that falls into the next one; empty cases may share a body."],
  [{ noUnusedLocals: true }, "noUnusedLocals", ['export function f() { const unused = 1; return 2; }', 'export function f() { const used = 1; return used; }', 'export function f() { const _ignored = 1; return 2; }', 'export const x = 1;'], "noUnusedLocals reports declared but never-read locals (even with an underscore prefix for variables)."],
  [{ noUnusedParameters: true }, "noUnusedParameters", ['export function f(a: number, b: number) { return a; }', 'export function f(a: number, _b: number) { return a; }', 'export function f(a: number) { return a; }', 'export const g = (x: string) => 1;'], "noUnusedParameters reports parameters that are never read, unless their name starts with _."],
  [{ strictPropertyInitialization: false }, "strictPropertyInitialization: false (strict still on)", ['class A { name: string; }', 'class A { name!: string; }', 'class A { name: string = ""; }', 'function f(x) { return x; }'], "Turning off strictPropertyInitialization allows uninitialised fields, but noImplicitAny (still part of strict) keeps rejecting untyped parameters."],
  [{ useUnknownInCatchVariables: false }, "useUnknownInCatchVariables: false", ['try {} catch (e) { console.log(e.message); }', 'try {} catch (e) { if (e instanceof Error) console.log(e.message); }', 'try {} catch (e: unknown) { console.log(e.message); }', 'try {} catch { console.log("failed"); }'], "With the option off, a catch variable is any (so e.message compiles); an explicit : unknown annotation still requires narrowing."],
];
for (const [flags, label, pool, expl] of FLAG_POOLS) for (let k = 0; k < (pool.length > 5 ? 3 : 1); k++) compiles("config", "medium", "", sample(pool, 4), expl, { flags, question: `With \`${label}\` on top of strict, which lines compile? (select all that apply)` });
const VERBATIM = ['import { type Book, find } from "./shared.js";\nfind("b1");', 'import { Book } from "./shared.js";\nlet b: Book;', 'import type { Book } from "./shared.js";\nlet b: Book;', 'import { find } from "./shared.js";\nfind("b1");', 'import type { find } from "./shared.js";\nfind("b1");', 'import type { Format } from "./shared.js";\nconst f: Format = "ebook";', 'import { Format } from "./shared.js";\nconst f: Format = "ebook";', 'import count from "./shared.js";\ncount();', 'export type { Book } from "./shared.js";', 'export { Book } from "./shared.js";'];
for (let k = 0; k < 5; k++) compiles("modules", "medium", "", sample(VERBATIM, 4), "With verbatimModuleSyntax, type-only names must be imported/exported with `type`, and a name imported with `import type` can't be used as a value.", { flags: { verbatimModuleSyntax: true }, question: "With `verbatimModuleSyntax` on, which files compile? (select all that apply)" });
const PATHS = ['import { find } from "./shared.js";', 'import { find } from "./shared";', 'import { find } from "./shared.ts";', 'import { find } from "./shared.mjs";', 'import * as s from "./shared.js";', 'import fs from "node:fs";', 'import { readFileSync } from "node:fs";', 'import { nope } from "./shared.js";'];
for (let k = 0; k < 4; k++) compiles("modules", "medium", "", sample(PATHS, 4), "With module nodenext, relative imports name the emitted .js file, node: built-ins are fine, and importing a name the module doesn't export is an error.", { question: "With `module: \"nodenext\"`, which import lines compile? (select all that apply)" });
const ERASABLE = ["enum A { X }", "const enum B { Y = 1 }", 'type C = "x" | "y";', 'const D = { X: "x" } as const;', "namespace N { export const v = 1; }", "namespace T { export type U = string; }", "class P { constructor(private x: number) {} }", "class Q { constructor(x: number) {} }", "interface I { a: string }", "declare const g: number;", "abstract class R { abstract m(): void }", "class S { #x = 1; readonly y = 2; }", "let v = <number>(1 as unknown);"];
for (let k = 0; k < 6; k++) compiles("tooling", "medium", "", sample(ERASABLE, 4), "erasableSyntaxOnly allows only syntax that can be deleted: no enums, no namespaces with values, no parameter properties, and no old-style <T>x assertions.", { flags: { erasableSyntaxOnly: true }, question: "With `erasableSyntaxOnly` on (what Node's type stripping requires), which lines compile? (select all that apply)" });
const SHAPES = [
  ["{ name: string }", ['{ name: "Rex" }', "{ name: 1 }", "{}", '{ name: "Rex", age: 3 }', 'JSON.parse("{}")', 'Object.assign({}, { name: "Rex" })']],
  ["(x: string | number) => void", ["(x: string) => {}", "(x: unknown) => {}", "() => {}", "(x: string | number | boolean) => {}", "(x: number) => {}"]],
  ["() => string | number", ['() => "a"', "() => 1", "() => true", '(): string => "a"', "() => null"]],
  ["readonly string[]", ['["a"]', '["a"] as const', '[] as string[]', "[1]", 'new Set(["a"])']],
  ["object", ["{}", "[]", "() => 1", '"a"', "null", "new Date()"]],
  ["{}", ["{}", '"a"', "0", "null", "undefined", "[]"]],
];
for (const [type, values] of SHAPES) for (let k = 0; k < 3; k++) assign("compat", "hard", "", type, sample(values, 4), `Assignability to \`${type}\` is structural: objects need the required members, functions may accept more and return more specific types, object excludes primitives, and {} accepts everything except null and undefined.`);

// ---------------------------------------------------------------- round 3 families
for (const [subject, opts, d] of [
  ["ReturnType<typeof Math.max>", ["number", "number[]", "bigint", "any"], "easy"],
  ["ReturnType<typeof JSON.parse>", ["any", "unknown", "object", "string"], "medium"],
  ["ReturnType<typeof JSON.stringify>", ["string", "string | undefined", "any", "object"], "medium"],
  ["ReturnType<typeof Object.keys>", ["string[]", "(string | number)[]", "PropertyKey[]", "never[]"], "medium"],
  ["ReturnType<typeof Date.now>", ["number", "Date", "string", "bigint"], "easy"],
  ["ReturnType<typeof parseFloat>", ["number", "string", "number | undefined", "any"], "easy"],
  ["ReturnType<typeof Array.isArray>", ["arg is any[]", "boolean", "arg is unknown[]", "true"], "hard"],
  ["ReturnType<typeof Promise.resolve<number>>", ["Promise<number>", "number", "Promise<unknown>", "Promise<Promise<number>>"], "medium"],
  ["ReturnType<typeof structuredClone<string[]>>", ["string[]", "unknown", "any", "readonly string[]"], "medium"],
  ["ReturnType<typeof Number.isInteger>", ["boolean", "number is number", "number", "true"], "medium"],
  ["Parameters<typeof Math.round>", ["[x: number]", "[number, number]", "number[]", "[]"], "easy"],
  ["Awaited<ReturnType<typeof fetch>>", ["Response", "Promise<Response>", "Body", "any"], "hard"],
]) typeEq("declarations", d, "", subject, opts, "These answers come straight from the declaration files: lib.es*.d.ts for JavaScript built-ins and @types/node for Node APIs such as fetch.");
for (let n = 0; n < 10; n++) {
  const v = pick(['"100"', '"7"', "true", "null", '[5]', '"abc"', "undefined", "{}"]);
  const op = pick([["* 2", "double"], ["+ 1", "plusOne"], ["- 1", "minusOne"]]);
  output("why", "medium", `function ${op[1]}(n: number): number {\n  return n ${op[0]};\n}\nconsole.log(${op[1]}(${v} as any));`, ["200", "8", "NaN", "2", "101", "1001", "throws TypeError", "0"], "Types are erased: `as any` hides the wrong argument, and JavaScript's own conversion rules decide the result.");
}
for (let n = 0; n < 8; n++) {
  const a = (ri(1, 9) / 10).toFixed(1), b = (ri(1, 9) / 10).toFixed(1);
  output("javacs", "medium", `const a = ${a}, b = ${b};\nconsole.log(a + b === ${(Number(a) + Number(b)).toFixed(1)}, Math.round((a + b) * 10) / 10);`, ["true " + (Number(a) + Number(b)).toFixed(1), "false " + (Number(a) + Number(b)).toFixed(1)], "number is a binary double like Java's double: many decimal sums aren't exact, so compare rounded values or use integer cents.");
}
for (let n = 0; n < 8; n++) {
  const inputs = sample(["14", "x", "99", "0", "30", "-5", "60", "7.5"], 3);
  output("javacs", "medium", `type Result<T> = { ok: true; value: T } | { ok: false; error: string };\nfunction parseDays(s: string): Result<number> {\n  const n = Number(s);\n  if (!Number.isInteger(n)) return { ok: false, error: "not a whole number" };\n  if (n < 1 || n > 60) return { ok: false, error: "out of range" };\n  return { ok: true, value: n };\n}\nconsole.log(${JSON.stringify(inputs)}.map((s) => { const r = parseDays(s); return r.ok ? r.value : r.error; }).join(" | "));`, [], "A Result union makes failures part of the return type, like a checked exception that the caller can't forget.");
}
for (let n = 0; n < 12; n++) {
  const names = sample(["audit", "trace", "time", "cache", "retry"], ri(2, 3));
  output("decorators", "medium", `const log = (name: string) => (m: Function, c: ClassMethodDecoratorContext) => { console.log("apply " + name); };\nclass Service {\n  ${names.map((x) => `@log("${x}")`).join(" ")} run() {}\n}\nconsole.log("ready");`, [names.map((x) => `apply ${x}`).concat("ready").join(" / ")], "Decorators are applied once at class definition, bottom-up: the one closest to the method first.");
}
for (let n = 0; n < 6; n++) {
  const calls = ri(1, 4), times = ri(1, 4);
  output("decorators", "hard", `function retry(times: number) {\n  return <T, A extends unknown[], R>(m: (this: T, ...a: A) => R, c: ClassMethodDecoratorContext<T, (this: T, ...a: A) => R>) =>\n    function (this: T, ...a: A): R {\n      for (let i = 1; ; i++) { try { return m.call(this, ...a); } catch (e) { if (i >= times) throw e; } }\n    };\n}\nclass Job { n = 0; @retry(${times}) run() { if (++this.n < ${calls}) throw new Error("fail"); return "ok after " + this.n; } }\ntry { console.log(new Job().run()); } catch { console.log("gave up"); }`, ["ok after 1", "gave up", `ok after ${calls}`, `ok after ${times}`], "The replacement method retries up to `times` attempts; it succeeds once the counter reaches the number of calls needed.");
}
const ISOLATED = ['export { Book } from "./shared.js";', 'export type { Book } from "./shared.js";', 'export { find } from "./shared.js";', 'import { Book } from "./shared.js";\nexport { Book };', 'import type { Book } from "./shared.js";\nexport type { Book };', 'export * from "./shared.js";', 'declare const enum K { A }\nexport const k = K.A;'];
for (let k = 0; k < 5; k++) compiles("tooling", "hard", "", sample(ISOLATED, 4), "isolatedModules requires that each file can be compiled alone: re-exporting a type without `type` (TS1205), and using an ambient const enum, need information from other files.", { flags: { isolatedModules: true }, question: "With `isolatedModules` on (needed by esbuild, Babel and type strippers), which files compile? (select all that apply)" });
for (let k = 0; k < 4; k++) compiles("tooling", "medium", "", sample(ERASABLE, 4), "erasableSyntaxOnly allows only syntax that can be deleted to leave valid JavaScript.", { flags: { erasableSyntaxOnly: true }, question: "Which lines can Node's type stripping run? (They are compiled here with `erasableSyntaxOnly`.) (select all that apply)" });
const BASIC_TYPES = [["number", ["42", "NaN", '"42"', "null", "Number(\"4\")", "4n"]], ["string | undefined", ['"x"', "undefined", "null", "42", "String(42)"]], ["boolean | null", ["true", "null", "undefined", '"false"', "0 > 1"]], ["Date", ["new Date()", "Date.now()", '"2026-11-05"', "new Date(0)", "null"]]];
for (const [type, values] of BASIC_TYPES) for (let k = 0; k < 3; k++) assign("basics", "easy", "", type, sample(values, 4), "Under strictNullChecks, null and undefined must be part of the type, and no implicit conversions happen between strings, numbers, bigints and dates.");
for (let k = 0; k < 4; k++) compiles("modules", "medium", "", sample(VERBATIM, 4), "verbatimModuleSyntax keeps every import that isn't marked with type, so type-only names must be marked, and type-only imports can't be used as values.", { flags: { verbatimModuleSyntax: true }, question: "With `verbatimModuleSyntax` on, which files compile? (select all that apply)" });
for (let k = 0; k < 3; k++) compiles("modules", "medium", "", sample(PATHS, 4), "nodenext checks imports the way Node will run them: relative paths name the emitted .js file.", { question: "With `module: \"nodenext\"`, which import lines compile? (select all that apply)" });

// ================================================================ resolve everything with the compiler
const dir = workdir("tsqgen-");
const allChecks = pending.flatMap((p) => p.checks);
console.log(`compiling ${allChecks.length} checks for ${pending.length} candidate questions…`);
const errors = compileBatch(dir, allChecks, { emit: true });
const outputs = await runMany(dir, pending.filter((p) => p.kind === "output").map((p) => emitted(p.checks[0].name)));

const questions = [];
const seen = new Set();
function addQ(q) {
  const key = q.question + "|" + [...q.options].sort().join("|");
  if (seen.has(key)) return false;
  if (new Set(q.options).size !== q.options.length) return false;
  if (!q.answer.length || q.answer.length === q.options.length) return false;
  if (q.options.length < 4 || q.options.length > 6) return false;
  seen.add(key);
  const [number, , file] = CHAPTERS[q.topic];
  questions.push({ id: 0, topic: q.topic, chapter: number, chapterFile: file, difficulty: q.difficulty, question: q.question, options: q.options, answer: q.answer, explanation: q.explanation,
    // computed questions get a topic-specific template id (the assessment shows at most 2 per template); hand-written ones have none
    ...(q.run ? { template: `${q.topic}-${q.template}`, run: q.run } : {}) });
  return true;
}

let dropped = 0;
const report = [];
for (const p of pending) {
  const q = { ...p.q };
  if (p.kind === "compiles") {
    q.answer = p.checks.map((c, i) => (errors.get(c.name).length === 0 ? i : -1)).filter((i) => i >= 0);
    q.run = { kind: "compiles", flags: p.flags ?? {}, checks: p.checks.map((c) => c.code) };
    if (q.template === "typeEq" && (q.answer.length !== 1 || q.answer[0] !== 0)) console.log(`NOTE typeEq answer ${JSON.stringify(q.answer.map((i) => q.options[i]))} (intended ${q.options[0]}): ${q.question.split("\n")[0]} ${q.question.split("\n").slice(2).join(" ").slice(0, 120)}`);
    if (q.template !== "typeEq") report.push(`${q.template}: ${q.question.split("\n")[0].slice(0, 50)} | ${q.question.split("\n").slice(2).join(" ").slice(0, 70)} → ${JSON.stringify(q.answer.map((i) => q.options[i]))}`);
  } else if (p.kind === "lines") {
    const lineSet = new Set(errors.get(p.checks[0].name).map((e) => Number(e.match(/^\((\d+),/)[1])));
    q.answer = q.options.map((_, i) => (lineSet.has(i + 1) ? i : -1)).filter((i) => i >= 0);
    if (!q.answer.length) { q.options = [...q.options, "No line has an error"]; q.answer = [q.options.length - 1]; }
    q.run = { kind: "lines", flags: p.flags ?? {}, code: p.checks[0].code };
    report.push(`lines: ${p.checks[0].code.split("\n")[0].slice(0, 60)} → ${JSON.stringify(q.answer.map((i) => q.options[i]))} | ${q.explanation.slice(0, 90)}`);
  } else {
    if (errors.get(p.checks[0].name).length) { console.log("output snippet has type errors:", p.q.question.slice(0, 80), errors.get(p.checks[0].name)); dropped++; continue; }
    const out = outputs.get(emitted(p.checks[0].name));
    const shown = out.split("\n").join(" / ");
    const wrong = [...p.wrong, ...perturb(shown)].filter((w) => w !== shown);
    const opts = shuffle([shown, ...[...new Set(wrong)].slice(0, 3)]);
    q.options = opts; q.answer = [opts.indexOf(shown)];
    q.run = { kind: "output", flags: p.flags ?? {}, code: p.checks[0].code, expect: shown };
  }
  if (!addQ(q)) dropped++;
}
writeFileSync(join(dir, "report.txt"), report.join("\n"));
console.log("review report:", join(dir, "report.txt"));
console.log(`computed: ${questions.length} kept, ${dropped} dropped (duplicates, no or all answers, or bad snippets)`);

function perturb(s) {
  const out = [];
  const nums = s.match(/-?\d+(\.\d+)?/g) ?? [];
  if (nums.length) {
    out.push(s.replace(nums[0], String(Number(nums[0]) + 1)));
    out.push(s.replace(nums.at(-1), String(Number(nums.at(-1)) * 2 || 1)));
  }
  if (/true/.test(s)) out.push(s.replace("true", "false"));
  if (/false/.test(s)) out.push(s.replace("false", "true"));
  out.push(s.includes(" / ") ? s.split(" / ").reverse().join(" / ") : s + " / undefined");
  out.push("throws TypeError");
  out.push(s.replace(/'/g, '"'));
  out.push("undefined");
  return out.filter((x) => x !== s);
}

// ================================================================ hand-written questions + build
const handStart = questions.length;
addHandwritten((topic, difficulty, question, options, explanation) => {
  const answer = options.map((o, i) => (o.startsWith("*") ? i : -1)).filter((i) => i >= 0);
  const opts = options.map((o) => o.replace(/^\*/, ""));
  const order = shuffle(opts.map((_, i) => i));
  const ok = addQ({ topic, difficulty, question, options: order.map((i) => opts[i]), answer: order.map((i, j) => (answer.includes(i) ? j : -1)).filter((j) => j >= 0), explanation, template: "handwritten" });
  if (!ok) console.log("hand-written question rejected:", question.slice(0, 70));
});
console.log(`hand-written: ${questions.length - handStart}`);

const countBy = (k) => questions.reduce((m, q) => ((m[q[k]] = (m[q[k]] || 0) + 1), m), {});
// trim to TARGET: remove from the biggest topics first, never below 30 per topic
while (questions.length > TARGET) {
  const byTopic = countBy("topic");
  const biggest = Object.keys(byTopic).sort((a, b) => byTopic[b] - byTopic[a])[0];
  const i = questions.findLastIndex((q) => q.topic === biggest && q.run);
  if (i < 0 || byTopic[biggest] <= 30) break;
  questions.splice(i, 1);
}
const order = Object.keys(CHAPTERS);
questions.sort((a, b) => order.indexOf(a.topic) - order.indexOf(b.topic));
questions.forEach((q, i) => { q.id = i + 1; });
writeFileSync(join(ROOT, "questions.json"), JSON.stringify({
  version: 1, topic: "TypeScript (Beginner)", generated: "2026-11-05", total: questions.length,
  chapters: Object.fromEntries(Object.entries(CHAPTERS).map(([k, [number, title, file]]) => [k, { number, title, file }])), questions,
}, null, 1) + "\n");
const multi = questions.filter((q) => q.answer.length > 1).length;
console.log(`total ${questions.length} | multi-answer ${multi} | difficulty ${JSON.stringify(countBy("difficulty"))}`);
console.log("per topic:", Object.entries(countBy("topic")).map(([k, v]) => `${k} ${v}`).join(", "));
console.log("templates:", new Set(questions.map((q) => q.template).filter(Boolean)).size, "| hand-written:", questions.filter((q) => !q.run).length);
