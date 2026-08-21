type Props = {
  /** Tamaño en rem del texto principal. */
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  className?: string;
};

const SIZES = {
  sm: { word: "text-[1.15rem]", rule: "w-8", tag: "text-[0.45rem]" },
  md: { word: "text-[1.9rem]", rule: "w-14", tag: "text-[0.6rem]" },
  lg: { word: "text-[2.75rem] md:text-[3.5rem]", rule: "w-20", tag: "text-[0.7rem]" },
};

/**
 * Reproduce el logotipo con tipografía viva en vez de un PNG: escala sin
 * pixelarse, hereda el color del contexto (cabecera clara u oscura) y pesa cero.
 */
export default function Wordmark({
  size = "md",
  withTagline = true,
  className = "",
}: Props) {
  const s = SIZES[size];
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className={`font-display font-light ${s.word}`}
        style={{ letterSpacing: "0.18em", textIndent: "0.18em" }}
      >
        CUMBRE
      </span>
      {withTagline && (
        <>
          <span
            className={`${s.rule} mt-[0.35em] mb-[0.3em] h-px opacity-60`}
            style={{ background: "currentColor" }}
            aria-hidden
          />
          <span
            className={`${s.tag} font-sans font-medium uppercase opacity-95`}
            style={{ letterSpacing: "0.3em", textIndent: "0.3em" }}
          >
            Decoration &amp; Interior Design
          </span>
        </>
      )}
    </span>
  );
}
