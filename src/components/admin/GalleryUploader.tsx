"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type GalleryItem = {
  src: string;
  caption?: string;
  ratio?: "tall" | "wide" | "sq";
};

type Item = GalleryItem & { status: "listo" | "subiendo" | "error"; error?: string };

/**
 * Como ImageUploader, pero cada foto lleva además un pie de foto y una
 * proporción (para el layout de la galería del proyecto) -- por eso serializa
 * a JSON en vez de a una lista de URLs separadas por línea.
 */
export default function GalleryUploader({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = useState<Item[]>(
    initial.map((g) => ({ ...g, status: "listo" as const }))
  );
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    for (const file of list) {
      const placeholder: Item = {
        src: URL.createObjectURL(file),
        ratio: "wide",
        status: "subiendo",
      };
      setItems((prev) => [...prev, placeholder]);

      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", "proyectos");
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "No se pudo subir");
        setItems((prev) =>
          prev.map((it) => (it === placeholder ? { ...it, src: json.url, status: "listo" } : it))
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

  function update(target: Item, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it === target ? { ...it, ...patch } : it)));
  }

  const ready = items.filter((it) => it.status === "listo");
  const hiddenValue = JSON.stringify(
    ready.map(({ src, caption, ratio }) => ({ src, caption: caption || undefined, ratio }))
  );

  return (
    <div>
      <input type="hidden" name="gallery" value={hiddenValue} />

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
          Arrastrá fotos de la galería acá, o hacé clic para elegirlas
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

      {items.length > 0 && (
        <div className="mt-5 space-y-4">
          {items.map((it, i) => (
            <div key={it.src + i} className="flex gap-4 border border-line bg-bone p-3">
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-sand">
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="96px"
                  unoptimized={it.status !== "listo"}
                  className={`object-cover ${it.status === "subiendo" ? "opacity-50" : ""}`}
                />
                {it.status === "subiendo" && (
                  <span className="absolute inset-0 flex items-center justify-center text-[0.65rem] text-mute">
                    Subiendo…
                  </span>
                )}
                {it.status === "error" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-clay/10 p-1 text-center text-[0.58rem] text-clay-deep">
                    {it.error ?? "Error"}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={it.caption ?? ""}
                  onChange={(e) => update(it, { caption: e.target.value })}
                  placeholder="Pie de foto (opcional)"
                  className="w-full border border-line bg-paper px-2.5 py-1.5 text-[0.82rem] font-light focus:border-clay focus:outline-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <select
                    value={it.ratio ?? "wide"}
                    onChange={(e) => update(it, { ratio: e.target.value as GalleryItem["ratio"] })}
                    className="border border-line bg-paper px-2 py-1 text-[0.72rem] uppercase tracking-[0.1em] focus:border-clay focus:outline-none"
                  >
                    <option value="wide">Ancha</option>
                    <option value="tall">Vertical</option>
                    <option value="sq">Cuadrada</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="text-[0.7rem] uppercase tracking-[0.1em] text-mute disabled:opacity-30"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === items.length - 1}
                      className="text-[0.7rem] uppercase tracking-[0.1em] text-mute disabled:opacity-30"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(it)}
                      className="text-[0.7rem] uppercase tracking-[0.1em] text-clay-deep"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
