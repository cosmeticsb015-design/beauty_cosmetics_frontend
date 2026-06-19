import { Gift } from "lucide-react";

function buildWhatsappGiftCardUrl(whatsappNumber?: string | null) {
  const cleanNumber = whatsappNumber?.replace(/\D/g, "");
  if (!cleanNumber) return "/catalog?category=gift-cards";
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent("quiero COMPRAR GIFT CARD")}`;
}

export default function GiftCardSection({ whatsappNumber }: { whatsappNumber?: string | null }) {
  const giftCardHref = buildWhatsappGiftCardUrl(whatsappNumber);
  const isWhatsappLink = giftCardHref.startsWith("https://wa.me/");
  return (
    <section
      id="gift-card-section"
      className="bg-[#C15074] py-14 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left: Text Content */}
          <div className="flex flex-col items-start gap-5">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Gift Cards Disponibles
            </h2>
            <p className="text-sm text-white/90 leading-relaxed max-w-xs">
              El regalo perfecto para cualquier ocasión. Deja que elijan sus favoritos
              de nuestra colección de lujo.
            </p>
            <a
              href={giftCardHref}
              id="gift-card-cta"
              target={isWhatsappLink ? "_blank" : undefined}
              rel={isWhatsappLink ? "noopener noreferrer" : undefined}
              className="mt-2 inline-flex items-center justify-center bg-white text-[#C15074] border border-white px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors duration-200 rounded-none min-w-[220px]"
            >
              COMPRAR GIFT CARD
            </a>
          </div>

          {/* Right: Gift Card Visual */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-72 h-44 md:w-80 md:h-48 rotate-[4deg] transition-transform duration-300 hover:rotate-0">

              {/* Main Card */}
              <div className="relative w-full h-full rounded-[14px] bg-[#F0F0F0] shadow-2xl p-6 flex flex-col justify-between overflow-hidden">

                {/* Top row */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#C15074] uppercase">GIFT CARD</span>
                  <span className="text-[#C15074]">
                    <Gift size={20} strokeWidth={1.8} />
                  </span>
                </div>

                {/* Bottom row */}
                <div className="flex justify-between items-end">
                  <span className="text-[11px] text-[#9E8A8E] font-normal tracking-wide">Beauty Cosmetics</span>
                  <span className="text-2xl font-normal text-[#2D1F23]">$50</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
