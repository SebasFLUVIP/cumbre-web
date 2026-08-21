import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display mt-5 text-[2.6rem] md:text-[3.6rem]">
        Esta página no existe
      </h1>
      <p className="mt-5 max-w-md text-[0.95rem] font-light leading-relaxed text-mute">
        Puede que la hayamos movido o que el enlace esté mal escrito. Volvé a la
        tienda o contanos qué estabas buscando.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/tienda"
          className="bg-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
        >
          Ir a la tienda
        </Link>
        <Link
          href="/contacto"
          className="border border-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-bone"
        >
          Escribirnos
        </Link>
      </div>
    </div>
  );
}
