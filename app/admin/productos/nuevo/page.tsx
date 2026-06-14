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
  Upload,
  History,
} from "lucide-react";
import AdminShell from "../../components/AdminShell";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[15px] font-bold tracking-wide text-[#4B4E5A]">{children}</label>;
}

export default function NewProductPage() {
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 md:px-8">
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
                    placeholder="Ej. Velvet Rose Elixir"
                    className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 text-[15px] outline-none placeholder:text-[#7A7F8A] focus:border-[#9E3659]"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Categoría</FieldLabel>
                  <div className="relative">
                    <select className="h-12 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-white px-4 text-[15px] outline-none focus:border-[#9E3659]">
                      <option>Seleccionar categoría</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Marca</FieldLabel>
                  <div className="relative">
                    <select className="h-12 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-white px-4 text-[15px] outline-none focus:border-[#9E3659]">
                      <option>Seleccionar marca</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Slug</FieldLabel>
                  <input
                    placeholder="Ej. velvet-rose"
                    className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 text-[15px] outline-none placeholder:text-[#7A7F8A] focus:border-[#9E3659]"
                  />
                </div>
              </div>

              <div className="mt-24 space-y-2">
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                  placeholder="Escribe una descripción detallada que resalte los beneficios y componentes..."
                  className="min-h-[115px] w-full resize-none rounded-[4px] border border-[#C8CEDB] px-4 py-3 text-[15px] outline-none placeholder:text-[#7A7F8A] focus:border-[#9E3659]"
                />
              </div>
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
                <Link
                  href="/admin/productos/nuevo/variante"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#CFE1FA] px-7 text-[15px] font-bold tracking-wide text-[#5F6D82] transition-colors hover:bg-[#BCD4F4]"
                >
                  <CirclePlus size={22} strokeWidth={2} />
                  Añadir Nueva Variante
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
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Imagen Principal</p>
              <div className="mt-3 flex h-[150px] flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#DFE3EA] text-[#9AA3B2]">
                <Upload size={34} strokeWidth={1.8} />
                <p className="mt-3 text-[15px]">Sube la imagen</p>
              </div>

              <p className="mt-5 text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Adicionales</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="flex h-[150px] items-center justify-center rounded-[4px] border-2 border-dashed border-[#DFE3EA] text-[24px] text-[#9E3659]">
                  +
                </button>
                <div className="h-[150px] rounded-[8px] bg-[#F8F8F9]" />
              </div>
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
                    <input placeholder="0.00" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#7A7F8A]" />
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
                {[
                  ["Estado Activo", "Visible en la tienda pública"],
                  ["Destacado", "Producto destacado"],
                ].map(([title, subtitle]) => (
                  <div key={title} className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4">
                    <div>
                      <p className="text-[15px] font-bold text-[#1F1F22]">{title}</p>
                      <p className="text-[13px] text-[#4B4E5A]">{subtitle}</p>
                    </div>
                    <button aria-label={title} className="relative h-8 w-14 rounded-full bg-[#C3C5D4]">
                      <span className="absolute left-1.5 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-5 flex items-center gap-2 text-[14px] text-[#4B4E5A]">
                <History size={16} strokeWidth={1.8} />
                Sin registros de actividad
              </p>
            </section>
          </aside>
        </div>
      </main>
    </AdminShell>
  );
}
