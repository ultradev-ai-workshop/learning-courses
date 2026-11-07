// Shared helpers for the question generator and verifier: chapters, seeded randomness, and
// asking the real Tailwind CSS 4.3.5 (in tools/node_modules) what a class generates.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import * as prettier from "prettier";

export const TOOLS = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(TOOLS, "..");
export const WORK = join(TOOLS, ".work", "questions");

export const CHAPTERS = {
  what: ["1", "What Tailwind CSS Is", "01-what.html"],
  install: ["2", "Installing Tailwind", "02-install.html"],
  utility: ["3", "Styling with Utility Classes", "03-utility-first.html"],
  editor: ["4", "Editor Setup & Class Order", "04-editor.html"],
  states: ["5", "Hover, Focus & Other States", "05-states.html"],
  responsive: ["6", "Responsive Design", "06-responsive.html"],
  dark: ["7", "Dark Mode", "07-dark-mode.html"],
  theme: ["8", "Theme Variables & Colors", "08-theme.html"],
  arbitrary: ["9", "Arbitrary Values & Properties", "09-arbitrary.html"],
  reusing: ["10", "Reusing Styles", "10-reusing.html"],
  custom: ["11", "Custom Styles, Directives & Detection", "11-custom.html"],
  layout: ["12", "Layout & Positioning", "12-layout.html"],
  flexgrid: ["13", "Flexbox & Grid", "13-flex-grid.html"],
  spacing: ["14", "Spacing & Sizing", "14-spacing-sizing.html"],
  typography: ["15", "Typography", "15-typography.html"],
  effects: ["16", "Backgrounds, Borders & Effects", "16-color-effects.html"],
  motion: ["17", "Transitions, Transforms & Animation", "17-motion.html"],
  modern: ["18", "Container Queries & Modern CSS", "18-modern.html"],
  project: ["19", "Capstone: Tailwind in Next.js", "19-project.html"],
  upgrade: ["A", "Coming from v2 or v3", "appendix-upgrade.html"],
  plugins: ["B", "Plugins: Typography & Forms", "appendix-plugins.html"],
  react: ["C", "Tailwind with React Components", "appendix-react.html"],
};

export function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function makeRandom(seed) {
  const rand = mulberry32(seed);
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return { rand, shuffle, pick: (arr) => arr[Math.floor(rand() * arr.length)], sample: (arr, k) => shuffle(arr).slice(0, k) };
}

// ---------------------------------------------------------------- compiling
const BASE_CSS = '@import "tailwindcss";';
/** The CSS Tailwind generates for some classes: the full output, from a fresh compiler. */
export async function build(classes, css = BASE_CSS) {
  const c = await compile(css, { base: TOOLS, onDependency() {} });
  return c.build(classes);
}

/** Parse CSS into a tree: { type: "rule" | "at" | "decl", prelude, children, prop, value }. */
export function parseCss(css) {
  let i = 0;
  const n = css.length;
  function block() {
    const out = [];
    let buf = "";
    while (i < n) {
      const c = css[i];
      if (c === "/" && css[i + 1] === "*") { const e = css.indexOf("*/", i + 2); i = e < 0 ? n : e + 2; continue; }
      if (c === "\\") { buf += c + css[i + 1]; i += 2; continue; }
      if (c === '"' || c === "'") { const j = css.indexOf(c, i + 1); buf += css.slice(i, j + 1); i = j + 1; continue; }
      if (c === "(") { let d = 0, j = i; for (; j < n; j++) { if (css[j] === "(") d++; else if (css[j] === ")") { d--; if (!d) break; } } buf += css.slice(i, j + 1); i = j + 1; continue; }
      if (c === "{") {
        i++;
        const prelude = buf.trim(); buf = "";
        out.push({ type: prelude.startsWith("@") ? "at" : "rule", prelude, children: block() });
        continue;
      }
      if (c === "}") { i++; if (buf.trim()) out.push(decl(buf)); return out; }
      if (c === ";") { i++; if (buf.trim()) out.push(buf.trim().startsWith("@") ? { type: "at", prelude: buf.trim(), children: [] } : decl(buf)); buf = ""; continue; }
      buf += c; i++;
    }
    if (buf.trim()) out.push(decl(buf));
    return out;
  }
  function decl(s) { s = s.trim(); const k = s.indexOf(":"); return { type: "decl", prop: s.slice(0, k).trim(), value: s.slice(k + 1).trim().replace(/\s+/g, " ") }; }
  return block();
}

/** The utilities layer of a build as a tree (empty when nothing was generated). */
export async function utilityTree(cls, css) {
  const out = await build([cls], css);
  const layer = parseCss(out).find((x) => x.type === "at" && x.prelude === "@layer utilities");
  return layer ? layer.children : [];
}

/** Every declaration that applies when the class matches, with the chain of conditions around it. */
export function flatten(tree, ctx = []) {
  const out = [];
  for (const node of tree) {
    if (node.type === "decl") out.push({ ctx, prop: node.prop, value: node.value });
    else out.push(...flatten(node.children, [...ctx, node.prelude]));
  }
  return out;
}

/** The visible declarations of one class ("prop: value", without Tailwind's internal --tw-* variables). */
export async function declsOf(cls, css) {
  const flat = flatten(await utilityTree(cls, css)).filter((d) => !d.prop.startsWith("--tw-"));
  // when a declaration has a modern version inside @supports, show that one (the first is a fallback)
  const byProp = new Map();
  for (const d of flat) byProp.set(d.prop + "|" + d.ctx.filter((c) => !c.startsWith("@supports")).join(">"), d);
  return [...byProp.values()].map((d) => `${d.prop}: ${d.value}`);
}
/** Declarations of a plain CSS rule (e.g. `.btn` after @apply) in the full output. */
export async function ruleDecls(css, selector, classes = []) {
  const out = await build(classes, css);
  const walk = (tree) => { for (const n of tree) { if (n.type === "rule" && n.prelude === selector) return n; if (n.children) { const r = walk(n.children); if (r) return r; } } return null; };
  const rule = walk(parseCss(out));
  return rule ? flatten(rule.children).filter((d) => !d.prop.startsWith("--tw-")).map((d) => `${d.prop}: ${d.value}`) : [];
}

/** Describe the wrapper a variant adds, using `underline` as the utility: "@media (…) › .x:hover". */
export async function variantShape(variant, utility = "underline") {
  const cls = `${variant}:${utility}`;
  const flat = flatten(await utilityTree(cls));
  const d = flat.find((x) => x.prop === "text-decoration-line");
  if (!d) return null;
  const esc = cssEscape(cls);
  return d.ctx.map((c) => c.split(esc).join(".x").replace(/\s+/g, " ")).join(" › ");
}
export function cssEscape(cls) {
  return "." + cls.replace(/^(\d)/, "\\3$1 ").replace(/[^a-zA-Z0-9_-]/g, (ch) => "\\" + ch);
}

/** Theme values from the default theme (for pixel questions). */
let THEME = null;
export async function themeValue(name) {
  if (!THEME) {
    const out = await build([], '@import "tailwindcss" theme(static);');
    THEME = Object.fromEntries(flatten(parseCss(out)).filter((d) => d.prop.startsWith("--")).map((d) => [d.prop, d.value]));
  }
  return THEME[name];
}
/** Evaluate the px value of a simple length expression from a declaration (rem = 16px). */
export async function pxOf(value) {
  let v = value;
  for (let k = 0; k < 4; k++) {
    const m = v.match(/var\((--[\w-]+)(?:,\s*([^()]+))?\)/);
    if (!m) break;
    const t = await themeValue(m[1]);
    v = v.replace(m[0], t ?? m[2] ?? "NaN");
  }
  const calc = v.match(/^calc\((.+) \* (-?[\d.]+)\)$/);
  const one = (s) => { s = s.trim(); if (s.endsWith("rem")) return parseFloat(s) * 16; if (s.endsWith("px")) return parseFloat(s); if (s === "0") return 0; return NaN; };
  if (calc) return one(calc[1]) * Number(calc[2]);
  return one(v);
}

// ---------------------------------------------------------------- CLI and Prettier
const BIN = join(TOOLS, "node_modules", ".bin");
export function canonicalize(inputs) {
  const r = spawnSync(join(BIN, "tailwindcss"), ["canonicalize", "--format=json", ...inputs], { encoding: "utf8" });
  return JSON.parse(r.stdout).map((x) => x.output);
}
let prettierDir = null;
export async function sortClasses(classes) {
  if (!prettierDir) {
    prettierDir = join(WORK, "prettier");
    mkdirSync(prettierDir, { recursive: true });
    writeFileSync(join(prettierDir, "input.css"), BASE_CSS + "\n");
  }
  const out = await prettier.format(`<div class="${classes}"></div>`, {
    parser: "html", filepath: join(prettierDir, "x.html"), printWidth: 1000,
    plugins: ["prettier-plugin-tailwindcss"], tailwindStylesheet: join(prettierDir, "input.css"),
  });
  return out.match(/class="([^"]*)"/)[1];
}
