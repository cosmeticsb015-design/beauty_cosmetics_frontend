import { BadgeCheck, Globe, Heart } from "lucide-react";

const values = [
  {
    id: "value-originales",
    title: "Productos Originales",
    description: "Garantizamos la autenticidad del 100% de nuestro catálogo.",
    icon: <BadgeCheck size={22} strokeWidth={1.8} />,
  },
  {
    id: "value-internacionales",
    title: "Marcas Internacionales",
    description: "Traemos lo mejor del mercado global directamente a tus manos.",
    icon: <Globe size={22} strokeWidth={1.8} />,
  },
  {
    id: "value-atencion",
    title: "Atención Personalizada",
    description: "Asesoramiento experto para encontrar los productos ideales para ti.",
    icon: <Heart size={22} strokeWidth={1.8} />,
  },
];

export default function EssenceSection() {
  return (
    <section id="essence-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-normal font-serif text-[#C15074] leading-tight">
            Nuestra Esencia
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#554246] max-w-lg mx-auto leading-relaxed">
            Fundada en 2019 en El Salvador, Beauty Cosmetics nació con la visión de acercar el mundo
            del maquillaje editorial y el cuidado de la piel premium a ti.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {values.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="flex flex-col items-center text-center p-10 rounded-[12px] bg-[#F3F3F3]"
            >
              {/* Icon box */}
              <div className="w-12 h-12 rounded-[10px] bg-[#FCEDF0] flex items-center justify-center text-[#C15074] mb-8">
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-[#2D1F23] mb-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-[#8A7A7E] leading-relaxed max-w-[220px]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
