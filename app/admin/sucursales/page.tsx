import AdminShell from "../components/AdminShell";
import AdminDataError from "../components/AdminDataError";
import AdminBranchesClient, { type BranchRow } from "./AdminBranchesClient";
import { getAdminBranches } from "../../services/admin";

export default async function BranchesPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string; saved?: string }> }) {
  const query = await searchParams;
  const currentStatus = ["active", "inactive"].includes(query.status ?? "") ? query.status! : "all";
  const currentPage = Math.max(1, Number(query.page ?? 1) || 1);
  const pageSize = 8;
  try {
    const response = await getAdminBranches({ status: currentStatus, page: currentPage, pageSize });
    const pagination = response.meta.pagination;
    const total = pagination?.total ?? response.data.length;
    const pageCount = Math.max(1, pagination?.pageCount ?? 1);
    const branches: BranchRow[] = response.data.map((branch) => ({
      name: branch.name,
      address: branch.address,
      status: branch.active ? "ACTIVA" : "INACTIVA",
      statusTone: branch.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
      schedule: branch.active ? branch.schedule || "Horario no definido" : "Cerrado",
      notes: branch.notes || "Sin notas",
      icon: branch.active ? (branch.name.toLowerCase().includes("log") ? "truck" : "map-pin") : "wifi-off",
      iconTone: branch.active ? "bg-[#FFD7E2] text-[#7D123B]" : "bg-[#D9D9D9] text-[#5F5F61]",
      href: branch.documentId,
    }));
    const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, total);
    return <AdminBranchesClient branches={branches} currentStatus={currentStatus} currentPage={currentPage} pageCount={pageCount} saved={query.saved === "1"} totalLabel={`Mostrando ${from}-${to} de ${total} sucursales`} />;
  } catch (error) {
    return <AdminShell active="branches"><AdminDataError title="No se pudieron cargar sucursales desde Strapi" error={error} permissions={["Branch: find/findOne", "Branch-stock: find/findOne"]} /></AdminShell>;
  }
}
