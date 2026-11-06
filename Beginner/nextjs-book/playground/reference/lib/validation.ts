import { z } from "zod";

export const GENRES = ["fantasy", "sci-fi", "literary", "history", "other"] as const;

export const NewBookSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required." }).max(200),
  author: z.string().trim().min(1, { error: "Author is required." }).max(200),
  year: z.coerce.number().int({ error: "Year must be a whole number." })
    .min(1450, { error: "Year must be between 1450 and 2100." })
    .max(2100, { error: "Year must be between 1450 and 2100." }),
  genre: z.enum(GENRES, { error: "Pick a genre." }),
});

export type FieldErrors = Partial<Record<"title" | "author" | "year" | "genre", string[]>>;

export function parseNewBook(formData: FormData) {
  const result = NewBookSchema.safeParse(Object.fromEntries(formData));
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, errors: z.flattenError(result.error).fieldErrors as FieldErrors };
}
