import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM de Parceiros",
  description: "Controle de parcerias para suplementos alimentares",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
