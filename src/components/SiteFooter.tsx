import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getSettings } from "@/lib/store";
import Wordmark from "./Wordmark";
import NewsletterForm from "./NewsletterForm";

export default async function SiteFooter() {
  const s = await getSettings();
  const wa = `https://wa.me/${s.whatsapp}`;

  return (
    <footer className="mt-28 bg-espresso text-bone/80">
      <div className="shell grid gap-14 py-20 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <Wordmark size="md" className="text-bone" />
          <p className="mt-8 max-w-xs text-[0.9rem] font-light leading-relaxed">
            Creemos que tu casa tiene que contar tu historia. Contá con nosotras
            para lograrlo.
          </p>
          <p className="mt-6 text-[0.8rem] font-light leading-relaxed text-bone/60">
            Bogotá · Anapoima · Villeta
            <br />
            Colombia
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="eyebrow text-bone/50">Tienda</h3>
          <ul className="mt-5 space-y-2.5 text-[0.88rem] font-light">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/tienda/${c.id}`} className="link-underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="eyebrow text-bone/50">Estudio</h3>
          <ul className="mt-5 space-y-2.5 text-[0.88rem] font-light">
            <li>
              <Link href="/proyectos" className="link-underline">
                Proyectos
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="link-underline">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/servicios#a-medida" className="link-underline">
                Muebles a medida
              </Link>
            </li>
            <li>
              <Link href="/nosotras" className="link-underline">
                Nosotras
              </Link>
            </li>
            <li>
              <Link href="/cufania" className="link-underline">
                Cumbre &amp; Cufania
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="link-underline">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="eyebrow text-bone/50">Escribinos</h3>
          <ul className="mt-5 space-y-2.5 text-[0.88rem] font-light">
            <li>
              <a href={wa} className="link-underline" rel="noopener noreferrer" target="_blank">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="link-underline">
                {s.email}
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${s.instagram}`}
                className="link-underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                @{s.instagram}
              </a>
            </li>
          </ul>

          <div className="mt-9">
            <h3 className="eyebrow text-bone/50">Lista de correo</h3>
            <p className="mt-3 text-[0.85rem] font-light leading-relaxed text-bone/70">
              Lanzamientos, piezas nuevas y una que otra idea para tu casa. Sin
              ruido.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-bone/15">
        <div className="shell flex flex-col gap-3 py-6 text-[0.7rem] font-light text-bone/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Cumbre Decoration &amp; Interior Design</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/envios-y-devoluciones" className="link-underline">
              Envíos y devoluciones
            </Link>
            <Link href="/terminos" className="link-underline">
              Términos
            </Link>
            <Link href="/privacidad" className="link-underline">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
