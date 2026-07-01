import Image from "next/image";

// Cuando agregues las imágenes en public/store-slider, usa estos nombres/rutas:
// import beautyStore01 from "public/store-slider/beauty-store-01.jpg";
// import beautyStore02 from "public/store-slider/beauty-store-02.jpg";
// import beautyStore03 from "public/store-slider/beauty-store-03.jpg";
// import beautyStore04 from "public/store-slider/beauty-store-04.jpg";
// import beautyStore05 from "public/store-slider/beauty-store-05.jpg";
// import beautyStore06 from "public/store-slider/beauty-store-06.jpg";
// import beautyStore07 from "public/store-slider/beauty-store-07.jpg";
// import beautyStore08 from "public/store-slider/beauty-store-08.jpg";
// import beautyStore09 from "public/store-slider/beauty-store-09.jpg";
// import beautyStore10 from "public/store-slider/beauty-store-10.jpg";
const galleryImages = [
  { src: "/store-slider/beauty-store-01.jpg", alt: "Beauty Cosmetics experiencia en tienda 1" },
  { src: "/store-slider/beauty-store-02.jpg", alt: "Beauty Cosmetics experiencia en tienda 2" },
  { src: "/store-slider/beauty-store-03.jpg", alt: "Beauty Cosmetics experiencia en tienda 3" },
  { src: "/store-slider/beauty-store-04.jpg", alt: "Beauty Cosmetics experiencia en tienda 4" },
  { src: "/store-slider/beauty-store-05.jpg", alt: "Beauty Cosmetics experiencia en tienda 5" },
  { src: "/store-slider/beauty-store-06.jpg", alt: "Beauty Cosmetics experiencia en tienda 6" },
  { src: "/store-slider/beauty-store-07.jpg", alt: "Beauty Cosmetics experiencia en tienda 7" },
  { src: "/store-slider/beauty-store-08.jpg", alt: "Beauty Cosmetics experiencia en tienda 8" },
  { src: "/store-slider/beauty-store-09.jpg", alt: "Beauty Cosmetics experiencia en tienda 9" },
  { src: "/store-slider/beauty-store-10.jpg", alt: "Beauty Cosmetics experiencia en tienda 10" },
];

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
