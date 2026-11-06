// The book catalogue.
export class Catalog {
  #books = new Map();

  static fromJson(text) {
    const catalog = new Catalog();
    for (const book of JSON.parse(text)) catalog.add(book);
    return catalog;
  }

  add(book) {
    if (this.#books.has(book.id)) throw new Error(`duplicate book id ${book.id}`);
    this.#books.set(book.id, book);
    return this;
  }

  find(id) {
    return this.#books.get(id);
  }

  search(text) {
    const q = text.toLowerCase();
    return this.all().filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(q));
  }

  all() {
    return [...this.#books.values()];
  }

  get size() {
    return this.#books.size;
  }
}
