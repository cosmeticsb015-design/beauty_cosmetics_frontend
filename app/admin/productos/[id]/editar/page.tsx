// RUTA: app/admin/productos/[id]/editar/page.tsx
import Link from "next/link";
import {
  BadgeDollarSign,
  ChevronDown,
  CirclePlus,
  CloudUpload,
  Eye,
  History,
  ImageIcon,
  Info,
  MoreVertical,
  RefreshCw,
  Save,
  Settings,
  ShoppingBag,
  Layers3,
  Trash2,
} from "lucide-react";
import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import AdminFlash from "@/src/features/admin/components/AdminFlash";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import { removeEntityForm, saveProductForm, saveVariantForm } from "@/src/features/admin/actions";
import { getAdminBranches, getAdminBrands, getAdminCategories, getAdminProduct, getStrapiMediaUrl, type StrapiStock } from "@/src/shared/services/admin";
import ProductImagePicker from "@/src/features/admin/productos/components/ProductImagePicker";
import VariantColorPicker from "@/src/features/admin/productos/components/VariantColorPicker";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[13px] sm:text-[15px] font-bold tracking-wide text-[#4B4E5A]">{children}</label>;
}

function blocksToText(value: unknown) {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value.map((block) => Array.isArray((block as { children?: unknown[] }).children) ? (block as { children?: { text?: string }[] }).children?.map((child) => child.text ?? "").join("") : "").filter(Boolean).join("\n\n");
}

function money(value: number) {
  return new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  try {
    const [response, brandsResponse, categoriesResponse, branchesResponse] = await Promise.all([getAdminProduct(id), getAdminBrands(), getAdminCategories(), getAdminBranches()]);
    const product = response.data;
    const defaultVariant = ((product as typeof product & { variants?: { documentId?: string; stocks?: StrapiStock[] }[] }).variants ?? [])[0];
    const stockByBranch = new Map((defaultVariant?.stocks ?? []).map((stock) => [stock.branch?.documentId, stock]));
    const branches = branchesResponse.data.map((branch) => {
      const stock = stockByBranch.get(branch.documentId);
      const quantity = stock?.quantity ?? 0;
      return {
        name: branch.name,
        status: quantity > 10 ? "Disponible" : quantity > 0 ? "Bajo Stock" : "Sin Stock",
        stock: quantity,
        stockDocumentId: stock?.documentId ?? "",
        branchDocumentId: branch.documentId,
        tone: quantity > 10 ? "emerald" : quantity > 0 ? "orange" : "red",
        href: branch.documentId,
      };
    });
    const existingImages = (product.images ?? [])
      .map((item) => ({ id: item.documentId, url: getStrapiMediaUrl(item.image?.url) }))
      .filter((item): item is { id: string; url: string } => Boolean(item.id && item.url));
    const variants = ((product as typeof product & { variants?: { label?: string; value?: string; price_override?: number | null; active?: boolean; documentId?: string }[] }).variants ?? []).map((variant, index) => ({
      name: variant.label || variant.value || `Variante ${index + 1}`,
      value: variant.value || "General",
      hex: variant.value?.startsWith("#") ? variant.value : "#9E3659",
      price: money(Number(variant.price_override ?? product.price)),
      active: variant.active !== false,
      primary: index === 0,
      href: variant.documentId ?? `variant-${index}`,
    }));
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <form action={saveProductForm} className="mx-auto w-full max-w-[1120px] px-3 py-6 sm:px-4 sm:py-8 md:px-8 md:py-10">
        <AdminFlash notice={noticeFromQuery(query, "Producto guardado correctamente.")} />
        <input type="hidden" name="id" value={product.documentId} />
        
        {/* Header Section - Stack en móvil */}
        <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-start md:justify-between mb-8 sm:mb-9">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold leading-tight text-[#1F1F22] break-words">{product.name}</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E8E8EB] px-3 sm:px-4 py-2 text-[11px] sm:text-[13px] font-semibold text-[#5F6370] flex-shrink-0">
                <span className="h-2 w-2 rounded-full bg-[#B8BBC6]" />
                {product.active ? "activo" : "inactivo"}
              </span>
            </div>
            <p className="mt-2 text-sm sm:text-[16px] text-[#5F6370] leading-relaxed">
              Modifica los detalles del producto en el catálogo global.
            </p>
          </div>

          {/* Action Buttons - Stack en móvil, inline en desktop */}
          <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row w-full sm:w-auto">
            <Link
              href="/admin"
              className="inline-flex h-10 sm:h-11 items-center justify-center rounded-[8px] border border-[#6B7280] bg-white px-4 sm:px-8 text-[13px] sm:text-[14px] font-bold tracking-wide text-[#4B4E5A] transition-colors hover:border-[#9E3659] hover:text-[#9E3659] whitespace-nowrap"
            >
              Descartar
            </Link>
            <button className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 sm:gap-3 rounded-[8px] bg-[#9E3659] px-4 sm:px-7 text-[13px] sm:text-[14px] font-bold tracking-wide text-white transition-colors hover:bg-[#84304C] whitespace-nowrap">
              <Save size={16} strokeWidth={2} className="sm:size-[17px]" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* Left Column - Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* General Info Section */}
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-5 sm:p-7">
              <div className="mb-6 sm:mb-7 flex items-center gap-3">
                <Info size={20} strokeWidth={2} className="text-[#9E3659] flex-shrink-0 sm:size-[24px]" />
                <h3 className="text-[20px] sm:text-[25px] font-bold text-[#1F1F22]">Información General</h3>
              </div>

              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_0.6fr_0.6fr]">
                <div className="space-y-2">
                  <FieldLabel>Nombre del Producto</FieldLabel>
                  <input name="name" className="h-10 sm:h-13 w-full rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-3 sm:px-5 text-[13px] sm:text-[15px] outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]" defaultValue={product.name} />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Categoría</FieldLabel>
                  <div className="relative">
                    <select name="category" defaultValue={product.category?.documentId ?? ""} className="h-10 sm:h-13 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-3 sm:px-5 text-[13px] sm:text-[15px] outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]">
                      <option value="">Sin categoria</option>
                      {categoriesResponse.data.map((category) => <option key={category.documentId} value={category.documentId}>{category.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#5F6370] sm:size-[18px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Marca</FieldLabel>
                  <div className="relative">
                    <select name="brand" defaultValue={product.brand?.documentId ?? ""} className="h-10 sm:h-13 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-3 sm:px-5 text-[13px] sm:text-[15px] outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]">
                      <option value="">Sin marca</option>
                      {brandsResponse.data.map((brand) => <option key={brand.documentId} value={brand.documentId}>{brand.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#5F6370] sm:size-[18px]" />
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-7 space-y-2">
                <FieldLabel>Slug</FieldLabel>
                <input name="slug" className="h-10 sm:h-13 w-full rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-3 sm:px-5 text-[13px] sm:text-[15px] outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]" defaultValue={product.slug} />
              </div>

              <div className="mt-6 sm:mt-7 space-y-2">
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                  name="description"
                  className="min-h-[120px] sm:min-h-[155px] w-full resize-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-3 sm:px-5 py-3 sm:py-4 text-[13px] sm:text-[15px] leading-relaxed outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]"
                  defaultValue={blocksToText(product.description)}
                />
              </div>
            </section>

            {/* Inventory Section - Table responsive */}
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-5 sm:p-7">
              <div className="mb-6 sm:mb-7 flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={2} className="text-[#9E3659] flex-shrink-0 sm:size-[24px]" />
                <h3 className="text-[20px] sm:text-[25px] font-bold text-[#1F1F22]">Inventario por Sucursal</h3>
              </div>
              <div className="overflow-x-auto -mx-5 sm:mx-0 sm:rounded-[4px] sm:border sm:border-[#C8CEDB]">
                <table className="w-full border-collapse">
                  <thead className="bg-[#E5E7EB] text-left text-[11px] sm:text-[13px] font-bold tracking-[0.1em] text-[#4B4E5A]">
                    <tr>
                      <th className="px-4 sm:px-7 py-3 sm:py-5 whitespace-nowrap">Sucursal</th>
                      <th className="px-4 sm:px-7 py-3 sm:py-5 whitespace-nowrap">Estado</th>
                      <th className="px-4 sm:px-7 py-3 sm:py-5 whitespace-nowrap">Stock</th>
                      <th className="px-4 sm:px-7 py-3 sm:py-5 text-center whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.length ? branches.map((branch) => (
                      <tr key={branch.name} className="border-t border-[#C8CEDB] hover:bg-[#F9F9FB] transition-colors">
                        <td className="px-4 sm:px-7 py-4 sm:py-5 text-[13px] sm:text-[15px] font-semibold text-[#1F1F22] whitespace-nowrap">{branch.name}</td>
                        <td className="px-4 sm:px-7 py-4 sm:py-5">
                          <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-[13px] font-semibold whitespace-nowrap ${branch.tone === "emerald" ? "bg-emerald-100 text-emerald-700" : branch.tone === "orange" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                            {branch.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-7 py-4 sm:py-5">
                          <input type="hidden" name={`stock_document_${branch.branchDocumentId}`} value={branch.stockDocumentId} />
                          <input name={`branch_stock_${branch.branchDocumentId}`} type="number" min="0" defaultValue={branch.stock} className="h-9 sm:h-10 w-20 sm:w-24 rounded-[4px] border border-[#C8CEDB] px-2 sm:px-3 text-[13px] sm:text-[15px] font-bold outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]" />
                        </td>
                        <td className="px-4 sm:px-7 py-4 sm:py-5 text-center">
                          <Link href={`/admin/productos/${product.documentId}/inventario/${branch.href}`} className="inline-flex text-[#5C4B50] hover:text-[#9E3659] transition-colors" aria-label={`Ver inventario ${branch.name}`}>
                            <Eye size={18} strokeWidth={2} className="sm:size-[22px]" />
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr className="border-t border-[#C8CEDB]">
                        <td className="px-4 sm:px-7 py-6 sm:py-8 text-[13px] sm:text-[15px] font-semibold text-[#5F6370]" colSpan={4}>No hay sucursales creadas en Strapi.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Variants Section */}
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-5 sm:p-7">
              <div className="mb-6 sm:mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Layers3 size={20} strokeWidth={2} className="text-[#9E3659] flex-shrink-0 sm:size-[24px]" />
                  <h3 className="text-[20px] sm:text-[25px] font-bold text-[#1F1F22]">Variantes y Atributos</h3>
                </div>
                <button className="inline-flex items-center gap-2 text-[13px] sm:text-[15px] font-bold text-[#9E3659] hover:text-[#84304C] transition-colors whitespace-nowrap">
                  <Settings size={14} strokeWidth={2} className="sm:size-[16px]" />
                  Gestionar Atributos
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {variants.map((variant) => (
                  <div key={variant.name} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 rounded-[6px] border border-[#C8CEDB] p-4 sm:p-5 hover:border-[#9E3659] transition-colors">
                    <div className="flex-shrink-0">
                      <span className="block h-12 sm:h-14 w-12 sm:w-14 rounded-[4px]" style={{ backgroundColor: variant.hex }} />
                      <p className="mt-2 text-[11px] sm:text-[13px] text-[#5F6370] text-center sm:text-left">{variant.hex}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] sm:text-[18px] font-bold text-[#1F1F22] truncate">{variant.name}</p>
                      <p className="text-[12px] sm:text-[13px] font-semibold text-[#5F6370] truncate">{variant.value}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:text-right">
                      <div className="flex flex-col gap-1">
                        {variant.primary && <span className="inline-flex rounded-[3px] bg-[#9E3659] px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold text-white whitespace-nowrap w-fit">PRINCIPAL</span>}
                        <p className="text-[11px] sm:text-[13px] font-semibold text-[#5F6370]">{variant.active ? "Activa" : "Inactiva"}</p>
                      </div>
                      <p className="text-[14px] sm:text-[16px] font-bold text-[#1F1F22]">{variant.price}</p>
                    </div>
                    <Link
                      href={`/admin/productos/${product.documentId}/variantes/${variant.href}/editar`}
                      aria-label={`Editar variante ${variant.name}`}
                      className="flex-shrink-0 text-[#5F6370] hover:text-[#9E3659] transition-colors"
                    >
                      <MoreVertical size={18} strokeWidth={2} className="sm:size-[21px]" />
                    </Link>
                  </div>
                ))}
                <div className="rounded-[6px] border-2 border-dashed border-[#C8CEDB] p-4 sm:p-5 hover:border-[#9E3659] hover:bg-[#F9F9FB] transition-colors">
                  <p className="mb-4 flex items-center gap-2 text-[13px] sm:text-[15px] font-bold text-[#4B4E5A]"><CirclePlus size={18} strokeWidth={2} className="flex-shrink-0 sm:size-[20px]" />Añadir Nueva Combinación</p>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <input form="new-variant-form" name="label" placeholder="Etiqueta: Tono / Tamaño" className="h-10 sm:h-11 rounded-[4px] border border-[#C8CEDB] px-3 text-[13px] sm:text-[14px] outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]" />
                    <input form="new-variant-form" name="price_override" placeholder="Precio opcional" className="h-10 sm:h-11 rounded-[4px] border border-[#C8CEDB] px-3 text-[13px] sm:text-[14px] outline-none focus:border-[#9E3659] focus:ring-1 focus:ring-[#9E3659]" />
                  </div>
                  <div className="mt-4">
                    <VariantColorPicker name="value" formId="new-variant-form" />
                  </div>
                  <div className="mt-4">
                    <ProductImagePicker compact inputForm="new-variant-form" />
                  </div>
                  <button form="new-variant-form" className="mt-4 w-full sm:w-auto h-10 sm:h-11 rounded-[6px] bg-[#9E3659] px-4 sm:px-5 text-[13px] sm:text-[14px] font-bold text-white hover:bg-[#84304C] transition-colors">Guardar Variante</button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6 sm:space-y-8">
            {/* Image Gallery Section */}
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-5 sm:p-7">
              <div className="mb-5 sm:mb-6 flex items-center gap-3">
                <ImageIcon size={20} strokeWidth={2} className="text-[#9E3659] flex-shrink-0 sm:size-[22px]" />
                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1F1F22]">Galería de Imágenes</h3>
              </div>
              <ProductImagePicker existingImages={existingImages} compact />
              <p className="mt-3 text-[11px] sm:text-[12px] font-semibold text-red-700">Marca las imágenes que quieras eliminar y luego guarda los cambios.</p>
            </section>

            {/* Price & SKU Section */}
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-5 sm:p-7">
              <div className="mb-5 sm:mb-6 flex items-center gap-3">
                <BadgeDollarSign size={20} strokeWidth={2} className="text-[#9E3659] flex-shrink-0 sm:size-[25px]" />
                <h3 className="text-[18px] sm:text-[25px] font-bold text-[#1F1F22]">Precio & SKU</h3>
              </div>
              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <FieldLabel>Precio Base (USD)</FieldLabel>
                  <div className="flex h-10 sm:h-13 items-center rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-3 sm:px-4 focus-within:border-[#9E3659] focus-within:ring-1 focus-within:ring-[#9E3659] transition-colors">
                    <span className="mr-2 sm:mr-3 text-[15px] sm:text-[17px] font-bold flex-shrink-0">$</span>
                    <input name="price" defaultValue={String(product.price)} className="min-w-0 flex-1 bg-transparent text-[13px] sm:text-[15px] font-bold outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>SKU Principal</FieldLabel>
                  <div className="flex h-10 sm:h-13 overflow-hidden rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] focus-within:border-[#9E3659] focus-within:ring-1 focus-within:ring-[#9E3659] transition-colors">
                    <input name="sku" defaultValue={product.slug} className="min-w-0 flex-1 bg-transparent px-3 sm:px-5 text-[13px] sm:text-[15px] outline-none" />
                    <button type="button" className="w-10 sm:w-12 border-l border-[#C8CEDB] text-[#1F1F22] hover:bg-[#E5E7EB] transition-colors flex-shrink-0" aria-label="Regenerar SKU">
                      <RefreshCw size={16} className="mx-auto sm:size-[20px]" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Publication Section */}
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-5 sm:p-7">
              <div className="mb-5 sm:mb-6 flex items-center gap-3">
                <CloudUpload size={20} strokeWidth={2} className="text-[#9E3659] flex-shrink-0 sm:size-[25px]" />
                <h3 className="text-[18px] sm:text-[25px] font-bold text-[#1F1F22]">Publicación</h3>
              </div>
              <div className="space-y-3 sm:space-y-5">
                <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-4 sm:px-5 py-3 sm:py-4 cursor-pointer hover:bg-[#E5E7EB] transition-colors">
                  <span>
                    <span className="block text-[13px] sm:text-[15px] font-bold text-[#1F1F22]">Estado Activo</span>
                    <span className="text-[12px] sm:text-[13px] text-[#4B4E5A]">Visible en la tienda pública</span>
                  </span>
                  <input type="checkbox" name="active" defaultChecked={product.active} className="h-5 sm:h-6 w-5 sm:w-6 accent-[#9E3659] cursor-pointer" />
                </label>
                <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-4 sm:px-5 py-3 sm:py-4 cursor-pointer hover:bg-[#E5E7EB] transition-colors">
                  <span>
                    <span className="block text-[13px] sm:text-[15px] font-bold text-[#1F1F22]">Destacado</span>
                    <span className="text-[12px] sm:text-[13px] text-[#4B4E5A]">Producto destacado</span>
                  </span>
                  <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-5 sm:h-6 w-5 sm:w-6 accent-[#9E3659] cursor-pointer" />
                </label>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[12px] sm:text-[14px] text-[#4B4E5A]">
                <History size={14} strokeWidth={1.8} className="flex-shrink-0 sm:size-[16px]" />
                Sin registros de actividad
              </p>
            </section>

            {/* Delete Section */}
            <section className="rounded-[8px] border border-red-200 bg-white p-5 sm:p-7">
              <div className="mb-4 flex items-center gap-3 text-red-700">
                <Trash2 size={20} strokeWidth={2} className="flex-shrink-0 sm:size-[22px]" />
                <h3 className="text-[16px] sm:text-[20px] font-bold">Eliminar Producto</h3>
              </div>
              <p className="text-[12px] sm:text-[14px] leading-relaxed text-[#6B6063]">Esta acción elimina el producto del catálogo. Úsala solo cuando ya no quieras conservar el registro.</p>
              <button form="delete-product-form" className="mt-4 sm:mt-5 w-full inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-[6px] border border-red-200 px-4 sm:px-5 text-[13px] sm:text-[14px] font-bold text-red-700 transition-colors hover:bg-red-50">
                <Trash2 size={14} className="flex-shrink-0 sm:size-[16px]" />
                Eliminar producto
              </button>
            </section>
          </aside>
        </div>
      </form>
      <form id="delete-product-form" action={removeEntityForm} className="hidden">
        <input type="hidden" name="collection" value="products" />
        <input type="hidden" name="id" value={product.documentId} />
      </form>
      <form id="new-variant-form" action={saveVariantForm} className="hidden">
        <input type="hidden" name="product" value={product.documentId} />
        <input type="hidden" name="active" value="true" />
      </form>
    </AdminShell>
  );
  } catch (error) {
    return (
      <AdminShell active="products" searchPlaceholder="Buscar productos...">
        <AdminDataError title="No se pudo cargar el producto desde Strapi" error={error} permissions={["Product: find/findOne", "Variant-option: find/findOne", "Branch-stock: find/findOne", "Product-image: find/findOne"]} />
      </AdminShell>
    );
  }
}