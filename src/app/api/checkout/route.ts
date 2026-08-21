import { NextResponse } from "next/server";
import { addOrder, getAllProducts, getSettings } from "@/lib/store";
import { variantPrice } from "@/lib/format";
import { buildCheckoutUrl, wompiConfig } from "@/lib/wompi";
import type { Order, OrderItem } from "@/lib/types";

export const runtime = "nodejs";

type IncomingItem = { productId: string; variant?: string; quantity: number };

const str = (v: unknown, max = 200) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export function shippingFor(
  subtotalCOP: number,
  city: string,
  s: { freeShippingThresholdCOP: number; shippingBogotaCOP: number; shippingNacionalCOP: number }
): number {
  if (subtotalCOP >= s.freeShippingThresholdCOP) return 0;
  const normalized = city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return normalized.includes("bogota") ? s.shippingBogotaCOP : s.shippingNacionalCOP;
}

export async function POST(req: Request) {
  const cfg = wompiConfig();
  if (!cfg.configured) {
    return NextResponse.json(
      {
        error:
          "La pasarela de pagos todavía no tiene llaves configuradas. Agregá NEXT_PUBLIC_WOMPI_PUBLIC_KEY y WOMPI_INTEGRITY_SECRET en .env.local.",
      },
      { status: 503 }
    );
  }

  let body: { customer?: Record<string, unknown>; items?: IncomingItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const c = body.customer ?? {};
  const customer: Order["customer"] = {
    name: str(c.name, 120),
    email: str(c.email, 160),
    phone: str(c.phone, 40),
    docType: str(c.docType, 8) || "CC",
    docNumber: str(c.docNumber, 40),
    address: str(c.address, 250),
    city: str(c.city, 80),
    department: str(c.department, 80),
    notes: str(c.notes, 800) || undefined,
  };

  if (
    !customer.name ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email) ||
    !customer.phone ||
    !customer.address ||
    !customer.city
  ) {
    return NextResponse.json(
      { error: "Faltan datos de envío obligatorios" },
      { status: 400 }
    );
  }

  const incoming = Array.isArray(body.items) ? body.items : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  // Los precios se recalculan contra el catálogo del servidor. Lo que mande el
  // navegador es solo qué producto y cuántos: nunca cuánto cuesta.
  const [catalog, settings] = await Promise.all([getAllProducts(), getSettings()]);
  const items: OrderItem[] = [];

  for (const raw of incoming) {
    const product = catalog.find((p) => p.id === raw.productId && p.active);
    if (!product) {
      return NextResponse.json(
        { error: `Un producto del carrito ya no está disponible` },
        { status: 409 }
      );
    }
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(raw.quantity) || 1)));
    if (product.stock !== null && quantity > product.stock) {
      return NextResponse.json(
        { error: `No hay suficiente inventario de ${product.name}` },
        { status: 409 }
      );
    }
    const variant = raw.variant
      ? product.variants?.find((v) => v.name === raw.variant)?.name
      : undefined;

    items.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variant,
      quantity,
      unitPriceCOP: variantPrice(product, variant),
    });
  }

  const subtotalCOP = items.reduce((n, i) => n + i.unitPriceCOP * i.quantity, 0);
  const shippingCOP = shippingFor(subtotalCOP, customer.city, settings);
  const totalCOP = subtotalCOP + shippingCOP;

  const reference = `CUMBRE-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

  const order: Order = {
    id: `o_${Date.now().toString(36)}`,
    reference,
    createdAt: new Date().toISOString(),
    status: "pendiente",
    customer,
    items,
    subtotalCOP,
    shippingCOP,
    totalCOP,
  };

  await addOrder(order);

  const checkoutUrl = buildCheckoutUrl({
    reference,
    amountInCents: totalCOP * 100,
    customerEmail: customer.email,
    fullName: customer.name,
    phoneNumber: customer.phone.replace(/\D/g, ""),
    legalId: customer.docNumber || undefined,
    legalIdType: customer.docType,
    address: customer.address,
    city: customer.city,
    region: customer.department,
  });

  return NextResponse.json({ ok: true, reference, totalCOP, checkoutUrl });
}
