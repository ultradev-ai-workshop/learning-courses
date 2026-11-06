export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  read: boolean;
};

export type NewBook = Omit<Book, "id" | "read">;
