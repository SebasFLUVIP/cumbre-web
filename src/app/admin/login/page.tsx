import { redirect } from "next/navigation";
import { adminConfigured, checkPassword, createSession, isAdmin } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const configured = adminConfigured();

  async function login(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");
    if (!checkPassword(password)) redirect("/admin/login?error=1");
    await createSession();
    redirect("/admin");
  }

  return (
    <div className="shell flex min-h-[70svh] items-center justify-center py-20">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center">Panel Cumbre</p>
        <h1 className="display mt-4 text-center text-[2.2rem]">Entrar</h1>

        {!configured ? (
          <p className="mt-8 border border-clay/40 bg-clay/5 px-5 py-4 text-[0.85rem] font-light leading-relaxed text-clay-deep">
            Falta definir <code className="font-mono text-[0.8rem]">ADMIN_PASSWORD</code>{" "}
            en <code className="font-mono text-[0.8rem]">.env.local</code>. Sin
            esa variable el panel queda cerrado.
          </p>
        ) : (
          <form action={login} className="mt-10">
            <label className="eyebrow block" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full border-b border-line bg-transparent py-3 text-[0.95rem] font-light focus:border-clay focus:outline-none"
            />
            {error && (
              <p role="alert" className="mt-3 text-[0.82rem] text-clay-deep">
                Contraseña incorrecta.
              </p>
            )}
            <button
              type="submit"
              className="mt-8 w-full bg-ink py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-espresso"
            >
              Entrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
