"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { formatCOP } from "@/lib/format";
import { useCart } from "./CartProvider";

const DEPARTAMENTOS = [
  "Cundinamarca",
  "Bogotá D.C.",
  "Antioquia",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Cauca",
  "Cesar",
  "Córdoba",
  "Huila",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Quindío",
  "Risaralda",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Otro",
];

const field =
  "w-full border-b border-line bg-transparent py-3 text-[0.92rem] font-light " +
  "placeholder:text-mute/60 focus:border-clay focus:outline-none";
const label = "eyebrow block";

type Settings = {
  freeShippingThresholdCOP: number;
  shippingBogotaCOP: number;
  shippingNacionalCOP: number;
  whatsapp: string;
};

export default function CheckoutClient({
  settings,
  gatewayReady,
  sandbox,
}: {
  settings: Settings;
  gatewayReady: boolean;
  sandbox: boolean;
}) {
  const { lines, subtotalCOP, ready } = useCart();
  const [city, setCity] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = useMemo(() => {
    if (subtotalCOP >= settings.freeShippingThresholdCOP) return 0;
    if (!city) return null;
    const n = city.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return n.includes("bogota")
      ? settings.shippingBogotaCOP
      : settings.shippingNacionalCOP;
  }, [city, subtotalCOP, settings]);

  const total = subtotalCOP + (shipping ?? 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as Record<string, string>;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items: lines.map((l) => ({
            productId: l.productId,
            variant: l.variant,
            quantity: l.quantity,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo iniciar el pago");
      // El carrito se limpia al volver aprobado, no acá: si el usuario
      // abandona el pago en Wompi debe encontrar su carrito intacto.
      window.location.href = json.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setSending(false);
    }
  }

  if (ready && lines.length === 0) {
    return (
      <div className="shell py-28 text-center">
        <h1 className="display text-[2.5rem]">Tu carrito está vacío</h1>
        <Link
          href="/tienda"
          className="mt-8 inline-block bg-ink px-9 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-14 md:py-20">
      <h1 className="display text-[2.4rem] md:text-[3.2rem]">Finalizar compra</h1>

      {!gatewayReady && (
        <p className="mt-6 border border-clay/40 bg-clay/5 px-5 py-4 text-[0.85rem] font-light leading-relaxed text-clay-deep">
          La pasarela de pagos todavía no tiene las llaves de Wompi cargadas.
          Agregalas en <code className="font-mono text-[0.8rem]">.env.local</code>{" "}
          para poder cobrar. Mientras tanto, podés recibir el pedido por
          WhatsApp.
        </p>
      )}
      {gatewayReady && sandbox && (
        <p className="mt-6 border border-line bg-sand/50 px-5 py-3 text-[0.8rem] font-light text-mute">
          Modo de pruebas de Wompi: ningún cobro es real.
        </p>
      )}

      <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-16">
        <form onSubmit={onSubmit} className="lg:col-span-7">
          <section>
            <h2 className="font-display text-2xl font-light">Tus datos</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="ck-name">Nombre completo</label>
                <input id="ck-name" name="name" required className={field} />
              </div>
              <div>
                <label className={label} htmlFor="ck-email">Correo</label>
                <input id="ck-email" name="email" type="email" required className={field} />
              </div>
              <div>
                <label className={label} htmlFor="ck-phone">Celular</label>
                <input id="ck-phone" name="phone" inputMode="tel" required className={field} placeholder="300 000 0000" />
              </div>
              <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                <div>
                  <label className={label} htmlFor="ck-doctype">Doc.</label>
                  <select id="ck-doctype" name="docType" defaultValue="CC" className={field}>
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="NIT">NIT</option>
                    <option value="PP">PP</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="ck-docnumber">Número</label>
                  <input id="ck-docnumber" name="docNumber" required className={field} />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-light">Envío</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ck-address">Dirección</label>
                <input
                  id="ck-address"
                  name="address"
                  required
                  className={field}
                  placeholder="Calle 00 # 00 - 00, apto 000"
                />
              </div>
              <div>
                <label className={label} htmlFor="ck-city">Ciudad o municipio</label>
                <input
                  id="ck-city"
                  name="city"
                  required
                  className={field}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bogotá"
                />
              </div>
              <div>
                <label className={label} htmlFor="ck-department">Departamento</label>
                <select id="ck-department" name="department" defaultValue="" required className={field}>
                  <option value="" disabled>Elegí uno</option>
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="ck-notes">Indicaciones para la entrega</label>
                <textarea
                  id="ck-notes"
                  name="notes"
                  rows={3}
                  className={`${field} resize-none`}
                  placeholder="Conjunto, portería, horario en que hay alguien…"
                />
              </div>
            </div>
          </section>

          {error && (
            <p role="alert" className="mt-8 border border-clay/40 bg-clay/5 px-5 py-4 text-[0.85rem] text-clay-deep">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending || !gatewayReady}
            className="mt-10 w-full bg-ink py-5 text-[0.72rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-14"
          >
            {sending ? "Abriendo el pago…" : "Ir a pagar"}
          </button>
          <p className="mt-4 text-[0.78rem] font-light text-mute">
            Te llevamos a Wompi para completar el pago con tarjeta, PSE, Nequi o
            Bancolombia. Volvés acá apenas termine.
          </p>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline"
          >
            ¿Preferís pedir por WhatsApp?
          </a>
        </form>

        <aside className="lg:col-span-5">
          <div className="border border-line bg-paper p-7 lg:sticky lg:top-32">
            <h2 className="eyebrow">Tu pedido</h2>
            <ul className="mt-6 divide-y divide-line">
              {lines.map((l) => (
                <li key={`${l.productId}${l.variant ?? ""}`} className="flex gap-4 py-4">
                  <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden bg-sand">
                    {l.image ? (
                      <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center font-display text-lg text-clay/40">C</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[0.88rem] font-light leading-snug">
                      {l.name}
                      {l.variant && <span className="text-mute"> · {l.variant}</span>}
                    </p>
                    <p className="mt-0.5 text-[0.72rem] text-mute">
                      {l.quantity} × {formatCOP(l.unitPriceCOP)}
                    </p>
                    <p className="mt-0.5 text-[0.66rem] uppercase tracking-[0.14em] text-mute">
                      {l.deliveryLabel}
                    </p>
                  </div>
                  <span className="text-[0.88rem] tabular-nums">
                    {formatCOP(l.unitPriceCOP * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-[0.88rem] font-light">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatCOP(subtotalCOP)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Envío</dt>
                <dd className="tabular-nums">
                  {shipping === null
                    ? "Poné tu ciudad"
                    : shipping === 0
                      ? "Gratis"
                      : formatCOP(shipping)}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
              <span className="text-[0.7rem] uppercase tracking-[0.2em]">Total</span>
              <span className="font-display text-3xl tabular-nums">
                {formatCOP(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
