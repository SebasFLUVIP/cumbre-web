"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Item = { url: string; status: "listo" | "subiendo" | "error"; error?: string };

/**
 * Sube fotos a Supabase Storage vía /api/admin/upload y mantiene la lista de
 * URLs en un input oculto (`name="images"`) para que el formulario del
 * producto siga enviándose exactamente igual que antes -- upsertProduct no
 * necesitó cambiar nada.
 */
export default function ImageUploader({
  initialImages,
}: {
  initialImages: string[];
}) {
  const [items, setItems] = useState<Item[]>(
    initialImages.map((url) => ({ url, status: "listo" as const }))
  );
  const [dragOver, setDragOver] = useState(false);
  const [manual, setManual] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    for (const file of list) {
      const placeholder: Item = { url: URL.createObjectURL(file), status: "subiendo" };
      setItems((prev) => [...prev, placeholder]);

      const fd = new FormData();
      fd.set("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "No se pudo subir");
        setItems((prev) =>
          prev.map((it) => (it === placeholder ? { url: json.url, status: "listo" } : it))
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it === placeholder
              ? { ...it, status: "error", error: err instanceof Error ? err.message : "Error" }
              : it
          )
        );
      }
    }
  }

  function remove(target: Item) {
    setItems((prev) => prev.filter((it) => it !== target));
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  function addManualPaths() {
    const paths = manual
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    if (!paths.length) return;
    setItems((prev) => [...prev, ...paths.map((url) => ({ url, status: "listo" as const }))]);
    setManual("");
  }

  const readyUrls = items.filter((it) => it.status === "listo").map((it) => it.url);

  return (
    <div>
      <input type="hidden" name="images" value={readyUrls.join("\n")} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-clay bg-clay/5" : "border-line hover:border-mute"
        }`}
      >
        <span className="font-display text-lg font-light">
          Arrastrá fotos acá, o hacé clic para elegirlas
        </span>
        <span className="text-[0.8rem] font-light text-mute">
          JPG, PNG o WebP · se convierten y comprimen solas
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 text-[0.8rem] font-light leading-relaxed text-mute">
        <strong className="text-espresso">Cuántas:</strong> 1 a 5 fotos. La primera
        es la que se ve en la grilla de la tienda; el resto aparece en la
        galería de la ficha. <strong className="text-espresso">Medidas ideales:</strong>{" "}
        al menos 1600 px de lado ancho, formato cuadrado (1:1) o vertical (4:5)
        para que se vea bien en la grilla — una foto de ambiente horizontal
        también sirve como una más de la galería.{" "}
        <strong className="text-espresso">Fondo:</strong> si es foto de estudio,
        mejor sobre fondo claro y parejo.
      </p>

      <details className="mt-4">
        <summary className="cursor-pointer text-[0.72rem] uppercase tracking-[0.14em] text-mute">
          Pegar rutas a mano (avanzado)
        </summary>
        <p className="mt-2 text-[0.78rem] font-light text-mute">
          Para las fotos de campaña que ya vienen procesadas en{" "}
          <code className="font-mono text-[0.75rem]">public/img/</code>. Una ruta
          por línea, y clic en &quot;Agregar&quot; -- se suman a la lista de abajo,
          no la reemplazan.
        </p>
        <textarea
          rows={2}
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="/img/proyectos/ejemplo-wide.webp"
          className="mt-2 w-full border border-line bg-bone px-3 py-2 font-mono text-[0.78rem] focus:border-clay focus:outline-none"
        />
        <button
          type="button"
          onClick={addManualPaths}
          className="mt-2 border border-line px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.14em] hover:bg-sand"
        >
          Agregar
        </button>
      </details>

      {items.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {items.map((it, i) => (
            <div key={it.url + i} className="group relative aspect-square overflow-hidden bg-sand">
              <Image
                src={it.url}
                alt=""
                fill
                sizes="140px"
                unoptimized={it.status !== "listo"}
                className={`object-cover ${it.status === "subiendo" ? "opacity-50" : ""}`}
              />
              {i === 0 && it.status === "listo" && (
                <span className="absolute left-1 top-1 bg-ink/80 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-bone">
                  Principal
                </span>
              )}
              {it.status === "subiendo" && (
                <span className="absolute inset-0 flex items-center justify-center text-[0.7rem] text-mute">
                  Subiendo…
                </span>
              )}
              {it.status === "error" && (
                <span className="absolute inset-0 flex items-center justify-center bg-clay/10 p-1 text-center text-[0.62rem] text-clay-deep">
                  {it.error ?? "Error"}
                </span>
              )}
              {it.status !== "subiendo" && (
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 px-1 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="px-1 text-[0.7rem] text-bone disabled:opacity-30"
                      title="Mover antes"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      className="px-1 text-[0.7rem] text-bone disabled:opacity-30"
                      title="Mover después"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it)}
                    className="px-1 text-[0.7rem] text-bone hover:text-clay"
                    title="Quitar"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
