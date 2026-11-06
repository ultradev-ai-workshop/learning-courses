import { ImageResponse } from "next/og";
import { getBook, getBooks } from "@/lib/books";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Reading List book card";

export async function generateStaticParams() {
  return (await getBooks()).map((b) => ({ id: b.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const book = await getBook((await params).id);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: 80, background: "#0a5fc4", color: "white" }}>
        <div style={{ fontSize: 40 }}>📚 Reading List</div>
        <div style={{ fontSize: 96, fontWeight: 700 }}>{book?.title ?? "Unknown book"}</div>
        <div style={{ fontSize: 48 }}>{book ? `by ${book.author}` : ""}</div>
      </div>
    ),
    size,
  );
}
