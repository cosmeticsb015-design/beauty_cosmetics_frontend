import Link from "next/link";
import {
  BadgeDollarSign,
  ChevronDown,
  CirclePlus,
  CloudUpload,
  ImageIcon,
  Info,
  Layers3,
  Save,
  Settings,
  History,
  ShoppingBag,
} from "lucide-react";
import AdminShell from "../../components/AdminShell";
import { saveProductForm } from "../../actions";
import { getAdminBranches, getAdminBrands, getAdminCategories } from "../../../services/admin";
import ProductImagePicker from "../components/ProductImagePicker";
import ProductDraftPersistence from "../components/ProductDraftPersistence";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[15px] font-bold tracking-wide text-[#4B4E5A]">{children}</label>;
}

export default async function NewProductPage() {
  const [brandsResponse, categoriesResponse, branchesResponse] = await Promise.all([getAdminBrands(), getAdminCategories(), getAdminBranches()]);
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <form action={saveProductForm} data-product-draft="true" className="mx-auto w-full max-w-[1180px] px-4 py-8 md:px-8">
        <ProductDraftPersistence />
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Añadir Nuevo Producto</h2>
            <p className="mt-1 text-[16px] text-[#5F6370]">Configura los detalles de tu nuevo producto de lujo.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#C8CEDB] bg-white px-8 text-[14px] font-bold tracking-wide text-[#4B4E5A] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]"
            >
              Descartar
            </Link>
            <button className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#9E3659] px-7 text-[14px] font-bold tracking-wide text-white transition-colors hover:bg-[#84304C]">
              <Save size={17} strokeWidth={2} />
              Guardar Producto
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <Info size={24} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Información General</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel>Nombre del Producto</FieldLabel>
                  <input
                    name="name"
                    placeholder="Ej. Velvet Rose Elixir"
                    className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 text-[15px] outline-none placeholder:text-[#7A7F8A] focus:border-[#9E3659]"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Categoría</FieldLabel>
                  <div className="relative">
                    <select name="category" className="h-12 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-white px-4 text-[15px] outline-none focus:border-[#9E3659]">
                      <option value="">Seleccionar categoría</option>
                      {categoriesResponse.data.map((category) => <option key={category.documentId} value={category.documentId}>{category.name}</option>)}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Marca</FieldLabel>
                  <div className="relative">
                    <select name="brand" className="h-12 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-white px-4 text-[15px] outline-none focus:border-[#9E3659]">
                      <option value="">Seleccionar marca</option>
                      {brandsResponse.data.map((brand) => <option key={brand.documentId} value={brand.documentId}>{brand.name}</option>)}
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Slug</FieldLabel>
                  <input
                    name="slug"
                    placeholder="Ej. velvet-rose"
                    className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 text-[15px] outline-none placeholder:text-[#7A7F8A] focus:border-[#9E3659]"
                  />
                </div>
              </div>

              <div className="mt-24 space-y-2">
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                  name="description"
                  placeholder="Escribe una descripción detallada que resalte los beneficios y componentes..."
                  className="min-h-[115px] w-full resize-none rounded-[4px] border border-[#C8CEDB] px-4 py-3 text-[15px] outline-none placeholder:text-[#7A7F8A] focus:border-[#9E3659]"
                />
              </div>
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <ShoppingBag size={24} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Stock por Sucursal</h3>
              </div>
              <p className="mb-5 text-[14px] text-[#5F6370]">Define el stock inicial del producto. Si no agregas variantes, este stock queda asignado a la variante automática Default / General.</p>
              {branchesResponse.data.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {branchesResponse.data.map((branch) => (
                    <label key={branch.documentId} className="rounded-[6px] border border-[#E5E7EB] bg-[#F8F9FB] p-4">
                      <span className="block text-[14px] font-bold text-[#1F1F22]">{branch.name}</span>
                      <span className="text-[12px] text-[#5F6370]">Cantidad disponible</span>
                      <input name={`branch_stock_${branch.documentId}`} type="number" min="0" defaultValue="0" className="mt-2 h-11 w-full rounded-[4px] border border-[#C8CEDB] bg-white px-3 text-[15px] font-bold outline-none focus:border-[#9E3659]" />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-[6px] border border-dashed border-[#C8CEDB] bg-[#F8F9FB] p-5 text-[14px] font-semibold text-[#5F6370]">
                  No hay sucursales creadas en Strapi. Crea una sucursal para poder asignar stock inicial.
                </div>
              )}
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Layers3 size={24} strokeWidth={2} className="text-[#9E3659]" />
                  <h3 className="text-[25px] font-bold text-[#1F1F22]">Variantes y Atributos</h3>
                </div>
                <button className="inline-flex items-center gap-2 text-[15px] font-bold tracking-wide text-[#9E3659]">
                  <Settings size={16} strokeWidth={2} />
                  Gestionar Atributos
                </button>
              </div>

              <div className="flex min-h-[145px] flex-col items-center justify-center rounded-[8px] border border-dashed border-[#C8CEDB] px-5 py-8 text-center">
                <p className="text-[16px] text-[#4B4E5A]">No se han definido variantes para este producto.</p>
                <p className="mt-2 text-[14px] text-[#5F6370]">El producto se guardará con una variante Default / General para manejar stock por sucursal.</p>
                <Link
                  href="/admin/productos/nuevo/variante"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#CFE1FA] px-7 text-[15px] font-bold tracking-wide text-[#5F6D82] transition-colors hover:bg-[#BCD4F4]"
                >
                  <CirclePlus size={22} strokeWidth={2} />
                  Añadir Nueva Variante después de guardar
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[8px] border border-[#E7E4E5] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <ImageIcon size={22} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[20px] font-bold text-[#1F1F22]">Galería de Imágenes</h3>
              </div>
<ProductImagePicker />
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <BadgeDollarSign size={25} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Precio & SKU</h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <FieldLabel>Precio Base (USD)</FieldLabel>
                  <div className="flex h-12 items-center rounded-[4px] border border-[#C8CEDB] px-4 focus-within:border-[#9E3659]">
                    <span className="mr-3 text-[17px] text-[#4B4E5A]">$</span>
                    <input name="price" placeholder="0.00" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#7A7F8A]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>SKU Principal</FieldLabel>
                  <input
                    placeholder="LX-PRD-000"
                    className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 text-[15px] outline-none placeholder:text-[#7A7F8A] focus:border-[#9E3659]"
                  />
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
                  <input type="checkbox" name="active" defaultChecked className="h-6 w-6 accent-[#9E3659]" />
                </label>
                <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4">
                  <span>
                    <span className="block text-[15px] font-bold text-[#1F1F22]">Destacado</span>
                    <span className="text-[13px] text-[#4B4E5A]">Producto destacado</span>
                  </span>
                  <input type="checkbox" name="featured" className="h-6 w-6 accent-[#9E3659]" />
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
    </AdminShell>
  );
}
