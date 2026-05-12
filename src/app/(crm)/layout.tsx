import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <AppShell userName={session.user?.name}>{children}</AppShell>;
}
