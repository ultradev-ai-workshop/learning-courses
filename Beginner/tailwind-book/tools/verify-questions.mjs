// Independently re-checks every computed question in questions.json against Tailwind CSS 4.3.5:
//   decl / rdecl  → the class is compiled again and its declarations compared
//   variant       → `<variant>:underline` is compiled again and the wrapper compared
//   px            → the declaration is compiled again and its pixel value computed
//   exists        → each class is compiled again: does it generate anything?
//   canon         → `tailwindcss canonicalize` runs again
//   sort          → prettier-plugin-tailwindcss sorts again
//   apply         → the CSS with @apply is compiled again and the rule read
//   merge         → tailwind-merge runs again
// and checks that the stored answer is the option matching the fresh result.
// Usage: node tools/verify-questions.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { twMerge } from "tailwind-merge";
import { canonicalize, declsOf, pxOf, ROOT, ruleDecls, sortClasses, variantShape } from "./q-lib.mjs";

const data = JSON.parse(readFileSync(join(ROOT, "questions.json"), "utf8"));
const qs = data.questions.filter((q) => q.run);
let ok = 0, bad = 0;
const fail = (q, msg) => { bad++; console.log(`✘ #${q.id} (${q.run.kind}) ${msg}`); };
const answerText = (q) => q.options[q.answer[0]];
const check = (q, real, shown) => {
  if (real !== q.run.expect) fail(q, `real ${JSON.stringify(real)}, stored ${JSON.stringify(q.run.expect)}`);
  else if (answerText(q) !== shown) fail(q, `stored answer ${JSON.stringify(answerText(q))} doesn't match ${JSON.stringify(shown)}`);
  else ok++;
};

const canonQs = qs.filter((q) => q.run.kind === "canon");
const canonReal = canonicalize(canonQs.map((q) => q.run.input));

for (const q of qs) {
  const r = q.run;
  switch (r.kind) {
    case "decl": { const real = (await declsOf(r.cls, r.css ?? undefined)).join("; "); check(q, real, real); break; }
    case "rdecl": {
      const real = (await declsOf(r.cls)).join("; ");
      // the correct option is the class; every other option must generate something different
      const others = await Promise.all(q.options.filter((o) => o !== r.cls).map(async (o) => (await declsOf(o)).join("; ")));
      if (others.includes(real)) fail(q, "another option generates the same CSS");
      else check(q, real, r.cls);
      break;
    }
    case "variant": { const real = await variantShape(r.variant); check(q, real, r.reverse ? r.variant + ":" : real); break; }
    case "px": {
      const d = (await declsOf(r.cls)).find((x) => x.startsWith(r.prop + ":"));
      const px = d ? await pxOf(d.slice(r.prop.length + 1).trim()) : NaN;
      const real = `${+px.toFixed(2)}px`;
      check(q, real, real);
      break;
    }
    case "exists": {
      const real = await Promise.all(r.classes.map(async (c) => (await declsOf(c, r.css ?? undefined)).length > 0));
      const want = q.options.map((o) => real[r.classes.indexOf(o)]);
      const stored = q.options.map((_, i) => q.answer.includes(i));
      if (JSON.stringify(real) !== JSON.stringify(r.expect)) fail(q, `real ${real}, stored ${r.expect}`);
      else if (JSON.stringify(want) !== JSON.stringify(stored)) fail(q, "stored answers don't match");
      else ok++;
      break;
    }
    case "canon": { const real = canonReal[canonQs.indexOf(q)]; check(q, real, real); break; }
    case "sort": { const real = await sortClasses(r.input); check(q, real, real); break; }
    case "apply": { const real = (await ruleDecls(r.css, r.selector)).join("; "); check(q, real, real); break; }
    case "merge": { const real = twMerge(...r.args); check(q, real, real); break; }
    default: fail(q, "unknown kind");
  }
}

const hand = data.questions.length - qs.length;
console.log(`verified ${ok}/${qs.length} computed questions${bad ? `, ${bad} FAILED` : ""} (${hand} hand-written/fact questions not executable)`);
process.exit(bad ? 1 : 0);
