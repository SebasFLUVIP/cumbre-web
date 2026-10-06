"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/admin/actions";
import SubmitButton from "./SubmitButton";

/**
 * Eliminar es irreversible, así que pide confirmación en la misma fila. No usa
 * window.confirm: el navegador puede silenciar esos cuadros y el botón
 * parecería no hacer nada.
 */
export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="text-[0.68rem] uppercase tracking-[0.14em] text-clay-deep hover:text-ink"
      >
        Eliminar
      </button>
    );
  }

  return (
    <form action={deleteProduct} className="flex items-center gap-3">
      <input type="hidden" name="id" value={id} />
      <span className="text-[0.72rem] font-light text-mute" title={name}>
        ¿Seguro?
      </span>
      <SubmitButton
        pendingLabel="Eliminando…"
        className="text-[0.68rem] uppercase tracking-[0.14em] text-clay-deep hover:text-ink disabled:opacity-50"
      >
        Sí, eliminar
      </SubmitButton>
      <button
        type="button"
        onClick={() => setAsking(false)}
        className="text-[0.68rem] uppercase tracking-[0.14em] text-mute hover:text-ink"
      >
        Cancelar
      </button>
    </form>
  );
}
