"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: searchParams.get("callbackUrl") || "/dashboard",
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push(result?.url || "/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label>
        E-mail
        <input autoComplete="email" name="email" placeholder="admin@empresa.com" required type="email" />
      </label>
      <label>
        Senha
        <input autoComplete="current-password" name="password" placeholder="Sua senha" required type="password" />
      </label>
      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button className="btn btn-primary w-full" disabled={loading} type="submit">
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
