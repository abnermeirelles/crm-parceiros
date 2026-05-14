import { PageHeader } from "@/components/page-header";
import {
  createLookup,
  createServiceValue,
  deleteLookup,
  deleteServiceValue,
  updateAwardKit,
  updateLookup,
  updateServiceValue,
} from "@/lib/actions";
import { money } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const sections = [
  { title: "Profissões", entity: "profession" },
  { title: "Categorias CAT", entity: "category" },
  { title: "Tipos de evento", entity: "eventType" },
  { title: "Equipe de relacionamento", entity: "teamMember" },
  { title: "Catálogo de premiações", entity: "awardCatalog" },
] as const;

function LookupSection({ title, entity, items }: { title: string; entity: string; items: any[] }) {
  const isTeam = entity === "teamMember";
  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <form action={createLookup} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input name="entity" type="hidden" value={entity} />
        <label>
          Nome
          <input name="name" required />
        </label>
        {isTeam ? (
          <label>
            Cargo/função
            <input name="role" />
          </label>
        ) : (
          <div />
        )}
        <div className="flex items-end">
          <button className="btn btn-primary w-full" type="submit">
            Adicionar
          </button>
        </div>
      </form>
      <div className="mt-4 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              {isTeam ? <th>Cargo</th> : null}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <form action={updateLookup} className="grid gap-2 md:grid-cols-[1fr_auto]">
                    <input name="entity" type="hidden" value={entity} />
                    <input name="id" type="hidden" value={item.id} />
                    <input aria-label="Nome" name="name" defaultValue={item.name} required />
                    {!isTeam ? (
                      <button className="btn btn-secondary" type="submit">
                        Salvar
                      </button>
                    ) : null}
                    {isTeam ? <input name="role" defaultValue={item.role ?? ""} type="hidden" /> : null}
                  </form>
                </td>
                {isTeam ? (
                  <td>
                    <form action={updateLookup} className="grid gap-2 md:grid-cols-[1fr_auto]">
                      <input name="entity" type="hidden" value={entity} />
                      <input name="id" type="hidden" value={item.id} />
                      <input name="name" defaultValue={item.name} type="hidden" />
                      <input aria-label="Cargo" name="role" defaultValue={item.role ?? ""} />
                      <button className="btn btn-secondary" type="submit">
                        Salvar
                      </button>
                    </form>
                  </td>
                ) : null}
                <td>
                  <form action={deleteLookup}>
                    <input name="entity" type="hidden" value={entity} />
                    <input name="id" type="hidden" value={item.id} />
                    <button className="btn btn-danger" type="submit">
                      Excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={isTeam ? 3 : 2}>
                  Nenhum item cadastrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function CadastrosPage() {
  const [professions, categories, eventTypes, teamMembers, awardCatalogs, serviceValues, products] =
    await Promise.all([
      prisma.profession.findMany({ orderBy: { name: "asc" } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.eventType.findMany({ orderBy: { name: "asc" } }),
      prisma.relationshipTeamMember.findMany({ orderBy: { name: "asc" } }),
      prisma.awardCatalog.findMany({ include: { products: true }, orderBy: { name: "asc" } }),
      prisma.serviceValue.findMany({ include: { profession: true }, orderBy: [{ kind: "asc" }, { label: "asc" }] }),
      prisma.product.findMany({ orderBy: { name: "asc" } }),
    ]);

  const data = {
    profession: professions,
    category: categories,
    eventType: eventTypes,
    teamMember: teamMembers,
    awardCatalog: awardCatalogs,
  };

  return (
    <>
      <PageHeader title="Cadastros auxiliares" description="Itens usados nos dropdowns e vínculos do CRM." />
      <div className="grid gap-5">
        {sections.map((section) => (
          <LookupSection
            entity={section.entity}
            items={data[section.entity]}
            key={section.entity}
            title={section.title}
          />
        ))}
        <section className="card p-5">
          <h2 className="text-lg font-bold text-ink">Faixas de consulta e aula</h2>
          <form action={createServiceValue} className="mt-4 grid gap-3 md:grid-cols-[1fr_150px_170px_1fr_auto]">
            <label>
              Faixa
              <input name="label" placeholder="Até R$300" required />
            </label>
            <label>
              Valor referência
              <input min="0" name="amount" required step="0.01" type="number" />
            </label>
            <label>
              Tipo
              <select name="kind" required>
                <option value="CONSULTATION">Faixa média do atendimento</option>
                <option value="CLASS">Faixa média Aula/Hr</option>
              </select>
            </label>
            <label>
              Profissão vinculada
              <select name="professionId">
                <option value="">Todas</option>
                {professions.map((profession) => (
                  <option key={profession.id} value={profession.id}>
                    {profession.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button className="btn btn-primary w-full" type="submit">
                Adicionar
              </button>
            </div>
          </form>
          <div className="mt-4 overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Rótulo</th>
                  <th>Valor referência</th>
                  <th>Tipo</th>
                  <th>Profissão</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {serviceValues.map((item) => (
                  <tr key={item.id}>
                    <td colSpan={5}>
                      <form action={updateServiceValue} className="grid gap-3 md:grid-cols-[1fr_150px_170px_1fr_auto_auto]">
                        <input name="id" type="hidden" value={item.id} />
                        <input aria-label="Rótulo" name="label" defaultValue={item.label} required />
                        <input aria-label="Valor" name="amount" defaultValue={String(item.amount)} min="0" step="0.01" type="number" />
                        <select aria-label="Tipo" name="kind" defaultValue={item.kind}>
                          <option value="CONSULTATION">Consulta</option>
                          <option value="CLASS">Aula</option>
                        </select>
                        <select aria-label="Profissão" name="professionId" defaultValue={item.professionId ?? ""}>
                          <option value="">Todas</option>
                          {professions.map((profession) => (
                            <option key={profession.id} value={profession.id}>
                              {profession.name}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-secondary" type="submit">
                          Salvar
                        </button>
                        <button className="btn btn-danger" formAction={deleteServiceValue} type="submit">
                          Excluir
                        </button>
                      </form>
                      <p className="mt-1 text-xs text-muted">
                        {money(item.amount)} · {item.kind === "CONSULTATION" ? "Consulta" : "Aula"} ·{" "}
                        {item.profession?.name ?? "Todas as profissões"}
                      </p>
                    </td>
                  </tr>
                ))}
                {!serviceValues.length ? (
                  <tr>
                    <td className="text-sm text-muted" colSpan={5}>
                      Nenhum valor cadastrado.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-lg font-bold text-ink">Produtos dentro dos kits de premiação</h2>
          <div className="mt-4 overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Premiação</th>
                  <th>Produtos vinculados</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {awardCatalogs.map((award) => (
                  <tr key={award.id}>
                    <td className="font-semibold">{award.name}</td>
                    <td>
                      <form action={updateAwardKit} className="grid gap-2 md:grid-cols-[1fr_auto]">
                        <input name="id" type="hidden" value={award.id} />
                        <select
                          aria-label={`Produtos do kit ${award.name}`}
                          defaultValue={award.products.map((product) => product.id)}
                          multiple
                          name="productIds"
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.sku} - {product.name}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-secondary" type="submit">
                          Salvar kit
                        </button>
                      </form>
                    </td>
                    <td className="text-sm text-muted">
                      {award.products.map((product) => product.name).join(", ") || "Nenhum produto"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
