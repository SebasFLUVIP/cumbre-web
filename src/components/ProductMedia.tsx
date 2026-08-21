import Image from "next/image";

/**
 * Imagen de producto con respaldo tipográfico. Varios productos del catálogo
 * todavía no tienen foto propia: en vez de un cuadro gris, se muestra una placa
 * con el monograma para que la grilla no se rompa.
 */
export default function ProductMedia({
  src,
  alt,
  ratio = "4/5",
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw",
  priority = false,
  className = "",
}: {
  src?: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-sand ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-3"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 30%, #f6f1e8 0%, #ece4d6 60%, #e3d9c8 100%)",
          }}
        >
          <span
            className="font-display text-5xl font-light text-clay/45"
            style={{ letterSpacing: "0.1em", textIndent: "0.1em" }}
          >
            C
          </span>
          <span className="px-6 text-center text-[0.55rem] uppercase tracking-[0.24em] text-mute/70">
            Fotografía en producción
          </span>
        </div>
      )}
    </div>
  );
}
