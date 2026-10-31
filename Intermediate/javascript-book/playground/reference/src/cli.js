#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import books from "../data/books.json" with { type: "json" };
import { Catalog } from "./catalog.js";
import { processAll } from "./processor.js";
import { summarize, render } from "./report.js";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    concurrency: { type: "string", short: "c", default: "2" },
    verbose: { type: "boolean", short: "v", default: false },
  },
});

const timer = {                                   // a disposable stopwatch (Chapter 15)
  start: performance.now(),
  [Symbol.dispose]() { if (values.verbose) console.error(`done in ${Math.round(performance.now() - this.start)} ms`); },
};

export async function main(ordersFile = positionals[0] ?? "data/orders.json") {
  using _t = timer;
  const orders = JSON.parse(await readFile(ordersFile, "utf8"));
  const catalog = new Catalog(books);
  const results = [];
  for await (const result of processAll(orders, catalog, { concurrency: Number(values.concurrency) })) {
    if (values.verbose) console.error(`  ${result.status.padEnd(6)} ${result.id}`);
    results.push(result);
  }
  console.log(render(summarize(results, catalog), results));
  return results;
}

if (import.meta.main) {
  main().catch((err) => {
    console.error("fatal:", err.message);
    process.exitCode = 1;
  });
}
