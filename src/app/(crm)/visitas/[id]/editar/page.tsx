import { notFound } from "next/navigation";
import { VisitForm } from "@/components/visit-form";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export default async function EditarVisitaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [visit, partners, teamMembers] = await Promise.all([
    prisma.visit.findUnique({ where: { id }, include: { partner: true, teamMembers: true } }),
    prisma.partner.findMany({ orderBy: { fullName: "asc" } }),
    prisma.relationshipTeamMember.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!visit) notFound();

  return (
    <>
      <PageHeader title="Editar visita" description={visit.partner.fullName} />
      <VisitForm visit={visit} partners={partners} teamMembers={teamMembers} />
    </>
  );
}
