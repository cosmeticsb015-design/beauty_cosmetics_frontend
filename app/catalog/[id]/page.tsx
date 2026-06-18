"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import {
  getProductById,
  StrapiProduct,
  StrapiResponse,
  ProductImageRelation,
  getVariantOptions,
  StrapiVariantOption,
} from "../../services/producst";

// ── Helpers ────────────────────────────────────────────────
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337").replace(/\/$/, "");

const buildUrl = (url?: string | null) => (url ? `${API_BASE}${url}` : null);

// ── Page ──────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string; // documentId

  const { addToCart } = useCart();

  const [product, setProduct] = useState<StrapiProduct | null>(null);
  const [variantOptions, setVariantOptions] = useState<StrapiVariantOption[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<StrapiVariantOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addSelectedProductToCart = (quantityToAdd = quantity) => {
    if (!product) return false;

    const imageUrl = selectedVariant?.images?.[0]?.image?.url
      ? buildUrl(selectedVariant.images[0].image.url)
      : product.images?.[0]?.image?.url
      ? buildUrl(product.images[0].image.url)
      : null;

    const unitPrice = selectedVariant?.price_override ?? product.price;

    addToCart({
      product_id: product.documentId,
      variant_id: selectedVariant?.documentId || null,
      product_name: product.name,
      variant_label: selectedVariant?.label || null,
      unit_price: unitPrice,
      image_url: imageUrl,
      category: product.category?.name || "Catálogo",
      bg: "#FAF6F6",
    }, quantityToAdd);

    return true;
  };

  const handleAddToCart = () => {
    addSelectedProductToCart();
  };

  const handleCheckoutNow = () => {
    if (addSelectedProductToCart()) {
      router.push("/checkout");
    }
  };

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((res: StrapiResponse<StrapiProduct>) => {
        if (res.data) {
          if (res.data.active === false) {
            setError("Producto no encontrado.");
            setProduct(null);
            setLoading(false);
            return;
          }

          setProduct(res.data);

          // Fetch variant options (tonalidades) para este producto
          setVariantsLoading(true);
          getVariantOptions(id)
            .then((variantRes) => {
              const variants = (variantRes.data || []).filter((variant) => {
                const label = variant.label?.toLowerCase().trim();
                const value = variant.value?.toLowerCase().trim();
                return (
                  variant.active !== false &&
                  label !== "default" &&
                  value !== "general"
                );
              });
              setVariantOptions(variants);
              setSelectedVariant(null);
            })
            .catch((err) => {
              console.warn("Could not load variant options:", err);
              setVariantOptions([]);
              setSelectedVariant(null);
            })
            .finally(() => setVariantsLoading(false));
        } else {
          setError("Producto no encontrado.");
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Ocurrió un error al buscar los detalles del producto.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-[#C15074] border-t-transparent animate-spin" />
        <p className="text-xs text-[#AC9CA0] font-medium tracking-widest uppercase">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#AC9CA0]">
        <p className="text-lg">{error || "Producto no encontrado."}</p>
        <Link href="/catalog" className="text-sm text-[#C15074] font-semibold hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  // ── Image logic ──────────────────────────────────────────
  // Todas las imágenes de la variante seleccionada
  const variantImageUrls: string[] = (selectedVariant?.images || [])
    .map((imgObj) => buildUrl(imgObj.image?.url))
    .filter(Boolean) as string[];

  // Imágenes del producto base
  const productImageUrls: string[] = (product.images || [])
    .map((imgObj: ProductImageRelation) => buildUrl(imgObj.image?.url))
    .filter(Boolean) as string[];

  // Si hay variante con imágenes, usar las suyas; si no, usar las del producto
  const thumbsToShow = variantImageUrls.length > 0 ? variantImageUrls : productImageUrls;

  // Imagen principal: la activa del conjunto actual
  const mainImageUrl = thumbsToShow[activeThumb] || null;

  const categoryLabel = product.category?.name || "Catálogo";
  function getDescriptionText(description: unknown): string {
    const fallback = "Este exquisito producto ha sido seleccionado cuidadosamente para garantizar la máxima calidad y un rendimiento inigualable en tu rutina de belleza.";

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 md:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] text-[#8A7A7E] mb-14">
          <Link href="/" className="hover:text-[#C15074] transition-colors">Inicio</Link>
          <span>/</span>
          <Link
            href={`/catalog?category=${product.category?.slug || ""}`}
            className="hover:text-[#C15074] transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-[#2D1F23] font-medium">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1.25fr_0.9fr] gap-8 lg:gap-12 xl:gap-16 items-start">

          {/* ── Left: Images ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden bg-[#F7F7F5]">
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={selectedVariant?.label || product.name}
                  className="w-full h-full object-contain transition-opacity duration-300"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#C15074]/30">
                  <div className="w-16 h-28 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-xs">
                    <span className="text-xl">✨</span>
                  </div>
                </div>
              )}

              <span className="absolute left-6 top-6 text-[11px] font-medium text-[#2D1F23]">
                Cruelty-free
              </span>
            </div>

            {/* Thumbnails: variante (si tiene imágenes) o producto */}
            {thumbsToShow.length > 1 && (
              <div className="grid grid-cols-3 gap-3 max-w-[430px]">
                {thumbsToShow.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`aspect-[1.45] overflow-hidden bg-white transition-all duration-200 ${activeThumb === i
                      ? "ring-2 ring-[#C15074] ring-offset-1"
                      : "ring-1 ring-[#F0E4E8] hover:ring-[#D4738F]"
                      }`}
                  >
                    <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col pt-1 lg:pt-2">
            <h1 className="text-3xl md:text-[34px] font-medium text-[#171316] leading-tight">
              {product.name}
            </h1>

            {product.brand?.name && (
              <p className="text-xs font-bold tracking-widest text-[#C15074] uppercase mt-1">
                {product.brand.name}
              </p>
            )}

            <div className="mt-2 flex items-baseline gap-3">
              <p className="text-2xl font-normal text-[#2D1F23]">
                ${Number(selectedVariant?.price_override ?? product.price).toFixed(2)}
              </p>
              
            </div>

            {/* ── Tonalidades / Color Picker ── */}
            {variantsLoading ? (
              <div className="mt-6 flex items-center gap-2 text-[#AC9CA0]">
                <div className="w-4 h-4 rounded-full border-2 border-[#C15074] border-t-transparent animate-spin" />
                <span className="text-xs">Cargando tonalidades...</span>
              </div>
            ) : variantOptions.length > 0 ? (
              <div className="mt-10">
                <p className="text-xs text-[#554246] mb-3">
                  Elige tu Tono:{" "}
                  <span className="font-semibold text-[#2D1F23]">{selectedVariant?.label || "Producto principal"}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVariant(null);
                      setActiveThumb(0);
                    }}
                    title="Producto principal"
                    className={`h-9 rounded-[10px] border-2 px-3 text-[11px] font-semibold transition-all duration-200 flex-shrink-0 ${!selectedVariant
                      ? "border-[#2D1F23] bg-[#FAF6F6] text-[#2D1F23] shadow-sm"
                      : "border-[#E8D9DF] bg-white text-[#8A7A7E] hover:border-[#C15074]/40 hover:text-[#C15074]"
                      }`}
                  >
                    Principal
                  </button>
                  {variantOptions.map((variant) => {
                    const isSelected = selectedVariant?.documentId === variant.documentId;

                    return (
                      <button
                        key={variant.documentId}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(variant);
                          setActiveThumb(0);
                        }}
                        title={variant.label}
                        className={`w-9 h-9 rounded-[10px] border-2 transition-all duration-200 overflow-hidden flex-shrink-0 ${isSelected
                          ? "border-[#2D1F23] scale-105 shadow-sm"
                          : "border-transparent hover:scale-105 hover:border-[#C15074]/40"
                          }`}
                      >
                        {/* Siempre muestra el color del variant, nunca imagen */}
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: variant.value || "#C15074" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Add to Cart */}
            <div className="mt-10 space-y-3">
              <div className="flex items-center justify-between rounded-[10px] border border-[#F0E4E8] bg-[#FDFCFD] px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A7A7E]">Cantidad</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    aria-label="Reducir cantidad"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0E4E8] text-[#554246] transition-colors hover:border-[#C15074] hover:text-[#C15074]"
                  >
                    <Minus size={14} strokeWidth={2.2} />
                  </button>
                  <span className="min-w-8 text-center text-base font-bold text-[#2D1F23]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    aria-label="Aumentar cantidad"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0E4E8] text-[#554246] transition-colors hover:border-[#C15074] hover:text-[#C15074]"
                  >
                    <Plus size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <button
                id="product-detail-add-to-cart"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-3 bg-[#C9577F] py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#9E3659] active:scale-[0.98]"
              >
                <ShoppingBag size={18} strokeWidth={2} />
                Añadir al Carrito
              </button>

              <button
                type="button"
                onClick={handleCheckoutNow}
                className="flex w-full items-center justify-center gap-3 border border-[#2D1F23] bg-white py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#2D1F23] transition-colors hover:bg-[#2D1F23] hover:text-white"
              >
                Finalizar compra
              </button>
            </div>

            {/* Description */}
            <section className="mt-16 border-t border-[#EFE5E8] pt-7">
              <h2 className="text-[13px] font-semibold text-[#2D1F23] mb-3">Descripción</h2>
              <p className="text-sm text-[#554246] leading-7">
                {getDescriptionText(product.description)}
              </p>
            </section>


          </div>

        </div>
      </div>
    </div>
  );
}