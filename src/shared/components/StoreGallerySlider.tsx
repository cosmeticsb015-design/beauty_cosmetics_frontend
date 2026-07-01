import Image from "next/image";

const galleryImages = [
  { src: "/store-slider/1.jpg", alt: "Beauty Cosmetics experiencia en tienda 1", orientation: "portrait" },
  { src: "/store-slider/2.jpg", alt: "Beauty Cosmetics experiencia en tienda 2", orientation: "landscape" },
  { src: "/store-slider/3.jpg", alt: "Beauty Cosmetics experiencia en tienda 3", orientation: "portrait" },
  { src: "/store-slider/4.jpg", alt: "Beauty Cosmetics experiencia en tienda 4", orientation: "portrait" },
  { src: "/store-slider/5.jpg", alt: "Beauty Cosmetics experiencia en tienda 5", orientation: "landscape" },
  { src: "/store-slider/6.jpg", alt: "Beauty Cosmetics experiencia en tienda 6", orientation: "portrait" },
  { src: "/store-slider/7.jpg", alt: "Beauty Cosmetics experiencia en tienda 7", orientation: "landscape" },
  { src: "/store-slider/8.jpg", alt: "Beauty Cosmetics experiencia en tienda 8", orientation: "landscape" },
  { src: "/store-slider/9.jpg", alt: "Beauty Cosmetics experiencia en tienda 9", orientation: "portrait" },
  { src: "/store-slider/10.jpg", alt: "Beauty Cosmetics experiencia en tienda 10", orientation: "portrait" },
] as const;

export default function StoreGallerySlider() {
  const loopImages = [...galleryImages, ...galleryImages];

  return (
    <section className="overflow-hidden bg-white px-0 py-12 md:py-16" aria-label="Galería Beauty Cosmetics">
      <div className="mb-8 px-4 text-center md:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">Beauty moments</p>
        <h2 className="mt-3 font-serif text-3xl font-normal uppercase tracking-wide text-[#2D1F23] md:text-4xl">
          Una experiencia pensada para ti
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-28" />
        <div className="store-gallery-track flex w-max items-end gap-5 px-5 md:gap-7 md:px-7">
          {loopImages.map((image, index) => {
            const isLandscape = image.orientation === "landscape";
            return (
              <figure
                key={`${image.src}-${index}`}
                className={`group relative shrink-0 overflow-hidden rounded-[24px] border border-[#F0E4E8] shadow-[0_16px_45px_rgba(193,80,116,0.13)] transition-transform duration-500 hover:-translate-y-1 ${
                  isLandscape
                    ? "h-[260px] w-[340px] sm:h-[320px] sm:w-[420px] lg:h-[370px] lg:w-[480px]"
                    : "h-[420px] w-[250px] sm:h-[500px] sm:w-[310px] lg:h-[560px] lg:w-[350px]"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 420px, 340px"
                  loading={index < 4 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}