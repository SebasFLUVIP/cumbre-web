import { requireAdmin } from "@/lib/auth";
import { getSettings, storageBackend } from "@/lib/store";
import { wompiConfig } from "@/lib/wompi";
import { saveSettingsAction } from "../actions";

const input =
  "w-full border border-line bg-bone px-3 py-2.5 text-[0.9rem] font-light focus:border-clay focus:outline-none";
const lab = "eyebrow block mb-2";

function Field({
  label,
  name,
  defaultValue,
  hint,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  hint?: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className={lab} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className={input}
      />
      {hint && <p className="mt-1.5 text-[0.72rem] font-light text-mute">{hint}</p>}
    </div>
  );
}

export default async function AdminAjustes({
  searchParams,
}: {
  searchParams: Promise<{ guardado?: string }>;
}) {
  await requireAdmin();
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  const cfg = wompiConfig();
  const backend = storageBackend();

  return (
    <div className="shell max-w-4xl py-12">
      <h1 className="display text-[2.4rem]">Ajustes</h1>

      {sp.guardado && (
        <p className="mt-6 border border-line bg-sand/60 px-5 py-3 text-[0.85rem] font-light">
          Ajustes guardados.
        </p>
      )}

      <form action={saveSettingsAction} className="mt-10 space-y-12">
        <section>
          <h2 className="font-display text-2xl font-light">Precios</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <Field
              label="TRM (COP por USD)"
              name="usdToCop"
              type="number"
              defaultValue={s.usdToCop}
              hint="Se usa para calcular el precio de los productos importados."
            />
            <Field
              label="Margen por defecto"
              name="defaultMarkup"
              type="number"
              step="0.1"
              defaultValue={s.defaultMarkup}
              hint="Multiplicador sobre el costo. Cada producto puede tener el suyo."
            />
            <Field
              label="Días de entrega de importados"
              name="amazonDeliveryDays"
              type="number"
              defaultValue={s.amazonDeliveryDays}
              hint="Valor que se propone al crear un producto importado."
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light">Envíos</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <Field
              label="Envío gratis desde"
              name="freeShippingThresholdCOP"
              type="number"
              defaultValue={s.freeShippingThresholdCOP}
            />
            <Field
              label="Envío en Bogotá"
              name="shippingBogotaCOP"
              type="number"
              defaultValue={s.shippingBogotaCOP}
            />
            <Field
              label="Envío nacional"
              name="shippingNacionalCOP"
              type="number"
              defaultValue={s.shippingNacionalCOP}
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light">Contacto</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <Field
              label="WhatsApp"
              name="whatsapp"
              defaultValue={s.whatsapp}
              hint="Con indicativo, sin espacios ni +. Ej.: 573001234567."
            />
            <Field label="Correo" name="email" type="email" defaultValue={s.email} />
            <Field
              label="Instagram"
              name="instagram"
              defaultValue={s.instagram}
              hint="Sin la arroba."
            />
          </div>
        </section>

        <button
          type="submit"
          className="bg-ink px-10 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone hover:bg-espresso"
        >
          Guardar ajustes
        </button>
      </form>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-light">Dónde se guardan los datos</h2>
        <p className="mt-4 max-w-2xl text-[0.88rem] font-light leading-relaxed">
          {backend === "supabase" ? (
            <>
              Base de datos <strong>Supabase</strong>. Es lo que corresponde en
              producción: el catálogo, los pedidos y las consultas quedan
              guardados aunque se reinicie el servidor.
            </>
          ) : (
            <>
              Archivos JSON en la carpeta <code className="font-mono text-[0.8rem]">/data</code>.
              Sirve para trabajar en local, pero <strong>no funciona en Vercel</strong>,
              donde el disco es de solo lectura. Antes de desplegar hay que
              cargar las variables de Supabase.
            </>
          )}
        </p>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-light">Pasarela de pagos</h2>
        <dl className="mt-6 space-y-3 text-[0.87rem] font-light">
          <div className="flex gap-3">
            <dt className="w-44 text-mute">Estado</dt>
            <dd>
              {cfg.configured
                ? cfg.isTest
                  ? "Configurada en modo de pruebas (sandbox)"
                  : "Configurada en producción"
                : "Sin configurar"}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-44 text-mute">Llave pública</dt>
            <dd className="font-mono text-[0.78rem]">
              {cfg.publicKey ? `${cfg.publicKey.slice(0, 16)}…` : "—"}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-44 text-mute">URL del webhook</dt>
            <dd className="font-mono text-[0.78rem]">
              {cfg.siteUrl}/api/wompi/webhook
            </dd>
          </div>
        </dl>
        <p className="mt-5 max-w-2xl text-[0.93rem] font-light leading-relaxed text-mute">
          Las llaves de Wompi se cargan en el archivo{" "}
          <code className="font-mono text-[0.78rem]">.env.local</code> (o en las
          variables de entorno del hosting), no desde acá: son secretos y no
          deben quedar guardados en la base del sitio. La URL del webhook hay
          que registrarla en el panel de Wompi para que los pagos se marquen
          solos.
        </p>
      </section>
    </div>
  );
}
