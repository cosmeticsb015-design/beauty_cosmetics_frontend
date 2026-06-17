import AdminShell from "../components/AdminShell";
import AdminDataError from "../components/AdminDataError";
import { noticeFromQuery } from "../components/AdminFlash";
import AdminLogisticsClient, { type ShippingZoneRow } from "./AdminLogisticsClient";
import { getAdminShippingRates } from "../../services/admin";

export default async function AdminLogisticsPage({ searchParams }: { searchParams?: Promise<{ saved?: string }> }) {
  const query = searchParams ? await searchParams : {};
  try {
    const response = await getAdminShippingRates();
    const shippingZones: ShippingZoneRow[] = response.data.map((rate, index) => ({
      id: rate.documentId,
      title: rate.name,
      description: rate.description || "Tarifa configurada desde Strapi.",
      price: Number(rate.cost || 0),
      icon: index % 2 === 0 ? "map-pin" : "truck",
      highlighted: rate.active,
    }));
    return <AdminLogisticsClient shippingZones={shippingZones} saved={query.saved === "1"} notice={noticeFromQuery(query, "Tarifa guardada correctamente.")} />;
  } catch (error) {
    return (
      <AdminShell active="logistics">
        <AdminDataError title="No se pudieron cargar tarifas desde Strapi" error={error} permissions={["Shipping-rate: find/findOne/update"]} />
      </AdminShell>
    );
  }
}
