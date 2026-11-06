import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal";
import { getBooks } from "@/lib/books";
import { logout } from "../login/actions";
import { deleteBook, toggleRead } from "./actions";
import { AddBookForm } from "./add-book-form";

async function AdminPanel() {
  const user = await getCurrentUser();
  const books = await getBooks();
  return (
    <>
      <div className="mt-2 flex gap-2">
        <span>Signed in as {user.name} ({user.role}).</span>
        <form action={logout}><button className="text-brand underline">Log out</button></form>
      </div>
      {user.role === "admin" && <div className="mt-6"><AddBookForm /></div>}
      <h2 className="mt-8 text-xl font-semibold">{books.length} books</h2>
      <ul className="mt-2 space-y-2">
        {books.map((b) => (
          <li key={b.id} className="flex items-center gap-2">
            <span className="flex-1">{b.title} ({b.year}) {b.read ? "✅" : "📖"}</span>
            {user.role === "admin" && (
              <>
                <form action={toggleRead.bind(null, b.id, !b.read)}>
                  <button className="rounded border px-2 text-sm">{b.read ? "Mark unread" : "Mark read"}</button>
                </form>
                <form action={deleteBook.bind(null, b.id)}>
                  <button className="rounded border px-2 text-sm text-red-600">Delete</button>
                </form>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function AdminPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Admin</h1>
      <Suspense fallback={<p className="mt-2">Checking your session…</p>}>
        <AdminPanel />
      </Suspense>
    </>
  );
}
