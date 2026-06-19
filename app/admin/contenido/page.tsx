import { ImageIcon, Link2, Mail, MessageCircle, Save } from "lucide-react";
import AdminShell from "../components/AdminShell";
import AdminDataError from "../components/AdminDataError";
import AdminFlash from "../components/AdminFlash";
import { noticeFromQuery } from "../components/AdminFlash.utils";
import { saveStoreConfigForm } from "../actions";
import { getAdminStoreConfig, getStrapiMediaUrl, type StrapiHomeBanner } from "../../services/admin";

export default async function AdminContentPage({ searchParams }: { searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const query = searchParams ? await searchParams : {};
  let response;
  try {
    response = await getAdminStoreConfig();
  } catch (error) {
    return (
      <AdminShell active="content">
        <AdminDataError title="No se pudo cargar Store Config desde Strapi" error={error} permissions={["Store-config: find/update"]} />
      </AdminShell>
    );
  }

  const config = response.data;
  const banners = [...(config.home_banners ?? [])].sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0));
  const bannerSlots: Partial<StrapiHomeBanner>[] = [...banners, ...Array.from({ length: 3 }, (_, index) => ({ home_position: banners.length + index + 1 }))];

  return (
      <AdminShell active="content">
        <main className="mx-auto w-full max-w-[1100px] px-4 py-16 md:px-8">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
            <h2 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Contenido y Configuracion</h2>
            <p className="mt-1 text-[17px] text-[#6B6063]">Administra los datos reales del single type Store Config conectado a Strapi.</p>
          </div>

          <div className="mt-6"><AdminFlash notice={noticeFromQuery(query, "Configuracion guardada correctamente.")} /></div>

          <form action={saveStoreConfigForm} className="mt-8 overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white">
            <div className="border-b border-[#E7BFC9] px-7 py-7">
              <h3 className="text-[22px] font-bold text-[#1F1F22]">Configuracion global de tienda</h3>
              <p className="mt-2 text-[16px] text-[#6B6063]">Configura datos de contacto y los banners promocionales que veran los clientes en el home.</p>
            </div>
            <div className="grid gap-7 px-7 py-8 lg:grid-cols-2">
              <label className="block">
                <span className="mb-3 flex items-center gap-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#3F4450]"><MessageCircle size={19} /> WhatsApp</span>
                <input name="whatsapp_number" defaultValue={config.whatsapp_number ?? ""} placeholder="Ej: +503 7000 0000" className="h-14 w-full rounded-[4px] border border-[#C8CEDB] px-5 text-[18px] outline-none focus:border-[#9E3659]" />
              </label>
              <label className="block">
                <span className="mb-3 flex items-center gap-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[#3F4450]"><Mail size={19} /> Email de notificaciones</span>
                <input name="notification_email" defaultValue={config.notification_email ?? ""} type="email" placeholder="admin@beauty.com" className="h-14 w-full rounded-[4px] border border-[#C8CEDB] px-5 text-[18px] outline-none focus:border-[#9E3659]" />
              </label>
            </div>

            <section className="border-t border-[#E7BFC9] px-7 py-8">
              <div className="mb-6">
                <h3 className="text-[22px] font-bold text-[#1F1F22]">Banners del home</h3>
                <p className="mt-2 text-[15px] text-[#6B6063]">Completa un bloque para crearlo. Deja un banner existente sin nombre o sin imagen para quitarlo.</p>
              </div>
              <div className="grid gap-6">
                {bannerSlots.map((banner, index) => {
                  const desktopImage = banner.desktop_image;
                  const mobileImage = banner.mobile_image;
                  return (
                    <fieldset key={`${banner.id ?? "new"}-${index}`} className="rounded-[8px] border border-[#E7BFC9] bg-[#FFF9FB] p-5">
                      <legend className="px-2 text-sm font-bold uppercase tracking-[0.12em] text-[#9E3659]">Banner {index + 1}</legend>
                      <input type="hidden" name={`banner_id_${index}`} value={banner.id ?? ""} />
                      <input type="hidden" name={`banner_desktop_existing_${index}`} value={desktopImage?.id ?? ""} />
                      <input type="hidden" name={`banner_mobile_existing_${index}`} value={mobileImage?.id ?? ""} />
                      <div className="grid gap-5 lg:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm font-bold text-[#3F4450]">Nombre interno</span>
                          <input name={`banner_name_${index}`} defaultValue={banner.name ?? ""} placeholder="Ej: Promo verano" className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-bold text-[#3F4450]">Posicion</span>
                          <input name={`banner_position_${index}`} type="number" min="1" defaultValue={banner.home_position ?? index + 1} className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
                        </label>
                        <label className="block lg:col-span-2">
                          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3F4450]"><Link2 size={16} /> URL destino</span>
                          <input name={`banner_url_${index}`} defaultValue={banner.destination_url ?? ""} placeholder="/catalog o https://..." className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]" />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-bold text-[#3F4450]">Visibilidad</span>
                          <select name={`banner_scope_${index}`} defaultValue={banner.display_scope ?? "desktop_and_mobile"} className="h-12 w-full rounded-[4px] border border-[#C8CEDB] px-4 outline-none focus:border-[#9E3659]">
                            <option value="desktop_and_mobile">Desktop y movil</option>
                            <option value="desktop_only">Solo desktop</option>
                            <option value="mobile_only">Solo movil</option>
                          </select>
                        </label>
                        <label className="mt-8 flex items-center gap-3 text-sm font-bold text-[#3F4450]">
                          <input name={`banner_active_${index}`} type="checkbox" defaultChecked={banner.active !== false} className="h-5 w-5 accent-[#9E3659]" /> Activo
                        </label>
                        <label className="block">
                          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3F4450]"><ImageIcon size={16} /> Imagen desktop</span>
                          {desktopImage?.url ? <img src={getStrapiMediaUrl(desktopImage.url) ?? ""} alt="" className="mb-3 h-28 w-full rounded object-cover" /> : null}
                          <input name={`banner_desktop_image_${index}`} type="file" accept="image/*" className="w-full rounded-[4px] border border-dashed border-[#C8CEDB] bg-white p-3 text-sm" />
                        </label>
                        <label className="block">
                          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#3F4450]"><ImageIcon size={16} /> Imagen movil opcional</span>
                          {mobileImage?.url ? <img src={getStrapiMediaUrl(mobileImage.url) ?? ""} alt="" className="mb-3 h-28 w-full rounded object-cover" /> : null}
                          <input name={`banner_mobile_image_${index}`} type="file" accept="image/*" className="w-full rounded-[4px] border border-dashed border-[#C8CEDB] bg-white p-3 text-sm" />
                        </label>
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </section>

            <div className="flex justify-end border-t border-[#E7BFC9] bg-[#F8F8F9] px-7 py-6">
              <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-7 text-[15px] font-bold text-white transition-colors hover:bg-[#84304C]"><Save size={18} /> Guardar configuracion</button>
            </div>
          </form>
        </main>
      </AdminShell>
  );
}
