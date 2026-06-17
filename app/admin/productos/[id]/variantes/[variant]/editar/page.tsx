import Link from "next/link";
import {
  ArrowLeft,
  BadgeDollarSign,
  Box,
  CheckCircle2,
  CloudUpload,
  Save,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import AdminShell from "../../../../../components/AdminShell";
import AdminDataError from "../../../../../components/AdminDataError";
import AdminFlash from "../../../../../components/AdminFlash";
import { noticeFromQuery } from "../../../../../components/AdminFlash.utils";
import { saveVariantForm } from "../../../../../actions";
import { getAdminBranches, getAdminVariant, getStrapiMediaUrl } from "../../../../../../services/admin";
import ProductImagePicker from "../../../../components/ProductImagePicker";

function stockState(quantity: number) {
  if (quantity <= 0) return { label: "Sin Stock", classes: "bg-red-100 text-red-700" };
  if (quantity <= 10) return { label: "Bajo Stock", classes: "bg-orange-100 text-orange-700" };
  return { label: "Disponible", classes: "bg-emerald-100 text-emerald-700" };
}

export default async function EditVariantPage({ params, searchParams }: { params: Promise<{ id: string; variant: string }>; searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const { id, variant: variantId } = await params;
  const query = searchParams ? await searchParams : {};

  try {
    const [response, branchesResponse] = await Promise.all([getAdminVariant(variantId), getAdminBranches({ pageSize: 100 })]);
    const variant = response.data;
    const product = variant.product;
    const existingImages = (variant.images ?? []).map((item) => getStrapiMediaUrl(item.image?.url)).filter(Boolean) as string[];
    const stockByBranch = new Map((variant.stocks ?? []).map((stock) => [stock.branch?.documentId, stock]));
    const stockRows = branchesResponse.data.map((branch) => ({ branch, stock: stockByBranch.get(branch.documentId) }));
    const displayPrice = variant.price_override || product?.price || "";

    return (
      <AdminShell active="products" searchPlaceholder="Buscar productos...">
        <form action={saveVariantForm} className="mx-auto w-full max-w-[1120px] px-4 py-10 md:px-8">
          <AdminFlash notice={noticeFromQuery(query, "Variante guardada correctamente.")} />
          <input type="hidden" name="id" value={variant.documentId} />
          <input type="hidden" name="product" value={product?.documentId ?? id} />

          <Link href={`/admin/productos/${product?.documentId ?? id}/editar`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#5F6370] hover:text-[#9E3659]">
            <ArrowLeft size={18} strokeWidth={2} />
            Volver al producto
          </Link>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-[38px] font-bold leading-tight text-[#1F1F22]">Editar Variante</h2>
                <span className="rounded-full bg-[#FCEDF0] px-4 py-2 text-[13px] font-bold text-[#9E3659]">{variant.label}</span>
              </div>
              <p className="mt-2 text-[18px] text-[#5F6370]">
                Ajusta atributos, precio, multimedia e inventario para esta variante de {product?.name ?? "producto"}.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={`/admin/productos/${product?.documentId ?? id}/editar`} className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#C8CEDB] px-8 text-[14px] font-bold text-[#4B4E5A] hover:border-[#9E3659] hover:text-[#9E3659]">
                Cancelar
              </Link>
              <button className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#9E3659] px-7 text-[14px] font-bold text-white hover:bg-[#84304C]">
                <Save size={17} strokeWidth={2} />
                Guardar Variante
              </button>
            </div>
          </div>

          <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_340px]">
            <div className="space-y-7">
              <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
                <div className="mb-7 flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                    <SlidersHorizontal size={24} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-[25px] font-bold text-[#1F1F22]">Identidad de Variante</h3>
                    <p className="text-[15px] text-[#5F6370]">Nombre comercial y atributos visibles</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="text-[15px] font-bold text-[#4B4E5A]">Nombre de Variante</span>
                    <input name="label" defaultValue={variant.label} className="mt-3 h-13 w-full rounded-[6px] border border-[#C8CEDB] bg-[#F8F9FB] px-5 text-[17px] outline-none focus:border-[#9E3659]" />
                  </label>
                  <label className="block">
                    <span className="text-[15px] font-bold text-[#4B4E5A]">Valor / Etiqueta Pública</span>
                    <input name="value" defaultValue={variant.value} className="mt-3 h-13 w-full rounded-[6px] border border-[#C8CEDB] bg-[#F8F9FB] px-5 text-[17px] outline-none focus:border-[#9E3659]" />
                  </label>
                </div>

                <p className="mt-5 rounded-[8px] bg-[#FFFCFC] p-4 text-[14px] leading-relaxed text-[#6B6063]">
                  El backend usa <strong>label</strong> y <strong>value</strong> para representar variantes. Si el valor es un color HEX, también se refleja visualmente en el listado del producto.
                </p>
              </section>

              <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
                <div className="mb-7 flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                    <CloudUpload size={24} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-[25px] font-bold text-[#1F1F22]">Multimedia y Presentación</h3>
                    <p className="text-[15px] text-[#5F6370]">Imágenes específicas para esta variante</p>
                  </div>
                </div>

                <ProductImagePicker existingImages={existingImages} />
              </section>

              <section className="overflow-hidden rounded-[10px] border border-[#E7BFC9] bg-white">
                <div className="flex items-center gap-4 px-7 py-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                    <Box size={24} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-[25px] font-bold text-[#1F1F22]">Stock por Sucursal</h3>
                    <p className="text-[15px] text-[#5F6370]">Lectura operativa de disponibilidad desde branch-stock</p>
                  </div>
                </div>
                <table className="w-full border-collapse">
                  <tbody>
                    {stockRows.map((row) => {
                      const quantity = row.stock?.quantity ?? 0;
                      const state = stockState(quantity);
                      return (
                        <tr key={row.branch.documentId} className="border-t border-[#E7BFC9]">
                          <td className="px-7 py-5 text-[16px] font-semibold text-[#1F1F22]">{row.branch.name}</td>
                          <td className="px-7 py-5">
                            <input type="hidden" name={`stock_document_${row.branch.documentId}`} value={row.stock?.documentId ?? ""} />
                            <input name={`branch_stock_${row.branch.documentId}`} type="number" min="0" defaultValue={quantity} className="h-10 w-24 rounded-[4px] border border-[#C8CEDB] px-3 text-[15px] font-bold outline-none focus:border-[#9E3659]" />
                          </td>
                          <td className="px-7 py-5">
                            <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${state.classes}`}>{state.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            </div>

            <aside className="space-y-7">
              <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
                <div className="flex items-center gap-3">
                  <BadgeDollarSign size={26} strokeWidth={2} className="text-[#9E3659]" />
                  <h3 className="text-[25px] font-bold text-[#1F1F22]">Precio & Estado</h3>
                </div>
                <label className="mt-7 block">
                  <span className="text-[15px] font-bold text-[#4B4E5A]">Precio override</span>
                  <input name="price_override" defaultValue={String(displayPrice)} className="mt-3 h-13 w-full rounded-[6px] border border-[#C8CEDB] bg-[#F8F9FB] px-5 text-[18px] font-bold outline-none focus:border-[#9E3659]" />
                </label>

                <label className="mt-7 flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4">
                  <div>
                    <p className="text-[15px] font-bold text-[#1F1F22]">Variante Activa</p>
                    <p className="text-[13px] text-[#4B4E5A]">Visible en tienda</p>
                  </div>
                  <input type="checkbox" name="active" defaultChecked={variant.active !== false} className="h-6 w-6 accent-[#9E3659]" />
                </label>
              </section>

              <section className="rounded-[10px] border border-[#E7BFC9] bg-[#FCEDF0] p-7">
                <div className="flex gap-4">
                  <Sparkles size={26} strokeWidth={2} className="shrink-0 text-[#9E3659]" />
                  <div>
                    <h3 className="text-[20px] font-bold text-[#7D123B]">Sugerencia de Catálogo</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#5C4B50]">
                      Mantén el nombre corto y usa la galería para diferenciar acabados. Esto ayuda a que la variante sea clara en cards y checkout.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[10px] border border-emerald-200 bg-emerald-50 p-7">
                <div className="flex items-center gap-3 text-emerald-700">
                  <CheckCircle2 size={24} strokeWidth={2} />
                  <h3 className="text-[19px] font-bold">Lista para publicar</h3>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-emerald-800">
                  Esta variante queda sincronizada con Strapi al guardar: datos básicos, precio, estado e imágenes.
                </p>
              </section>
            </aside>
          </div>
        </form>
      </AdminShell>
    );
  } catch (error) {
    return (
      <AdminShell active="products" searchPlaceholder="Buscar productos...">
        <AdminDataError title="No se pudo cargar la variante desde Strapi" error={error} permissions={["Variant-option: find/findOne/update", "Product-image: find/findOne/create", "Media Library: upload", "Branch-stock: find/findOne"]} />
      </AdminShell>
    );
  }
}
