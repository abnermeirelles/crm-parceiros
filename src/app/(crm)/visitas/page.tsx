import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { dateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function VisitasPage() {
  const visits = await prisma.visit.findMany({
    include: {
      partner: true,
      teamMembers: true,
    },
    orderBy: { visitedAt: "desc" },
  });

  return (
    <>
      <PageHeader
        actionHref="/visitas/nova"
        actionLabel="Nova visita"
        title="Visitas recebidas"
        description="Histórico geral das visitas da equipe de relacionamento."
      />
      <section className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Data e horário</th>
              <th>Parceiro</th>
              <th>Equipe</th>
              <th>Status</th>
              <th>Brinde</th>
              <th>Produtos/marcas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td>{dateTime(visit.visitedAt)}</td>
                <td>
                  <Link className="font-bold text-brand" href={`/parceiros/${visit.partnerId}`}>
                    {visit.partner.fullName}
                  </Link>
                </td>
                <td>{visit.teamMembers.map((member) => member.name).join(", ") || "-"}</td>
                <td>{visit.completed ? "Realizada" : "Não realizada"}</td>
                <td>{visit.giftReceived ? "Sim" : "Não"}</td>
                <td>{visit.giftDescription ?? "-"}</td>
                <td>
                  <Link className="btn btn-secondary" href={`/visitas/${visit.id}/editar`}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {!visits.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={7}>
                  Nenhuma visita registrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
