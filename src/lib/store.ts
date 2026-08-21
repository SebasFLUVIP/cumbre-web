import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { supabase, supabaseConfigured } from "./supabase";
import type { Lead, Order, Product, PublicProduct, Settings } from "./types";

/**
 * Capa de persistencia con dos backends:
 *
 *   • Supabase (Postgres) cuando hay credenciales en el entorno. Es lo que se
 *     usa en producción: Vercel corre con el sistema de archivos en solo
 *     lectura, así que guardar en JSON ahí no funciona.
 *   • Archivos JSON en /data cuando no las hay. Sirve para trabajar en local
 *     sin depender de la red ni de una cuenta.
 *
 * El resto del código nunca sabe cuál está activo: llama a estas funciones y
 * listo. Cambiar de motor es reescribir solo este archivo.
 */

const onDb = () => supabaseConfigured();

// ─────────────────────────── Backend de archivos ───────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const file = (name: string) => path.join(DATA_DIR, `${name}.json`);

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file(name), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(name: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Escritura atómica: si el proceso muere a mitad no queda un JSON partido.
  const tmp = `${file(name)}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file(name));
}

// ────────────────────────────────── Ajustes ─────────────────────────────────

const DEFAULT_SETTINGS: Settings = {
  usdToCop: 4200,
  defaultMarkup: 3,
  amazonDeliveryDays: 8,
  freeShippingThresholdCOP: 800000,
  shippingBogotaCOP: 25000,
  shippingNacionalCOP: 45000,
  whatsapp: "573000000000",
  email: "hola@cumbredeco.com",
  instagram: "cumbre.decohome",
};

export async function getSettings(): Promise<Settings> {
  if (onDb()) {
    const { data } = await supabase()
      .from("settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    return { ...DEFAULT_SETTINGS, ...((data?.data as Settings) ?? {}) };
  }
  return { ...DEFAULT_SETTINGS, ...(await readJson("settings", {})) };
}

export async function saveSettings(s: Settings): Promise<void> {
  if (onDb()) {
    await supabase().from("settings").upsert({ id: 1, data: s });
    return;
  }
  await writeJson("settings", s);
}

// ───────────────────────────────── Productos ────────────────────────────────

/** Fila de Postgres → objeto de dominio. */
const rowToProduct = (row: { data: unknown }) => row.data as Product;

/** Objeto de dominio → fila, duplicando en columnas lo que se filtra. */
const productToRow = (p: Product) => ({
  id: p.id,
  slug: p.slug,
  category: p.category,
  active: p.active,
  price_cop: p.priceCOP,
  data: p,
  updated_at: new Date().toISOString(),
});

/** Catálogo completo, con datos de proveedor. Solo servidor y admin. */
export async function getAllProducts(): Promise<Product[]> {
  if (onDb()) {
    const { data, error } = await supabase()
      .from("products")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`No se pudo leer el catálogo: ${error.message}`);
    return (data ?? []).map(rowToProduct);
  }
  return readJson<Product[]>("catalog", []);
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (onDb()) {
    const db = supabase();
    const { data: existing } = await db.from("products").select("id");
    const keep = new Set(products.map((p) => p.id));
    const gone = (existing ?? []).map((r) => r.id as string).filter((id) => !keep.has(id));
    if (gone.length) await db.from("products").delete().in("id", gone);
    if (products.length) {
      const { error } = await db.from("products").upsert(products.map(productToRow));
      if (error) throw new Error(`No se pudo guardar el catálogo: ${error.message}`);
    }
    return;
  }
  await writeJson("catalog", products);
}

/**
 * Quita el bloque `supplier` antes de que un producto cruce hacia el navegador.
 * El link de compra y el costo son internos: si viajan al cliente quedan en el
 * bundle de JS y cualquiera los puede leer.
 */
export function toPublicProduct(p: Product): PublicProduct {
  const { supplier: _supplier, ...rest } = p;
  void _supplier;
  return rest;
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.active).map(toPublicProduct);
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  if (onDb()) {
    const { data } = await supabase()
      .from("products")
      .select("data")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    return data ? toPublicProduct(rowToProduct(data)) : null;
  }
  const all = await getAllProducts();
  const found = all.find((p) => p.slug === slug && p.active);
  return found ? toPublicProduct(found) : null;
}

/** Versión con proveedor. Solo la usa el admin. */
export async function getRawProductById(id: string): Promise<Product | null> {
  if (onDb()) {
    const { data } = await supabase()
      .from("products")
      .select("data")
      .eq("id", id)
      .maybeSingle();
    return data ? rowToProduct(data) : null;
  }
  const all = await getAllProducts();
  return all.find((p) => p.id === id) ?? null;
}

// ─────────────────────────────────── Pedidos ────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  if (onDb()) {
    const { data } = await supabase()
      .from("orders")
      .select("data")
      .order("created_at", { ascending: false });
    return (data ?? []).map((r) => r.data as Order);
  }
  return readJson<Order[]>("orders", []);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  if (onDb()) {
    if (orders.length) {
      await supabase().from("orders").upsert(
        orders.map((o) => ({
          id: o.id,
          reference: o.reference,
          status: o.status,
          total_cop: o.totalCOP,
          data: o,
        }))
      );
    }
    return;
  }
  await writeJson("orders", orders);
}

export async function addOrder(order: Order): Promise<void> {
  if (onDb()) {
    const { error } = await supabase().from("orders").insert({
      id: order.id,
      reference: order.reference,
      status: order.status,
      total_cop: order.totalCOP,
      data: order,
    });
    if (error) throw new Error(`No se pudo registrar el pedido: ${error.message}`);
    return;
  }
  const orders = await getOrders();
  orders.unshift(order);
  await saveOrders(orders);
}

// ──────────────────────────────────── Leads ─────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  if (onDb()) {
    const { data } = await supabase()
      .from("leads")
      .select("data")
      .order("created_at", { ascending: false });
    return (data ?? []).map((r) => r.data as Lead);
  }
  return readJson<Lead[]>("leads", []);
}

export async function saveLeads(leads: Lead[]): Promise<void> {
  if (onDb()) {
    if (leads.length) {
      await supabase()
        .from("leads")
        .upsert(leads.map((l) => ({ id: l.id, status: l.status, data: l })));
    }
    return;
  }
  await writeJson("leads", leads);
}

export async function addLead(lead: Lead): Promise<void> {
  if (onDb()) {
    const { error } = await supabase()
      .from("leads")
      .insert({ id: lead.id, status: lead.status, data: lead });
    if (error) throw new Error(`No se pudo registrar la consulta: ${error.message}`);
    return;
  }
  const leads = await getLeads();
  leads.unshift(lead);
  await saveLeads(leads);
}

/** Para mostrar en el admin de qué motor está leyendo el sitio. */
export function storageBackend(): "supabase" | "archivos" {
  return onDb() ? "supabase" : "archivos";
}
