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

const branches = [
  {
    name: "Sucursal Norte Central",
    address: "Morazán, El Salvador",
    status: "ACTIVA",
    statusTone: "bg-emerald-100 text-emerald-700",
    schedule: "08:00 - 19:00",
    notes: "Sede principal",
    icon: MapPin,
    iconTone: "bg-[#FFD7E2] text-[#7D123B]",
    href: "sucursal-norte-central",
  },
  {
    name: "Sucursal Sur Marina",
    address: "San Miguel, El Salvador",
    status: "ACTIVA",
    statusTone: "bg-emerald-100 text-emerald-700",
    schedule: "09:00 - 18:00",
    notes: "Sin notas",
    icon: MapPin,
    iconTone: "bg-[#FFD7E2] text-[#7D123B]",
    href: "sucursal-sur-marina",
  },
  {
    name: "Logística Este",
    address: "San Miguel, El Salvador",
    status: "INACTIVA",
    statusTone: "bg-red-100 text-red-700",
    schedule: "Cerrado",
    notes: "En mantenimiento",
    icon: WifiOff,
    iconTone: "bg-[#D9D9D9] text-[#5F5F61]",
    href: "logistica-este",
  },
  {
    name: "Centro Logístico Oeste",
    address: "La Unión, El Salvador",
    status: "ACTIVA",
    statusTone: "bg-emerald-100 text-emerald-700",
    schedule: "24 Horas",
    notes: "Operación continua",
    icon: Truck,
    iconTone: "bg-[#FFD7E2] text-[#7D123B]",
    href: "centro-logistico-oeste",
  },
];

export default function BranchesPage() {
  return (
    <AdminShell active="branches">
      <main className="mx-auto w-full max-w-[1120px] px-4 py-12 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit rounded-[10px] bg-[#EEF0F2] p-1">
            {["Todas", "Activas", "Inactivas"].map((tab, index) => (
              <button
                key={tab}
                className={`h-10 min-w-[96px] rounded-[8px] px-5 text-[14px] font-bold ${
                  index === 0 ? "bg-white text-[#7D123B] shadow-sm" : "text-[#4B4E5A]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-7">
            <div className="flex items-center gap-4 text-[15px]">
              <span className="text-[#5C4B50]">Ordenar por:</span>
              <button className="inline-flex items-center gap-3 font-bold text-[#1F1F22]">
                Nombre (A-Z)
                <ChevronDown size={18} strokeWidth={1.8} className="text-[#6B7280]" />
              </button>
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
              const Icon = branch.icon;
              return (
                <div
                  key={branch.name}
                  className="grid min-w-[920px] grid-cols-[1.7fr_0.7fr_0.8fr_1.2fr_0.6fr] items-center border-t border-[#E7BFC9] px-10 py-5"
                >
                  <div className="flex items-center gap-5">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${branch.iconTone}`}>
                      <Icon size={24} strokeWidth={2} />
                    </span>
                    <div>
                      <p className="text-[17px] font-bold text-[#1F1F22]">{branch.name}</p>
                      <p className="text-[16px] text-[#5C4B50]">{branch.address}</p>
                    </div>
                  </div>
                  <span className={`w-fit rounded-full px-4 py-1.5 text-[12px] font-bold ${branch.statusTone}`}>
                    {branch.status}
                  </span>
                  <span className={`text-[16px] ${branch.schedule === "Cerrado" ? "font-bold text-red-700" : branch.schedule === "24 Horas" ? "font-bold text-[#7D123B]" : "text-[#1F1F22]"}`}>
                    {branch.schedule}
                  </span>
                  <span className={branch.notes === "Sin notas" ? "text-[16px] text-[#B6A9AD]" : "text-[16px] text-[#5C4B50]"}>
                    {branch.notes}
                  </span>
                  <div className="flex items-center justify-center gap-6 text-[#5C4B50]">
                    <Link href={`/admin/sucursales/${branch.href}`} aria-label={`Ver ${branch.name}`} className="hover:text-[#9E3659]">
                      <Eye size={21} strokeWidth={2} />
                    </Link>
                    <Link href={`/admin/sucursales/${branch.href}/editar`} aria-label={`Editar ${branch.name}`} className="hover:text-[#9E3659]">
                      <Pencil size={21} strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-8 py-5 text-[16px] text-[#5C4B50] md:flex-row md:items-center md:justify-between">
            <p>Mostrando 4 de 24 sucursales</p>
            <div className="flex items-center gap-4">
              <ChevronLeft size={18} className="text-[#C8CEDB]" />
              <button className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#7D123B] text-white">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <ChevronRight size={20} className="text-[#5C4B50]" />
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
