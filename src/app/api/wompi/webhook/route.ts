import { NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/store";
import { verifyEventSignature } from "@/lib/wompi";

export const runtime = "nodejs";

const STATUS_MAP: Record<string, "aprobado" | "rechazado" | "pendiente"> = {
  APPROVED: "aprobado",
  DECLINED: "rechazado",
  VOIDED: "rechazado",
  ERROR: "rechazado",
  PENDING: "pendiente",
};

/**
 * Wompi llama acá cuando cambia el estado de una transacción. Es la única
 * fuente confiable del resultado del pago: la redirección del navegador puede
 * perderse o ser manipulada, el webhook viene firmado.
 *
 * Configurar la URL en el panel de Wompi:
 *   https://TU-DOMINIO/api/wompi/webhook
 */
export async function POST(req: Request) {
  let event: {
    event?: string;
    data?: { transaction?: Record<string, unknown> };
    signature?: { checksum?: string; properties?: string[] };
    timestamp?: number;
  };
  try {
    event = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!verifyEventSignature(event)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  const tx = event.data?.transaction;
  const reference = String(tx?.reference ?? "");
  const status = String(tx?.status ?? "");
  if (!reference) return NextResponse.json({ ok: true });

  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.reference === reference);
  if (idx === -1) return NextResponse.json({ ok: true });

  // Un pedido ya despachado no vuelve atrás por un evento tardío.
  if (["enviado", "entregado"].includes(orders[idx].status)) {
    return NextResponse.json({ ok: true });
  }

  orders[idx] = {
    ...orders[idx],
    status: STATUS_MAP[status] ?? orders[idx].status,
    wompiTransactionId: String(tx?.id ?? orders[idx].wompiTransactionId ?? ""),
  };
  await saveOrders(orders);

  return NextResponse.json({ ok: true });
}
