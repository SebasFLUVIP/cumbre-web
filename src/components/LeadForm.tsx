"use client";

import { useState } from "react";

const CIUDADES = [
  "Bogotá",
  "Chía / Cajicá / Sabana",
  "Anapoima",
  "Villeta",
  "Melgar / Girardot",
  "Otra ciudad de Colombia",
  "Estoy fuera del país",
];

const SERVICIOS = [
  "Proyecto integral de interiorismo",
  "Asesoría de diseño (una visita)",
  "Remodelación",
  "Muebles a medida",
  "Decoración de un solo espacio",
  "Todavía no sé, quiero orientación",
];

const PRESUPUESTOS = [
  "Menos de $20 millones",
  "$20 – $50 millones",
  "$50 – $120 millones",
  "$120 – $300 millones",
  "Más de $300 millones",
  "Prefiero que me orienten",
];

const TIEMPOS = [
  "Lo antes posible",
  "En los próximos 3 meses",
  "En 3 a 6 meses",
  "Este año",
  "Estoy explorando",
];

const field =
  "w-full border-b border-line bg-transparent py-3 text-[0.92rem] font-light " +
  "placeholder:text-mute/60 focus:border-clay focus:outline-none";
const label = "eyebrow block";

export default function LeadForm({
  source,
  compact = false,
  defaultService,
}: {
  source: string;
  compact?: boolean;
  defaultService?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      if (!res.ok) throw new Error("fallo");
      setState("done");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-3xl font-light">Gracias, ya nos llegó</p>
        <p className="mx-auto mt-4 max-w-sm text-[0.92rem] font-light leading-relaxed text-mute">
          Te respondemos en menos de 24 horas hábiles con una propuesta de
          alcance y un rango de inversión.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className={label} htmlFor="lf-name">
          Nombre
        </label>
        <input id="lf-name" name="name" required className={field} placeholder="Tu nombre" />
      </div>

      <div className="sm:col-span-1">
        <label className={label} htmlFor="lf-phone">
          WhatsApp
        </label>
        <input
          id="lf-phone"
          name="phone"
          required
          inputMode="tel"
          className={field}
          placeholder="300 000 0000"
        />
      </div>

      <div className="sm:col-span-1">
        <label className={label} htmlFor="lf-email">
          Correo
        </label>
        <input
          id="lf-email"
          name="email"
          type="email"
          required
          className={field}
          placeholder="tu@correo.com"
        />
      </div>

      <div className="sm:col-span-1">
        <label className={label} htmlFor="lf-city">
          Dónde queda el proyecto
        </label>
        <select id="lf-city" name="city" required defaultValue="" className={field}>
          <option value="" disabled>
            Elegí una opción
          </option>
          {CIUDADES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={label} htmlFor="lf-service">
          Qué necesitás
        </label>
        <select
          id="lf-service"
          name="service"
          required
          defaultValue={defaultService ?? ""}
          className={field}
        >
          <option value="" disabled>
            Elegí una opción
          </option>
          {SERVICIOS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {!compact && (
        <>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="lf-spaces">
              Qué espacios
            </label>
            <input
              id="lf-spaces"
              name="spaces"
              className={field}
              placeholder="Sala y comedor, cocina, dos habitaciones, terraza…"
            />
          </div>

          <div className="sm:col-span-1">
            <label className={label} htmlFor="lf-budget">
              Inversión estimada
            </label>
            <select id="lf-budget" name="budget" defaultValue="" className={field}>
              <option value="" disabled>
                Elegí un rango
              </option>
              {PRESUPUESTOS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className={label} htmlFor="lf-timeline">
              Cuándo querés empezar
            </label>
            <select id="lf-timeline" name="timeline" defaultValue="" className={field}>
              <option value="" disabled>
                Elegí una opción
              </option>
              {TIEMPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="sm:col-span-2">
        <label className={label} htmlFor="lf-message">
          Contanos un poco más
        </label>
        <textarea
          id="lf-message"
          name="message"
          rows={compact ? 2 : 4}
          className={`${field} resize-none`}
          placeholder="El tamaño del espacio, si hay obra de por medio, qué te gustaría lograr…"
        />
      </div>

      {/* Trampa para bots: un humano nunca la ve ni la llena. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="sm:col-span-2 flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="bg-ink px-9 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso disabled:opacity-60"
        >
          {state === "sending" ? "Enviando…" : "Enviar"}
        </button>
        <p className="text-[0.72rem] font-light text-mute">
          Respondemos en menos de 24 horas hábiles.
        </p>
        {state === "error" && (
          <p role="alert" className="text-[0.8rem] text-clay-deep">
            No se pudo enviar. Probá de nuevo o escribinos por WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
