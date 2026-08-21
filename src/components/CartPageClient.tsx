"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCOP } from "@/lib/format";
import { lineKey, useCart } from "./CartProvider";

export default function CartPageClient({
  freeShippingThresholdCOP,
}: {
  freeShippingThresholdCOP: number;
}) {
  const { lines, subtotalCOP, setQuantity, remove, ready } = useCart();
  const missing = Math.max(0, freeShippingThresholdCOP - subtotalCOP);

  return (
    <div className="shell py-16 md:py-24">
      <h1 className="display text-[2.6rem] md:text-[3.5rem]">Tu carrito</h1>

      {!ready ? (
        <p className="mt-10 text-[0.9rem] font-light text-mute">Cargando…</p>
      ) : lines.length === 0 ? (
        <div className="mt-10 border-t border-line py-20 text-center">
          <p className="font-display text-3xl font-light">
            Todavía no hay nada acá
          </p>
          <p className="mx-auto mt-4 max-w-md text-[0.93rem] font-light text-mute">
            Empezá por las lámparas: cambiar la luz es lo que más cambia una
            casa.
          </p>
          <Link
            href="/tienda"
            className="mt-8 inline-block bg-ink px-9 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((l) => {
                const key = lineKey(l);
                return (
                  <li key={key} className="flex gap-5 py-7">
                    <Link
                      href={`/producto/${l.slug}`}
                      className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden bg-sand"
                    >
                      {l.image ? (
                        <Image
                          src={l.image}
                          alt={l.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center font-display text-3xl text-clay/40">
                          C
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/producto/${l.slug}`}
                            className="font-display text-xl font-light"
                          >
                            {l.name}
                          </Link>
                          {l.variant && (
                            <p className="mt-0.5 text-[0.8rem] font-light text-mute">
                              {l.variant}
                            </p>
                          )}
                          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-mute">
                            {l.deliveryLabel}
                          </p>
                        </div>
                        <span className="shrink-0 text-[0.95rem] tabular-nums">
                          {formatCOP(l.unitPriceCOP * l.quantity)}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center gap-5 pt-4">
                        <div className="flex items-center border border-line">
                          <button
                            type="button"
                            aria-label="Quitar uno"
                            onClick={() => setQuantity(key, l.quantity - 1)}
                            className="px-3 py-2 hover:bg-sand"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm tabular-nums">
                            {l.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Agregar uno"
                            onClick={() => setQuantity(key, l.quantity + 1)}
                            className="px-3 py-2 hover:bg-sand"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(key)}
                          className="text-[0.66rem] uppercase tracking-[0.14em] text-mute link-underline hover:text-ink"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/tienda"
              className="mt-7 inline-block text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline"
            >
              Seguir viendo
            </Link>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-line bg-paper p-7 lg:sticky lg:top-32">
              <h2 className="eyebrow">Resumen</h2>
              <div className="mt-6 flex items-baseline justify-between border-b border-line pb-5">
                <span className="text-[0.9rem] font-light">Subtotal</span>
                <span className="font-display text-2xl tabular-nums">
                  {formatCOP(subtotalCOP)}
                </span>
              </div>
              <p className="mt-5 text-[0.82rem] font-light leading-relaxed text-mute">
                {missing > 0 ? (
                  <>
                    Te faltan{" "}
                    <span className="text-espresso">{formatCOP(missing)}</span>{" "}
                    para envío gratis. El costo exacto se calcula en el
                    siguiente paso.
                  </>
                ) : (
                  "Tenés envío gratis en este pedido."
                )}
              </p>
              <Link
                href="/checkout"
                className="mt-7 block bg-ink py-4 text-center text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
              >
                Finalizar compra
              </Link>
              <p className="mt-4 text-center text-[0.72rem] font-light text-mute">
                Pago seguro con Wompi · Tarjeta, PSE y Nequi
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
