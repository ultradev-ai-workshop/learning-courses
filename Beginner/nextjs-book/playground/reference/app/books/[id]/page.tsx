import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook, getBooks } from "@/lib/books";

export async function generateStaticParams() {
  return (await getBooks()).map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: PageProps<"/books/[id]">): Promise<Metadata> {
  const book = await getBook((await params).id);
  if (!book) return { title: "Book not found" };
  return {
    title: book.title,
    description: `${book.title} by ${book.author} (${book.year})`,
    openGraph: { title: `${book.title} by ${book.author}`, type: "book" },
  };
}

export default async function BookPage({ params }: PageProps<"/books/[id]">) {
  const book = await getBook((await params).id);
  if (!book) notFound();
  return (
    <article>
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="mt-2 text-lg">by {book.author}, {book.year}</p>
      <p className="mt-2">Genre: {book.genre} · {book.read ? "✅ You've read this" : "📖 On your list"}</p>
      <p className="mt-6"><Link href="/books" className="text-brand">← All books</Link></p>
    </article>
  );
}
