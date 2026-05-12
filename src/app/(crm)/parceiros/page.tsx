import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { date } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ParceirosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const [partnerTypes, partners] = await Promise.all([
    prisma.partnerType.findMany({ orderBy: { name: "asc" } }),
    prisma.partner.findMany({
      where: {
        ...(params.q
          ? {
              OR: [
                { fullName: { contains: params.q, mode: "insensitive" } },
                { email: { contains: params.q, mode: "insensitive" } },
                { phone: { contains: params.q, mode: "insensitive" } },
                { coupon: { contains: params.q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(params.status ? { status: params.status as any } : {}),
        ...(params.type ? { partnerTypes: { some: { id: params.type } } } : {}),
      },
      include: {
        category: true,
        profession: true,
        partnerTypes: true,
      },
      orderBy: { fullName: "asc" },
    }),
  ]);

  return (
    <>
      <PageHeader
        actionHref="/parceiros/novo"
        actionLabel="Novo parceiro"
        description="Cadastro central de pessoas físicas e empresas parceiras."
        title="Parceiros"
      />
      <section className="card mb-5 p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_180px_220px_auto]">
          <input defaultValue={params.q ?? ""} name="q" placeholder="Buscar por nome, e-mail, telefone ou cupom" />
          <select defaultValue={params.status ?? ""} name="status">
            <option value="">Todos os status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
          <select defaultValue={params.type ?? ""} name="type">
            <option value="">Todos os tipos</option>
            {partnerTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">
            Filtrar
          </button>
        </form>
      </section>
      <section className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Parceiro</th>
              <th>Tipo</th>
              <th>Profissão</th>
              <th>CAT</th>
              <th>Status</th>
              <th>Início</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td>
                  <Link className="font-bold text-brand" href={`/parceiros/${partner.id}`}>
                    {partner.fullName}
                  </Link>
                  <p className="text-xs text-muted">{partner.email ?? partner.phone ?? "Sem contato"}</p>
                </td>
                <td>{partner.partnerTypes.map((type) => type.name).join(", ") || "-"}</td>
                <td>{partner.profession?.name ?? "-"}</td>
                <td>{partner.category?.name ?? "-"}</td>
                <td>
                  <span className="badge">{partner.status === "ACTIVE" ? "Ativo" : "Inativo"}</span>
                </td>
                <td>{date(partner.partnershipStart)}</td>
              </tr>
            ))}
            {!partners.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={6}>
                  Nenhum parceiro encontrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
