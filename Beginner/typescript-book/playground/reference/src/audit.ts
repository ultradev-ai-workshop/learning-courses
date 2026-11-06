// A typed event log and a standard method decorator (Chapters 10 and 16).
import type { LoanEvent } from "./types.js";

export type EventOf<T extends LoanEvent["type"]> = Extract<LoanEvent, { type: T }>;
type Listener<T extends LoanEvent["type"]> = (event: EventOf<T>) => void;

export class EventLog {
  readonly events: LoanEvent[] = [];
  readonly #listeners: { [T in LoanEvent["type"]]?: Listener<T>[] } = {};

  on<T extends LoanEvent["type"]>(type: T, listener: Listener<T>): void {
    const list = (this.#listeners[type] ??= []) as Listener<T>[];
    list.push(listener);
  }

  emit(event: LoanEvent): void {
    this.events.push(event);
    const list = this.#listeners[event.type] as Listener<typeof event.type>[] | undefined;
    list?.forEach((fn) => fn(event as never));
  }
}

/** Logs each call of the decorated method as "→ name(args)". */
export function traced<This, A extends unknown[], R>(
  method: (this: This, ...args: A) => R,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: A) => R>,
) {
  const name = String(context.name);
  return function (this: This, ...args: A): R {
    const shown = args.map((a) => (a instanceof Date ? a.toDateString() : String(a)));
    console.log(`→ ${name}(${shown.join(", ")})`);
    return method.call(this, ...args);
  };
}
