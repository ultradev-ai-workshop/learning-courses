import type { NextRequest } from "next/server";
import { searchBooks } from "@/lib/books";

export async function GET(request: NextRequest) {
  const books = await searchBooks(request.nextUrl.searchParams.get("q") ?? "");
  return Response.json(books);
}
