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

  const consultationValue = await prisma.serviceValue.findFirst({
    where: { label: "R$ 150,00", kind: ServiceValueKind.CONSULTATION, professionId: null },
  });
  if (!consultationValue) {
    await prisma.serviceValue.create({
      data: {
      label: "R$ 150,00",
      amount: 150,
      kind: ServiceValueKind.CONSULTATION,
      },
    });
  }

  const classValue = await prisma.serviceValue.findFirst({
    where: { label: "R$ 100,00", kind: ServiceValueKind.CLASS, professionId: null },
  });
  if (!classValue) {
    await prisma.serviceValue.create({
      data: {
      label: "R$ 100,00",
      amount: 100,
      kind: ServiceValueKind.CLASS,
      },
    });
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
