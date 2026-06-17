import { Mail, MessageCircle, Save } from "lucide-react";
import AdminShell from "../components/AdminShell";
import AdminDataError from "../components/AdminDataError";
import AdminFlash, { noticeFromQuery } from "../components/AdminFlash";
import { saveStoreConfigForm } from "../actions";
import { getAdminStoreConfig } from "../../services/admin";

export default async function AdminContentPage({ searchParams }: { searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const query = searchParams ? await searchParams : {};
  try {
    const response = await getAdminStoreConfig();
    const config = response.data;
    return (
      <AdminShell active="content">
        <main className="mx-auto w-full max-w-[1100px] px-4 py-16 md:px-8">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
            <h2 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Contenido y Configuracion</h2>
            <p className="mt-1 text-[17px] text-[#6B6063]">
              Administra los datos reales del single type Store Config conectado a Strapi.
            </p>
          </div>

          <div className="mt-6"><AdminFlash notice={noticeFromQuery(query, "Configuracion guardada correctamente.")} /></div>

          <form action={saveStoreConfigForm} className="mt-8 overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white">
            <div className="border-b border-[#E7BFC9] px-7 py-7">
              <h3 className="text-[22px] font-bold text-[#1F1F22]">Configuracion global de tienda</h3>
              <p className="mt-2 text-[16px] text-[#6B6063]">Estos campos se guardan directamente en Strapi. Si el single type todavia no tiene contenido, puedes crearlo desde este formulario.</p>
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
            <div className="flex justify-end border-t border-[#E7BFC9] bg-[#F8F8F9] px-7 py-6">
              <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-7 text-[15px] font-bold text-white transition-colors hover:bg-[#84304C]">
                <Save size={18} /> Guardar configuracion
              </button>
            </div>
          </form>
        </main>
      </AdminShell>
    );
  } catch (error) {
    return (
      <AdminShell active="content">
        <AdminDataError title="No se pudo cargar Store Config desde Strapi" error={error} permissions={["Store-config: find/update"]} />
      </AdminShell>
    );
  }
}
