// The book catalogue: validation of untrusted JSON (Chapter 4) and a class with private state (Chapter 7).
import { BookId } from "./ids.js";
import { FORMATS, type Book, type Format } from "./types.js";

const isFormat = (v: unknown): v is Format => (FORMATS as readonly unknown[]).includes(v);

/** Checks one raw value from JSON and returns a Book, or throws with the reason. */
export function parseBook(raw: unknown): Book {
  if (typeof raw !== "object" || raw === null) throw new TypeError("book must be an object");
  const r = raw as Record<string, unknown>;
  for (const key of ["id", "title", "author"] as const) {
    if (typeof r[key] !== "string") throw new TypeError(`book.${key} must be a string`);
  }
  if (typeof r.year !== "number" || typeof r.copies !== "number") throw new TypeError("book.year and book.copies must be numbers");
  if (!isFormat(r.format)) throw new TypeError(`unknown format: ${String(r.format)}`);
  return { id: BookId(r.id as string), title: r.title as string, author: r.author as string, year: r.year, format: r.format, copies: r.copies };
}

export class Catalog {
  readonly #books = new Map<BookId, Book>();

  static fromJson(text: string): Catalog {
    const data: unknown = JSON.parse(text);
    if (!Array.isArray(data)) throw new TypeError("catalogue must be an array");
    const catalog = new Catalog();
    for (const raw of data) catalog.add(parseBook(raw));
    return catalog;
  }

  add(book: Book): this {
    if (this.#books.has(book.id)) throw new Error(`duplicate book id ${book.id}`);
    this.#books.set(book.id, book);
    return this;
  }

  find(id: BookId): Book | undefined {
    return this.#books.get(id);
  }

  search(text: string): Book[] {
    const q = text.toLowerCase();
    return this.all().filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(q));
  }

  all(): Book[] {
    return [...this.#books.values()];
  }

  get size(): number {
    return this.#books.size;
  }
}
