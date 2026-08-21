/**
 * Sube a Supabase lo que hoy vive en /data.
 *
 *   1. Correr primero supabase/schema.sql en el SQL Editor de Supabase.
 *   2. Poner NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local
 *   3. node --env-file=.env.local scripts/migrate-to-supabase.mjs
 *
 * Es idempotente: se puede correr las veces que haga falta.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Corré:  node --env-file=.env.local scripts/migrate-to-supabase.mjs"
  );
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const leer = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null);

async function main() {
  const settings = leer("data/settings.json");
  if (settings) {
    const { error } = await db.from("settings").upsert({ id: 1, data: settings });
    if (error) throw error;
    console.log("ajustes      ✓");
  }

  const products = leer("data/catalog.json") ?? [];
  if (products.length) {
    const { error } = await db.from("products").upsert(
      products.map((p) => ({
        id: p.id,
        slug: p.slug,
        category: p.category,
        active: p.active,
        price_cop: p.priceCOP,
        data: p,
        created_at: p.createdAt,
      }))
    );
    if (error) throw error;
    console.log(`productos    ✓  ${products.length}`);
  }

  const orders = leer("data/orders.json") ?? [];
  if (orders.length) {
    const { error } = await db.from("orders").upsert(
      orders.map((o) => ({
        id: o.id,
        reference: o.reference,
        status: o.status,
        total_cop: o.totalCOP,
        data: o,
        created_at: o.createdAt,
      }))
    );
    if (error) throw error;
    console.log(`pedidos      ✓  ${orders.length}`);
  }

  const leads = leer("data/leads.json") ?? [];
  if (leads.length) {
    const { error } = await db.from("leads").upsert(
      leads.map((l) => ({ id: l.id, status: l.status, data: l, created_at: l.createdAt }))
    );
    if (error) throw error;
    console.log(`leads        ✓  ${leads.length}`);
  }

  console.log("\nListo. Ya podés desplegar con las mismas variables en Vercel.");
}

main().catch((e) => {
  console.error("Falló la migración:", e.message ?? e);
  process.exit(1);
});
