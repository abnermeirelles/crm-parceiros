import { PageHeader } from "@/components/page-header";
import { createUser, deleteUser, updateUser } from "@/lib/actions";
import { dateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader description="Usuários internos autorizados a acessar o CRM." title="Usuários" />

      <section className="card p-5">
        <h2 className="text-lg font-bold text-ink">Novo usuário</h2>
        <form action={createUser} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <label>
            Nome
            <input name="name" required />
          </label>
          <label>
            E-mail
            <input name="email" required type="email" />
          </label>
          <label>
            Senha
            <input minLength={8} name="password" required type="password" />
          </label>
          <div className="flex items-end">
            <button className="btn btn-primary w-full" type="submit">
              Adicionar
            </button>
          </div>
        </form>
      </section>

      <section className="card mt-5 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Nova senha</th>
              <th>Atualizado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td colSpan={5}>
                  <form action={updateUser} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_150px_auto_auto]">
                    <input name="id" type="hidden" value={user.id} />
                    <input aria-label="Nome" name="name" defaultValue={user.name ?? ""} required />
                    <input aria-label="E-mail" name="email" defaultValue={user.email} required type="email" />
                    <input
                      aria-label="Nova senha"
                      minLength={8}
                      name="password"
                      placeholder="Manter senha"
                      type="password"
                    />
                    <p className="self-center text-sm text-muted">{dateTime(user.updatedAt)}</p>
                    <button className="btn btn-secondary" type="submit">
                      Salvar
                    </button>
                    <button className="btn btn-danger" formAction={deleteUser} type="submit">
                      Excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!users.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={5}>
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
