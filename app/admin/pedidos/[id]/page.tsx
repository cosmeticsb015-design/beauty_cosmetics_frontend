import Image from "next/image";
import Link from "next/link";
import { CreditCard, MessageSquareText, ReceiptText, Truck, UserRound, Zap } from "lucide-react";
import AdminShell from "../../components/AdminShell";
import AdminFlash, { noticeFromQuery } from "../../components/AdminFlash";
import { updateOrderStatusForm } from "../../actions";
import { getStrapiMediaUrl, type StrapiOrderItem } from "../../../services/admin";

function money(value?: number) {
  return new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(Number(value || 0));
}
function statusLabel(status: string) {
  if (status === "paid") return "Enviado";
  if (status === "failed" || status === "refunded") return "Finalizado";
  return "Pendiente de envio";
}
function statusClass(status: string) {
  if (status === "paid") return "bg-blue-100 text-blue-800";
  if (status === "failed" || status === "refunded") return "bg-emerald-100 text-emerald-800";
  return "bg-[#F5DDE5] text-[#9E3659]";
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

    return (
      <AdminShell active="orders">
        <main className="mx-auto w-full max-w-[1080px] px-4 py-9 md:px-8">
          <AdminFlash notice={noticeFromQuery(query, "Pedido actualizado correctamente.")} />
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[13px] text-[#554246]"><Link href="/admin/pedidos" className="transition-colors hover:text-[#9E3659]">Pedidos</Link><span>›</span><span className="font-semibold text-[#2D1F23]">Pedido {order.tracking_number}</span></div>
              <div className="flex flex-wrap items-center gap-5"><h2 className="text-[38px] font-bold leading-none text-[#1F1F22]">Pedido {order.tracking_number}</h2><span className={`rounded-full px-5 py-2 text-[14px] font-medium ${statusClass(order.payment_status)}`}>{statusLabel(order.payment_status)}</span></div>
              <p className="mt-3 text-[15px] text-[#6B6063]">Creado: {formatDate(order.createdAt)} · Expira: {formatDate(order.expires_at)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/admin/pedidos/export?order=${order.documentId}`} className="inline-flex h-11 items-center justify-center gap-3 rounded-[4px] border border-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-[#9E3659] transition-colors hover:bg-[#FCEDF0]">Exportar pedido</Link>
              <a href={customerWhatsapp ?? "#"} target="_blank" rel="noopener noreferrer" aria-disabled={!customerWhatsapp} className={`inline-flex h-11 items-center justify-center gap-3 rounded-[4px] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors ${customerWhatsapp ? "bg-[#9E3659] hover:bg-[#84304C]" : "pointer-events-none bg-[#B9A6AD]"}`}><MessageSquareText size={20} strokeWidth={1.8} />Chatear con Cliente</a>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-3">
            <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7"><div className="mb-5 flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]"><UserRound size={22} strokeWidth={1.8} /></span><p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Cliente</p></div><h3 className="text-[24px] font-bold text-[#1F1F22]">{order.customer_name}</h3><p className="mt-2 text-[16px] text-[#6B6063]">{order.customer_email}</p><p className="mt-1 text-[16px] text-[#6B6063]">{order.customer_phone}</p></article>
            <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7"><div className="mb-5 flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]"><Truck size={22} strokeWidth={1.8} /></span><p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Envio</p></div><h3 className="text-[18px] font-bold text-[#1F1F22]">{order.delivery_type === "pickup" ? order.branch?.name ?? "Retiro en sucursal" : order.address ?? "Direccion no definida"}</h3><p className="mt-8 flex items-center gap-2 text-[18px] text-[#6B6063]"><Zap size={18} strokeWidth={1.8} />{order.shipping_rate?.name ?? order.delivery_type} · {money(order.shipping_cost)}</p></article>
            <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7"><div className="mb-5 flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]"><ReceiptText size={22} strokeWidth={1.8} /></span><p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Pago</p></div><h3 className="flex items-center gap-2 text-[18px] font-bold text-[#1F1F22]"><CreditCard size={20} strokeWidth={1.9} />{order.wompi_transaction_id ?? "Sin transaccion"}</h3><p className="mt-3 flex items-center gap-2 text-[16px] font-semibold text-[#6B6063]"><span className="h-2 w-2 rounded-full bg-[#9E3659]" />{statusLabel(order.payment_status)}</p></article>
          </div>

          <section className="mt-7 rounded-[8px] border border-[#E7E4E5] bg-white p-7">
            <h3 className="text-[24px] font-bold text-[#1F1F22]">Actualizar estado de pago</h3>
            <form action={updateOrderStatusForm} className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
              <input type="hidden" name="id" value={order.documentId} />
              <select name="payment_status" defaultValue={order.payment_status === "paid" ? "sent" : order.payment_status === "failed" || order.payment_status === "refunded" ? "finalized" : "pending_shipping"} className="h-12 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[16px] outline-none focus:border-[#9E3659]"><option value="pending_shipping">Pendiente de envio</option><option value="sent">Enviado</option><option value="finalized">Finalizado</option></select>
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
