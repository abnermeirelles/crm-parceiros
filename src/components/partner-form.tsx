import { AttendanceMode, MonthlyAppointmentsRange, PartnerKind, PartnerStatus, ServiceDaysRange, VisitPreference } from "@prisma/client";
import { createPartner, updatePartner } from "@/lib/actions";
import { toInputDate } from "@/lib/format";

export function PartnerForm({
  partner,
  lookups,
}: {
  partner?: any;
  lookups: {
    partnerTypes: any[];
    professions: any[];
    categories: any[];
    consultationValues: any[];
    classValues: any[];
  };
}) {
  const action = partner ? updatePartner : createPartner;
  const selectedHours = partner?.serviceHours ?? [];

  return (
    <form action={action} className="card grid-form p-5">
      {partner ? <input name="id" type="hidden" value={partner.id} /> : null}
      <label className="span-3">
        Tipo de cadastro
        <select name="kind" defaultValue={partner?.kind ?? PartnerKind.PERSON}>
          <option value="PERSON">Pessoa física</option>
          <option value="COMPANY">Empresa</option>
        </select>
      </label>
      <label className="span-3">
        Status
        <select name="status" defaultValue={partner?.status ?? PartnerStatus.ACTIVE}>
          <option value="ACTIVE">Ativo</option>
          <option value="PENDING_APPROVAL">Aguardando aprovação</option>
          <option value="INACTIVE">Inativo</option>
        </select>
      </label>

      <label className="span-4">
        Nome
        <input name="firstName" defaultValue={partner?.firstName ?? ""} />
      </label>
      <label className="span-4">
        Sobrenome
        <input name="lastName" defaultValue={partner?.lastName ?? ""} />
      </label>
      <label className="span-4">
        Nome completo
        <input name="fullName" defaultValue={partner?.fullName ?? ""} required />
      </label>
      <label className="span-6">
        Razão social / Nome da empresa
        <input name="companyName" defaultValue={partner?.companyName ?? ""} />
      </label>
      <label className="span-3">
        CPF
        <input name="cpf" defaultValue={partner?.cpf ?? ""} placeholder="000.000.000-00" />
      </label>
      <label className="span-3">
        CNPJ
        <input name="cnpj" defaultValue={partner?.cnpj ?? ""} placeholder="00.000.000/0000-00" />
      </label>

      <label className="span-3">
        Telefone
        <input name="phone" defaultValue={partner?.phone ?? ""} />
      </label>
      <label className="span-3">
        E-mail
        <input name="email" defaultValue={partner?.email ?? ""} type="email" />
      </label>
      <label className="span-3">
        Data de nascimento
        <input name="birthDate" defaultValue={toInputDate(partner?.birthDate)} type="date" />
      </label>
      <label className="span-3">
        Início da parceria
        <input name="partnershipStart" defaultValue={toInputDate(partner?.partnershipStart)} type="date" />
      </label>

      <label className="span-3">
        Cupom
        <input name="coupon" defaultValue={partner?.coupon ?? ""} />
      </label>
      <label className="span-3">
        Profissão
        <select name="professionId" defaultValue={partner?.professionId ?? ""}>
          <option value="">Selecione</option>
          {lookups.professions.map((profession) => (
            <option key={profession.id} value={profession.id}>
              {profession.name}
            </option>
          ))}
        </select>
      </label>
      <label className="span-3">
        CAT
        <select name="categoryId" defaultValue={partner?.categoryId ?? ""}>
          <option value="">Selecione</option>
          {lookups.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="span-3">
        Foto
        <input accept="image/*" name="photo" type="file" />
      </label>

      <label className="span-4">
        Faixa média do atendimento
        <select name="consultationValueId" defaultValue={partner?.consultationValueId ?? ""}>
          <option value="">Selecione</option>
          {lookups.consultationValues.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="span-4">
        Faixa média Aula/Hr
        <select name="classValueId" defaultValue={partner?.classValueId ?? ""}>
          <option value="">Selecione</option>
          {lookups.classValues.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="span-4">
        Atendimentos/mês
        <select name="monthlyAppointmentsRange" defaultValue={partner?.monthlyAppointmentsRange ?? ""}>
          <option value="">Selecione</option>
          <option value={MonthlyAppointmentsRange.UP_TO_30}>Até 30 Atendimentos</option>
          <option value={MonthlyAppointmentsRange.UP_TO_50}>Até 50 Atendimentos</option>
          <option value={MonthlyAppointmentsRange.ABOVE_50}>+50 Atendimentos</option>
        </select>
      </label>
      <label className="span-4">
        Atendimento
        <select name="attendanceMode" defaultValue={partner?.attendanceMode ?? ""}>
          <option value="">Selecione</option>
          <option value={AttendanceMode.IN_PERSON}>Presencial</option>
          <option value={AttendanceMode.IN_PERSON_ONLINE}>Presencial e Online</option>
          <option value={AttendanceMode.ONLINE}>Online</option>
        </select>
      </label>
      <label className="span-4">
        Dias de atendimento
        <select name="serviceDays" defaultValue={partner?.serviceDays ?? ""}>
          <option value="">Selecione</option>
          <option value={ServiceDaysRange.TWO_DAYS}>2x na semana</option>
          <option value={ServiceDaysRange.THREE_DAYS}>3x na semana</option>
          <option value={ServiceDaysRange.MORE}>Mais</option>
        </select>
      </label>
      <label className="span-4">
        Horários de atendimento
        <select name="serviceHours" defaultValue={selectedHours} multiple>
          <option value="Manhã">Manhã</option>
          <option value="Tarde">Tarde</option>
          <option value="Noite">Noite</option>
          <option value="Manhã e Tarde">Manhã e Tarde</option>
          <option value="Tarde e Noite">Tarde e Noite</option>
          <option value="Horário Flexível">Horário Flexível</option>
        </select>
      </label>
      <label className="span-4">
        Preferência da nossa visita
        <select name="visitPreference" defaultValue={partner?.visitPreference ?? ""}>
          <option value="">Selecione</option>
          <option value={VisitPreference.IN_PERSON}>Presencial</option>
          <option value={VisitPreference.REMOTE}>Remota</option>
        </select>
      </label>
      <label className="span-2">
        Pontos prescrição
        <input name="prescriptionPoints" defaultValue={partner?.prescriptionPoints ?? 0} min="0" type="number" />
      </label>

      <label className="span-4">
        Instagram
        <input name="instagram" defaultValue={partner?.instagram ?? ""} />
      </label>
      <label className="span-4">
        Facebook
        <input name="facebook" defaultValue={partner?.facebook ?? ""} />
      </label>
      <label className="span-4">
        TikTok
        <input name="tiktok" defaultValue={partner?.tiktok ?? ""} />
      </label>

      <label className="span-6">
        Endereço
        <input name="address" defaultValue={partner?.address ?? ""} />
      </label>
      <label className="span-2">
        Número
        <input name="number" defaultValue={partner?.number ?? ""} />
      </label>
      <label className="span-4">
        Complemento
        <input name="complement" defaultValue={partner?.complement ?? ""} />
      </label>
      <label className="span-3">
        CEP
        <input name="zipCode" defaultValue={partner?.zipCode ?? ""} />
      </label>
      <label className="span-3">
        Bairro
        <input name="district" defaultValue={partner?.district ?? ""} />
      </label>
      <label className="span-4">
        Cidade
        <input name="city" defaultValue={partner?.city ?? ""} />
      </label>
      <label className="span-2">
        Estado
        <input maxLength={2} name="state" defaultValue={partner?.state ?? ""} />
      </label>

      <label className="span-12">
        Observações
        <textarea name="notes" defaultValue={partner?.notes ?? ""} />
      </label>

      <div className="span-12 flex justify-end gap-3">
        <button className="btn btn-primary" type="submit">
          {partner ? "Salvar parceiro" : "Cadastrar parceiro"}
        </button>
      </div>
    </form>
  );
}
