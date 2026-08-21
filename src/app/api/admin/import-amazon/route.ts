import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdmin } from "@/lib/auth";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { scrapeAmazonProduct } from "@/lib/amazonImport";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_WIDTH = 2000;
const BUCKET = "product-images";
const MAX_IMAGES = 6;

/**
 * Recibe un link de producto de Amazon, lee el título/precio/fotos de la
 * página pública y sube las fotos procesadas a Supabase Storage. Devuelve los
 * datos para prellenar el formulario de ProductForm -- no crea el producto
 * directamente, así Luisa/Victoria revisan y ajustan antes de guardar.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Falta configurar Supabase para poder guardar imágenes." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (!/^https:\/\/(www\.)?amazon\.[a-z.]+\//i.test(url)) {
    return NextResponse.json({ error: "Pegá un link válido de Amazon." }, { status: 400 });
  }

  let scraped;
  try {
    scraped = await scrapeAmazonProduct(url);
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer la página de Amazon. Probá de nuevo en un momento." },
      { status: 502 }
    );
  }

  const images: string[] = [];
  for (const src of scraped.images.slice(0, MAX_IMAGES)) {
    try {
      const imgRes = await fetch(src);
      if (!imgRes.ok) continue;
      const bytes = Buffer.from(await imgRes.arrayBuffer());
      const webp = await sharp(bytes)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 88 })
        .toBuffer();
      const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.webp`;
      const path = `productos/${name}`;
      const { error } = await supabase()
        .storage.from(BUCKET)
        .upload(path, webp, { contentType: "image/webp", cacheControl: "31536000" });
      if (error) continue;
      const { data } = supabase().storage.from(BUCKET).getPublicUrl(path);
      images.push(data.publicUrl);
    } catch {
      // una foto que falla no debe tumbar todo el import
    }
  }

  return NextResponse.json({
    ok: true,
    name: scraped.name,
    asin: scraped.asin,
    costCOP: scraped.costCOP,
    costUSD: scraped.costUSD,
    images,
  });
}
