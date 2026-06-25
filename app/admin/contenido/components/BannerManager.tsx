"use client";
// RUTA: src/features/admin/contenido/components/BannerManager.tsx

import { Edit2, ImageIcon, Link2, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteBannerForm } from "@/src/features/admin/actions";
import BannerImageField from "./BannerImageField";
import type { StrapiHomeBanner } from "@/src/shared/services/admin";

export type EditableBanner = Partial<StrapiHomeBanner> & {
  // Posición estable dentro de TODOS los banners (incluyendo el slot "nuevo
  // banner"). Es lo que se usa para nombrar los inputs banner_*_<editorIndex>
  // que lee saveStoreConfig en actions.ts, así que debe mantenerse igual
  // tanto si el banner se muestra en el editor activo como si va oculto.
  editorIndex: number;
  desktopUrl?: string | null;
  mobileUrl?: string | null;
};

const scopeLabel: Record<StrapiHomeBanner["display_scope"], string> = {
  desktop_and_mobile: "Desktop & Mobile",
  desktop_only: "Desktop Only",
  mobile_only: "Mobile Only",
};

function HiddenBannerFields({ banner }: { banner: EditableBanner }) {
  const index = banner.editorIndex;
  return (
    <div className="hidden">
      <input type="hidden" name={`banner_id_${index}`} value={banner.id ?? ""} />
      <input type="hidden" name={`banner_desktop_existing_${index}`} value={banner.desktop_image?.id ?? ""} />
      <input type="hidden" name={`banner_mobile_existing_${index}`} value={banner.mobile_image?.id ?? ""} />
      <input type="hidden" name={`banner_name_${index}`} value={banner.name ?? ""} />
      <input type="hidden" name={`banner_position_${index}`} value={banner.home_position ?? index + 1} />
      <input type="hidden" name={`banner_url_${index}`} value={banner.destination_url ?? ""} />
      <input type="hidden" name={`banner_scope_${index}`} value={banner.display_scope ?? "desktop_and_mobile"} />
      {banner.active !== false ? <input type="hidden" name={`banner_active_${index}`} value="true" /> : null}
    </div>
  );
}

function BannerEditor({ banner, onClose }: { banner: EditableBanner; onClose: () => void }) {
  const index = banner.editorIndex;
  const desktopImage = banner.desktop_image;
  const mobileImage = banner.mobile_image;
  return (
    <fieldset className="rounded-[10px] border border-[#E7BFC9] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-[#7B2505]">
          {banner.id ? `Editar banner ${index + 1}` : "Añadir nuevo banner"}
        </legend>
        <div className="flex items-center gap-4">
          {banner.id ? (
            <button
              formAction={deleteBannerForm}
              name="delete_banner_id"
              value={banner.id}
              className="flex items-center gap-2 text-[13px] font-bold text-red-600 transition-colors hover:text-red-800"
            >
              <Trash2 size={15} /> Eliminar
            </button>
          ) : null}
          <button type="button" onClick={onClose} className="flex items-center gap-2 text-[13px] font-bold text-[#5F6370] transition-colors hover:text-[#1F1F22]">
            <X size={15} /> Cerrar
          </button>
        </div>
      </div>

      <input type="hidden" name={`banner_id_${index}`} value={banner.id ?? ""} />
      <input type="hidden" name={`banner_desktop_existing_${index}`} value={desktopImage?.id ?? ""} />
      <input type="hidden" name={`banner_mobile_existing_${index}`} value={mobileImage?.id ?? ""} />

      <div className="mb-6">
        <BannerImageField
          name={`banner_desktop_image_${index}`}
          existingUrl={banner.desktopUrl}
          frameLabel="Desktop"
          recommendedWidth={1920}
          recommendedHeight={1080}
          liveAspectRatio={16 / 9}
          helperText="Esta imagen es el fondo del Hero en pantallas grandes (16:9, como una foto panorámica típica). Como la altura real varía según el monitor de cada persona, el recorte puede variar un poco — pero al ser landscape, siempre se ve bien. Peso máximo: 1MB."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.08em] text-[#3F4450]">Nombre del banner</span>
          <input name={`banner_name_${index}`} defaultValue={banner.name ?? ""} placeholder="Ej: Colección Verano 2024" className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.08em] text-[#3F4450]">Posición en home</span>
          <input name={`banner_position_${index}`} type="number" min="1" defaultValue={banner.home_position ?? index + 1} className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
        </label>
        <label className="block lg:col-span-2">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#3F4450]"><Link2 size={16} /> URL destino / link</span>
          <input name={`banner_url_${index}`} defaultValue={banner.destination_url ?? ""} placeholder="/catalog o https://beautycosmetics.com/promocion" className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.08em] text-[#3F4450]">Visibilidad</span>
          <select name={`banner_scope_${index}`} defaultValue={banner.display_scope ?? "desktop_and_mobile"} className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]">
            <option value="desktop_and_mobile">Desktop y móvil</option>
            <option value="desktop_only">Solo desktop</option>
            <option value="mobile_only">Solo móvil</option>
          </select>
        </label>
        <div className="block lg:col-span-2">
          <BannerImageField
            name={`banner_mobile_image_${index}`}
            existingUrl={banner.mobileUrl}
            frameLabel="Móvil"
            recommendedWidth={1080}
            recommendedHeight={1920}
            liveAspectRatio={9 / 16}
            previewWidthClassName="mx-auto max-w-[260px]"
            helperText="En el teléfono el Hero ocupa casi toda la pantalla, por eso esta imagen debe ser VERTICAL (retrato), no horizontal — igual a una historia de Instagram (9:16). Opcional: si no subes una, se usa la imagen desktop (se recortará bastante al ser horizontal)."
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-bold text-[#3F4450] lg:col-span-2">
          <input name={`banner_active_${index}`} type="checkbox" defaultChecked={banner.active !== false} className="h-5 w-5 accent-[#7B2505]" /> Estado de publicación activo
        </label>
      </div>
    </fieldset>
  );
}

type BannerManagerProps = {
  // Todos los banners reales + el slot de "nuevo banner" al final. Necesario
  // completo (no paginado) para poder enviar sus campos ocultos sin perder
  // datos al guardar, sin importar cuál esté siendo editado.
  allBanners: EditableBanner[];
  // Solo los banners reales que corresponden a la página actual del grid.
  gridBanners: EditableBanner[];
};

export default function BannerManager({ allBanners, gridBanners }: BannerManagerProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex !== null) editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeIndex]);

  const activeBanner = activeIndex !== null ? allBanners.find((banner) => banner.editorIndex === activeIndex) ?? null : null;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {gridBanners.map((banner) => (
          <div key={banner.id ?? banner.editorIndex} className="flex flex-col overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white transition hover:-translate-y-0.5 hover:shadow-md">
            {banner.desktopUrl ? <img src={banner.desktopUrl} alt={banner.name} className="h-40 w-full object-cover" /> : <div className="h-40 bg-[#F6F7F9]" />}

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold text-[#1F1F22]">{banner.name}</h4>
                <span className="rounded-full bg-[#FFE8EE] px-3 py-1 text-sm font-semibold text-[#9E3659]">Posición {banner.home_position}</span>
              </div>
              <p className="mt-1 text-sm text-[#6B6063]">{scopeLabel[banner.display_scope as StrapiHomeBanner["display_scope"]]} • {banner.active !== false ? "Activo" : "Inactivo"}</p>

              <div className="mt-5 mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <span className="h-1.5 flex-1 rounded-full bg-emerald-700" /> {banner.active !== false ? "Visible" : "Oculto"}
              </div>

              <div className="mt-auto flex items-center gap-3 border-t border-[#E7BFC9] pt-4">
                <button
                  type="button"
                  onClick={() => setActiveIndex(banner.editorIndex)}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-[#F6F7F9] py-2 text-[13px] font-bold text-[#3F4450] transition-colors hover:bg-[#E7BFC9] hover:text-[#7B2505]"
                >
                  <Edit2 size={16} /> Editar
                </button>

                {banner.id ? (
                  <button
                    formAction={deleteBannerForm}
                    name="delete_banner_id"
                    value={banner.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded bg-red-50 py-2 text-[13px] font-bold text-red-700 transition-colors hover:bg-red-100"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setActiveIndex(allBanners[allBanners.length - 1].editorIndex)}
          className="flex min-h-[290px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#E7BFC9] bg-white text-center text-[#7A6A70] transition hover:border-[#9E3659] hover:text-[#9E3659]"
        >
          <ImageIcon size={40} />
          <span className="mt-4 text-lg font-semibold">Añadir espacio publicitario</span>
        </button>
      </div>

      {activeBanner ? (
        <div ref={editorRef} className="mt-8 scroll-mt-20">
          <BannerEditor banner={activeBanner} onClose={() => setActiveIndex(null)} />
        </div>
      ) : null}

      {/* Todo banner que NO es el activo viaja como inputs ocultos, para que
          "Guardar configuración" no pierda sus datos aunque su editor no
          esté visible en este momento. */}
      {allBanners.map((banner) => (banner.editorIndex === activeIndex ? null : <HiddenBannerFields key={`hidden-${banner.editorIndex}`} banner={banner} />))}
    </>
  );
}