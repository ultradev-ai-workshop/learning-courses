// Generates questions.json for the Tailwind CSS Study Book (1000 questions, all 22 topics).
//
// Computed questions are answered by asking the real Tailwind CSS 4.3.5, never by the author's guess:
//   decl     "Which CSS does `p-4` generate?"            → compiled with @tailwindcss/node
//   rdecl    "Which class generates `display: grid`?"   → the same, in reverse
//   variant  "What does `md:` wrap a utility in?"       → compiled `md:underline`, wrapper read from the output
//   px       "How many pixels is `w-64`?"               → declaration + default theme values
//   exists   "Which of these classes generate CSS?"     → compiled one by one
//   canon    "Canonical form of `w-10 h-10`?"           → `tailwindcss canonicalize`
//   sort     "Prettier's order for these classes?"      → prettier-plugin-tailwindcss
//   apply    "What does @apply put in .btn?"            → compiled CSS with the rule
//   merge    "What does twMerge(…) return?"             → tailwind-merge
// Fact questions come from tables in the docs (questions-facts.mjs), and hand-written questions from
// questions-hand-*.mjs. tools/verify-questions.mjs re-runs every computed question independently.
//
// Usage: node tools/gen-questions.mjs && node tools/verify-questions.mjs && node tools/make-questions-js.mjs
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { twMerge } from "tailwind-merge";
import { canonicalize, CHAPTERS, declsOf, makeRandom, pxOf, ROOT, ruleDecls, sortClasses, variantShape } from "./q-lib.mjs";
import { addFacts } from "./questions-facts.mjs";
import { addHandwritten } from "./questions-handwritten.mjs";

const TARGET = 1000;
const R = makeRandom(20261106);
const questions = [];
const seen = new Set();

export function addQ(q) {
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
function single(base, correct, wrong) {
  const opts = R.shuffle([correct, ...R.shuffle([...new Set(wrong)].filter((w) => w !== correct)).slice(0, 3)]);
  return { ...base, options: opts, answer: [opts.indexOf(correct)] };
}
const code = (s) => "`" + s + "`";

// ================================================================ 1. declarations, both directions
// [topic, css (or null for the default), easy classes, other classes]
const POOLS = [
  ["utility", null, ["p-4", "p-1", "px-6", "py-3", "mt-px", "bg-sky-500", "text-red-700", "border", "rounded-lg", "text-center", "underline", "italic", "font-bold", "hidden", "block", "text-white"],
    ["p-2.5", "p-7", "-mt-4", "border-2", "rounded-full", "font-semibold", "bg-black/50", "size-12", "text-sky-700!", "border-t-2", "mx-auto", "line-through", "inline-block", "bg-white", "text-slate-500", "opacity-75"]],
  ["layout", null, ["absolute", "relative", "fixed", "sticky", "inset-0", "top-0", "z-10", "overflow-hidden", "overflow-x-auto", "aspect-video", "aspect-square", "object-cover", "visible", "invisible"],
    ["inset-x-4", "-top-1", "z-50", "-z-10", "isolate", "overflow-clip", "object-contain", "columns-2", "columns-xs", "contents", "flow-root", "float-right", "box-border", "inset-s-0", "overscroll-contain", "object-top", "static", "overflow-y-auto", "right-0", "bottom-4"]],
  ["flexgrid", null, ["flex", "flex-col", "flex-wrap", "flex-1", "grow", "shrink-0", "justify-between", "justify-center", "items-center", "items-start", "gap-4", "grid", "grid-cols-3", "col-span-2", "place-items-center"],
    ["inline-flex", "flex-row-reverse", "flex-col-reverse", "flex-auto", "flex-none", "flex-initial", "basis-64", "basis-1/3", "order-first", "order-last", "justify-evenly", "justify-around", "items-baseline", "items-stretch", "self-end", "content-between", "gap-x-2", "gap-y-6", "grid-cols-12", "grid-rows-2", "col-span-full", "row-span-3", "col-start-2", "col-end-4", "grid-flow-col", "grid-flow-dense", "auto-cols-fr", "auto-rows-min", "place-content-center", "grid-cols-subgrid", "grid-rows-subgrid", "justify-items-center", "justify-center-safe", "flex-nowrap", "self-center", "inline-grid"]],
  ["spacing", null, ["w-64", "w-1/2", "w-full", "w-screen", "w-fit", "h-full", "h-screen", "max-w-prose", "max-w-md", "size-10", "mx-auto", "min-w-0"],
    ["w-2/3", "w-dvw", "w-min", "w-max", "w-auto", "w-px", "w-xs", "w-3xs", "h-dvh", "h-svh", "h-lvh", "min-h-dvh", "max-w-7xl", "max-h-96", "ms-2", "me-4", "ps-3", "pe-6", "pbs-4", "mbe-2", "m-px", "-ml-3", "min-h-0", "max-w-none", "h-fit", "w-5/12", "inline-full", "block-full"]],
  ["typography", null, ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "font-thin", "font-medium", "uppercase", "truncate", "text-balance", "list-disc", "font-mono", "leading-tight", "tracking-tight"],
    ["text-4xl", "text-6xl", "text-lg/7", "font-black", "tracking-widest", "leading-loose", "leading-6", "capitalize", "lowercase", "line-clamp-3", "text-pretty", "text-nowrap", "whitespace-pre", "wrap-break-word", "wrap-anywhere", "break-all", "hyphens-auto", "list-inside", "list-decimal", "tabular-nums", "antialiased", "font-serif", "decoration-wavy", "decoration-2", "underline-offset-4", "text-ellipsis", "indent-8", "align-middle", "text-justify", "normal-case", "not-italic", "decoration-sky-500", "slashed-zero", "font-extrabold", "text-9xl"]],
  ["effects", null, ["bg-cover", "bg-center", "bg-no-repeat", "border-dashed", "rounded-xl", "opacity-50", "border-sky-500", "bg-clip-text", "outline-2"],
    ["bg-contain", "bg-fixed", "bg-linear-to-r", "bg-linear-45", "bg-radial", "bg-conic", "border-x-2", "rounded-t-lg", "rounded-s-md", "rounded-xs", "rounded-4xl", "outline-offset-2", "outline-hidden", "outline-dashed", "opacity-0", "mix-blend-multiply", "bg-blend-overlay", "bg-repeat-x", "border-dotted", "rounded-br-2xl", "outline-sky-500", "bg-origin-border", "rounded-none", "border-none"]],
  ["motion", null, ["transition-colors", "transition-none", "duration-300", "ease-in", "ease-out", "rotate-45", "animate-spin", "animate-pulse", "origin-top-left"],
    ["duration-75", "duration-1000", "ease-linear", "ease-in-out", "delay-150", "-rotate-6", "animate-none", "animate-bounce", "animate-ping", "transition-discrete", "perspective-near", "backface-hidden", "transform-3d", "origin-center", "transition-opacity", "transition-transform", "rotate-x-45", "perspective-distant", "transform-none"]],
  ["modern", null, ["@container", "accent-pink-500", "appearance-none", "cursor-pointer", "select-none", "pointer-events-none", "resize-none", "scroll-smooth"],
    ["@container-size", "caret-sky-500", "field-sizing-content", "resize-y", "scroll-mt-20", "snap-center", "snap-start", "scrollbar-thin", "scrollbar-none", "scrollbar-gutter-stable", "zoom-125", "zoom-75", "tab-4", "cursor-not-allowed", "cursor-grab", "touch-manipulation", "will-change-transform", "forced-color-adjust-none", "select-all", "snap-x", "scrollbar-auto", "scroll-pt-16", "@container/main"]],
  ["dark", null, ["scheme-dark", "scheme-light"], ["scheme-light-dark", "scheme-normal", "scheme-only-dark"]],
  ["arbitrary", null, ["top-[117px]", "bg-[#bada55]", "text-[22px]", "w-(--sidebar)"],
    ["grid-cols-[200px_1fr]", "w-[calc(100%-2rem)]", "text-[#333]", "fill-(--brand)", "p-(--pad)", "text-(length:--size)", "text-(color:--c)", "[mask-type:luminance]", "[--gutter:1rem]", "bg-[url(/a.png)]", "-mt-[3px]", "aspect-[4/3]", "bg-black/[0.37]", "min-h-[3lh]", "max-w-[60ch]", "grid-rows-[auto_1fr_auto]", "z-[60]", "tracking-[0.2em]", "leading-[1.1]", "duration-[1200ms]", "bg-(image:--img)", "columns-[10rem]", "[scrollbar-gutter:stable]", "text-(--brand)", "bg-[var(--surface,white)]"]],
];
const THEME_CSS = `@import "tailwindcss";\n@theme {\n  --color-mint-500: oklch(0.72 0.11 178);\n  --font-display: "Georgia", serif;\n  --radius-pill: 9999px;\n  --spacing: 0.5rem;\n  --breakpoint-3xl: 120rem;\n  --shadow-glow: 0 0 12px rgb(56 189 248 / 0.6);\n  --animate-fade-in: fade-in 0.3s ease-out;\n}`;
POOLS.push(["theme", THEME_CSS, ["bg-mint-500", "font-display", "rounded-pill", "p-4"], ["text-mint-500/50", "border-mint-500", "3xl:p-2", "m-10", "w-8", "animate-fade-in", "gap-3", "outline-mint-500", "decoration-mint-500", "fill-mint-500"]]);
const CUSTOM_CSS = `@import "tailwindcss";\n@theme {\n  --depth-dropdown: 10;\n  --depth-modal: 50;\n}\n@utility content-auto {\n  content-visibility: auto;\n}\n@utility depth-* {\n  z-index: --value(--depth-*, integer);\n}\n@utility stack-* {\n  display: flex;\n  flex-direction: column;\n  gap: --spacing(--value(integer, --default(4)));\n}\n@utility grid-fill-* {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(--value([length]), 1fr));\n}`;
POOLS.push(["custom", CUSTOM_CSS, ["content-auto", "depth-modal", "depth-3"], ["depth-dropdown", "stack-2", "stack", "grid-fill-[12rem]", "hover:content-auto", "depth-[7]", "stack-6", "depth-1"]]);

const DECL_STEMS = ["Which CSS does the class %s generate?", "You add %s to an element. Which declarations does Tailwind generate for it?", "What does %s compile to?"];
let declCount = 0, rdeclCount = 0;
for (const [topic, css, easy, other] of POOLS) {
  const all = [...easy, ...other];
  const decl = {};
  for (const c of all) {
    const d = await declsOf(c, css ?? undefined);
    if (!d.length) { console.log("no CSS for", c); continue; }
    const shown = d.join("; ");
    if (shown.length > 120) continue;
    decl[c] = shown;
  }
  const classes = Object.keys(decl);
  const cssNote = css ? `\n\n(The CSS file defines:)\n${css.split("\n").slice(1).join("\n")}` : "";
  for (const c of classes) {
    const wrong = R.shuffle(classes.filter((x) => decl[x] !== decl[c])).map((x) => decl[x]);
    if (wrong.length < 3) continue;
    const difficulty = easy.includes(c) ? "easy" : topic === "arbitrary" || topic === "custom" ? "hard" : "medium";
    const stem = R.pick(DECL_STEMS).replace("%s", code(c));
    if (addQ(single({ topic, difficulty, template: `${topic}-decl`, question: stem + cssNote,
      explanation: `Tailwind 4.3.5 generates ${code(decl[c])} for ${code(c)}.`, run: { kind: "decl", cls: c, css, expect: decl[c] } }, decl[c], wrong))) declCount++;
  }
  // reverse: which class gives this CSS? (only for single-declaration classes in the default theme)
  if (!css) {
    for (const c of R.sample(classes, Math.ceil(classes.length * 0.55))) {
      if (decl[c].includes(";")) continue;
      const wrong = classes.filter((x) => x !== c && decl[x] !== decl[c]);
      if (addQ(single({ topic, difficulty: easy.includes(c) ? "easy" : "medium", template: `${topic}-rdecl`,
        question: `Which class generates ${code(decl[c])}?`, explanation: `${code(c)} generates ${code(decl[c])}.`,
        run: { kind: "rdecl", cls: c, expect: decl[c] } }, c, R.shuffle(wrong)))) rdeclCount++;
    }
  }
}
console.log(`decl: ${declCount}, rdecl: ${rdeclCount}`);

// ================================================================ 2. variants
const VARIANTS = [
  ["states", ["hover", "focus", "focus-visible", "focus-within", "active", "visited", "disabled", "first", "last", "odd", "even", "only", "empty", "first-of-type", "nth-3", "group-hover", "group-focus", "peer-checked", "peer-invalid", "peer-user-invalid", "has-checked", "not-first", "before", "after", "placeholder", "file", "marker", "selection", "first-line", "backdrop", "*", "required", "invalid", "user-invalid", "user-valid", "checked", "indeterminate", "placeholder-shown", "read-only", "open", "aria-pressed", "aria-expanded", "aria-selected", "aria-[sort=ascending]", "data-active", "data-[state=open]", "group-has-checked", "in-focus", "rtl", "inert", "target", "autofill", "**"]],
  ["responsive", ["sm", "md", "lg", "xl", "2xl", "max-sm", "max-md", "max-lg", "max-xl", "md:max-lg", "min-[900px]", "max-[1200px]", "sm:max-md", "portrait", "landscape"]],
  ["dark", ["dark", "dark:hover", "dark:md"]],
  ["motion", ["motion-reduce", "motion-safe", "starting"]],
  ["modern", ["@sm", "@md", "@lg", "@max-md", "@min-[475px]", "@lg/main", "@sm:@max-md", "supports-[display:grid]", "pointer-coarse", "pointer-fine", "contrast-more", "forced-colors", "print", "noscript", "details-content", "inverted-colors"]],
  ["arbitrary", ["[&.is-active]", "[&_p]", "[&>a]", "[@supports(display:grid)]", "[&:nth-child(3)]", "[.dark_&]"]],
];
const shapes = {};
for (const [, list] of VARIANTS) for (const v of list) { const s = await variantShape(v); if (s) shapes[v] = s; else console.log("no shape for", v); }
const allShapes = Object.entries(shapes);
let varCount = 0;
for (const [topic, list] of VARIANTS) {
  for (const v of list) {
    if (!shapes[v]) continue;
    const same = allShapes.filter(([w, s]) => s !== shapes[v]);
    const nearby = same.filter(([w]) => list.includes(w)).map(([, s]) => s);
    const wrong = [...R.shuffle(nearby), ...R.shuffle(same.map(([, s]) => s))];
    const difficulty = ["hover", "focus", "md", "sm", "lg", "dark", "first", "last", "before", "after", "disabled", "odd"].includes(v) ? "easy" : v.includes("[") || v.includes(":") ? "hard" : "medium";
    if (addQ(single({ topic, difficulty, template: `${topic}-variant`,
      question: `Tailwind 4.3 compiles ${code(v + ":underline")} to which CSS? (".x" stands for the class selector, "›" for nesting)`,
      explanation: `The variant ${code(v + ":")} wraps the utility as ${code(shapes[v])}.`, run: { kind: "variant", variant: v, expect: shapes[v] } }, shapes[v], wrong))) varCount++;
  }
}
// reverse: which variant produces this condition?
for (const [topic, list] of VARIANTS) {
  for (const v of R.sample(list.filter((x) => shapes[x]), Math.ceil(list.length * 0.4))) {
    const wrong = list.filter((w) => w !== v && shapes[w] && shapes[w] !== shapes[v]).map((w) => w + ":");
    if (wrong.length < 3) continue;
    if (addQ(single({ topic, difficulty: "medium", template: `${topic}-rvariant`, question: `Which variant generates ${code(shapes[v])}? (".x" is the utility's selector)`,
      explanation: `${code(v + ":")} generates ${code(shapes[v])}.`, run: { kind: "variant", variant: v, expect: shapes[v], reverse: true } }, v + ":", wrong))) varCount++;
  }
}
console.log(`variant: ${varCount}`);

// ================================================================ 3. pixels
const PX = [
  ["spacing", "padding", ["p-0.5", "p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-8", "p-10", "p-12", "p-16", "p-20", "p-24"]],
  ["spacing", "width", ["w-4", "w-8", "w-12", "w-16", "w-24", "w-32", "w-48", "w-56", "w-64", "w-72", "w-80", "w-96", "w-xs", "w-sm", "w-md", "w-lg", "w-xl", "w-2xl", "w-3xs", "w-2xs"]],
  ["spacing", "margin-top", ["mt-1", "mt-2.5", "mt-6", "mt-14", "mt-40", "mt-px", "-mt-2"]],
  ["flexgrid", "gap", ["gap-1", "gap-2", "gap-3", "gap-4", "gap-6", "gap-8", "gap-10"]],
  ["typography", "font-size", ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl", "text-9xl"]],
  ["effects", "border-radius", ["rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-4xl"]],
  ["layout", "top", ["top-1", "top-4", "-top-2", "top-10", "top-px"]],
  ["utility", "height", ["h-1", "h-6", "h-10", "h-14", "h-32", "h-px", "h-3.5"]],
];
let pxCount = 0;
for (const [topic, prop, list] of PX) {
  const vals = {};
  for (const c of list) {
    const d = (await declsOf(c)).find((x) => x.startsWith(prop + ":"));
    if (!d) { console.log("no", prop, "for", c); continue; }
    const px = await pxOf(d.slice(prop.length + 1).trim());
    if (Number.isFinite(px)) vals[c] = px;
  }
  const fmt = (n) => `${+n.toFixed(2)}px`;
  for (const [c, px] of Object.entries(vals)) {
    const wrong = [px * 2, px / 2, px + 4, px * 4, px - 2, px + 8, Object.values(vals)[0]].filter((x) => x !== px && x >= -100).map(fmt);
    if (addQ(single({ topic, difficulty: ["p-4", "w-64", "text-base", "rounded-lg", "gap-4", "text-sm"].includes(c) ? "easy" : "medium", template: `${topic}-px`,
      question: `With the default theme (1rem = 16px), what is the ${prop} of ${code(c)} in pixels?`,
      explanation: `${code(c)} sets ${prop} from the theme; the computed value is ${fmt(px)}.`, run: { kind: "px", cls: c, prop, expect: fmt(px) } }, fmt(px), wrong))) pxCount++;
  }
}
console.log(`px: ${pxCount}`);

// ================================================================ 4. which classes exist?
const EXISTS = [
  ["upgrade", null, ["bg-opacity-50", "text-opacity-75", "flex-shrink-0", "flex-grow", "shadow", "rounded", "bg-gradient-to-r", "overflow-ellipsis", "decoration-slice", "outline-none", "outline-hidden", "ring", "transform", "filter", "border-opacity-50", "placeholder-opacity-50", "divide-opacity-50", "ring-opacity-50", "shrink-0", "bg-linear-to-r", "text-ellipsis", "box-decoration-slice"]],
  ["what", null, ["txt-red-500", "text-red-500", "bg-sky-1000", "bg-sky-950", "p-4", "padding-4", "flex", "flexbox", "font-bold", "font-heavy", "mx-auto", "margin-auto", "text-center", "align-center", "rounded-lg", "radius-lg"]],
  ["utility", null, ["p-13", "p-2.5", "p-2.3", "w-17", "mt-0.5", "m-auto", "bg-blue-450", "bg-blue-500", "bg-mauve-500", "bg-taupe-200", "text-olive-600", "bg-mist-300", "bg-slate-500", "bg-grey-500", "bg-gray-500", "text-black/50"]],
  ["plugins", '@import "tailwindcss";\n@plugin "@tailwindcss/typography";', ["prose", "prose-lg", "prose-invert", "prose-slate", "not-prose", "prose-a:text-sky-700", "prose-headings:font-serif", "prose-huge", "prose-blue", "prose-xs", "prose-sm", "prose-2xl"]],
  ["theme", THEME_CSS, ["bg-mint-500", "bg-mint-400", "font-display", "font-sans", "rounded-pill", "rounded-lg", "3xl:flex", "4xl:flex", "shadow-glow", "shadow-glow-lg"]],
  ["custom", CUSTOM_CSS, ["content-auto", "hover:content-auto", "depth-modal", "depth-toast", "depth-3", "depth-2.5", "stack", "stack-3", "grid-fill-[12rem]", "grid-fill-12"]],
];
let existsCount = 0;
for (const [topic, css, list] of EXISTS) {
  const has = {};
  for (const c of list) has[c] = (await declsOf(c, css ?? undefined)).length > 0;
  for (let k = 0; k < 8; k++) {
    const pick = R.sample(list, 5);
    const yes = pick.filter((c) => has[c]);
    if (!yes.length || yes.length === pick.length) continue;
    const q = `Which of these classes generate CSS in Tailwind 4.3? (select all that apply)${css ? `\n\n(The CSS file:)\n${css}` : ""}`;
    if (addQ({ topic, difficulty: topic === "what" || topic === "utility" ? "medium" : "hard", template: `${topic}-exists`, question: q,
      options: pick, answer: pick.map((c, i) => (has[c] ? i : -1)).filter((i) => i >= 0),
      explanation: `Generated: ${yes.map(code).join(", ")}. The others match no utility, so Tailwind silently ignores them.`, run: { kind: "exists", classes: pick, css, expect: pick.map((c) => has[c]) } })) existsCount++;
  }
}
console.log(`exists: ${existsCount}`);

// ================================================================ 5. canonical forms and class order
const CANON = ["w-10 h-10", "h-6 w-6", "p-[1rem]", "p-[0.5rem]", "m-[2rem]", "bg-[#fff]", "bg-[#000]", "text-[#fff]", "w-[100%]", "h-[100%]", "bg-[var(--brand)]", "w-[var(--sidebar)]", "!font-bold", "!mt-4", "mt-[16px]", "top-[50%]", "gap-[1rem]", "rounded-[9999px]", "px-[2rem]", "w-[50%]", "[color:red]", "grid-cols-[repeat(3,minmax(0,1fr))]", "flex-shrink-0", "flex-grow", "bg-gradient-to-r", "overflow-ellipsis", "inset-0", "left-0 right-0", "top-0 bottom-0", "mx-[auto]", "z-[10]", "opacity-[0.5]", "w-[1px]", "size-[2.5rem]", "start-0", "text-[0.875rem]", "leading-[1.5]", "max-w-[65ch]", "aspect-[16/9]", "aspect-[1/1]"];
const canonOut = canonicalize(CANON);
let canonCount = 0;
const canonPairs = CANON.map((input, i) => [input, canonOut[i]]);
for (const [input, out] of canonPairs) {
  const wrong = [...R.shuffle(canonPairs.filter(([, o]) => o !== out).map(([, o]) => o)).slice(0, 2), input === out ? input + "!" : input];
  const opts = out === input ? [out, ...R.shuffle(canonPairs.map(([, o]) => o).filter((o) => o !== out)).slice(0, 3)] : null;
  if (addQ(single({ topic: "editor", difficulty: "medium", template: "editor-canon", question: `What does ${code("npx tailwindcss canonicalize \"" + input + "\"")} print?`,
    explanation: input === out ? `${code(input)} is already canonical: it stays the same.` : `The canonical form of ${code(input)} is ${code(out)}.`,
    run: { kind: "canon", input, expect: out } }, out, opts ? opts.slice(1) : wrong))) canonCount++;
}
console.log(`canon: ${canonCount}`);

const SORT_SETS = [
  "text-white px-4 py-2 bg-sky-700 rounded-lg", "hover:bg-sky-800 bg-sky-700 my-btn", "md:p-6 p-4 sm:p-5", "dark:bg-slate-900 bg-white md:flex",
  "font-bold text-lg mt-4", "flex items-center gap-2 justify-between", "absolute top-0 left-0 z-10", "shadow-lg rounded-xl p-6 bg-white",
  "card text-sm hover:underline", "lg:grid-cols-4 grid grid-cols-1 md:grid-cols-2", "focus:outline-2 outline-sky-500 rounded-md", "w-full h-10 block",
  "text-slate-500 text-sm leading-6", "border border-slate-200 rounded-lg", "underline decoration-sky-500 hover:decoration-2", "transition duration-200 hover:scale-105",
  "group-hover:text-white text-slate-900 font-semibold", "peer-checked:bg-emerald-500 bg-slate-300 rounded-full", "sr-only focus:not-sr-only", "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
  "uppercase tracking-widest text-xs font-semibold", "min-h-dvh flex flex-col", "overflow-x-auto rounded-xl ring-1", "inline-flex rounded-full px-2 text-xs",
  "js-toggle hidden md:block", "bg-linear-to-r from-sky-500 to-indigo-500", "size-10 shrink-0 rounded-full", "print:hidden text-black", "@container p-4", "@lg:grid-cols-3 grid gap-4",
];
let sortCount = 0;
for (const input of SORT_SETS) {
  const sorted = await sortClasses(input);
  const parts = input.split(" ");
  const wrong = [input, parts.slice().reverse().join(" "), parts.slice().sort().join(" "), R.shuffle(parts).join(" "), R.shuffle(parts).join(" ")];
  if (addQ(single({ topic: "editor", difficulty: "medium", template: "editor-sort", question: `prettier-plugin-tailwindcss formats ${code(`class="${input}"`)}. What is the new order?`,
    explanation: `The plugin sorts like the generated CSS: unknown classes first, then utilities in CSS order, variants last. Result: ${code(sorted)}.`,
    run: { kind: "sort", input, expect: sorted } }, sorted, wrong))) sortCount++;
}
console.log(`sort: ${sortCount}`);

// ================================================================ 6. @apply, @reference and tailwind-merge
const APPLY = [
  [".btn", "px-4 py-2 font-semibold", "medium"], [".btn", "rounded-lg bg-sky-600 text-white", "easy"], [".card", "p-6 shadow-none rounded-2xl", "medium"],
  [".title", "text-xl font-bold", "medium"], [".link", "text-sky-700 underline", "easy"], [".badge", "inline-flex rounded-full px-2 text-xs", "medium"],
  [".center", "flex items-center justify-center", "easy"], [".stack", "flex flex-col gap-4", "easy"], [".muted", "text-slate-500 italic", "easy"], [".box", "mx-auto max-w-md", "medium"],
];
let applyCount = 0;
const applied = [];
for (const [sel, list, diff] of APPLY) {
  const css = `@import "tailwindcss";\n\n@layer components {\n  ${sel} {\n    @apply ${list};\n  }\n}`;
  const d = (await ruleDecls(css, sel)).join("; ");
  applied.push([sel, list, d, diff, css]);
}
for (const [sel, list, d, diff, css] of applied) {
  const wrong = applied.filter((x) => x[2] !== d).map((x) => x[2]);
  if (addQ(single({ topic: "reusing", difficulty: diff, template: "reusing-apply", question: `Which declarations end up in ${code(sel)}?\n\n${css}`,
    explanation: `@apply copies the utilities' declarations into the rule: ${code(d)}.`, run: { kind: "apply", css, selector: sel, expect: d } }, d, wrong))) applyCount++;
}
console.log(`apply: ${applyCount}`);

const MERGE = [
  [["px-2 py-1 bg-red-500", "p-3 bg-sky-500"], "easy"], [["text-sm text-slate-500", "text-lg"], "medium"], [["hover:bg-sky-600", "hover:bg-sky-800"], "easy"],
  [["p-4 rounded-lg", "rounded-none"], "easy"], [["px-4 py-2", "px-6"], "easy"], [["flex items-center", "block"], "medium"], [["m-2", "mx-4"], "medium"],
  [["mx-4", "m-2"], "medium"], [["text-red-500", "text-lg"], "hard"], [["bg-white dark:bg-slate-900", "dark:bg-black"], "medium"], [["w-full", "w-1/2", "w-auto"], "easy"],
  [["rounded-md shadow-xs", "shadow-lg"], "easy"], [["grid grid-cols-2", "grid-cols-3"], "easy"], [["font-bold", "font-normal italic"], "easy"], [["p-4", "pt-8"], "hard"],
  [["pt-8", "p-4"], "hard"], [["border border-slate-200", "border-2"], "medium"], [["opacity-50", "opacity-100"], "easy"], [["inset-0", "top-4"], "hard"], [["md:p-4 p-2", "p-6"], "medium"],
];
let mergeCount = 0;
const merged = MERGE.map(([args, diff]) => [args, twMerge(...args), diff]);
for (const [args, out, diff] of merged) {
  const joined = args.join(" ");
  const wrong = [joined, args.at(-1), ...R.shuffle(merged.filter((m) => m[1] !== out).map((m) => m[1])).slice(0, 2), args[0]];
  if (addQ(single({ topic: "react", difficulty: diff, template: "react-merge", question: `What does ${code(`twMerge(${args.map((a) => JSON.stringify(a)).join(", ")})`)} return?`,
    explanation: `tailwind-merge keeps the last of each group of conflicting classes and leaves unrelated ones: ${code(JSON.stringify(out))}.`,
    run: { kind: "merge", args, expect: out } }, out, wrong))) mergeCount++;
}
console.log(`merge: ${mergeCount}`);

// ================================================================ 7. facts + hand-written
const before = questions.length;
addFacts((q) => {
  const opts = R.shuffle(q.options.map((o) => [o.replace(/^\*/, ""), o.startsWith("*")]));
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
console.log("before trimming:", questions.length, JSON.stringify(countBy("topic")));
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
  version: 1, topic: "Tailwind CSS (Beginner)", generated: "2026-11-06", total: questions.length,
  chapters: Object.fromEntries(Object.entries(CHAPTERS).map(([key, [number, title, file]]) => [key, { number, title, file }])), questions,
}, null, 1) + "\n");
const multi = questions.filter((q) => q.answer.length > 1).length;
console.log(`total ${questions.length} | multi-answer ${multi} | difficulty ${JSON.stringify(countBy("difficulty"))}`);
console.log("per topic:", Object.entries(countBy("topic")).map(([key, v]) => `${key} ${v}`).join(", "));
console.log("computed:", questions.filter((q) => q.run).length);
if (questions.length < TARGET) console.log(`⚠ only ${questions.length} questions: add more hand-written ones`);
