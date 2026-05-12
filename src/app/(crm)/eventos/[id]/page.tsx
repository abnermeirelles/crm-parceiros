import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { date, money } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function EventoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      eventType: true,
      participants: {
        include: { partner: { include: { profession: true, category: true } } },
        orderBy: { partner: { fullName: "asc" } },
      },
    },
  });

  if (!event) notFound();

  return (
    <>
      <PageHeader description={`${event.eventType.name} · ${date(event.date)}`} title={event.title} />
      <section className="card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Info label="Investimento" value={money(event.investment)} />
          <Info label="Total de participantes" value={String(event.totalParticipants)} />
          <Info label="Parceiros vinculados" value={String(event.participants.length)} />
          <Info label="Prêmios" value={event.prizes ?? "-"} />
        </div>
        {event.notes ? <p className="mt-4 rounded-md bg-panel p-3 text-sm">{event.notes}</p> : null}
      </section>
      <section className="card mt-5 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Parceiro</th>
              <th>Profissão</th>
              <th>CAT</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {event.participants.map(({ partner }) => (
              <tr key={partner.id}>
                <td>
                  <Link className="font-bold text-brand" href={`/parceiros/${partner.id}`}>
                    {partner.fullName}
                  </Link>
                </td>
                <td>{partner.profession?.name ?? "-"}</td>
                <td>{partner.category?.name ?? "-"}</td>
                <td>{partner.status === "ACTIVE" ? "Ativo" : "Inativo"}</td>
              </tr>
            ))}
            {!event.participants.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={4}>
                  Nenhum parceiro vinculado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm text-ink">{value}</p>
    </div>
  );
}
