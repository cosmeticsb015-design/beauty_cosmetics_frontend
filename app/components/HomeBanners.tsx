"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type { HomeBanner } from "../services/storeConfig";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");

function mediaUrl(url?: string | null) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function scopeClass(scope: HomeBanner["display_scope"]) {
  if (scope === "desktop_only") return "hidden md:block";
  if (scope === "mobile_only") return "block md:hidden";
  return "block";
}

export default function HomeBanners({ banners = [] }: { banners?: HomeBanner[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const visibleBanners = banners
    .filter((banner) => banner.active !== false && banner.desktop_image?.url)
    .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0));

  const scrollSlider = (direction: "prev" | "next") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector<HTMLElement>("[data-home-banner-card]");
    const amount = card ? card.offsetWidth + 12 : slider.clientWidth;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    const nextLeft = direction === "next" ? slider.scrollLeft + amount : slider.scrollLeft - amount;

    if (direction === "next" && nextLeft >= maxScrollLeft - 8) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === "prev" && nextLeft <= 0) {
      slider.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      return;
    }

    slider.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (visibleBanners.length <= 1) return;
    const interval = window.setInterval(() => scrollSlider("next"), 4500);
    return () => window.clearInterval(interval);
  }, [visibleBanners.length]);

  if (!visibleBanners.length) return null;

  return (
    <section className="bg-[#FFF7F9] py-6 sm:py-7" aria-label="Promociones destacadas">
      <div className="section-container relative">
        {visibleBanners.length > 1 ? (
          <button
            type="button"
            onClick={() => scrollSlider("prev")}
            aria-label="Ver banners anteriores"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#9E3659] shadow-lg ring-1 ring-[#E7BFC9] transition hover:bg-white md:left-1 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-7 w-7 md:h-[38px] md:w-[38px]" strokeWidth={2.2} />
          </button>
        ) : null}

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-10"
        >
          {visibleBanners.map((banner) => {
            const desktopUrl = mediaUrl(banner.desktop_image?.url);
            const mobileUrl = mediaUrl(banner.mobile_image?.url) ?? desktopUrl;
            const content = (
              <picture>
                {mobileUrl ? <source media="(max-width: 767px)" srcSet={mobileUrl} /> : null}
                <img src={desktopUrl ?? ""} alt={banner.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </picture>
            );

            return (
              <article
                id={`home-banner-${banner.id ?? banner.home_position}`}
                data-home-banner-card
                key={`${banner.id ?? banner.name}-${banner.home_position}`}
                className={`${scopeClass(banner.display_scope)} group relative min-w-full snap-center overflow-hidden rounded-[10px] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:min-w-[46%] lg:min-w-[31.6%] xl:min-w-[24%]`}
              >
                <div className="aspect-[16/9] md:aspect-[120/63]">
                  {banner.destination_url ? <Link href={banner.destination_url} aria-label={banner.name}>{content}</Link> : content}
                </div>
              </article>
            );
          })}
        </div>

        {visibleBanners.length > 1 ? (
          <button
            type="button"
            onClick={() => scrollSlider("next")}
            aria-label="Ver más banners"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#9E3659] shadow-lg ring-1 ring-[#E7BFC9] transition hover:bg-white md:right-1 md:h-12 md:w-12"
          >
            <ChevronRight className="h-7 w-7 md:h-[38px] md:w-[38px]" strokeWidth={2.2} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
