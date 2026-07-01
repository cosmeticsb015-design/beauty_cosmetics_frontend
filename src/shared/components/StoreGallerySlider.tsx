import Image from "next/image";

// Sube las imágenes finales a public/store-slider con estos nombres:
// beauty-store-01.jpg ... beauty-store-10.jpg
const galleryImages = Array.from({ length: 10 }, (_, index) => ({
  src: `/store-slider/beauty-store-${String(index + 1).padStart(2, "0")}.jpg`,
  alt: `Beauty Cosmetics experiencia en tienda ${index + 1}`,
}));

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
        <div className="store-gallery-track flex w-max gap-5 px-5 md:gap-7 md:px-7">
          {loopImages.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              className="relative flex h-[420px] w-[250px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-[#F0E4E8] bg-[#FDF5F7] p-2 shadow-[0_16px_45px_rgba(193,80,116,0.13)] sm:h-[500px] sm:w-[310px] lg:h-[560px] lg:w-[350px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 350px, (min-width: 640px) 310px, 250px"
                loading={index < 4 ? "eager" : "lazy"}
                className="rounded-[18px] object-contain p-2"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
