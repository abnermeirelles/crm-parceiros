import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AttendanceMode, MonthlyAppointmentsRange, PracticeArea, ServiceValueKind } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalize(value: unknown) {
  return text(value)
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

async function findProfessionId(value: unknown) {
  const name = text(value);
  if (!name) return null;
  const profession = await prisma.profession.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  return profession.id;
}

async function findServiceValueId(value: unknown, kind: ServiceValueKind) {
  const label = text(value);
  if (!label) return null;

  const serviceValue = await prisma.serviceValue.findFirst({
    where: {
      kind,
      label: {
        equals: label,
        mode: "insensitive",
      },
    },
  });

  if (serviceValue) return serviceValue.id;

  const amountMatch = label.match(/\d+/);
  return (
    await prisma.serviceValue.create({
      data: {
        label,
        amount: amountMatch ? Number(amountMatch[0]) : 0,
        kind,
      },
    })
  ).id;
}

function attendanceMode(value: unknown): AttendanceMode | null {
  const normalized = normalize(value);
  if (!normalized) return null;
  if (normalized.includes("presencial") && normalized.includes("online")) return "IN_PERSON_ONLINE";
  if (normalized.includes("online")) return "ONLINE";
  if (normalized.includes("presencial")) return "IN_PERSON";
  return null;
}

function monthlyAppointmentsRange(value: unknown): MonthlyAppointmentsRange | null {
  const normalized = normalize(value);
  if (!normalized) return null;
  if (normalized.includes("+50") || normalized.includes("acima") || normalized.includes("mais de 50")) return "ABOVE_50";
  if (normalized.includes("50")) return "UP_TO_50";
  if (normalized.includes("30")) return "UP_TO_30";
  return null;
}

function practiceArea(value: unknown): PracticeArea | null {
  const normalized = normalize(value);
  if (!normalized) return null;
  if (normalized.includes("academia")) return "GYM";
  if (normalized.includes("online")) return "ONLINE_CONSULTING";
  if (normalized.includes("presencial")) return "IN_PERSON_CONSULTING";
  if (normalized.includes("personal")) return "EXCLUSIVE_PERSONAL";
  if (normalized.includes("outra") || normalized.includes("outro")) return "OTHER";
  return null;
}

export async function POST(request: Request) {
  const secret = process.env.WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("x-webhook-secret");

  if (!secret || receivedSecret !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const firstName = text(body.firstName ?? body.nome);
  const lastName = text(body.lastName ?? body.sobrenome);
  const fullName = text(body.fullName ?? body.nomeCompleto) || [firstName, lastName].filter(Boolean).join(" ");

  if (!fullName) {
    return NextResponse.json({ error: "Nome completo é obrigatório." }, { status: 400 });
  }

  const cpf = text(body.cpf);
  const cnpj = text(body.cnpj);
  const professionId = await findProfessionId(body.profession ?? body.profissao);
  const consultationValueId = await findServiceValueId(
    body.faixaMediaAtendimento ?? body.faixa_media_atendimento ?? body.consultationRange,
    "CONSULTATION",
  );
  const classValueId = await findServiceValueId(
    body.faixaMediaAulaHr ?? body.faixa_media_aula_hr ?? body.classRange,
    "CLASS",
  );

  const email = text(body.email);
  const identityFilters = [cpf ? { cpf } : null, cnpj ? { cnpj } : null, email ? { email } : null].filter(Boolean) as Array<
    { cpf: string } | { cnpj: string } | { email: string }
  >;
  const existing = await prisma.partner.findFirst({
    where: identityFilters.length ? { OR: identityFilters } : { id: "__never__" },
  });

  const partnerData = {
    firstName,
    lastName,
    fullName,
    phone: text(body.phone ?? body.telefone),
    email,
    instagram: text(body.instagram),
    coupon: text(body.coupon ?? body.cupom),
    address: text(body.address ?? body.endereco),
    number: text(body.number ?? body.numero),
    complement: text(body.complement ?? body.complemento),
    zipCode: text(body.zipCode ?? body.cep),
    district: text(body.district ?? body.bairro),
    city: text(body.city ?? body.cidade),
    state: text(body.state ?? body.estado)?.toUpperCase(),
    attendanceMode: attendanceMode(body.attendanceMode ?? body.atendimento),
    monthlyAppointmentsRange: monthlyAppointmentsRange(body.monthlyAppointmentsRange ?? body.atendimentosMes),
    practiceArea: practiceArea(body.practiceArea ?? body.areaAtuacao ?? body.area_de_atuacao ?? body["Área de Atuação"]),
    consultationValueId,
    classValueId,
    professionId,
    status: "PENDING_APPROVAL",
    notes: text(body.notes ?? body.observacoes),
  } as const;

  const partner = existing
    ? await prisma.partner.update({
        where: { id: existing.id },
        data: partnerData,
      })
    : await prisma.partner.create({
        data: {
          kind: cnpj ? "COMPANY" : "PERSON",
          ...partnerData,
          companyName: text(body.companyName ?? body.empresa),
          cpf,
          cnpj,
        },
      });

  return NextResponse.json({ ok: true, partnerId: partner.id, status: partner.status }, { status: 201 });
}
