import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublicProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/categories";
import ShopBrowser from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Lámparas, espejos, objetos de decoración, espaldares, mesas, sillas y muebles de exterior. Envíos a toda Colombia.",
  alternates: { canonical: "/tienda" },
};

export default async function TiendaPage() {
  const products = await getPublicProducts();

  return (
    <>
      {/* Cabecera con foto: la tienda entraba en frío, solo con texto. */}
      <section className="relative -mt-20 h-[68svh] min-h-[24rem] w-full md:-mt-24">
        <Image
          src="/img/proyectos/estilo-comedor-lamparas-vert-tall.webp"
          alt="Comedor con lámparas colgantes tejidas y sillas en cuerda"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%] md:hidden"
        />
        <Image
          src="/img/proyectos/estilo-comedor-lamparas-wide.webp"
          alt="Comedor con lámparas colgantes tejidas y sillas en cuerda"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[50%_28%] md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(38,32,25,0.80) 0%, rgba(38,32,25,0.45) 32%, rgba(38,32,25,0) 68%)",
          }}
        />
        <div className="shell relative flex h-full flex-col justify-end pb-12 md:pb-16">
          <p className="eyebrow text-bone/80">Tienda</p>
          <h1 className="display mt-4 text-[2.6rem] text-bone md:text-[4rem]">
            Objetos para armar tu casa
          </h1>
        </div>
      </section>

      <header className="border-b border-line">
        <div className="shell py-12 md:py-16">
          <p className="max-w-2xl text-[0.98rem] font-light leading-relaxed text-mute">
            Objetos elegidos uno por uno, con las manos. Fibras tejidas,
            maderas macizas, piedra y cerámica torneada: piezas que envejecen
            bien y que le dan a cada rincón la calidez que no se compra hecha.
            En cada ficha vas a encontrar el tiempo de entrega real.
          </p>
          <nav className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/tienda/${c.id}`}
                className="text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="shell py-14 md:py-20">
        <ShopBrowser products={products} />
      </section>
    </>
  );
}
