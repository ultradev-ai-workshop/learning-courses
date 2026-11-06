"use client";

import { useActionState } from "react";
import { addBook, type AddBookState } from "./actions";
import { GENRES } from "@/lib/validation";

export function AddBookForm() {
  const [state, action, pending] = useActionState(addBook, {} as AddBookState);
  const error = (field: keyof NonNullable<AddBookState["errors"]>) =>
    state.errors?.[field]?.[0] && <span role="alert" className="text-sm text-red-600"> {state.errors[field]![0]}</span>;
  return (
    <form action={action} className="space-y-2 rounded-lg border p-4">
      <h2 className="text-xl font-semibold">Add a book</h2>
      <p><input name="title" placeholder="Title" className="rounded border px-2 py-1" />{error("title")}</p>
      <p><input name="author" placeholder="Author" className="rounded border px-2 py-1" />{error("author")}</p>
      <p><input name="year" placeholder="Year" className="rounded border px-2 py-1" />{error("year")}</p>
      <p>
        <select name="genre" defaultValue="other" className="rounded border px-2 py-1">
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        {error("genre")}
      </p>
      <button type="submit" disabled={pending} className="rounded bg-brand px-3 py-1 text-white">{pending ? "Adding…" : "Add book"}</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
