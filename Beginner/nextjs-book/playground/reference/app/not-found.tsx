import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2"><Link href="/" className="text-brand">Back to the home page</Link></p>
    </div>
  );
}
