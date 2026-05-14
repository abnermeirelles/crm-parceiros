"use client";

import { useMemo, useState } from "react";

export function EventGuestPicker({ partners }: { partners: Array<{ id: string; fullName: string; cpf: string | null }> }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) return partners.slice(0, 80);
    return partners
      .filter((partner) => {
        const cpf = partner.cpf?.toLowerCase() ?? "";
        return partner.fullName.toLowerCase().includes(normalized) || cpf.includes(normalized);
      })
      .slice(0, 80);
  }, [normalized, partners]);

  return (
    <div className="span-12 grid gap-3">
      <label>
        Parceiros convidados
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar por nome ou CPF"
          type="search"
          value={query}
        />
      </label>
      <div className="max-h-72 overflow-auto rounded-md border border-line bg-white">
        {filtered.map((partner) => (
          <label className="flex-row items-center gap-2 border-b border-line px-3 py-2 text-sm font-medium" key={partner.id}>
            <input className="w-auto" name="partnerIds" type="checkbox" value={partner.id} />
            <span>
              {partner.fullName}
              {partner.cpf ? <span className="text-muted"> · {partner.cpf}</span> : null}
            </span>
          </label>
        ))}
        {!filtered.length ? <p className="p-3 text-sm text-muted">Nenhum parceiro encontrado.</p> : null}
      </div>
    </div>
  );
}
