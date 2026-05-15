"use server";

import {
  AttendanceMode,
  MonthlyAppointmentsRange,
  PartnerKind,
  PartnerStatus,
  PracticeArea,
  ServiceDaysRange,
  ServiceValueKind,
  StockLocation,
  VisitPreference,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadPartnerPhoto } from "@/lib/s3";

type LookupEntity =
  | "partnerType"
  | "profession"
  | "category"
  | "eventType"
  | "teamMember"
  | "awardCatalog";

const entityMap = {
  partnerType: prisma.partnerType,
  profession: prisma.profession,
  category: prisma.category,
  eventType: prisma.eventType,
  teamMember: prisma.relationshipTeamMember,
  awardCatalog: prisma.awardCatalog,
} as const;

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function required(formData: FormData, key: string, label: string) {
  const value = str(formData, key);
  if (!value) throw new Error(`${label} é obrigatório.`);
  return value;
}

function intValue(formData: FormData, key: string) {
  const value = str(formData, key);
  if (!value) return null;
  return Number.parseInt(value, 10);
}

function decimalValue(formData: FormData, key: string) {
  const value = str(formData, key);
  if (!value) return 0;
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function dateValue(formData: FormData, key: string) {
  const value = str(formData, key);
  return value ? new Date(value) : null;
}

function ids(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && Boolean(value));
}

function enumValue<T extends string>(formData: FormData, key: string) {
  return str(formData, key) as T | null;
}

function lookupEntity(formData: FormData) {
  const entity = required(formData, "entity", "Entidade") as LookupEntity;
  if (!(entity in entityMap)) {
    throw new Error("Cadastro auxiliar inválido.");
  }
  return entity;
}

export async function createLookup(formData: FormData) {
  const entity = lookupEntity(formData);
  const name = required(formData, "name", "Nome");
  const role = str(formData, "role");
  const model = entityMap[entity] as any;

  await model.create({
    data:
      entity === "teamMember"
        ? {
            name,
            role,
          }
        : {
            name,
          },
  });

  revalidatePath("/cadastros");
}

export async function updateLookup(formData: FormData) {
  const entity = lookupEntity(formData);
  const id = required(formData, "id", "ID");
  const name = required(formData, "name", "Nome");
  const role = str(formData, "role");
  const model = entityMap[entity] as any;

  await model.update({
    where: { id },
    data:
      entity === "teamMember"
        ? {
            name,
            role,
          }
        : {
            name,
          },
  });

  revalidatePath("/cadastros");
}

export async function deleteLookup(formData: FormData) {
  const entity = lookupEntity(formData);
  const id = required(formData, "id", "ID");
  const model = entityMap[entity] as any;

  await model.delete({ where: { id } });
  revalidatePath("/cadastros");
}

export async function createServiceValue(formData: FormData) {
  await prisma.serviceValue.create({
    data: {
      label: required(formData, "label", "Rótulo"),
      amount: decimalValue(formData, "amount"),
      kind: required(formData, "kind", "Tipo") as ServiceValueKind,
      professionId: str(formData, "professionId"),
    },
  });

  revalidatePath("/cadastros");
}

export async function updateServiceValue(formData: FormData) {
  await prisma.serviceValue.update({
    where: { id: required(formData, "id", "ID") },
    data: {
      label: required(formData, "label", "Rótulo"),
      amount: decimalValue(formData, "amount"),
      kind: required(formData, "kind", "Tipo") as ServiceValueKind,
      professionId: str(formData, "professionId"),
    },
  });

  revalidatePath("/cadastros");
}

export async function deleteServiceValue(formData: FormData) {
  await prisma.serviceValue.delete({
    where: { id: required(formData, "id", "ID") },
  });
  revalidatePath("/cadastros");
}

function partnerData(formData: FormData, photo?: Awaited<ReturnType<typeof uploadPartnerPhoto>>) {
  const kind = (str(formData, "kind") ?? PartnerKind.PERSON) as PartnerKind;
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const companyName = str(formData, "companyName");
  const fullName =
    kind === PartnerKind.COMPANY
      ? companyName || required(formData, "fullName", "Nome completo")
      : str(formData, "fullName") || [firstName, lastName].filter(Boolean).join(" ");

  if (!fullName) throw new Error("Nome completo é obrigatório.");

  return {
    kind,
    firstName,
    lastName,
    fullName,
    companyName,
    cpf: str(formData, "cpf"),
    cnpj: str(formData, "cnpj"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    birthDate: dateValue(formData, "birthDate"),
    coupon: str(formData, "coupon"),
    partnershipStart: dateValue(formData, "partnershipStart"),
    instagram: str(formData, "instagram"),
    facebook: str(formData, "facebook"),
    tiktok: str(formData, "tiktok"),
    address: str(formData, "address"),
    number: str(formData, "number"),
    complement: str(formData, "complement"),
    zipCode: str(formData, "zipCode"),
    district: str(formData, "district"),
    city: str(formData, "city"),
    state: str(formData, "state"),
    monthlyAppointments: intValue(formData, "monthlyAppointments"),
    monthlyAppointmentsRange: enumValue<MonthlyAppointmentsRange>(formData, "monthlyAppointmentsRange"),
    attendanceMode: enumValue<AttendanceMode>(formData, "attendanceMode"),
    serviceDays: enumValue<ServiceDaysRange>(formData, "serviceDays"),
    serviceHours: ids(formData, "serviceHours"),
    visitPreference: enumValue<VisitPreference>(formData, "visitPreference"),
    practiceArea: enumValue<PracticeArea>(formData, "practiceArea"),
    prescriptionPoints: intValue(formData, "prescriptionPoints") ?? 0,
    status: (str(formData, "status") ?? PartnerStatus.ACTIVE) as PartnerStatus,
    notes: str(formData, "notes"),
    professionId: str(formData, "professionId"),
    categoryId: str(formData, "categoryId"),
    consultationValueId: str(formData, "consultationValueId"),
    classValueId: str(formData, "classValueId"),
    ...(photo ? { photoKey: photo.key, photoUrl: photo.url } : {}),
  };
}

async function photoFromForm(formData: FormData) {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    return uploadPartnerPhoto(file);
  }
  return null;
}

export async function createPartner(formData: FormData) {
  const photo = await photoFromForm(formData);
  const partner = await prisma.partner.create({
    data: {
      ...partnerData(formData, photo),
    },
  });

  revalidatePath("/parceiros");
  redirect(`/parceiros/${partner.id}`);
}

export async function updatePartner(formData: FormData) {
  const id = required(formData, "id", "ID");
  const photo = await photoFromForm(formData);
  await prisma.partner.update({
    where: { id },
    data: {
      ...partnerData(formData, photo),
    },
  });

  revalidatePath("/parceiros");
  revalidatePath(`/parceiros/${id}`);
  redirect(`/parceiros/${id}`);
}

export async function createEvent(formData: FormData) {
  const event = await prisma.event.create({
    data: {
      title: required(formData, "title", "Título"),
      date: dateValue(formData, "date") ?? new Date(),
      eventTypeId: required(formData, "eventTypeId", "Tipo de evento"),
      investment: decimalValue(formData, "investment"),
      totalParticipants: intValue(formData, "totalParticipants") ?? 0,
      prizes: str(formData, "prizes"),
      notes: str(formData, "notes"),
      participants: {
        create: ids(formData, "partnerIds").map((partnerId) => ({ partnerId })),
      },
    },
  });

  revalidatePath("/eventos");
  revalidatePath("/parceiros");
  redirect(`/eventos/${event.id}`);
}

export async function createVisit(formData: FormData) {
  const partnerId = required(formData, "partnerId", "Parceiro");
  const visit = await prisma.visit.create({
    data: {
      partnerId,
      visitedAt: dateValue(formData, "visitedAt") ?? new Date(),
      completed: str(formData, "completed") === "on",
      giftReceived: str(formData, "giftReceived") === "on",
      giftDescription: str(formData, "giftDescription"),
      notes: str(formData, "notes"),
      teamMembers: {
        connect: ids(formData, "teamMemberIds").map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/visitas");
  revalidatePath(`/parceiros/${partnerId}`);
  redirect(`/visitas/${visit.id}/editar`);
}

export async function updateVisit(formData: FormData) {
  const id = required(formData, "id", "ID");
  const partnerId = required(formData, "partnerId", "Parceiro");
  await prisma.visit.update({
    where: { id },
    data: {
      partnerId,
      visitedAt: dateValue(formData, "visitedAt") ?? new Date(),
      completed: str(formData, "completed") === "on",
      giftReceived: str(formData, "giftReceived") === "on",
      giftDescription: str(formData, "giftDescription"),
      notes: str(formData, "notes"),
      teamMembers: {
        set: ids(formData, "teamMemberIds").map((memberId) => ({ id: memberId })),
      },
    },
  });

  revalidatePath("/visitas");
  revalidatePath(`/parceiros/${partnerId}`);
  redirect("/visitas");
}

export async function createPartnerAward(formData: FormData) {
  const partnerId = required(formData, "partnerId", "Parceiro");
  await prisma.partnerAward.create({
    data: {
      partnerId,
      awardCatalogId: required(formData, "awardCatalogId", "Premiação"),
      awardedAt: dateValue(formData, "awardedAt") ?? new Date(),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath("/premiacoes");
  revalidatePath(`/parceiros/${partnerId}`);
}

export async function approvePartner(formData: FormData) {
  const id = required(formData, "id", "ID");
  await prisma.partner.update({
    where: { id },
    data: {
      status: PartnerStatus.ACTIVE,
      partnershipStart: new Date(),
    },
  });

  revalidatePath("/parceiros");
  revalidatePath("/parceiros/aprovacao");
  revalidatePath(`/parceiros/${id}`);
}

export async function updateEventAttendance(formData: FormData) {
  const eventId = required(formData, "eventId", "Evento");
  const participantIds = ids(formData, "participantIds");

  await prisma.$transaction([
    prisma.eventParticipant.updateMany({
      where: { eventId },
      data: { attended: false },
    }),
    prisma.eventParticipant.updateMany({
      where: { eventId, id: { in: participantIds } },
      data: { attended: true },
    }),
  ]);

  revalidatePath(`/eventos/${eventId}`);
  revalidatePath("/eventos");
}

export async function createProduct(formData: FormData) {
  await prisma.product.create({
    data: {
      sku: required(formData, "sku", "SKU"),
      name: required(formData, "name", "Nome"),
      ean: str(formData, "ean"),
      value: decimalValue(formData, "value"),
      stock: intValue(formData, "stock") ?? 0,
      stockLocation: required(formData, "stockLocation", "Local do estoque") as StockLocation,
    },
  });

  revalidatePath("/brindes");
}

export async function updateProduct(formData: FormData) {
  await prisma.product.update({
    where: { id: required(formData, "id", "ID") },
    data: {
      sku: required(formData, "sku", "SKU"),
      name: required(formData, "name", "Nome"),
      ean: str(formData, "ean"),
      value: decimalValue(formData, "value"),
      stock: intValue(formData, "stock") ?? 0,
      stockLocation: required(formData, "stockLocation", "Local do estoque") as StockLocation,
    },
  });

  revalidatePath("/brindes");
}

export async function deleteProduct(formData: FormData) {
  await prisma.product.delete({ where: { id: required(formData, "id", "ID") } });
  revalidatePath("/brindes");
}

export async function updateAwardKit(formData: FormData) {
  const id = required(formData, "id", "Premiação");
  await prisma.awardCatalog.update({
    where: { id },
    data: {
      products: {
        set: ids(formData, "productIds").map((productId) => ({ id: productId })),
      },
    },
  });

  revalidatePath("/cadastros");
}
