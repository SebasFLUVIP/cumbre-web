import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/store";
import ProjectForm from "@/components/admin/ProjectForm";
import { deleteProject, upsertProject } from "../../actions";

export default async function EditarProyecto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/proyectos"
          className="text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
        >
          ← Proyectos
        </Link>
        <Link
          href={`/proyectos/${project.slug}`}
          target="_blank"
          className="text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
        >
          Ver en el sitio ↗
        </Link>
      </div>
      <h1 className="display mt-4 text-[2.4rem]">{project.title}</h1>
      <ProjectForm project={project} action={upsertProject} onDelete={deleteProject} />
    </div>
  );
}
