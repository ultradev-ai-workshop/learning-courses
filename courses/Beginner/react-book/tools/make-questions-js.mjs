// Copies questions.json into questions.js (window.QUESTION_BANK = ...).
// Browsers block fetch() for pages opened straight from disk (file://), so
// assessment.html falls back to this script version. Run after editing questions.json:
//   node tools/make-questions-js.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = fs.readFileSync(path.join(dir, 'questions.json'), 'utf8');
JSON.parse(json); // fail early on invalid JSON
fs.writeFileSync(path.join(dir, 'questions.js'), '// Generated from questions.json by tools/make-questions-js.mjs. Do not edit.\nwindow.QUESTION_BANK = ' + json + ';\n');
console.log('questions.js updated');
