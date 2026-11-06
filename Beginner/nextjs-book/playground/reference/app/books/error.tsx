"use client";

export default function BooksError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div role="alert">
      <h2 className="text-xl font-semibold">Couldn&apos;t load books</h2>
      <button onClick={() => retry()} className="mt-2 rounded border px-3 py-1">Try again</button>
    </div>
  );
}
