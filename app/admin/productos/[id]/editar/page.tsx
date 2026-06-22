import Image from "next/image";
import Link from "next/link";
import {
  BadgeDollarSign,
  Camera,
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
} from "lucide-react";
import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import AdminFlash from "@/src/features/admin/components/AdminFlash";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import { saveProductForm, saveVariantForm } from "@/src/features/admin/actions";
import { getAdminBranches, getAdminBrands, getAdminCategories, getAdminProduct, getStrapiMediaUrl, type StrapiStock } from "@/src/shared/services/admin";
import ProductImagePicker from "@/src/features/admin/productos/components/ProductImagePicker";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[15px] font-bold tracking-wide text-[#4B4E5A]">{children}</label>;
}

function ProductImage({ className, principal, url }: { className: string; principal?: boolean; url?: string | null }) {
  return (
    <div className={`relative h-[120px] overflow-hidden rounded-[4px] ${url ? "bg-[#F8F8F9]" : className}`}>
      {url ? <Image src={url} alt="Imagen del producto" fill sizes="165px" className="object-cover" /> : null}
      {principal && (
        <span className="absolute left-3 top-3 rounded-[3px] bg-[#9E3659] px-3 py-1 text-[11px] font-bold text-white">
          PRINCIPAL
        </span>
      )}
      {!url ? <div className="absolute bottom-4 left-1/2 h-14 w-5 -translate-x-1/2 rounded-t-[3px] bg-white/85 shadow" /> : null}
      {!url ? <div className="absolute bottom-[70px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#7A2608]/70" /> : null}
    </div>
  );
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
    const existingImages = (product.images ?? []).map((item) => getStrapiMediaUrl(item.image?.url)).filter(Boolean) as string[];
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
      <form action={saveProductForm} className="mx-auto w-full max-w-[1120px] px-4 py-10 md:px-8">
        <AdminFlash notice={noticeFromQuery(query, "Producto guardado correctamente.")} />
        <input type="hidden" name="id" value={product.documentId} />
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-[40px] font-bold leading-tight text-[#1F1F22]">{product.name}</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E8E8EB] px-4 py-2 text-[13px] font-semibold text-[#5F6370]">
                <span className="h-2 w-2 rounded-full bg-[#B8BBC6]" />
                {product.active ? "activo" : "inactivo"}
              </span>
            </div>
            <p className="mt-2 text-[16px] text-[#5F6370]">
              Modifica los detalles del producto en el catálogo global.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#6B7280] bg-white px-8 text-[14px] font-bold tracking-wide text-[#4B4E5A] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]"
            >
              Descartar
            </Link>
            <button className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#9E3659] px-7 text-[14px] font-bold tracking-wide text-white transition-colors hover:bg-[#84304C]">
              <Save size={17} strokeWidth={2} />
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="mt-9 grid gap-6 xl:grid-cols-[1fr_330px]">
          <div className="space-y-8">
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-7 flex items-center gap-3">
                <Info size={24} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Información General</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-[1fr_0.6fr_0.6fr]">
                <div className="space-y-2">
                  <FieldLabel>Nombre del Producto</FieldLabel>
                  <input name="name" className="h-13 w-full rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none" defaultValue={product.name} />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Categoría</FieldLabel>
                  <div className="relative">
                    <select name="category" defaultValue={product.category?.documentId ?? ""} className="h-13 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none">
                      <option value="">Sin categoria</option>
                      {categoriesResponse.data.map((category) => <option key={category.documentId} value={category.documentId}>{category.name}</option>)}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Marca</FieldLabel>
                  <div className="relative">
                    <select name="brand" defaultValue={product.brand?.documentId ?? ""} className="h-13 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none">
                      <option value="">Sin marca</option>
                      {brandsResponse.data.map((brand) => <option key={brand.documentId} value={brand.documentId}>{brand.name}</option>)}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-2">
                <FieldLabel>Slug</FieldLabel>
                <input name="slug" className="h-13 w-full rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none" defaultValue={product.slug} />
              </div>

              <div className="mt-7 space-y-2">
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                  name="description"
                  className="min-h-[155px] w-full resize-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 py-4 text-[15px] leading-relaxed outline-none"
                  defaultValue={blocksToText(product.description)}
                />
              </div>
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-7 flex items-center gap-3">
                <ShoppingBag size={24} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Inventario por Sucursal</h3>
              </div>
              <div className="overflow-hidden rounded-[4px] border border-[#C8CEDB]">
                <table className="w-full border-collapse">
                  <thead className="bg-[#E5E7EB] text-left text-[13px] font-bold tracking-[0.1em] text-[#4B4E5A]">
                    <tr>
                      <th className="px-7 py-5">Sucursal</th>
                      <th className="px-7 py-5">Estado</th>
                      <th className="px-7 py-5">Stock</th>
                      <th className="px-7 py-5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.length ? branches.map((branch) => (
                      <tr key={branch.name} className="border-t border-[#C8CEDB]">
                        <td className="px-7 py-5 text-[15px] font-semibold text-[#1F1F22]">{branch.name}</td>
                        <td className="px-7 py-5">
                          <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${branch.tone === "emerald" ? "bg-emerald-100 text-emerald-700" : branch.tone === "orange" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                            {branch.status}
                          </span>
                        </td>
                        <td className="px-7 py-5">
                          <input type="hidden" name={`stock_document_${branch.branchDocumentId}`} value={branch.stockDocumentId} />
                          <input name={`branch_stock_${branch.branchDocumentId}`} type="number" min="0" defaultValue={branch.stock} className="h-10 w-24 rounded-[4px] border border-[#C8CEDB] px-3 text-[15px] font-bold outline-none focus:border-[#9E3659]" />
                        </td>
                        <td className="px-7 py-5 text-center">
                          <Link href={`/admin/productos/${product.documentId}/inventario/${branch.href}`} className="inline-flex text-[#5C4B50] hover:text-[#9E3659]" aria-label={`Ver inventario ${branch.name}`}>
                            <Eye size={22} strokeWidth={2} />
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr className="border-t border-[#C8CEDB]">
                        <td className="px-7 py-8 text-[15px] font-semibold text-[#5F6370]" colSpan={4}>No hay sucursales creadas en Strapi para asignar stock.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Layers3 size={24} strokeWidth={2} className="text-[#9E3659]" />
                  <h3 className="text-[25px] font-bold text-[#1F1F22]">Variantes y Atributos</h3>
                </div>
                <button className="inline-flex items-center gap-2 text-[15px] font-bold text-[#9E3659]">
                  <Settings size={16} strokeWidth={2} />
                  Gestionar Atributos
                </button>
              </div>

              <div className="space-y-5">
                {variants.map((variant) => (
                  <div key={variant.name} className="flex items-center gap-6 rounded-[6px] border border-[#C8CEDB] p-5">
                    <div>
                      <span className="block h-14 w-14 rounded-[4px]" style={{ backgroundColor: variant.hex }} />
                      <p className="mt-2 text-[13px] text-[#5F6370]">{variant.hex}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[18px] font-bold text-[#1F1F22]">{variant.name}</p>
                      <p className="text-[13px] font-semibold text-[#5F6370]">{variant.value}</p>
                    </div>
                    <div className="text-right">
                      {variant.primary && <span className="mb-2 inline-flex rounded-[3px] bg-[#9E3659] px-3 py-1 text-[11px] font-bold text-white">PRINCIPAL</span>}
                      <p className="text-[13px] font-semibold text-[#5F6370]">{variant.active ? "Activa" : "Inactiva"}</p>
                      <p className="text-[16px] font-bold text-[#1F1F22]">{variant.price}</p>
                    </div>
                    <Link
                      href={`/admin/productos/${product.documentId}/variantes/${variant.href}/editar`}
                      aria-label={`Editar variante ${variant.name}`}
                      className="text-[#5F6370] hover:text-[#9E3659]"
                    >
                      <MoreVertical size={21} strokeWidth={2} />
                    </Link>
                  </div>
                ))}
                <div className="rounded-[6px] border-2 border-dashed border-[#C8CEDB] p-5">
                  <p className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#4B4E5A]"><CirclePlus size={20} />Añadir Nueva Combinación</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <input form="new-variant-form" name="label" placeholder="Etiqueta: Tono / Tamaño" className="h-11 rounded-[4px] border border-[#C8CEDB] px-3 text-[14px] outline-none" />
                    <label className="flex h-11 items-center gap-3 rounded-[4px] border border-[#C8CEDB] px-3 text-[13px] font-semibold text-[#5F6370]">Color <input form="new-variant-form" name="value" type="color" defaultValue="#9E3659" className="h-8 w-12 cursor-pointer bg-transparent" /></label>
                    <input form="new-variant-form" name="price_override" placeholder="Precio opcional" className="h-11 rounded-[4px] border border-[#C8CEDB] px-3 text-[14px] outline-none" />
                  </div>
                  <div className="mt-4">
                    <ProductImagePicker compact inputForm="new-variant-form" />
                  </div>
                  <button form="new-variant-form" className="mt-4 h-11 rounded-[6px] bg-[#9E3659] px-5 text-[14px] font-bold text-white hover:bg-[#84304C]">Guardar Variante</button>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <ImageIcon size={22} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[20px] font-bold text-[#1F1F22]">Galería de Imágenes</h3>
              </div>
              <ProductImagePicker existingImages={existingImages} compact />
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <BadgeDollarSign size={25} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Precio & SKU</h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <FieldLabel>Precio Base (USD)</FieldLabel>
                  <div className="flex h-13 items-center rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-4">
                    <span className="mr-3 text-[17px] font-bold">$</span>
                    <input name="price" defaultValue={String(product.price)} className="min-w-0 flex-1 bg-transparent text-[15px] font-bold outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>SKU Principal</FieldLabel>
                  <div className="flex h-13 overflow-hidden rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4]">
                    <input name="sku" defaultValue={product.slug} className="min-w-0 flex-1 bg-transparent px-5 text-[15px] outline-none" />
                    <button className="w-12 border-l border-[#C8CEDB] text-[#1F1F22]" aria-label="Regenerar SKU">
                      <RefreshCw size={20} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <CloudUpload size={25} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Publicación</h3>
              </div>
              <div className="space-y-5">
                <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4">
                  <span>
                    <span className="block text-[15px] font-bold text-[#1F1F22]">Estado Activo</span>
                    <span className="text-[13px] text-[#4B4E5A]">Visible en la tienda pública</span>
                  </span>
                  <input type="checkbox" name="active" defaultChecked={product.active} className="h-6 w-6 accent-[#9E3659]" />
                </label>
                <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4">
                  <span>
                    <span className="block text-[15px] font-bold text-[#1F1F22]">Destacado</span>
                    <span className="text-[13px] text-[#4B4E5A]">Producto destacado</span>
                  </span>
                  <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-6 w-6 accent-[#9E3659]" />
                </label>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[14px] text-[#4B4E5A]">
                <History size={16} strokeWidth={1.8} />
                Sin registros de actividad
              </p>
            </section>
          </aside>
        </div>
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
