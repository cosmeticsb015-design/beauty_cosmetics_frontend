import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function FeaturedProduct() {
  return (
    <section id="featured-product-section" className="py-16 md:py-24 bg-[#F9F5F0]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center">

          {/* Left Column: Product Image */}
          <div className="relative rounded-[8px] overflow-hidden bg-[#F0E9E1]">
            <div className="aspect-square flex items-center justify-center p-8">
              {/* Dropper bottle illustration */}
              <div className="relative w-44 h-72 md:w-52 md:h-80 drop-shadow-xl">
                {/* Dropper bulb */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#F0EAE2] rounded-full border border-[#DDD3C8]" />
                {/* Dropper stem */}
                <div className="absolute top-9 left-1/2 -translate-x-1/2 w-2 h-8 bg-[#B5927A]" />
                {/* Cap ring */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#C4A08A] rounded-sm" />
                {/* Bottle collar */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-5 bg-linear-to-b from-[#C4A08A] to-[#B08870] rounded-sm" />
                {/* Main glass body */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-28 h-44 rounded-b-3xl rounded-t-md bg-linear-to-b from-[#EDE4D8] via-[#F4EEE5] to-[#E6DAC9] border border-white/50 shadow-inner overflow-hidden">
                  {/* Glass shine */}
                  <div className="absolute top-0 left-2 w-3 h-full bg-white/35 blur-[2px] rounded-full" />
                  <div className="absolute top-0 right-4 w-1.5 h-3/4 bg-white/20 blur-[1px] rounded-full" />
                  {/* Rose gold label */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-24 bg-linear-to-b from-[#C4A08A]/80 to-[#A07858]/80 rounded-[3px] flex flex-col items-center justify-center gap-0.5 p-2 text-center">
                    <span className="text-[7px] tracking-[0.2em] font-bold uppercase text-[#FAF0E8]">LUMINA</span>
                    <span className="text-[13px] font-serif font-medium leading-tight text-white">ROSE</span>
                    <span className="text-[7px] tracking-[0.2em] font-bold uppercase text-[#FAF0E8]">SERUM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col justify-center py-4">
            <h2 className="text-3xl md:text-[40px] font-normal font-serif text-[#2D1F23] leading-tight tracking-wide">
              Lumina Rose Serum
            </h2>

            <p className="mt-6 text-sm md:text-base text-[#554246] leading-relaxed max-w-md">
              Una infusión ultra-ligera de pétalos de rosa fresca y ácido hialurónico
              de triple peso. Restaura la luminosidad instantánea y suaviza la
              textura de la piel desde la primera aplicación.
            </p>

            {/* Price */}
            <div className="mt-8 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-[#2D1F23]">$45.00</span>
              <span className="text-base text-[#AC9CA0] line-through font-normal">$62.00</span>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                href="/catalog"
                id="featured-product-cta"
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#C15074] hover:bg-[#9E3659] active:scale-[0.98] text-white transition-all duration-300 font-semibold text-sm tracking-widest uppercase px-10 py-4 rounded-[4px]"
              >
                <ShoppingCart size={18} strokeWidth={2} />
                AÑADIR AL CARRITO
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
