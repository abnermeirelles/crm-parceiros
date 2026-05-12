import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="card w-full max-w-md p-8">
        <p className="text-sm font-bold text-brand">CRM de Parceiros</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Acesse sua conta</h1>
        <p className="mb-6 mt-2 text-sm text-muted">Controle de parceiros, eventos, visitas e premiações.</p>
        <LoginForm />
        <p className="mt-5 rounded-md bg-panel p-3 text-xs text-muted">
          Primeiro acesso pelo seed: admin@empresa.com / admin123.
        </p>
      </section>
    </main>
  );
}
