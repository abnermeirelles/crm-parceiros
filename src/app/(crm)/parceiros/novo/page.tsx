import { PartnerForm } from "@/components/partner-form";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export default async function NovoParceiroPage() {
  const [professions, categories, consultationValues, classValues] = await Promise.all([
    prisma.profession.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.serviceValue.findMany({ where: { kind: "CONSULTATION" }, orderBy: { label: "asc" } }),
    prisma.serviceValue.findMany({ where: { kind: "CLASS" }, orderBy: { label: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="Novo parceiro" description="Cadastre pessoa física ou empresa parceira." />
      <PartnerForm lookups={{ partnerTypes: [], professions, categories, consultationValues, classValues }} />
    </>
  );
}
