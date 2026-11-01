// Structural checks for the book pages and questions.json.
// Usage: node tools/check-book.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let problems = 0;
const bad = (msg) => { problems++; console.log('  ✘ ' + msg); };

const pages = readdirSync(ROOT).filter((f) => /^(\d\d-.*|appendix-.*)\.html$/.test(f)).sort();
console.log('page                     ex  🟢  🟡  🔴  sol  learn more recap docs balance');
for (const f of pages) {
  const html = readFileSync(join(ROOT, f), 'utf8');
  const body = html.replace(/<script type="text\/plain"[\s\S]*?<\/script>/g, '');   // ignore code blocks
  const ex = [...body.matchAll(/<div class="exercise">\s*<h3>Exercise (\d+) <span class="lvl (easy|medium|hard)">/g)];
  const nums = ex.map((m) => +m[1]);
  const lv = { easy: 0, medium: 0, hard: 0 };
  ex.forEach((m) => lv[m[2]]++);
  const exBlocks = body.split('<div class="exercise">').slice(1);
  const withSol = exBlocks.filter((b) => b.includes('<details class="solution"><summary>Show solution</summary>')).length;
  const has = (re) => re.test(body);
  const learn = has(/class="learn"/), more = has(/id="more-examples"/) || f.startsWith('appendix'), recap = has(/class="recap"/) || has(/id="recap-table"/), docs = has(/class="doclinks"/);
  const balance = ['div', 'details', 'table', 'ul', 'ol', 'section'].map((t) => {
    const open = (body.match(new RegExp(`<${t}[\\s>]`, 'g')) || []).length, close = (body.match(new RegExp(`</${t}>`, 'g')) || []).length;
    return open === close ? null : `${t} ${open}/${close}`;
  }).filter(Boolean);
  console.log(`${f.padEnd(24)} ${String(ex.length).padStart(2)} ${String(lv.easy).padStart(3)} ${String(lv.medium).padStart(3)} ${String(lv.hard).padStart(3)} ${String(withSol).padStart(4)}  ${learn ? '✓' : '✘'}     ${more ? '✓' : '✘'}    ${recap ? '✓' : '✘'}    ${docs ? '✓' : '✘'}   ${balance.length ? balance.join(',') : '✓'}`);
  if (ex.length < 10) bad(`${f}: only ${ex.length} exercises`);
  if (nums.some((n, i) => n !== i + 1)) bad(`${f}: exercises not numbered 1..N (${nums.join(',')})`);
  if (withSol !== exBlocks.length) bad(`${f}: ${exBlocks.length - withSol} exercise(s) without a solution`);
  if (!learn || !more || !recap || !docs) bad(`${f}: missing a required section`);
  if (balance.length) bad(`${f}: unbalanced tags ${balance.join(', ')}`);
  if (!html.includes('id="sidebar"') || !html.includes('id="pager"') || !html.includes('src="book.js"')) bad(`${f}: missing sidebar/pager/book.js`);
}

// ---------------- how-to pages ----------------
const howtos = readdirSync(ROOT).filter((f) => /^howto-.*\.html$/.test(f) && f !== 'howto-index.html').sort();
console.log('\nhow-to page              recipes  problem  solution  pitfalls  balance');
for (const f of howtos) {
  const body = readFileSync(join(ROOT, f), 'utf8').replace(/<script type="text\/plain"[\s\S]*?<\/script>/g, '');
  const recipes = body.split('<div class="recipe"').slice(1);
  const count = (re) => recipes.filter((r) => re.test(r)).length;
  const problem = count(/class="problem"/), solution = count(/<h3>Solution<\/h3>/), pitfalls = count(/<h3>Pitfalls<\/h3>/);
  const balance = ['div', 'table', 'ul', 'ol'].map((t) => {
    const open = (body.match(new RegExp(`<${t}[\\s>]`, 'g')) || []).length, close = (body.match(new RegExp(`</${t}>`, 'g')) || []).length;
    return open === close ? null : `${t} ${open}/${close}`;
  }).filter(Boolean);
  console.log(`${f.padEnd(24)} ${String(recipes.length).padStart(7)} ${String(problem).padStart(8)} ${String(solution).padStart(9)} ${String(pitfalls).padStart(9)}  ${balance.length ? balance.join(',') : '✓'}`);
  if (recipes.length < 5) bad(`${f}: only ${recipes.length} recipes`);
  if (problem !== recipes.length || solution !== recipes.length || pitfalls !== recipes.length) bad(`${f}: a recipe lacks Problem/Solution/Pitfalls`);
  if (balance.length) bad(`${f}: unbalanced tags ${balance.join(', ')}`);
}

// ---------------- local links ----------------
const { existsSync } = await import('node:fs');
let links = 0;
for (const f of readdirSync(ROOT).filter((x) => x.endsWith('.html'))) {
  const html = readFileSync(join(ROOT, f), 'utf8').replace(/<script type="text\/plain"[\s\S]*?<\/script>/g, '');
  for (const [, href] of html.matchAll(/href="([^"#:]+\.html)(#[^"]*)?"/g)) {
    links++;
    if (!existsSync(join(ROOT, href))) bad(`${f}: broken link ${href}`);
  }
}
console.log(`\nlocal links checked: ${links}`);

// ---------------- questions.json ----------------
const data = JSON.parse(readFileSync(join(ROOT, 'questions.json'), 'utf8'));
const qs = data.questions;
console.log(`\nquestions.json: ${qs.length} questions (total field ${data.total})`);
if (qs.length !== 1000 || data.total !== 1000) bad('expected exactly 1000 questions');
const ids = new Set(qs.map((q) => q.id));
if (ids.size !== qs.length) bad('duplicate ids');
const topics = Object.keys(data.chapters);
const byTopic = {}, byDiff = {};
for (const q of qs) {
  byTopic[q.topic] = (byTopic[q.topic] || 0) + 1;
  byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
  const ch = data.chapters[q.topic];
  if (!ch) { bad(`#${q.id}: unknown topic ${q.topic}`); continue; }
  if (q.chapter !== ch.number || q.chapterFile !== ch.file) bad(`#${q.id}: chapter/chapterFile mismatch`);
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) bad(`#${q.id}: bad difficulty`);
  if (!Array.isArray(q.answer) || !q.answer.length || q.answer.some((i) => i < 0 || i >= q.options.length)) bad(`#${q.id}: bad answer`);
  if (new Set(q.options).size !== q.options.length) bad(`#${q.id}: duplicate options`);
  if (q.options.length < 4 || q.options.length > 6) bad(`#${q.id}: ${q.options.length} options`);
  if (!q.explanation || q.explanation.length < 20) bad(`#${q.id}: weak explanation`);
  if (!q.question) bad(`#${q.id}: empty question`);
}
for (const t of topics) if ((byTopic[t] || 0) < 25) bad(`topic ${t} has only ${byTopic[t] || 0} questions`);
const multi = qs.filter((q) => q.answer.length > 1).length;
console.log('per topic:', topics.map((t) => `${t} ${byTopic[t]}`).join(', '));
console.log('per difficulty:', Object.entries(byDiff).map(([k, v]) => `${k} ${v}`).join(', '), `| multi-answer ${multi}`);
console.log(problems ? `\n${problems} problem(s)` : '\nall structural checks passed');
process.exit(problems ? 1 : 0);
