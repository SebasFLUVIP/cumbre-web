import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Nosotras",
  description:
    "Luisa y Victoria — Tita y Vicky. Estudio de interiorismo y tienda de decoración en Colombia.",
  alternates: { canonical: "/nosotras" },
};

const VALORES = [
  {
    t: "Lo simple",
    d: "Pocos materiales, repetidos con criterio. Cuando el material se repite, el ojo deja de trabajar y la casa se siente calmada.",
  },
  {
    t: "Lo natural",
    d: "Madera, piedra, fibras tejidas, lino. Materiales que envejecen bien y que se sienten distinto al tocarlos.",
  },
  {
    t: "Lo funcional",
    d: "Un espacio lindo que no se puede usar no sirve. Primero resolvemos cómo se vive y después cómo se ve.",
  },
  {
    t: "Lo hecho a mano",
    d: "Trabajamos con artesanas y talleres colombianos. Cada pieza tejida sale distinta, y esa es la gracia.",
  },
];

export default function NosotrasPage() {
  return (
    <>
      {/* Apertura: el retrato manda. Una página de fundadoras no debería abrir
          con una foto de ambiente. */}
      <section className="shell pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Nosotras</p>
            <h1 className="display mt-5 text-[2.7rem] md:text-[4rem]">
              Somos Tita
              <br />y Vicky
            </h1>
            <div className="mt-7 h-px w-16 bg-clay" />
            <p className="mt-8 text-[1.05rem] font-light leading-relaxed text-espresso">
              Luisa y Victoria. Diseñamos casas en Bogotá y en tierra
              caliente, hacemos muebles a medida y elegimos, una por una, las
              piezas que vendemos en la tienda. Nos mueve lo mismo desde el
              principio: lo simple, lo natural y lo que dura.
            </p>
            <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-mute">
              Nos metemos en todo: la distribución, la luz, el mueble que hay
              que mandar a hacer, el proveedor que se demora. Preferimos
              entregar la casa vestida y lista antes que dejar una carpeta de
              planos y desaparecer.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/proyectos"
                className="border border-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
              >
                Ver nuestros proyectos
              </Link>
            </div>
          </div>

          <Reveal delay={80} className="lg:col-span-7">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden bg-sand sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/img/proyectos/tita-y-vicky-tall.webp"
                  alt="Luisa y Victoria, fundadoras de Cumbre, en una de sus casas"
                  fill
                  priority
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[0.78rem] font-light text-mute">
                Luisa &amp; Victoria — fundadoras de Cumbre.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="shell pb-20 md:pb-28">
        <Reveal className="mx-auto max-w-3xl">
          <p className="display text-[1.6rem] leading-[1.35] md:text-[2.2rem]">
            Creamos Cumbre como una marca que refleja lo que amamos: lo simple y
            lo natural.
          </p>
          <div className="mt-10 space-y-6 text-[0.98rem] font-light leading-[1.85] text-mute">
            <p>
              Te acompañamos en desarrollar proyectos integrales y asesorías de
              diseño de interiores, para ayudarte a armar ambientes funcionales.
              También hacemos tus muebles a medida y vendemos objetos de
              decoración pensados para sumar calidez, estilo y personalidad a
              cada rincón de tu casa.
            </p>
            <p>
              Trabajamos sobre todo en Bogotá y en casas de campo en Anapoima y
              Villeta. Son dos formas muy distintas de vivir —una casa de
              ciudad y una casa de fin de semana— y nos gusta esa diferencia:
              obliga a pensar cada proyecto desde cero en vez de repetir una
              fórmula.
            </p>
            <p className="text-espresso">
              Creemos que tu casa tiene que contar tu historia. Contá con
              nosotras para lograrlo.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-paper/60 py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow">Cómo pensamos</p>
          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {VALORES.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <h2 className="font-display text-[1.7rem] font-light">{v.t}</h2>
                <div className="mt-3 h-px w-10 bg-clay" />
                <p className="mt-4 text-[0.9rem] font-light leading-relaxed text-mute">
                  {v.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-[70svh] min-h-[24rem] w-full">
        <Image
          src="/img/proyectos/apto-bogota-mesas-wide.webp"
          alt="Sala con dos mesas de centro en roble macizo hechas a medida"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(38,32,25,0.86) 0%, rgba(38,32,25,0.70) 30%, rgba(38,32,25,0.38) 55%, rgba(38,32,25,0) 82%)",
          }}
        />
        <div className="shell relative flex h-full items-end pb-14 md:pb-20">
          <Reveal className="max-w-2xl">
            <p className="display text-[1.6rem] leading-[1.3] text-bone md:text-[2.3rem]">
              Una casa bien resuelta no se nota. Se siente en la luz que entra
              a la hora justa, en el material que da gusto tocar, en el silencio
              de las cosas que están donde tienen que estar.
            </p>
            <p className="mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-bone/70">
              Tita &amp; Vicky
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-sand/40">
        <div className="shell flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <h2 className="display text-[1.9rem] md:text-[2.5rem]">
            ¿Empezamos por tu casa?
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/servicios#hablemos"
              className="bg-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
            >
              Contanos tu proyecto
            </Link>
            <Link
              href="/tienda"
              className="border border-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
            >
              Ver la tienda
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
