import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllProducts, getLeads, getOrders, getSettings } from "@/lib/store";
import { formatCOP } from "@/lib/format";
import { wompiConfig } from "@/lib/wompi";

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-line bg-bone p-6">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 font-display text-[2.2rem] font-light leading-none tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-2 text-[0.78rem] font-light text-mute">{hint}</p>}
    </div>
  );
}

export default async function AdminHome() {
  await requireAdmin();
  const [products, orders, leads, settings] = await Promise.all([
    getAllProducts(),
    getOrders(),
    getLeads(),
    getSettings(),
  ]);

  const paid = orders.filter((o) => o.status !== "pendiente" && o.status !== "rechazado");
  const revenue = paid.reduce((n, o) => n + o.totalCOP, 0);
  const newLeads = leads.filter((l) => l.status === "nuevo").length;
  const imported = products.filter((p) => p.supplier).length;
  const noPhoto = products.filter((p) => p.images.length === 0).length;
  const cfg = wompiConfig();

  return (
    <div className="shell py-12">
      <h1 className="display text-[2.4rem]">Resumen</h1>

      {!cfg.configured && (
        <p className="mt-6 border border-clay/40 bg-clay/5 px-5 py-4 text-[0.85rem] font-light leading-relaxed text-clay-deep">
          Wompi todavía no tiene llaves cargadas: el checkout no puede cobrar.
          Agregá <code className="font-mono text-[0.8rem]">NEXT_PUBLIC_WOMPI_PUBLIC_KEY</code> y{" "}
          <code className="font-mono text-[0.8rem]">WOMPI_INTEGRITY_SECRET</code> en{" "}
          <code className="font-mono text-[0.8rem]">.env.local</code>.
        </p>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Leads nuevos"
          value={String(newLeads)}
          hint={`${leads.length} en total`}
        />
        <Stat
          label="Pedidos"
          value={String(orders.length)}
          hint={`${paid.length} con pago confirmado`}
        />
        <Stat label="Vendido" value={formatCOP(revenue)} hint="Pedidos aprobados" />
        <Stat
          label="Productos"
          value={String(products.filter((p) => p.active).length)}
          hint={`${imported} importados · ${noPhoto} sin foto`}
        />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="border border-line bg-bone p-7">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-light">Últimos leads</h2>
            <Link href="/admin/leads" className="text-[0.68rem] uppercase tracking-[0.16em] link-underline">
              Ver todos
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="mt-6 text-[0.88rem] font-light text-mute">
              Todavía no llegó ninguno.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-line">
              {leads.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="text-[0.92rem] font-light">{l.name}</p>
                    <p className="text-[0.76rem] text-mute">
                      {l.service} · {l.city}
                    </p>
                  </div>
                  <span className="shrink-0 text-[0.7rem] uppercase tracking-[0.14em] text-mute">
                    {l.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-line bg-bone p-7">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-light">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-[0.68rem] uppercase tracking-[0.16em] link-underline">
              Ver todos
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-6 text-[0.88rem] font-light text-mute">
              Todavía no hay pedidos.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-line">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="font-mono text-[0.78rem]">{o.reference}</p>
                    <p className="text-[0.76rem] text-mute">{o.customer.name}</p>
                  </div>
                  <span className="shrink-0 text-[0.88rem] tabular-nums">
                    {formatCOP(o.totalCOP)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-12 text-[0.8rem] font-light text-mute">
        TRM actual: 1 USD = {formatCOP(settings.usdToCop)} · Margen por defecto ×
        {settings.defaultMarkup} ·{" "}
        <Link href="/admin/ajustes" className="link-underline">
          cambiar
        </Link>
      </p>
    </div>
  );
}
