import { setTimeout as sleep } from "node:timers/promises";
import { PaymentError } from "./errors.js";

// A fake payment gateway with deterministic behaviour, so examples and tests are repeatable:
//   card ending 0002 → always declined
//   card ending 0119 → fails twice (a "network blip"), then succeeds
//   anything else    → succeeds
const attempts = new Map();

export function resetGateway() { attempts.clear(); }

export async function charge({ card, cents }, { signal, latencyMs = 10 } = {}) {
  await sleep(latencyMs, null, { signal });
  const n = (attempts.get(card) ?? 0) + 1;
  attempts.set(card, n);
  if (card.endsWith("0002")) throw new PaymentError("card declined");
  if (card.endsWith("0119") && n <= 2) throw new PaymentError(`gateway timeout (attempt ${n})`, { cause: { retryable: true } });
  return { receipt: `rcpt-${card.slice(-4)}-${cents}`, cents };
}
