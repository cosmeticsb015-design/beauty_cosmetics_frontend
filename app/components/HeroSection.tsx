import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative  flex items-center h-screen py-20 md:py-32 px-20 bg-[#C15074]"
    >
      <div className="section-container relative z-10 flex flex-col items-start text-left">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-normal font-serif text-white leading-[1.15] tracking-wide uppercase">
            Revela tu Belleza
            <br />
            Natural
          </h1>
          <p className="mt-6 text-sm md:text-base text-white/90 leading-relaxed max-w-sm">
            Descubrí nuestras fórmulas desarrolladas con activos naturales y de alta calidad.
          </p>
          <div className="flex gap-4">
            <Link
              href="/catalog"
              className="flex-1 flex items-center justify-center bg-[#FCEDF0] text-[#C15074] px-10 py-4 rounded-[4px] text-center font-bold text-xs"
            >
              <span>
                COMPRAR
                <br />
                AHORA
              </span>
            </Link>

            <Link
              href="/catalog"
              className="flex-1 flex items-center justify-center bg-transparent text-white border border-white px-10 py-4 rounded-[4px] text-center font-bold text-xs"
            >
              DESCUBRIR
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

