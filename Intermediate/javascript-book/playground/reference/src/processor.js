import { setTimeout as sleep } from "node:timers/promises";
import { charge } from "./payments.js";
import { ValidationError, ShopError } from "./errors.js";

function validate(order) {
  if (!order?.id || !Array.isArray(order.items) || order.items.length === 0) {
    throw new ValidationError(`order ${order?.id ?? "?"} has no items`);
  }
  for (const { bookId, qty } of order.items) {
    if (!Number.isInteger(qty) || qty < 1) throw new ValidationError(`bad qty for ${bookId}`);
  }
}

async function withRetry(fn, { retries = 2, baseMs = 5 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries || !err.cause?.retryable) throw err;
      await sleep(baseMs * 2 ** attempt);                 // exponential backoff
    }
  }
}

// Process one order: validate → reserve stock → charge (with retry + timeout) → or roll back.
export async function processOrder(order, catalog, { timeoutMs = 200, retries = 2, pay = charge } = {}) {
  const reserved = [];
  try {
    validate(order);
    for (const { bookId, qty } of order.items) {
      catalog.get(bookId).reserve(qty);
      reserved.push([bookId, qty]);
    }
    const cents = order.items.reduce((sum, { bookId, qty }) => sum + catalog.get(bookId).price * qty, 0);
    const signal = AbortSignal.timeout(timeoutMs);
    const payment = await withRetry(() => pay({ card: order.card, cents }, { signal }), { retries });   // `pay` is injectable for tests
    return { id: order.id, customer: order.customer, status: "paid", cents, receipt: payment.receipt };
  } catch (err) {
    for (const [bookId, qty] of reserved) catalog.get(bookId).release(qty);    // roll back
    if (!(err instanceof ShopError)) throw err;                                // bugs still surface
    return { id: order.id, customer: order.customer, status: "failed", reason: `${err.name}: ${err.message}` };
  }
}

// Process many orders with a concurrency limit; yields each result as soon as it's ready.
export async function* processAll(orders, catalog, { concurrency = 2, ...options } = {}) {
  const queue = orders.values();
  const running = new Set();
  const launch = () => {
    const next = queue.next();
    if (next.done) return;
    const task = processOrder(next.value, catalog, options).then((result) => ({ task, result }));
    running.add(task);
  };
  for (let i = 0; i < concurrency; i++) launch();
  while (running.size) {
    const { task, result } = await Promise.race(running);
    running.delete(task);
    launch();
    yield result;
  }
}
