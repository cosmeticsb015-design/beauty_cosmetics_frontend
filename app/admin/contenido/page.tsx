"use client";

import { useState } from "react";
import {
  ChevronDown,
  ImageIcon,
  ImagePlus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import AdminShell from "../components/AdminShell";

const banners = [
  {
    title: "Colección Primavera 2024",
    device: "Desktop & Mobile",
    position: "Posición 1",
    imageClass: "bg-[radial-gradient(circle_at_78%_18%,#f6b299_0_10%,transparent_11%),linear-gradient(135deg,#70463b,#f4a997_48%,#f8c8b3)]",
    variant: "bottles",
  },
  {
    title: "Lanzamiento Labial 'Velvet'",
    device: "Desktop Only",
    position: "Posición 2",
    imageClass: "bg-[radial-gradient(circle_at_62%_38%,#8d3e2e_0_13%,transparent_14%),linear-gradient(135deg,#e7837b,#e78f86_58%,#f3afa7)]",
    variant: "face",
  },
];

function BannerVisual({ imageClass, variant }: { imageClass: string; variant: string }) {
  if (variant === "face") {
    return (
      <div className={`relative h-full w-full overflow-hidden ${imageClass}`}>
        <div className="absolute left-[34%] top-5 h-28 w-24 rounded-full bg-[#8B3E2F]" />
        <div className="absolute left-[31%] top-10 h-28 w-28 rounded-full bg-[#9B4D38]" />
        <div className="absolute left-[36%] top-12 h-24 w-20 rounded-full bg-[#C87958]" />
        <div className="absolute left-[43%] top-[76px] h-3 w-8 rounded-full bg-[#A51D45]" />
        <div className="absolute bottom-0 right-16 h-16 w-7 rounded-t-full bg-[#C15074]" />
        <div className="absolute bottom-0 right-12 h-9 w-10 bg-[#2D1F23]" />
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${imageClass}`}>
      <div className="absolute bottom-0 left-[18%] h-16 w-40 rounded-t-full bg-[#F2C7B7]" />
      <div className="absolute bottom-14 left-[30%] h-20 w-12 rounded-[5px] bg-white/85 shadow-md" />
      <div className="absolute bottom-14 left-[46%] h-24 w-10 rounded-[5px] bg-white/80 shadow-md" />
      <div className="absolute bottom-14 left-[59%] h-24 w-10 rounded-[5px] bg-white/80 shadow-md" />
      <div className="absolute bottom-36 left-[49%] h-8 w-4 rounded-full bg-[#7D3B2C]" />
      <div className="absolute bottom-36 left-[62%] h-8 w-4 rounded-full bg-[#2D1F23]" />
      <div className="absolute bottom-14 left-[22%] h-14 w-16 rounded-[8px] bg-[#F5DFD4] shadow-md" />
    </div>
  );
}

export default function AdminContentPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <AdminShell active="content">
      <main className={`mx-auto w-full max-w-[1100px] px-4 py-16 md:px-8 ${modalOpen ? "blur-[2px]" : ""}`}>
        <div>
          <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
          <h2 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Banners del Home</h2>
          <p className="mt-1 text-[17px] text-[#6B6063]">
            Administra el carrusel principal y promociones temporales.
          </p>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-3">
          {banners.map((banner) => (
            <article key={banner.title} className="overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white">
              <div className="relative h-[150px]">
                <BannerVisual imageClass={banner.imageClass} variant={banner.variant} />
                <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[13px] font-medium text-[#9E3659] shadow-sm">
                  {banner.position}
                </span>
              </div>

              <div className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1F1F22]">{banner.title}</h3>
                    <p className="mt-1 text-[14px] text-[#6B6063]">{banner.device} • Activo</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button aria-label={`Editar ${banner.title}`} className="text-[#5F5F61] transition-colors hover:text-[#9E3659]">
                      <Pencil size={20} strokeWidth={2} />
                    </button>
                    <button aria-label={`Eliminar ${banner.title}`} className="text-red-600 transition-colors hover:text-red-700">
                      <Trash2 size={20} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-1 w-full rounded-full bg-emerald-700" />
                  <span className="text-[14px] text-emerald-700">Visible</span>
                </div>
              </div>
            </article>
          ))}

          <button
            onClick={() => setModalOpen(true)}
            className="flex min-h-[260px] flex-col items-center justify-center gap-5 rounded-[8px] border-2 border-dashed border-[#E7BFC9] bg-white text-[#6B6063] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]"
          >
            <ImagePlus size={46} strokeWidth={1.8} />
            <span className="text-[17px]">Añadir espacio publicitario</span>
          </button>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8">
          <div className="max-h-[92vh] w-full max-w-[1180px] overflow-y-auto rounded-[14px] border border-[#C8CEDB] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#C8CEDB] px-9 py-8">
              <h3 className="text-[40px] font-bold leading-tight text-[#7A2608]">Añadir Nuevo Banner</h3>
              <button
                aria-label="Cerrar modal"
                onClick={() => setModalOpen(false)}
                className="text-[#374151] transition-colors hover:text-[#7A2608]"
              >
                <X size={34} strokeWidth={1.8} />
              </button>
            </div>

            <div className="px-9 py-9">
              <section>
                <h4 className="text-[22px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">Visualización de Banner</h4>
                <div className="mt-5 flex min-h-[330px] flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-[#BFC4D4] bg-[#F1F2F4] text-[#3F4450]">
                  <ImageIcon size={42} strokeWidth={1.8} />
                  <p className="mt-4 text-[24px]">Recomendado: 1920×600px (Desktop)</p>
                  <button className="mt-8 h-14 rounded-[4px] border border-[#6B7280] bg-white px-10 text-[21px] font-bold tracking-wide text-[#1F1F22] transition-colors hover:border-[#7A2608] hover:text-[#7A2608]">
                    Subir Imagen
                  </button>
                </div>
              </section>

              <div className="mt-9 grid gap-8 lg:grid-cols-2">
                <label className="block">
                  <span className="text-[22px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">Nombre del Banner</span>
                  <input
                    placeholder="Ej: Colección Verano 2024"
                    className="mt-4 h-16 w-full rounded-[4px] border border-[#C8CEDB] px-5 text-[26px] outline-none placeholder:text-[#6B7280] focus:border-[#9E3659]"
                  />
                </label>

                <label className="block">
                  <span className="text-[22px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">Posición en Home</span>
                  <div className="relative mt-4">
                    <select className="h-16 w-full appearance-none rounded-[4px] border border-[#C8CEDB] bg-white px-5 text-[24px] outline-none focus:border-[#9E3659]">
                      <option>Posición 1 (Principal)</option>
                      <option>Posición 2</option>
                      <option>Posición 3</option>
                    </select>
                    <ChevronDown
                      size={30}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[#3F4450]"
                    />
                  </div>
                </label>
              </div>

              <label className="mt-9 block">
                <span className="text-[22px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">URL de Destino / Link</span>
                <div className="mt-4 flex h-16 overflow-hidden rounded-[4px] border border-[#C8CEDB] focus-within:border-[#9E3659]">
                  <span className="flex items-center border-r border-[#C8CEDB] bg-[#EEF0F3] px-7 text-[24px] text-[#374151]">
                    https://
                  </span>
                  <input
                    placeholder="luxecosmetics.com/coleccion-verano"
                    className="min-w-0 flex-1 px-5 text-[24px] outline-none placeholder:text-[#6B7280]"
                  />
                </div>
              </label>

              <div className="mt-10 grid gap-8 lg:grid-cols-2">
                <section>
                  <h4 className="text-[22px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">Dispositivos</h4>
                  <div className="mt-5 flex flex-wrap gap-8">
                    {["Desktop", "Mobile"].map((device) => (
                      <label key={device} className="flex items-center gap-4 text-[24px] text-[#1F1F22]">
                        <input type="checkbox" defaultChecked className="h-8 w-8 accent-[#7A2608]" />
                        {device}
                      </label>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-[22px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">Estado de Publicación</h4>
                  <div className="mt-6 flex items-center gap-5 text-[24px]">
                    <span className="text-[#3F4450]">Inactivo</span>
                    <button className="relative h-10 w-20 rounded-full bg-[#C3C5D4]" aria-label="Activar publicación">
                      <span className="absolute left-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white" />
                    </button>
                    <span className="font-bold text-[#7A2608]">Activo</span>
                  </div>
                </section>
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-[#C8CEDB] bg-[#F1F2F4] px-9 py-8 sm:flex-row sm:justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="h-16 min-w-[200px] rounded-[4px] border border-[#6B7280] bg-white px-10 text-[21px] font-bold text-[#1F1F22] transition-colors hover:border-[#7A2608] hover:text-[#7A2608]"
              >
                Cancelar
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="h-16 min-w-[260px] rounded-[4px] bg-[#7A2608] px-10 text-[21px] font-bold text-white shadow-lg transition-colors hover:bg-[#5F1E07]"
              >
                Guardar Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
