import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Role } from "./session";

type User = { id: string; email: string; name: string; role: Role; passwordHash: string };

function hash(password: string, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
}

// Demo users. A real app stores users (and hashes) in a database.
const users: User[] = [
  { id: "u1", email: "ada@example.com", name: "Ada", role: "admin", passwordHash: hash("correct horse") },
  { id: "u2", email: "ben@example.com", name: "Ben", role: "reader", passwordHash: hash("battery staple") },
];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email === email.trim().toLowerCase());
}

export function findUserById(id: string) {
  return users.find((u) => u.id === id);
}

export function checkPassword(user: User, password: string): boolean {
  const [salt, expected] = user.passwordHash.split(":");
  return timingSafeEqual(scryptSync(password, salt, 32), Buffer.from(expected, "hex"));
}
