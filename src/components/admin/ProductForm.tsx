"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { formatCOP } from "@/lib/format";
import ImageUploader from "./ImageUploader";
import type { Product, Settings } from "@/lib/types";

const input =
  "w-full border border-line bg-bone px-3 py-2.5 text-[0.9rem] font-light focus:border-clay focus:outline-none";
const lab = "eyebrow block mb-2";

function Field({
  label,
  hint,
  children,
  wide = false,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className={lab}>{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-[0.72rem] font-light text-mute">{hint}</p>}
    </div>
  );
}

export default function ProductForm({
  product,
  settings,
  action,
  onDelete,
}: {
  product?: Product;
  settings: Settings;
  action: (fd: FormData) => void | Promise<void>;
  onDelete?: (fd: FormData) => void | Promise<void>;
}) {
  const [costUSD, setCostUSD] = useState(product?.supplier?.costUSD ?? 0);
  const [costCOP, setCostCOP] = useState(product?.supplier?.costCOP ?? 0);
  const [markup, setMarkup] = useState(product?.markup ?? settings.defaultMarkup);
  const [price, setPrice] = useState(product?.priceCOP ?? 0);
  const [deliveryKind, setDeliveryKind] = useState(product?.delivery.kind ?? "dias");

  const base = costCOP > 0 ? costCOP : costUSD * settings.usdToCop;
  const suggested = base > 0 ? Math.round((base * markup) / 1000) * 1000 : 0;

  return (
    <form action={action} className="mt-10 grid gap-12 lg:grid-cols-12">
      <input type="hidden" name="id" value={product?.id ?? ""} />

      {/* ── Columna principal ── */}
      <div className="lg:col-span-8">
        <section>
          <h2 className="font-display text-2xl font-light">Ficha pública</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Nombre" wide>
              <input name="name" required defaultValue={product?.name} className={input} />
            </Field>
            <Field label="URL (slug)" hint="Se genera del nombre si lo dejás vacío.">
              <input name="slug" defaultValue={product?.slug} className={input} />
            </Field>
            <Field label="Categoría">
              <select name="category" defaultValue={product?.category ?? "objetos"} className={input}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Subcategoría" hint="Opcional. Ej.: Portavelas, Comedor, Asoleadoras.">
              <input name="subcategory" defaultValue={product?.subcategory} className={input} />
            </Field>
            <Field label="Frase corta" hint="Se ve bajo el nombre en la grilla. Una línea.">
              <input name="excerpt" defaultValue={product?.excerpt} className={input} />
            </Field>
            <Field label="Descripción" wide>
              <textarea
                name="description"
                rows={5}
                defaultValue={product?.description}
                className={`${input} resize-y`}
              />
            </Field>
            <div className="sm:col-span-2">
              <label className={lab}>Fotos</label>
              <ImageUploader initialImages={product?.images ?? []} />
            </div>
            <Field label="Medidas">
              <input name="dimensions" defaultValue={product?.dimensions} className={input} />
            </Field>
            <Field label="Materiales" hint="Separados por coma.">
              <input
                name="materials"
                defaultValue={product?.materials?.join(", ")}
                className={input}
              />
            </Field>
            <Field label="Cuidados" wide>
              <input name="care" defaultValue={product?.care} className={input} />
            </Field>
            <Field
              label="Variantes"
              wide
              hint='Una por línea. Para cobrar distinto: "King 200 cm | +620000".'
            >
              <textarea
                name="variants"
                rows={3}
                defaultValue={product?.variants
                  ?.map((v) =>
                    v.priceDeltaCOP ? `${v.name} | ${v.priceDeltaCOP}` : v.name
                  )
                  .join("\n")}
                className={`${input} resize-y`}
              />
            </Field>
            <Field label="Etiquetas" wide hint="Separadas por coma. Uso interno y de búsqueda.">
              <input name="tags" defaultValue={product?.tags?.join(", ")} className={input} />
            </Field>
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl font-light">
            Dónde comprarlo <span className="text-mute">· solo interno</span>
          </h2>
          <p className="mt-2 text-[0.85rem] font-light text-mute">
            Este bloque nunca viaja al navegador del cliente: se elimina en el
            servidor antes de renderizar la tienda.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Proveedor">
              <input
                name="supplierName"
                defaultValue={product?.supplier?.name}
                placeholder="Amazon, Ecofibras Curití, taller propio…"
                className={input}
              />
            </Field>
            <Field label="Link de compra" hint="La URL exacta del producto en el proveedor.">
              <input
                name="supplierUrl"
                type="url"
                defaultValue={product?.supplier?.url}
                placeholder="https://…"
                className={`${input} font-mono text-[0.8rem]`}
              />
            </Field>
            <Field label="Costo en USD" hint={`TRM configurada: ${formatCOP(settings.usdToCop)}`}>
              <input
                name="supplierCostUSD"
                type="number"
                step="0.01"
                value={costUSD || ""}
                onChange={(e) => setCostUSD(Number(e.target.value) || 0)}
                className={input}
              />
            </Field>
            <Field label="Costo en COP" hint="Para proveedores colombianos.">
              <input
                name="supplierCostCOP"
                type="number"
                value={costCOP || ""}
                onChange={(e) => setCostCOP(Number(e.target.value) || 0)}
                className={input}
              />
            </Field>
            <Field label="Notas internas" wide>
              <input
                name="supplierNotes"
                defaultValue={product?.supplier?.notes}
                className={input}
              />
            </Field>
          </div>
        </section>
      </div>

      {/* ── Columna lateral ── */}
      <aside className="lg:col-span-4">
        <div className="space-y-5 border border-line bg-bone p-6 lg:sticky lg:top-8">
          <div>
            <label className={lab}>Margen (multiplicador)</label>
            <input
              name="markup"
              type="number"
              step="0.1"
              value={markup}
              onChange={(e) => setMarkup(Number(e.target.value) || 0)}
              className={input}
            />
            {suggested > 0 && (
              <p className="mt-2 text-[0.78rem] font-light text-mute">
                Sugerido: <span className="text-espresso">{formatCOP(suggested)}</span>{" "}
                <button
                  type="button"
                  onClick={() => setPrice(suggested)}
                  className="ml-1 text-clay-deep link-underline"
                >
                  usar
                </button>
              </p>
            )}
          </div>

          <div>
            <label className={lab}>Precio de venta (COP)</label>
            <input
              name="priceCOP"
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              className={input}
            />
            <p className="mt-1.5 text-[0.72rem] font-light text-mute">
              Si lo dejás en cero y hay costo cargado, se calcula solo.
            </p>
          </div>

          <div>
            <label className={lab}>Precio tachado (opcional)</label>
            <input
              name="compareAtCOP"
              type="number"
              defaultValue={product?.compareAtCOP ?? ""}
              className={input}
            />
          </div>

          <div className="border-t border-line pt-5">
            <label className={lab}>Entrega</label>
            <select
              name="deliveryKind"
              value={deliveryKind}
              onChange={(e) => setDeliveryKind(e.target.value as "dias" | "inmediata")}
              className={input}
            >
              <option value="inmediata">Entrega inmediata</option>
              <option value="dias">En días hábiles</option>
            </select>
            {deliveryKind === "dias" && (
              <input
                name="deliveryDays"
                type="number"
                min={1}
                defaultValue={product?.delivery.days ?? settings.amazonDeliveryDays}
                className={`${input} mt-3`}
                placeholder="Días hábiles"
              />
            )}
          </div>

          <div>
            <label className={lab}>Inventario</label>
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={product?.stock ?? ""}
              placeholder="Vacío = se hace a pedido"
              className={input}
            />
          </div>

          <div className="space-y-2.5 border-t border-line pt-5">
            {[
              { name: "active", label: "Visible en la tienda", def: product?.active ?? true },
              { name: "featured", label: "Destacado en la home", def: product?.featured ?? false },
              { name: "madeToOrder", label: "Se fabrica a medida", def: product?.madeToOrder ?? false },
            ].map((c) => (
              <label key={c.name} className="flex items-center gap-3 text-[0.87rem] font-light">
                <input
                  type="checkbox"
                  name={c.name}
                  defaultChecked={c.def}
                  className="h-[15px] w-[15px] accent-[#2c261e]"
                />
                {c.label}
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-ink py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone hover:bg-espresso"
          >
            Guardar
          </button>
        </div>

        {onDelete && product && (
          <div className="mt-5 border border-line p-6">
            <p className="text-[0.8rem] font-light text-mute">
              Eliminar es permanente. Si solo querés sacarlo de la tienda,
              desmarcá «Visible».
            </p>
            <button
              type="submit"
              formAction={onDelete}
              formNoValidate
              className="mt-4 w-full border border-clay/50 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-clay-deep hover:bg-clay/10"
            >
              Eliminar producto
            </button>
          </div>
        )}
      </aside>
    </form>
  );
}
