import type { MetadataRoute } from "next";
import { getBooks } from "@/lib/books";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://reading-list.example.com";
  const books = await getBooks();
  return [
    { url: base },
    { url: `${base}/books` },
    ...books.map((b) => ({ url: `${base}/books/${b.id}` })),
  ];
}
