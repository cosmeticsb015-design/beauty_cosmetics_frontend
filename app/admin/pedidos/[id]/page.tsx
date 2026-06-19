import Image from "next/image";
import Link from "next/link";
import { CreditCard, MapPin, MessageSquareText, ReceiptText, Store, Truck, UserRound, Zap } from "lucide-react";
import AdminShell from "../../components/AdminShell";
import AdminFlash from "../../components/AdminFlash";
import { noticeFromQuery } from "../../components/AdminFlash.utils";
import { updateOrderStatusForm } from "../../actions";
import { getStrapiMediaUrl, type OrderFulfillmentStatus, type StrapiOrder, type StrapiOrderItem } from "../../../services/admin";

function money(value?: number) {
  return new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(Number(value || 0));
}
const paymentStatusLabel: Record<string, string> = {
  pending: "Pendiente de pago",
  paid: "Pagado",
  failed: "Pago fallido",
  refunded: "Reembolsado",
};

function fulfillmentStatus(order: StrapiOrder): string {
  return order.fulfillment_status ?? order.order_status ?? "pending_shipping";
}
function statusLabel(status: string) {
  if (status === "shipped") return "Enviado";
  if (status === "delivered") return "Entregado";
  return "Pendiente de envio";
}
function statusClass(status: string) {
  if (status === "shipped") return "bg-blue-100 text-blue-800";
  if (status === "delivered") return "bg-emerald-100 text-emerald-800";
  return "bg-[#F5DDE5] text-[#9E3659]";
}
function orderValue<K extends keyof Omit<StrapiOrder, "attributes">>(order: StrapiOrder, key: K) {
  return order[key] ?? order.attributes?.[key];
}
function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Sin fecha";
}

function whatsappHref(phone?: string | null) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.length === 8 ? `503${digits}` : digits;
  return `https://wa.me/${normalized}`;
}
function firstItemImage(item: StrapiOrderItem) {
  const image = item.product?.images?.[0]?.image;
  const formats = image?.formats as { thumbnail?: { url?: string }; small?: { url?: string } } | undefined;
  return getStrapiMediaUrl(formats?.thumbnail?.url ?? formats?.small?.url ?? image?.url);
}

function deliverySummary(order: StrapiOrder) {
  if (order.delivery_type === "pickup") {
    return {
      title: "Recoger en sucursal",
      primaryLabel: "Sucursal seleccionada",
      primaryValue: order.branch?.name ?? "Sucursal no definida",
      secondaryLabel: "Dirección de sucursal",
      secondaryValue: order.branch?.address ?? "Dirección no registrada",
      meta: "Retiro en tienda",
    };
  }

  return {
    title: "Envío a domicilio",
    primaryLabel: "Dirección de envío",
    primaryValue: order.address ?? "Dirección no definida",
    secondaryLabel: "Zona y tarifa seleccionada",
    secondaryValue: order.shipping_rate?.name ?? "Zona/Tarifa no definida",
    meta: order.shipping_rate?.description ?? "Entrega configurada por zona",
  };
}

function ItemThumb({ src }: { src: string | null }) {
  if (src) return <Image src={src} alt="Producto del pedido" width={56} height={72} className="h-18 w-14 rounded-[3px] object-cover" />;
  return (
    <div className="relative h-16 w-12 overflow-hidden rounded-[3px] bg-[linear-gradient(135deg,#3b2618,#f7f1ed_58%,#6e4b34)]">
      <div className="absolute bottom-2 left-1/2 h-8 w-4 -translate-x-1/2 rounded-t-[3px] bg-white/85 shadow-sm" />
      <div className="absolute bottom-10 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#2D1F23]/50" />
    </div>
  );
}

export default async function AdminOrderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const { getAdminOrder } = await import("../../../services/admin");
  const { default: AdminDataError } = await import("../../components/AdminDataError");
  try {
    const response = await getAdminOrder(id);
    const order = response.data;
    const total = Number(order.total ?? Number(order.subtotal || 0) + Number(order.shipping_cost || 0));
    const customerWhatsapp = whatsappHref(order.customer_phone);
    const items = (order.items ?? []).map((item, index) => ({
      name: item.product_name,
      volume: item.variant_label ?? item.variant?.label ?? "Sin variante",
      sku: item.product?.slug ?? `ITEM-${index + 1}`,
      price: money(item.unit_price),
      quantity: item.quantity,
      subtotal: money(Number(item.unit_price || 0) * Number(item.quantity || 0)),
      image: firstItemImage(item),
      branch: item.branch_stock?.branch?.name,
    }));
    const orderStatus = fulfillmentStatus(order);
    const transactionId = orderValue(order, "wompi_transaction_id");
    const wompiStatus = orderValue(order, "wompi_transaction_status");
    const paymentMethod = orderValue(order, "wompi_payment_method");
    const authorizationCode = orderValue(order, "wompi_authorization_code");
    const transactionMessage = orderValue(order, "wompi_transaction_message");
    const paymentStatus = orderValue(order, "wompi_payment_status") ?? orderValue(order, "payment_status");
    const delivery = deliverySummary(order);

    return (
      <AdminShell active="orders">
        <main className="mx-auto w-full max-w-[1080px] px-4 py-9 md:px-8">
          <AdminFlash notice={noticeFromQuery(query, "Pedido actualizado correctamente.")} />
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[13px] text-[#554246]"><Link href="/admin/pedidos" className="transition-colors hover:text-[#9E3659]">Pedidos</Link><span>›</span><span className="font-semibold text-[#2D1F23]">Pedido {order.tracking_number}</span></div>
              <div className="flex flex-wrap items-center gap-5"><h2 className="text-[38px] font-bold leading-none text-[#1F1F22]">Pedido {order.tracking_number}</h2><span className={`rounded-full px-5 py-2 text-[14px] font-medium ${statusClass(orderStatus)}`}>{statusLabel(orderStatus)}</span></div>
              <p className="mt-3 text-[15px] text-[#6B6063]">Creado: {formatDate(order.createdAt)} · Expira: {formatDate(order.expires_at)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/admin/pedidos/export?order=${order.documentId}`} className="inline-flex h-11 items-center justify-center gap-3 rounded-[4px] border border-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-[#9E3659] transition-colors hover:bg-[#FCEDF0]">Exportar pedido</Link>
              <a href={customerWhatsapp ?? "#"} target="_blank" rel="noopener noreferrer" aria-disabled={!customerWhatsapp} className={`inline-flex h-11 items-center justify-center gap-3 rounded-[4px] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors ${customerWhatsapp ? "bg-[#9E3659] hover:bg-[#84304C]" : "pointer-events-none bg-[#B9A6AD]"}`}><MessageSquareText size={20} strokeWidth={1.8} />Chatear con Cliente</a>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-3">
            <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7"><div className="mb-5 flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]"><UserRound size={22} strokeWidth={1.8} /></span><p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Cliente</p></div><h3 className="text-[24px] font-bold text-[#1F1F22]">{order.customer_name}</h3><p className="mt-2 text-[16px] text-[#6B6063]">{order.customer_email}</p><p className="mt-1 text-[16px] text-[#6B6063]">{order.customer_phone}</p></article>
            <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7">
              <div className="mb-5 flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]">{order.delivery_type === "pickup" ? <Store size={22} strokeWidth={1.8} /> : <Truck size={22} strokeWidth={1.8} />}</span>
                <p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Envio</p>
              </div>
              <h3 className="text-[18px] font-bold text-[#1F1F22]">{delivery.title}</h3>
              <div className="mt-5 space-y-4 text-[15px] text-[#6B6063]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9E3659]">{delivery.primaryLabel}</p>
                  <p className="mt-1 flex items-start gap-2 text-[16px] font-semibold text-[#1F1F22]"><MapPin size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#9E3659]" />{delivery.primaryValue}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9E3659]">{delivery.secondaryLabel}</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#1F1F22]">{delivery.secondaryValue}</p>
                  <p className="mt-1 text-[14px] text-[#6B6063]">{delivery.meta}</p>
                </div>
                <p className="flex items-center gap-2 text-[17px] text-[#6B6063]"><Zap size={18} strokeWidth={1.8} />Costo: {money(order.shipping_cost)}</p>
              </div>
            </article>
            <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7">
              <div className="mb-5 flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]"><ReceiptText size={22} strokeWidth={1.8} /></span>
                <h3 className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Pago</h3>
              </div>
              <div className="space-y-4 text-[14px] text-[#6B6063]">
                <p className="break-all">
                  <strong className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#9E3659]"><CreditCard size={16} strokeWidth={1.9} />Transacción</strong>
                  <span className="mt-1 block font-semibold text-[#1F1F22]">{transactionId || "Sin transacción"}</span>
                </p>
                <p>
                  <strong className="text-[11px] uppercase tracking-[0.14em] text-[#9E3659]">Estado Wompi</strong>
                  <span className="mt-1 block font-semibold text-[#1F1F22]">{wompiStatus || "No registrado"}</span>
                </p>
                <p>
                  <strong className="text-[11px] uppercase tracking-[0.14em] text-[#9E3659]">Método</strong>
                  <span className="mt-1 block font-semibold text-[#1F1F22]">{paymentMethod || "No registrado"}</span>
                </p>
                <p>
                  <strong className="text-[11px] uppercase tracking-[0.14em] text-[#9E3659]">Autorización</strong>
                  <span className="mt-1 block font-semibold text-[#1F1F22]">{authorizationCode || "No registrado"}</span>
                </p>
                <p>
                  <strong className="text-[11px] uppercase tracking-[0.14em] text-[#9E3659]">Mensaje</strong>
                  <span className="mt-1 block font-semibold text-[#1F1F22]">{transactionMessage || "No registrado"}</span>
                </p>
                <p>
                  <strong className="text-[11px] uppercase tracking-[0.14em] text-[#9E3659]">Estado de pago</strong>
                  <span className="mt-1 flex items-center gap-2 font-semibold text-[#1F1F22]"><span className="h-2 w-2 rounded-full bg-[#9E3659]" />{paymentStatusLabel[String(paymentStatus)] ?? paymentStatus}</span>
                </p>
              </div>
            </article>
          </div>

          <section className="mt-7 rounded-[8px] border border-[#E7E4E5] bg-white p-7">
            <h3 className="text-[24px] font-bold text-[#1F1F22]">Actualizar estado del pedido</h3>
            <form action={updateOrderStatusForm} className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
              <input type="hidden" name="id" value={order.documentId} />
              <select name="order_status" defaultValue={orderStatus as OrderFulfillmentStatus} className="h-12 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[16px] outline-none focus:border-[#9E3659]"><option value="pending_shipping">Pendiente de envio</option><option value="shipped">Enviado</option><option value="delivered">Entregado</option></select>
              <button className="h-12 rounded-[4px] bg-[#9E3659] px-8 text-[15px] font-semibold text-white transition-colors hover:bg-[#84304C]">Guardar cambios</button>
            </form>
          </section>

          <section className="mt-7 overflow-hidden rounded-[8px] border border-[#E7E4E5] bg-white">
            <div className="border-b border-[#E7E4E5] px-7 py-6"><h3 className="text-[24px] font-bold text-[#1F1F22]">Productos del pedido</h3></div>
            {items.map((item) => <div key={`${item.sku}-${item.name}`} className="grid gap-5 border-b border-[#E7E4E5] px-7 py-5 last:border-b-0 md:grid-cols-[auto_1fr_auto]"><ItemThumb src={item.image} /><div><p className="text-[17px] font-bold text-[#1F1F22]">{item.name}</p><p className="text-[15px] text-[#6B6063]">{item.volume} · SKU {item.sku}</p><p className="text-[15px] text-[#6B6063]">Cantidad: {item.quantity}{item.branch ? ` · Stock: ${item.branch}` : ""}</p></div><div className="text-right"><p className="text-[16px] text-[#6B6063]">{item.price}</p><p className="text-[18px] font-bold text-[#1F1F22]">{item.subtotal}</p></div></div>)}
            <div className="bg-[#F8F8F9] px-7 py-6 text-right text-[16px] text-[#554246]"><p>Subtotal: <span className="font-bold text-[#1F1F22]">{money(order.subtotal)}</span></p><p>Envio: <span className="font-bold text-[#1F1F22]">{money(order.shipping_cost)}</span></p><p className="mt-2 text-[24px] font-bold text-[#1F1F22]">Total: {money(total)}</p></div>
          </section>
        </main>
      </AdminShell>
    );
  } catch (error) {
    return <AdminShell active="orders"><AdminDataError title="No se pudo cargar el pedido desde Strapi" error={error} permissions={["Order: findOne/update", "Order-item: find/findOne", "Branch: find/findOne", "Shipping-rate: find/findOne", "Product: find/findOne", "Variant-option: find/findOne"]} /></AdminShell>;
  }
}
