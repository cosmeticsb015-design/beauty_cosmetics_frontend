"use client";
// RUTA: src/shared/components/HeroSection.tsx

import Link from "next/link";
import { useState } from "react";
import type { HomeBanner } from "@/src/shared/services/storeConfig";
import HeroBackgroundSlider from "@/src/shared/components/HeroBackgroundSlider";

export default function HeroSection({ banners = [] }: { banners?: HomeBanner[] }) {
  const [activeDestinationUrl, setActiveDestinationUrl] = useState<string | null>(
    () =>
      [...banners]
        .filter((banner) => banner.active !== false && (banner.desktop_image?.url || banner.mobile_image?.url))
        .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0))[0]?.destination_url || null
  );
  const buttonHref = activeDestinationUrl || "/catalog";

  return (
    <section
      id="hero-section"
      className="relative flex min-h-[calc(100svh-68px)] items-center overflow-hidden bg-[#C15074] px-0 py-16 sm:py-20 md:min-h-[calc(100svh-112px)] md:py-28"
    >
      {/* Fondo rotativo: si no hay banners configurados, este componente no
          renderiza nada y queda visible el bg-[#C15074] sólido de arriba. */}
      <HeroBackgroundSlider banners={banners} onActiveDestinationChange={setActiveDestinationUrl} />

      <div className="section-container relative z-10 flex flex-col items-start text-left">
        <div className="max-w-[640px]">
          <h1 className="responsive-heading font-normal font-serif text-white tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            Beauty Cosmetics 
            <br />
          
          </h1>
          <p className="mt-5 max-w-[34rem] text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] sm:text-base md:mt-6">
            Comprá maquillaje original, skincare, cosmética y cuidado personal
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row sm:gap-4">
            <Link
              href={buttonHref}
              className="flex min-h-12 flex-1 items-center justify-center rounded-[4px] bg-[#FCEDF0] px-8 py-3 text-center text-xs font-bold text-[#C15074] sm:px-10 sm:py-4"
            >
              <span>
                COMPRAR
                <br />
                AHORA
              </span>
            </Link>

            <Link
              href={buttonHref}
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
