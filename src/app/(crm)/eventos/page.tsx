import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { date, money } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function EventosPage() {
  const events = await prisma.event.findMany({
    include: {
      eventType: true,
      participants: true,
    },
    orderBy: { date: "desc" },
  });

  return (
    <>
      <PageHeader
        actionHref="/eventos/novo"
        actionLabel="Novo evento"
        description="Controle de eventos e parceiros participantes."
        title="Eventos"
      />
      <section className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Investimento</th>
              <th>Participantes</th>
              <th>Prêmios</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <Link className="font-bold text-brand" href={`/eventos/${event.id}`}>
                    {event.title}
                  </Link>
                </td>
                <td>{date(event.date)}</td>
                <td>{event.eventType.name}</td>
                <td>{money(event.investment)}</td>
                <td>
                  {event.participants.length} vinculados / {event.totalParticipants} total
                </td>
                <td>{event.prizes ?? "-"}</td>
              </tr>
            ))}
            {!events.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={6}>
                  Nenhum evento cadastrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
