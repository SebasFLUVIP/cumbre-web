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
              Luisa y Victoria. Creamos y transformamos espacios para que se
              vean bien, funcionen mejor y se sientan propios.
            </p>
            <div className="mt-5 space-y-5 text-[1.02rem] font-light leading-relaxed text-mute">
              <p>
                Trabajamos en proyectos de decoración de interiores, styling y
                remodelación. Diseñamos muebles a medida y acompañamos a
                nuestros clientes en la elección y compra de cada pieza que
                completa un espacio.
              </p>
              <p>
                Nos mueve lo mismo desde el principio: los materiales nobles,
                lo hecho a mano, los detalles bien pensados y las cosas hechas
                para durar.
              </p>
              <p>
                Nos involucramos en todo el proceso. Podemos ayudarte a
                transformar un ambiente, acompañarte en decisiones puntuales o
                encargarnos de un proyecto completo, desde la primera idea
                hasta el último detalle.
              </p>
              <p>
                Para quienes llegan a vivir a Colombia, ofrecemos además un
                servicio integral: diseñamos, amoblamos y decoramos tu hogar
                para dejarlo listo para vivir.
              </p>
            </div>
            <p className="mt-5 text-[1.02rem] font-light leading-relaxed text-espresso">
              Porque para nosotras diseñar no es solo hacer que un espacio se
              vea bien. Es hacer que funcione para quien lo vive.
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
          <p className="eyebrow">Nuestra manera de hacer las cosas</p>
          <p className="display mt-6 text-[1.6rem] leading-[1.35] md:text-[2.2rem]">
            CUMBRE no es una tendencia que seguimos. Es la manera en que
            siempre nos gustó trabajar.
          </p>
          <div className="mt-10 space-y-6 text-[1.05rem] font-light leading-[1.85] text-mute">
            <p>
              Diseñamos y transformamos espacios combinando interiorismo,
              decoración, styling, remodelación y muebles a medida. Nos
              involucramos en cada detalle para crear espacios cálidos,
              funcionales y pensados para quienes los viven.
            </p>
            <p>
              Trabajamos principalmente en Bogotá y tierra caliente, y también
              acompañamos a quienes llegan a vivir a Colombia, dejando su
              hogar diseñado, amoblado y listo para vivir.
            </p>
            <p className="text-espresso">
              No repetimos fórmulas. Cada casa, como cada persona, es
              diferente.
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
                <p className="mt-4 text-[0.98rem] font-light leading-relaxed text-mute">
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
              El diseño no tiene que imponerse. Tiene que sentirse.
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
