import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import AdminOrdersClient from "@/src/features/admin/pedidos/AdminOrdersClient";
import { buildOrdersViewModel } from "@/src/features/admin/pedidos/orders-view-model";

const validStatuses = ["all", "pending_shipping", "shipped", "delivered"] as const;

type SearchParams = Promise<{ page?: string; status?: string; search?: string; date_from?: string; date_to?: string; saved?: string; error?: string; message?: string }>;

export default async function AdminOrdersPage({ searchParams }: { searchParams?: SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const status = validStatuses.includes(query.status as (typeof validStatuses)[number]) ? query.status! : "all";
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const dateFrom = typeof query.date_from === "string" ? query.date_from : "";
  const dateTo = typeof query.date_to === "string" ? query.date_to : "";

  // Clave única por combinación de filtros: obliga a React a remontar
  // AdminOrdersClient desde cero cada vez que cambian (tabs, paginación,
  // búsqueda o el botón "Limpiar"), evitando que la tabla/inputs queden
  // con datos viejos por una navegación del lado del cliente.
  const viewKey = `${status}|${search}|${dateFrom}|${dateTo}|${page}`;

  try {
    const viewModel = await buildOrdersViewModel({ page, status, search, dateFrom, dateTo });

    return (
      <AdminOrdersClient
        key={viewKey}
        stats={viewModel.stats}
        orders={viewModel.orders}
        totalLabel={viewModel.totalLabel}
        pagination={viewModel.pagination}
        filters={{ status, search, dateFrom, dateTo }}
        saved={query.saved === "1"}
        notice={noticeFromQuery(query, "Pedido actualizado correctamente.")}
      />
    );
  } catch (error) {
    return (
      <AdminShell active="orders" searchPlaceholder="Buscar pedidos, clientes, IDs...">
        <AdminDataError title="No se pudieron cargar pedidos desde Strapi" error={error} permissions={["Order: find/findOne/update", "Order-item: find/findOne", "Branch: find/findOne", "Shipping-rate: find/findOne", "Product: find/findOne", "Variant-option: find/findOne"]} />
      </AdminShell>
    );
  }
}