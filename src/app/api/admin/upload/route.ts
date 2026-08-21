import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdmin } from "@/lib/auth";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB de entrada, antes de comprimir
const MAX_WIDTH = 2000;
const BUCKET = "product-images";

/**
 * Recibe una foto desde el formulario de producto del admin, la redimensiona
 * y convierte a WebP, y la sube a Supabase Storage. Devuelve la URL pública
 * para que el formulario la agregue a la lista de imágenes del producto.
 *
 * No hace quitado de fondo ni corrección de color -- eso sigue siendo trabajo
 * del pipeline en scripts/process_images.py para las fotos de campaña. Esto
 * es para que Luisa y Victoria puedan subir una foto de catálogo del día a
 * día sin depender de una corrida de ese script.
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

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No llegó ningún archivo" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo no es una imagen" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `La imagen pesa más de ${MAX_UPLOAD_BYTES / 1024 / 1024} MB` },
      { status: 400 }
    );
  }

  let webp: Buffer;
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    webp = await sharp(bytes)
      .rotate() // respeta la orientación EXIF de fotos tomadas con el celular
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar la imagen. Probá con otro archivo." },
      { status: 400 }
    );
  }

  const name = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const path = `productos/${name}`;

  const { error } = await supabase()
    .storage.from(BUCKET)
    .upload(path, webp, { contentType: "image/webp", cacheControl: "31536000" });

  if (error) {
    return NextResponse.json({ error: `No se pudo guardar: ${error.message}` }, { status: 500 });
  }

  const { data } = supabase().storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
