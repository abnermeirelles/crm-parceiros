import { createVisit, updateVisit } from "@/lib/actions";
import { toInputDateTime } from "@/lib/format";

export function VisitForm({
  visit,
  partners,
  teamMembers,
}: {
  visit?: any;
  partners: any[];
  teamMembers: any[];
}) {
  const action = visit ? updateVisit : createVisit;
  const selectedMembers = visit?.teamMembers?.map((member: any) => member.id) ?? [];

  return (
    <form action={action} className="card grid-form p-5">
      {visit ? <input name="id" type="hidden" value={visit.id} /> : null}
      <label className="span-6">
        Parceiro
        <select name="partnerId" defaultValue={visit?.partnerId ?? ""} required>
          <option value="">Selecione</option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.fullName} {partner.cpf ? `- ${partner.cpf}` : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="span-3">
        Data e horário
        <input name="visitedAt" defaultValue={toInputDateTime(visit?.visitedAt)} required type="datetime-local" />
      </label>
      <label className="span-3">
        Pessoas na visita
        <select name="teamMemberIds" defaultValue={selectedMembers} multiple>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </label>
      <label className="span-4 flex-row items-center gap-2">
        <input className="w-auto" defaultChecked={visit?.completed ?? false} name="completed" type="checkbox" />
        Visita realizada?
      </label>
      <label className="span-4 flex-row items-center gap-2">
        <input className="w-auto" defaultChecked={visit?.giftReceived ?? false} name="giftReceived" type="checkbox" />
        Recebeu brinde?
      </label>
      <label className="span-4">
        Marcas/produtos do brinde
        <input name="giftDescription" defaultValue={visit?.giftDescription ?? ""} />
      </label>
      <label className="span-12">
        Observações
        <textarea name="notes" defaultValue={visit?.notes ?? ""} />
      </label>
      <div className="span-12 flex justify-end">
        <button className="btn btn-primary" type="submit">
          {visit ? "Salvar visita" : "Cadastrar visita"}
        </button>
      </div>
    </form>
  );
}
