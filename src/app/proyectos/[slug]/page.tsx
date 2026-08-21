import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/data/projects";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/proyectos/${p.slug}` },
    openGraph: { title: `${p.title} · Cumbre`, description: p.summary, images: [p.cover] },
  };
}

export default async function ProyectoPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <>
      <section className="relative -mt-20 h-[85svh] min-h-[30rem] w-full md:-mt-24">
        <Image src={p.cover} alt={p.title} fill priority sizes="100vw" className="object-cover" />
        {/* Dos velos: uno arriba para que la cabecera se lea sobre cualquier
            foto, y uno abajo, más fuerte, que sostiene el titular. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/10 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(44,38,30,0.92) 0%, rgba(44,38,30,0.72) 26%, rgba(44,38,30,0.34) 52%, rgba(44,38,30,0) 78%)",
          }}
        />
        <div className="shell relative flex h-full flex-col justify-end pb-16 md:pb-24">
          <p className="eyebrow text-bone/80">
            {p.category} · {p.location} · {p.year}
          </p>
          <h1 className="display mt-4 max-w-4xl text-[2.7rem] text-bone md:text-[4.5rem]">
            {p.title}
          </h1>
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="display text-[1.5rem] leading-[1.35] md:text-[2rem]">
              {p.summary}
            </p>
            <div className="mt-10 space-y-6">
              {p.body.map((para, i) => (
                <p key={i} className="text-[1.05rem] font-light leading-[1.85] text-mute">
                  {para}
                </p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="eyebrow">Qué hicimos</h2>
            <ul className="mt-5 space-y-3 border-t border-line pt-5">
              {p.scope.map((s) => (
                <li key={s} className="text-[0.92rem] font-light leading-relaxed">
                  {s}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-5 md:grid-cols-2">
          {p.gallery.map((g, i) => {
            const wide = g.ratio === "wide";
            return (
              <Reveal
                key={g.src}
                delay={(i % 2) * 90}
                className={wide ? "md:col-span-2" : ""}
              >
                <figure>
                  <div
                    className="relative overflow-hidden bg-sand"
                    style={{ aspectRatio: wide ? "16/9" : "4/5" }}
                  >
                    <Image
                      src={g.src}
                      alt={g.caption ?? p.title}
                      fill
                      sizes={wide ? "100vw" : "(min-width: 768px) 48vw, 100vw"}
                      className="object-cover"
                    />
                  </div>
                  {g.caption && (
                    <figcaption className="mt-3 text-[0.93rem] font-light leading-relaxed text-mute">
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line bg-sand/40 py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Siguiente</p>
            <h2 className="display mt-4 text-[2.1rem] md:text-[2.9rem]">
              ¿Querés algo así en tu casa?
            </h2>
            <p className="mt-6 text-[1.02rem] font-light leading-relaxed text-mute">
              Cada proyecto empieza igual: una llamada sin costo para entender
              el espacio y lo que necesitás.
            </p>
            <Link
              href="/proyectos"
              className="mt-8 inline-block text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline"
            >
              Ver todos los proyectos
            </Link>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-line bg-paper p-7 md:p-10">
              <LeadForm source={`proyecto:${p.slug}`} defaultService="Proyecto integral de interiorismo" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
