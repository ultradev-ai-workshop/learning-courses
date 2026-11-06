import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Role = "admin" | "reader";
export type Session = { userId: string; role: Role };

const key = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encrypt(session: Session): Promise<string> {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key);
}

export async function decrypt(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return { userId: String(payload.userId), role: payload.role === "admin" ? "admin" : "reader" };
  } catch {
    return null;
  }
}

export async function createSession(session: Session): Promise<void> {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  (await cookies()).set("session", await encrypt(session), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", expires,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete("session");
}
