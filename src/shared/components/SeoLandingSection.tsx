const seoTopics = [
  "+ 6 años de trayectoria",
  "Maquillaje original en tendencia",
  "+2 sucursales fisicas",
  "Desde K-Beauty hasta marcas icónicas.",
  "Cobertura en todo El Salvador",
  "Compromiso con nuestros clientes",
];

const englishSignals = [
  "original makeup in El Salvador",
  "skin care and cosmetics online store",
  "beauty products with nationwide shipping",
];

export default function SeoLandingSection() {
  return (
    <section className="bg-white px-4 py-14 md:px-8 md:py-20" aria-labelledby="seo-beauty-cosmetics-title">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">
            Belleza, cosmética y cuidado personal
          </p>
          <h2 id="seo-beauty-cosmetics-title" className="mt-3 font-serif text-3xl font-normal uppercase tracking-wide text-[#2D1F23] md:text-4xl">
            Conoce Beauty Cosmetics.
            <br />
            Donde las marcas más reconocidas del mundo encuentran un lugar en tu rutina.
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-7 text-[#554246] md:text-base">
          <p>
            Beauty Cosmetics se ha consolidado como una marca de referencia en maquillaje y skincare en El Salvador. Desde 2019, acercamos las marcas más reconocidas del mundo a miles de clientes, combinando una cuidada selección de productos, presencia física y cobertura nacional para ofrecer una experiencia de compra que inspire confianza y te invite a volver.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {seoTopics.map((topic) => (
              <div key={topic} className="rounded-2xl border border-[#F0E4E8] bg-[#FDF5F7] px-4 py-3 text-sm font-semibold text-[#2D1F23]">
                {topic}
              </div>
            ))}
          </div>
          <p className="text-xs leading-6 text-[#8A7A7E]">
            English search context: {englishSignals.join(" · ")}.
          </p>
        </div>
      </div>
    </section>
  );
}
