"use client";

import Image from "next/image";
import { useState } from "react";
import ProductMedia from "./ProductMedia";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <ProductMedia
        alt={alt}
        ratio="4/5"
        sizes="(min-width: 1024px) 52vw, 100vw"
        className="max-h-[46vh] sm:max-h-[55vh] lg:max-h-[70vh]"
      />
    );
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/5] max-h-[46vh] overflow-hidden bg-sand sm:max-h-[55vh] lg:max-h-[70vh]">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-square w-20 overflow-hidden bg-sand transition-opacity ${
                i === active ? "opacity-100" : "opacity-55 hover:opacity-85"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
