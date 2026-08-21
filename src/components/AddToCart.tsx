"use client";

import { useState } from "react";
import type { PublicProduct } from "@/lib/types";
import { deliveryLabel, formatCOP, variantPrice } from "@/lib/format";
import { useCart } from "./CartProvider";

export default function AddToCart({ product }: { product: PublicProduct }) {
  const { add } = useCart();
  const hasVariants = Boolean(product.variants?.length);
  const [variant, setVariant] = useState<string | undefined>(
    hasVariants ? product.variants![0].name : undefined
  );
  const [qty, setQty] = useState(1);

  const price = variantPrice(product, variant);
  const soldOut = product.stock !== null && product.stock <= 0;
  const maxQty = product.stock ?? 99;

  return (
    <div>
      <p className="font-display text-[2rem] font-light tabular-nums">
        {formatCOP(price)}
      </p>
      {product.compareAtCOP && product.compareAtCOP > price && (
        <p className="mt-1 text-[0.85rem] font-light text-mute line-through tabular-nums">
          {formatCOP(product.compareAtCOP)}
        </p>
      )}

      {hasVariants && (
        <div className="mt-8">
          <p className="eyebrow">
            {product.variants!.some((v) => v.hex) ? "Color" : "Opción"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.variants!.map((v) => {
              const active = v.name === variant;
              return (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setVariant(v.name)}
                  aria-pressed={active}
                  className={`border px-4 py-2.5 text-[0.8rem] font-light transition-colors ${
                    active
                      ? "border-ink bg-ink text-bone"
                      : "border-line hover:border-mute"
                  }`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-stretch gap-3">
        <div className="flex items-center border border-line">
          <button
            type="button"
            aria-label="Quitar uno"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-3 hover:bg-sand"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label="Agregar uno"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            className="px-4 py-3 hover:bg-sand"
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={soldOut}
          onClick={() =>
            add(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                variant,
                unitPriceCOP: price,
                deliveryLabel: deliveryLabel(product.delivery),
              },
              qty
            )
          }
          className="flex-1 bg-ink py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso disabled:cursor-not-allowed disabled:opacity-50"
        >
          {soldOut ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>

      {product.stock !== null && product.stock > 0 && product.stock <= 3 && (
        <p className="mt-3 text-[0.78rem] font-light text-clay-deep">
          Quedan {product.stock} disponibles.
        </p>
      )}
    </div>
  );
}
