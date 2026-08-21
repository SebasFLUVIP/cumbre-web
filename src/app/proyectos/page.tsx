import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos de interiorismo y remodelación en Bogotá, Anapoima y Villeta. Diseño integral, muebles a medida y montaje.",
  alternates: { canonical: "/proyectos" },
};

const PROCESO = [
  {
    n: "01",
    t: "Nos conocemos",
    d: "Una primera llamada o videollamada sin costo para entender el espacio, cómo lo viven y hasta dónde quieren llegar. De ahí sale un alcance y un rango de inversión. La visita presencial ya hace parte de la asesoría.",
  },
  {
    n: "02",
    t: "Concepto y planos",
    d: "Distribución, paleta de materiales, referencias y renders cuando hacen falta. Acá se decide todo: después la obra solo ejecuta.",
  },
  {
    n: "03",
    t: "Diseño de detalle",
    d: "Planos de carpintería, despieces de piedra, plano de iluminación punto por punto y las fichas de cada mueble a medida.",
  },
  {
    n: "04",
    t: "Compras y fabricación",
    d: "Nos encargamos de proveedores, tiempos y calidad. Ustedes aprueban; nosotras perseguimos.",
  },
  {
    n: "05",
    t: "Montaje",
    d: "Instalamos, vestimos y entregamos la casa lista para vivir. Sin cajas, sin pendientes.",
  },
];

export default function ProyectosPage() {
  const [hero, ...rest] = PROJECTS;

  return (
    <>
      <header className="border-b border-line">
        <div className="shell py-16 md:py-24">
          <p className="eyebrow">Proyectos</p>
          <h1 className="display mt-4 max-w-3xl text-[2.6rem] md:text-[4rem]">
            Cada proyecto, una travesía hacia la calma
          </h1>
          <p className="mt-7 max-w-2xl text-[1.05rem] font-light leading-relaxed text-mute">
            Un espacio no se termina cuando se instala el último mueble, sino
            cuando alguien entra y baja los hombros sin darse cuenta. Hacia eso
            trabajamos: proyectos integrales de interiorismo y remodelación en
            apartamentos de Bogotá y casas de campo en Anapoima y Villeta.
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
              Contanos qué querés resolver
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
