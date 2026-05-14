import { EventGuestPicker } from "@/components/event-guest-picker";
import { PageHeader } from "@/components/page-header";
import { createEvent } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function NovoEventoPage() {
  const [eventTypes, partners] = await Promise.all([
    prisma.eventType.findMany({ orderBy: { name: "asc" } }),
    prisma.partner.findMany({ orderBy: { fullName: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="Novo evento" description="Crie o evento e vincule os parceiros participantes." />
      <form action={createEvent} className="card grid-form p-5">
        <label className="span-6">
          Nome do evento
          <input name="title" required />
        </label>
        <label className="span-3">
          Data
          <input name="date" required type="date" />
        </label>
        <label className="span-3">
          Tipo de evento
          <select name="eventTypeId" required>
            <option value="">Selecione</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
        <label className="span-3">
          Investimento
          <input min="0" name="investment" step="0.01" type="number" />
        </label>
        <label className="span-3">
          Total de participantes
          <input min="0" name="totalParticipants" type="number" />
        </label>
        <label className="span-6">
          Prêmios
          <input name="prizes" />
        </label>
        <EventGuestPicker partners={partners} />
        <label className="span-12">
          Observações
          <textarea name="notes" />
        </label>
        <div className="span-12 flex justify-end">
          <button className="btn btn-primary" type="submit">
            Criar evento
          </button>
        </div>
      </form>
    </>
  );
}
