import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProjects } from "@/lib/store";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos de interiorismo y remodelación en Bogotá y tierra caliente. Diseño integral, muebles a medida y montaje.",
  alternates: { canonical: "/proyectos" },
};

const PROCESO = [
  {
    n: "01",
    t: "Nos conocemos",
    d: "Una primera conversación para entender qué necesitas, cómo vives el espacio y hasta dónde quieres llegar. A partir de ahí definimos el alcance del proyecto y una inversión estimada.",
  },
  {
    n: "02",
    t: "Diseñamos",
    d: "Definimos distribución, materiales, colores, mobiliario e iluminación. Cuando el proyecto lo requiere, desarrollamos planos y renders para visualizar el resultado antes de empezar.",
  },
  {
    n: "03",
    t: "Definimos cada detalle",
    d: "Diseñamos el mobiliario a medida y definimos materiales, acabados, iluminación y todos los detalles necesarios para llevar el proyecto a la realidad.",
  },
  {
    n: "04",
    t: "Hacemos que suceda",
    d: "Coordinamos compras, proveedores, fabricación y tiempos, acompañando cada etapa para que todo salga como fue pensado.",
  },
  {
    n: "05",
    t: "Vestimos y entregamos",
    d: "Instalamos, decoramos y damos los últimos detalles para entregar un espacio terminado y listo para vivir.",
  },
];

export default async function ProyectosPage() {
  const projects = (await getAllProjects().catch(() => [])).filter((p) => !p.draft);
  const hero = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p.slug !== hero?.slug);

  if (!hero) {
    return (
      <div className="shell py-24 text-center">
        <p className="font-display text-2xl font-light">Estamos armando esta sección</p>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-line">
        <div className="shell py-16 md:py-24">
          <p className="eyebrow">Proyectos</p>
          <h1 className="display mt-4 max-w-3xl text-[2.6rem] md:text-[4rem]">
            Espacios pensados para quienes los viven.
          </h1>
          <p className="mt-7 max-w-2xl text-[1.05rem] font-light leading-relaxed text-mute">
            Cada proyecto empieza por entender cómo quieres vivir tu espacio.
            Diseñamos, transformamos y cuidamos cada detalle para crear
            ambientes funcionales, cálidos y personales.
          </p>
          <p className="mt-5 max-w-2xl text-[1.05rem] font-light leading-relaxed text-mute">
            No repetimos fórmulas. Cada proyecto es diferente porque cada forma
            de vivir también lo es.
          </p>
        </div>
      </header>

      {/* Caso principal */}
      <section className="shell py-16 md:py-24">
        <Reveal>
          <Link href={`/proyectos/${hero.slug}`} className="group block">
            <div className="relative aspect-[16/9] overflow-hidden bg-sand">
              <Image
                src={hero.cover}
                alt={hero.title}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="eyebrow">
                  {hero.category} · {hero.location} · {hero.year}
                </p>
                <h2 className="display mt-3 text-[2.1rem] md:text-[2.9rem]">
                  {hero.title}
                </h2>
              </div>
              <div className="md:col-span-5">
                <p className="text-[1.02rem] font-light leading-relaxed text-mute">
                  {hero.summary}
                </p>
                <span className="mt-5 inline-block text-[0.7rem] uppercase tracking-[0.18em] link-underline">
                  Ver el proyecto
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {rest.length > 0 && (
          <div className="mt-24 grid gap-x-6 gap-y-16 md:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <Link href={`/proyectos/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(min-width: 768px) 46vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="eyebrow mt-5">
                    {p.location} · {p.year}
                  </p>
                  <h3 className="display mt-2 text-[1.8rem]">{p.title}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Proceso */}
      <section className="border-y border-line bg-paper/60 py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow">Cómo trabajamos</p>
          <h2 className="display mt-3 max-w-2xl text-[2.1rem] md:text-[3rem]">
            El recorrido, en cinco etapas
          </h2>
          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
            {PROCESO.map((s, i) => (
              <Reveal key={s.n} delay={i * 80} as="li">
                <span className="font-display text-[2.5rem] font-light text-clay/50">
                  {s.n}
                </span>
                <h3 className="mt-2 font-display text-[1.35rem] font-light">
                  {s.t}
                </h3>
                <p className="mt-3 text-[0.94rem] font-light leading-relaxed text-mute">
                  {s.d}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Lead */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Tu proyecto</p>
            <h2 className="display mt-4 text-[2.1rem] md:text-[2.9rem]">
              Cuéntanos qué quieres resolver
            </h2>
            <p className="mt-6 text-[1.02rem] font-light leading-relaxed text-mute">
              No hace falta que tengas todo claro. Con una foto del espacio y
              una idea de lo que te gustaría lograr, alcanza para empezar.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-line bg-paper p-7 md:p-10">
              <LeadForm source="proyectos" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
