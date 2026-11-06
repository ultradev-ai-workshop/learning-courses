import { getBook } from "@/lib/books";

export async function GET(_request: Request, ctx: RouteContext<"/api/books/[id]">) {
  const book = await getBook((await ctx.params).id);
  if (!book) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json(book);
}
