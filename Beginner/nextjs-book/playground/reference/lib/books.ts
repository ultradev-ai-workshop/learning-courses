import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import type { Book, NewBook } from "./types";

const FILE = join(process.cwd(), "data", "books.json");

async function load(): Promise<Book[]> {
  return JSON.parse(await readFile(FILE, "utf8"));
}

async function save(books: Book[]): Promise<void> {
  await writeFile(FILE, JSON.stringify(books, null, 2) + "\n");
}

// ---------- reads: cached, refreshed with tags (Chapters 8–9) ----------
export async function getBooks(): Promise<Book[]> {
  "use cache";
  cacheLife("max");
  cacheTag("books");
  return load();
}

export async function getBook(id: string): Promise<Book | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag("books", `book-${id}`);
  return (await load()).find((b) => b.id === id);
}

export async function searchBooks(query: string): Promise<Book[]> {
  const term = query.trim().toLowerCase();
  const books = await getBooks();
  if (!term) return books;
  return books.filter((b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term));
}

// ---------- writes: straight to the file; callers revalidate ----------
export async function insertBook(input: NewBook): Promise<Book> {
  const books = await load();
  const id = String(Math.max(0, ...books.map((b) => Number(b.id))) + 1);
  const book: Book = { ...input, id, read: false };
  await save([...books, book]);
  return book;
}

export async function removeBook(id: string): Promise<boolean> {
  const books = await load();
  const next = books.filter((b) => b.id !== id);
  await save(next);
  return next.length !== books.length;
}

export async function setRead(id: string, read: boolean): Promise<void> {
  const books = await load();
  await save(books.map((b) => (b.id === id ? { ...b, read } : b)));
}
