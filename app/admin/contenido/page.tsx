// RUTA: app/admin/contenido/page.tsx
import { ImageIcon, Link2, Mail, MessageCircle, Save, Edit2, Trash2, ChevronDown } from "lucide-react";
import Link from "next/link";
import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import AdminFlash from "@/src/features/admin/components/AdminFlash";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import { saveStoreConfigForm, deleteBannerForm } from "@/src/features/admin/actions";
import { getAdminStoreConfig, getStrapiMediaUrl, type StrapiHomeBanner } from "@/src/shared/services/admin";
import BannerImageField from "./components/BannerImageField";

const PAGE_SIZE = 6;
const scopeLabel: Record<StrapiHomeBanner["display_scope"], string> = {
  desktop_and_mobile: "Desktop & Mobile",
  desktop_only: "Desktop Only",
  mobile_only: "Mobile Only",
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function HiddenBannerFields({ banner, index }: { banner: Partial<StrapiHomeBanner>; index: number }) {
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

function BannerEditor({ banner, index }: { banner: Partial<StrapiHomeBanner>; index: number }) {
  const desktopImage = banner.desktop_image;
  const mobileImage = banner.mobile_image;
  return (
    <fieldset className="p-5">
      <div className="flex items-center justify-between mb-4">
        <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-[#7B2505]">
          {banner.id ? `Editar banner ${index + 1}` : "Añadir nuevo banner"}
        </legend>
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
      </div>

      <input type="hidden" name={`banner_id_${index}`} value={banner.id ?? ""} />
      <input type="hidden" name={`banner_desktop_existing_${index}`} value={desktopImage?.id ?? ""} />
      <input type="hidden" name={`banner_mobile_existing_${index}`} value={mobileImage?.id ?? ""} />

      <div className="mb-6">
        <BannerImageField
          name={`banner_desktop_image_${index}`}
          existingUrl={getStrapiMediaUrl(desktopImage?.url)}
          frameLabel="Desktop"
          recommendedWidth={1200}
          recommendedHeight={630}
          liveAspectRatio={120 / 63}
          helperText="Esta es la misma proporción (120:63) que usa el carrusel del home en desktop. Peso máximo: 8MB."
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
            existingUrl={getStrapiMediaUrl(mobileImage?.url)}
            frameLabel="Móvil"
            recommendedWidth={1080}
            recommendedHeight={608}
            liveAspectRatio={16 / 9}
            helperText="Opcional: si no subes una, el home usa la imagen desktop también en móvil. Proporción real del carrusel en móvil: 16:9."
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-bold text-[#3F4450] lg:col-span-2">
          <input name={`banner_active_${index}`} type="checkbox" defaultChecked={banner.active !== false} className="h-5 w-5 accent-[#7B2505]" /> Estado de publicación activo
        </label>
      </div>
    </fieldset>
  );
}

export default async function AdminContentPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const query = (await searchParams) ?? {};
  let response;
  try {
    response = await getAdminStoreConfig();
  } catch (error) {
    return <AdminShell active="content"><AdminDataError title="No se pudo cargar Store Config desde Strapi" error={error} permissions={["Store-config: find/update"]} /></AdminShell>;
  }

  const config = response.data;
  const banners = [...(config.home_banners ?? [])].sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0));
  const editorBanners: Partial<StrapiHomeBanner>[] = [...banners, { home_position: banners.length + 1 }];
  const page = Math.max(1, Number(firstParam(query.bannerPage) ?? 1) || 1);
  const pageCount = Math.max(1, Math.ceil(editorBanners.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleEditors = editorBanners.slice(start, start + PAGE_SIZE);

  return (
    <AdminShell active="content">
      <main className="mx-auto w-full max-w-[1100px] px-4 py-16 md:px-8">
        <div>
          <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
          <h2 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Contenido y Configuración</h2>
          <p className="mt-1 text-[17px] text-[#6B6063]">Administra contacto, carrusel principal y promociones temporales.</p>
        </div>
        <div className="mt-6"><AdminFlash notice={noticeFromQuery(query, "Configuración guardada correctamente.")} /></div>

        <form action={saveStoreConfigForm} className="mt-8 overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white">
          {editorBanners.map((banner, index) => (index < start || index >= start + PAGE_SIZE ? <HiddenBannerFields key={`hidden-${index}`} banner={banner} index={index} /> : null))}
          
          <div className="border-b border-[#E7BFC9] px-7 py-7">
            <h3 className="text-[22px] font-bold text-[#1F1F22]">Configuración global de tienda</h3>
            <p className="mt-2 text-[16px] text-[#6B6063]">Estos datos también se muestran en el footer como información de contacto.</p>
          </div>
          
          <div className="grid gap-7 px-7 py-8 lg:grid-cols-2">
            <label className="block">
              <span className="mb-3 flex items-center gap-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">
                <MessageCircle size={19} /> WhatsApp / teléfono
              </span>
              <input name="whatsapp_number" defaultValue={config.whatsapp_number ?? ""} placeholder="Ej: +503 7000 0000" className="h-14 w-full rounded-[4px] border border-[#C8CEDB] px-5 text-[18px] outline-none focus:border-[#9E3659]" />
            </label>
            <label className="block">
              <span className="mb-3 flex items-center gap-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#3F4450]">
                <Mail size={19} /> Email de notificaciones
              </span>
              <input name="notification_email" defaultValue={config.notification_email ?? ""} type="email" placeholder="admin@beauty.com" className="h-14 w-full rounded-[4px] border border-[#C8CEDB] px-5 text-[18px] outline-none focus:border-[#9E3659]" />
            </label>
          </div>

          <section className="border-t border-[#E7BFC9] px-7 py-8 bg-[#FAFAFA]">
            <div className="mb-6">
              <h3 className="text-[26px] font-bold text-[#1F1F22]">Banners del Home</h3>
              <p className="mt-1 text-[17px] text-[#6B6063]">Administra el carrusel principal tipo tarjetas. Medidas: desktop 1200×630px y móvil 1080×608px.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {banners.slice(start, start + PAGE_SIZE).map((banner) => (
                <div key={banner.id ?? banner.name} className="flex flex-col overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white transition hover:-translate-y-0.5 hover:shadow-md">
                  {banner.desktop_image?.url ? <img src={getStrapiMediaUrl(banner.desktop_image.url) ?? ""} alt={banner.name} className="h-40 w-full object-cover" /> : <div className="h-40 bg-[#F6F7F9]" />}
                  
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-semibold text-[#1F1F22]">{banner.name}</h4>
                      <span className="rounded-full bg-[#FFE8EE] px-3 py-1 text-sm font-semibold text-[#9E3659]">Posición {banner.home_position}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#6B6063]">{scopeLabel[banner.display_scope]} • {banner.active !== false ? "Activo" : "Inactivo"}</p>
                    
                    <div className="mt-5 mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      <span className="h-1.5 flex-1 rounded-full bg-emerald-700" /> {banner.active !== false ? "Visible" : "Oculto"}
                    </div>
                    
                    <div className="mt-auto flex items-center gap-3 border-t border-[#E7BFC9] pt-4">
                      <a 
                        href={`#banner-${editorBanners.indexOf(banner)}`} 
                        className="flex flex-1 items-center justify-center gap-2 rounded bg-[#F6F7F9] py-2 text-[13px] font-bold text-[#3F4450] transition-colors hover:bg-[#E7BFC9] hover:text-[#7B2505]"
                      >
                        <Edit2 size={16} /> Editar
                      </a>
                      
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

              <a href={`#banner-${banners.length}`} className="flex min-h-[290px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#E7BFC9] bg-white text-center text-[#7A6A70] transition hover:border-[#9E3659] hover:text-[#9E3659]">
                <ImageIcon size={40} />
                <span className="mt-4 text-lg font-semibold">Añadir espacio publicitario</span>
              </a>
            </div>

            <div className="mt-10 grid gap-4">
              {visibleEditors.map((banner, offset) => {
                const editorIndex = start + offset;
                return (
                  <details key={`editor-${editorIndex}`} className="group overflow-hidden rounded-[10px] border border-[#E7BFC9] bg-white shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold uppercase tracking-[0.1em] text-[#7B2505] [&::-webkit-details-marker]:hidden">
                      <span>{banner.id ? `Banner ${editorIndex + 1}: ${banner.name || "(sin nombre)"}` : "Añadir nuevo banner"}</span>
                      <ChevronDown size={18} className="shrink-0 text-[#7B2505] transition-transform group-open:rotate-180" />
                    </summary>
                    {/* El id va aquí (no en <details>) a propósito: cuando un enlace
                        #banner-N apunta a un elemento escondido dentro de un
                        <details> cerrado, el navegador lo abre automáticamente
                        solo. Así, el botón "Editar" de las tarjetas de arriba
                        expande justo ese editor sin necesitar JavaScript. */}
                    <div id={`banner-${editorIndex}`} className="scroll-mt-20 border-t border-[#E7BFC9]">
                      <BannerEditor banner={banner} index={editorIndex} />
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between text-sm font-semibold text-[#554246]">
              <Link className={currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:text-[#9E3659]"} href={`/admin/contenido?bannerPage=${currentPage - 1}`}>Anterior</Link>
              <span>Página {currentPage} de {pageCount}</span>
              <Link className={currentPage >= pageCount ? "pointer-events-none opacity-40" : "hover:text-[#9E3659]"} href={`/admin/contenido?bannerPage=${currentPage + 1}`}>Siguiente</Link>
            </div>
          </section>

          <div className="flex justify-end border-t border-[#E7BFC9] bg-[#F8F8F9] px-7 py-6">
            <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#7B2505] px-7 text-[15px] font-bold text-white transition-colors hover:bg-[#5f1c03]">
              <Save size={18} /> Guardar configuración
            </button>
          </div>
        </form>
      </main>
    </AdminShell>
  );
}