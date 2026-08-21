import type { Delivery, Product, PublicProduct } from "./types";

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  // Intl mete un espacio duro despues del simbolo; lo dejamos mas compacto.
  return COP.format(value).replace(/\s/g, " ").replace("COP ", "$ ");
}

export function deliveryLabel(d: Delivery): string {
  if (d.kind === "inmediata") return "Entrega inmediata";
  const days = d.days ?? 15;
  return `Entrega en ${days} días hábiles`;
}

export function deliveryShort(d: Delivery): string {
  if (d.kind === "inmediata") return "Inmediata";
  return `${d.days ?? 15} días`;
}

export function variantPrice(
  p: Product | PublicProduct,
  variantName?: string
): number {
  if (!variantName) return p.priceCOP;
  const v = p.variants?.find((x) => x.name === variantName);
  return p.priceCOP + (v?.priceDeltaCOP ?? 0);
}

export function slugifyText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
