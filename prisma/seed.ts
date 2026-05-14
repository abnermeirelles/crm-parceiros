import { PrismaClient, ServiceValueKind } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const partnerTypes = [
    "Nutricionista",
    "Educador Físico",
    "Academias",
    "Influenciadores",
    "Médicos",
  ];

  for (const name of partnerTypes) {
    await prisma.partnerType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const name of ["A", "B", "C"]) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const name of ["Palestra", "Workshop", "Treinamento", "Feira"]) {
    await prisma.eventType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const name of ["Voucher", "Kit de Produtos", "Troféu", "Experiência"]) {
    await prisma.awardCatalog.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const name of ["Nutricionista", "Educador Físico", "Médico"]) {
    await prisma.profession.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const item of [
    { label: "Até R$300", amount: 300, kind: ServiceValueKind.CONSULTATION },
    { label: "Até R$500", amount: 500, kind: ServiceValueKind.CONSULTATION },
    { label: "Acima de R$500", amount: 501, kind: ServiceValueKind.CONSULTATION },
    { label: "Até R$100", amount: 100, kind: ServiceValueKind.CLASS },
    { label: "Até R$200", amount: 200, kind: ServiceValueKind.CLASS },
    { label: "Acima de R$200", amount: 201, kind: ServiceValueKind.CLASS },
  ]) {
    const serviceValue = await prisma.serviceValue.findFirst({
      where: { label: item.label, kind: item.kind, professionId: null },
    });
    if (!serviceValue) {
      await prisma.serviceValue.create({ data: item });
    }
  }

  const email = process.env.ADMIN_EMAIL ?? "admin@empresa.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const name = process.env.ADMIN_NAME ?? "Administrador";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
