// RUTA: app/admin/contenido/page.tsx
import { Mail, MessageCircle, Save } from "lucide-react";
import Link from "next/link";
import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import AdminFlash from "@/src/features/admin/components/AdminFlash";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import { saveStoreConfigForm } from "@/src/features/admin/actions";
import { getAdminStoreConfig, getStrapiMediaUrl } from "@/src/shared/services/admin";
import BannerManager, { type EditableBanner } from "./components/BannerManager";

const PAGE_SIZE = 6;

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
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

  // editorIndex es la posición estable usada para nombrar los inputs
  // banner_*_<editorIndex> que lee saveStoreConfig en actions.ts. Se calcula
  // una sola vez aquí y viaja con cada banner, sin importar si ese banner
  // termina mostrándose en el editor activo o como inputs ocultos.
  const bannersWithUrls: EditableBanner[] = banners.map((banner, editorIndex) => ({
    ...banner,
    editorIndex,
    desktopUrl: getStrapiMediaUrl(banner.desktop_image?.url),
    mobileUrl: getStrapiMediaUrl(banner.mobile_image?.url),
  }));
  const newBannerSlot: EditableBanner = {
    home_position: banners.length + 1,
    editorIndex: banners.length,
    desktopUrl: null,
    mobileUrl: null,
  };
  const allBanners: EditableBanner[] = [...bannersWithUrls, newBannerSlot];

  const page = Math.max(1, Number(firstParam(query.bannerPage) ?? 1) || 1);
  const pageCount = Math.max(1, Math.ceil(banners.length / PAGE_SIZE) || 1);
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const gridBanners = bannersWithUrls.slice(start, start + PAGE_SIZE);

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

            {/* Por defecto SOLO se ve este grid de tarjetas. Ningún editor se
                renderiza hasta que se presiona "Editar" o "Añadir espacio
                publicitario" (estado de React dentro de BannerManager). */}
            <BannerManager allBanners={allBanners} gridBanners={gridBanners} />

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