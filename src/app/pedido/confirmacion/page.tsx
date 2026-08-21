import type { Metadata } from "next";
import Link from "next/link";
import { fetchTransaction } from "@/lib/wompi";
import { getOrders, getSettings } from "@/lib/store";
import { formatCOP } from "@/lib/format";
import ClearCartOnSuccess from "@/components/ClearCartOnSuccess";

export const metadata: Metadata = {
  title: "Confirmación de pedido",
  robots: { index: false, follow: false },
};

type Search = { searchParams: Promise<{ id?: string }> };

export default async function ConfirmacionPage({ searchParams }: Search) {
  const { id } = await searchParams;
  const settings = await getSettings();
  const tx = id ? await fetchTransaction(id) : null;
  const orders = tx ? await getOrders() : [];
  const order = tx ? orders.find((o) => o.reference === tx.reference) : undefined;

  const approved = tx?.status === "APPROVED";
  const pending = tx?.status === "PENDING";

  const title = approved
    ? "Gracias, tu pedido está confirmado"
    : pending
      ? "Tu pago está en proceso"
      : tx
        ? "El pago no se pudo completar"
        : "No encontramos la transacción";

  const body = approved
    ? "Te enviamos el detalle por correo. Coordinamos la entrega por WhatsApp con los tiempos de cada pieza."
    : pending
      ? "Algunos medios de pago tardan unos minutos en confirmarse. Apenas se apruebe te escribimos."
      : tx
        ? "No se hizo ningún cobro. Podés intentar de nuevo con otro medio de pago o escribirnos y lo resolvemos."
        : "Si ya hiciste el pago, escribinos con tu número de referencia y lo verificamos.";

  return (
    <div className="shell py-24 md:py-32">
      {approved && <ClearCartOnSuccess />}

      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">
          {approved ? "Pedido confirmado" : pending ? "En proceso" : "Pago"}
        </p>
        <h1 className="display mt-5 text-[2.4rem] md:text-[3.4rem]">{title}</h1>
        <p className="mx-auto mt-6 max-w-lg text-[0.98rem] font-light leading-relaxed text-mute">
          {body}
        </p>

        {tx && (
          <dl className="mx-auto mt-12 max-w-md border-y border-line text-left">
            <div className="flex justify-between border-b border-line py-4">
              <dt className="eyebrow">Referencia</dt>
              <dd className="font-mono text-[0.82rem]">{tx.reference}</dd>
            </div>
            {order && (
              <>
                <div className="flex justify-between border-b border-line py-4">
                  <dt className="eyebrow">Piezas</dt>
                  <dd className="text-[0.88rem] font-light">
                    {order.items.reduce((n, i) => n + i.quantity, 0)}
                  </dd>
                </div>
                <div className="flex justify-between py-4">
                  <dt className="eyebrow">Total</dt>
                  <dd className="text-[0.95rem] tabular-nums">
                    {formatCOP(order.totalCOP)}
                  </dd>
                </div>
              </>
            )}
          </dl>
        )}

        {order && approved && (
          <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-[0.86rem] font-light text-mute">
            {order.items.map((i) => (
              <li key={`${i.productId}${i.variant ?? ""}`} className="flex justify-between gap-4">
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
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/tienda"
            className="bg-ink px-9 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
          >
            Seguir viendo
          </Link>
          <a
            href={`https://wa.me/${settings.whatsapp}${
              tx ? `?text=${encodeURIComponent(`Hola Cumbre, consulto por mi pedido ${tx.reference}`)}` : ""
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink px-9 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
          >
            Escribirnos
          </a>
        </div>
      </div>
    </div>
  );
}
