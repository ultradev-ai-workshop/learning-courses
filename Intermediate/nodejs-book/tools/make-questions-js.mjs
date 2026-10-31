// Copies questions.json into questions.js as `window.QUESTION_BANK = …;`
// Browsers block fetch() on pages opened from disk (file://), so the
// assessment falls back to loading this script instead.
//
// Usage:  node tools/make-questions-js.mjs   (run after editing questions.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(ROOT, 'questions.json'), 'utf8'));
writeFileSync(join(ROOT, 'questions.js'),
  '// Generated from questions.json by tools/make-questions-js.mjs — edit the JSON, not this file.\n' +
  'window.QUESTION_BANK = ' + JSON.stringify(data) + ';\n');
console.log(`wrote questions.js (${data.questions.length} questions)`);
