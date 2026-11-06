"use server";

import { updateTag } from "next/cache";
import { verifySession } from "@/lib/dal";
import { insertBook, removeBook, setRead } from "@/lib/books";
import { parseNewBook, type FieldErrors } from "@/lib/validation";

export type AddBookState = { errors?: FieldErrors; message?: string };

async function requireAdmin() {
  const session = await verifySession();             // redirects to /login when logged out
  if (session.role !== "admin") throw new Error("Only admins can change books.");
}

export async function addBook(_prev: AddBookState, formData: FormData): Promise<AddBookState> {
  await requireAdmin();
  const parsed = parseNewBook(formData);
  if (!parsed.ok) return { errors: parsed.errors };
  const book = await insertBook(parsed.data);
  updateTag("books");
  return { message: `Added “${book.title}”.` };
}

export async function deleteBook(id: string) {
  await requireAdmin();
  await removeBook(id);
  updateTag("books");
  updateTag(`book-${id}`);
}

export async function toggleRead(id: string, read: boolean) {
  await requireAdmin();
  await setRead(id, read);
  updateTag("books");
  updateTag(`book-${id}`);
}
