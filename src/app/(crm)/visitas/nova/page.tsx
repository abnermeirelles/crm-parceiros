import { VisitForm } from "@/components/visit-form";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export default async function NovaVisitaPage() {
  const [partners, teamMembers] = await Promise.all([
    prisma.partner.findMany({ where: { status: { not: "INACTIVE" } }, orderBy: { fullName: "asc" } }),
    prisma.relationshipTeamMember.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="Nova visita" description="Cadastre uma visita agendada ou já realizada." />
      <VisitForm partners={partners} teamMembers={teamMembers} />
    </>
  );
}
