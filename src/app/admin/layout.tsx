import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/inicio", label: "Home" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/ajustes", label: "Ajustes" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdmin();

  return (
    <div className="admin-ui min-h-[70svh] bg-paper">
      {authed && (
        <div className="border-b border-line bg-bone">
          <div className="shell flex flex-wrap items-center gap-x-7 gap-y-2 py-4">
            <span className="eyebrow">Panel Cumbre</span>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-[0.72rem] uppercase tracking-[0.16em] link-underline"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-5">
              <Link
                href="/"
                className="text-[0.7rem] uppercase tracking-[0.16em] text-mute link-underline"
              >
                Ver el sitio
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
