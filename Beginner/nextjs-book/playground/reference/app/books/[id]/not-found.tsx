import Link from "next/link";

export default function BookNotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold">We don&apos;t have that book</h1>
      <p className="mt-2"><Link href="/books" className="text-brand">Back to all books</Link></p>
    </div>
  );
}
