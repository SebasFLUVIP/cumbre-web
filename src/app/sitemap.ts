import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/categories";
import { PROJECTS } from "@/data/projects";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cumbredeco.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Awaited<ReturnType<typeof getPublicProducts>> = [];
  try {
    products = await getPublicProducts();
  } catch {
    // El sitemap se genera igual con las rutas fijas.
  }
  const now = new Date();

  const fixed = [
    { url: "/", priority: 1 },
    { url: "/tienda", priority: 0.9 },
    { url: "/proyectos", priority: 0.9 },
    { url: "/servicios", priority: 0.9 },
    { url: "/nosotras", priority: 0.6 },
    { url: "/contacto", priority: 0.7 },
    { url: "/cufania", priority: 0.6 },
    { url: "/envios-y-devoluciones", priority: 0.3 },
    { url: "/terminos", priority: 0.2 },
    { url: "/privacidad", priority: 0.2 },
  ];

  return [
    ...fixed.map((f) => ({
      url: `${BASE}${f.url}`,
      lastModified: now,
      priority: f.priority,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/tienda/${c.id}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${BASE}/producto/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...PROJECTS.map((p) => ({
      url: `${BASE}/proyectos/${p.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
