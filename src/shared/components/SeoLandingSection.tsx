const seoTopics = [
  "maquillaje original en El Salvador",
  "skincare y cuidado de la piel",
  "cosmética y cuidado personal",
  "entregas en San Salvador y San Miguel",
  "envíos a todo El Salvador",
  "sucursales en San Miguel y Usulután Plaza Mundo",
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
            Beauty Cosmetics SV: tu tienda online de maquillaje original en El Salvador
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-7 text-[#554246] md:text-base">
          <p>
            En Beauty Cosmetics encontrás maquillaje original, skincare, accesorios, cosméticos y productos de cuidado personal seleccionados para rutinas de belleza reales. Nuestro catálogo online está pensado para comprar fácil desde cualquier lugar de El Salvador, con atención cercana, asesoría personalizada y opciones de entrega en San Salvador, San Miguel y envíos a todo el país.
          </p>
          <p>
            También atendemos desde nuestras sucursales en San Miguel y Usulután Plaza Mundo, conectando la experiencia de tienda física con un ecommerce de belleza confiable para quienes buscan productos auténticos, tendencias de maquillaje, cuidado de la piel, regalos y novedades de marcas reconocidas.
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
