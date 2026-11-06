// Hand-written questions, split by part of the book.
// h(topic, difficulty, question, options, explanation): options starting with "*" are correct.
const parts = [];
for (const name of ["questions-hand-1.mjs", "questions-hand-2.mjs", "questions-hand-3.mjs", "questions-hand-4.mjs", "questions-hand-5.mjs", "questions-hand-6.mjs", "questions-hand-7.mjs"]) {
  try { parts.push(await import(`./${name}`)); } catch (e) { if (e.code !== "ERR_MODULE_NOT_FOUND") throw e; }
}
export function addHandwritten(h) {
  for (const p of parts) p.default(h);
}
