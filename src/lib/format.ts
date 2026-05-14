export function money(value: unknown) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function date(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

export function dateTime(value: Date | string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toInputDate(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function toInputDateTime(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export function partnerStatusLabel(value: string) {
  const labels: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    PENDING_APPROVAL: "Aguardando aprovação",
  };
  return labels[value] ?? value;
}

export function optionLabel(value?: string | null) {
  if (!value) return "-";
  const labels: Record<string, string> = {
    IN_PERSON: "Presencial",
    IN_PERSON_ONLINE: "Presencial e Online",
    ONLINE: "Online",
    UP_TO_30: "Até 30 Atendimentos",
    UP_TO_50: "Até 50 Atendimentos",
    ABOVE_50: "+50 Atendimentos",
    TWO_DAYS: "2x na semana",
    THREE_DAYS: "3x na semana",
    MORE: "Mais",
    REMOTE: "Remota",
    CD: "CD",
    OFFICE: "Escritório",
    STORE: "Loja",
  };
  return labels[value] ?? value;
}
