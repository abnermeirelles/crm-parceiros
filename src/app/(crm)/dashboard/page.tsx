import Link from "next/link";
import { CalendarDays, Gift, Handshake, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [partners, events, visits, awards] = await Promise.all([
    prisma.partner.count(),
    prisma.event.count(),
    prisma.visit.count(),
    prisma.partnerAward.count(),
  ]);

  const cards = [
    { label: "Parceiros", value: partners, href: "/parceiros", icon: Handshake },
    { label: "Eventos", value: events, href: "/eventos", icon: CalendarDays },
    { label: "Visitas", value: visits, href: "/visitas", icon: Users },
    { label: "Premiações", value: awards, href: "/premiacoes", icon: Gift },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Visão rápida dos principais cadastros do CRM." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={card.href} key={card.href}>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-muted">{card.label}</span>
                <Icon className="text-brand" size={20} />
              </div>
              <p className="text-3xl font-bold text-ink">{card.value}</p>
            </Link>
          );
        })}
      </div>
      <section className="card mt-5 p-5">
        <h2 className="text-lg font-bold text-ink">Próximos passos naturais</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Link className="btn btn-primary" href="/parceiros/novo">
            Cadastrar parceiro
          </Link>
          <Link className="btn btn-secondary" href="/eventos/novo">
            Criar evento
          </Link>
          <Link className="btn btn-secondary" href="/cadastros">
            Ajustar cadastros
          </Link>
        </div>
      </section>
    </>
  );
}
