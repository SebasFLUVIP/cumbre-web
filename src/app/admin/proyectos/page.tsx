import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllProjects } from "@/lib/store";

export default async function AdminProyectos({
  searchParams,
}: {
  searchParams: Promise<{ guardado?: string; eliminado?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  let dbError: string | null = null;
  try {
    projects = await getAllProjects();
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Error desconocido";
  }

  const flash = sp.guardado ? "Proyecto guardado." : sp.eliminado ? "Proyecto eliminado." : null;

  if (dbError) {
    return (
      <div className="shell py-12">
        <h1 className="display text-[2.4rem]">Proyectos</h1>
        <p className="mt-6 max-w-xl border border-clay/40 bg-clay/5 px-5 py-4 text-[0.85rem] font-light leading-relaxed text-clay-deep">
          Falta crear la tabla <code className="font-mono">projects</code> en
          Supabase. Corré el SQL de <code className="font-mono">supabase/schema.sql</code>{" "}
          en el SQL Editor y recargá esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="display text-[2.4rem]">Proyectos</h1>
          <p className="mt-2 text-[0.85rem] font-light text-mute">
            El proyecto marcado como destacado es el que se ve primero en
            /proyectos y en el home.
          </p>
        </div>
        <Link
          href="/admin/proyectos/nuevo"
          className="bg-ink px-6 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-bone hover:bg-espresso"
        >
          Nuevo proyecto
        </Link>
      </div>

      {flash && (
        <p className="mt-6 border border-line bg-sand/60 px-5 py-3 text-[0.85rem] font-light">
          {flash}
        </p>
      )}

      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/proyectos/${p.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              {p.cover ? (
                <Image
                  src={p.cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center font-display text-3xl text-clay/40">
                  C
                </span>
              )}
              {p.featured && (
                <span className="absolute left-2 top-2 bg-ink/80 px-2 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-bone">
                  Destacado
                </span>
              )}
            </div>
            <p className="mt-4 text-[0.78rem] font-light text-mute">
              {p.location} · {p.year}
            </p>
            <h2 className="mt-1 font-display text-xl font-light group-hover:text-clay-deep">
              {p.title}
            </h2>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="mt-10 text-[0.9rem] font-light text-mute">
          Todavía no hay proyectos cargados.
        </p>
      )}
    </div>
  );
}
