import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { getPublicProducts, getSettings } from "@/lib/store";
import { PROJECTS } from "@/data/projects";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import LeadForm from "@/components/LeadForm";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getPublicProducts(),
    getSettings(),
  ]);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const project = PROJECTS[0];

  return (
    <>
      {/* ───────────────────────────── Hero ───────────────────────────── */}
      <section className="relative -mt-20 h-[92svh] min-h-[34rem] w-full md:-mt-24">
        {/* Dirección de arte por formato: el encuadre vertical conserva las
            hornacinas en móvil, donde el panorámico se recortaría a nada. */}
        <Image
          src="/img/proyectos/cumbre-principal-tall.webp"
          alt="Sala con hornacinas en arco, repisas en madera y muro de listones"
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/img/proyectos/cumbre-principal-wide.webp"
          alt="Sala con hornacinas en arco, repisas en madera y muro de listones"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        {/* Dos velos: uno arriba para que la cabecera se lea sobre cualquier
            foto, y uno abajo, más fuerte, que sostiene el titular. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-transparent to-transparent" />
        {/* En móvil el bloque de texto ocupa más alto, así que el velo sube más. */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(38,32,25,0.86) 0%, rgba(38,32,25,0.66) 42%, rgba(38,32,25,0.34) 68%, rgba(38,32,25,0) 92%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(38,32,25,0.80) 0%, rgba(38,32,25,0.48) 28%, rgba(38,32,25,0.14) 52%, rgba(38,32,25,0) 72%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(38,32,25,0.42) 0%, rgba(38,32,25,0.08) 42%, rgba(38,32,25,0) 62%)",
          }}
        />
        <div className="shell relative flex h-full flex-col justify-end pb-20 md:pb-28">
          <p className="eyebrow text-bone/80">
            Estudio de interiorismo &amp; tienda · Colombia
          </p>
          <h1 className="display mt-5 max-w-4xl text-[2.9rem] text-bone sm:text-[4rem] lg:text-[5.25rem]">
            Lo simple y lo natural,
            <br />
            llevado a tu casa
          </h1>
          <p className="mt-7 max-w-xl text-[1rem] font-light leading-relaxed text-bone/85">
            Cada proyecto es un recorrido hacia la calma. Líneas simples,
            materiales que respiran y la luz puesta donde tiene que estar, para
            que tu casa deje de ser un lugar y pase a ser una sensación.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/tienda"
              className="bg-bone px-9 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
            >
              Ver la tienda
            </Link>
            <Link
              href="/servicios"
              className="border border-bone/60 px-9 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              Quiero un proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Manifiesto ─────────────────────────── */}
      <section className="shell py-24 md:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Un homenaje a lo natural</p>
          <p className="display mt-7 text-[1.85rem] leading-[1.25] md:text-[2.6rem]">
            Creamos Cumbre como una marca que refleja lo que amamos: lo simple y
            lo natural. Creemos que tu casa tiene que contar tu historia.
          </p>
          <div className="mx-auto mt-10 h-px w-16 bg-clay" />
          <p className="mt-8 text-[0.95rem] font-light leading-relaxed text-mute">
            Trabajamos con madera que envejece bien, piedra que guarda el
            frío de la mañana y fibras tejidas a mano por artesanas
            colombianas. Materiales que no buscan llamar la atención: buscan
            durar, y volverse más lindos con los años.
          </p>
        </Reveal>
      </section>

      {/* ─────────────────────────── Categorías ─────────────────────────── */}
      <section className="shell pb-24 md:pb-32">
        <div className="flex items-end justify-between gap-6 pb-10">
          <div>
            <p className="eyebrow">La tienda</p>
            <h2 className="display mt-3 text-[2.2rem] md:text-[3rem]">
              Empezá por donde te llame
            </h2>
          </div>
          <Link
            href="/tienda"
            className="hidden shrink-0 text-[0.7rem] uppercase tracking-[0.18em] link-underline md:block"
          >
            Ver todo
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={(i % 4) * 90}>
              <Link href={`/tienda/${c.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  {c.image && (
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(min-width: 768px) 24vw, 48vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  )}
                  <div className="absolute inset-0 bg-ink/10 transition-colors group-hover:bg-ink/0" />
                </div>
                <h3 className="mt-4 font-display text-[1.5rem] font-light leading-tight">
                  {c.name}
                </h3>
                <p className="mt-0.5 text-[0.78rem] font-light text-mute">
                  {c.tagline}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Destacados ───────────────────────── */}
      <section className="border-y border-line bg-paper/60 py-24 md:py-32">
        <div className="shell">
          <div className="flex items-end justify-between gap-6 pb-10">
            <div>
              <p className="eyebrow">Selección</p>
              <h2 className="display mt-3 text-[2.2rem] md:text-[3rem]">
                Piezas que despiertan los sentidos
              </h2>
            </div>
            <Link
              href="/tienda"
              className="hidden shrink-0 text-[0.7rem] uppercase tracking-[0.18em] link-underline md:block"
            >
              Ver el catálogo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Proyectos ───────────────────────── */}
      <section className="shell py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Link href={`/proyectos/${project.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src="/img/proyectos/anapoima-terraza-wide.webp"
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
            </Link>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="eyebrow">Proyectos</p>
            <h2 className="display mt-4 text-[2.2rem] md:text-[3rem]">
              Una travesía hacia la casa que imaginaste
            </h2>
            <p className="mt-6 text-[0.95rem] font-light leading-relaxed text-mute">
              No entregamos una carpeta de planos: entregamos una casa que ya
              sabe recibir. Distribución, materiales, luz, muebles hechos a tu
              medida y montaje. De los apartamentos de Bogotá a las casas de
              campo de Anapoima y Villeta, donde el clima pide otra cosa y hay
              que saber escucharlo.
            </p>
            <dl className="mt-9 grid grid-cols-2 gap-y-6 border-t border-line pt-8">
              <div>
                <dt className="eyebrow">Proyecto integral</dt>
                <dd className="mt-1.5 text-[0.88rem] font-light text-mute">
                  De planos a montaje final
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Asesoría de diseño</dt>
                <dd className="mt-1.5 text-[0.88rem] font-light text-mute">
                  Una visita, un plan claro
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Muebles a medida</dt>
                <dd className="mt-1.5 text-[0.88rem] font-light text-mute">
                  Diseño y fabricación propia
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Remodelaciones</dt>
                <dd className="mt-1.5 text-[0.88rem] font-light text-mute">
                  Obra coordinada de principio a fin
                </dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/servicios"
                className="bg-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
              >
                Contanos tu proyecto
              </Link>
              <Link
                href={`/proyectos/${project.slug}`}
                className="border border-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
              >
                Ver el caso
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Franja editorial ───────────────────── */}
      <section className="relative h-[75svh] min-h-[26rem] w-full">
        <Image
          src="/img/proyectos/anapoima-bano-wide.webp"
          alt="Baño social con lavamanos tallado en travertino y lámpara de fique"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="shell relative flex h-full items-center">
          <Reveal className="max-w-2xl">
            <p className="display text-[1.7rem] leading-[1.3] text-bone md:text-[2.5rem]">
              Imaginá la luz de las cinco entrando de costado, el olor a
              madera recién aceitada, el silencio de una casa que por fin
              funciona. Eso es lo que diseñamos.
            </p>
            <p className="mt-7 text-[0.7rem] uppercase tracking-[0.22em] text-bone/70">
              Despertar los sentidos
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Captura de lead ───────────────────── */}
      <section className="shell py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Empecemos</p>
            <h2 className="display mt-4 text-[2.2rem] md:text-[3rem]">
              La primera llamada no tiene costo
            </h2>
            <p className="mt-6 text-[0.95rem] font-light leading-relaxed text-mute">
              Contanos qué espacio querés resolver y hacemos una primera
              llamada o videollamada sin costo. De ahí salís con una propuesta
              de alcance y un rango de inversión, sin compromiso. La visita al
              espacio ya hace parte de la asesoría y se cotiza aparte.
            </p>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-[0.7rem] uppercase tracking-[0.18em] text-clay-deep link-underline"
            >
              O escribinos por WhatsApp
            </a>

            {/* Firma: quién contesta del otro lado. */}
            <Link
              href="/nosotras"
              className="group mt-10 flex items-center gap-4 border-t border-line pt-8"
            >
              <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-full bg-sand">
                <Image
                  src="/img/proyectos/tita-y-vicky-avatar.webp"
                  alt="Luisa y Victoria, fundadoras de Cumbre"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <span>
                <span className="block font-display text-lg font-light group-hover:text-clay-deep">
                  Te responden Tita y Vicky
                </span>
                <span className="block text-[0.8rem] font-light text-mute">
                  Luisa y Victoria, fundadoras de Cumbre
                </span>
              </span>
            </Link>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <div className="border border-line bg-paper p-7 md:p-10">
              <LeadForm source="home" compact />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Cumbre & Cufania ───────────────────── */}
      <section className="border-t border-line bg-sand/50 py-20">
        <div className="shell grid items-center gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p className="eyebrow">Alianza</p>
            <h2 className="display mt-3 text-[1.9rem] md:text-[2.5rem]">
              Cumbre en Colombia, Cufania en Argentina
            </h2>
            <p className="mt-5 max-w-2xl text-[0.95rem] font-light leading-relaxed text-mute">
              Si te mudás de Colombia a Argentina —o al revés— no empezás de
              cero. Trabajamos con Cufania Home en Buenos Aires: te recibimos
              del otro lado con el mismo criterio, el mismo acompañamiento y una
              casa lista para estrenar.
            </p>
          </Reveal>
          <div className="md:col-span-5 md:text-right">
            <Link
              href="/cufania"
              className="inline-block border border-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
            >
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
