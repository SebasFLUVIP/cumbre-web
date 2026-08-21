import { NextResponse } from "next/server";
import { addLead } from "@/lib/store";
import { sendLeadNotification } from "@/lib/notify";
import type { Lead } from "@/lib/types";

export const runtime = "nodejs";

function clean(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Honeypot: si viene lleno es un bot. Respondemos 200 para no darle señal.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);

  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Faltan datos de contacto válidos" },
      { status: 400 }
    );
  }

  const lead: Lead = {
    id: `l_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    city: clean(body.city, 80),
    service: clean(body.service, 120) || "Sin especificar",
    spaces: clean(body.spaces, 300) || undefined,
    budget: clean(body.budget, 80) || undefined,
    timeline: clean(body.timeline, 80) || undefined,
    message: clean(body.message, 2000) || undefined,
    source: clean(body.source, 60) || "web",
    status: "nuevo",
  };

  await addLead(lead);

  // El aviso es best-effort: si falla, el lead ya quedo guardado y visible
  // en /admin/leads, así que la respuesta al cliente no debe verse afectada.
  await sendLeadNotification(lead).catch(() => {});

  return NextResponse.json({ ok: true, id: lead.id });
}
