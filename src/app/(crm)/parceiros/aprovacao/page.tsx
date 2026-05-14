import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { approvePartner } from "@/lib/actions";
import { date } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AprovacaoParceirosPage() {
  const partners = await prisma.partner.findMany({
    where: { status: "PENDING_APPROVAL" },
    include: { profession: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Aguardando Aprovação"
        description="Parceiros captados por landing page/webhook aguardando validação."
      />
      <section className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Parceiro</th>
              <th>Contato</th>
              <th>Profissão</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td>
                  <Link className="font-bold text-brand" href={`/parceiros/${partner.id}`}>
                    {partner.fullName}
                  </Link>
                  <p className="text-xs text-muted">{partner.cpf ?? partner.cnpj ?? "Sem documento"}</p>
                </td>
                <td>
                  <p>{partner.phone ?? "-"}</p>
                  <p className="text-xs text-muted">{partner.email ?? "-"}</p>
                </td>
                <td>{partner.profession?.name ?? "-"}</td>
                <td>{date(partner.createdAt)}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link className="btn btn-secondary" href={`/parceiros/${partner.id}/editar`}>
                      Revisar
                    </Link>
                    <form action={approvePartner}>
                      <input name="id" type="hidden" value={partner.id} />
                      <button className="btn btn-primary" type="submit">
                        Aprovar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!partners.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={5}>
                  Nenhum parceiro aguardando aprovação.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
