import Link from "next/link";
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
  const visibleBanners = banners
    .filter((banner) => banner.active !== false && banner.desktop_image?.url)
    .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0));
  if (!visibleBanners.length) return null;

  return (
    <section className="bg-[#FFF7F9] py-6 sm:py-8" aria-label="Promociones destacadas">
      <div className="section-container">
        <div className="flex gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory [scrollbar-width:thin]">
        {visibleBanners.map((banner) => {
          const desktopUrl = mediaUrl(banner.desktop_image?.url);
          const mobileUrl = mediaUrl(banner.mobile_image?.url) ?? desktopUrl;
          const content = (
            <picture>
              {mobileUrl ? <source media="(max-width: 767px)" srcSet={mobileUrl} /> : null}
              <img src={desktopUrl ?? ""} alt={banner.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            </picture>
          );

          return (
            <article id={`home-banner-${banner.id ?? banner.home_position}`} key={`${banner.id ?? banner.name}-${banner.home_position}`} className={`${scopeClass(banner.display_scope)} group relative min-w-full snap-center overflow-hidden rounded-[14px] border border-[#F1CCD5] bg-white shadow-sm`}>
              <div className="aspect-[4/5] min-[520px]:aspect-[16/7] lg:aspect-[16/5]">{banner.destination_url ? <Link href={banner.destination_url} aria-label={banner.name}>{content}</Link> : content}</div>
            </article>
          );
        })}
        </div>
        {visibleBanners.length > 1 ? (
          <div className="mt-3 flex justify-center gap-2" aria-label="Indicadores del carrusel">
            {visibleBanners.map((banner, index) => (
              <a key={`dot-${banner.id ?? index}`} href={`#home-banner-${banner.id ?? banner.home_position}`} className="h-2.5 w-2.5 rounded-full bg-[#D4738F] opacity-60 transition hover:opacity-100">
                <span className="sr-only">Ver banner {index + 1}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
