import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { StrapiProduct } from "../services/producst";
import { useCart } from "../context/CartContext";

export interface ProductCardProps {
  product: StrapiProduct;
  onAddToCart?: (product: StrapiProduct) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();

  function getDescriptionText(description: unknown): string {
    if (!description) return "Sin descripción disponible.";
    if (typeof description === "string") return description;
    if (Array.isArray(description)) {
      return description
        .map((block: any) =>
          block.children?.map((child: any) => child.text).join("") || ""
        )
        .join(" ")
        .trim() || "Sin descripción disponible.";
    }
    return "Sin descripción disponible.";
  }
  const imageUrl = product.images?.[0]?.image?.url
    ? `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337").replace(/\/$/, "")}${product.images[0].image.url}`
    : null;

  return (
    <div className="group flex flex-col bg-white border border-[#F0E4E8] rounded-[8px] overflow-hidden hover:shadow-md transition-shadow duration-300">

      {/* Image area */}
      <div className="relative w-full aspect-4/3 flex items-center justify-center bg-[#FAF6F6] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Elegant placeholder shape with Lucide Sparkles icon for rich aesthetics */
          <div className="flex flex-col items-center gap-2 text-[#C15074]/30 transition-transform duration-300 group-hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-xs">
              <span className="text-xs">✨</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[13px] font-semibold text-[#2D1F23] leading-snug group-hover:text-[#C15074] transition-colors line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm font-bold text-[#C15074] mt-1">
          ${product.price.toFixed(2)}
        </p>

        <p className="text-[11px] text-[#AC9CA0] leading-relaxed mt-1.5 line-clamp-2">
          {getDescriptionText(product.description)}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            id={`add-to-cart-${product.documentId}`}
            onClick={() => {
              if (onAddToCart) {
                onAddToCart(product);
              } else {
                addToCart({
                  product_id: product.documentId,
                  variant_id: null,
                  product_name: product.name,
                  variant_label: null,
                  unit_price: product.price,
                  image_url: imageUrl,
                  category: product.category?.name || "Catálogo",
                  bg: "#FAF6F6",
                });
              }
            }}
            className="flex items-center justify-center gap-2 w-full bg-[#C15074] hover:bg-[#9E3659] active:scale-[0.98] text-white text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-[4px] transition-all duration-200"
          >
            <ShoppingCart size={13} strokeWidth={2} />
            AÑADIR AL CARRITO
          </button>

          <Link
            href={`/catalog/${product.documentId}`}
            className="text-center text-[11px] text-[#AC9CA0] hover:text-[#C15074] transition-colors"
          >
            Ver detalles
          </Link>
        </div>
      </div>

    </div>
  );
}

