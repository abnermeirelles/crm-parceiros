import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { updateEventAttendance } from "@/lib/actions";
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
          <Info label="Parceiros convidados" value={String(event.participants.length)} />
          <Info label="Prêmios" value={event.prizes ?? "-"} />
        </div>
        {event.notes ? <p className="mt-4 rounded-md bg-panel p-3 text-sm">{event.notes}</p> : null}
      </section>
      <section className="card mt-5 overflow-x-auto p-5">
        <form action={updateEventAttendance}>
          <input name="eventId" type="hidden" value={event.id} />
        <table>
          <thead>
            <tr>
              <th>Parceiro convidado</th>
              <th>Profissão</th>
              <th>CAT</th>
              <th>Status</th>
              <th>Foi?</th>
            </tr>
          </thead>
          <tbody>
            {event.participants.map((participant) => (
              <tr key={participant.id}>
                <td>
                  <Link className="font-bold text-brand" href={`/parceiros/${participant.partner.id}`}>
                    {participant.partner.fullName}
                  </Link>
                </td>
                <td>{participant.partner.profession?.name ?? "-"}</td>
                <td>{participant.partner.category?.name ?? "-"}</td>
                <td>{participant.partner.status === "ACTIVE" ? "Ativo" : "Inativo"}</td>
                <td>
                  <label className="flex-row items-center gap-2">
                    <input
                      className="w-auto"
                      defaultChecked={participant.attended}
                      name="participantIds"
                      type="checkbox"
                      value={participant.id}
                    />
                    Sim
                  </label>
                </td>
              </tr>
            ))}
            {!event.participants.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={5}>
                  Nenhum parceiro convidado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-primary" type="submit">
            Salvar presenças
          </button>
        </div>
        </form>
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
