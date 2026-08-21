"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { formatCOP } from "@/lib/format";
import { lineKey, useCart } from "./CartProvider";

export default function CartDrawer({
  freeShippingThresholdCOP,
}: {
  freeShippingThresholdCOP: number;
}) {
  const { lines, open, setOpen, subtotalCOP, setQuantity, remove, count } =
    useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const missing = Math.max(0, freeShippingThresholdCOP - subtotalCOP);

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Cerrar carrito"
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-[0.7rem] uppercase tracking-[0.22em]">
            Tu carrito ({count})
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[0.7rem] uppercase tracking-[0.18em] text-mute hover:text-ink"
          >
            Cerrar
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-10 text-center">
            <p className="font-display text-3xl font-light">
              Todavía no hay nada acá
            </p>
            <p className="text-sm font-light text-mute">
              Empezá por las lámparas: es lo que más cambia una casa.
            </p>
            <Link
              href="/tienda"
              onClick={() => setOpen(false)}
              className="mt-2 border border-ink px-7 py-3 text-[0.68rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
            >
              Ver la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {missing > 0 ? (
                <p className="border-b border-line py-4 text-center text-[0.72rem] font-light text-mute">
                  Te faltan{" "}
                  <span className="text-espresso">{formatCOP(missing)}</span>{" "}
                  para envío gratis
                </p>
              ) : (
                <p className="border-b border-line py-4 text-center text-[0.72rem] font-light text-clay-deep">
                  Tenés envío gratis
                </p>
              )}
              <ul className="divide-y divide-line">
                {lines.map((l) => {
                  const key = lineKey(l);
                  return (
                    <li key={key} className="flex gap-4 py-5">
                      <Link
                        href={`/producto/${l.slug}`}
                        onClick={() => setOpen(false)}
                        className="relative h-28 w-22 shrink-0 overflow-hidden bg-sand"
                        style={{ width: "5.5rem" }}
                      >
                        {l.image ? (
                          <Image
                            src={l.image}
                            alt={l.name}
                            fill
                            sizes="88px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center font-display text-2xl text-clay/40">
                            C
                          </span>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/producto/${l.slug}`}
                          onClick={() => setOpen(false)}
                          className="font-display text-lg font-light leading-tight"
                        >
                          {l.name}
                        </Link>
                        {l.variant && (
                          <span className="mt-0.5 text-[0.72rem] font-light text-mute">
                            {l.variant}
                          </span>
                        )}
                        <span className="mt-0.5 text-[0.66rem] uppercase tracking-[0.14em] text-mute">
                          {l.deliveryLabel}
                        </span>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              aria-label="Quitar uno"
                              onClick={() => setQuantity(key, l.quantity - 1)}
                              className="px-2.5 py-1 text-sm hover:bg-sand"
                            >
                              −
                            </button>
                            <span className="min-w-7 text-center text-sm tabular-nums">
                              {l.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Agregar uno"
                              onClick={() => setQuantity(key, l.quantity + 1)}
                              className="px-2.5 py-1 text-sm hover:bg-sand"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm tabular-nums">
                            {formatCOP(l.unitPriceCOP * l.quantity)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(key)}
                          className="mt-2 self-start text-[0.62rem] uppercase tracking-[0.14em] text-mute underline-offset-4 hover:text-ink hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <footer className="border-t border-line px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.7rem] uppercase tracking-[0.2em]">
                  Subtotal
                </span>
                <span className="font-display text-2xl tabular-nums">
                  {formatCOP(subtotalCOP)}
                </span>
              </div>
              <p className="mt-1 text-[0.7rem] font-light text-mute">
                El envío se calcula en el checkout.
              </p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="mt-4 block bg-ink py-4 text-center text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
              >
                Finalizar compra
              </Link>
              <Link
                href="/carrito"
                onClick={() => setOpen(false)}
                className="mt-2 block py-2 text-center text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
              >
                Ver el carrito
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
