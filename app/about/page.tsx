import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, ShieldCheck, Sparkles, Store } from "lucide-react";

const stats = ["+6 años", "2 sucursales", "Miles de clientes satisfechos"];

const pillars = [
  {
    title: "Productos originales",
    description: "Seleccionamos maquillaje y skincare auténticos de marcas reconocidas para que compres con confianza.",
    icon: ShieldCheck,
  },
  {
    title: "Asesoría cercana",
    description: "Te acompañamos con recomendaciones personalizadas según tus gustos, necesidades y objetivos de belleza.",
    icon: HeartHandshake,
  },
  {
    title: "Experiencia confiable",
    description: "Cuidamos cada detalle del proceso para ofrecerte atención, calidad y resultados reales.",
    icon: BadgeCheck,
  },
];

export const metadata = {
  title: "About | Beauty Cosmetics",
  description: "Conoce a Beauty Cosmetics: más de 6 años, 2 sucursales y miles de clientes satisfechos.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#FCEDF0] px-4 py-16 md:px-8 md:py-24">
        <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#F5C6D0]/70 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FBD5E0]/80 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8A0B5]/50 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074] shadow-sm">
              <Sparkles size={15} strokeWidth={1.8} />
              Sobre nosotros
            </div>
            <h1 className="max-w-3xl font-serif text-4xl font-normal uppercase leading-tight tracking-wide text-[#2D1F23] md:text-6xl">
              Beauty Cosmetics
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#554246] md:text-base">
              Beauty Cosmetics continúa creciendo para acercarte productos originales, marcas reconocidas y una
              experiencia de compra en la que puedes confiar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#C15074] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#9E3659]"
              >
                Ver catálogo
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <Link
                href="/faq#sucursales"
                className="inline-flex items-center justify-center rounded-[4px] border border-[#C15074]/30 bg-white/70 px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#C15074] transition-colors hover:bg-white"
              >
                Ver sucursales
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_14px_40px_rgba(193,80,116,0.10)] backdrop-blur md:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBD5E0] text-[#9E3659]">
              <Store size={25} strokeWidth={1.8} />
            </div>
            <div className="mt-8 grid gap-3">
              {stats.map((stat) => (
                <div key={stat} className="rounded-2xl bg-[#FDF5F7] px-5 py-4 text-center">
                  <p className="text-lg font-bold uppercase tracking-widest text-[#C15074]">{stat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">Nuestra promesa</p>
          <h2 className="mt-3 font-serif text-3xl font-normal uppercase tracking-wide text-[#2D1F23] md:text-4xl">
            Calidad, confianza y belleza auténtica
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="rounded-2xl border border-[#F0E4E8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCEDF0] text-[#C15074]">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-[#2D1F23]">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#8A7A7E]">{pillar.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
