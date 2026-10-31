import { OutOfStockError, ValidationError } from "./errors.js";

export class Book {
  #stock;
  constructor({ id, title, price, stock = 0 }) {
    if (!Number.isInteger(price) || price <= 0) throw new ValidationError(`bad price for ${id}`);
    Object.assign(this, { id, title, price });
    this.#stock = stock;
  }
  get stock() { return this.#stock; }
  reserve(qty) {
    if (qty > this.#stock) throw new OutOfStockError(`only ${this.#stock} × ${this.title} left, ${qty} requested`);
    this.#stock -= qty;
  }
  release(qty) { this.#stock += qty; }
}

export class Catalog {
  #books;
  constructor(records) { this.#books = new Map(records.map((r) => [r.id, new Book(r)])); }
  get(id) {
    const book = this.#books.get(id);
    if (!book) throw new ValidationError(`unknown book ${id}`);
    return book;
  }
  *[Symbol.iterator]() { yield* this.#books.values(); }
}
