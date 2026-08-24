import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/store";
import ImageUploader from "@/components/admin/ImageUploader";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveHomeContentAction } from "../actions";

const input =
  "w-full border border-line bg-bone px-3 py-2.5 text-[0.9rem] font-light focus:border-clay focus:outline-none";
const lab = "eyebrow block mb-2";

export default async function AdminInicio({
  searchParams,
}: {
  searchParams: Promise<{ guardado?: string }>;
}) {
  await requireAdmin();
  const [s, sp] = await Promise.all([getSettings(), searchParams]);

  return (
    <div className="shell max-w-4xl py-12">
      <h1 className="display text-[2.4rem]">Home</h1>
      <p className="mt-2 text-[0.85rem] font-light text-mute">
        Lo más visible de la portada del sitio. Dejá un campo vacío para
        volver al texto o la foto de siempre.
      </p>

      {sp.guardado && (
        <p className="mt-6 border border-line bg-sand/60 px-5 py-3 text-[0.85rem] font-light">
          Cambios guardados.
        </p>
      )}

      <form action={saveHomeContentAction} className="mt-10 space-y-14">
        <section>
          <h2 className="font-display text-2xl font-light">Portada (hero)</h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className={lab}>Título</label>
              <textarea
                name="homeHeroTitle"
                rows={2}
                defaultValue={s.homeHeroTitle}
                placeholder={"Casas que no se notan.\nSe sienten."}
                className={`${input} resize-y`}
              />
              <p className="mt-1.5 text-[0.72rem] font-light text-mute">
                Una línea por renglón del titular.
              </p>
            </div>
            <div>
              <label className={lab}>Bajada</label>
              <textarea
                name="homeHeroSubtitle"
                rows={3}
                defaultValue={s.homeHeroSubtitle}
                placeholder="Cada proyecto es un recorrido hacia la calma…"
                className={`${input} resize-y`}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={lab}>Foto (celular)</label>
                <ImageUploader
                  name="homeHeroImageMobile"
                  max={1}
                  folder="home"
                  initialImages={s.homeHeroImageMobile ? [s.homeHeroImageMobile] : []}
                  hint={null}
                />
              </div>
              <div>
                <label className={lab}>Foto (pantallas grandes)</label>
                <ImageUploader
                  name="homeHeroImageDesktop"
                  max={1}
                  folder="home"
                  initialImages={s.homeHeroImageDesktop ? [s.homeHeroImageDesktop] : []}
                  hint={null}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="font-display text-2xl font-light">Manifiesto</h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className={lab}>Antetítulo</label>
              <input
                name="homeManifestoEyebrow"
                defaultValue={s.homeManifestoEyebrow}
                placeholder="Un homenaje a lo natural"
                className={input}
              />
            </div>
            <div>
              <label className={lab}>Frase principal</label>
              <textarea
                name="homeManifestoHeading"
                rows={2}
                defaultValue={s.homeManifestoHeading}
                className={`${input} resize-y`}
              />
            </div>
            <div>
              <label className={lab}>Párrafo</label>
              <textarea
                name="homeManifestoBody"
                rows={3}
                defaultValue={s.homeManifestoBody}
                className={`${input} resize-y`}
              />
            </div>
          </div>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="font-display text-2xl font-light">Franja editorial</h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className={lab}>Frase</label>
              <textarea
                name="homeEditorialQuote"
                rows={3}
                defaultValue={s.homeEditorialQuote}
                className={`${input} resize-y`}
              />
            </div>
            <div>
              <label className={lab}>Foto de fondo</label>
              <ImageUploader
                name="homeEditorialImage"
                max={1}
                folder="home"
                initialImages={s.homeEditorialImage ? [s.homeEditorialImage] : []}
                hint={null}
              />
            </div>
          </div>
        </section>

        <SubmitButton
          pendingLabel="Guardando…"
          className="bg-ink px-10 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone hover:bg-espresso disabled:cursor-not-allowed disabled:opacity-60"
        >
          Guardar
        </SubmitButton>
      </form>
    </div>
  );
}
