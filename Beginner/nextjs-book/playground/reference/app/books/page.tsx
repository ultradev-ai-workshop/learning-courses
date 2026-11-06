import type { Metadata } from "next";
import Form from "next/form";
import { Suspense } from "react";
import { searchBooks } from "@/lib/books";
import { BookCard } from "../_components/book-card";

export const metadata: Metadata = {
  title: "Books",
  description: "Every book on the reading list.",
};

async function Results({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const books = await searchBooks(query);
  if (books.length === 0) return <p className="mt-6">No books match “{query}”.</p>;
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {books.map((b) => <BookCard key={b.id} book={b} />)}
    </ul>
  );
}

export default function BooksPage({ searchParams }: PageProps<"/books">) {
  return (
    <>
      <h1 className="text-3xl font-bold">Books</h1>
      <Form action="/books" className="mt-4 flex gap-2">
        <input name="q" placeholder="Search title or author" className="flex-1 rounded border border-zinc-300 px-3 py-1" />
        <button className="rounded bg-brand px-3 py-1 text-white">Search</button>
      </Form>
      <Suspense fallback={<p className="mt-6">Loading books…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}
