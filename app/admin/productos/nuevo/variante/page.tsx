// RUTA: app/admin/productos/nuevo/variante/page.tsx
import Link from "next/link";
import { ArrowLeft, CircleDollarSign, Info, Save, SlidersHorizontal } from "lucide-react";
import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import { saveVariantForm } from "@/src/features/admin/actions";
import { getAdminBranches, getAdminProduct } from "@/src/shared/services/admin";
import ProductImagePicker from "@/src/features/admin/productos/components/ProductImagePicker";
import VariantValuePicker from "../../components/VariantValuePicker";

export default async function NewVariantPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product: productId } = await searchParams;

  if (!productId) {
    return (
      <AdminShell active="products" searchPlaceholder="Buscar productos...">
        <main className="mx-auto w-full max-w-[900px] px-4 py-12 md:px-8">
          <Link href="/admin/productos/nuevo" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#5F6370] hover:text-[#9E3659]"><ArrowLeft size={18} />Volver al producto</Link>
          <section className="mt-8 rounded-[10px] border border-[#E7BFC9] bg-white p-8">
            <h2 className="text-[33px] font-bold leading-tight text-[#7D123B]">Crear Nueva Variante</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-[#6B6063]">Primero guarda el producto base para que Strapi genere su <strong>documentId</strong>. La información que estás llenando en “Añadir Nuevo Producto” se conserva localmente al volver hasta que presiones guardar.</p>
            <Link href="/admin/productos/nuevo" className="mt-7 inline-flex h-12 items-center justify-center rounded-[8px] bg-[#7D123B] px-7 text-[15px] font-bold text-white hover:bg-[#681032]">Volver y guardar producto</Link>
          </section>
        </main>
      </AdminShell>
    );
  }

  try {
    const [productResponse, branchesResponse] = await Promise.all([getAdminProduct(productId), getAdminBranches({ pageSize: 100 })]);
    const product = productResponse.data;
    return (
      <AdminShell active="products" searchPlaceholder="Buscar productos...">
        <form action={saveVariantForm} className="mx-auto w-full max-w-[1100px] px-4 pb-28 pt-10 md:px-8">
          <input type="hidden" name="product" value={product.documentId} />
          <Link href={`/admin/productos/${product.documentId}/editar`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#5F6370] hover:text-[#9E3659]"><ArrowLeft size={18} />Volver al producto</Link>
          <h2 className="mt-3 text-[33px] font-bold leading-tight text-[#7D123B]">Crear Nueva Variante</h2>
          <p className="mt-1 text-[19px] text-[#6B6063]">Configure los detalles específicos, colores y precios de la nueva variante de {product.name}.</p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="space-y-8">
              <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-6">
                <h3 className="text-[26px] font-bold text-[#1F1F22]">Producto Relacionado</h3>
                <div className="mt-5 rounded-[8px] border border-[#E7BFC9] bg-[#F7F4F4] p-5"><h4 className="text-[20px] font-bold text-[#1F1F22]">{product.name}</h4><p className="mt-1 text-[14px] text-[#6B6063]">{product.slug}</p></div>
              </section>
              <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-6">
                <h3 className="text-[26px] font-bold text-[#1F1F22]">Multimedia de la Variante</h3>
                <div className="mt-5"><ProductImagePicker /></div>
              </section>
            </div>

            <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
              <div className="mb-9 flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]"><SlidersHorizontal size={24} /></span><div><h3 className="text-[26px] font-bold text-[#1F1F22]">Detalles de la Variante</h3><p className="text-[15px] text-[#6B6063]">Personalización y atributos visuales</p></div></div>
              <div className="space-y-7">
                <label className="block"><span className="text-[15px] font-bold tracking-wide text-[#6B6063]">Nombre de la Variante (Label)</span><input name="label" required placeholder="Ej. Rosa Intenso" className="mt-3 h-14 w-full rounded-[8px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[18px] outline-none focus:border-[#9E3659]" /></label>
                <VariantValuePicker required label="Valor" />
                <label className="block"><span className="text-[15px] font-bold tracking-wide text-[#6B6063]">Precio Específico (Override)</span><span className="mt-3 flex h-14 items-center rounded-[8px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 focus-within:border-[#9E3659]"><CircleDollarSign size={22} className="mr-3 text-[#6B6063]" /><input name="price_override" placeholder={String(product.price)} className="min-w-0 flex-1 bg-transparent text-[18px] outline-none" /></span></label>
                <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4"><span><span className="block text-[15px] font-bold text-[#1F1F22]">Variante Activa</span><span className="text-[13px] text-[#4B4E5A]">Visible en tienda</span></span><input type="checkbox" name="active" defaultChecked className="h-6 w-6 accent-[#9E3659]" /></label>
                <section className="rounded-[8px] border border-[#E7BFC9] p-5"><h4 className="text-[18px] font-bold text-[#1F1F22]">Stock inicial por sucursal</h4><div className="mt-4 grid gap-3 md:grid-cols-2">{branchesResponse.data.map((branch) => <label key={branch.documentId} className="rounded-[6px] bg-[#F8F9FB] p-3"><span className="block text-[13px] font-bold text-[#1F1F22]">{branch.name}</span><input name={`branch_stock_${branch.documentId}`} type="number" min="0" defaultValue="0" className="mt-2 h-10 w-full rounded border border-[#C8CEDB] px-3 font-bold" /></label>)}</div></section>
                <div className="flex gap-5 rounded-[8px] bg-[#FCEDF0] p-6 text-[#7D123B]"><Info size={26} className="shrink-0" /><p className="text-[15px] leading-relaxed text-[#5C4B50]">Al guardar, se crea la variante en Strapi, se suben imágenes y se crean/actualizan sus branch-stocks.</p></div>
                <button className="inline-flex h-12 min-w-[230px] items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-7 text-[15px] font-bold text-white shadow-md transition-colors hover:bg-[#681032]"><Save size={17} />Guardar Variante</button>
              </div>
            </section>
          </div>
        </form>
      </AdminShell>
    );
  } catch (error) {
    return <AdminShell active="products"><AdminDataError title="No se pudo cargar la creación de variante" error={error} permissions={["Product: findOne", "Branch: find", "Variant-option: create", "Branch-stock: create"]} /></AdminShell>;
  }
}