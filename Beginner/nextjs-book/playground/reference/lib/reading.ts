import type { Book } from "./types";

export function readingStats(books: Pick<Book, "read">[]) {
  const read = books.filter((b) => b.read).length;
  return {
    total: books.length,
    read,
    toRead: books.length - read,
    percent: books.length ? Math.round((read / books.length) * 100) : 0,
  };
}
