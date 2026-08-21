export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { h: string; p: string[] }[];
}) {
  return (
    <div className="shell py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Información</p>
        <h1 className="display mt-4 text-[2.5rem] md:text-[3.4rem]">{title}</h1>
        <p className="mt-4 text-[0.8rem] font-light text-mute">
          Última actualización: {updated}
        </p>
        <div className="mt-14 space-y-12">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-[1.6rem] font-light">{s.h}</h2>
              <div className="mt-4 space-y-4">
                {s.p.map((para, i) => (
                  <p
                    key={i}
                    className="text-[0.95rem] font-light leading-[1.85] text-mute"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
