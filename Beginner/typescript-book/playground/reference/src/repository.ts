// A generic in-memory store for anything with an id (Chapter 8).
export class InMemoryRepository<T extends { readonly id: string }> {
  readonly #items = new Map<T["id"], T>();

  add(item: T): T {
    if (this.#items.has(item.id)) throw new Error(`duplicate id ${item.id}`);
    this.#items.set(item.id, item);
    return item;
  }

  get(id: T["id"]): T | undefined {
    return this.#items.get(id);
  }

  update(id: T["id"], changes: Partial<Omit<T, "id">>): T {
    const current = this.#items.get(id);
    if (current === undefined) throw new Error(`unknown id ${id}`);
    const next: T = { ...current, ...changes };
    this.#items.set(id, next);
    return next;
  }

  list(filter: (item: T) => boolean = () => true): T[] {
    return [...this.#items.values()].filter(filter);
  }
}
