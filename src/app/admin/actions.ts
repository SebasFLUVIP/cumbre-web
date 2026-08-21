"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  getAllProducts,
  getLeads,
  getOrders,
  getSettings,
  saveLeads,
  saveOrders,
  saveProducts,
  saveSettings,
} from "@/lib/store";
import { slugifyText } from "@/lib/format";
import type { CategoryId, Order, Product, Settings } from "@/lib/types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const raw = str(fd, k).replace(/[^\d.-]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};
const list = (fd: FormData, k: string) =>
  str(fd, k)
    .split(/\r?\n|·|,/)
    .map((x) => x.trim())
    .filter(Boolean);

/** Extrae el ASIN de cualquier forma de URL de Amazon. */
export async function asinFromUrl(url: string): Promise<string | undefined> {
  return (url.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i) ?? [])[1];
}

/** precio de venta = costo USD × TRM × margen, redondeado a la decena de mil. */
export async function suggestedPrice(
  cost: { usd?: number; cop?: number },
  settings: Settings,
  markup?: number
): Promise<number> {
  const m = markup && markup > 0 ? markup : settings.defaultMarkup;
  const base = cost.cop && cost.cop > 0 ? cost.cop : (cost.usd ?? 0) * settings.usdToCop;
  return Math.round((base * m) / 1000) * 1000;
}

export async function upsertProduct(formData: FormData) {
  await requireAdmin();

  const products = await getAllProducts();
  const settings = await getSettings();
  const id = str(formData, "id");
  const existing = id ? products.find((p) => p.id === id) : undefined;

  const name = str(formData, "name");
  if (!name) throw new Error("El nombre es obligatorio");

  const supplierUrl = str(formData, "supplierUrl");
  const costUSD = num(formData, "supplierCostUSD");
  const markup = num(formData, "markup");

  // Si viene costo y no se fijó un precio manual, se calcula con TRM × margen.
  const costCOP = num(formData, "supplierCostCOP");
  const manualPrice = num(formData, "priceCOP");
  const priceCOP =
    manualPrice > 0
      ? manualPrice
      : costUSD > 0 || costCOP > 0
        ? await suggestedPrice({ usd: costUSD, cop: costCOP }, settings, markup)
        : (existing?.priceCOP ?? 0);

  const deliveryKind = str(formData, "deliveryKind") === "inmediata" ? "inmediata" : "dias";
  const deliveryDays = num(formData, "deliveryDays");

  const stockRaw = str(formData, "stock");
  const stock = stockRaw === "" ? null : Math.max(0, Math.floor(Number(stockRaw) || 0));

  const variantNames = list(formData, "variants");

  const product: Product = {
    id: existing?.id ?? `p_${Date.now().toString(36)}`,
    slug: str(formData, "slug") || slugifyText(name),
    name,
    category: (str(formData, "category") || "objetos") as CategoryId,
    subcategory: str(formData, "subcategory") || undefined,
    excerpt: str(formData, "excerpt"),
    description: str(formData, "description"),
    images: list(formData, "images"),
    priceCOP,
    compareAtCOP: num(formData, "compareAtCOP") || undefined,
    delivery:
      deliveryKind === "inmediata"
        ? { kind: "inmediata" }
        : { kind: "dias", days: deliveryDays > 0 ? deliveryDays : 15 },
    stock,
    madeToOrder: formData.get("madeToOrder") === "on",
    materials: list(formData, "materials"),
    dimensions: str(formData, "dimensions") || undefined,
    care: str(formData, "care") || undefined,
    variants: variantNames.length
      ? variantNames.map((v) => {
          // Formato aceptado: "Nombre | +180000"  ó  "Nombre"
          const [n, delta] = v.split("|").map((x) => x.trim());
          const d = Number((delta ?? "").replace(/[^\d.-]/g, ""));
          return { name: n, priceDeltaCOP: Number.isFinite(d) && d !== 0 ? d : undefined };
        })
      : undefined,
    markup: markup > 0 ? markup : existing?.markup,
    tags: list(formData, "tags"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    supplier: supplierUrl
      ? {
          name: str(formData, "supplierName") || "Amazon",
          url: supplierUrl,
          sku: await asinFromUrl(supplierUrl),
          costUSD: costUSD || undefined,
          costCOP: costCOP || undefined,
          notes: str(formData, "supplierNotes") || undefined,
        }
      : undefined,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  const next = existing
    ? products.map((p) => (p.id === existing.id ? product : p))
    : [product, ...products];

  await saveProducts(next);
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  revalidatePath(`/tienda/${product.category}`);
  if (existing && existing.category !== product.category) {
    revalidatePath(`/tienda/${existing.category}`);
  }
  revalidatePath(`/producto/${product.slug}`);
  if (product.featured || existing?.featured) revalidatePath("/");
  redirect("/admin/productos?guardado=1");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const products = await getAllProducts();
  const removed = products.find((p) => p.id === id);
  await saveProducts(products.filter((p) => p.id !== id));
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  if (removed) revalidatePath(`/tienda/${removed.category}`);
  if (removed?.featured) revalidatePath("/");
  redirect("/admin/productos?eliminado=1");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const products = await getAllProducts();
  await saveProducts(
    products.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
  );
  const toggled = products.find((p) => p.id === id);
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  if (toggled) revalidatePath(`/tienda/${toggled.category}`);
  if (toggled?.featured) revalidatePath("/");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as Order["status"];
  const orders = await getOrders();
  await saveOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  revalidatePath("/admin/pedidos");
}

export async function updateLeadStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "nuevo"
    | "contactado"
    | "cotizado"
    | "ganado"
    | "perdido";
  const leads = await getLeads();
  await saveLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  revalidatePath("/admin/leads");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const current = await getSettings();
  const next: Settings = {
    usdToCop: num(formData, "usdToCop") || current.usdToCop,
    defaultMarkup: num(formData, "defaultMarkup") || current.defaultMarkup,
    amazonDeliveryDays:
      num(formData, "amazonDeliveryDays") || current.amazonDeliveryDays,
    freeShippingThresholdCOP:
      num(formData, "freeShippingThresholdCOP") || current.freeShippingThresholdCOP,
    shippingBogotaCOP: num(formData, "shippingBogotaCOP"),
    shippingNacionalCOP: num(formData, "shippingNacionalCOP"),
    whatsapp: str(formData, "whatsapp").replace(/\D/g, "") || current.whatsapp,
    email: str(formData, "email") || current.email,
    instagram: str(formData, "instagram").replace(/^@/, "") || current.instagram,
    calendarUrl: str(formData, "calendarUrl") || undefined,
  };
  await saveSettings(next);
  revalidatePath("/admin/ajustes");
  revalidatePath("/", "layout");
  redirect("/admin/ajustes?guardado=1");
}

/**
 * Recalcula el precio de todos los productos con costo en dólares usando la TRM
 * y el margen vigentes. Útil cuando se mueve el dólar.
 */
export async function repriceFromUSD() {
  await requireAdmin();
  const [products, settings] = await Promise.all([getAllProducts(), getSettings()]);
  const next = await Promise.all(
    products.map(async (p) =>
      p.supplier?.costUSD || p.supplier?.costCOP
        ? {
            ...p,
            priceCOP: await suggestedPrice(
              { usd: p.supplier.costUSD, cop: p.supplier.costCOP },
              settings,
              p.markup
            ),
          }
        : p
    )
  );
  await saveProducts(next);
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
  for (const cat of new Set(next.map((p) => p.category))) {
    revalidatePath(`/tienda/${cat}`);
  }
  redirect("/admin/productos?repreciado=1");
}
