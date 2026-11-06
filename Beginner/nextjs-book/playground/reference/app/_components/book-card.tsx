import Link from "next/link";
import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  return (
    <li className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <Link href={`/books/${book.id}`} className="font-semibold text-brand">{book.title}</Link>
      <p className="text-sm text-zinc-500">{book.author} · {book.year} · {book.read ? "✅ read" : "📖 to read"}</p>
    </li>
  );
}
