import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getPublicProducts,
  getSettings,
} from "@/lib/store";
import { categoryName } from "@/lib/categories";
import { deliveryLabel, formatCOP } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Si la base no responde durante el build, no se pregeneran las fichas y se
  // sirven bajo demanda. Preferimos un sitio más lento a un build caído.
  try {
    return (await getPublicProducts()).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.excerpt,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: {
      title: `${p.name} · Cumbre`,
      description: p.excerpt,
      images: p.images.length ? p.images : undefined,
    },
  };
}

function Spec({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="border-b border-line py-4">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1.5 text-[0.98rem] font-light leading-relaxed text-mute">
        {value}
      </dd>
    </div>
  );
}

export default async function ProductoPage({ params }: Params) {
  const { slug } = await params;
  const [product, all, settings] = await Promise.all([
    getProductBySlug(slug),
    getPublicProducts(),
    getSettings(),
  ]);
  if (!product) notFound();

  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.excerpt,
    image: product.images.map((i) => `https://cumbredeco.com${i}`),
    brand: { "@type": "Brand", name: "Cumbre" },
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: product.priceCOP,
      availability:
        product.stock === null || product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell pt-8">
        <nav className="flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-mute">
          <Link href="/tienda" className="link-underline">
            Tienda
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/tienda/${product.category}`} className="link-underline">
            {categoryName(product.category)}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <article className="shell grid gap-12 py-10 lg:grid-cols-12 lg:gap-16 lg:py-14">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            {product.subcategory && (
              <p className="eyebrow">{product.subcategory}</p>
            )}
            <h1 className="display mt-2 text-[2.3rem] md:text-[2.9rem]">
              {product.name}
            </h1>
            <p className="mt-4 text-[1.05rem] font-light leading-relaxed text-mute">
              {product.excerpt}
            </p>

            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            <ul className="mt-8 space-y-2.5 border-t border-line pt-7 text-[0.85rem] font-light text-mute">
              <li className="flex gap-3">
                <span className="text-clay-deep">—</span>
                {deliveryLabel(product.delivery)}
              </li>
              <li className="flex gap-3">
                <span className="text-clay-deep">—</span>
                Envío gratis en compras desde{" "}
                {formatCOP(settings.freeShippingThresholdCOP)}
              </li>
              <li className="flex gap-3">
                <span className="text-clay-deep">—</span>
                Pagá con tarjeta, PSE o Nequi
              </li>
              {product.madeToOrder && (
                <li className="flex gap-3">
                  <span className="text-clay-deep">—</span>
                  Se fabrica a pedido y se puede ajustar a tu medida
                </li>
              )}
            </ul>

            <div className="mt-9">
              <h2 className="eyebrow">La pieza</h2>
              <p className="mt-3 text-[0.93rem] font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            <dl className="mt-8 border-t border-line">
              <Spec label="Medidas" value={product.dimensions} />
              <Spec label="Materiales" value={product.materials?.join(" · ")} />
              <Spec label="Cuidados" value={product.care} />
            </dl>

            <div className="mt-8 border border-line bg-sand/40 p-6">
              <p className="font-display text-xl font-light">
                ¿La querés en otra medida o acabado?
              </p>
              <p className="mt-2 text-[0.95rem] font-light leading-relaxed text-mute">
                Fabricamos a medida. Escribinos con la medida exacta y te
                cotizamos sin compromiso.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
                    `Hola Cumbre, me interesa "${product.name}" y quisiera consultar por medidas o acabados.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-ink px-6 py-3 text-[0.68rem] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-bone"
                >
                  Consultar por WhatsApp
                </a>
                <Link
                  href="/servicios#a-medida"
                  className="self-center text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
                >
                  Ver muebles a medida
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="shell py-20">
            <h2 className="display text-[1.9rem] md:text-[2.4rem]">
              También de {categoryName(product.category).toLowerCase()}
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
