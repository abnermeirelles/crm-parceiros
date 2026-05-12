import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { date } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function PremiacoesPage() {
  const awards = await prisma.partnerAward.findMany({
    include: {
      partner: true,
      awardCatalog: true,
    },
    orderBy: { awardedAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Premiações" description="Histórico geral das premiações recebidas pelos parceiros." />
      <section className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Parceiro</th>
              <th>Premiação</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {awards.map((award) => (
              <tr key={award.id}>
                <td>{date(award.awardedAt)}</td>
                <td>
                  <Link className="font-bold text-brand" href={`/parceiros/${award.partnerId}`}>
                    {award.partner.fullName}
                  </Link>
                </td>
                <td>{award.awardCatalog.name}</td>
                <td>{award.notes ?? "-"}</td>
              </tr>
            ))}
            {!awards.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={4}>
                  Nenhuma premiação registrada.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
