import Link from "next/link";
import type { PublicProduct } from "@/lib/types";
import { deliveryShort, formatCOP } from "@/lib/format";
import ProductMedia from "./ProductMedia";

export default function ProductCard({
  product,
  priority = false,
  sizes,
}: {
  product: PublicProduct;
  priority?: boolean;
  sizes?: string;
}) {
  const immediate = product.delivery.kind === "inmediata";
  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative">
        <ProductMedia
          src={product.images[0]}
          alt={product.name}
          priority={priority}
          sizes={sizes}
        />
        {immediate && (
          <span className="absolute left-3 top-3 bg-bone/90 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-espresso backdrop-blur">
            Entrega inmediata
          </span>
        )}
        {product.madeToOrder && (
          <span className="absolute left-3 top-3 bg-espresso/90 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-bone backdrop-blur">
            A medida
          </span>
        )}
      </div>
      <div className="pt-4">
        <h3 className="font-display text-[1.35rem] font-light leading-tight">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-[0.82rem] font-light text-mute">
          {product.excerpt}
        </p>
        <div className="mt-2.5 flex items-baseline justify-between gap-3">
          <span className="text-[0.92rem] tabular-nums">
            {formatCOP(product.priceCOP)}
          </span>
          <span className="text-[0.62rem] uppercase tracking-[0.16em] text-mute">
            {deliveryShort(product.delivery)}
          </span>
        </div>
      </div>
    </Link>
  );
}
