import Link from "next/link";
import { CalendarDays, Gift, Handshake, LayoutDashboard, Package, Settings, UserCog, Users } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parceiros", label: "Parceiros", icon: Handshake },
  { href: "/parceiros/aprovacao", label: "Aprovação", icon: Users },
  { href: "/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/visitas", label: "Visitas", icon: Users },
  { href: "/premiacoes", label: "Premiações", icon: Gift },
  { href: "/brindes", label: "Brindes", icon: Package },
  { href: "/cadastros", label: "Cadastros", icon: Settings },
  { href: "/usuarios", label: "Usuários", icon: UserCog },
];

export function AppShell({ children, userName }: { children: React.ReactNode; userName?: string | null }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white lg:block">
        <div className="border-b border-line px-5 py-5">
          <p className="text-sm font-bold text-brand">CRM de Parceiros</p>
          <p className="mt-1 text-xs text-muted">Suplementos alimentares</p>
        </div>
        <nav className="grid gap-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-panel"
                href={item.href}
                key={item.href}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-muted">Área interna</p>
              <p className="text-sm font-semibold text-ink">{userName ?? "Usuário"}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:hidden">
              {nav.map((item) => (
                <Link className="btn btn-secondary" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
