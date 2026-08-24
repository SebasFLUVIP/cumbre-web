import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import ProjectForm from "@/components/admin/ProjectForm";
import { upsertProject } from "../../actions";

export default async function NuevoProyecto() {
  await requireAdmin();

  return (
    <div className="shell py-12">
      <Link
        href="/admin/proyectos"
        className="text-[0.68rem] uppercase tracking-[0.16em] text-mute link-underline"
      >
        ← Proyectos
      </Link>
      <h1 className="display mt-4 text-[2.4rem]">Nuevo proyecto</h1>
      <ProjectForm action={upsertProject} />
    </div>
  );
}
