"use client";

import ImageUploader from "./ImageUploader";
import GalleryUploader from "./GalleryUploader";
import SubmitButton from "./SubmitButton";
import type { Project } from "@/lib/types";

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

export default function ProjectForm({
  project,
  action,
  onDelete,
}: {
  project?: Project;
  action: (fd: FormData) => void | Promise<void>;
  onDelete?: (fd: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="mt-10 grid gap-12 lg:grid-cols-12">
      <input type="hidden" name="originalSlug" value={project?.slug ?? ""} />

      <div className="lg:col-span-8">
        <section>
          <h2 className="font-display text-2xl font-light">Ficha del proyecto</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Título" wide>
              <input name="title" required defaultValue={project?.title} className={input} />
            </Field>
            <Field label="URL (slug)" hint="Se genera del título si lo dejás vacío.">
              <input name="slug" defaultValue={project?.slug} className={input} />
            </Field>
            <Field label="Categoría" hint='Ej.: "Proyecto integral", "Asesoría y styling".'>
              <input name="category" defaultValue={project?.category} className={input} />
            </Field>
            <Field label="Ubicación">
              <input name="location" defaultValue={project?.location} className={input} />
            </Field>
            <Field label="Año">
              <input name="year" defaultValue={project?.year} className={input} />
            </Field>
            <Field label="Resumen" wide hint="Se ve en la portada del proyecto y en la grilla de /proyectos.">
              <textarea
                name="summary"
                rows={3}
                defaultValue={project?.summary}
                className={`${input} resize-y`}
              />
            </Field>
            <Field label="Qué hicimos" wide hint="Una línea por punto.">
              <textarea
                name="scope"
                rows={5}
                defaultValue={project?.scope?.join("\n")}
                className={`${input} resize-y`}
              />
            </Field>
            <Field label="Texto del proyecto" wide hint="Un párrafo por línea.">
              <textarea
                name="body"
                rows={8}
                defaultValue={project?.body?.join("\n")}
                className={`${input} resize-y`}
              />
            </Field>
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl font-light">Foto de portada</h2>
          <p className="mt-2 text-[0.85rem] font-light text-mute">
            Se ve en la grilla de /proyectos, en el home si el proyecto está
            destacado, y como fondo del encabezado de la ficha.
          </p>
          <div className="mt-6">
            <ImageUploader
              name="cover"
              max={1}
              folder="proyectos"
              initialImages={project?.cover ? [project.cover] : []}
              hint={null}
            />
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl font-light">Galería</h2>
          <p className="mt-2 text-[0.85rem] font-light text-mute">
            Las fotos que se ven debajo del texto, en la ficha del proyecto.
          </p>
          <div className="mt-6">
            <GalleryUploader initial={project?.gallery ?? []} />
          </div>
        </section>
      </div>

      <aside className="lg:col-span-4">
        <div className="space-y-5 border border-line bg-bone p-6 lg:sticky lg:top-8">
          <label className="flex items-center gap-3 text-[0.87rem] font-light">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? false}
              className="h-[15px] w-[15px] accent-[#2c261e]"
            />
            Destacado (portada de /proyectos y del home)
          </label>

          <SubmitButton
            pendingLabel="Guardando…"
            className="w-full bg-ink py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone hover:bg-espresso disabled:cursor-not-allowed disabled:opacity-60"
          >
            Guardar
          </SubmitButton>
        </div>

        {onDelete && project && (
          <div className="mt-5 border border-line p-6">
            <p className="text-[0.8rem] font-light text-mute">
              Eliminar es permanente.
            </p>
            <SubmitButton
              formAction={onDelete}
              formNoValidate
              pendingLabel="Eliminando…"
              className="mt-4 w-full border border-clay/50 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-clay-deep hover:bg-clay/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Eliminar proyecto
            </SubmitButton>
          </div>
        )}
      </aside>
    </form>
  );
}
