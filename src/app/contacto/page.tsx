import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos por WhatsApp o correo. Atendemos Bogotá, Anapoima, Villeta y envíos a toda Colombia.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage() {
  const s = await getSettings();

  return (
    <div className="shell py-16 md:py-24">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Contacto</p>
          <h1 className="display mt-4 text-[2.6rem] md:text-[3.6rem]">
            Hablemos de tu casa
          </h1>
          <p className="mt-6 text-[0.98rem] font-light leading-relaxed text-mute">
            Escribinos por donde te quede más cómodo. Respondemos en menos de 24
            horas hábiles.
          </p>

          <dl className="mt-12 space-y-8 border-t border-line pt-10">
            <div>
              <dt className="eyebrow">WhatsApp</dt>
              <dd className="mt-2">
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl font-light link-underline"
                >
                  Escribinos ahora
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Correo</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${s.email}`}
                  className="font-display text-2xl font-light link-underline"
                >
                  {s.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Instagram</dt>
              <dd className="mt-2">
                <a
                  href={`https://instagram.com/${s.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl font-light link-underline"
                >
                  @{s.instagram}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Dónde trabajamos</dt>
              <dd className="mt-2 text-[0.93rem] font-light leading-relaxed text-mute">
                Bogotá y la sabana · Anapoima · Villeta
                <br />
                Envíos de tienda a toda Colombia.
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-line bg-paper p-7 md:p-10">
            <h2 className="font-display text-2xl font-light">
              Contanos qué necesitás
            </h2>
            <div className="mt-7">
              <LeadForm source="contacto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
