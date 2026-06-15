import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Truck,
  WifiOff,
} from "lucide-react";
import AdminShell from "../components/AdminShell";

export type BranchIcon = "map-pin" | "truck" | "wifi-off";
export type BranchRow = { name: string; address: string; status: string; statusTone: string; schedule: string; notes: string; icon: BranchIcon; iconTone: string; href: string };
const branchIcons = { "map-pin": MapPin, truck: Truck, "wifi-off": WifiOff } satisfies Record<BranchIcon, React.ElementType>;

type AdminBranchesClientProps = { branches: BranchRow[]; totalLabel: string; currentStatus: string; currentPage: number; pageCount: number; saved?: boolean };

const tabs = [
  { label: "Todas", status: "all" },
  { label: "Activas", status: "active" },
  { label: "Inactivas", status: "inactive" },
];

function branchHref(status: string, page = 1) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/admin/sucursales${query ? `?${query}` : ""}`;
}

export default function AdminBranchesClient({ branches, totalLabel, currentStatus, currentPage, pageCount, saved }: AdminBranchesClientProps) {
  return (
    <AdminShell active="branches">
      <main className="mx-auto w-full max-w-[1120px] px-4 py-12 md:px-8">
        {saved ? <div className="mb-6 rounded-[8px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-[15px] font-bold text-emerald-700">Sucursal guardada correctamente.</div> : null}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit rounded-[10px] bg-[#EEF0F2] p-1">
            {tabs.map((tab) => (
              <Link
                key={tab.status}
                href={branchHref(tab.status)}
                className={`flex h-10 min-w-[96px] items-center justify-center rounded-[8px] px-5 text-[14px] font-bold ${
                  currentStatus === tab.status ? "bg-white text-[#7D123B] shadow-sm" : "text-[#4B4E5A]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-7">
            <div className="flex items-center gap-4 text-[15px]">
              <span className="text-[#5C4B50]">Ordenar por:</span>
              <span className="inline-flex items-center gap-3 font-bold text-[#1F1F22]">
                Nombre (A-Z)
                <ChevronDown size={18} strokeWidth={1.8} className="text-[#6B7280]" />
              </span>
            </div>
            <Link
              href="/admin/sucursales/nueva"
              className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#681032]"
            >
              <Plus size={17} strokeWidth={2} />
              Nueva Sucursal
            </Link>
          </div>
        </div>

        <section className="mt-9 overflow-hidden rounded-[10px] border border-[#E7BFC9] bg-white">
          <div className="grid min-w-[920px] grid-cols-[1.7fr_0.7fr_0.8fr_1.2fr_0.6fr] bg-[#F8F8F9] px-10 py-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[#5C4B50]">
            <span>Nombre y Dirección</span>
            <span>Estado</span>
            <span>Horario</span>
            <span>Notas</span>
            <span className="text-center">Acciones</span>
          </div>

          <div className="overflow-x-auto">
            {branches.map((branch) => {
              const Icon = branchIcons[branch.icon];
              return (
                <div key={branch.href} className="grid min-w-[920px] grid-cols-[1.7fr_0.7fr_0.8fr_1.2fr_0.6fr] items-center border-t border-[#E7BFC9] px-10 py-5">
                  <div className="flex items-center gap-5"><span className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${branch.iconTone}`}><Icon size={24} strokeWidth={2} /></span><div><p className="text-[17px] font-bold text-[#1F1F22]">{branch.name}</p><p className="text-[16px] text-[#5C4B50]">{branch.address}</p></div></div>
                  <span className={`w-fit rounded-full px-4 py-1.5 text-[12px] font-bold ${branch.statusTone}`}>{branch.status}</span>
                  <span className={`text-[16px] ${branch.schedule === "Cerrado" ? "font-bold text-red-700" : branch.schedule === "24 Horas" ? "font-bold text-[#7D123B]" : "text-[#1F1F22]"}`}>{branch.schedule}</span>
                  <span className={branch.notes === "Sin notas" ? "text-[16px] text-[#B6A9AD]" : "text-[16px] text-[#5C4B50]"}>{branch.notes}</span>
                  <div className="flex items-center justify-center gap-6 text-[#5C4B50]"><Link href={`/admin/sucursales/${branch.href}`} aria-label={`Ver ${branch.name}`} className="hover:text-[#9E3659]"><Eye size={21} strokeWidth={2} /></Link><Link href={`/admin/sucursales/${branch.href}/editar`} aria-label={`Editar ${branch.name}`} className="hover:text-[#9E3659]"><Pencil size={21} strokeWidth={2} /></Link></div>
                </div>
              );
            })}
            {branches.length === 0 ? <div className="border-t border-[#E7BFC9] px-10 py-10 text-[15px] font-semibold text-[#5C4B50]">No hay sucursales para este filtro.</div> : null}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-8 py-5 text-[16px] text-[#5C4B50] md:flex-row md:items-center md:justify-between">
            <p>{totalLabel}</p>
            <div className="flex items-center gap-4">
              <Link href={branchHref(currentStatus, Math.max(1, currentPage - 1))} className={currentPage <= 1 ? "pointer-events-none text-[#C8CEDB]" : "text-[#5C4B50]"}><ChevronLeft size={18} /></Link>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <Link key={page} href={branchHref(currentStatus, page)} className={`flex h-10 w-10 items-center justify-center rounded-[6px] ${page === currentPage ? "bg-[#7D123B] text-white" : "text-[#5C4B50]"}`}>{page}</Link>)}
              <Link href={branchHref(currentStatus, Math.min(pageCount, currentPage + 1))} className={currentPage >= pageCount ? "pointer-events-none text-[#C8CEDB]" : "text-[#5C4B50]"}><ChevronRight size={20} /></Link>
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
