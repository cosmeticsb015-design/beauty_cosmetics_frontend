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
  const isAnimatingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  const visibleBanners = useMemo(
    () =>
      banners
        .filter((banner) => banner.active !== false && banner.desktop_image?.url)
        .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0)),
    [banners]
  );

  const n = visibleBanners.length;

  // Creamos 3 bloques exactos: [Clones Inicio] [Reales] [Clones Final]
  // Garantiza que en pantallas ultra anchas jamás se vean huecos al hacer el bucle
  const extendedBanners = useMemo(() => {
    if (n <= 1) return visibleBanners;
    return [...visibleBanners, ...visibleBanners, ...visibleBanners];
  }, [visibleBanners, n]);

  // Iniciamos en el bloque central (el real)
  const [activeIndex, setActiveIndex] = useState(n > 1 ? n : 0);
  const realActiveIndex = activeIndex % (n || 1);

  // Motor de animación manual para un deslizamiento fluido
  const smoothScrollTo = useCallback((slider: HTMLElement, targetLeft: number, duration = 750) => {
    return new Promise<void>((resolve) => {
      const startLeft = slider.scrollLeft;
      const distance = targetLeft - startLeft;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Curva EaseInOutCubic (acelera y frena con una fluidez elegante)
        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        slider.scrollLeft = startLeft + distance * ease;

        if (elapsed < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          slider.scrollLeft = targetLeft;
          resolve();
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }, []);

  const scrollToIndex = useCallback(
    async (index: number, animate = true) => {
      const slider = sliderRef.current;
      if (!slider || n <= 1) return;
      
      const cards = Array.from(slider.querySelectorAll<HTMLElement>("[data-home-banner-card]"));
      const card = cards[index];
      if (!card) return;

      const targetLeft = card.offsetLeft - slider.offsetLeft;

      if (!animate) {
        slider.scrollLeft = targetLeft;
        return;
      }

      // Evitamos que el scroll-snap de CSS "pelee" con nuestra animación matemática
      slider.style.scrollSnapType = "none";
      await smoothScrollTo(slider, targetLeft, 750);
      slider.style.scrollSnapType = ""; // Se restaura para seguir permitiendo deslizar con el dedo en móvil
    },
    [n, smoothScrollTo]
  );

  // Posicionamiento inicial invisible
  useEffect(() => {
    if (n > 1) {
      scrollToIndex(n, false);
    }
  }, [n, scrollToIndex]);

  const goToNext = useCallback(async () => {
    if (isAnimatingRef.current || n <= 1) return;
    isAnimatingRef.current = true;
    
    let nextIndex = activeIndex + 1;
    await scrollToIndex(nextIndex, true);
    
    // Magia del bucle: Si entramos al bloque de clones finales, saltamos al bloque real equivalente sin parpadear
    if (nextIndex >= n * 2) {
      nextIndex = n; 
      await scrollToIndex(nextIndex, false);
    }
    
    setActiveIndex(nextIndex);
    isAnimatingRef.current = false;
  }, [activeIndex, n, scrollToIndex]);

  const goToPrevious = useCallback(async () => {
    if (isAnimatingRef.current || n <= 1) return;
    isAnimatingRef.current = true;
    
    let prevIndex = activeIndex - 1;
    await scrollToIndex(prevIndex, true);
    
    // Si entramos al bloque de clones iniciales, saltamos invisiblemente al final del bloque real
    if (prevIndex < n) {
      prevIndex = (n * 2) - 1; 
      await scrollToIndex(prevIndex, false);
    }
    
    setActiveIndex(prevIndex);
    isAnimatingRef.current = false;
  }, [activeIndex, n, scrollToIndex]);

  const goToDot = useCallback(async (dotIndex: number) => {
    if (isAnimatingRef.current || n <= 1) return;
    isAnimatingRef.current = true;
    
    const targetIndex = dotIndex + n; // Se dirige siempre al bloque central real
    await scrollToIndex(targetIndex, true);
    setActiveIndex(targetIndex);
    
    isAnimatingRef.current = false;
  }, [n, scrollToIndex]);

  // Manejo de scroll manual (cuando el usuario arrastra en el móvil)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || n <= 1) return;

    const updateActiveFromScroll = () => {
      if (isAnimatingRef.current) return;

      const cards = Array.from(slider.querySelectorAll<HTMLElement>("[data-home-banner-card]"));
      if (!cards.length) return;
      
      const nearest = cards.reduce(
        (best, card, index) => {
          const distance = Math.abs(card.offsetLeft - slider.offsetLeft - slider.scrollLeft);
          return distance < best.distance ? { index, distance } : best;
        },
        { index: n, distance: Number.POSITIVE_INFINITY }
      );

      let nearestIndex = nearest.index;

      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
         if (nearestIndex >= n * 2) {
            nearestIndex = nearestIndex - n;
            scrollToIndex(nearestIndex, false);
         } else if (nearestIndex < n) {
            nearestIndex = nearestIndex + n;
            scrollToIndex(nearestIndex, false);
         }
         setActiveIndex(nearestIndex);
      }, 150); // Se ajusta justo después de que el usuario termina de deslizar
      
      if (nearestIndex >= n && nearestIndex < n * 2) {
         setActiveIndex(nearestIndex);
      }
    };

    slider.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    return () => {
      slider.removeEventListener("scroll", updateActiveFromScroll);
      window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [n, scrollToIndex]);

  useEffect(() => {
    if (n <= 1) return;
    const interval = window.setInterval(() => {
      if (!pausedRef.current) goToNext();
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(interval);
  }, [goToNext, n]);

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
        {n > 1 ? (
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Ver banner anterior"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.18)] ring-1 ring-[#E7BFC9] transition hover:-translate-y-1/2 hover:scale-105 hover:bg-white md:left-1 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-7 w-7 md:h-[38px] md:w-[38px]" strokeWidth={2.2} />
          </button>
        ) : null}

        {/* NOTA: Eliminamos la clase 'scroll-smooth' de aquí intencionalmente para evitar fricción con nuestro motor */}
        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-10"
        >
          {extendedBanners.map((banner, index) => {
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
                id={`home-banner-${banner.id ?? banner.home_position}-${index}`}
                data-home-banner-card
                key={`home-banner-card-${banner.id ?? banner.name}-${index}`}
                className={`${scopeClass(banner.display_scope)} group relative min-w-full snap-center overflow-hidden rounded-[14px] bg-white shadow-[0_12px_28px_rgba(45,31,35,0.16)] ring-1 ring-[#F1CCD5]/80 sm:min-w-[46%] lg:min-w-[31.6%] xl:min-w-[24%]`}
              >
                <div className="aspect-[16/9] md:aspect-[120/63]">
                  {banner.destination_url ? <Link href={banner.destination_url} aria-label={banner.name}>{content}</Link> : content}
                </div>
              </article>
            );
          })}
        </div>

        {n > 1 ? (
          <button
            type="button"
            onClick={goToNext}
            aria-label="Ver siguiente banner"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.18)] ring-1 ring-[#E7BFC9] transition hover:-translate-y-1/2 hover:scale-105 hover:bg-white md:right-1 md:h-12 md:w-12"
          >
            <ChevronRight className="h-7 w-7 md:h-[38px] md:w-[38px]" strokeWidth={2.2} />
          </button>
        ) : null}

        {n > 1 ? (
          <div className="mt-4 flex justify-center gap-2" aria-label="Indicadores del carrusel de banners">
            {visibleBanners.map((banner, index) => (
              <button
                key={`home-banner-dot-${banner.id ?? index}`}
                type="button"
                onClick={() => goToDot(index)}
                aria-label={`Ver banner ${index + 1}`}
                aria-current={realActiveIndex === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all ${realActiveIndex === index ? "w-8 bg-[#9E3659]" : "w-2.5 bg-[#E7BFC9] hover:bg-[#D4738F]"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}