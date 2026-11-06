import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

// Optimistic check only: the real checks are in lib/dal.ts and app/admin/actions.ts.
export async function proxy(request: NextRequest) {
  const session = await decrypt(request.cookies.get("session")?.value);
  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
