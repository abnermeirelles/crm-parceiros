import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { createPartnerAward, createVisit } from "@/lib/actions";
import { date, dateTime, money } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function ParceiroDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [partner, teamMembers, awardCatalogs] = await Promise.all([
    prisma.partner.findUnique({
      where: { id },
      include: {
        category: true,
        profession: true,
        consultationValue: true,
        classValue: true,
        partnerTypes: true,
        eventParticipations: {
          include: { event: { include: { eventType: true } } },
          orderBy: { event: { date: "desc" } },
        },
        visits: { include: { teamMembers: true }, orderBy: { visitedAt: "desc" } },
        awards: { include: { awardCatalog: true }, orderBy: { awardedAt: "desc" } },
      },
    }),
    prisma.relationshipTeamMember.findMany({ orderBy: { name: "asc" } }),
    prisma.awardCatalog.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!partner) notFound();

  return (
    <>
      <PageHeader
        actionHref={`/parceiros/${partner.id}/editar`}
        actionLabel="Editar parceiro"
        description={partner.partnerTypes.map((type) => type.name).join(", ") || "Sem tipo vinculado"}
        title={partner.fullName}
      />

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="card h-fit p-5">
          {partner.photoKey ? (
            <img
              alt={partner.fullName}
              className="mb-4 aspect-square w-full rounded-md object-cover"
              src={`/api/files/partner-photo?key=${encodeURIComponent(partner.photoKey)}`}
            />
          ) : (
            <div className="mb-4 grid aspect-square w-full place-items-center rounded-md bg-panel text-sm font-semibold text-muted">
              Sem foto
            </div>
          )}
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-bold text-muted">Status</dt>
              <dd>{partner.status === "ACTIVE" ? "Ativo" : "Inativo"}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted">Contato</dt>
              <dd>{partner.phone ?? "-"}</dd>
              <dd>{partner.email ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted">Profissão / CAT</dt>
              <dd>{partner.profession?.name ?? "-"} / {partner.category?.name ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted">Valores</dt>
              <dd>Consulta: {partner.consultationValue?.label ?? "-"}</dd>
              <dd>Aula: {partner.classValue?.label ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted">Prescrição</dt>
              <dd>{partner.prescriptionPoints} pontos</dd>
            </div>
            <div>
              <dt className="font-bold text-muted">Endereço</dt>
              <dd>
                {[partner.address, partner.number, partner.district, partner.city, partner.state]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="grid gap-5">
          <section className="card p-5">
            <h2 className="text-lg font-bold text-ink">Dados gerais</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Info label="CPF" value={partner.cpf} />
              <Info label="CNPJ" value={partner.cnpj} />
              <Info label="Nascimento" value={date(partner.birthDate)} />
              <Info label="Cupom" value={partner.coupon} />
              <Info label="Início da parceria" value={date(partner.partnershipStart)} />
              <Info label="Atendimentos/mês" value={partner.monthlyAppointments?.toString()} />
              <Info label="Instagram" value={partner.instagram} />
              <Info label="Facebook" value={partner.facebook} />
              <Info label="TikTok" value={partner.tiktok} />
            </div>
            {partner.notes ? <p className="mt-4 rounded-md bg-panel p-3 text-sm text-ink">{partner.notes}</p> : null}
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-ink">Eventos participados</h2>
            <div className="mt-3 overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Investimento</th>
                    <th>Prêmios</th>
                  </tr>
                </thead>
                <tbody>
                  {partner.eventParticipations.map(({ event }) => (
                    <tr key={event.id}>
                      <td>
                        <Link className="font-bold text-brand" href={`/eventos/${event.id}`}>
                          {event.title}
                        </Link>
                      </td>
                      <td>{date(event.date)}</td>
                      <td>{event.eventType.name}</td>
                      <td>{money(event.investment)}</td>
                      <td>{event.prizes ?? "-"}</td>
                    </tr>
                  ))}
                  {!partner.eventParticipations.length ? (
                    <tr>
                      <td className="text-sm text-muted" colSpan={5}>
                        Nenhum evento vinculado.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-ink">Visitas recebidas</h2>
            <form action={createVisit} className="mt-4 grid-form">
              <input name="partnerId" type="hidden" value={partner.id} />
              <label className="span-4">
                Data e horário
                <input name="visitedAt" required type="datetime-local" />
              </label>
              <label className="span-4">
                Pessoas na visita
                <select name="teamMemberIds" multiple>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="span-4">
                Marcas/produtos do brinde
                <input name="giftDescription" />
              </label>
              <label className="span-12 flex-row items-center gap-2">
                <input className="w-auto" name="giftReceived" type="checkbox" />
                Recebeu brinde?
              </label>
              <label className="span-12">
                Observações
                <textarea name="notes" />
              </label>
              <div className="span-12 flex justify-end">
                <button className="btn btn-primary" type="submit">
                  Registrar visita
                </button>
              </div>
            </form>
            <HistoryTable
              empty="Nenhuma visita registrada."
              rows={partner.visits.map((visit) => [
                dateTime(visit.visitedAt),
                visit.teamMembers.map((member) => member.name).join(", ") || "-",
                visit.giftReceived ? "Sim" : "Não",
                visit.giftDescription ?? "-",
              ])}
              headers={["Data", "Equipe", "Brinde", "Produtos/marcas"]}
            />
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-ink">Premiações recebidas</h2>
            <form action={createPartnerAward} className="mt-4 grid-form">
              <input name="partnerId" type="hidden" value={partner.id} />
              <label className="span-4">
                Premiação
                <select name="awardCatalogId" required>
                  <option value="">Selecione</option>
                  {awardCatalogs.map((award) => (
                    <option key={award.id} value={award.id}>
                      {award.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="span-4">
                Data
                <input name="awardedAt" required type="date" />
              </label>
              <label className="span-4">
                Observação
                <input name="notes" />
              </label>
              <div className="span-12 flex justify-end">
                <button className="btn btn-primary" type="submit">
                  Registrar premiação
                </button>
              </div>
            </form>
            <HistoryTable
              empty="Nenhuma premiação registrada."
              rows={partner.awards.map((award) => [date(award.awardedAt), award.awardCatalog.name, award.notes ?? "-"])}
              headers={["Data", "Premiação", "Observação"]}
            />
          </section>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm text-ink">{value || "-"}</p>
    </div>
  );
}

function HistoryTable({ headers, rows, empty }: { headers: string[]; rows: string[][]; empty: string }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
          {!rows.length ? (
            <tr>
              <td className="text-sm text-muted" colSpan={headers.length}>
                {empty}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
