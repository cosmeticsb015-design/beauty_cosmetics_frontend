import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { getVariantOptions, StrapiProduct, StrapiVariantOption } from "../services/producst";
import { useCart } from "../context/CartContext";

export interface ProductCardProps {
  product: StrapiProduct;
  onAddToCart?: (product: StrapiProduct, variant: StrapiVariantOption | null) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();
  const [variantOptions, setVariantOptions] = useState<StrapiVariantOption[] | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<StrapiVariantOption | null>(null);
  const [variantLoading, setVariantLoading] = useState(true);
  const [variantError, setVariantError] = useState<string | null>(null);

  function getDescriptionText(description: unknown): string {
    const fallback = "Sin descripción disponible.";

    if (!description) return fallback;
    if (typeof description === "string") return description;
    if (!Array.isArray(description)) return fallback;

    const text = description
      .map((block) => {
        if (typeof block !== "object" || block === null || !("children" in block)) return "";
        const children = (block as { children?: unknown }).children;
        if (!Array.isArray(children)) return "";

        return children
          .map((child) => {
            if (typeof child !== "object" || child === null || !("text" in child)) return "";
            const childText = (child as { text?: unknown }).text;
            return typeof childText === "string" ? childText : "";
          })
          .join("");
      })
      .join(" ")
      .trim();

    return text || fallback;
  }

  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337").replace(/\/$/, "");
  const buildMediaUrl = (url?: string | null) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${apiBaseUrl}${url}`;
  };

  const imageUrl = buildMediaUrl(product.images?.[0]?.image?.url);

  const getVariantImageUrl = (variant: StrapiVariantOption | null) => {
    return buildMediaUrl(variant?.images?.[0]?.image?.url) ?? imageUrl;
  };

  const selectedVariantPrice = Number(selectedVariant?.price_override ?? product.price);

  const buildCartItem = (variant: StrapiVariantOption | null) => ({
    product_id: product.documentId,
    variant_id: variant?.documentId ?? null,
    product_name: product.name,
    variant_label: variant?.label ?? null,
    unit_price: Number(variant?.price_override ?? product.price),
    image_url: getVariantImageUrl(variant),
    category: product.category?.name || "Catálogo",
    bg: "#FAF6F6",
  });

  const loadVariantOptions = async () => {
    setVariantLoading(true);
    setVariantError(null);

    try {
      const res = await getVariantOptions(product.documentId);
      const options = (res.data || []).filter((variant) => {
        const label = variant.label?.toLowerCase().trim();
        const value = variant.value?.toLowerCase().trim();
        return (
          variant.active !== false &&
          label !== "default" &&
          value !== "general"
        );
      });
      setVariantOptions(options);
      setSelectedVariant(null);
    } catch (error) {
      console.error("Error loading variant options:", error);
      setVariantError("No se pudo cargar las tonalidades.");
      setVariantOptions([]);
      setSelectedVariant(null);
    } finally {
      setVariantLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getVariantOptions(product.documentId)
      .then((res) => {
        if (cancelled) return;
        const options = (res.data || []).filter((variant) => {
          const label = variant.label?.toLowerCase().trim();
          const value = variant.value?.toLowerCase().trim();
          return (
            variant.active !== false &&
            label !== "default" &&
            value !== "general"
          );
        });
        setVariantOptions(options);
        setSelectedVariant(null);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Error loading variant options:", error);
        setVariantError("No se pudo cargar las tonalidades.");
        setVariantOptions([]);
        setSelectedVariant(null);
      })
      .finally(() => {
        if (!cancelled) setVariantLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [product.documentId]);

  const handleAddToCart = () => {
    if (variantLoading && selectedVariant) return;

    if (variantOptions === null) {
      loadVariantOptions();
      addToCart(buildCartItem(null));
      return;
    }

    const variant = selectedVariant ?? null;

    if (onAddToCart) {
      onAddToCart(product, variant);
      return;
    }

    addToCart(buildCartItem(variant));
  };

  const variantButtonLabel = variantOptions === null
    ? "Añadir producto base"
    : selectedVariant
    ? "Añadir tono seleccionado"
    : "Añadir producto base";

  return (
    <div className="group relative flex flex-col bg-white border border-[#F0E4E8] rounded-[8px] overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <Link
        href={`/catalog/${product.documentId}`}
        aria-label={`Ver detalles de ${product.name}`}
        className="absolute inset-0 z-20"
      />

      {/* Image area */}
      <div className="relative w-full aspect-4/3 flex items-center justify-center bg-[#FAF6F6] overflow-hidden">
        {product.featured && (
          <div className="absolute top-2 left-3 z-30 inline-flex items-center gap-2 bg-gradient-to-r from-[#C15074] to-[#9E3659] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#C15074]/20 ring-1 ring-white/80">
         
            Destacado
          </div>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
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
          ${selectedVariantPrice.toFixed(2)}
        </p>

        <p className="text-[11px] text-[#AC9CA0] leading-relaxed mt-1.5 line-clamp-2">
          {getDescriptionText(product.description)}
        </p>

        {variantOptions && variantOptions.length > 0 && (
          <div className="relative z-30 mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C15074] mb-2">
              Tonalidades opcionales
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedVariant(null);
                  setVariantError(null);
                }}
                className={`h-9 rounded-full border-2 px-3 text-[11px] font-semibold uppercase transition-all duration-200 ${!selectedVariant
                  ? "border-[#C15074] bg-[#FDE6ED] text-[#2D1F23]"
                  : "border-[#E8D9DF] bg-white text-[#554246] hover:border-[#C15074] hover:text-[#C15074]"
                }`}
              >
                Principal
              </button>
              {variantOptions.map((variant) => {
                const isSelected = selectedVariant?.documentId === variant.documentId;
                const isColor = variant.value?.startsWith("#");
                return (
                  <button
                    key={variant.documentId}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(variant);
                      setVariantError(null);
                    }}
                    className={`h-9 w-9 rounded-full border-2 transition-all duration-200 flex items-center justify-center px-3 text-[11px] font-semibold uppercase ${isSelected
                      ? "border-[#C15074] bg-[#FDE6ED] text-[#2D1F23]"
                      : "border-[#E8D9DF] bg-white text-[#554246] hover:border-[#C15074] hover:text-[#C15074]"
                    }`}
                    style={isColor ? { backgroundColor: variant.value, color: "#fff" } : undefined}
                  >
                    {!isColor ? variant.label || variant.value || "Tono" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {variantError && (
          <p className="mt-2 text-[11px] text-[#C15074]">{variantError}</p>
        )}

        <div className="relative z-30 mt-4 flex flex-col gap-2">
          <button
            id={`add-to-cart-${product.documentId}`}
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full bg-[#C15074] hover:bg-[#9E3659] active:scale-[0.98] text-white text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-[4px] transition-all duration-200"
          >
            <ShoppingCart size={13} strokeWidth={2} />
            {variantButtonLabel}
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

