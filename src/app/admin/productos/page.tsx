import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllProducts, getSettings } from "@/lib/store";
import { categoryName } from "@/lib/categories";
import { deliveryShort, formatCOP } from "@/lib/format";
import { repriceFromUSD, toggleProductActive } from "../actions";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductos({
  searchParams,
}: {
  searchParams: Promise<{ guardado?: string; eliminado?: string; repreciado?: string; filtro?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const [all, settings] = await Promise.all([getAllProducts(), getSettings()]);

  const filtro = sp.filtro ?? "";
  const products = all.filter((p) => {
    if (filtro === "importados") return Boolean(p.supplier);
    if (filtro === "sin-foto") return p.images.length === 0;
    if (filtro === "inactivos") return !p.active;
    return true;
  });

  const flash =
    sp.guardado ? "Producto guardado." :
    sp.eliminado ? "Producto eliminado." :
    sp.repreciado ? "Precios recalculados con la TRM y el margen actuales." : null;

  const FILTROS = [
    { id: "", label: `Todos (${all.length})` },
    { id: "importados", label: `Con proveedor (${all.filter((p) => p.supplier).length})` },
    { id: "sin-foto", label: `Sin foto (${all.filter((p) => !p.images.length).length})` },
    { id: "inactivos", label: `Inactivos (${all.filter((p) => !p.active).length})` },
  ];

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="display text-[2.4rem]">Productos</h1>
          <p className="mt-2 text-[0.85rem] font-light text-mute">
            El link del proveedor y el costo solo se ven acá: nunca salen al
            sitio público.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <form action={repriceFromUSD}>
            <button
              type="submit"
              className="border border-line px-6 py-3 text-[0.68rem] uppercase tracking-[0.16em] hover:bg-sand"
            >
              Recalcular precios
            </button>
          </form>
          <Link
            href="/admin/productos/nuevo"
            className="bg-ink px-6 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-bone hover:bg-espresso"
          >
            Nuevo producto
          </Link>
        </div>
      </div>

      {flash && (
        <p className="mt-6 border border-line bg-sand/60 px-5 py-3 text-[0.85rem] font-light">
          {flash}
        </p>
      )}

      <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-4">
        {FILTROS.map((f) => (
          <Link
            key={f.id}
            href={f.id ? `/admin/productos?filtro=${f.id}` : "/admin/productos"}
            className={`text-[0.7rem] uppercase tracking-[0.14em] link-underline ${
              filtro === f.id ? "text-ink" : "text-mute"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[64rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-[0.62rem] uppercase tracking-[0.16em] text-mute">
              <th className="py-3 pr-4 font-normal">Producto</th>
              <th className="py-3 pr-4 font-normal">Categoría</th>
              <th className="py-3 pr-4 text-right font-normal">Costo</th>
              <th className="py-3 pr-4 text-right font-normal">Precio</th>
              <th className="py-3 pr-4 text-right font-normal">Margen</th>
              <th className="py-3 pr-4 font-normal">Entrega</th>
              <th className="py-3 pr-4 font-normal">Stock</th>
              <th className="py-3 pr-4 font-normal">Dónde comprarlo</th>
              <th className="py-3 pr-4 font-normal">Estado</th>
              <th className="py-3 pr-2 font-normal">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const costCOP =
                p.supplier?.costCOP ??
                (p.supplier?.costUSD ? p.supplier.costUSD * settings.usdToCop : null);
              const margin = costCOP ? p.priceCOP / costCOP : null;
              return (
                <tr key={p.id} className="border-b border-line align-middle">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <span className="relative block h-12 w-10 shrink-0 overflow-hidden bg-sand">
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                        ) : (
                          <span className="flex h-full items-center justify-center font-display text-sm text-clay/40">
                            C
                          </span>
                        )}
                      </span>
                      <span>
                        <span className="block text-[0.9rem] font-light group-hover:text-clay-deep">
                          {p.name}
                        </span>
                        <span className="block font-mono text-[0.66rem] text-mute">
                          {p.slug}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-[0.8rem] font-light text-mute">
                    {categoryName(p.category)}
                  </td>
                  <td className="py-3 pr-4 text-right text-[0.8rem] tabular-nums text-mute">
                    {p.supplier?.costUSD
                      ? `US$ ${p.supplier.costUSD}`
                      : p.supplier?.costCOP
                        ? formatCOP(p.supplier.costCOP)
                        : "—"}
                  </td>
                  <td className="py-3 pr-4 text-right text-[0.85rem] tabular-nums">
                    {formatCOP(p.priceCOP)}
                  </td>
                  <td className="py-3 pr-4 text-right text-[0.8rem] tabular-nums text-mute">
                    {margin ? `×${margin.toFixed(1)}` : "—"}
                  </td>
                  <td className="py-3 pr-4 text-[0.78rem] font-light text-mute">
                    {deliveryShort(p.delivery)}
                  </td>
                  <td className="py-3 pr-4 text-[0.8rem] tabular-nums text-mute">
                    {p.stock === null ? "A pedido" : p.stock}
                  </td>
                  <td className="py-3 pr-4 text-[0.78rem]">
                    {p.supplier ? (
                      <a
                        href={p.supplier.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-clay-deep link-underline"
                        title={p.supplier.url}
                      >
                        {p.supplier.name}
                        {p.supplier.sku ? ` · ${p.supplier.sku}` : ""}
                      </a>
                    ) : (
                      <span className="text-mute">Producción propia</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <form action={toggleProductActive}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className={`px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${
                          p.active
                            ? "bg-olive/15 text-olive"
                            : "bg-line/60 text-mute"
                        }`}
                      >
                        {p.active ? "Activo" : "Oculto"}
                      </button>
                    </form>
                  </td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-4 whitespace-nowrap">
                      <a
                        href={`/producto/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.68rem] uppercase tracking-[0.14em] text-mute hover:text-ink"
                        title={p.active ? "Ver en el sitio" : "Oculto: no se ve en el sitio público"}
                      >
                        Ver
                      </a>
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-[0.68rem] uppercase tracking-[0.14em] text-mute hover:text-ink"
                      >
                        Editar
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
