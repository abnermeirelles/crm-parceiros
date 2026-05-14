import { PageHeader } from "@/components/page-header";
import { createProduct, deleteProduct, updateProduct } from "@/lib/actions";
import { money } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const locations = [
  { value: "CD", label: "CD" },
  { value: "OFFICE", label: "Escritório" },
  { value: "STORE", label: "Loja" },
];

export default async function BrindesPage() {
  const products = await prisma.product.findMany({ orderBy: [{ name: "asc" }] });

  return (
    <>
      <PageHeader title="Controle de Brindes" description="Cadastro e saldo dos produtos usados em kits e visitas." />
      <section className="card p-5">
        <form action={createProduct} className="grid gap-3 md:grid-cols-[140px_1fr_160px_140px_120px_160px_auto]">
          <label>
            SKU
            <input name="sku" required />
          </label>
          <label>
            Nome
            <input name="name" required />
          </label>
          <label>
            EAN
            <input name="ean" />
          </label>
          <label>
            Valor
            <input min="0" name="value" step="0.01" type="number" />
          </label>
          <label>
            Estoque
            <input min="0" name="stock" type="number" />
          </label>
          <label>
            Local
            <select name="stockLocation" required>
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
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
      </section>
      <section className="card mt-5 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nome</th>
              <th>EAN</th>
              <th>Valor</th>
              <th>Estoque</th>
              <th>Local</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td colSpan={7}>
                  <form
                    action={updateProduct}
                    className="grid gap-3 md:grid-cols-[140px_1fr_160px_140px_120px_160px_auto_auto]"
                  >
                    <input name="id" type="hidden" value={product.id} />
                    <input aria-label="SKU" name="sku" defaultValue={product.sku} required />
                    <input aria-label="Nome" name="name" defaultValue={product.name} required />
                    <input aria-label="EAN" name="ean" defaultValue={product.ean ?? ""} />
                    <input aria-label="Valor" min="0" name="value" step="0.01" type="number" defaultValue={String(product.value)} />
                    <input aria-label="Estoque" min="0" name="stock" type="number" defaultValue={product.stock} />
                    <select aria-label="Local" name="stockLocation" defaultValue={product.stockLocation}>
                      {locations.map((location) => (
                        <option key={location.value} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-secondary" type="submit">
                      Salvar
                    </button>
                    <button className="btn btn-danger" formAction={deleteProduct} type="submit">
                      Excluir
                    </button>
                  </form>
                  <p className="mt-1 text-xs text-muted">
                    {money(product.value)} · {product.stock} unidades ·{" "}
                    {locations.find((location) => location.value === product.stockLocation)?.label}
                  </p>
                </td>
              </tr>
            ))}
            {!products.length ? (
              <tr>
                <td className="text-sm text-muted" colSpan={7}>
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </>
  );
}
