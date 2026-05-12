"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button className="btn btn-secondary" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
      <LogOut size={16} />
      Sair
    </button>
  );
}
