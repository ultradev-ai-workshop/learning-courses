import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Catalog } from "../src/catalog.js";
import { processOrder, processAll } from "../src/processor.js";
import { resetGateway } from "../src/payments.js";
import { summarize } from "../src/report.js";

const BOOKS = [
  { id: "b1", title: "Dune", price: 1299, stock: 2 },
  { id: "b2", title: "Emma", price: 899, stock: 1 },
];
let catalog;
beforeEach(() => { catalog = new Catalog(BOOKS); resetGateway(); });

test("a valid order is paid and reduces stock", async () => {
  const r = await processOrder({ id: "t1", customer: "Ana", card: "x-0001", items: [{ bookId: "b1", qty: 2 }] }, catalog);
  assert.equal(r.status, "paid");
  assert.equal(r.cents, 2598);
  assert.equal(catalog.get("b1").stock, 0);
});

test("a declined card rolls the stock back", async () => {
  const r = await processOrder({ id: "t2", customer: "Ben", card: "x-0002", items: [{ bookId: "b2", qty: 1 }] }, catalog);
  assert.deepEqual([r.status, r.reason], ["failed", "PaymentError: card declined"]);
  assert.equal(catalog.get("b2").stock, 1);
});

test("a flaky gateway succeeds after retries", async () => {
  const r = await processOrder({ id: "t3", customer: "Chen", card: "x-0119", items: [{ bookId: "b2", qty: 1 }] }, catalog);
  assert.equal(r.status, "paid");
});

test("validation and stock errors are reported, not thrown", async () => {
  const bad = await processOrder({ id: "t4", items: [] }, catalog);
  const short = await processOrder({ id: "t5", card: "x-0001", items: [{ bookId: "b2", qty: 5 }] }, catalog);
  assert.match(bad.reason, /^ValidationError/);
  assert.match(short.reason, /^OutOfStockError/);
});

test("processAll respects the concurrency limit and yields every result", async () => {
  let active = 0, peak = 0;
  const pay = async ({ cents }) => {                    // a fake gateway that counts calls in flight
    active++; peak = Math.max(peak, active);
    await new Promise((r) => setTimeout(r, 5));
    active--;
    return { receipt: "test", cents };
  };
  const orders = Array.from({ length: 5 }, (_, i) => ({ id: `p${i}`, customer: "Ana", card: "x-0001", items: [{ bookId: "b1", qty: 1 }] }));
  const results = await Array.fromAsync(processAll(orders, new Catalog([{ ...BOOKS[0], stock: 99 }]), { concurrency: 2, pay }));
  assert.equal(results.length, 5);
  assert.equal(peak, 2);
  assert.equal(summarize(results, catalog).revenue, 5 * 1299);
});
