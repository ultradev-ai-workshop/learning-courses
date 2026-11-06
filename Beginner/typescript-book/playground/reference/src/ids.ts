// Branded ids: plain strings at runtime, incompatible types at compile time (Chapter 14).
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type BookId = Brand<string, "BookId">;
export type MemberId = Brand<string, "MemberId">;
export type LoanId = Brand<string, "LoanId">;

function maker<T extends string>(prefix: string, kind: string): (s: string) => T {
  const pattern = new RegExp(`^${prefix}\\d+$`);
  return (s) => {
    if (!pattern.test(s)) throw new TypeError(`invalid ${kind}: ${JSON.stringify(s)}`);
    return s as T;
  };
}

export const BookId = maker<BookId>("b", "book id");
export const MemberId = maker<MemberId>("m", "member id");
export const LoanId = maker<LoanId>("L", "loan id");
