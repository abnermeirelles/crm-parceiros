import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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
