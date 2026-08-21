import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Proyecto integral de interiorismo, asesoría de diseño, remodelaciones y muebles a medida. Bogotá, Anapoima y Villeta.",
  alternates: { canonical: "/servicios" },
};

const SERVICIOS = [
  {
    id: "proyecto-integral",
    n: "01",
    title: "Proyecto integral",
    lead: "La casa entera, de planos a montaje.",
    body: "Tomamos el espacio como viene —obra gris, casa usada o apartamento a estrenar— y lo entregamos listo para vivir. Distribución, materiales, iluminación, carpintería, muebles a medida, compras y montaje final. Coordinamos a los contratistas y perseguimos los tiempos para que ustedes no tengan que hacerlo.",
    incluye: [
      "Levantamiento y propuesta de distribución",
      "Paleta de materiales y acabados",
      "Plano de iluminación punto por punto",
      "Diseño de carpintería y muebles a medida",
      "Gestión de proveedores y compras",
      "Montaje y entrega vestida",
    ],
    para: "Casas y apartamentos completos, remodelaciones y casas de campo.",
    image: "/img/proyectos/anapoima-terraza-wide.webp",
  },
  {
    id: "asesoria",
    n: "02",
    title: "Asesoría de diseño",
    lead: "Una visita, un plan claro para ejecutar por tu cuenta.",
    body: "Vamos al espacio, lo medimos, escuchamos cómo lo viven y salimos con un plan concreto: qué mover, qué comprar, qué color, qué luz. Te dejamos un documento con la propuesta, medidas y una lista de compras con proveedores y precios. Es la opción cuando querés dirigir vos la ejecución.",
    incluye: [
      "Visita al espacio y levantamiento de medidas",
      "Propuesta de distribución y ambientación",
      "Paleta de color y materiales",
      "Lista de compras con proveedores y precios",
      "Una ronda de ajustes",
    ],
    para: "Un espacio puntual: sala, habitación principal, terraza, apartamento pequeño.",
    image: "/img/proyectos/pacifica-materiales-tall.webp",
  },
  {
    id: "remodelacion",
    n: "03",
    title: "Remodelación",
    lead: "Cuando hay que tumbar, mover o rehacer.",
    body: "Cocinas, baños, ampliaciones de terraza y redistribuciones que implican obra. Diseñamos, cotizamos con contratistas de confianza y coordinamos la ejecución de principio a fin, con cronograma y control de presupuesto.",
    incluye: [
      "Diseño y planos de obra",
      "Cotización comparada con contratistas",
      "Cronograma y control de presupuesto",
      "Supervisión semanal en sitio",
      "Entrega con acta de pendientes cerrada",
    ],
    para: "Cocinas, baños, terrazas y redistribuciones.",
    image: "/img/proyectos/pacifica-sala-doble-altura-tall.webp",
  },
  {
    id: "a-medida",
    n: "04",
    title: "Muebles a medida",
    lead: "Lo que necesitás, en la medida exacta.",
    body: "Diseñamos y fabricamos comedores, espaldares, mesas de noche, consolas, bancas y muebles de exterior. Trabajamos madera maciza, tapizado, fibras naturales, piedra y hierro con talleres colombianos que conocemos hace años. Nos mandás la medida y una referencia, y te cotizamos.",
    incluye: [
      "Diseño y render del mueble",
      "Muestras de madera, tela y acabado",
      "Fabricación en taller propio y aliados",
      "Entrega e instalación en Bogotá y alrededores",
      "Garantía de un año en estructura",
    ],
    para: "Espaldares, comedores, consolas, closets, muebles de exterior.",
    image: "/img/proyectos/estudio-a-medida-tall.webp",
  },
];

const FAQ = [
  {
    q: "¿Trabajan fuera de Bogotá?",
    a: "Sí. Además de Bogotá y la sabana, hacemos proyectos en Anapoima, Villeta y la zona de tierra caliente cercana. Para proyectos más lejos, lo evaluamos según el alcance.",
  },
  {
    q: "¿Cómo cobran?",
    a: "La asesoría de diseño tiene una tarifa fija que depende del tamaño del espacio. Los proyectos integrales se cobran por honorarios de diseño más un porcentaje de gestión sobre las compras. Te lo dejamos todo por escrito antes de empezar.",
  },
  {
    q: "¿Cuánto se demora un proyecto?",
    a: "Una asesoría se entrega en dos a tres semanas. Un proyecto integral sin obra toma entre dos y cuatro meses, según los tiempos de fabricación. Con obra, depende del alcance y te damos un cronograma en la propuesta.",
  },
  {
    q: "¿Puedo comprar solo algunos objetos de la tienda?",
    a: "Claro. La tienda funciona sola: comprás lo que quieras y te lo enviamos a toda Colombia. Y si después querés asesoría, la primera llamada no tiene costo.",
  },
  {
    q: "¿Hacen render?",
    a: "Cuando el proyecto lo pide, sí. En espacios donde la decisión es difícil de imaginar —una cocina, una redistribución— el render evita sorpresas.",
  },
];

export default async function ServiciosPage() {
  const s = await getSettings();

  return (
    <>
      <header className="border-b border-line">
        <div className="shell py-16 md:py-24">
          <p className="eyebrow">Servicios</p>
          <h1 className="display mt-4 max-w-3xl text-[2.6rem] md:text-[4rem]">
            Del primer boceto a la última luz encendida
          </h1>
          <p className="mt-7 max-w-2xl text-[1.05rem] font-light leading-relaxed text-mute">
            Desde una visita puntual hasta un proyecto completo con obra. Elegí
            hasta dónde querés que lleguemos. La primera llamada o videollamada
            no tiene costo; a partir de la visita al espacio, empieza a correr
            la asesoría.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {SERVICIOS.map((sv) => (
              <a
                key={sv.id}
                href={`#${sv.id}`}
                className="text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline hover:text-ink"
              >
                {sv.title}
              </a>
            ))}
          </div>
        </div>
      </header>

      {SERVICIOS.map((sv, i) => (
        <section
          key={sv.id}
          id={sv.id}
          className={`scroll-mt-32 ${i % 2 === 1 ? "bg-paper/60" : ""} border-b border-line`}
        >
          <div className="shell grid items-center gap-12 py-20 lg:grid-cols-12 lg:gap-16 md:py-28">
            <Reveal
              className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={sv.image}
                  alt={sv.title}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-6">
              <span className="font-display text-[2.4rem] font-light text-clay/50">
                {sv.n}
              </span>
              <h2 className="display mt-1 text-[2.1rem] md:text-[2.9rem]">
                {sv.title}
              </h2>
              <p className="mt-4 text-[1.05rem] font-light text-espresso">
                {sv.lead}
              </p>
              <p className="mt-5 text-[1.02rem] font-light leading-relaxed text-mute">
                {sv.body}
              </p>
              <h3 className="eyebrow mt-9">Incluye</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {sv.incluye.map((x) => (
                  <li
                    key={x}
                    className="flex gap-3 text-[0.88rem] font-light leading-relaxed"
                  >
                    <span className="text-clay-deep">—</span>
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-7 border-t border-line pt-5 text-[0.85rem] font-light text-mute">
                <span className="eyebrow">Ideal para</span>
                <br />
                {sv.para}
              </p>
              <a
                href="#hablemos"
                className="mt-8 inline-block bg-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
              >
                Pedir cotización
              </a>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Preguntas */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">Preguntas</p>
            <h2 className="display mt-3 text-[2.1rem] md:text-[2.7rem]">
              Lo que más nos preguntan
            </h2>
          </div>
          <dl className="lg:col-span-8">
            {FAQ.map((f) => (
              <div key={f.q} className="border-b border-line py-7 first:border-t">
                <dt className="font-display text-[1.35rem] font-light">{f.q}</dt>
                <dd className="mt-3 max-w-2xl text-[1rem] font-light leading-relaxed text-mute">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Lead */}
      <section id="hablemos" className="scroll-mt-32 border-t border-line bg-sand/40 py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Hablemos</p>
            <h2 className="display mt-4 text-[2.2rem] md:text-[3rem]">
              La primera llamada no tiene costo
            </h2>
            <p className="mt-6 text-[1.02rem] font-light leading-relaxed text-mute">
              Contanos qué espacio querés resolver y coordinamos una llamada o
              videollamada sin costo, donde salimos con una propuesta de alcance
              y un rango de inversión. La visita al espacio hace parte de la
              asesoría y se cotiza aparte.
            </p>
            <div className="mt-8 space-y-2 text-[0.9rem] font-light">
              <p>
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  WhatsApp
                </a>
              </p>
              <p>
                <a href={`mailto:${s.email}`} className="link-underline">
                  {s.email}
                </a>
              </p>
            </div>
            <Link
              href="/proyectos"
              className="mt-8 inline-block text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline"
            >
              Ver proyectos terminados
            </Link>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-line bg-paper p-7 md:p-10">
              <LeadForm source="servicios" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
