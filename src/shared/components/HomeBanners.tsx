"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HomeBanner } from "@/src/shared/services/storeConfig";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
const AUTO_SLIDE_MS = 5000;

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
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleBanners = useMemo(
    () => banners
      .filter((banner) => banner.active !== false && banner.desktop_image?.url)
      .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0)),
    [banners]
  );

  const scrollToIndex = useCallback((index: number) => {
    const slider = sliderRef.current;
    if (!slider || !visibleBanners.length) return;
    const cards = Array.from(slider.querySelectorAll<HTMLElement>("[data-home-banner-card]"));
    const normalizedIndex = (index + visibleBanners.length) % visibleBanners.length;
    const card = cards[normalizedIndex];
    if (!card) return;

    slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: "smooth" });
    setActiveIndex(normalizedIndex);
  }, [visibleBanners.length]);

  const goToPrevious = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  const goToNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || visibleBanners.length <= 1) return;

    const updateActiveFromScroll = () => {
      const cards = Array.from(slider.querySelectorAll<HTMLElement>("[data-home-banner-card]"));
      if (!cards.length) return;
      const nearest = cards.reduce((best, card, index) => {
        const distance = Math.abs(card.offsetLeft - slider.offsetLeft - slider.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      setActiveIndex(nearest.index);
    };

    slider.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    return () => slider.removeEventListener("scroll", updateActiveFromScroll);
  }, [visibleBanners.length]);

  useEffect(() => {
    if (visibleBanners.length <= 1) return;
    const interval = window.setInterval(() => {
      if (!pausedRef.current) goToNext();
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(interval);
  }, [goToNext, visibleBanners.length]);

  if (!visibleBanners.length) return null;

  return (
    <section
      className="bg-[#FFF7F9] py-6 sm:py-7"
      aria-label="Promociones destacadas"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onFocus={() => { pausedRef.current = true; }}
      onBlur={() => { pausedRef.current = false; }}
    >
      <div className="section-container relative">
        {visibleBanners.length > 1 ? (
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Ver banner anterior"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.18)] ring-1 ring-[#E7BFC9] transition hover:-translate-y-1/2 hover:scale-105 hover:bg-white md:left-1 md:h-12 md:w-12"
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
                <img src={desktopUrl ?? ""} alt={banner.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
              </picture>
            );

            return (
              <article
                id={`home-banner-${banner.id ?? banner.home_position}`}
                data-home-banner-card
                key={`${banner.id ?? banner.name}-${banner.home_position}`}
                className={`${scopeClass(banner.display_scope)} group relative min-w-full snap-center overflow-hidden rounded-[14px] bg-white shadow-[0_12px_28px_rgba(45,31,35,0.16)] ring-1 ring-[#F1CCD5]/80 sm:min-w-[46%] lg:min-w-[31.6%] xl:min-w-[24%]`}
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
            onClick={goToNext}
            aria-label="Ver siguiente banner"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.18)] ring-1 ring-[#E7BFC9] transition hover:-translate-y-1/2 hover:scale-105 hover:bg-white md:right-1 md:h-12 md:w-12"
          >
            <ChevronRight className="h-7 w-7 md:h-[38px] md:w-[38px]" strokeWidth={2.2} />
          </button>
        ) : null}

        {visibleBanners.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2" aria-label="Indicadores del carrusel de banners">
            {visibleBanners.map((banner, index) => (
              <button
                key={`home-banner-dot-${banner.id ?? index}`}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Ver banner ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-8 bg-[#9E3659]" : "w-2.5 bg-[#E7BFC9] hover:bg-[#D4738F]"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
