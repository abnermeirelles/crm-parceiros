import { notFound } from "next/navigation";
import { PartnerForm } from "@/components/partner-form";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export default async function EditarParceiroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [partner, partnerTypes, professions, categories, consultationValues, classValues] = await Promise.all([
    prisma.partner.findUnique({ where: { id }, include: { partnerTypes: true } }),
    prisma.partnerType.findMany({ orderBy: { name: "asc" } }),
    prisma.profession.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.serviceValue.findMany({ where: { kind: "CONSULTATION" }, orderBy: { label: "asc" } }),
    prisma.serviceValue.findMany({ where: { kind: "CLASS" }, orderBy: { label: "asc" } }),
  ]);

  if (!partner) notFound();

  return (
    <>
      <PageHeader title="Editar parceiro" description={partner.fullName} />
      <PartnerForm
        partner={partner}
        lookups={{ partnerTypes, professions, categories, consultationValues, classValues }}
      />
    </>
  );
}
