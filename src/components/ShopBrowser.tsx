"use client";

import { useMemo, useState } from "react";
import type { CategoryId, PublicProduct } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import ProductCard from "./ProductCard";

type Sort = "destacados" | "precio-asc" | "precio-desc" | "nombre";

const AVAILABILITY = [
  { id: "inmediata", label: "Entrega inmediata" },
  { id: "medida", label: "Hecho a medida" },
] as const;

const PRICE_BANDS = [
  { id: "0-500", label: "Hasta $500.000", min: 0, max: 500000 },
  { id: "500-1500", label: "$500.000 – $1.500.000", min: 500000, max: 1500000 },
  { id: "1500-4000", label: "$1.500.000 – $4.000.000", min: 1500000, max: 4000000 },
  { id: "4000+", label: "Más de $4.000.000", min: 4000000, max: Infinity },
];

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-6 last:border-b-0">
      <h3 className="eyebrow">{title}</h3>
      <div className="mt-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[0.88rem] font-light">
      <span
        className={`grid h-[15px] w-[15px] shrink-0 place-items-center border transition-colors ${
          checked ? "border-ink bg-ink" : "border-line"
        }`}
      >
        {checked && <span className="h-[5px] w-[5px] bg-bone" />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  );
}

export default function ShopBrowser({
  products,
  showCategoryFilter = true,
}: {
  products: PublicProduct[];
  showCategoryFilter?: boolean;
}) {
  const [cats, setCats] = useState<CategoryId[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [bands, setBands] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("destacados");
  const [panel, setPanel] = useState(false);

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const visible = useMemo(() => {
    let out = products.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (avail.length) {
        const isImmediate = p.delivery.kind === "inmediata";
        const isMadeToOrder = Boolean(p.madeToOrder);
        const ok =
          (avail.includes("inmediata") && isImmediate) ||
          (avail.includes("medida") && isMadeToOrder);
        if (!ok) return false;
      }
      if (bands.length) {
        const inBand = bands.some((id) => {
          const b = PRICE_BANDS.find((x) => x.id === id);
          return b && p.priceCOP >= b.min && p.priceCOP < b.max;
        });
        if (!inBand) return false;
      }
      return true;
    });

    out = [...out];
    if (sort === "precio-asc") out.sort((a, b) => a.priceCOP - b.priceCOP);
    else if (sort === "precio-desc") out.sort((a, b) => b.priceCOP - a.priceCOP);
    else if (sort === "nombre") out.sort((a, b) => a.name.localeCompare(b.name, "es"));
    else out.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return out;
  }, [products, cats, avail, bands, sort]);

  const activeCount = cats.length + avail.length + bands.length;

  const filters = (
    <>
      {showCategoryFilter && (
        <Group title="Categoría">
          {CATEGORIES.map((c) => (
            <Check
              key={c.id}
              checked={cats.includes(c.id)}
              onChange={() => toggle(cats, c.id, setCats)}
            >
              {c.name}
            </Check>
          ))}
        </Group>
      )}
      <Group title="Disponibilidad">
        {AVAILABILITY.map((a) => (
          <Check
            key={a.id}
            checked={avail.includes(a.id)}
            onChange={() => toggle(avail, a.id, setAvail)}
          >
            {a.label}
          </Check>
        ))}
      </Group>
      <Group title="Precio">
        {PRICE_BANDS.map((b) => (
          <Check
            key={b.id}
            checked={bands.includes(b.id)}
            onChange={() => toggle(bands, b.id, setBands)}
          >
            {b.label}
          </Check>
        ))}
      </Group>
      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => {
            setCats([]);
            setAvail([]);
            setBands([]);
          }}
          className="mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
        >
          Limpiar filtros ({activeCount})
        </button>
      )}
    </>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-32">{filters}</div>
      </aside>

      <div className="lg:col-span-9">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-[0.78rem] font-light text-mute">
            {visible.length} {visible.length === 1 ? "pieza" : "piezas"}
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setPanel(true)}
              className="text-[0.68rem] uppercase tracking-[0.16em] lg:hidden"
            >
              Filtrar{activeCount ? ` (${activeCount})` : ""}
            </button>
            <label className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-mute">
              <span className="hidden sm:inline">Ordenar</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-transparent py-1 text-[0.78rem] font-light normal-case tracking-normal text-ink focus:outline-none"
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre</option>
              </select>
            </label>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="py-24 text-center font-display text-2xl font-light text-mute">
            No hay piezas con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
            {visible.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                priority={i < 3}
                sizes="(min-width: 1024px) 26vw, (min-width: 768px) 30vw, 48vw"
              />
            ))}
          </div>
        )}
      </div>

      {/* Panel de filtros en móvil */}
      <div
        className={`fixed inset-0 z-[65] lg:hidden ${panel ? "" : "pointer-events-none"}`}
        aria-hidden={!panel}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Cerrar filtros"
          onClick={() => setPanel(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-400 ${
            panel ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto bg-bone px-6 pb-8 pt-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            panel ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[0.7rem] uppercase tracking-[0.22em]">Filtrar</h2>
            <button
              type="button"
              onClick={() => setPanel(false)}
              className="text-[0.7rem] uppercase tracking-[0.18em] text-mute"
            >
              Cerrar
            </button>
          </div>
          {filters}
          <button
            type="button"
            onClick={() => setPanel(false)}
            className="mt-8 w-full bg-ink py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone"
          >
            Ver {visible.length} piezas
          </button>
        </div>
      </div>
    </div>
  );
}
