import { isAdmin } from "@/lib/auth";
import { getLeads } from "@/lib/store";

export const runtime = "nodejs";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  if (!(await isAdmin())) {
    return new Response("No autorizado", { status: 401 });
  }
  const leads = await getLeads();
  const head = [
    "fecha", "nombre", "email", "telefono", "ciudad", "servicio",
    "espacios", "inversion", "cuando", "mensaje", "origen", "estado",
  ];
  const rows = leads.map((l) =>
    [
      l.createdAt, l.name, l.email, l.phone, l.city, l.service,
      l.spaces, l.budget, l.timeline, l.message, l.source, l.status,
    ].map(esc).join(",")
  );
  // BOM para que Excel en español abra los acentos bien.
  const csv = "﻿" + [head.join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cumbre-leads.csv"',
    },
  });
}
