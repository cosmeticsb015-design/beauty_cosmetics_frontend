import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Save } from "lucide-react";
import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import AdminFlash from "@/src/features/admin/components/AdminFlash";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import { saveBranchInventoryForm } from "@/src/features/admin/actions";
import { getAdminBranch, getAdminProduct, type StrapiStock } from "@/src/shared/services/admin";

function stockStatus(quantity: number) {
  if (quantity <= 0) return { label: "SIN STOCK", className: "bg-red-100 text-red-700", unitTone: "text-red-700" };
  if (quantity <= 10) return { label: "BAJO", className: "bg-orange-100 text-orange-700", unitTone: "text-orange-600" };
  return { label: "Disponible", className: "bg-emerald-100 text-emerald-700", unitTone: "text-[#1F1F22]" };
}

export default async function BranchInventoryPage({ params, searchParams }: { params: Promise<{ id: string; branch: string }>; searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const { id, branch: branchId } = await params;
  const query = searchParams ? await searchParams : {};

  try {
    const [productResponse, branchResponse] = await Promise.all([getAdminProduct(id), getAdminBranch(branchId)]);
    const product = productResponse.data;
    const branch = branchResponse.data;
    const variants = (product.variants ?? []).map((variant) => {
      const stock = (variant.stocks ?? []).find((item: StrapiStock) => item.branch?.documentId === branch.documentId);
      const quantity = stock?.quantity ?? 0;
      const status = stockStatus(quantity);
      return { variant, stock, quantity, status };
    });

    return (
      <AdminShell active="products" searchPlaceholder="Buscar productos...">
        <form action={saveBranchInventoryForm} className="mx-auto w-full max-w-[1130px] px-4 py-10 md:px-8">
          <AdminFlash notice={noticeFromQuery(query, "Inventario guardado correctamente.")} />
          <input type="hidden" name="product" value={product.documentId} />
          <input type="hidden" name="branch" value={branch.documentId} />

          <Link href={`/admin/productos/${product.documentId}/editar`} className="mb-5 inline-flex items-center gap-2 text-[15px] font-semibold text-[#5F6370] hover:text-[#9E3659]">
            <ArrowLeft size={18} strokeWidth={2} />
            Volver al producto
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-[34px] font-bold leading-tight text-[#1F1F22]">Detalle de Inventario: {branch.name}</h2>
              <p className="mt-1 text-[19px] text-[#5F6370]">Monitoreo y edición de stock por variante para {product.name}</p>
            </div>
            <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[8px] bg-[#9E3659] px-7 text-[15px] font-bold text-white hover:bg-[#84304C]">
              <Save size={18} strokeWidth={2} />
              Guardar Stock
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[390px_1fr]">
            <aside className="space-y-6">
              <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-8">
                <h3 className="text-[28px] font-bold text-[#1F1F22]">{branch.name}</h3>
                <p className="mt-2 flex items-center gap-2 text-[18px] text-[#4B4E5A]">
                  <MapPin size={19} strokeWidth={1.8} />
                  {branch.address}
                </p>
                <Link
                  href={`/admin/sucursales/${branch.documentId}`}
                  className="mt-7 flex h-12 w-full items-center justify-center rounded-[4px] border border-[#6B7280] text-[17px] font-bold text-[#4B4E5A] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]"
                >
                  Ver Sucursal
                </Link>
              </section>

              <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-8">
                <h3 className="text-[28px] font-bold leading-tight text-[#1F1F22]">{product.name}</h3>
                <p className="mt-4 text-[18px] font-bold text-[#4B4E5A]">Slug: {product.slug}</p>
                <p className="mt-4 flex items-center gap-3 text-[16px] text-[#4B4E5A]">
                  <span className={`h-3 w-3 rounded-full ${product.active ? "bg-emerald-500" : "bg-red-500"}`} />
                  {product.active ? "Activo" : "Inactivo"}
                </p>
              </section>
            </aside>

            <section className="overflow-hidden rounded-[8px] border border-[#C8CEDB] bg-white">
              <div className="border-b border-[#C8CEDB] bg-[#F4F5F7] px-8 py-7">
                <h3 className="text-[28px] font-bold text-[#1F1F22]">Variantes de Producto</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead className="bg-[#F8F9FB] text-left text-[16px] font-bold tracking-[0.06em] text-[#4B4E5A]">
                    <tr className="border-b border-[#C8CEDB]">
                      <th className="px-8 py-6">Variante</th>
                      <th className="px-8 py-6">Stock Actual</th>
                      <th className="px-8 py-6">Estado</th>
                      <th className="px-8 py-6">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map(({ variant, stock, quantity, status }) => (
                      <tr key={variant.documentId} className="border-b border-[#C8CEDB] last:border-b-0">
                        <td className="px-8 py-7">
                          <div className="flex items-center gap-5">
                            <span className="h-12 w-12 rounded-[14px]" style={{ backgroundColor: variant.value?.startsWith("#") ? variant.value : "#9E3659" }} />
                            <div>
                              <p className="text-[18px] font-bold text-[#1F1F22]">{variant.label}</p>
                              <p className="text-[15px] text-[#5F6370]">Valor: {variant.value}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-7">
                          <input type="hidden" name={`stock_document_${variant.documentId}`} value={stock?.documentId ?? ""} />
                          <input name={`variant_stock_${variant.documentId}`} type="number" min="0" defaultValue={quantity} className={`h-12 w-28 rounded-[4px] border border-[#C8CEDB] px-4 text-[22px] font-bold outline-none focus:border-[#9E3659] ${status.unitTone}`} />
                          <span className="ml-3 text-[15px] font-semibold text-[#4B4E5A]">unidades</span>
                        </td>
                        <td className="px-8 py-7">
                          <span className={`rounded-full px-4 py-2 text-[14px] font-bold ${status.className}`}>{status.label}</span>
                        </td>
                        <td className="px-8 py-7">
                          <Link
                            href={`/admin/productos/${product.documentId}/variantes/${variant.documentId}/editar`}
                            className="text-[16px] font-bold text-blue-800 hover:text-[#9E3659]"
                          >
                            Gestionar
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {variants.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-10 text-[15px] font-semibold text-[#5F6370]">Este producto todavía no tiene variantes para asignar stock.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between bg-[#F8F9FB] px-8 py-7 text-[15px] font-semibold text-[#4B4E5A]">
                <p>Mostrando {variants.length} de {variants.length} variantes registradas</p>
                <div className="flex gap-3">
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-[#C8CEDB] text-[#9AA3B2]" aria-label="Anterior">
                    <ChevronLeft size={21} />
                  </button>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-[#C8CEDB] text-[#1F1F22]" aria-label="Siguiente">
                    <ChevronRight size={21} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </form>
      </AdminShell>
    );
  } catch (error) {
    return <AdminShell active="products" searchPlaceholder="Buscar productos..."><AdminDataError title="No se pudo cargar el detalle de inventario" error={error} permissions={["Product: findOne", "Branch: findOne", "Variant-option: find/findOne", "Branch-stock: find/findOne/update/create"]} /></AdminShell>;
  }
}
