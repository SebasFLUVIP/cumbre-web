"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/actions";

/**
 * Eliminar es irreversible, así que pide confirmación antes de enviar el
 * formulario. No se puede usar `confirm()` en un server component, por eso
 * este botón es la única parte cliente de la fila.
 */
export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
          return;
        }
        const fd = new FormData();
        fd.set("id", id);
        startTransition(() => {
          deleteProduct(fd);
        });
      }}
      className="text-[0.68rem] uppercase tracking-[0.14em] text-clay-deep hover:text-ink disabled:opacity-50"
    >
      {pending ? "…" : "Eliminar"}
    </button>
  );
}
