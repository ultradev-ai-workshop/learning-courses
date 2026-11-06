import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";
import { findUserById } from "./users";

export const verifySession = cache(async () => {
  const session = await decrypt((await cookies()).get("session")?.value);
  if (!session) redirect("/login");
  return session;
});

/** The current user as a DTO: only fields the UI may see. */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  const user = findUserById(session.userId);
  if (!user) redirect("/login");
  return { name: user.name, role: user.role };
});
