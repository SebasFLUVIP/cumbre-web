import { requireAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/store";
import { formatCOP } from "@/lib/format";
import { updateOrderStatus } from "../actions";

const ESTADOS = ["pendiente", "aprobado", "rechazado", "enviado", "entregado"] as const;

const TONE: Record<string, string> = {
  pendiente: "bg-line/60 text-mute",
  aprobado: "bg-olive/15 text-olive",
  rechazado: "bg-clay/15 text-clay-deep",
  enviado: "bg-espresso/10 text-espresso",
  entregado: "bg-olive/20 text-olive",
};

export default async function AdminPedidos() {
  await requireAdmin();
  const orders = await getOrders();

  return (
    <div className="shell py-12">
      <h1 className="display text-[2.4rem]">Pedidos</h1>
      <p className="mt-2 text-[0.85rem] font-light text-mute">
        El estado de pago lo actualiza Wompi por webhook. «Enviado» y
        «entregado» los marcás vos.
      </p>

      {orders.length === 0 ? (
        <p className="mt-16 font-display text-2xl font-light text-mute">
          Todavía no hay pedidos.
        </p>
      ) : (
        <div className="mt-10 space-y-5">
          {orders.map((o) => (
            <article key={o.id} className="border border-line bg-bone p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[0.8rem]">{o.reference}</span>
                    <span
                      className={`px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${TONE[o.status]}`}
                    >
                      {o.status}
                    </span>
                    <span className="text-[0.75rem] font-light text-mute">
                      {new Date(o.createdAt).toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-xl font-light">
                    {o.customer.name}
                  </p>
                  <p className="text-[0.82rem] font-light text-mute">
                    {o.customer.email} · {o.customer.phone} · {o.customer.docType}{" "}
                    {o.customer.docNumber}
                  </p>
                  <p className="mt-1 text-[0.82rem] font-light text-mute">
                    {o.customer.address}, {o.customer.city} — {o.customer.department}
                  </p>
                  {o.customer.notes && (
                    <p className="mt-1 text-[0.82rem] font-light italic text-mute">
                      «{o.customer.notes}»
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-display text-[1.8rem] font-light tabular-nums">
                    {formatCOP(o.totalCOP)}
                  </p>
                  <p className="text-[0.75rem] font-light text-mute">
                    {formatCOP(o.subtotalCOP)} + envío{" "}
                    {o.shippingCOP === 0 ? "gratis" : formatCOP(o.shippingCOP)}
                  </p>
                  <form action={updateOrderStatus} className="mt-4 flex gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="border border-line bg-bone px-2 py-1.5 text-[0.78rem] font-light"
                    >
                      {ESTADOS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="border border-line px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] hover:bg-sand"
                    >
                      Guardar
                    </button>
                  </form>
                </div>
              </div>

              <ul className="mt-5 divide-y divide-line border-t border-line pt-2">
                {o.items.map((i) => (
                  <li
                    key={`${i.productId}${i.variant ?? ""}`}
                    className="flex justify-between gap-4 py-2 text-[0.85rem] font-light"
                  >
                    <span>
                      {i.quantity} × {i.name}
                      {i.variant ? ` · ${i.variant}` : ""}
                    </span>
                    <span className="tabular-nums">
                      {formatCOP(i.unitPriceCOP * i.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
