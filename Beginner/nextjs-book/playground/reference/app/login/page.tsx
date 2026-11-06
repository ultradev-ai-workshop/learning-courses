"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, {} as LoginState);
  return (
    <form action={action} className="max-w-sm space-y-3">
      <h1 className="text-3xl font-bold">Log in</h1>
      <p><input name="email" type="email" placeholder="Email" className="w-full rounded border px-3 py-1" /></p>
      <p><input name="password" type="password" placeholder="Password" className="w-full rounded border px-3 py-1" /></p>
      {state.error && <p role="alert" className="text-red-600">{state.error}</p>}
      <button disabled={pending} className="rounded bg-brand px-3 py-1 text-white">{pending ? "Logging in…" : "Log in"}</button>
    </form>
  );
}
