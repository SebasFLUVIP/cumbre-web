import "server-only";
import { createHash } from "node:crypto";

/**
 * Integración con Wompi (pasarela colombiana: tarjeta, PSE, Nequi, Bancolombia).
 *
 * Se usa el Web Checkout: el navegador se redirige a checkout.wompi.co con los
 * datos del pedido firmados. La firma de integridad impide que alguien altere
 * el monto en la URL antes de pagar.
 *
 * Variables de entorno (ver .env.example):
 *   NEXT_PUBLIC_WOMPI_PUBLIC_KEY  llave pública, viaja al navegador
 *   WOMPI_INTEGRITY_SECRET        secreto de integridad, solo servidor
 *   WOMPI_EVENTS_SECRET           secreto de eventos, valida el webhook
 *   NEXT_PUBLIC_SITE_URL          URL pública, para el redirect de vuelta
 */

export const WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/p/";

export function wompiConfig() {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET ?? "";
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET ?? "";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const isTest = publicKey.startsWith("pub_test_");
  return {
    publicKey,
    integritySecret,
    eventsSecret,
    siteUrl,
    isTest,
    /** Sin llaves configuradas el checkout no puede cobrar de verdad. */
    // Los placeholders de .env.example contienen X repetidas; si alguien
    // despliega sin cambiarlos, hay que tratarlo como "no configurado" en vez
    // de deja pasar al cliente a un checkout con llaves falsas.
    configured: Boolean(
      publicKey &&
        integritySecret &&
        !publicKey.includes("X") &&
        !integritySecret.includes("X")
    ),
  };
}

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

/** SHA256(reference + amountInCents + currency + secretoDeIntegridad) */
export function integritySignature(
  reference: string,
  amountInCents: number,
  currency = "COP"
): string {
  const { integritySecret } = wompiConfig();
  return sha256(`${reference}${amountInCents}${currency}${integritySecret}`);
}

export function buildCheckoutUrl(input: {
  reference: string;
  amountInCents: number;
  customerEmail: string;
  fullName?: string;
  phoneNumber?: string;
  legalId?: string;
  legalIdType?: string;
  address?: string;
  city?: string;
  region?: string;
}): string {
  const { publicKey, siteUrl } = wompiConfig();
  const currency = "COP";
  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(input.amountInCents),
    reference: input.reference,
    "signature:integrity": integritySignature(
      input.reference,
      input.amountInCents,
      currency
    ),
    "redirect-url": `${siteUrl}/pedido/confirmacion`,
    "customer-data:email": input.customerEmail,
  });

  if (input.fullName) params.set("customer-data:full-name", input.fullName);
  if (input.phoneNumber) {
    params.set("customer-data:phone-number", input.phoneNumber);
    params.set("customer-data:phone-number-prefix", "+57");
  }
  if (input.legalId) params.set("customer-data:legal-id", input.legalId);
  if (input.legalIdType)
    params.set("customer-data:legal-id-type", input.legalIdType);
  if (input.address) {
    params.set("shipping-address:address-line-1", input.address);
    params.set("shipping-address:country", "CO");
    params.set("shipping-address:phone-number", input.phoneNumber ?? "");
    if (input.city) params.set("shipping-address:city", input.city);
    if (input.region) params.set("shipping-address:region", input.region);
  }

  return `${WOMPI_CHECKOUT_URL}?${params.toString()}`;
}

/**
 * El webhook de Wompi firma cada evento concatenando los valores de las
 * propiedades que él mismo lista en `signature.properties`, más el timestamp
 * y el secreto de eventos.
 */
export function verifyEventSignature(event: {
  data?: { transaction?: Record<string, unknown> };
  signature?: { checksum?: string; properties?: string[] };
  timestamp?: number;
}): boolean {
  const { eventsSecret } = wompiConfig();
  const checksum = event.signature?.checksum;
  const properties = event.signature?.properties;
  if (!eventsSecret || !checksum || !properties) return false;

  const source = event.data?.transaction as Record<string, unknown> | undefined;
  if (!source) return false;

  const concatenated = properties
    .map((path) => {
      // Las rutas llegan como "transaction.amount_in_cents".
      const parts = path.split(".").slice(1);
      let cur: unknown = source;
      for (const part of parts) {
        cur = (cur as Record<string, unknown> | undefined)?.[part];
      }
      return String(cur ?? "");
    })
    .join("");

  const expected = sha256(`${concatenated}${event.timestamp}${eventsSecret}`);
  return expected.toLowerCase() === checksum.toLowerCase();
}

export type WompiTransaction = {
  id: string;
  status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
  reference: string;
  amount_in_cents: number;
  payment_method_type?: string;
};

export async function fetchTransaction(
  id: string
): Promise<WompiTransaction | null> {
  const { isTest } = wompiConfig();
  const base = isTest
    ? "https://api-sandbox.co.uat.wompi.dev/v1"
    : "https://production.wompi.co/v1";
  try {
    const res = await fetch(`${base}/transactions/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: WompiTransaction };
    return json.data ?? null;
  } catch {
    return null;
  }
}
