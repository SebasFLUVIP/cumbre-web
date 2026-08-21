import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Cumbre & Cufania",
  description:
    "Alianza entre Cumbre (Colombia) y Cufania Home (Argentina) para acompañar a quienes se mudan entre los dos países.",
  alternates: { canonical: "/cufania" },
};

const PASOS = [
  {
    n: "01",
    t: "Nos contás a dónde te vas",
    d: "Ciudad, fecha aproximada de mudanza y qué tipo de casa o apartamento vas a habitar. Con eso arrancamos.",
  },
  {
    n: "02",
    t: "Te presentamos al equipo del otro lado",
    d: "Si vas a Argentina, te conectamos con Cufania Home en Buenos Aires. Si venís a Colombia, nos hacemos cargo nosotras. La conversación es de tres, no un pase de mano.",
  },
  {
    n: "03",
    t: "Diseñamos a distancia",
    d: "Planos, propuesta de ambientación y lista de compras con proveedores locales del país de destino. Todo antes de que te subas al avión.",
  },
  {
    n: "04",
    t: "Llegás a una casa lista",
    d: "El equipo local recibe, monta y viste. Vos llegás con las maletas y ya hay dónde sentarse a comer.",
  },
];

export default function CufaniaPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="shell py-16 md:py-24">
          <p className="eyebrow">Alianza</p>
          <h1 className="display mt-4 max-w-3xl text-[2.6rem] md:text-[4rem]">
            Cumbre en Colombia,
            <br />
            Cufania en Argentina
          </h1>
          <p className="mt-7 max-w-2xl text-[0.98rem] font-light leading-relaxed text-mute">
            Mudarse de país es empezar de nuevo en todo, menos en una cosa: la
            casa puede estar esperándote. Lo último que querés al aterrizar es
            no saber dónde comprar una cama, quién hace un espaldar a medida o
            qué proveedor cumple. Para eso existe esta alianza.
          </p>
        </div>
      </header>

      <section className="shell py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              <Image
                src="/img/proyectos/estilo-estudio-olivo-wide.webp"
                alt="Escritorio de trabajo con vista al jardín"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-6">
            <h2 className="display text-[2rem] md:text-[2.7rem]">
              Un mismo criterio, en los dos países
            </h2>
            <div className="mt-6 space-y-5 text-[0.96rem] font-light leading-[1.8] text-mute">
              <p>
                Trabajamos con Cufania Home, un estudio de Buenos Aires con el
                que compartimos la manera de ver las cosas: materiales
                naturales, espacios funcionales y muebles hechos a medida por
                talleres locales.
              </p>
              <p>
                Si sos colombiana y te mudás a Argentina, nosotras armamos el
                proyecto con vos acá y Cufania lo ejecuta allá con proveedores
                argentinos. Si venís de Argentina a Colombia, funciona al revés:
                Cufania te acompaña en la salida y nosotras te recibimos.
              </p>
              <p>
                No es una recomendación suelta. Es un mismo proyecto, con
                continuidad de criterio y alguien responsable a cada lado del
                camino.
              </p>
            </div>
            <a
              href="https://instagram.com/cufaniahome"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-[0.7rem] uppercase tracking-[0.18em] text-clay-deep link-underline"
            >
              Conocé a Cufania Home
            </a>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper/60 py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="display mt-3 max-w-2xl text-[2.1rem] md:text-[2.9rem]">
            Cuatro pasos entre una casa y la otra
          </h2>
          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <Reveal key={p.n} delay={i * 80} as="li">
                <span className="font-display text-[2.5rem] font-light text-clay/50">
                  {p.n}
                </span>
                <h3 className="mt-2 font-display text-[1.35rem] font-light">
                  {p.t}
                </h3>
                <p className="mt-3 text-[0.87rem] font-light leading-relaxed text-mute">
                  {p.d}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Empecemos</p>
            <h2 className="display mt-4 text-[2.1rem] md:text-[2.9rem]">
              Contanos a dónde te mudás
            </h2>
            <p className="mt-6 text-[0.95rem] font-light leading-relaxed text-mute">
              Cuanto antes empecemos, más tranquila es la llegada. Lo ideal es
              hablar dos o tres meses antes de la mudanza.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-line bg-paper p-7 md:p-10">
              <LeadForm
                source="cufania"
                defaultService="Proyecto integral de interiorismo"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
