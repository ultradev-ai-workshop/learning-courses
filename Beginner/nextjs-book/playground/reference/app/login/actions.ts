"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { checkPassword, findUserByEmail } from "@/lib/users";

const LoginForm = z.object({
  email: z.email({ error: "Enter a valid email." }),
  password: z.string().min(1, { error: "Enter your password." }),
});

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginForm.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const user = findUserByEmail(parsed.data.email);
  if (!user || !checkPassword(user, parsed.data.password)) return { error: "Wrong email or password." };
  await createSession({ userId: user.id, role: user.role });
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
