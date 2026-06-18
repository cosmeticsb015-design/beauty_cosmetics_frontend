"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Clock, XCircle, MapPin, Truck } from "lucide-react";
import { strapi } from "../../lib/api";
import { useCart } from "../../context/CartContext";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337").replace(/\/$/, "");

type StrapiImage = {
  url?: string | null;
  formats?: { thumbnail?: { url?: string | null }; small?: { url?: string | null } } | null;
  alternativeText?: string | null;
};

type ProductImageRelation = { image?: StrapiImage | null };

function mediaUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function orderItemImageUrl(item: PublicOrderItem) {
  const image = item.image ?? item.product_image ?? item.product?.images?.[0]?.image ?? null;
  return mediaUrl(image?.formats?.thumbnail?.url ?? image?.formats?.small?.url ?? image?.url ?? item.image_url);
}

interface PublicOrderItem {
  product_name: string;
  variant_label?: string | null;
  unit_price: number;
  quantity: number;
  image_url?: string | null;
  image?: StrapiImage | null;
  product_image?: StrapiImage | null;
  product?: { images?: ProductImageRelation[] | null } | null;
}

interface PublicOrder {
  tracking_number: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  customer_name: string;
  customer_email: string;
  delivery_type: "delivery" | "pickup";
  address?: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  branch?: { name: string; address: string } | null;
  shipping_rate?: { name: string } | null;
  items: PublicOrderItem[];
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<StatusScreen kind="loading" />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const trackingNumber = searchParams.get("tracking_number");

  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const cartClearedRef = useRef(false);

  useEffect(() => {
    const identifier = orderId || trackingNumber;

    if (!identifier) {
      window.setTimeout(() => {
        setError("No se encontró información del pedido.");
        setLoading(false);
      }, 0);
      return;
    }

    let cancelled = false;
    window.setTimeout(() => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
    }, 0);

    strapi
      .get<{ data: PublicOrder }>(`orders/public/${identifier}`)
      .then((response) => {
        if (!cancelled) setOrder(response.data);
      })
      .catch(() => {
        if (!cancelled) setError("No pudimos encontrar los detalles de tu pedido.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, trackingNumber]);

  useEffect(() => {
    if (order?.payment_status === "paid" && !cartClearedRef.current) {
      cartClearedRef.current = true;
      clearCart();
    }
  }, [clearCart, order?.payment_status]);

  if (loading) return <StatusScreen kind="loading" />;
  if (error || !order) return <StatusScreen kind="error" message={error} />;

  if (order.payment_status === "paid") return <OrderSummary order={order} kind="paid" />;
  if (order.payment_status === "pending") return <OrderSummary order={order} kind="pending" />;
  return <OrderSummary order={order} kind="failed" />;
}

function StatusScreen({ kind, message }: { kind: "loading" | "error"; message?: string | null }) {
  return (
    <div className="min-h-screen bg-[#FDFCFD] flex flex-col items-center justify-center text-center px-4">
      {kind === "loading" ? (
        <p className="text-[#8A7A7E] text-sm">Cargando los detalles de tu pedido…</p>
      ) : (
        <>
          <div className="w-16 h-16 bg-[#9E3659] rounded-[16px] flex items-center justify-center text-white mb-6 shadow-sm">
            <XCircle size={32} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-medium text-[#C15074] mb-3">No pudimos cargar tu pedido</h1>
          <p className="text-[#8A7A7E] text-sm mb-8 max-w-md">
            {message || "Verifica el enlace o contáctanos si el problema persiste."}
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center bg-[#C15074] text-white text-[11px] font-bold tracking-widest uppercase py-3 px-8 rounded-[4px]"
          >
            VOLVER A LA TIENDA
          </Link>
        </>
      )}
    </div>
  );
}

function OrderSummary({ order, kind }: { order: PublicOrder; kind: "paid" | "pending" | "failed" }) {
  const headerByKind = {
    paid: {
      icon: <CheckCircle size={32} strokeWidth={2} />,
      iconBg: "#C15074",
      title: `¡Gracias por tu compra, ${order.customer_name}!`,
      subtitle: "Tu pedido ha sido procesado con éxito y pronto estará en tus manos.",
    },
    pending: {
      icon: <Clock size={32} strokeWidth={2} />,
      iconBg: "#D9A23B",
      title: "Estamos confirmando tu pago",
      subtitle: "Tu pedido fue registrado y está esperando la confirmación de Wompi. Te avisaremos por correo apenas se confirme.",
    },
    failed: {
      icon: <XCircle size={32} strokeWidth={2} />,
      iconBg: "#9E3659",
      title: "No pudimos confirmar tu pago",
      subtitle: "El pago no se completó. Puedes intentarlo de nuevo desde el carrito.",
    },
  }[kind];

  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-12 flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-[16px] flex items-center justify-center text-white mb-6 shadow-sm"
          style={{ backgroundColor: headerByKind.iconBg }}
        >
          {headerByKind.icon}
        </div>

        <h1 className="text-3xl md:text-4xl font-medium text-[#C15074] mb-3">{headerByKind.title}</h1>
        <p className="text-[#8A7A7E] text-sm md:text-base mb-8">{headerByKind.subtitle}</p>

        <div className="inline-flex items-center gap-2 bg-[#F0E4E8]/50 text-[#554246] px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase border border-[#F0E4E8]">
          <span>PEDIDO #{order.tracking_number}</span>
          <span className="text-[#D4738F]">•</span>
          <span>{kind === "paid" ? "PAGADO" : kind === "pending" ? "PENDIENTE" : "NO COMPLETADO"}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          <div className="w-full lg:w-[480px]">
            <h2 className="text-lg font-bold text-[#2D1F23] mb-6">Resumen de productos</h2>

            <div className="flex flex-col gap-4 mb-8">
              {order.items.map((item, index) => {
                const imageUrl = orderItemImageUrl(item);
                return (
                  <div
                    key={`${item.product_name}-${index}`}
                    className="bg-white p-4 rounded-[8px] flex items-center gap-4 shadow-sm border border-[#F0E4E8]/60"
                  >
                    <div className="w-16 h-16 rounded-[4px] relative flex items-center justify-center shrink-0 overflow-hidden bg-[#F5F0EB] border border-[#F0E4E8]">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={item.product_name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-6 h-10 bg-white/60 rounded-[2px]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.variant_label && (
                        <p className="text-[9px] font-bold tracking-[0.15em] text-[#D4738F] uppercase mb-1">
                          {item.variant_label}
                        </p>
                      )}
                      <p className="text-[13px] font-bold text-[#2D1F23] truncate">{item.product_name}</p>
                      <p className="text-[11px] text-[#AC9CA0] mt-0.5">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="text-[13px] font-bold text-[#2D1F23]">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 text-sm mb-6 px-2">
              <div className="flex justify-between items-center text-[#554246]">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.delivery_type === "delivery" && (
                <div className="flex justify-between items-center text-[#554246]">
                  <span>Envío</span>
                  <span className={order.shipping_cost === 0 ? "text-[#2E7D32] font-medium" : ""}>
                    {order.shipping_cost === 0 ? "Gratis" : `$${order.shipping_cost.toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-[#F0E4E8] mb-6 mx-2" />

            <div className="flex justify-between items-center px-2">
              <span className="text-xl font-bold text-[#2D1F23]">Total</span>
              <span className="text-2xl font-black text-[#2D1F23]">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="w-full lg:w-[320px] flex flex-col gap-4 pt-[46px]">
            <div className="bg-[#F9F7F8] border border-[#F0E4E8] rounded-[8px] p-6 shadow-sm">
              <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#8A7A7E] uppercase mb-4 pb-4 border-b border-[#F0E4E8]">
                DETALLES DE ENTREGA
              </h3>

              {order.delivery_type === "delivery" ? (
                <div className="flex gap-3">
                  <MapPin size={16} className="text-[#C15074] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 text-[13px] text-[#554246]">
                    <span className="font-bold text-[#2D1F23]">Dirección de envío</span>
                    <span>{order.address || "Sin dirección registrada"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Truck size={16} className="text-[#C15074] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1 text-[13px] text-[#554246]">
                    <span className="font-bold text-[#2D1F23]">Retiro en sucursal</span>
                    <span>{order.branch?.name || "Sucursal asignada"}</span>
                    {order.branch?.address && <span>{order.branch.address}</span>}
                  </div>
                </div>
              )}
            </div>

            {kind === "failed" ? (
              <Link
                href="/cart"
                className="w-full flex items-center justify-center bg-[#C15074] text-white hover:bg-[#9E3659] transition-colors duration-200 text-[11px] font-bold tracking-widest uppercase py-4 rounded-[4px] mt-2"
              >
                INTENTAR DE NUEVO
              </Link>
            ) : (
              <Link
                href="/catalog"
                className="w-full flex items-center justify-center bg-transparent border border-[#2D1F23] text-[#2D1F23] hover:bg-[#2D1F23] hover:text-white transition-colors duration-200 text-[11px] font-bold tracking-widest uppercase py-4 rounded-[4px] mt-2"
              >
                VOLVER A LA TIENDA
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}