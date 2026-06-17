"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
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
interface Ingredient {
  name: string;
  description: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337").replace(/\/$/, "");

const buildUrl = (url?: string | null) => (url ? `${API_BASE}${url}` : null);

const getMockIngredients = (): Ingredient[] => [
  {
    name: "Extracto de Semillas Naturales",
    description: "Aporta nutrientes esenciales y antioxidantes para revitalizar la barrera cutánea.",
  },
  {
    name: "Ácido Hialurónico de Triple Peso",
    description: "Penetra en múltiples niveles para retener la humedad de manera prolongada.",
  },
  {
    name: "Vitamina E y Cistina",
    description: "Protegen la superficie de los factores ambientales y previenen la resequedad.",
  },
];

const getMockUsage = (): string =>
  "Aplicar una pequeña cantidad de producto sobre la zona limpia con movimientos suaves y ascendentes. Dejar absorber completamente antes de aplicar maquillaje u otros tratamientos. Usar diariamente en la mañana y noche.";

// ── Accordion ─────────────────────────────────────────────
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[#F0E4E8]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-[#2D1F23] hover:text-[#C15074] transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string; // documentId

  const { addToCart } = useCart();

  const [product, setProduct] = useState<StrapiProduct | null>(null);
  const [variantOptions, setVariantOptions] = useState<StrapiVariantOption[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<StrapiVariantOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;

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
    }, 1);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

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
              setSelectedVariant(variants.length > 0 ? variants[0] : null);
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
      .catch((err: any) => {
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
  const ingredients = getMockIngredients();
  const usage = getMockUsage();
  function getDescriptionText(description: unknown): string {
    if (!description) {
      return "Este exquisito producto ha sido seleccionado cuidadosamente para garantizar la máxima calidad y un rendimiento inigualable en tu rutina de belleza.";
    }
    if (typeof description === "string") return description;
    if (Array.isArray(description)) {
      const text = description
        .map((block: any) =>
          block.children?.map((child: any) => child.text).join("") || ""
        )
        .join(" ")
        .trim();
      return text || "Este exquisito producto ha sido seleccionado cuidadosamente para garantizar la máxima calidad y un rendimiento inigualable en tu rutina de belleza.";
    }
    return "Este exquisito producto ha sido seleccionado cuidadosamente para garantizar la máxima calidad y un rendimiento inigualable en tu rutina de belleza.";
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#AC9CA0] mb-8">
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
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* ── Left: Images ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative w-full aspect-square rounded-[10px] flex items-center justify-center overflow-hidden bg-[#FAF6F6]">
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={selectedVariant?.label || product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#C15074]/30">
                  <div className="w-16 h-28 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-xs">
                    <span className="text-xl">✨</span>
                  </div>
                </div>
              )}

              {/* Variant name badge overlay */}
              {selectedVariant && (
                <span className="absolute bottom-3 left-3 text-[10px] font-bold tracking-widest uppercase bg-white/90 text-[#2D1F23] px-2.5 py-1 rounded-[3px] shadow-sm">
                  {selectedVariant.label}
                </span>
              )}
            </div>

            {/* Thumbnails: variante (si tiene imágenes) o producto */}
            {thumbsToShow.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {thumbsToShow.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`w-20 h-20 rounded-[6px] overflow-hidden transition-all duration-200 ${activeThumb === i
                      ? "ring-2 ring-[#C15074] ring-offset-1"
                      : "ring-1 ring-[#F0E4E8] hover:ring-[#D4738F]"
                      }`}
                  >
                    <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-medium text-[#2D1F23] leading-tight">
              {product.name}
            </h1>

            {product.brand?.name && (
              <p className="text-xs font-bold tracking-widest text-[#C15074] uppercase mt-1">
                {product.brand.name}
              </p>
            )}

            <div className="mt-2 flex items-baseline gap-3">
              <p className="text-2xl font-bold text-[#2D1F23]">
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
              <div className="mt-6">
                <p className="text-xs text-[#554246] mb-3">
                  Elige tu Tono:{" "}
                  <span className="font-semibold text-[#2D1F23]">{selectedVariant?.label}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {variantOptions.map((variant) => {
                    const isSelected = selectedVariant?.documentId === variant.documentId;

                    return (
                      <button
                        key={variant.documentId}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setActiveThumb(0);
                        }}
                        title={variant.label}
                        className={`w-9 h-9 rounded-full border-2 transition-all duration-200 overflow-hidden flex-shrink-0 ${isSelected
                          ? "border-primary scale-110 shadow-md"
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
            <button
              id="product-detail-add-to-cart"
              onClick={handleAddToCart}
              className="mt-8 flex items-center justify-center gap-3 w-full bg-[#C15074] hover:bg-[#9E3659] active:scale-[0.98] text-white font-semibold text-sm tracking-widest uppercase py-4 rounded-[4px] transition-all duration-200"
            >
              <ShoppingCart size={18} strokeWidth={2} />
              Añadir al Carrito
            </button>

            {/* Description */}
            <p className="mt-8 text-sm text-[#554246] leading-relaxed border-t border-[#F0E4E8] pt-6">

              {getDescriptionText(product.description)}</p>


            {/* Accordions */}
            {/* <div className="mt-4">
              <Accordion title="Ingredientes Principales">
                <ul className="flex flex-col gap-4">
                  {ingredients.map((ing) => (
                    <li key={ing.name}>
                      <p className="text-sm font-semibold text-[#2D1F23]">• {ing.name}</p>
                      <p className="text-xs text-[#AC9CA0] mt-0.5 ml-3">{ing.description}</p>
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Modo de Uso">
                <p className="text-sm text-[#554246] leading-relaxed">{usage}</p>
              </Accordion>
            </div> */}

            {/* Back link */}
            <Link
              href="/catalog"
              className="mt-8 inline-flex items-center gap-1.5 text-xs text-[#AC9CA0] hover:text-[#C15074] transition-colors self-start"
            >
              <ArrowLeft size={13} /> Volver al catálogo
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}