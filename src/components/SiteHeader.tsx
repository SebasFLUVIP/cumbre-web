"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { useCart } from "./CartProvider";
import Wordmark from "./Wordmark";

const NAV = [
  { href: "/tienda", label: "Tienda", mega: true },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotras", label: "Nosotras" },
  { href: "/contacto", label: "Contacto" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  // El menú se guarda como "abierto para esta ruta". Así, al navegar, el
  // pathname cambia y el menú se cierra solo, sin un efecto que haga setState.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [megaFor, setMegaFor] = useState<string | null>(null);
  const menu = openFor === pathname;
  const mega = megaFor === pathname;
  const setMenu = (v: boolean) => setOpenFor(v ? pathname : null);
  const setMega = (v: boolean) => setMegaFor(v ? pathname : null);

  // El home tiene hero a sangre: la cabecera arranca transparente encima de él.
  const overHero = pathname === "/";
  const solid = scrolled || !overHero || mega;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <>
      <div className="bg-espresso text-bone">
        <div className="shell flex h-9 items-center justify-center gap-6 text-[0.65rem] font-light tracking-[0.18em] uppercase">
          <span>Envío gratis desde $800.000</span>
          <span className="hidden opacity-40 sm:inline">·</span>
          <Link href="/servicios" className="hidden link-underline sm:inline">
            Primera llamada sin costo
          </Link>
        </div>
      </div>

      <header
        onMouseLeave={() => setMega(false)}
        className={`sticky top-0 z-50 transition-colors duration-500 ${
          solid
            ? "bg-bone/95 text-ink backdrop-blur-md border-b border-line"
            : "bg-transparent text-bone"
        }`}
      >
        <div className="shell flex h-20 items-center justify-between gap-4 md:h-24">
          <button
            type="button"
            onClick={() => setMenu(true)}
            aria-label="Abrir menú"
            className="-ml-1 p-2 lg:hidden"
          >
            <span className="block h-px w-6 bg-current" />
            <span className="mt-[6px] block h-px w-6 bg-current" />
            <span className="mt-[6px] block h-px w-4 bg-current" />
          </button>

          <nav className="hidden flex-1 items-center gap-8 lg:flex">
            {NAV.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setMega(Boolean(item.mega))}
                className={`link-underline text-[0.7rem] uppercase tracking-[0.18em] ${
                  pathname.startsWith(item.href) ? "opacity-100" : "opacity-75"
                } hover:opacity-100`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            aria-label="Cumbre, inicio"
            className="shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
          >
            {/* El wrapper lleva el display: Wordmark ya trae `inline-flex` en su
                base y una utilidad `hidden` propia no siempre le gana. */}
            <span className="block md:hidden">
              <Wordmark size="sm" withTagline={false} />
            </span>
            <span className="hidden md:block">
              <Wordmark size="md" />
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-6">
            {NAV.slice(3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hidden link-underline text-[0.7rem] uppercase tracking-[0.18em] lg:inline ${
                  pathname.startsWith(item.href) ? "opacity-100" : "opacity-75"
                } hover:opacity-100`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative text-[0.7rem] uppercase tracking-[0.18em] opacity-85 hover:opacity-100"
              aria-label={`Carrito, ${count} artículos`}
            >
              Carrito
              <span className="ml-1 tabular-nums">({count})</span>
            </button>
          </div>
        </div>

        {/* Mega menú de tienda */}
        <div
          onMouseEnter={() => setMega(true)}
          className={`absolute inset-x-0 top-full hidden overflow-hidden border-b border-line bg-bone text-ink transition-[max-height,opacity] duration-500 lg:block ${
            mega ? "max-h-[28rem] opacity-100" : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="shell grid grid-cols-4 gap-x-10 gap-y-6 py-10">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/tienda/${c.id}`}
                className="group block"
              >
                <span className="font-display text-2xl font-light group-hover:text-clay-deep">
                  {c.name}
                </span>
                <span className="mt-1 block text-[0.78rem] font-light text-mute">
                  {c.tagline}
                </span>
              </Link>
            ))}
            <div className="col-span-4 rule" />
            <Link
              href="/tienda"
              className="col-span-2 text-[0.7rem] uppercase tracking-[0.18em] link-underline"
            >
              Ver todo el catálogo
            </Link>
            <Link
              href="/servicios#a-medida"
              className="col-span-2 text-right text-[0.7rem] uppercase tracking-[0.18em] text-clay-deep link-underline"
            >
              ¿Lo necesitás a medida? Hablemos
            </Link>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${menu ? "" : "pointer-events-none"}`}
        aria-hidden={!menu}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Cerrar menú"
          onClick={() => setMenu(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-500 ${
            menu ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-6">
            <Wordmark size="sm" withTagline={false} />
            <button
              type="button"
              onClick={() => setMenu(false)}
              className="text-[0.7rem] uppercase tracking-[0.18em] text-mute"
            >
              Cerrar
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <p className="eyebrow">Tienda</p>
            <ul className="mt-4 space-y-3">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/tienda/${c.id}`}
                    className="font-display text-2xl font-light"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rule my-8" />
            <ul className="space-y-3">
              {NAV.filter((n) => !n.mega).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="font-display text-2xl font-light">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
