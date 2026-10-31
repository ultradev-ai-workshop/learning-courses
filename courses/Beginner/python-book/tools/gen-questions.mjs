// Generates questions.json: hand-written questions plus template-generated ones.
// Every generated answer is computed by simulating the Python behaviour below;
// tools/verify-questions.py then re-checks the code-based ones with real Python.
//
// Usage:  node tools/gen-questions.mjs        (then: node tools/make-questions-js.mjs)
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addHandwritten } from './questions-handwritten.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = 1000;

const CHAPTERS = {
  setup: ['1', 'Meet Python & the Interpreter', '01-setup.html'],
  basics: ['2', 'Numbers, Text & Lists', '02-basics.html'],
  control: ['3', 'Making Decisions & Loops', '03-control.html'],
  match: ['4', 'Pattern Matching with match', '04-match.html'],
  functions: ['5', 'Functions in Depth', '05-functions.html'],
  lists: ['6', 'Lists & Comprehensions', '06-lists.html'],
  collections: ['7', 'Tuples, Sets & Dictionaries', '07-collections.html'],
  modules: ['8', 'Modules & Packages', '08-modules.html'],
  io: ['9', 'Input & Output', '09-io.html'],
  exceptions: ['10', 'Errors & Exceptions', '10-exceptions.html'],
  classes: ['11', 'Classes', '11-classes.html'],
  iterators: ['12', 'Iterators & Generators', '12-iterators.html'],
  stdlib1: ['13', 'Standard Library Tour I', '13-stdlib1.html'],
  stdlib2: ['14', 'Standard Library Tour II', '14-stdlib2.html'],
  venv: ['15', 'Virtual Environments & pip', '15-venv.html'],
  project: ['16', 'Project: CLI Expense Tracker', '16-project.html'],
  fromjava: ['A', 'From Java & JavaScript to Python', 'appendix-fromjava.html'],
  shell: ['B', 'Terminal, Paths & Text Encoding', 'appendix-shell.html'],
};

// ---------------------------------------------------------------- random
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261030);
const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const chance = (p) => rand() < p;
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sample = (arr, k) => shuffle(arr).slice(0, k);
const uniq = (arr) => [...new Set(arr)];

// ---------------------------------------------------------------- Python repr helpers
class F { constructor(v) { this.v = v; } }      // a Python float
class T { constructor(items) { this.items = items; } }   // a Python tuple
const fl = (v) => new F(v);
const tup = (...items) => new T(items);
function reprFloat(v) {
  if (Number.isInteger(v)) return v.toFixed(1);
  return String(v);
}
function reprStr(s) {
  const q = s.includes("'") && !s.includes('"') ? '"' : "'";
  let body = s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  if (q === "'") body = body.replace(/'/g, "\\'");
  return q + body + q;
}
function py(v) {
  if (v === null) return 'None';
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (v instanceof F) return reprFloat(v.v);
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return reprStr(v);
  if (v instanceof T) return v.items.length === 1 ? '(' + py(v.items[0]) + ',)' : '(' + v.items.map(py).join(', ') + ')';
  if (Array.isArray(v)) return '[' + v.map(py).join(', ') + ']';
  if (v instanceof Map) return '{' + [...v].map(([k, x]) => py(k) + ': ' + py(x)).join(', ') + '}';
  throw new Error('cannot repr ' + v);
}
const pstr = (v) => (typeof v === 'string' ? v : py(v));        // str() as print() shows it
const floordiv = (a, b) => Math.floor(a / b);
const pymod = (a, b) => a - b * floordiv(a, b);

// Python slice index semantics (CPython PySlice_AdjustIndices)
function sliceIdx(len, start, stop, step = 1) {
  const adj = (v, dflt, lo, hi) => {
    if (v == null) return dflt;
    if (v < 0) { v += len; if (v < 0) v = lo; } else if (v >= len) v = hi;
    return v;
  };
  const out = [];
  if (step > 0) {
    const s = adj(start, 0, 0, len), e = adj(stop, len, 0, len);
    for (let i = s; i < e; i += step) out.push(i);
  } else {
    const s = adj(start, len - 1, -1, len - 1), e = adj(stop, -1, -1, len - 1);
    for (let i = s; i > e; i += step) out.push(i);
  }
  return out;
}
const sliceStr = (s, a, b, c) => sliceIdx(s.length, a, b, c).map((i) => s[i]).join('');
const sliceText = (a, b, c) => `[${a ?? ''}:${b ?? ''}${c != null ? ':' + c : ''}]`;

// ---------------------------------------------------------------- question store
const questions = [];
const seen = new Set();
const perTemplate = {};

function finalize(q) {
  const correct = uniq(q.correct.map(String));
  const wrong = uniq(q.wrong.map(String)).filter((w) => !correct.includes(w));
  let options;
  if (q.exact) {
    options = shuffle([...correct, ...wrong]);
  } else {
    const n = correct.length > 1 ? Math.min(6, Math.max(4, correct.length + 2)) : 4;
    const need = n - correct.length;
    if (wrong.length < need) return null;
    options = shuffle([...correct, ...shuffle(wrong).slice(0, need)]);
  }
  if (options.length < 4 || options.length > 6 || correct.length === 0) return null;
  const answer = options.map((o, i) => (correct.includes(o) ? i : -1)).filter((i) => i >= 0);
  const [number, , file] = CHAPTERS[q.topic];
  const out = {
    id: 0, topic: q.topic, chapter: number, chapterFile: file, difficulty: q.difficulty,
    question: q.question,
  };
  if (q.code) out.code = q.code;
  out.options = options;
  out.answer = answer;
  out.explanation = q.explanation;
  if (q.template) out.template = q.template;
  return out;
}

function add(q) {
  const out = finalize(q);
  if (!out) return false;
  const key = out.question + '|' + (out.code || '') + '|' + [...out.options].sort().join('|');
  if (seen.has(key)) return false;
  seen.add(key);
  questions.push(out);
  return true;
}

function h(topic, difficulty, question, options, explanation, code) {
  const correct = options.filter((o) => o.startsWith('*')).map((o) => o.slice(1));
  const wrong = options.filter((o) => !o.startsWith('*'));
  if (!add({ topic, difficulty, question, code, correct, wrong, explanation, exact: true })) {
    throw new Error('bad hand-written question: ' + question);
  }
}

const TEMPLATES = [];
function template(id, topic, quota, gen) { TEMPLATES.push({ id, topic, quota, gen }); }
function runTemplate(t, quota) {
  let made = 0, fails = 0;
  while (made < quota && fails < 300) {
    const q = t.gen();
    if (q && add({ ...q, topic: q.topic || t.topic, template: t.id })) { made++; fails = 0; } else fails++;
  }
  perTemplate[t.id] = (perTemplate[t.id] || 0) + made;
  return made;
}

// ---------------------------------------------------------------- pools
const WORDS = ['Python', 'expense', 'category', 'receipt', 'banana', 'tracker', 'iterate',
  'generator', 'lambda', 'budget', 'pattern', 'module', 'package', 'string', 'decimal'];
const SHORT = ['tea', 'cake', 'rent', 'bus', 'food', 'fun', 'books', 'pear', 'kiwi', 'fig', 'apple', 'plum', 'date', 'lime'];


// ================================================================ Chapter 1: setup
template('argv-value', 'setup', 30, () => {
  const script = pick(['greet.py', 'tool.py', 'add.py', 'report.py']);
  const args = Array.from({ length: ri(0, 3) }, () => pick(['Ana', 'Ben', '12', '-v', '--all', '3.5', 'food']));
  const exprs = [['len(sys.argv)', String(args.length + 1), [String(args.length), String(args.length + 2)]],
    ['sys.argv[0]', py(script), [py(args[0] ?? 'python3'), "'python3'"]],
    ['sys.argv[1:]', py(args), [py([script, ...args]), py(args.slice(1))]]];
  if (args.length) exprs.push(['sys.argv[1]', py(args[0]), [py(script), args[0]]], ['sys.argv[-1]', py(args.at(-1)), [py(args[0] === args.at(-1) ? script : args[0]), args.at(-1)]]);
  else exprs.push(['sys.argv[1]', 'IndexError', ['None', "''"]]);
  const [e, a, w] = pick(exprs);
  return {
    difficulty: e.includes('-1') || a === 'IndexError' ? 'medium' : 'easy',
    question: `You run: python3 ${[script, ...args].join(' ')}  — what is ${e} inside the script?`,
    correct: [a], wrong: [...w, 'IndexError', py(args.map((x) => (isNaN(+x) ? x : +x))), String(args.length)],
    explanation: `sys.argv is a list of STRINGS: item 0 is the script name and the user's arguments follow from index 1.`,
  };
});

const PY_FLAGS = [['run a short piece of code given as a string', 'python3 -c "print(1)"'], ['run a module by name, e.g. venv', 'python3 -m venv .venv'],
  ['run a script and then stay in the REPL to inspect it', 'python3 -i app.py'], ['print the Python version', 'python3 --version'],
  ['start the interactive prompt', 'python3'], ['run a script file', 'python3 app.py'], ['run a package\'s __main__.py', 'python3 -m tracker'],
  ['run the unittest test runner', 'python3 -m unittest'], ['time a tiny snippet from the terminal', 'python3 -m timeit "sum(range(100))"']];
template('python-flags', 'setup', 18, () => {
  const [task, cmd] = pick(PY_FLAGS);
  return {
    difficulty: 'easy', question: `Which command will ${task}?`,
    correct: [cmd], wrong: PY_FLAGS.map((x) => x[1]).filter((c) => c !== cmd).concat(['python3 --run app.py', 'python3 -x app.py']),
    explanation: `-c runs a string, -m runs a module by name, -i stays interactive afterwards, and a plain file name runs that script.`,
  };
});

const REPL_LINES = [['x = 5', null], ['x * 2', '10'], ['"hi".upper()', "'HI'"], ['print("hi")', 'hi'], ['y = x + 1', null], ['len("abc")', '3'], ['None', null], ['[1, 2] + [3]', '[1, 2, 3]'], ['import math', null], ['3 > 2', 'True'], ['"a" * 3', "'aaa'"], ['def f(): pass', null]];
template('repl-echo', 'setup', 12, () => {
  const items = sample(REPL_LINES, 5);
  const y = items.filter((x) => x[1] !== null), n = items.filter((x) => x[1] === null);
  if (!y.length || !n.length) return null;
  return {
    difficulty: items.some((x) => x[0] === 'None' || x[0].startsWith('print')) ? 'medium' : 'easy', exact: true,
    question: 'Typed one at a time at the >>> prompt (x = 5 already ran), which lines make the REPL show something? (select all that apply)',
    correct: y.map((x) => x[0]), wrong: n.map((x) => x[0]),
    explanation: `The REPL echoes the repr of an expression's value, except None. Assignments, imports and def produce no output; print() shows its text.`,
  };
});

// ================================================================ Chapter 2: basics
template('int-div-mod', 'basics', 40, () => {
  const a = ri(-25, 25), b = pick([2, 3, 4, 5, 6, 7, -2, -3, -4]);
  if (a === 0) return null;
  const fd = floordiv(a, b), md = pymod(a, b);
  const tq = Math.trunc(a / b), tm = a % b;            // Java/JS-style results
  const neg = a < 0 || b < 0;
  return {
    difficulty: neg ? (a < 0 && b < 0 ? 'medium' : 'hard') : 'easy',
    question: 'What does this print?',
    code: `print(${a} // ${b}, ${a} % ${b})`,
    correct: [`${fd} ${md}`],
    wrong: [`${tq} ${tm}`, `${md} ${fd}`, `${fd + 1} ${md}`, `${fd} ${md - b}`, `${fd - 1} ${md}`, `${reprFloat(a / b)} ${md}`],
    explanation: `// floors toward minus infinity (${a} / ${b} = ${(a / b).toFixed(3)} → ${fd}), and % satisfies (a // b) * b + a % b == a, so its sign follows the divisor.`,
  };
});

template('str-slice', 'basics', 45, () => {
  const w = pick(WORDS), n = w.length;
  const forms = [
    () => [ri(0, n - 3), ri(2, n)], () => [null, ri(1, n - 1)], () => [ri(1, n - 1), null],
    () => [-ri(1, 4), null], () => [null, -ri(1, 4)], () => [null, null, 2], () => [null, null, -1],
    () => [ri(0, 2), ri(n - 3, n), 2], () => [-ri(2, 5), -1],
  ];
  let [a, b, c] = pick(forms)();
  if (a != null && b != null && a >= 0 && b >= 0 && b <= a) b = a + 2;
  const got = sliceStr(w, a, b, c);
  if (!got) return null;
  const wrong = [];
  const bump = (v, d) => (v == null ? v : v + d);
  wrong.push(sliceStr(w, a, bump(b, 1), c), sliceStr(w, bump(a, 1), b, c), sliceStr(w, bump(a, -1), b, c),
    sliceStr(w, a, bump(b, -1), c), w.split('').reverse().join(''), w.slice(1), sliceStr(w, a, b));
  const hard = c != null && c < 0 || (a != null && a < 0) || (b != null && b < 0);
  return {
    difficulty: c ? 'medium' : hard ? 'medium' : 'easy',
    question: 'What does this print?',
    code: `word = ${py(w)}\nprint(repr(word${sliceText(a, b, c)}))`,
    correct: [py(got)], wrong: wrong.filter((x) => x).map(py),
    explanation: `A slice includes the start and excludes the stop; negative indexes count from the end${c ? ', and the third number is the step' : ''}. Here it selects ${py(got)}.`,
  };
});

template('str-index', 'basics', 18, () => {
  const w = pick(WORDS), n = w.length;
  const k = chance(0.8) ? ri(-n, n - 1) : n + ri(0, 2);
  const out = k < n && k >= -n ? py(w.at(k)) : 'IndexError';
  const near = [w.at(k - 1), w.at(k + 1), w.at(-k - 1), w.at(k < 0 ? k + 1 : k - 1)].filter((x) => x).map(py);
  return {
    difficulty: k < 0 || out === 'IndexError' ? 'medium' : 'easy',
    question: `What does word[${k}] give for word = ${py(w)}?`,
    correct: [out], wrong: [...near, 'IndexError', "''"],
    explanation: out === 'IndexError'
      ? `Valid indexes run from -${n} to ${n - 1}; a single index out of range raises IndexError (slices would clamp instead).`
      : `Index 0 is the first character and -1 the last, so index ${k} is ${out}.`,
  };
});

template('power-precedence', 'basics', 16, () => {
  const a = ri(2, 5), b = ri(2, 3);
  const forms = [
    [`-${a} ** 2`, -(a * a), [a * a, -2 * a]],
    [`(-${a}) ** 2`, a * a, [-(a * a), -2 * a]],
    [`2 ** ${b} ** 2`, 2 ** (b ** 2), [(2 ** b) ** 2, 2 * b * 2]],
    [`${a} ** 2 * 3`, a * a * 3, [a ** 6, a * 6]],
    [`-${a} ** 3`, -(a ** 3), [(-a) ** 3 * -1, a ** 3]],
    [`10 - ${a} ** 2`, 10 - a * a, [(10 - a) ** 2, 10 - 2 * a]],
    [`${a} * 2 ** ${b}`, a * 2 ** b, [(a * 2) ** b, a * 2 * b]],
  ];
  const [expr, val, wr] = pick(forms);
  return {
    difficulty: 'medium',
    question: `What is the value of ${expr}?`,
    correct: [String(val)], wrong: [...wr.map(String), String(val + 1), String(-val)],
    explanation: `** binds tighter than unary minus and than *, and it groups right-to-left (2 ** 3 ** 2 is 2 ** 9).`,
  };
});

const TYPE_POOL = [['7 / 7', 1], ['7 // 2', 0], ['2 ** -1', 1], ['3 * 1.0', 1], ['int(2.9)', 0], ['len("ab")', 0],
  ['round(2.5)', 0], ['round(2.567, 2)', 1], ['10 % 3', 0], ['10.0 // 3', 1], ['abs(-4)', 0], ['abs(-4.0)', 1],
  ['sum([1, 2])', 0], ['2 ** 3', 0], ['float(3)', 1], ['True + 1', 0], ['1e3', 1], ['7 // 2.0', 1], ['8 / 4', 1], ['int("12")', 0]];
template('float-select', 'basics', 14, () => {
  const items = sample(TYPE_POOL, 5);
  const floats = items.filter((x) => x[1]), ints = items.filter((x) => !x[1]);
  if (!floats.length || !ints.length) return null;
  return {
    difficulty: 'medium', exact: true,
    question: 'Which of these expressions produce a float? (select all that apply)',
    correct: floats.map((x) => x[0]), wrong: ints.map((x) => x[0]),
    explanation: `/ always gives a float, any float operand makes the result a float, and int(), len(), // on ints and round(x) give ints. Floats here: ${floats.map((x) => x[0]).join(', ')}.`,
  };
});

// ================================================================ Chapter 3: control
template('range-list', 'control', 40, () => {
  let start = ri(-5, 8), stop = ri(-6, 15), step = pick([1, 2, 3, -1, -2, -3]);
  if (chance(0.3)) { start = 0; step = 1; }
  const vals = []; for (let i = start; step > 0 ? i < stop : i > stop; i += step) vals.push(i);
  if (vals.length > 8) return null;
  const incl = []; for (let i = start; step > 0 ? i <= stop : i >= stop; i += step) incl.push(i);
  const nostep = []; for (let i = start; i < stop; i++) nostep.push(i);
  const shifted = vals.map((v) => v + step);
  const call = step === 1 && chance(0.5) ? (start === 0 ? `range(${stop})` : `range(${start}, ${stop})`) : `range(${start}, ${stop}, ${step})`;
  return {
    difficulty: step < 0 ? 'medium' : 'easy',
    question: `What is list(${call})?`,
    correct: [py(vals)], wrong: [py(incl), py(nostep), py(shifted), py(vals.slice(1)), py([...vals].reverse()), '[]'],
    explanation: `range starts at ${start} and moves by ${step}, stopping BEFORE ${stop} (the stop is never included).`,
  };
});

template('loop-count', 'control', 40, () => {
  const A = ri(2, 4), B = ri(2, 4), K = ri(0, 3);
  const conds = [[`j == ${K}`, (i, j) => j === K], ['j > i', (i, j) => j > i], ['(i + j) % 2 == 0', (i, j) => (i + j) % 2 === 0], ['j == i', (i, j) => j === i]];
  const [ctext, cf] = pick(conds);
  const kw = pick(['break', 'continue']);
  const sim = (k) => { let c = 0; for (let i = 0; i < A; i++) for (let j = 0; j < B; j++) { if (cf(i, j)) { if (k === 'break') break; else continue; } c++; } return c; };
  const res = sim(kw), other = sim(kw === 'break' ? 'continue' : 'break');
  return {
    difficulty: kw === 'break' ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `count = 0\nfor i in range(${A}):\n    for j in range(${B}):\n        if ${ctext}:\n            ${kw}\n        count += 1\nprint(count)`,
    correct: [String(res)], wrong: [String(other), String(A * B), String(res + 1), String(res - 1), String(A * B - res)],
    explanation: `${kw === 'break' ? 'break leaves only the inner loop; the outer loop carries on' : 'continue skips the rest of that inner pass'}. Counting every (i, j) pass that reaches count += 1 gives ${res}.`,
  };
});

template('loop-else', 'control', 30, () => {
  const xs = sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15], ri(3, 5));
  const K = pick([2, 3, 4, 5, 7]);
  const kind = pick(['mod', 'gt']);
  const ctext = kind === 'mod' ? `n % ${K} == 0` : `n > ${K + 7}`;
  const cf = kind === 'mod' ? (n) => n % K === 0 : (n) => n > K + 7;
  const hit = xs.find(cf);
  const out = hit !== undefined ? `found ${hit}` : 'none';
  const others = xs.filter(cf).slice(1).map((n) => `found ${n}`);
  return {
    difficulty: hit === undefined ? 'medium' : 'easy',
    question: 'What does this print?',
    code: `for n in ${py(xs)}:\n    if ${ctext}:\n        print("found", n)\n        break\nelse:\n    print("none")`,
    correct: [out],
    wrong: [hit !== undefined ? `found ${hit} and then none` : `found ${xs[0]}`, hit !== undefined ? 'none' : `found ${xs.at(-1)}`, ...others, `found ${xs[xs.length - 1]}`, 'nothing at all', `found ${xs[0]} and then none`],
    explanation: hit !== undefined ? `The first n matching the condition is ${hit}; break skips the loop's else.` : `No n matches, so the loop ends without break and its else clause runs.`,
  };
});

template('while-trace', 'control', 26, () => {
  const n0 = ri(1, 5), L = ri(15, 60), mode = pick(['double', 'add']), k = ri(3, 7);
  const op = mode === 'double' ? 'n = n * 2' : `n += ${k}`;
  let n = n0, steps = 0; while (n < L) { n = mode === 'double' ? n * 2 : n + k; steps++; }
  let n2 = n0, s2 = 0; while (n2 <= L) { n2 = mode === 'double' ? n2 * 2 : n2 + k; s2++; }
  const prev = mode === 'double' ? n / 2 : n - k;
  return {
    difficulty: 'medium',
    question: 'What does this print?',
    code: `n = ${n0}\nsteps = 0\nwhile n < ${L}:\n    ${op}\n    steps += 1\nprint(n, steps)`,
    correct: [`${n} ${steps}`], wrong: [`${prev} ${steps - 1}`, `${n} ${steps + 1}`, `${n2} ${s2}`, `${prev} ${steps}`, `${n} ${steps - 1}`],
    explanation: `The loop keeps going while n < ${L}; it stops at the first value that is not below ${L}, which is ${n}, after ${steps} passes.`,
  };
});

const TRUTHY = [['0', 0], ['""', 0], ['" "', 1], ['"0"', 1], ['[]', 0], ['[0]', 1], ['{}', 0], ['None', 0], ['0.0', 0],
  ['-1', 1], ['"False"', 1], ['()', 0], ['(0,)', 1], ['set()', 0], ['range(0)', 0], ['range(1)', 1], ['[[]]', 1], ['0j', 0], ['"None"', 1], ['{0: 0}', 1]];
template('truthy-select', 'control', 16, () => {
  const items = sample(TRUTHY, 5);
  const t = items.filter((x) => x[1]), f = items.filter((x) => !x[1]);
  if (!t.length || !f.length) return null;
  return {
    difficulty: 'medium', exact: true,
    question: 'Which of these values are truthy in an if statement? (select all that apply)',
    correct: t.map((x) => x[0]), wrong: f.map((x) => x[0]),
    explanation: `False, None, zero of any numeric type and empty containers are falsy; everything else (including "0", " " and [0]) is truthy.`,
  };
});

// ================================================================ Chapter 4: match
const DESCRIBE = `def describe(x):
    match x:
        case 0:
            return "zero"
        case int(n) if n < 0:
            return "negative int"
        case int():
            return "positive int"
        case [a, b]:
            return "pair"
        case [first, *rest]:
            return f"starts with {first}"
        case {"type": t}:
            return f"event {t}"
        case str():
            return "text"
        case _:
            return "other"`;
function describe(x) {
  if ((typeof x === 'number' && x === 0) || (x instanceof F && x.v === 0)) return 'zero';
  if (typeof x === 'number') return x < 0 ? 'negative int' : 'positive int';
  const seq = Array.isArray(x) ? x : x instanceof T ? x.items : null;
  if (seq) { if (seq.length === 2) return 'pair'; if (seq.length >= 1) return `starts with ${pstr(seq[0])}`; return 'other'; }
  if (x instanceof Map) return x.has('type') ? `event ${pstr(x.get('type'))}` : 'other';
  if (typeof x === 'string') return 'text';
  return 'other';
}
template('match-describe', 'match', 40, () => {
  const subjects = [
    () => ri(-9, 9), () => fl(pick([0, 2.5, -1.5])), () => Array.from({ length: ri(0, 4) }, () => ri(1, 9)),
    () => tup(...Array.from({ length: ri(1, 3) }, () => ri(1, 9))), () => new Map([['type', pick(['expense', 'income'])], ['amount', ri(1, 50)]]),
    () => new Map([['kind', 'expense']]), () => pick(['hi', 'ab', 'food', '']), () => null,
  ];
  const x = pick(subjects)();
  const ans = describe(x);
  const labels = ['zero', 'negative int', 'positive int', 'pair', 'text', 'other', 'event expense', 'starts with 1', 'starts with 5'];
  const tricky = typeof x === 'string' || x instanceof F || x instanceof T || (Array.isArray(x) && x.length !== 2);
  return {
    difficulty: tricky ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `${DESCRIBE}\n\nprint(describe(${py(x)}))`,
    correct: [ans], wrong: labels,
    explanation: `Cases are tried top to bottom and the first match wins. Strings are never sequence patterns, 0.0 == 0 matches the literal 0, and int() patterns don't match floats. Result: ${ans}.`,
  };
});

const RUN = `def run(command):
    match command.split():
        case ["quit"] | ["exit"]:
            return "bye"
        case ["add", amount, category]:
            return f"add {amount} to {category}"
        case ["add", *_]:
            return "usage"
        case ["delete", *ids] if ids:
            return f"delete {len(ids)}"
        case []:
            return "empty"
        case [cmd, *_]:
            return f"unknown {cmd}"`;
function run(cmd) {
  const p = cmd.split(/\s+/).filter((x) => x);
  if (p.length === 1 && (p[0] === 'quit' || p[0] === 'exit')) return 'bye';
  if (p[0] === 'add' && p.length === 3) return `add ${p[1]} to ${p[2]}`;
  if (p[0] === 'add') return 'usage';
  if (p[0] === 'delete' && p.length > 1) return `delete ${p.length - 1}`;
  if (p.length === 0) return 'empty';
  return `unknown ${p[0]}`;
}
template('match-command', 'match', 30, () => {
  const cmds = [
    () => `add ${ri(1, 99)} ${pick(SHORT)}`, () => `add ${ri(1, 99)}`, () => `add ${ri(1, 9)} ${pick(SHORT)} ${pick(SHORT)}`,
    () => 'delete ' + Array.from({ length: ri(0, 3) }, () => ri(1, 9)).join(' '), () => pick(['quit', 'exit', 'quit now', '   ']),
    () => pick(['list', 'help', 'undo']) + (chance(0.5) ? ' all' : ''),
  ];
  const c = pick(cmds)().trim();
  const ans = run(c);
  const p = c.split(/\s+/).filter((x) => x);
  const wrong = ['usage', 'bye', 'empty', `unknown ${p[0] || 'add'}`, p.length > 1 ? `add ${p[1]} to ${p[2] || 'misc'}` : 'add 1 to food', `delete ${Math.max(0, p.length - 1)}`, 'None'];
  return {
    difficulty: ans.startsWith('unknown delete') || ans === 'usage' || c.startsWith('quit ') ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `${RUN}\n\nprint(run(${py(c)}))`,
    correct: [ans], wrong,
    explanation: `"${c}".split() gives ${py(p)}. Sequence patterns must match the exact length unless they contain *rest, and the guard "if ids" rejects an empty list.`,
  };
});

// ================================================================ Chapter 5: functions
template('mutable-default', 'functions', 30, () => {
  const fixed = chance(0.3);
  const calls = [];
  const n = ri(2, 4);
  for (let i = 0; i < n; i++) calls.push({ v: pick(SHORT), explicit: i < n - 1 && chance(0.25) });
  let shared = [], out = null;
  for (const c of calls) {
    if (c.explicit) out = [c.v];
    else if (fixed) out = [c.v];
    else { shared.push(c.v); out = shared.slice(); }
  }
  const all = calls.map((c) => c.v);
  const def = fixed ? `def add_item(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket` :
    `def add_item(item, bucket=[]):\n    bucket.append(item)\n    return bucket`;
  const lines = calls.map((c, i) => (i === calls.length - 1 ? `print(add_item(${py(c.v)}))` : `add_item(${py(c.v)}${c.explicit ? ', []' : ''})`));
  return {
    difficulty: fixed ? 'medium' : 'hard',
    question: 'What does this print?',
    code: `${def}\n\n${lines.join('\n')}`,
    correct: [py(out)], wrong: [py([calls.at(-1).v]), py(all), py(shared), py(all.slice(1)), py([...all].reverse())],
    explanation: fixed ? `With the None idiom each call creates a fresh list, so only the last item is returned.` :
      `The default list is created once when def runs and shared by every call that doesn't pass its own list.`,
  };
});

const SIGS = [
  ['def f(a, b, /, c, *, d=0):', [['a', 'po', 0], ['b', 'po', 0], ['c', 'pk', 0], ['d', 'ko', 1]]],
  ['def f(a, /, b=1, *, c):', [['a', 'po', 0], ['b', 'pk', 1], ['c', 'ko', 0]]],
  ['def f(a, b=2, *, c=3):', [['a', 'pk', 0], ['b', 'pk', 1], ['c', 'ko', 1]]],
  ['def f(a, /, *, b):', [['a', 'po', 0], ['b', 'ko', 0]]],
  ['def f(a, b, c=0):', [['a', 'pk', 0], ['b', 'pk', 0], ['c', 'pk', 1]]],
  ['def f(*, a, b=1):', [['a', 'ko', 0], ['b', 'ko', 1]]],
];
function callValid(params, npos, kws) {
  const positional = params.filter((p) => p[1] !== 'ko');
  if (npos > positional.length) return false;
  const filled = new Set(positional.slice(0, npos).map((p) => p[0]));
  for (const k of kws) {
    const p = params.find((x) => x[0] === k);
    if (!p || p[1] === 'po' || filled.has(k)) return false;
    filled.add(k);
  }
  return params.every((p) => p[2] || filled.has(p[0]));
}
template('kw-call-valid', 'functions', 22, () => {
  const [sig, params] = pick(SIGS);
  const names = [...params.map((p) => p[0]), 'e'];
  const calls = new Map();
  for (let tries = 0; tries < 40 && calls.size < 5; tries++) {
    const npos = ri(0, 3);
    const kws = sample(names, ri(0, 2));
    const parts = [...Array.from({ length: npos }, (_, i) => String(i + 1)), ...kws.map((k, i) => `${k}=${i + 7}`)];
    calls.set(`f(${parts.join(', ')})`, callValid(params, npos, kws));
  }
  const ok = [...calls].filter((x) => x[1]).map((x) => x[0]), bad = [...calls].filter((x) => !x[1]).map((x) => x[0]);
  if (!ok.length || !bad.length || calls.size < 4) return null;
  return {
    difficulty: 'hard', exact: true,
    question: `Given ${sig.slice(0, -1)}, which calls are valid? (select all that apply)`,
    correct: ok, wrong: bad,
    explanation: `Parameters before / are positional-only, after * keyword-only; every parameter without a default must receive exactly one value, and unknown keywords are errors.`,
  };
});

template('args-kwargs', 'functions', 30, () => {
  const npos = ri(1, 4), nk = ri(0, 2);
  const pos = Array.from({ length: npos }, () => ri(1, 9));
  const kn = sample(['x', 'y', 'z', 'mode'], nk), kv = kn.map(() => (chance(0.5) ? ri(1, 9) : pick(SHORT)));
  const call = [...pos.map(String), ...kn.map((k, i) => `${k}=${py(kv[i])}`)].join(', ');
  const rest = tup(...pos.slice(1)), kw = new Map(kn.map((k, i) => [k, kv[i]]));
  const out = `${pos[0]} ${py(rest)} ${py(kw)}`;
  return {
    difficulty: npos === 2 || npos === 1 ? 'medium' : 'easy',
    question: 'What does this print?',
    code: `def show(a, *args, **kwargs):\n    print(a, args, kwargs)\n\nshow(${call})`,
    correct: [out],
    wrong: [`${pos[0]} ${py(pos.slice(1))} ${py(kw)}`, `${pos[0]} ${py(tup(...pos))} ${py(kw)}`, `${pos[0]} ${py(rest)} {}`,
      `${pos[0]} (${pos.slice(1).join(', ')}) ${py(kw)}`, `${py(tup(...pos))} () ${py(kw)}`],
    explanation: `*args collects the extra positional arguments into a tuple (a one-item tuple prints with a trailing comma) and **kwargs collects extra keyword arguments into a dict.`,
  };
});

template('sort-key', 'functions', 30, () => {
  const words = sample(SHORT, ri(4, 5));
  const keys = [
    ['key=len', (w) => w.length, false], ['key=len, reverse=True', (w) => w.length, true],
    ['key=lambda w: w[-1]', (w) => w.at(-1), false], ['', (w) => w, false], ['reverse=True', (w) => w, true],
    ['key=lambda w: (len(w), w)', (w) => [w.length, w], false],
  ];
  const [ktext, kf, rev] = pick(keys);
  const cmp = (a, b) => { const x = kf(a), y = kf(b); const c = Array.isArray(x) ? (x[0] - y[0] || (x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0)) : (x < y ? -1 : x > y ? 1 : 0); return rev ? -c : c; };
  const res = [...words].sort(cmp);
  const asc = [...words].sort((a, b) => (rev ? -cmp(a, b) : cmp(a, b)));
  return {
    difficulty: rev && ktext.includes('len') ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `words = ${py(words)}\nprint(sorted(words${ktext ? ', ' + ktext : ''}))`,
    correct: [py(res)], wrong: [py([...asc].reverse()), py(words), py([...words].sort()), py(asc), py([...words].reverse())],
    explanation: `sorted() is stable: items with equal keys keep their original order, even with reverse=True (it doesn't simply reverse the ascending result).`,
  };
});

// ================================================================ Chapter 6: lists
template('list-ops', 'lists', 40, () => {
  const start = sample([1, 2, 3, 4, 5, 6, 7, 8, 9], ri(3, 4));
  const ops = [];
  const lst = start.slice();
  const nOps = ri(2, 4);
  for (let k = 0; k < nOps; k++) {
    const kind = pick(['append', 'insert', 'pop', 'popi', 'remove', 'extend', 'del', 'reverse']);
    const x = ri(10, 30);
    if (kind === 'append') ops.push([`lst.append(${x})`, (l) => l.push(x)]);
    if (kind === 'insert') { const i = ri(0, 2); ops.push([`lst.insert(${i}, ${x})`, (l) => l.splice(Math.min(i, l.length), 0, x)]); }
    if (kind === 'pop') ops.push(['lst.pop()', (l) => l.pop()]);
    if (kind === 'popi') ops.push(['lst.pop(0)', (l) => l.shift()]);
    if (kind === 'remove') ops.push([null, null, 'remove']);
    if (kind === 'extend') ops.push([`lst.extend([${x}, ${x + 1}])`, (l) => l.push(x, x + 1)]);
    if (kind === 'del') ops.push(['del lst[1]', (l) => l.splice(1, 1)]);
    if (kind === 'reverse') ops.push(['lst.reverse()', (l) => l.reverse()]);
  }
  const lines = [];
  for (const op of ops) {
    if (op[2] === 'remove') { if (!lst.length) return null; const v = pick(lst); lines.push(`lst.remove(${v})`); lst.splice(lst.indexOf(v), 1); continue; }
    if (!lst.length && /pop|del/.test(op[0])) return null;
    op[1](lst); lines.push(op[0]);
  }
  // mistakes: skip last op; pop(0) treated as pop()
  const skip = start.slice(); const alt = start.slice();
  for (const [i, line] of lines.entries()) {
    const apply = (l, mistake) => {
      const m = line.match(/lst\.(\w+)\((.*)\)|del lst\[1\]/);
      if (line.startsWith('del')) return l.splice(1, 1);
      const [, name, arg] = m;
      if (name === 'append') l.push(+arg);
      if (name === 'insert') { const [a, b] = arg.split(', ').map(Number); l.splice(mistake ? a + 1 : Math.min(a, l.length), 0, b); }
      if (name === 'pop') { if (arg === '0' && !mistake) l.shift(); else l.pop(); }
      if (name === 'remove') { const j = l.indexOf(+arg); if (j >= 0) l.splice(j, 1); }
      if (name === 'extend') { const [a, b] = arg.slice(1, -1).split(', ').map(Number); if (mistake) l.push([a, b]); else l.push(a, b); }
      if (name === 'reverse') l.reverse();
    };
    if (i < lines.length - 1) apply(skip, false);
    apply(alt, true);
  }
  return {
    difficulty: lines.length >= 4 ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `lst = ${py(start)}\n${lines.join('\n')}\nprint(lst)`,
    correct: [py(lst)], wrong: [py(skip), py(alt), py(start), py([...lst].reverse()), py(lst.slice(1))],
    explanation: `Apply each method in order: append/extend add at the end, insert(i, x) puts x before index i, pop() removes the last item (pop(0) the first), remove(x) deletes the first x.`,
  };
});

template('stack-queue', 'lists', 22, () => {
  const queue = chance(0.5);
  const lines = [], ds = [], out = [], lifo = [], mixed = [];
  let n = 1;
  const steps = ri(5, 7);
  for (let s = 0; s < steps; s++) {
    if (ds.length && chance(0.45)) {
      lines.push(queue ? 'out.append(q.popleft())' : 'out.append(q.pop())');
      out.push(queue ? ds.shift() : ds.pop());
    } else { lines.push(`q.append(${n})`); ds.push(n); n++; }
  }
  if (!out.length) return null;
  // simulate the other discipline for a distractor
  const other = []; const d2 = [];
  for (const l of lines) { if (l.startsWith('q.append')) d2.push(+l.match(/\d+/)[0]); else other.push(queue ? d2.pop() : d2.shift()); }
  return {
    difficulty: 'medium',
    question: 'What does this print?',
    code: `${queue ? 'from collections import deque\nq = deque()' : 'q = []'}\nout = []\n${lines.join('\n')}\nprint(out)`,
    correct: [py(out)], wrong: [py(other), py([...out].reverse()), py(out.slice(0, -1)), py(out.map((x) => x + 1)), py([...out].sort())],
    explanation: queue ? `deque.popleft() removes the OLDEST item: first in, first out.` : `list.pop() removes the NEWEST item: last in, first out.`,
  };
});

template('listcomp', 'lists', 40, () => {
  const a = ri(0, 3), b = ri(5, 9);
  const exprs = [['x * 2', (x) => x * 2], ['x ** 2', (x) => x * x], ['x % 3', (x) => pymod(x, 3)], ['x - 1', (x) => x - 1], ['-x', (x) => -x]];
  const conds = [['x % 2 == 0', (x) => x % 2 === 0], ['x % 3 != 0', (x) => x % 3 !== 0], [`x > ${a + 2}`, (x) => x > a + 2], [null, () => true]];
  const [et, ef] = pick(exprs), [ct, cf] = pick(conds);
  const xs = []; for (let x = a; x < b; x++) xs.push(x);
  const res = xs.filter(cf).map(ef);
  const after = xs.map(ef).filter(cf);
  const incl = [...xs, b].filter(cf).map(ef);
  const r = a === 0 ? `range(${b})` : `range(${a}, ${b})`;
  return {
    difficulty: ct ? 'medium' : 'easy',
    question: 'What does this print?',
    code: `print([${et} for x in ${r}${ct ? ' if ' + ct : ''}])`,
    correct: [py(res)], wrong: [py(after), py(incl), py(xs.map(ef)), py(xs.filter(cf)), py(res.slice(1))],
    explanation: ct ? `The filter ${ct} is applied to each x first, then ${et} is computed for the survivors; range stops before ${b}.` : `The expression ${et} is computed for every x in the range, which stops before ${b}.`,
  };
});

template('slice-assign', 'lists', 26, () => {
  const n = ri(5, 7);
  const lst = Array.from({ length: n }, (_, i) => i);
  const i = ri(0, 3), j = ri(i, Math.min(n, i + 3));
  const kind = pick(['del', 'assign', 'empty', 'insert']);
  let line, res = lst.slice(), wrong1 = lst.slice();
  const repl = [ri(10, 20), ri(21, 30)].slice(0, ri(1, 2));
  if (kind === 'del') { line = `del lst[${i}:${j}]`; res.splice(i, j - i); wrong1.splice(i, j - i + 1); }
  if (kind === 'assign') { line = `lst[${i}:${j}] = ${py(repl)}`; res.splice(i, j - i, ...repl); wrong1.splice(i, j - i + 1, ...repl); }
  if (kind === 'empty') { line = `lst[${i}:${j}] = []`; res.splice(i, j - i); wrong1.splice(i, j - i + 1); }
  if (kind === 'insert') { line = `lst[${i}:${i}] = ${py(repl)}`; res.splice(i, 0, ...repl); wrong1.splice(i + 1, 0, ...repl); }
  const nested = lst.slice(); if (kind === 'assign' || kind === 'insert') nested.splice(i, kind === 'insert' ? 0 : j - i, repl);
  return {
    difficulty: kind === 'insert' ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `lst = ${py(lst)}\n${line}\nprint(lst)`,
    correct: [py(res)], wrong: [py(wrong1), py(lst), py(nested), py(res.slice(0, -1)), py([...res, n])],
    explanation: `lst[${i}:${j}] covers indexes ${i} up to (not including) ${j}; assigning to it can change the list's length, and an empty slice like [${i}:${i}] inserts.`,
  };
});

template('star-unpack', 'lists', 20, () => {
  const xs = Array.from({ length: ri(2, 6) }, () => ri(1, 9));
  const forms = [
    ['first, *middle, last = ' + py(xs) + '\nprint(middle)', xs.length >= 2 ? xs.slice(1, -1) : null, [py(tup(...xs.slice(1, -1))), py(xs), py(xs.slice(1))]],
    ['*init, tail = ' + py(xs) + '\nprint(init, tail)', null, null],
    ['head, *rest = "' + pick(SHORT) + '"\nprint(rest)', null, null],
  ];
  const f = pick(forms);
  let code = f[0], ans, wrong;
  if (f[1]) { ans = py(f[1]); wrong = f[2]; }
  else if (code.startsWith('*init')) { ans = `${py(xs.slice(0, -1))} ${xs.at(-1)}`; wrong = [`${py(tup(...xs.slice(0, -1)))} ${xs.at(-1)}`, `${py(xs)} ${xs.at(-1)}`, `${py(xs.slice(0, -1))} ${py([xs.at(-1)])}`]; }
  else { const w = code.match(/"(\w+)"/)[1]; ans = py(w.slice(1).split('')); wrong = [py(w.slice(1)), py(tup(...w.slice(1).split(''))), py(w.split(''))]; }
  return {
    difficulty: code.startsWith('head') ? 'hard' : 'medium',
    question: 'What does this print?',
    code, correct: [ans], wrong: [...wrong, '[]', 'ValueError'],
    explanation: `A starred target collects the leftover items into a LIST (even when unpacking a tuple or a string).`,
  };
});

// ================================================================ Chapter 7: collections
template('set-ops', 'collections', 34, () => {
  const A = sample([1, 2, 3, 4, 5, 6, 7, 8, 9], ri(3, 5)), B = sample([1, 2, 3, 4, 5, 6, 7, 8, 9], ri(3, 5));
  const ops = { '|': [...new Set([...A, ...B])], '&': A.filter((x) => B.includes(x)), '-': A.filter((x) => !B.includes(x)), '^': [...A.filter((x) => !B.includes(x)), ...B.filter((x) => !A.includes(x))] };
  const op = pick(Object.keys(ops));
  const s = (xs) => py([...xs].sort((a, b) => a - b));
  return {
    difficulty: op === '^' || op === '-' ? 'medium' : 'easy',
    question: 'What does this print?',
    code: `a = {${[...A].sort((x, y) => x - y).join(', ')}}\nb = {${[...B].sort((x, y) => x - y).join(', ')}}\nprint(sorted(a ${op} b))`,
    correct: [s(ops[op])], wrong: Object.keys(ops).filter((k) => k !== op).map((k) => s(ops[k])).concat([s(B.filter((x) => !A.includes(x))), s([...A, ...B])]),
    explanation: `| is union, & intersection, - "in a but not b", ^ "in exactly one of them".`,
  };
});

template('dict-ops', 'collections', 34, () => {
  const keys = ['a', 'b', 'c', 'd', 'e'];
  const d = new Map(sample(keys, ri(2, 3)).map((k) => [k, ri(1, 9)]));
  const start = new Map(d);
  const lines = [];
  const wrongMove = new Map(d);       // mistake: updating an existing key moves it to the end
  for (let s = 0; s < ri(2, 3); s++) {
    const kind = pick(['set', 'del', 'pop', 'setdefault', 'update']);
    const k = pick(keys), v = ri(10, 30);
    if (kind === 'set') { lines.push(`d[${py(k)}] = ${v}`); d.set(k, v); wrongMove.delete(k); wrongMove.set(k, v); }
    if (kind === 'del' || kind === 'pop') { const ex = [...d.keys()]; if (!ex.length) return null; const kk = pick(ex); lines.push(kind === 'del' ? `del d[${py(kk)}]` : `d.pop(${py(kk)})`); d.delete(kk); wrongMove.delete(kk); }
    if (kind === 'setdefault') { lines.push(`d.setdefault(${py(k)}, ${v})`); if (!d.has(k)) d.set(k, v); wrongMove.delete(k); wrongMove.set(k, v); }
    if (kind === 'update') { lines.push(`d.update({${py(k)}: ${v}})`); d.set(k, v); wrongMove.delete(k); wrongMove.set(k, v); }
  }
  const sorted = new Map([...d].sort((x, y) => (x[0] < y[0] ? -1 : 1)));
  return {
    difficulty: lines.some((l) => l.includes('setdefault')) ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `d = ${py(start)}\n${lines.join('\n')}\nprint(d)`,
    correct: [py(d)], wrong: [py(wrongMove), py(sorted), py(start), py(new Map([...d].slice(0, -1)))],
    explanation: `Dicts keep insertion order; assigning to an existing key keeps its position, deleting removes it, and setdefault only inserts when the key is missing.`,
  };
});

template('dict-get', 'collections', 22, () => {
  const d = new Map(sample(SHORT, 3).map((k) => [k, ri(1, 20)]));
  const keys = [...d.keys()];
  const miss = pick(SHORT.filter((k) => !d.has(k)));
  const k1 = pick([...keys, miss]), dflt = ri(0, 5);
  const v1 = d.has(k1) ? String(d.get(k1)) : String(dflt);
  const v2 = d.has(miss) ? 'True' : 'False';
  const out = `${v1} ${v2} ${d.size}`;
  return {
    difficulty: 'easy',
    question: 'What does this print?',
    code: `d = ${py(d)}\nprint(d.get(${py(k1)}, ${dflt}), ${py(miss)} in d, len(d))`,
    correct: [out], wrong: [`None ${v2} ${d.size}`, `${v1} ${v2 === 'True' ? 'False' : 'True'} ${d.size}`, `KeyError`, `${v1} ${v2} ${d.size * 2}`, `${dflt} ${v2} ${d.size}`, `${d.has(k1) ? d.get(k1) + 1 : 'None'} ${v2} ${d.size}`],
    explanation: `get returns the default only for a missing key, in checks keys, and len counts key/value pairs.`,
  };
});

template('zip-enumerate', 'collections', 26, () => {
  if (chance(0.5)) {
    const a = sample(SHORT, ri(2, 4)), b = Array.from({ length: ri(1, 4) }, () => ri(1, 9));
    const n = Math.min(a.length, b.length);
    const res = Array.from({ length: n }, (_, i) => tup(a[i], b[i]));
    const pad = Array.from({ length: Math.max(a.length, b.length) }, (_, i) => tup(a[i] ?? null, b[i] ?? null));
    return {
      difficulty: a.length !== b.length ? 'medium' : 'easy',
      question: 'What does this print?', code: `print(list(zip(${py(a)}, ${py(b)})))`,
      correct: [py(res)], wrong: [py(pad), py([tup(...a), tup(...b)]), a.length !== b.length ? 'ValueError' : py(res.slice(1)), py(res.map((t) => t.items))],
      explanation: `zip pairs items position by position and stops at the shortest input (strict=True would raise instead).`,
    };
  }
  const xs = sample(SHORT, ri(2, 4)), s = pick([0, 1, 10]);
  const res = xs.map((x, i) => tup(i + s, x));
  return {
    difficulty: 'easy', question: 'What does this print?',
    code: `print(list(enumerate(${py(xs)}${s ? ', start=' + s : ''})))`,
    correct: [py(res)], wrong: [py(xs.map((x, i) => tup(i, x))), py(xs.map((x, i) => tup(x, i + s))), py(xs.map((x, i) => tup(i + s + 1, x))), py(xs.map((x, i) => [i + s, x]))],
    explanation: `enumerate yields (index, item) tuples, counting from start (default 0).`,
  };
});

const OPERANDS = [['0', 0], ['1', 1], ['5', 5], ['""', ''], ['"a"', 'a'], ['[]', []], ['[0]', [0]], ['None', null], ['True', true], ['False', false]];
const truthy = (v) => !(v === 0 || v === '' || v === null || v === false || (Array.isArray(v) && v.length === 0));
template('and-or', 'collections', 32, () => {
  const [x, y, z] = [pick(OPERANDS), pick(OPERANDS), pick(OPERANDS)];
  const forms = [
    [`${x[0]} or ${y[0]}`, truthy(x[1]) ? x : y, [x, y]],
    [`${x[0]} and ${y[0]}`, truthy(x[1]) ? y : x, [x, y]],
    [`${x[0]} or ${y[0]} and ${z[0]}`, truthy(x[1]) ? x : (truthy(y[1]) ? z : y), [x, y, z]],
    [`not ${x[0]} or ${y[0]}`, !truthy(x[1]) ? ['True', true] : y, [x, y]],
  ];
  const [expr, res, parts] = pick(forms);
  const val = res[0] === '""' ? "''" : res[0] === '"a"' ? "'a'" : res[0];
  const opts = ['True', 'False', ...parts.map((p) => (p[0] === '""' ? "''" : p[0] === '"a"' ? "'a'" : p[0]))];
  return {
    difficulty: expr.split(' ').length > 3 ? 'hard' : 'medium',
    question: `What is the value of: ${expr}`,
    correct: [val], wrong: [...opts, 'None', '0'],
    explanation: `and/or return one of their operands, not necessarily a bool: or returns the first truthy operand (else the last), and returns the first falsy one (else the last). and binds tighter than or.`,
  };
});

function cmpSeq(a, b) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) { if (a[i] < b[i]) return -1; if (a[i] > b[i]) return 1; }
  return a.length - b.length;
}
template('compare-select', 'collections', 22, () => {
  const make = () => {
    const kind = pick(['chain', 'tuple', 'str', 'chain2']);
    if (kind === 'chain') { const a = ri(1, 5), b = ri(1, 5), c = ri(1, 5); return [`${a} < ${b} < ${c}`, a < b && b < c]; }
    if (kind === 'chain2') { const a = ri(1, 5), b = ri(1, 5), c = ri(1, 5); return [`${a} < ${b} == ${c}`, a < b && b === c]; }
    if (kind === 'tuple') { const A = Array.from({ length: ri(1, 3) }, () => ri(1, 3)), B = Array.from({ length: ri(1, 3) }, () => ri(1, 3)); return [`${py(tup(...A))} < ${py(tup(...B))}`, cmpSeq(A, B) < 0]; }
    const A = pick(['apple', 'Apple', 'banana', 'Zoo', 'zoo', 'ab', 'abc']), B = pick(['apple', 'Banana', 'b', 'Zebra', 'a', 'abc', 'ab']);
    return [`${py(A)} < ${py(B)}`, A < B];
  };
  const items = new Map();
  for (let t = 0; t < 20 && items.size < 5; t++) { const [e, v] = make(); items.set(e, v); }
  const yes = [...items].filter((x) => x[1]).map((x) => x[0]), no = [...items].filter((x) => !x[1]).map((x) => x[0]);
  if (!yes.length || !no.length) return null;
  return {
    difficulty: 'hard', exact: true,
    question: 'Which of these expressions are True? (select all that apply)',
    correct: yes, wrong: no,
    explanation: `Chains like a < b < c mean a < b and b < c. Sequences compare item by item (a shorter prefix is smaller), and strings compare by code point, so every uppercase letter sorts before every lowercase one.`,
  };
});

const HASHABLE = [['"food"', 1], ['(1, 2)', 1], ['[1, 2]', 0], ['{1: 2}', 0], ['{1, 2}', 0], ['frozenset({1})', 1], ['(1, [2])', 0],
  ['3.14', 1], ['None', 1], ['frozendict(a=1)', 1], ['((1, 2), 3)', 1], ['b"x"', 1], ['bytearray(b"x")', 0], ['True', 1], ['[]', 0], ['("a", {"b": 1})', 0]];
template('hashable-select', 'collections', 14, () => {
  const items = sample(HASHABLE, 5);
  const y = items.filter((x) => x[1]), n = items.filter((x) => !x[1]);
  if (!y.length || !n.length) return null;
  return {
    difficulty: 'medium', exact: true,
    question: 'Which of these can be used as a dict key or set element? (select all that apply)',
    correct: y.map((x) => x[0]), wrong: n.map((x) => x[0]),
    explanation: `Keys must be hashable: immutable built-ins (numbers, strings, bytes, frozenset, frozendict) and tuples whose items are all hashable. Lists, dicts, sets and bytearrays are not.`,
  };
});

// ================================================================ Chapter 8: modules
const MODS = { math: ['sqrt', 'floor', 'pi'], json: ['dumps', 'loads'], random: ['choice', 'randint'], os: ['getcwd', 'listdir'] };
template('import-names', 'modules', 20, () => {
  const m = pick(Object.keys(MODS)), [n1, n2] = sample(MODS[m], 2), alias = pick(['mm', 'lib', 'x']);
  const forms = [
    [`import ${m}`, new Set([`${m}.${n1}`, `${m}.${n2}`])],
    [`import ${m} as ${alias}`, new Set([`${alias}.${n1}`, `${alias}.${n2}`])],
    [`from ${m} import ${n1}`, new Set([n1])],
    [`from ${m} import ${n1} as ${alias}`, new Set([alias])],
    [`from ${m} import ${n1}, ${n2}`, new Set([n1, n2])],
  ];
  const [stmt, ok] = pick(forms);
  const cands = uniq([`${m}.${n1}`, `${m}.${n2}`, n1, n2, `${alias}.${n1}`, alias, `${m}`]).filter((c) => c !== m || stmt === `import ${m}`);
  const chosen = sample(cands, 5);
  const isOk = (c) => ok.has(c) || (stmt === `import ${m}` && c === m) || (stmt.startsWith(`import ${m} as`) && c === alias);
  const yes = chosen.filter(isOk), no = chosen.filter((c) => !isOk(c));
  if (!yes.length || !no.length) return null;
  return {
    difficulty: stmt.includes(' as ') ? 'medium' : 'easy', exact: true,
    question: `After \`${stmt}\`, which names can you use directly? (select all that apply)`,
    correct: yes, wrong: no,
    explanation: `import X binds only X (use X.name); from X import name binds only name; "as" binds the alias instead of the original name.`,
  };
});

const NAME_SCENARIOS = [
  ['You run python3 {f}.py. What is __name__ inside {f}.py?', '"__main__"', ['"{f}"', '"{f}.py"', 'None']],
  ['app.py does import {f}. What is __name__ inside {f}.py?', '"{f}"', ['"__main__"', '"app.{f}"', '"{f}.py"']],
  ['You run python3 -m {p}.{f}. What is __name__ inside {p}/{f}.py?', '"__main__"', ['"{p}.{f}"', '"{f}"', '"{p}"']],
  ['app.py does from {p} import {f}. What is __name__ inside {p}/{f}.py?', '"{p}.{f}"', ['"{f}"', '"__main__"', '"{p}"']],
  ['app.py does import {p}.{f}. What is __name__ inside {p}/__init__.py?', '"{p}"', ['"__init__"', '"{p}.__init__"', '"__main__"']],
  ['You run python3 -m {p}. Which file runs as the main module?', '{p}/__main__.py', ['{p}/__init__.py only', '{p}.py', 'nothing: packages cannot be run']],
  ['You run python3 -m {p}.{f}. Which runs first?', '{p}/__init__.py, then {p}/{f}.py', ['{p}/{f}.py only', '{p}/{f}.py, then {p}/__init__.py', '{p}/__main__.py']],
];
template('name-main', 'modules', 18, () => {
  const [q, a, w] = pick(NAME_SCENARIOS);
  const f = pick(['tool', 'report', 'utils', 'cart', 'storage']), p = pick(['shop', 'tracker', 'app_pkg']);
  const fill = (s) => s.replaceAll('{f}', f).replaceAll('{p}', p);
  return {
    difficulty: q.includes('-m') || q.includes('__init__') ? 'hard' : 'medium',
    question: fill(q), correct: [fill(a)], wrong: w.map(fill),
    explanation: `The module run as a script is always named "__main__"; imported modules get their dotted import name, and importing pkg.mod first runs pkg/__init__.py.`,
  };
});

// ================================================================ Chapter 9: io
function pyFormat(v, spec, isFloat) {
  const m = spec.match(/^(?:(.)?([<>^]))?([+])?(0)?(\d+)?([,_])?(?:\.(\d+))?([dfx%bs])?$/);
  if (!m) throw new Error('spec ' + spec);
  let [, fill, align, sign, zero, width, group, prec, type] = m;
  let body;
  const isStr = typeof v === 'string';
  if (isStr) body = prec != null ? v.slice(0, +prec) : v;
  else {
    const neg = v < 0; let x = Math.abs(v);
    if (type === '%') { body = (x * 100).toFixed(prec != null ? +prec : 6) + '%'; }
    else if (type === 'f' || (isFloat && prec != null)) body = x.toFixed(prec != null ? +prec : 6);
    else if (type === 'x') body = x.toString(16);
    else if (type === 'b') body = x.toString(2);
    else body = isFloat ? reprFloat(x) : String(x);
    if (group) { const [ip, fp] = body.split('.'); body = ip.replace(/\B(?=(\d{3})+(?!\d))/g, group) + (fp != null ? '.' + fp : ''); }
    const sgn = neg ? '-' : sign ? '+' : '';
    if (zero && width && !align) { body = sgn + body.padStart(+width - sgn.length, '0'); return body; }
    body = sgn + body;
  }
  if (width) {
    const w = +width; const f2 = fill || ' ';
    const al = align || (isStr ? '<' : '>');
    if (body.length < w) {
      const pad = w - body.length;
      if (al === '<') body = body + f2.repeat(pad);
      else if (al === '>') body = f2.repeat(pad) + body;
      else body = f2.repeat(Math.floor(pad / 2)) + body + f2.repeat(pad - Math.floor(pad / 2));
    }
  }
  return body;
}
template('fstring-spec', 'io', 44, () => {
  const kind = pick(['int', 'float', 'str']);
  let v, spec, isFloat = false, lit;
  if (kind === 'int') { v = pick([ri(1, 999), ri(1000, 99999999), -ri(1, 99)]); spec = pick(['>6', '<6', '^7', '06d', ',', '_', '+d', 'x', '*>8', '08,']); lit = String(v); }
  else if (kind === 'float') {
    isFloat = true;
    const p = pick([1, 2]);
    let digits = p + 1, n = ri(1, 999999);
    if (n % 10 === 5) n++;
    v = n / 10 ** digits * (chance(0.15) ? -1 : 1);
    if (chance(0.3)) v = v * 1000;
    v = Number(v.toFixed(digits));
    spec = pick([`.${p}f`, `10.${p}f`, `,.${p}f`, `<10.${p}f`, '.1%']);
    if (spec === '.1%') { v = ri(1, 999) / 1000; }
    lit = String(v);
  } else { v = pick(SHORT.concat(WORDS)); spec = pick(['>8', '<8', '^9', '*^9', '.3', '-<10', '.2']); lit = py(v); }
  const out = `[${pyFormat(v, spec, isFloat)}]`;
  const alt = [];
  for (const s of ['>8', '<8', '^9', '.1f', '.3f', '>10', '<6', '']) {
    try { alt.push(`[${pyFormat(v, s, isFloat)}]`); } catch { /* not applicable */ }
  }
  alt.push(`[${typeof v === 'string' ? v : isFloat ? reprFloat(v) : v}]`, `[${spec}]`);
  return {
    difficulty: /,|_|%|0\d|x|\*|-</.test(spec) ? 'medium' : 'easy',
    question: 'What does this print?',
    code: `value = ${lit}\nprint(f"[{value:${spec}}]")`,
    correct: [out], wrong: alt,
    explanation: `The spec ${spec} means: ${/[<>^]/.test(spec) ? 'alignment ' + spec.match(/[<>^]/)[0] + ' ' : ''}${/\d/.test(spec) ? 'with a width/precision as given; ' : ''}numbers align right and strings left by default; .Nf rounds to N decimals; , or _ group thousands.`,
  };
});

const MODE_SCEN = [['add a line to the end of an existing log file', 'a'], ['read a text configuration file', 'r'], ['replace a report file completely', 'w'],
  ['create a file but fail if it already exists', 'x'], ['read a PNG image', 'rb'], ['write a zip archive', 'wb'], ['append raw bytes to a binary log', 'ab'], ['read and also overwrite parts of an existing file', 'r+']];
template('file-mode', 'io', 14, () => {
  const [s, m] = pick(MODE_SCEN);
  return {
    difficulty: ['x', 'r+', 'ab'].includes(m) ? 'medium' : 'easy',
    question: `Which open() mode fits: ${s}?`,
    correct: [`"${m}"`], wrong: ['"r"', '"w"', '"a"', '"x"', '"rb"', '"wb"', '"r+"'].filter((x) => x !== `"${m}"`),
    explanation: `"r" reads, "w" truncates then writes, "a" appends, "x" creates exclusively, a "b" suffix means bytes, and "+" adds the other direction.`,
  };
});

template('json-roundtrip', 'io', 24, () => {
  const k1 = pick(['id', 'amount', 'tags']), n = ri(1, 9);
  const entries = [[pick([1, 2, 3]), tup(ri(1, 5), ri(6, 9))], [k1, pick([true, false, null])], [pick(SHORT), ri(1, 99)]];
  const d = new Map(sample(entries, ri(2, 3)));
  const jsonOf = (v) => v === null ? 'null' : v === true ? 'true' : v === false ? 'false' : v instanceof T ? '[' + v.items.map(jsonOf).join(', ') + ']' : typeof v === 'string' ? `"${v}"` : String(v);
  const dumps = '{' + [...d].map(([k, v]) => `"${k}": ${jsonOf(v)}`).join(', ') + '}';
  const back = new Map([...d].map(([k, v]) => [String(k), v instanceof T ? v.items : v]));
  const pyish = new Map([...d].map(([k, v]) => [String(k), v]));
  if (chance(0.5)) {
    return {
      difficulty: 'medium', question: 'What does this print?', code: `import json\nprint(json.dumps(${py(d)}))`,
      correct: [dumps], wrong: [py(d), dumps.replace(/\[/g, '(').replace(/\]/g, ')'), dumps.replace(/"(\d)"/g, '$1'), py(back)],
      explanation: `JSON uses double quotes, true/false/null, arrays for tuples and lists, and string keys only.`,
    };
  }
  return {
    difficulty: 'hard', question: 'What does this print?', code: `import json\nprint(json.loads(json.dumps(${py(d)})))`,
    correct: [py(back)], wrong: [py(d), py(pyish), py(new Map([...d].map(([k, v]) => [k, v instanceof T ? v.items : v]))), dumps],
    explanation: `A JSON round trip turns tuples into lists and every key into a string, so the result is not equal to the original.`,
  };
});

// ================================================================ Chapter 10: exceptions
const EXC_PARENT = { ZeroDivisionError: 'ArithmeticError', ArithmeticError: 'Exception', KeyError: 'LookupError', IndexError: 'LookupError', LookupError: 'Exception', ValueError: 'Exception', TypeError: 'Exception', Exception: 'BaseException' };
const isSub = (e, base) => { for (let c = e; c; c = EXC_PARENT[c]) if (c === base) return true; return false; };
template('try-flow', 'exceptions', 40, () => {
  const raises = [['x = 1 / 0', 'ZeroDivisionError'], ['int("x")', 'ValueError'], ['{}["k"]', 'KeyError'], ['[][1]', 'IndexError'], ['x = 1', null]];
  const [stmt, exc] = pick(raises);
  const handlers = sample(['ValueError', 'KeyError', 'LookupError', 'ZeroDivisionError', 'ArithmeticError', 'TypeError'], ri(1, 2));
  if (chance(0.15)) handlers.push('Exception');
  const hasElse = chance(0.7), hasFinally = chance(0.8);
  const letters = ['C', 'D', 'G'];
  const out = ['A'];
  let unhandled = false;
  if (!exc) { out.push('B'); if (hasElse) out.push('E'); }
  else {
    const i = handlers.findIndex((hh) => isSub(exc, hh));
    if (i >= 0) out.push(letters[i]); else unhandled = true;
  }
  if (hasFinally) out.push('F');
  let code = `try:\n    print("A")\n    ${stmt}\n    print("B")\n`;
  handlers.forEach((hh, i) => { code += `except ${hh}:\n    print("${letters[i]}")\n`; });
  if (hasElse) code += `else:\n    print("E")\n`;
  if (hasFinally) code += `finally:\n    print("F")\n`;
  const fmt = (arr, un) => arr.join(' ') + (un ? ', then a traceback' : '');
  const wrong = [fmt(['A', 'B', ...(hasElse ? ['E'] : []), ...(hasFinally ? ['F'] : [])], false), fmt(['A', ...(hasFinally ? ['F'] : [])], true),
    fmt(['A', letters[0], ...(hasElse ? ['E'] : []), ...(hasFinally ? ['F'] : [])], false), fmt(['A', letters[0], ...(hasFinally ? ['F'] : [])], false), fmt(['A', 'B', letters[0], ...(hasFinally ? ['F'] : [])], false), fmt(['A'], true), fmt(out.filter((x) => x !== 'F'), unhandled)];
  return {
    difficulty: handlers.length > 1 || unhandled ? 'hard' : 'medium',
    question: 'Which lines are printed, in order? (Each print shows one letter.)',
    code: code.trimEnd(), correct: [fmt(out, unhandled)], wrong,
    explanation: exc ? `${stmt} raises ${exc}. The first except clause whose type is ${exc} or one of its base classes handles it${unhandled ? ' — here none does, so finally runs and the exception propagates' : ''}; else runs only when nothing was raised; finally always runs.`
      : `Nothing is raised, so every except is skipped, else runs, and finally runs last.`,
  };
});

const EXC_POOL = [['int("3.5")', 'ValueError'], ['[1, 2][5]', 'IndexError'], ['{"a": 1}["b"]', 'KeyError'], ['"a" + 1', 'TypeError'], ['len(5)', 'TypeError'],
  ['undefined_name', 'NameError'], ['1 / 0', 'ZeroDivisionError'], ['"abc".push("d")', 'AttributeError'], ['open("missing-file.txt")', 'FileNotFoundError'],
  ['int(None)', 'TypeError'], ['[].pop()', 'IndexError'], ['{}.pop("x")', 'KeyError'], ['float("1,5")', 'ValueError'], ['(1, 2)[0] = 5', 'TypeError'],
  ['import nonexistent_module_xyz', 'ModuleNotFoundError'], ['next(iter([]))', 'StopIteration'], ['a, b = [1, 2, 3]', 'ValueError'], ['"abc".index("z")', 'ValueError'],
  ['[1].remove(2)', 'ValueError'], ['set().remove(1)', 'KeyError'], ['None.upper()', 'AttributeError'], ['10 % 0', 'ZeroDivisionError'],
  ['import math; math.sqrt(-1)', 'ValueError'], ['" ".join([1, 2])', 'TypeError'], ['range(3)[5]', 'IndexError'], ['x = 5; x()', 'TypeError'],
  ['chr(-1)', 'ValueError'], ['d = {}; d["a"] += 1', 'KeyError'], ['"%d" % "a"', 'TypeError'], ['[1, 2].push(3)', 'AttributeError'], ['int("")', 'ValueError'], ['sum(["a", "b"])', 'TypeError']];
const EXC_NAMES = ['ValueError', 'TypeError', 'KeyError', 'IndexError', 'NameError', 'AttributeError', 'ZeroDivisionError', 'FileNotFoundError', 'StopIteration', 'ModuleNotFoundError', 'LookupError'];
template('exception-type', 'exceptions', 32, () => {
  const [code, exc] = pick(EXC_POOL);
  return {
    difficulty: ['StopIteration', 'ModuleNotFoundError'].includes(exc) || code.includes('%') || code.includes('chr') || code.includes('join') || code.includes('sum') ? 'medium' : 'easy',
    question: 'Which exception does this code raise?', code, correct: [exc], wrong: EXC_NAMES.filter((e) => e !== exc && e !== 'LookupError'),
    explanation: `${code} raises ${exc}: ${{ ValueError: 'right type but an unacceptable value', TypeError: 'an operation on the wrong type', KeyError: 'a missing dict key or set item', IndexError: 'a sequence index out of range', NameError: 'a name that was never defined', AttributeError: 'the object has no such attribute or method', ZeroDivisionError: 'division or modulo by zero', FileNotFoundError: 'the file does not exist', StopIteration: 'the iterator is exhausted', ModuleNotFoundError: 'no module with that name on sys.path' }[exc]}.`,
  };
});

template('except-order', 'exceptions', 18, () => {
  const parent = { B: 'Exception', C: 'B', D: 'C' };
  const sub = (x, y) => { for (let c = x; c; c = parent[c]) if (c === y) return true; return false; };
  const raised = pick(['B', 'C', 'D']);
  const order = sample(['B', 'C', 'D', 'Exception'], ri(2, 3));
  const hit = order.find((o) => sub(raised, o));
  const ans = hit ? hit : `nothing (the ${raised} propagates)`;
  let code = `class B(Exception): pass\nclass C(B): pass\nclass D(C): pass\n\ntry:\n    raise ${raised}()\n`;
  order.forEach((o) => { code += `except ${o}:\n    print("${o}")\n`; });
  return {
    difficulty: 'hard', question: 'What does this print?', code: code.trimEnd(),
    correct: [ans], wrong: [...['B', 'C', 'D', 'Exception'].filter((x) => x !== ans), `nothing (the ${raised} propagates)`],
    explanation: `An except clause also catches subclasses, and the FIRST matching clause wins, so a general class listed early hides the specific ones after it.`,
  };
});

// ================================================================ Chapter 11: classes
template('class-instance-var', 'classes', 34, () => {
  const s0 = ri(1, 9);
  const state = { cls: s0, a: undefined, b: undefined };
  const lines = [];
  const naive = { cls: s0 };      // mistake: every assignment changes the shared value
  for (let k = 0; k < ri(2, 3); k++) {
    const t = pick(['a', 'b', 'Box', 'Box']), v = ri(10, 40);
    lines.push(`${t}.size = ${v}`);
    if (t === 'Box') state.cls = v; else state[t] = v;
    naive.cls = v;
  }
  const get = (o) => (state[o] !== undefined ? state[o] : state.cls);
  const out = `${get('a')} ${get('b')} ${state.cls}`;
  return {
    difficulty: lines.length > 2 ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `class Box:\n    size = ${s0}\n\na = Box()\nb = Box()\n${lines.join('\n')}\nprint(a.size, b.size, Box.size)`,
    correct: [out], wrong: [`${naive.cls} ${naive.cls} ${naive.cls}`, `${get('a')} ${get('b')} ${s0}`, `${state.cls} ${state.cls} ${state.cls}`, `${s0} ${s0} ${state.cls}`, `${get('a')} ${state.cls} ${state.cls}`],
    explanation: `Assigning through an instance creates an instance attribute that hides the class one for that instance only; reading falls back to the class when the instance has none.`,
  };
});

function c3(cls, bases) {
  const memo = {};
  const lin = (c) => {
    if (memo[c]) return memo[c];
    const bs = bases[c] || [];
    const seqs = [...bs.map((b) => lin(b).slice()), bs.slice()];
    const out = [c];
    while (seqs.some((s) => s.length)) {
      const cand = seqs.find((s) => s.length && !seqs.some((t) => t.indexOf(s[0]) > 0));
      if (!cand) throw new Error('inconsistent');
      const head = cand[0]; out.push(head);
      seqs.forEach((s) => { if (s[0] === head) s.shift(); });
    }
    return (memo[c] = out);
  };
  return lin(cls);
}
template('mro-order', 'classes', 26, () => {
  const bases = { A: [] };
  const names = ['B', 'C', 'D'];
  for (const n of names) {
    const prev = Object.keys(bases);
    bases[n] = sample(prev, n === 'B' ? 1 : ri(1, Math.min(2, prev.length)));
  }
  bases.E = sample(['B', 'C', 'D'], ri(2, 3));
  let mro;
  try { for (const c of ['B', 'C', 'D']) c3(c, bases); mro = c3('E', bases); } catch { return null; }   // every class must be valid
  const dfs = []; const walk = (c) => { if (!dfs.includes(c)) dfs.push(c); (bases[c] || []).forEach(walk); }; walk('E');
  const bfs = ['E']; for (let i = 0; i < bfs.length; i++) (bases[bfs[i]] || []).forEach((b) => { if (!bfs.includes(b)) bfs.push(b); });
  const rev = (() => { try { const b2 = { ...bases, E: [...bases.E].reverse() }; return c3('E', b2); } catch { return null; } })();
  const fmt = (l) => py([...l, 'object']);
  const code = ['class A: pass', ...['B', 'C', 'D', 'E'].map((n) => `class ${n}(${bases[n].join(', ')}): pass`), '', 'print([k.__name__ for k in E.__mro__])'].join('\n');
  return {
    difficulty: 'hard', question: 'What does this print?', code,
    correct: [fmt(mro)], wrong: [fmt(dfs), fmt(bfs), rev ? fmt(rev) : fmt([...mro].reverse()), fmt(mro.filter((x) => x !== 'A')), fmt([...mro.slice(0, 1), ...mro.slice(1).reverse()])],
    explanation: `The MRO (C3 linearization) lists the class, then its bases left to right, never putting a class before any of its subclasses and listing each class once.`,
  };
});

template('scope-legb', 'classes', 26, () => {
  const G = ri(1, 9), E = ri(10, 19), I = ri(20, 29);
  const mode = pick(['local', 'nonlocal', 'global', 'read']);
  const inner = { local: `x = ${I}`, nonlocal: `nonlocal x\n        x = ${I}`, global: `global x\n        x = ${I}`, read: 'print(x, end=" ")' }[mode];
  const outs = { local: `${E} ${G}`, nonlocal: `${I} ${G}`, global: `${E} ${I}`, read: `${E} ${E} ${G}` };
  return {
    difficulty: mode === 'global' ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `x = ${G}\n\ndef outer():\n    x = ${E}\n    def inner():\n        ${inner}\n    inner()\n    print(x, end=" ")\n\nouter()\nprint(x)`,
    correct: [outs[mode]], wrong: [...Object.values(outs), `${I} ${I}`, `${G} ${G}`],
    explanation: `Assignment makes a name local unless declared nonlocal (the enclosing function's variable) or global (the module's). Reading a name searches Local, Enclosing, Global, Built-in.`,
  };
});

// ================================================================ Chapter 12: iterators
template('gen-trace', 'iterators', 26, () => {
  const a = ri(1, 9), b = ri(10, 19);
  const calls = ri(1, 3);
  const lines = [];
  const out = [];
  const events = ['start', String(a), 'mid', String(b), 'end'];
  // simulate: each next runs until the next yield
  let pos = 0;
  for (let c = 0; c < calls; c++) {
    if (c < 2) { lines.push('print(next(g), end=" ")'); out.push(events[pos], events[pos + 1]); pos += 2; }
    else { lines.push('print(next(g, "done"), end=" ")'); out.push('end', 'done'); }
  }
  // print order: inner prints happen before the yielded value is printed
  const shown = out.join(' ');
  const noPrints = out.filter((x) => /\d|done/.test(x)).join(' ');
  return {
    difficulty: calls === 3 ? 'hard' : 'medium',
    question: 'What does this print?',
    code: `def gen():\n    print("start", end=" ")\n    yield ${a}\n    print("mid", end=" ")\n    yield ${b}\n    print("end", end=" ")\n\ng = gen()\n${lines.join('\n')}\nprint()`,
    correct: [shown], wrong: [noPrints, `start mid ${a} ${b}`, `${a} start ${b} mid`, `start ${a} mid ${b} end`, `start ${a}`, `${shown} end`],
    explanation: `Calling gen() runs nothing; each next() resumes the body until the next yield, so the prints inside run just before each value is handed back.`,
  };
});

template('iter-exhaust', 'iterators', 24, () => {
  if (chance(0.5)) {
    const xs = Array.from({ length: ri(3, 5) }, () => ri(1, 9));
    const k = ri(1, 2);
    const nexts = Array(k).fill('next(it)').join(', ');
    return {
      difficulty: 'medium', question: 'What does this print?',
      code: `it = iter(${py(xs)})\nprint(${nexts})\nprint(list(it), list(it))`,
      correct: [`${xs.slice(0, k).join(' ')}`], wrong: [`${xs.slice(1, k + 1).join(' ')}`, py(xs.slice(0, k)), `${xs.slice(-k).join(' ')}`],
      question2: true,
      explanation: '',
      _lines: [xs, k],
    };
  }
  const N = ri(6, 12), K = ri(1, N - 3);
  return {
    difficulty: 'hard', question: 'What does this print?',
    code: `nums = iter(range(${N}))\nprint(any(n > ${K} for n in nums), next(nums))`,
    correct: [`True ${K + 2}`], wrong: [`True ${K + 1}`, `True 0`, `True ${K + 3}`, `False ${K + 2}`],
    explanation: `any() stops right after the first item that is > ${K}, which is ${K + 1}; the shared iterator then continues with ${K + 2}.`,
  };
});

template('itertools-out', 'iterators', 30, () => {
  const kind = pick(['islice', 'accumulate', 'pairwise', 'batched', 'chain', 'takewhile']);
  const xs = Array.from({ length: ri(3, 6) }, () => ri(1, 9));
  let code, res, wrong, expl;
  if (kind === 'islice') { const a = ri(0, 10), s = ri(1, 5), n = ri(2, 5); res = Array.from({ length: n }, (_, i) => a + s * i); code = `from itertools import count, islice\nprint(list(islice(count(${a}, ${s}), ${n})))`; wrong = [py(Array.from({ length: n + 1 }, (_, i) => a + s * i)), py(Array.from({ length: n }, (_, i) => a + s * (i + 1))), py(Array.from({ length: n }, (_, i) => a + i))]; expl = 'count(start, step) counts forever; islice takes the first n values.'; res = py(res); }
  if (kind === 'accumulate') { let t = 0; const r = xs.map((x) => (t += x)); code = `from itertools import accumulate\nprint(list(accumulate(${py(xs)})))`; res = py(r); wrong = [py([0, ...r.slice(0, -1)]), py(r.slice(1)), py([r.at(-1)])]; expl = 'accumulate yields running totals.'; }
  if (kind === 'pairwise') { const r = xs.slice(1).map((x, i) => tup(xs[i], x)); code = `from itertools import pairwise\nprint(list(pairwise(${py(xs)})))`; res = py(r); const chunks = []; for (let i = 0; i + 1 < xs.length; i += 2) chunks.push(tup(xs[i], xs[i + 1])); wrong = [py(chunks), py(r.slice(1)), py(r.map((t) => t.items))]; expl = 'pairwise gives overlapping consecutive pairs.'; }
  if (kind === 'batched') { const k = ri(2, 3); const r = []; for (let i = 0; i < xs.length; i += k) r.push(tup(...xs.slice(i, i + k))); code = `from itertools import batched\nprint(list(batched(${py(xs)}, ${k})))`; res = py(r); wrong = [py(r.filter((t) => t.items.length === k)), py(r.map((t) => t.items)), py(xs.slice(1).map((x, i) => tup(xs[i], x)))]; expl = 'batched(iterable, n) yields tuples of n items; the last batch may be shorter.'; }
  if (kind === 'chain') { const ys = sample(SHORT, 2); code = `from itertools import chain\nprint(list(chain(${py(xs)}, ${py(ys)})))`; res = py([...xs, ...ys]); wrong = [py([xs, ys]), py([...ys, ...xs]), py([tup(...xs), tup(...ys)])]; expl = 'chain yields every item of the first iterable, then of the next.'; }
  if (kind === 'takewhile') { const k = ri(3, 7); const r = []; for (const x of xs) { if (x < k) r.push(x); else break; } code = `from itertools import takewhile\nprint(list(takewhile(lambda x: x < ${k}, ${py(xs)})))`; res = py(r); wrong = [py(xs.filter((x) => x < k)), py(xs.slice(r.length)), py(r.slice(0, -1))]; expl = 'takewhile stops at the FIRST item that fails the test (unlike a filter).'; }
  return { difficulty: kind === 'takewhile' || kind === 'batched' ? 'medium' : 'easy', question: 'What does this print?', code, correct: [res], wrong: [...wrong, '[]'], explanation: expl };
});

// ================================================================ Chapters 13/14: stdlib
const BEST = [
  ['stdlib1', 'parse command-line options and generate --help', 'argparse'], ['stdlib1', 'find all *.csv files in a folder', 'glob'],
  ['stdlib1', 'copy or move whole files and folders', 'shutil'], ['stdlib1', 'match text against a pattern like \\d{4}-\\d{2}', 're'],
  ['stdlib1', 'compute the median of a list of numbers', 'statistics'], ['stdlib1', 'pick a random item for a game', 'random'],
  ['stdlib1', 'generate a secure password-reset token', 'secrets'], ['stdlib1', 'add 30 days to a date', 'datetime'],
  ['stdlib1', 'compress bytes in memory', 'zlib'], ['stdlib1', 'time a small snippet accurately', 'timeit'],
  ['stdlib1', 'check examples written in docstrings', 'doctest'], ['stdlib1', 'write an xUnit-style test suite', 'unittest'],
  ['stdlib1', 'read rows with quoted commas from a spreadsheet export', 'csv'], ['stdlib1', 'store data in a single-file SQL database', 'sqlite3'],
  ['stdlib1', 'count how often each word occurs', 'collections'], ['stdlib1', 'run another program and capture its output', 'subprocess'],
  ['stdlib1', 'fetch a web page using only the standard library', 'urllib.request'], ['stdlib1', 'join path parts with the / operator', 'pathlib'],
  ['stdlib2', 'print a deeply nested dict readably', 'pprint'], ['stdlib2', 'wrap a paragraph to 40 columns', 'textwrap'],
  ['stdlib2', 'let users write templates with $name placeholders', 'string'], ['stdlib2', 'pack numbers into raw bytes for a binary file format', 'struct'],
  ['stdlib2', 'run several downloads at the same time', 'threading'], ['stdlib2', 'record warnings and errors with levels and timestamps', 'logging'],
  ['stdlib2', 'cache objects without keeping them alive', 'weakref'], ['stdlib2', 'store a million small integers compactly', 'array'],
  ['stdlib2', 'keep a list sorted while inserting items', 'bisect'], ['stdlib2', 'always take the most urgent task (smallest priority) first', 'heapq'],
  ['stdlib2', 'do exact money arithmetic in base 10', 'decimal'], ['stdlib2', 'define a fixed set of named constants', 'enum'],
  ['stdlib2', 'shorten a huge list in a log message', 'reprlib'], ['stdlib2', 'run CPU-heavy work on several cores', 'multiprocessing'],
];
for (const topic of ['stdlib1', 'stdlib2']) {
  template(`best-module-${topic === 'stdlib1' ? 1 : 2}`, topic, 28, () => {
    const pool = BEST.filter((b) => b[0] === topic);
    const [, task, mod] = pick(pool);
    return {
      difficulty: pick(['easy', 'easy', 'medium']), question: `Which standard-library module is the best fit to ${task}?`,
      correct: [mod], wrong: BEST.map((b) => b[2]).filter((m) => m !== mod),
      explanation: `${mod} is the standard tool for this job (see Chapter ${topic === 'stdlib1' ? 13 : 14}).`,
    };
  });
}

template('re-findall', 'stdlib1', 26, () => {
  const parts = Array.from({ length: ri(4, 6) }, () => (chance(0.4) ? String(ri(1, 999)) : chance(0.5) ? pick(SHORT) : pick(['Ana', 'Ben', 'Chen', 'Paris', 'Euro'])));
  if (chance(0.3)) parts.push(`${ri(1, 99)}.${ri(10, 99)}`);
  const text = parts.join(' ');
  const pats = [['\\d+', /\d+/g], ['[aeiou]', /[aeiou]/g], ['\\b\\w{4}\\b', /\b\w{4}\b/g], ['\\b[A-Z]\\w*', /\b[A-Z]\w*/g], ['\\d+\\.\\d+', /\d+\.\d+/g], ['\\b\\w', /\b\w/g]];
  const [ptext, re] = pick(pats);
  const res = [...text.matchAll(re)].map((m) => m[0]);
  if (!res.length || res.length > 7) return null;
  return {
    difficulty: ptext.includes('\\b') ? 'medium' : 'easy', question: 'What does this print?',
    code: `import re\nprint(re.findall(r"${ptext}", ${py(text)}))`,
    correct: [py(res)], wrong: [py(res.slice(0, 1)), py(res[0]), py(res.slice(1)), py(res.map(Number).filter((x) => !isNaN(x)).length ? res.map((x) => (isNaN(+x) ? x : +x)) : res.map((x) => x.toUpperCase())), String(res.length)],
    explanation: `findall returns every non-overlapping match as a list of strings, scanning left to right.`,
  };
});

template('date-math', 'stdlib1', 22, () => {
  const y = 2026, m = ri(1, 12), d = ri(1, 28);
  const base = Date.UTC(y, m - 1, d);
  const iso = (t) => new Date(t).toISOString().slice(0, 10);
  const days = pick([1, 7, 10, 30, 31, 45, 60, 100, -1, -30]);
  if (chance(0.5)) {
    const res = iso(base + days * 864e5);
    const naive = (() => { const dd = d + days; if (dd >= 1 && dd <= 31) return `${y}-${String(m).padStart(2, '0')}-${String(dd).padStart(2, '0')}`; return iso(base + (days + 1) * 864e5); })();
    return {
      difficulty: Math.abs(days) > 20 ? 'medium' : 'easy', question: 'What does this print?',
      code: `from datetime import date, timedelta\nprint((date(${y}, ${m}, ${d}) + timedelta(days=${days})).isoformat())`,
      correct: [res], wrong: [naive, iso(base + (days + 1) * 864e5), iso(base + (days - 1) * 864e5), iso(base - days * 864e5)],
      explanation: `Adding a timedelta handles month lengths for you: ${y}-${m}-${d} plus ${days} day(s) is ${res}.`,
    };
  }
  const m2 = ri(1, 12), d2 = ri(1, 28), other = Date.UTC(y, m2 - 1, d2);
  const diff = Math.round((other - base) / 864e5);
  return {
    difficulty: 'medium', question: 'What does this print?',
    code: `from datetime import date\nprint((date(${y}, ${m2}, ${d2}) - date(${y}, ${m}, ${d})).days)`,
    correct: [String(diff)], wrong: [String(diff + 1), String(diff - 1), String(-diff), String((m2 - m) * 30 + (d2 - d))],
    explanation: `Subtracting dates gives a timedelta; .days is the whole number of days between them (negative if the first date is earlier).`,
  };
});

template('path-parts', 'stdlib1', 22, () => {
  const dir = pick(['reports', 'data/2026', 'home/ana/receipts', 'src/tracker']), name = pick(['oct', 'notes', 'backup', 'photo']), ext = pick(['.txt', '.csv', '.tar.gz', '.json', '.py']);
  const p = `${dir}/${name}${ext}`;
  const parts = p.split('/'); const file = parts.at(-1);
  const lastDot = file.lastIndexOf('.');
  const vals = { name: file, stem: file.slice(0, lastDot), suffix: file.slice(lastDot), parent: parts.slice(0, -1).join('/'), 'parent.name': parts.at(-2) };
  const attr = pick(Object.keys(vals));
  return {
    difficulty: ext === '.tar.gz' ? 'hard' : 'easy', question: `On macOS or Linux, what does print(Path(${py(p)}).${attr}) show?`,
    correct: [vals[attr]], wrong: [...Object.values(vals), name, ext, dir.split('/')[0]].filter((v) => v !== vals[attr]),
    explanation: `name is the last part, stem is the name without its LAST suffix, suffix is the last ".ext", and parent is everything before the last part.`,
  };
});

template('counter-mc', 'stdlib1', 18, () => {
  const words = Array.from({ length: ri(6, 9) }, () => pick(SHORT.slice(0, 5)));
  const counts = new Map(); for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  const k = ri(1, 2);
  const sorted = [...counts].sort((a, b) => b[1] - a[1]);
  const res = sorted.slice(0, k).map(([w, c]) => tup(w, c));
  const alpha = [...counts].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, k).map(([w, c]) => tup(w, c));
  return {
    difficulty: 'medium', question: 'What does this print?',
    code: `from collections import Counter\nprint(Counter(${py(words)}).most_common(${k}))`,
    correct: [py(res)], wrong: [py(alpha), py([...counts].slice(0, k).map(([w, c]) => tup(w, c))), py(sorted.slice(0, k).map(([w]) => w)), py(sorted.slice(0, k + 1).map(([w, c]) => tup(w, c))), py([...counts].sort((a, b) => a[1] - b[1]).slice(0, k).map(([w, c]) => tup(w, c)))],
    explanation: `most_common(n) returns (item, count) pairs from most to least common; ties keep the order in which items were first seen.`,
  };
});

template('heap-bisect', 'stdlib2', 30, () => {
  if (chance(0.5)) {
    const data = sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ri(5, 6)); const x = ri(-3, 13); const k = ri(2, 3);
    const all = [...data, x].sort((a, b) => a - b);
    return {
      difficulty: 'medium', question: 'What does this print?',
      code: `from heapq import heapify, heappush, heappop\ndata = ${py(data)}\nheapify(data)\nheappush(data, ${x})\nprint([heappop(data) for _ in range(${k})])`,
      correct: [py(all.slice(0, k))], wrong: [py(all.slice(-k).reverse()), py(data.slice(0, k)), py([...data].sort((a, b) => a - b).slice(0, k)), py([x, ...data].slice(0, k))],
      explanation: `A heap always pops the smallest remaining item, so this gives the ${k} smallest values in increasing order.`,
    };
  }
  const xs = [...new Set(Array.from({ length: 5 }, () => ri(1, 30)))].sort((a, b) => a - b); const x = pick([...xs, ri(0, 31)]);
  const right = xs.filter((v) => v <= x).length, left = xs.filter((v) => v < x).length;
  const fn = pick(['bisect', 'bisect_left']);
  const res = fn === 'bisect' ? right : left;
  return {
    difficulty: xs.includes(x) ? 'hard' : 'medium', question: 'What does this print?',
    code: `import bisect\nprint(bisect.${fn}(${py(xs)}, ${x}))`,
    correct: [String(res)], wrong: [String(fn === 'bisect' ? left : right), String(res + 1), String(Math.max(0, res - 1)), String(xs.includes(x) ? xs.indexOf(x) + 2 : res + 2), 'True'],
    explanation: `bisect returns the insertion point that keeps the list sorted: bisect (= bisect_right) goes after equal items, bisect_left before them.`,
  };
});

function decRound(str, places, mode) {
  const neg = str.startsWith('-'); const s = neg ? str.slice(1) : str;
  const [ip, fp = ''] = s.split('.');
  const digits = (ip + fp.padEnd(places + 6, '0'));
  const keep = digits.slice(0, ip.length + places), rest = digits.slice(ip.length + places);
  let n = BigInt(keep);
  const restNonZero = /[1-9]/.test(rest);
  const first = +rest[0], tail = /[1-9]/.test(rest.slice(1));
  let up = false;
  if (mode === 'HALF_EVEN') up = first > 5 || (first === 5 && (tail || n % 2n === 1n));
  if (mode === 'HALF_UP') up = first >= 5;
  if (mode === 'DOWN') up = false;
  if (up) n += 1n;
  void restNonZero;
  let out = n.toString().padStart(places + 1, '0');
  out = out.slice(0, out.length - places) + (places ? '.' + out.slice(out.length - places) : '');
  return (neg ? '-' : '') + out;
}
template('decimal-quantize', 'stdlib2', 22, () => {
  const v = `${ri(0, 99)}.${String(ri(0, 999)).padStart(3, '0')}`;
  const tieV = chance(0.5) ? v.slice(0, -1) + '5' : v;
  const mode = pick(['HALF_EVEN', 'HALF_EVEN', 'HALF_UP']);
  const res = decRound(tieV, 2, mode);
  const code = mode === 'HALF_EVEN' ? `from decimal import Decimal\nprint(Decimal("${tieV}").quantize(Decimal("0.01")))` : `from decimal import Decimal, ROUND_HALF_UP\nprint(Decimal("${tieV}").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))`;
  return {
    difficulty: tieV.endsWith('5') ? 'hard' : 'medium', question: 'What does this print?', code,
    correct: [res], wrong: [decRound(tieV, 2, mode === 'HALF_EVEN' ? 'HALF_UP' : 'HALF_EVEN'), decRound(tieV, 2, 'DOWN'), tieV, decRound(tieV, 1, 'HALF_UP'), `Decimal('${res}')`],
    explanation: `quantize rounds to the given exponent. The default rounding is ROUND_HALF_EVEN ("banker's rounding": an exact half goes to the even digit); ROUND_HALF_UP always rounds halves up.`,
  };
});

const DEC_BOOL = [['0.1 + 0.2 == 0.3', 0], ['Decimal("0.1") + Decimal("0.2") == Decimal("0.3")', 1], ['Decimal(0.1) == Decimal("0.1")', 0], ['Decimal("1.10") == Decimal("1.1")', 1],
  ['str(Decimal("1.10")) == "1.10"', 1], ['round(2.5) == 2', 1], ['round(3.5) == 4', 1], ['math.isclose(0.1 + 0.2, 0.3)', 1], ['Fraction(1, 3) + Fraction(1, 6) == Fraction(1, 2)', 1],
  ['0.1 * 3 == 0.3', 0], ['sum([0.1] * 10) == 1.0', 1], ['1.0 % 0.1 == 0', 0], ['Decimal("1.00") % Decimal(".10") == 0', 1], ['round(0.5) == 1', 0], ['int(2.9) == 3', 0]];
template('decimal-bool', 'stdlib2', 14, () => {
  const items = sample(DEC_BOOL, 5);
  const y = items.filter((x) => x[1]), n = items.filter((x) => !x[1]);
  if (!y.length || !n.length) return null;
  return {
    difficulty: 'hard', exact: true,
    question: 'With from decimal import Decimal, from fractions import Fraction and import math, which expressions are True? (select all that apply)',
    correct: y.map((x) => x[0]), wrong: n.map((x) => x[0]),
    explanation: `Binary floats are inexact (use math.isclose), Decimal built from strings is exact, round() uses banker's rounding (2.5 → 2), and sum() of floats is compensated since 3.12.`,
  };
});

const ENUM_Q = [['Category("food")', "<Category.FOOD: 'food'>", ["'food'", 'Category.FOOD', 'ValueError']], ['Category.FOOD == "food"', 'True', ['False', 'TypeError', "'food'"]],
  ['str(Category.RENT)', "'rent'", ["'Category.RENT'", "'RENT'", '<Category.RENT>']], ['[c.value for c in Category]', "['food', 'rent', 'fun']", ["['FOOD', 'RENT', 'FUN']", '[1, 2, 3]', '[]']],
  ['Category("pets")', 'ValueError', ["<Category.MISC: 'misc'>", 'None', 'KeyError']], ['len(Category)', '3', ['0', '4', 'TypeError']], ['Category.FUN.name', "'FUN'", ["'fun'", 'Category.FUN', "'Category.FUN'"]], ['Category.RENT.value', "'rent'", ["'RENT'", '2', '<Category.RENT>']]];
template('enum-eval', 'stdlib2', 12, () => {
  const [e, a, w] = pick(ENUM_Q);
  return {
    difficulty: 'medium', question: `Given class Category(StrEnum) with FOOD = auto(), RENT = auto(), FUN = auto(), what does ${e} give?`,
    code: `from enum import StrEnum, auto\n\nclass Category(StrEnum):\n    FOOD = auto()\n    RENT = auto()\n    FUN = auto()\n\nprint(repr(${e}))`,
    correct: [a], wrong: w, explanation: `In a StrEnum, auto() makes the value the lower-case member name, members compare equal to their string values, and an unknown value raises ValueError.`,
  };
});

// ================================================================ Chapter 15: venv
const VENV_CMDS = [['create a virtual environment in .venv', 'python3 -m venv .venv'], ['activate .venv in zsh or bash', 'source .venv/bin/activate'],
  ['leave the active virtual environment', 'deactivate'], ['install the package rich', 'python -m pip install rich'], ['install exactly version 2.32.3 of requests', 'python -m pip install requests==2.32.3'],
  ['upgrade requests to the newest version', 'python -m pip install --upgrade requests'], ['save the exact installed versions to a file', 'python -m pip freeze > requirements.txt'],
  ['install everything listed in requirements.txt', 'python -m pip install -r requirements.txt'], ['see the version and dependencies of rich', 'python -m pip show rich'],
  ['remove the package rich', 'python -m pip uninstall rich'], ['list all installed packages', 'python -m pip list'], ['install the current project in editable mode', 'python -m pip install -e .'],
  ['run the venv\'s Python without activating it', '.venv/bin/python script.py'], ['activate .venv in Windows PowerShell', '.venv\\Scripts\\Activate.ps1']];
template('venv-command', 'venv', 30, () => {
  const [task, cmd] = pick(VENV_CMDS);
  return {
    difficulty: pick(['easy', 'easy', 'medium']), question: `Which command does this: ${task}?`,
    correct: [cmd], wrong: VENV_CMDS.map((v) => v[1]).filter((c) => c !== cmd).concat(['pip install --global rich', 'sudo pip install rich', 'python3 -m venv --activate']),
    explanation: `${cmd} — running pip as python -m pip guarantees it belongs to the Python you mean.`,
  };
});

const vcmp = (a, b) => cmpSeq(a.split('.').map(Number), b.split('.').map(Number));
template('version-spec', 'venv', 18, () => {
  const X = ri(1, 9), Y = ri(0, 9), Z = ri(0, 5);
  const specs = [
    [`~=${X}.${Y}`, (v) => vcmp(v, `${X}.${Y}`) >= 0 && vcmp(v, `${X + 1}`) < 0],
    [`~=${X}.${Y}.${Z}`, (v) => vcmp(v, `${X}.${Y}.${Z}`) >= 0 && vcmp(v, `${X}.${Y + 1}`) < 0],
    [`>=${X}.${Y},<${X + 1}`, (v) => vcmp(v, `${X}.${Y}`) >= 0 && vcmp(v, `${X + 1}`) < 0],
    [`==${X}.${Y}.*`, (v) => v.startsWith(`${X}.${Y}.`) || v === `${X}.${Y}`],
  ];
  const [spec, ok] = pick(specs);
  const cands = uniq([`${X}.${Y}`, `${X}.${Y + 1}`, `${X}.${Math.max(0, Y - 1)}`, `${X + 1}.0`, `${X}.${Y}.${Z + 1}`, `${X}.${Y + 2}.0`, `${X}.9`, `${Math.max(1, X - 1)}.9`, `${X}.${Y}.${Z}`])
    .filter((v) => v !== `${X}.${Y}` || !spec.startsWith('~=') || !spec.endsWith(`.${Z}`) || true);
  const chosen = sample(cands, 5);
  const y = chosen.filter(ok), n = chosen.filter((v) => !ok(v));
  if (!y.length || !n.length) return null;
  return {
    difficulty: spec.split('.').length > 2 ? 'hard' : 'medium', exact: true,
    question: `Which versions satisfy the requirement pkg${spec}? (select all that apply)`,
    correct: y, wrong: n,
    explanation: `~=X.Y means >=X.Y and < (X+1); ~=X.Y.Z means >=X.Y.Z and < X.(Y+1); ==X.Y.* matches any X.Y release.`,
  };
});

// ================================================================ Chapter 16: project
function parseAmount(text) {
  let t = text.trim().replace(/,/g, '.');
  const i = t.indexOf('.'); const whole = i < 0 ? t : t.slice(0, i), frac = i < 0 ? '' : t.slice(i + 1);
  const digits = (s) => /^[0-9]+$/.test(s);
  if (!digits(whole) || (frac && !digits(frac)) || frac.length > 2) return 'ValueError';
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, '0'));
  if (cents <= 0) return 'ValueError';
  return String(cents);
}
template('parse-amount', 'project', 24, () => {
  const t = pick(['12.5', '0,99', '7', 'abc', '-3', '1.234', '0', '3.', '12.50', ' 4.2 ', '1,5', '.5', '100', '0.01', '2.05', '9,9', '1e3', '15.0', '0.00', '42,10']);
  const ans = parseAmount(t);
  const asFloat = isNaN(parseFloat(t.replace(',', '.'))) ? '0' : String(Math.round(parseFloat(t.replace(',', '.')) * 100) || 1);
  return {
    difficulty: ans === 'ValueError' || t.includes(',') ? 'medium' : 'easy', question: `In the Chapter 16 tracker, what does parse_amount(${py(t)}) return?`,
    correct: [ans], wrong: ['ValueError', asFloat, String(Number(ans) / 100 || 5), String((Number(ans) || 120) * 10), String((Number(ans) || 12) + 1), 'None'],
    explanation: `parse_amount accepts "." or "," as the decimal separator, at most two decimals, digits only, and a positive total; it returns whole cents.`,
  };
});

template('format-money', 'project', 18, () => {
  const c = pick([ri(1, 99), ri(100, 99999), ri(100000, 9999999), -ri(1, 9999)]);
  const sign = c < 0 ? '-' : ''; const whole = Math.floor(Math.abs(c) / 100), rest = Math.abs(c) % 100;
  const g = whole.toLocaleString('en-US');
  const ans = `${sign}€${g}.${String(rest).padStart(2, '0')}`;
  return {
    difficulty: c < 0 ? 'medium' : 'easy', question: `What does format_money(${c}) return in the Chapter 16 tracker?`,
    correct: [py(ans)], wrong: [py(`${sign}€${whole}.${String(rest).padStart(2, '0')}`), py(`${sign}€${g}.${rest}`), py(`€${sign}${g}.${String(rest).padStart(2, '0')}`), py(`${sign}€${(Math.abs(c) / 100).toFixed(1)}`), py(`${sign}€${c}`)].filter((x) => x !== py(ans)),
    explanation: `divmod(abs(cents), 100) splits euros and cents; :, adds thousands separators and :02d pads cents to two digits; the minus sign goes before €.`,
  };
});

const CLI_SCEN = [['show totals per category for October 2026', 'python3 -m tracker summary --month 2026-10'], ['record €4.20 for food with the note "ice cream"', 'python3 -m tracker add 4.20 food --note "ice cream"'],
  ['list only the books expenses', 'python3 -m tracker list --category books'], ['remove the expense with id 7', 'python3 -m tracker delete 7'],
  ['use a separate data file demo.json to list everything', 'python3 -m tracker --file demo.json list'], ['add €900 rent dated 2026-10-01', 'python3 -m tracker add 900 rent --date 2026-10-01'],
  ['run the test suite', 'python3 -m unittest test_tracker'], ['check the doctests in models.py', 'python3 -m doctest tracker/models.py']];
template('tracker-cli', 'project', 14, () => {
  const [task, cmd] = pick(CLI_SCEN);
  return {
    difficulty: cmd.includes('--file') ? 'medium' : 'easy', question: `In the Chapter 16 project, which command will ${task}?`,
    correct: [cmd], wrong: CLI_SCEN.map((s) => s[1]).filter((c) => c !== cmd).concat(['python3 tracker summary october', 'python3 -m tracker list food']),
    explanation: `--file belongs to the main parser (before the subcommand); --category, --month, --note and --date belong to their subcommands.`,
  };
});

// ================================================================ Appendix A: fromjava
const JMAP = [['null', 'None'], ['true && !done', 'True and not done'], ['x++', 'x += 1'], ['cond ? a : b', 'a if cond else b'], ['s.length()', 'len(s)'],
  ['s.substring(1, 3)', 's[1:3]'], ['s.contains("x")', '"x" in s'], ['String.join(",", items)', '",".join(items)'], ['s.trim()', 's.strip()'],
  ['new ArrayList<>()', '[]'], ['new HashMap<>()', '{}'], ['new HashSet<>()', 'set()'], ['map.getOrDefault(k, 0)', 'd.get(k, 0)'], ['list.size()', 'len(lst)'],
  ['for (String s : names)', 'for s in names:'], ['for (int i = 0; i < n; i++)', 'for i in range(n):'], ['throw new IllegalArgumentException("x")', 'raise ValueError("x")'],
  ['catch (IOException e)', 'except OSError as e:'], ['this.name = name', 'self.name = name'], ['public String toString()', 'def __str__(self):'],
  ['a.equals(b)', 'a == b'], ['a == b (same object)', 'a is b'], ['x instanceof Foo', 'isinstance(x, Foo)'], ['static int count', 'a class variable count = 0'],
  ['`Hi ${name}`'.replace('$', '$'), 'f"Hi {name}"'], ['arr.map(x => x * 2)', '[x * 2 for x in arr]'], ['arr.filter(x => x > 0)', '[x for x in arr if x > 0]'],
  ['Math.floor(a / b)', 'a // b'], ['Math.pow(2, 10)', '2 ** 10'], ['System.out.println(x)', 'print(x)'], ['try (var r = open()) {...}', 'with open(...) as r:'],
  ['interface Shape', 'an abc.ABC (or duck typing)'], ['import java.util.List;', 'from typing import List (rarely needed)'], ['Collections.sort(list, comparator)', 'lst.sort(key=func)']];
template('java-map', 'fromjava', 40, () => {
  const [j, p] = pick(JMAP);
  return {
    difficulty: pick(['easy', 'easy', 'medium']), question: `What is the Python equivalent of the Java/JavaScript code: ${j}`,
    correct: [p], wrong: JMAP.map((x) => x[1]).filter((x) => x !== p),
    explanation: `${j} becomes ${p} in Python.`,
  };
});

template('js-falsy', 'fromjava', 16, () => {
  const items = sample(TRUTHY, 5);
  const f = items.filter((x) => !x[1]), t = items.filter((x) => x[1]);
  if (!f.length || !t.length) return null;
  return {
    difficulty: 'medium', exact: true,
    question: 'In Python (unlike JavaScript in some cases), which of these are FALSY? (select all that apply)',
    correct: f.map((x) => x[0]), wrong: t.map((x) => x[0]),
    explanation: `Python treats empty containers ([], {}, (), set()) as false, unlike JavaScript, where [] and {} are truthy. Non-empty strings such as "0" are true in both.`,
  };
});

const EQ_IS = [['a = [1, 2]; b = [1, 2]', 'a == b, a is b', '(True, False)'], ['a = [1, 2]; b = a', 'a == b, a is b', '(True, True)'],
  ['x = None', 'x is None, x == None', '(True, True)'], ['a = (1, [2]); b = (1, [2])', 'a == b, a is b', '(True, False)'], ['a = [1]; b = a[:]', 'a == b, a is b', '(True, False)'],
  ['a = {"k": 1}; b = dict(a)', 'a == b, a is b', '(True, False)'], ['a = [1, 2]; b = [2, 1]', 'a == b, sorted(a) == sorted(b)', '(False, True)'],
  ['a = 1; b = 1.0', 'a == b, type(a) == type(b)', '(True, False)'], ['s = "ab"; t = "".join(["a", "b"])', 's == t, len(s) == len(t)', '(True, True)']];
template('eq-is', 'fromjava', 14, () => {
  const [setup, expr, ans] = pick(EQ_IS);
  return {
    difficulty: 'medium', question: 'What does this print?', code: `${setup.replaceAll('; ', '\n')}\nprint((${expr}))`,
    correct: [ans], wrong: ['(True, True)', '(True, False)', '(False, True)', '(False, False)'],
    explanation: `== compares values (like Java's equals), is compares identity (like Java's == on references).`,
  };
});

// ================================================================ Appendix B: shell
template('stream-redirect', 'shell', 16, () => {
  const [o, e] = sample(['A', 'B', 'X', 'Y', 'ok', 'err'], 2);
  const reds = [['> out.txt', `only ${e}`], ['2> err.txt', `only ${o}`], ['> out.txt 2>&1', 'nothing'], ['2>/dev/null', `only ${o}`], ['', `${o} and ${e}`], ['> /dev/null', `only ${e}`]];
  const [r, ans] = pick(reds);
  return {
    difficulty: r.includes('2>&1') ? 'hard' : 'medium', question: 'What appears on the screen?',
    code: `$ python3 -c "import sys; print('${o}'); print('${e}', file=sys.stderr)" ${r}`.trim(),
    correct: [ans], wrong: [`only ${o}`, `only ${e}`, `${o} and ${e}`, 'nothing'],
    explanation: `print() writes to stdout and file=sys.stderr to stderr; > redirects stdout, 2> redirects stderr, and 2>&1 sends stderr wherever stdout goes.`,
  };
});

const EXITS = [['pass', 0], ['import sys; sys.exit(3)', 3], ['1/0', 1], ['import sys; sys.exit("bad config")', 1], ['raise SystemExit(5)', 5], ['import sys; sys.exit()', 0],
  ['import sys; sys.exit(0)', 0], ['int("x")', 1], ['print("hello")', 0], ['import sys; sys.exit(2)', 2], ['raise ValueError("x")', 1]];
template('exit-code', 'shell', 14, () => {
  const [code, ex] = pick(EXITS);
  return {
    difficulty: code.includes('"bad') || code.includes('SystemExit') ? 'hard' : 'medium', question: 'What does $? show after this command?',
    code: `$ python3 -c '${code}'; echo $?`, correct: [String(ex)], wrong: ['0', '1', '2', '3', '5', '-1', '127'],
    explanation: `0 means success. An uncaught exception exits with 1, sys.exit(n) uses n, and sys.exit("message") prints the message and exits with 1.`,
  };
});

template('utf8-len', 'shell', 16, () => {
  const s = pick(['café', 'naïve', 'Zürich', '€12', 'piñata', 'hello', 'résumé', 'smörgåsbord', '☕ tea', 'jalapeño', 'Ωmega', '日本']);
  const chars = [...s].length, bytes = Buffer.byteLength(s, 'utf8');
  return {
    difficulty: bytes - chars > 2 ? 'hard' : 'medium', question: 'What does this print?',
    code: `s = ${py(s)}\nprint(len(s), len(s.encode("utf-8")))`,
    correct: [`${chars} ${bytes}`], wrong: [`${bytes} ${bytes}`, `${chars} ${chars}`, `${bytes} ${chars}`, `${chars} ${bytes + 1}`, `${chars} ${chars * 2}`],
    explanation: `len() of a str counts characters; encoding to UTF-8 uses 1 byte for ASCII, 2 for most accented letters, and 3 for characters like €, ☕ or 日.`,
  };
});

// ================================================================ build
addHandwritten(h);
const handCount = questions.length;

// iter-exhaust's first variant is assembled here (it needs two printed lines)
const ie = TEMPLATES.find((t) => t.id === 'iter-exhaust');
const ieGen = ie.gen;
ie.gen = () => {
  const q = ieGen();
  if (!q || !q._lines) return q;
  const [xs, k] = q._lines;
  const first = xs.slice(0, k).join(' '), rest = py(xs.slice(k));
  return {
    difficulty: 'medium', question: 'What does this print? (both lines, separated by " / ")', code: q.code,
    correct: [`${first} / ${rest} []`], wrong: [`${first} / ${rest} ${rest}`, `${first} / ${py(xs)} []`, `${first} / ${py(xs)} ${py(xs)}`, `${xs.slice(1, k + 1).join(' ')} / ${py(xs.slice(k + 1))} []`],
    explanation: `An iterator remembers its position: next() consumed ${k} item(s), the first list() takes the rest, and the second list() finds it exhausted.`,
  };
};

for (const t of TEMPLATES) runTemplate(t, t.quota);
// top up to the target, cycling templates
let guard = 0;
while (questions.length < TARGET && guard++ < 5000) {
  const t = TEMPLATES[guard % TEMPLATES.length];
  runTemplate(t, 1);
}
// trim down to the target: remove generated, single-answer questions from the
// difficulty that is most over its target share, taken from the biggest topics
const SHARE = { easy: 0.40, medium: 0.45, hard: 0.15 };
const countBy = (k) => questions.reduce((m, q) => ((m[q[k]] = (m[q[k]] || 0) + 1), m), {});
console.log('before trim:', questions.length, JSON.stringify(countBy('difficulty')));
while (questions.length > TARGET) {
  const byDiff = countBy('difficulty'), byTopic = countBy('topic');
  const over = Object.keys(SHARE).sort((a, b) => (byDiff[b] || 0) / SHARE[b] - (byDiff[a] || 0) / SHARE[a])[0];
  const cands = questions.map((q, i) => [q, i]).filter(([q]) => q.template && q.difficulty === over && q.answer.length === 1
    && perTemplate[q.template] > 4 && byTopic[q.topic] > 35);
  if (!cands.length) { console.log('cannot trim further'); break; }
  const maxTopic = Math.max(...cands.map(([q]) => byTopic[q.topic]));
  const [q, i] = pick(cands.filter(([c]) => byTopic[c.topic] >= maxTopic - 3));
  questions.splice(i, 1); perTemplate[q.template]--;
}

const order = Object.keys(CHAPTERS);
questions.sort((a, b) => order.indexOf(a.topic) - order.indexOf(b.topic));
questions.forEach((q, i) => { q.id = i + 1; });

const out = {
  version: 1, topic: 'Python', generated: new Date().toISOString().slice(0, 10), total: questions.length,
  chapters: Object.fromEntries(Object.entries(CHAPTERS).map(([k, [number, title, file]]) => [k, { number, title, file }])),
  questions,
};
writeFileSync(join(ROOT, 'questions.json'), JSON.stringify(out, null, 1) + '\n');

// ---------------------------------------------------------------- stats
const multi = questions.filter((q) => q.answer.length > 1).length;
const pct = (n) => `${n} (${(100 * n / questions.length).toFixed(1)}%)`;
console.log(`total: ${questions.length}  hand-written: ${handCount}  generated: ${questions.length - handCount}  multi-answer: ${pct(multi)}`);
const diff = countBy('difficulty');
console.log('difficulty:', Object.entries(diff).map(([k, v]) => `${k} ${pct(v)}`).join(', '));
console.log('per topic:', Object.entries(countBy('topic')).map(([k, v]) => `${k} ${v}`).join(', '));
console.log('per template:', Object.entries(perTemplate).map(([k, v]) => `${k} ${v}`).join(', '));
