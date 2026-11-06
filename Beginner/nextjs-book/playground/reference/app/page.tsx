import Link from "next/link";
import { getBooks } from "@/lib/books";
import { readingStats } from "@/lib/reading";
import { BookCard } from "./_components/book-card";

export default async function Home() {
  const books = await getBooks();
  const stats = readingStats(books);
  const recent = books.toSorted((a, b) => Number(b.id) - Number(a.id)).slice(0, 3);
  return (
    <>
      <h1 className="text-3xl font-bold">Your reading</h1>
      <p className="mt-2">
        {stats.read} of {stats.total} books read ({stats.percent}%). {stats.toRead} to go.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Recently added</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {recent.map((b) => <BookCard key={b.id} book={b} />)}
      </ul>
      <p className="mt-6"><Link href="/books" className="text-brand">All books →</Link></p>
    </>
  );
}
