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

type Servicio = {
  id: string;
  title: string;
  navLabel?: string;
  lead?: string;
  body: string[];
  incluye?: string[];
  para?: string;
  cross?: { href: string; text: string };
  image: string;
};

const SERVICIOS: Servicio[] = [
  {
    id: "proyecto-integral",
    title: "Proyecto integral",
    lead: "De la primera idea al último detalle.",
    body: [
      "Tomamos el proyecto completo y nos encargamos de llevarlo de principio a fin. Diseñamos la distribución, definimos materiales e iluminación, desarrollamos muebles a medida y coordinamos compras, proveedores y montaje.",
      "El objetivo: entregar un espacio terminado, vestido y listo para vivir.",
    ],
    incluye: [
      "Levantamiento y propuesta de distribución",
      "Selección de materiales y acabados",
      "Diseño de iluminación",
      "Diseño de carpintería y muebles a medida",
      "Selección y compra de mobiliario y decoración",
      "Gestión de proveedores y coordinación",
      "Styling, montaje y entrega final",
    ],
    para: "Casas y apartamentos completos, propiedades nuevas, remodelaciones y casas de campo.",
    image: "/img/proyectos/payande-terraza-wide.webp",
  },
  {
    id: "decoracion-styling",
    title: "Decoración & Styling",
    lead: "Los detalles que terminan de transformar un espacio.",
    body: [
      "Trabajamos sobre espacios que ya están amoblados o encaminados, pero necesitan sentirse más completos y conectados. Seleccionamos y combinamos textiles, iluminación, arte, objetos, alfombras y accesorios para darle calidez, equilibrio y personalidad.",
    ],
    incluye: [
      "Revisión del espacio y de las piezas existentes",
      "Propuesta de decoración y styling",
      "Selección de textiles, alfombras, iluminación, arte y objetos",
      "Integración de piezas nuevas con las que ya tienes",
      "Selección y compra de piezas",
      "Montaje y styling final, según el alcance",
    ],
    para: "Espacios que no necesitan empezar de cero, pero sí una mirada profesional que los termine de conectar.",
    image: "/img/proyectos/estilo-sala-lino-tall.webp",
  },
  {
    id: "asesoria-puntual",
    title: "Asesoría puntual · 2 horas",
    navLabel: "Asesoría puntual",
    body: [
      "Una asesoría presencial pensada para resolver dudas concretas sobre un espacio. Recorremos juntos lo que quieres cambiar y te ayudamos a tomar decisiones sobre distribución, color, iluminación, elección de muebles, styling, textiles y decoración.",
      "Te llevas ideas claras y soluciones que puedes empezar a aplicar de inmediato.",
    ],
    incluye: [
      "Visita presencial de 2 horas",
      "Revisión del espacio y sus posibilidades",
      "Recomendaciones de distribución",
      "Orientación en colores, materiales e iluminación",
      "Recomendaciones de mobiliario y decoración",
    ],
    para: "Quienes necesitan una mirada profesional para resolver dudas puntuales sin desarrollar un proyecto completo.",
    cross: {
      href: "#asesoria",
      text: "Asesoría de diseño → para quien necesita una propuesta completa de uno o varios ambientes, con medidas, distribución, materiales, selección de piezas y lista de compras.",
    },
    image: "/img/proyectos/apto-bogota-styling-tall.webp",
  },
  {
    id: "asesoria",
    title: "Asesoría de diseño",
    lead: "Un plan completo para transformar tu espacio.",
    body: [
      "Para espacios que necesitan algo más que recomendaciones puntuales. Visitamos, medimos y desarrollamos una propuesta de diseño con las decisiones necesarias para que después puedas ejecutarla por tu cuenta.",
    ],
    incluye: [
      "Visita y levantamiento de medidas",
      "Propuesta de distribución y ambientación",
      "Paleta de colores, materiales y acabados",
      "Selección de mobiliario, iluminación y decoración",
      "Lista de compras con proveedores y precios",
      "Una ronda de ajustes",
    ],
    para: "Quienes quieren transformar uno o varios ambientes con una propuesta definida, pero prefieren encargarse de las compras y la ejecución.",
    image: "/img/proyectos/pacifica-materiales-tall.webp",
  },
  {
    id: "asesoria-compras",
    title: "Asesoría en compras",
    lead: "Te ayudamos a elegir bien antes de comprar.",
    body: [
      "Te acompañamos en la búsqueda y selección de muebles, iluminación, alfombras, textiles y objetos para tu casa. Definimos qué necesitas y buscamos opciones que funcionen por medidas, estilo, materiales y presupuesto, evitando compras que después no encajan en el espacio.",
    ],
    incluye: [
      "Definición de necesidades y presupuesto",
      "Selección de piezas según el espacio",
      "Búsqueda de opciones y proveedores",
      "Recomendaciones de materiales, medidas y acabados",
      "Acompañamiento en tiendas o selección online, según el caso",
    ],
    para: "Quienes quieren encargarse de su casa, pero necesitan ayuda profesional para elegir y comprar las piezas correctas.",
    image: "/img/proyectos/estilo-repisas-tall.webp",
  },
  {
    id: "remodelacion",
    title: "Remodelación",
    navLabel: "Remodelaciones",
    lead: "Transformamos el espacio desde su estructura.",
    body: [
      "Cuando un proyecto necesita algo más que decoración, diseñamos y coordinamos la remodelación. Cocinas, baños, terrazas o redistribuciones: definimos la propuesta, desarrollamos los planos y acompañamos la obra para que el resultado final responda al diseño.",
    ],
    incluye: [
      "Diseño y planos de obra",
      "Selección de materiales y acabados",
      "Cotización con contratistas",
      "Cronograma y seguimiento de presupuesto",
      "Supervisión de obra",
      "Seguimiento de detalles y entrega final",
    ],
    para: "Cocinas, baños, terrazas y espacios que necesitan una transformación más profunda.",
    image: "/img/proyectos/pacifica-sala-doble-altura-tall.webp",
  },
  {
    id: "a-medida",
    title: "Muebles a medida",
    lead: "Diseñados para tu espacio. Hechos para durar.",
    body: [
      "Diseñamos y fabricamos muebles a medida, cuidando proporciones, materiales, funcionalidad y acabados. Trabajamos con madera, tapizados, fibras naturales, piedra y hierro, junto a talleres y proveedores de confianza.",
      "Podemos partir de una necesidad, una idea o una referencia y desarrollar una pieza pensada especialmente para tu espacio.",
    ],
    incluye: [
      "Diseño y definición de medidas",
      "Selección de materiales, telas y acabados",
      "Render o propuesta visual, cuando el diseño lo requiera",
      "Fabricación con talleres especializados",
      "Entrega e instalación",
      "Garantía de un año en estructura",
    ],
    para: "Comedores, mesas, espaldares, consolas, bibliotecas, escritorios, muebles de TV, closets, bancas y mobiliario de exterior.",
    image: "/img/proyectos/estudio-a-medida-tall.webp",
  },
  {
    id: "hogar-listo",
    title: "Hogar listo en Colombia",
    lead: "Llegas a Colombia. Tu casa ya está lista.",
    body: [
      "Nos encargamos del diseño, mobiliario, compras, decoración e instalación para que encuentres tu nuevo hogar completamente preparado para vivir.",
    ],
    image: "/img/proyectos/sala-sillas-rayas-wide.webp",
  },
];

const FAQ = [
  {
    q: "¿Trabajan fuera de Bogotá?",
    a: "Sí. Trabajamos en Bogotá, la Sabana y tierra caliente. Para proyectos en otras ciudades o zonas de Colombia, evaluamos el alcance y la logística de cada proyecto.",
  },
  {
    q: "¿Cómo cobran?",
    a: "Depende del tipo y alcance del proyecto. Las asesorías tienen un valor definido según el espacio y, en los proyectos integrales, los honorarios se establecen de acuerdo con el alcance y la gestión requerida. Antes de empezar, dejamos claro qué incluye el servicio y cuál será la inversión.",
  },
  {
    q: "¿Cuánto se demora un proyecto?",
    a: "Depende de lo que necesites. Para consultas o cambios puntuales, ofrecemos asesorías de 2 horas. Si el espacio requiere una propuesta más desarrollada, una asesoría de diseño puede tomar entre 2 y 3 semanas. Un proyecto integral suele tomar entre 2 y 4 meses, dependiendo de los tiempos de fabricación y compras. Cuando hay remodelación u obra, definimos un cronograma específico según el alcance.",
  },
  {
    q: "¿Puedo comprar solo algunos objetos de la tienda?",
    a: "Sí. Puedes comprar nuestras piezas de manera independiente, sin contratar un servicio de diseño. Hacemos envíos a toda Colombia.",
  },
  {
    q: "¿Hacen renders?",
    a: "Sí, cuando el proyecto lo requiere. Los usamos para visualizar el espacio antes de ejecutarlo y tomar decisiones con mayor seguridad, especialmente en remodelaciones, cambios de distribución o diseños de mobiliario a medida.",
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
            De una idea puntual a una transformación completa
          </h1>
          <p className="mt-7 max-w-2xl text-[1.05rem] font-light leading-relaxed text-mute">
            Podemos ayudarte a resolver un espacio, acompañarte en decisiones
            de decoración o encargarnos de todo el proyecto. Diseñamos,
            buscamos, fabricamos, remodelamos, decoramos y dejamos cada espacio
            listo para vivir.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {SERVICIOS.map((sv) => (
              <a
                key={sv.id}
                href={`#${sv.id}`}
                className="text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline hover:text-ink"
              >
                {sv.navLabel ?? sv.title}
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
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="display mt-1 text-[2.1rem] md:text-[2.9rem]">
                {sv.title}
              </h2>
              {sv.lead && (
                <p className="mt-4 text-[1.05rem] font-light text-espresso">
                  {sv.lead}
                </p>
              )}
              {sv.body.map((para) => (
                <p
                  key={para}
                  className="mt-5 text-[1.02rem] font-light leading-relaxed text-mute"
                >
                  {para}
                </p>
              ))}
              {sv.incluye && (
                <>
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
                </>
              )}
              {sv.para && (
                <p className="mt-7 border-t border-line pt-5 text-[0.85rem] font-light text-mute">
                  <span className="eyebrow">Ideal para</span>
                  <br />
                  {sv.para}
                </p>
              )}
              {sv.cross && (
                <a
                  href={sv.cross.href}
                  className="mt-5 block text-[0.88rem] font-light leading-relaxed text-clay-deep link-underline"
                >
                  {sv.cross.text}
                </a>
              )}
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
              Contanos qué tenés en mente
            </h2>
            <p className="mt-6 text-[1.02rem] font-light leading-relaxed text-mute">
              La primera llamada o videollamada no tiene costo. Queremos
              conocer tu espacio, entender qué necesitás y contarte cómo
              podemos ayudarte.
            </p>
            <p className="mt-4 text-[1.02rem] font-light leading-relaxed text-mute">
              A partir de ahí definimos qué tipo de servicio se adapta mejor a
              tu proyecto y los próximos pasos. Si es necesaria una visita al
              espacio, se coordina como parte de la asesoría.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
              >
                Hablar por WhatsApp
              </a>
              <a
                href={`mailto:${s.email}`}
                className="text-[0.9rem] font-light link-underline"
              >
                {s.email}
              </a>
            </div>
            <Link
              href="/proyectos"
              className="mt-8 inline-block text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline"
            >
              Ver nuestros proyectos
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
