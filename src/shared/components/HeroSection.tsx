import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative flex min-h-[calc(100svh-68px)] items-center overflow-hidden bg-[#C15074] px-0 py-16 sm:py-20 md:min-h-[calc(100svh-112px)] md:py-28"
    >
      <div className="section-container relative z-10 flex flex-col items-start text-left">
        <div className="max-w-[640px]">
          <h1 className="responsive-heading font-normal font-serif text-white tracking-wide uppercase">
            Revela tu Belleza
            <br />
            Natural
          </h1>
          <p className="mt-5 max-w-[34rem] text-sm leading-relaxed text-white/90 sm:text-base md:mt-6">
            Descubrí nuestras fórmulas desarrolladas con activos naturales y de alta calidad.
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row sm:gap-4">
            <Link
              href="/catalog"
              className="flex min-h-12 flex-1 items-center justify-center rounded-[4px] bg-[#FCEDF0] px-8 py-3 text-center text-xs font-bold text-[#C15074] sm:px-10 sm:py-4"
            >
              <span>
                COMPRAR
                <br />
                AHORA
              </span>
            </Link>

            <Link
              href="/catalog"
              className="flex min-h-12 flex-1 items-center justify-center rounded-[4px] border border-white bg-transparent px-8 py-3 text-center text-xs font-bold text-white sm:px-10 sm:py-4"
            >
              DESCUBRIR
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

