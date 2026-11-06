// Hand-written questions for the TypeScript Study Book assessment, in five parts.
// h(topic, difficulty, question, options, explanation): options starting with "*" are correct.
import { part1 } from "./questions-hand-1.mjs";
import { part2 } from "./questions-hand-2.mjs";
import { part3 } from "./questions-hand-3.mjs";
import { part4 } from "./questions-hand-4.mjs";
import { part5 } from "./questions-hand-5.mjs";

export function addHandwritten(h) {
  part1(h);
  part2(h);
  part3(h);
  part4(h);
  part5(h);
}
