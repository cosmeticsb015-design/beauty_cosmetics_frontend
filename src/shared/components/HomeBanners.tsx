"use client";
// RUTA: src/shared/components/HomeBanners.tsx

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { HomeBanner } from "@/src/shared/services/storeConfig";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
).replace(/\/$/, "");

/**
 * Velocidad del movimiento automático.
 * Puedes subirlo a 42 o 45 si deseas que avance más rápido.
 */
const AUTO_SCROLL_SPEED = 30;

/**
 * Tiempo de pausa después de usar flechas, swipe o arrastre.
 */
const RESUME_AFTER_INTERACTION_MS = 1800;

/**
 * Se repiten grupos para que el loop sea continuo incluso cuando
 * hay pocos banners disponibles.
 */
const LOOP_COPIES = 6;

function mediaUrl(url?: string | null) {
  if (!url) return null;

  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function scopeClass(scope: HomeBanner["display_scope"]) {
  if (scope === "desktop_only") return "hidden md:block";
  if (scope === "mobile_only") return "block md:hidden";

  return "block";
}

function getVisibleCards(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-home-banner-card]")
  ).filter((card) => card.offsetParent !== null);
}

export default function HomeBanners({
  banners = [],
}: {
  banners?: HomeBanner[];
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const visibleCardsRef = useRef(0);

  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeAtRef = useRef(0);

  const suppressClickRef = useRef(false);
  const suppressClickTimeoutRef = useRef<number | null>(null);

  const dragRef = useRef({
    active: false,
    axis: "undecided" as "undecided" | "horizontal" | "vertical",
    pointerId: 0,
    startX: 0,
    startY: 0,
    startOffset: 0,
  });

  const activeBanners = useMemo(
    () =>
      banners
        .filter(
          (banner) =>
            banner.active !== false &&
            (banner.desktop_image?.url || banner.mobile_image?.url)
        )
        .sort(
          (first, second) =>
            (first.home_position ?? 0) - (second.home_position ?? 0)
        ),
    [banners]
  );

  const normalizeOffset = useCallback((value: number) => {
    const loopWidth = loopWidthRef.current;

    if (!loopWidth) return 0;

    const normalized = value % loopWidth;

    return normalized < 0 ? normalized + loopWidth : normalized;
  }, []);

  const paintTrack = useCallback((offset = offsetRef.current) => {
    const track = trackRef.current;

    if (!track) return;

    track.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }, []);

  const pauseFor = useCallback((milliseconds = RESUME_AFTER_INTERACTION_MS) => {
    resumeAtRef.current = Math.max(
      resumeAtRef.current,
      Date.now() + milliseconds
    );
  }, []);

  /**
   * Calcula el ancho de una vuelta completa.
   * El grupo original contiene los banners; los siguientes grupos son copias.
   * Al llegar al final de ese grupo se reinicia matemáticamente sin salto.
   */
  const measureLoop = useCallback(() => {
    const firstGroup = firstGroupRef.current;

    if (!firstGroup) return;

    const visibleCards = getVisibleCards(firstGroup);

    visibleCardsRef.current = visibleCards.length;

    if (!visibleCards.length) {
      loopWidthRef.current = 0;
      return;
    }

    const width = firstGroup.getBoundingClientRect().width;

    loopWidthRef.current = width;

    if (width > 0) {
      offsetRef.current = normalizeOffset(offsetRef.current);
      paintTrack(offsetRef.current);
    }
  }, [normalizeOffset, paintTrack]);

  /**
   * Escucha cambios de tamaño de pantalla, orientación y cambios
   * de breakpoint para recalcular las medidas correctamente.
   */
  useEffect(() => {
    const viewport = viewportRef.current;
    const firstGroup = firstGroupRef.current;

    if (!viewport || !firstGroup) return;

    let animationFrame = 0;

    const scheduleMeasure = () => {
      window.cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        measureLoop();
      });
    };

    scheduleMeasure();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleMeasure)
        : null;

    resizeObserver?.observe(viewport);
    resizeObserver?.observe(firstGroup);

    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [measureLoop, activeBanners.length]);

  /**
   * Respeta la configuración de accesibilidad del sistema.
   * Si el usuario tiene "reducir movimiento", se detiene el autoplay.
   */
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setReducedMotion(query.matches);
    };

    updatePreference();
    query.addEventListener("change", updatePreference);

    return () => {
      query.removeEventListener("change", updatePreference);
    };
  }, []);

  /**
   * Movimiento automático fluido con requestAnimationFrame.
   * No usa intervalos ni scrollLeft, por eso no da saltos.
   */
  useEffect(() => {
    if (reducedMotion || activeBanners.length <= 1) return;

    let animationFrame = 0;
    let previousTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (previousTimestamp === null) {
        previousTimestamp = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - previousTimestamp) / 1000,
        0.06
      );

      previousTimestamp = timestamp;

      const canMove =
        !reducedMotion &&
        loopWidthRef.current > 0 &&
        visibleCardsRef.current > 1 &&
        !hoverRef.current &&
        !focusRef.current &&
        !draggingRef.current &&
        Date.now() >= resumeAtRef.current &&
        document.visibilityState === "visible";

      if (canMove) {
        offsetRef.current = normalizeOffset(
          offsetRef.current + AUTO_SCROLL_SPEED * deltaSeconds
        );

        paintTrack(offsetRef.current);
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [
    activeBanners.length,
    normalizeOffset,
    paintTrack,
    reducedMotion,
  ]);

  const getCardStep = useCallback(() => {
    const firstGroup = firstGroupRef.current;

    if (!firstGroup) return 0;

    const firstCard = getVisibleCards(firstGroup)[0];

    if (!firstCard) return 0;

    const styles = window.getComputedStyle(firstGroup);

    const gap = Number.parseFloat(
      styles.columnGap || styles.gap || "12"
    );

    return firstCard.getBoundingClientRect().width + gap;
  }, []);

  const moveByCard = useCallback(
    (direction: 1 | -1) => {
      if (!loopWidthRef.current) return;

      const step = getCardStep();

      if (!step) return;

      offsetRef.current = normalizeOffset(
        offsetRef.current + direction * step
      );

      paintTrack(offsetRef.current);
      pauseFor();
    },
    [getCardStep, normalizeOffset, paintTrack, pauseFor]
  );

  const finishPointerInteraction = useCallback(() => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;

    if (drag.active && viewport?.hasPointerCapture(drag.pointerId)) {
      viewport.releasePointerCapture(drag.pointerId);
    }

    dragRef.current.active = false;
    dragRef.current.axis = "undecided";
    draggingRef.current = false;

    pauseFor();
  }, [pauseFor]);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) return;

    dragRef.current = {
      active: true,
      axis: "undecided",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
    };

    draggingRef.current = true;
    pauseFor(3000);

    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const drag = dragRef.current;

    if (!drag.active || drag.pointerId !== event.pointerId) {
      return;
    }

    const distanceX = event.clientX - drag.startX;
    const distanceY = event.clientY - drag.startY;

    if (drag.axis === "undecided") {
      if (Math.abs(distanceX) < 6 && Math.abs(distanceY) < 6) {
        return;
      }

      drag.axis =
        Math.abs(distanceX) > Math.abs(distanceY)
          ? "horizontal"
          : "vertical";
    }

    if (drag.axis !== "horizontal") {
      return;
    }

    event.preventDefault();

    if (Math.abs(distanceX) > 8) {
      suppressClickRef.current = true;
    }

    offsetRef.current = normalizeOffset(
      drag.startOffset - distanceX
    );

    paintTrack(offsetRef.current);
  };

  const blockAccidentalClick = useCallback(() => {
    if (!suppressClickRef.current) return;

    if (suppressClickTimeoutRef.current) {
      window.clearTimeout(suppressClickTimeoutRef.current);
    }

    suppressClickTimeoutRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 80);
  }, []);

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveByCard(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveByCard(1);
    }
  };

  useEffect(() => {
    return () => {
      if (suppressClickTimeoutRef.current) {
        window.clearTimeout(suppressClickTimeoutRef.current);
      }
    };
  }, []);

  if (!activeBanners.length) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promociones destacadas"
      className="w-full py-3 sm:py-4 lg:py-5"
    >
      <div
        ref={shellRef}
        className="home-banners-shell mx-auto w-full max-w-[1440px] px-3 sm:px-5 lg:px-6"
        onMouseEnter={() => {
          hoverRef.current = true;
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
          pauseFor(500);
        }}
        onFocusCapture={() => {
          focusRef.current = true;
        }}
        onBlurCapture={() => {
          window.requestAnimationFrame(() => {
            focusRef.current = Boolean(
              shellRef.current?.contains(document.activeElement)
            );

            if (!focusRef.current) {
              pauseFor(500);
            }
          });
        }}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => moveByCard(-1)}
            aria-label="Ver promociones anteriores"
            className="absolute left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#087CF0] shadow-[0_5px_16px_rgba(15,23,42,0.20)] transition duration-200 hover:scale-110 hover:bg-white hover:text-[#005FC0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087CF0] focus-visible:ring-offset-2 sm:left-2 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.7} />
          </button>

          <div
            ref={viewportRef}
            role="group"
            tabIndex={0}
            aria-label="Carrusel de promociones. Usa las flechas del teclado para navegar."
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => {
              finishPointerInteraction();
              blockAccidentalClick();
            }}
            onPointerCancel={() => {
              finishPointerInteraction();
              blockAccidentalClick();
            }}
            onClickCapture={(event) => {
              if (suppressClickRef.current) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            className="home-banners-viewport touch-pan-y select-none overflow-hidden rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-[#087CF0] focus-visible:ring-offset-4 sm:rounded-[14px]"
          >
            <div
              ref={trackRef}
              className="flex w-max will-change-transform"
            >
              {Array.from({ length: LOOP_COPIES }).map(
                (_, groupIndex) => (
                  <div
                    key={`banner-group-${groupIndex}`}
                    ref={groupIndex === 0 ? firstGroupRef : undefined}
                    aria-hidden={groupIndex > 0 ? true : undefined}
                    className="home-banners-group flex w-max shrink-0 gap-3 pr-3"
                  >
                    {activeBanners.map((banner, bannerIndex) => {
                      const desktopUrl =
                        mediaUrl(banner.desktop_image?.url) ??
                        mediaUrl(banner.mobile_image?.url);

                      const mobileUrl =
                        mediaUrl(banner.mobile_image?.url) ??
                        desktopUrl;

                      const isDuplicate = groupIndex > 0;

                      if (!desktopUrl) return null;

                      const image = (
                        <picture className="block h-full w-full">
                          {mobileUrl ? (
                            <source
                              media="(max-width: 767px)"
                              srcSet={mobileUrl}
                            />
                          ) : null}

                          <img
                            src={desktopUrl}
                            alt={banner.name}
                            draggable={false}
                            loading={
                              groupIndex === 0 && bannerIndex < 4
                                ? "eager"
                                : "lazy"
                            }
                            fetchPriority={
                              groupIndex === 0 && bannerIndex === 0
                                ? "high"
                                : "auto"
                            }
                            sizes="(max-width: 639px) 86vw, (max-width: 899px) 48vw, (max-width: 1279px) 32vw, 25vw"
                            className="h-full w-full object-cover"
                          />
                        </picture>
                      );

                      return (
                        <article
                          key={`home-banner-${groupIndex}-${banner.id ?? bannerIndex}`}
                          data-home-banner-card
                          aria-hidden={isDuplicate ? true : undefined}
                          aria-roledescription={
                            isDuplicate ? undefined : "slide"
                          }
                          aria-label={
                            isDuplicate
                              ? undefined
                              : `${bannerIndex + 1} de ${activeBanners.length}: ${banner.name}`
                          }
                          className={`${scopeClass(
                            banner.display_scope
                          )} home-banner-card relative shrink-0 overflow-hidden rounded-[11px] border border-slate-200 bg-slate-100 shadow-[0_4px_13px_rgba(15,23,42,0.16)] transition-shadow duration-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.22)]`}
                        >
                          {banner.destination_url ? (
                            <Link
                              href={banner.destination_url}
                              aria-label={
                                isDuplicate
                                  ? undefined
                                  : `Abrir promoción: ${banner.name}`
                              }
                              aria-hidden={
                                isDuplicate ? true : undefined
                              }
                              tabIndex={isDuplicate ? -1 : undefined}
                              className="block h-full w-full"
                            >
                              {image}
                            </Link>
                          ) : (
                            image
                          )}
                        </article>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => moveByCard(1)}
            aria-label="Ver promociones siguientes"
            className="absolute right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#087CF0] shadow-[0_5px_16px_rgba(15,23,42,0.20)] transition duration-200 hover:scale-110 hover:bg-white hover:text-[#005FC0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087CF0] focus-visible:ring-offset-2 sm:right-2 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.7} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .home-banners-shell {
          container-name: home-banners;
          container-type: inline-size;
        }

        .home-banners-viewport {
          width: 100%;
        }

        /*
         * Teléfonos pequeños:
         * una tarjeta grande y una pequeña parte de la siguiente visible.
         */
        .home-banner-card {
          flex-basis: min(86cqi, 390px);
          aspect-ratio: 1.9 / 1;
        }

        /*
         * Teléfonos grandes y tablets verticales:
         * dos banners por fila.
         */
        @container home-banners (min-width: 560px) {
          .home-banner-card {
            flex-basis: calc((100cqi - 12px) / 2);
          }
        }

        /*
         * Tablets horizontales y laptops:
         * tres banners por fila.
         */
        @container home-banners (min-width: 900px) {
          .home-banner-card {
            flex-basis: calc((100cqi - 24px) / 3);
          }
        }

        /*
         * Escritorios grandes:
         * cuatro banners por fila, igual al ejemplo que compartiste.
         */
        @container home-banners (min-width: 1240px) {
          .home-banner-card {
            flex-basis: calc((100cqi - 36px) / 4);
          }
        }
      `}</style>
    </section>
  );
}