import { ImageIcon, Link2, Mail, MessageCircle, Save, UploadCloud } from "lucide-react";
import Link from "next/link";
import AdminShell from "../components/AdminShell";
import AdminDataError from "../components/AdminDataError";
import AdminFlash from "../components/AdminFlash";
import { noticeFromQuery } from "../components/AdminFlash.utils";
import { saveStoreConfigForm } from "../actions";
import { getAdminStoreConfig, getStrapiMediaUrl, type StrapiHomeBanner } from "../../services/admin";

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
    <fieldset id={`banner-${index}`} className="rounded-[10px] border border-[#E7BFC9] bg-white p-5 shadow-sm">
      <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-[#7B2505]">{banner.id ? `Editar banner ${index + 1}` : "Añadir nuevo banner"}</legend>
      <input type="hidden" name={`banner_id_${index}`} value={banner.id ?? ""} />
      <input type="hidden" name={`banner_desktop_existing_${index}`} value={desktopImage?.id ?? ""} />
      <input type="hidden" name={`banner_mobile_existing_${index}`} value={mobileImage?.id ?? ""} />

      <div className="mb-6 flex min-h-[210px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#C9CEDD] bg-[#F6F7F9] p-5 text-center text-[#4B5262]">
        {desktopImage?.url ? <img src={getStrapiMediaUrl(desktopImage.url) ?? ""} alt={banner.name ?? "Banner"} className="mb-4 max-h-[210px] w-full rounded-[6px] object-cover" /> : <ImageIcon size={36} strokeWidth={1.8} />}
        <p className="mt-3 font-medium">Recomendado: 1920×600px (Desktop)</p>
        <p className="text-sm text-[#6B6063]">Opcional móvil: 1080×1350px. Peso máximo: 8MB.</p>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-[4px] border border-[#8E94A3] bg-white px-5 py-2 text-sm font-bold text-[#1F1F22]">
          <UploadCloud size={17} /> Subir imagen desktop
          <input name={`banner_desktop_image_${index}`} type="file" accept="image/*" className="sr-only" />
        </label>
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
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#3F4450]"><ImageIcon size={16} /> Imagen móvil opcional</span>
          {mobileImage?.url ? <img src={getStrapiMediaUrl(mobileImage.url) ?? ""} alt="" className="mb-2 h-20 w-full rounded object-cover" /> : null}
          <input name={`banner_mobile_image_${index}`} type="file" accept="image/*" className="w-full rounded-[4px] border border-dashed border-[#C8CEDB] bg-white p-3 text-sm" />
        </label>
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
            <label className="block"><span className="mb-3 flex items-center gap-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#3F4450]"><MessageCircle size={19} /> WhatsApp / teléfono</span><input name="whatsapp_number" defaultValue={config.whatsapp_number ?? ""} placeholder="Ej: +503 7000 0000" className="h-14 w-full rounded-[4px] border border-[#C8CEDB] px-5 text-[18px] outline-none focus:border-[#9E3659]" /></label>
            <label className="block"><span className="mb-3 flex items-center gap-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#3F4450]"><Mail size={19} /> Email de notificaciones</span><input name="notification_email" defaultValue={config.notification_email ?? ""} type="email" placeholder="admin@beauty.com" className="h-14 w-full rounded-[4px] border border-[#C8CEDB] px-5 text-[18px] outline-none focus:border-[#9E3659]" /></label>
          </div>

          <section className="border-t border-[#E7BFC9] px-7 py-8">
            <div className="mb-6">
              <h3 className="text-[26px] font-bold text-[#1F1F22]">Banners del Home</h3>
              <p className="mt-1 text-[17px] text-[#6B6063]">Administra el carrusel principal. Medidas: desktop 1920×600px y móvil 1080×1350px.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {banners.slice(start, start + PAGE_SIZE).map((banner) => (
                <a key={banner.id ?? banner.name} href={`#banner-${editorBanners.indexOf(banner)}`} className="overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white transition hover:-translate-y-0.5 hover:shadow-md">
                  {banner.desktop_image?.url ? <img src={getStrapiMediaUrl(banner.desktop_image.url) ?? ""} alt={banner.name} className="h-40 w-full object-cover" /> : <div className="h-40 bg-[#F6F7F9]" />}
                  <div className="p-5"><div className="flex items-start justify-between gap-3"><h4 className="font-semibold text-[#1F1F22]">{banner.name}</h4><span className="rounded-full bg-[#FFE8EE] px-3 py-1 text-sm font-semibold text-[#9E3659]">Posición {banner.home_position}</span></div><p className="mt-1 text-sm text-[#6B6063]">{scopeLabel[banner.display_scope]} • {banner.active !== false ? "Activo" : "Inactivo"}</p><div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700"><span className="h-1.5 flex-1 rounded-full bg-emerald-700" /> {banner.active !== false ? "Visible" : "Oculto"}</div></div>
                </a>
              ))}
              <a href={`#banner-${banners.length}`} className="flex min-h-[290px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#E7BFC9] bg-[#FAFAFA] text-center text-[#7A6A70] transition hover:border-[#9E3659] hover:text-[#9E3659]"><ImageIcon size={40} /><span className="mt-4 text-lg">Añadir espacio publicitario</span></a>
            </div>
            <div className="mt-8 grid gap-6">{visibleEditors.map((banner, offset) => <BannerEditor key={`editor-${start + offset}`} banner={banner} index={start + offset} />)}</div>
            <div className="mt-8 flex items-center justify-between text-sm font-semibold text-[#554246]"><Link className={currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:text-[#9E3659]"} href={`/admin/contenido?bannerPage=${currentPage - 1}`}>Anterior</Link><span>Página {currentPage} de {pageCount}</span><Link className={currentPage >= pageCount ? "pointer-events-none opacity-40" : "hover:text-[#9E3659]"} href={`/admin/contenido?bannerPage=${currentPage + 1}`}>Siguiente</Link></div>
          </section>
          <div className="flex justify-end border-t border-[#E7BFC9] bg-[#F8F8F9] px-7 py-6"><button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#7B2505] px-7 text-[15px] font-bold text-white transition-colors hover:bg-[#5f1c03]"><Save size={18} /> Guardar configuración</button></div>
        </form>
      </main>
    </AdminShell>
  );
}
