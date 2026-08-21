"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "—",
          email,
          phone: "—",
          city: "—",
          service: "Newsletter",
          source: "footer",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-4 text-[0.85rem] font-light text-bone">
        Listo. Te escribimos pronto.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex border-b border-bone/30">
      <label htmlFor="newsletter-email" className="sr-only">
        Tu correo
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        className="flex-1 bg-transparent py-2.5 text-[0.9rem] font-light text-bone placeholder:text-bone/40 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="pl-4 text-[0.68rem] uppercase tracking-[0.18em] text-bone/80 hover:text-bone disabled:opacity-50"
      >
        {state === "sending" ? "…" : "Enviar"}
      </button>
      {state === "error" && (
        <span className="sr-only">No se pudo enviar, intentá de nuevo.</span>
      )}
    </form>
  );
}
