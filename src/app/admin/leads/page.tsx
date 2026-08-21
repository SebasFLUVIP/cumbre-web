import { requireAdmin } from "@/lib/auth";
import { getLeads, getSettings } from "@/lib/store";
import { updateLeadStatus } from "../actions";

const ESTADOS = ["nuevo", "contactado", "cotizado", "ganado", "perdido"] as const;

const TONE: Record<string, string> = {
  nuevo: "bg-clay/15 text-clay-deep",
  contactado: "bg-espresso/10 text-espresso",
  cotizado: "bg-line/70 text-mute",
  ganado: "bg-olive/20 text-olive",
  perdido: "bg-line/50 text-mute",
};

export default async function AdminLeads() {
  await requireAdmin();
  const [leads, settings] = await Promise.all([getLeads(), getSettings()]);

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[2.4rem]">Leads</h1>
          <p className="mt-2 text-[0.85rem] font-light text-mute">
            Consultas de proyecto, asesoría y muebles a medida.
          </p>
        </div>
        <a
          href={`/api/admin/leads.csv`}
          className="border border-line px-6 py-3 text-[0.68rem] uppercase tracking-[0.16em] hover:bg-sand"
        >
          Descargar CSV
        </a>
      </div>

      {leads.length === 0 ? (
        <p className="mt-16 font-display text-2xl font-light text-mute">
          Todavía no llegó ninguna consulta.
        </p>
      ) : (
        <div className="mt-10 space-y-4">
          {leads.map((l) => (
            <article key={l.id} className="border border-line bg-bone p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-xl font-light">{l.name}</h2>
                    <span
                      className={`px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${TONE[l.status]}`}
                    >
                      {l.status}
                    </span>
                    <span className="text-[0.75rem] font-light text-mute">
                      {new Date(l.createdAt).toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <p className="mt-2 text-[0.85rem] font-light">
                    <a href={`mailto:${l.email}`} className="link-underline">
                      {l.email}
                    </a>
                    {" · "}
                    <a
                      href={`https://wa.me/${l.phone.replace(/\D/g, "").replace(/^(?!57)/, "57")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      {l.phone}
                    </a>
                  </p>

                  <dl className="mt-4 grid gap-x-8 gap-y-2 text-[0.82rem] font-light sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="text-mute">Servicio:</dt>
                      <dd>{l.service}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-mute">Ciudad:</dt>
                      <dd>{l.city}</dd>
                    </div>
                    {l.spaces && (
                      <div className="flex gap-2">
                        <dt className="text-mute">Espacios:</dt>
                        <dd>{l.spaces}</dd>
                      </div>
                    )}
                    {l.budget && (
                      <div className="flex gap-2">
                        <dt className="text-mute">Inversión:</dt>
                        <dd>{l.budget}</dd>
                      </div>
                    )}
                    {l.timeline && (
                      <div className="flex gap-2">
                        <dt className="text-mute">Cuándo:</dt>
                        <dd>{l.timeline}</dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="text-mute">Origen:</dt>
                      <dd className="font-mono text-[0.75rem]">{l.source}</dd>
                    </div>
                  </dl>

                  {l.message && (
                    <p className="mt-4 border-l-2 border-clay/40 pl-4 text-[0.95rem] font-light leading-relaxed text-mute">
                      {l.message}
                    </p>
                  )}
                </div>

                <form action={updateLeadStatus} className="flex shrink-0 gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <select
                    name="status"
                    defaultValue={l.status}
                    className="border border-line bg-bone px-2 py-1.5 text-[0.78rem] font-light"
                  >
                    {ESTADOS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="border border-line px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] hover:bg-sand"
                  >
                    Guardar
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-12 text-[0.78rem] font-light text-mute">
        Los avisos por correo todavía no están conectados. Mientras tanto,
        revisá esta pantalla o escribinos el canal que prefieran (correo,
        WhatsApp Business API) y lo enganchamos. Contacto público actual:{" "}
        {settings.email}.
      </p>
    </div>
  );
}
