import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import { getPublicProducts } from "@/lib/store";
import type { CategoryId } from "@/lib/types";
import ShopBrowser from "@/components/ShopBrowser";

type Params = { params: Promise<{ categoria: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categoria: c.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categoria } = await params;
  const cat = CATEGORY_MAP[categoria as CategoryId];
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/tienda/${cat.id}` },
  };
}

export default async function CategoriaPage({ params }: Params) {
  const { categoria } = await params;
  const cat = CATEGORY_MAP[categoria as CategoryId];
  if (!cat) notFound();

  const products = (await getPublicProducts()).filter(
    (p) => p.category === cat.id
  );

  return (
    <>
      <header className="relative border-b border-line">
        <div className="shell grid items-end gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <nav className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-mute">
              <Link href="/tienda" className="link-underline">
                Tienda
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink">{cat.name}</span>
            </nav>
            <h1 className="display mt-5 text-[2.6rem] md:text-[4rem]">
              {cat.name}
            </h1>
            <p className="mt-6 max-w-xl text-[1.05rem] font-light leading-relaxed text-mute">
              {cat.description}
            </p>
          </div>
          {cat.image && (
            <div className="md:col-span-5">
              <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="shell py-14 md:py-20">
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-3xl font-light">
              Estamos armando esta categoría
            </p>
            <p className="mx-auto mt-4 max-w-md text-[0.92rem] font-light text-mute">
              Escribinos y te contamos qué tenemos disponible o lo hacemos a
              medida.
            </p>
            <Link
              href="/contacto"
              className="mt-8 inline-block border border-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
            >
              Hablemos
            </Link>
          </div>
        ) : (
          <ShopBrowser products={products} showCategoryFilter={false} />
        )}
      </section>

      <section className="border-t border-line bg-sand/40">
        <div className="shell flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="display text-[1.8rem] md:text-[2.3rem]">
              ¿No encontrás la medida exacta?
            </h2>
            <p className="mt-3 max-w-xl text-[0.93rem] font-light text-mute">
              Fabricamos a medida en madera, tapizado y fibras naturales. Contanos
              qué necesitás y te cotizamos.
            </p>
          </div>
          <Link
            href="/servicios#a-medida"
            className="shrink-0 bg-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
          >
            Pedir cotización
          </Link>
        </div>
      </section>
    </>
  );
}
