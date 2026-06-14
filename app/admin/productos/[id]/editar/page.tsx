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
import AdminShell from "../../../components/AdminShell";

const branches = [
  { name: "Sede Central Norte", status: "Disponible", stock: 84, tone: "emerald" },
  { name: "Sucursal Sur Marina", status: "Bajo Stock", stock: 12, tone: "red" },
  { name: "Plaza Luxury Mall", status: "Disponible", stock: 28, tone: "emerald" },
];

const variants = [
  { name: "Rosa Intenso", hex: "#9E3659", price: "$89.00", primary: true },
  { name: "Nude Radiance", hex: "#C19A6B", price: "$94.50", primary: false },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[15px] font-bold tracking-wide text-[#4B4E5A]">{children}</label>;
}

function ProductImage({ className, principal }: { className: string; principal?: boolean }) {
  return (
    <div className={`relative h-[120px] overflow-hidden rounded-[4px] ${className}`}>
      {principal && (
        <span className="absolute left-3 top-3 rounded-[3px] bg-[#9E3659] px-3 py-1 text-[11px] font-bold text-white">
          PRINCIPAL
        </span>
      )}
      <div className="absolute bottom-4 left-1/2 h-14 w-5 -translate-x-1/2 rounded-t-[3px] bg-white/85 shadow" />
      <div className="absolute bottom-[70px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#7A2608]/70" />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <main className="mx-auto w-full max-w-[1120px] px-4 py-10 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-[40px] font-bold leading-tight text-[#1F1F22]">Velvet Rose Elixir</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E8E8EB] px-4 py-2 text-[13px] font-semibold text-[#5F6370]">
                <span className="h-2 w-2 rounded-full bg-[#B8BBC6]" />
                inactivo
              </span>
            </div>
            <p className="mt-2 text-[16px] text-[#5F6370]">
              Modifica los detalles de &apos;Velvet Rose Elixir&apos; en el catálogo global.
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
                  <input className="h-13 w-full rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none" defaultValue="Velvet Rose Elixir" />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Categoría</FieldLabel>
                  <div className="relative">
                    <select className="h-13 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none">
                      <option>Skincare</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Marca</FieldLabel>
                  <div className="relative">
                    <select className="h-13 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none">
                      <option>LuxeEssence</option>
                    </select>
                    <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" />
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-2">
                <FieldLabel>Slug</FieldLabel>
                <input className="h-13 w-full rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 text-[15px] outline-none" defaultValue="Velvet Rose Elixir" />
              </div>

              <div className="mt-7 space-y-2">
                <FieldLabel>Descripción</FieldLabel>
                <textarea
                  className="min-h-[155px] w-full resize-none rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4] px-5 py-4 text-[15px] leading-relaxed outline-none"
                  defaultValue="Un elixir facial de prestigio mundial, infusionado con extractos puros de Rosa Damascena recolectada al amanecer. Este tratamiento avanzado ha sido formulado para transformar la textura de la piel, restaurando su luminosidad natural y proporcionando una hidratación profunda y duradera. Su arquitectura molecular ligera asegura una absorción rápida sin residuos grasos."
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
                    {branches.map((branch) => (
                      <tr key={branch.name} className="border-t border-[#C8CEDB]">
                        <td className="px-7 py-5 text-[15px] font-semibold text-[#1F1F22]">{branch.name}</td>
                        <td className="px-7 py-5">
                          <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${branch.tone === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {branch.status}
                          </span>
                        </td>
                        <td className="px-7 py-5 text-[16px] font-bold text-[#1F1F22]">{branch.stock}</td>
                        <td className="px-7 py-5 text-center">
                          <Link href="/admin/productos/velvet-rose-elixir/inventario/sede-central-norte" className="inline-flex text-[#5C4B50] hover:text-[#9E3659]" aria-label={`Ver inventario ${branch.name}`}>
                            <Eye size={22} strokeWidth={2} />
                          </Link>
                        </td>
                      </tr>
                    ))}
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
                    <p className="flex-1 text-[18px] font-bold text-[#1F1F22]">{variant.name}</p>
                    <div className="text-right">
                      {variant.primary && <span className="mb-2 inline-flex rounded-[3px] bg-[#9E3659] px-3 py-1 text-[11px] font-bold text-white">PRINCIPAL</span>}
                      <p className="text-[16px] font-bold text-[#1F1F22]">{variant.price}</p>
                    </div>
                    <Link
                      href="/admin/productos/velvet-rose-elixir/variantes/rosa-intenso/editar"
                      aria-label={`Editar variante ${variant.name}`}
                      className="text-[#5F6370] hover:text-[#9E3659]"
                    >
                      <MoreVertical size={21} strokeWidth={2} />
                    </Link>
                  </div>
                ))}
                <Link href="/admin/productos/nuevo/variante" className="flex h-14 items-center justify-center gap-3 rounded-[6px] border-2 border-dashed border-[#C8CEDB] text-[15px] font-bold text-[#4B4E5A] hover:border-[#9E3659] hover:text-[#9E3659]">
                  <CirclePlus size={22} strokeWidth={2} />
                  Añadir Nueva Combinación
                </Link>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-7">
              <div className="mb-6 flex items-center gap-3">
                <ImageIcon size={22} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[20px] font-bold text-[#1F1F22]">Galería de Imágenes</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ProductImage principal className="bg-[linear-gradient(135deg,#e8c48b,#fff2dc_55%,#9b672b)]" />
                <div className="h-[120px] rounded-[4px] bg-[radial-gradient(circle,#fff2ed,#e58477_45%,#c95b55)]" />
                <button className="flex h-[120px] flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#C8CEDB] text-[#5F6370]">
                  <Camera size={28} strokeWidth={2} />
                  <span className="mt-1 text-[13px]">Añadir</span>
                </button>
                <div className="flex h-[120px] items-center justify-center rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] text-[#A0A5B2]">
                  <ImageIcon size={28} strokeWidth={1.8} />
                </div>
              </div>
              <p className="mt-5 text-[13px] font-semibold text-[#5F6370]">Recomendado: 1080×1080px (JPG/PNG)</p>
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
                    <input defaultValue="89.00" className="min-w-0 flex-1 bg-transparent text-[15px] font-bold outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>SKU Principal</FieldLabel>
                  <div className="flex h-13 overflow-hidden rounded-[4px] border border-[#C8CEDB] bg-[#F1F2F4]">
                    <input defaultValue="LUX-SER-001" className="min-w-0 flex-1 bg-transparent px-5 text-[15px] outline-none" />
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
