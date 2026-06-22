"use client";

import Link from "next/link";
import { Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCart } from "@/src/shared/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const total = parseFloat(subtotal.toFixed(2));

  return (
    <main className="min-h-screen overflow-x-hidden bg-white px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-8 text-3xl font-medium text-[#2D1F23] sm:mb-10 md:text-4xl">
          Tu Carrito
        </h1>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <section className="min-w-0" aria-label="Productos en el carrito">
            {items.length === 0 ? (
              <div className="rounded-[12px] border border-[#F0E4E8] px-4 py-16 text-center text-[#AC9CA0] sm:py-20">
                <p className="mb-4 text-base">Tu carrito está vacío.</p>
                <Link
                  href="/catalog"
                  className="text-sm font-semibold text-[#C15074] hover:underline"
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <div className="flex min-w-0 flex-col divide-y divide-[#F0E4E8]">
                {items.map((item) => {
                  const itemKey = `${item.product_id}-${item.variant_id || "none"}`;
                  return (
                    <article
                      key={itemKey}
                      className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[76px_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:py-6"
                    >
                      <div
                        className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#FAF6F6] sm:h-[76px] sm:w-[76px]"
                        style={{ backgroundColor: item.bg || "#FAF6F6" }}
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-8 items-center justify-center rounded bg-white/50 text-xs text-[#C15074]/30">
                            ✨
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 self-center">
                        <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-widest text-[#C15074]">
                          {item.category || "CATÁLOGO"}
                        </p>
                        <p className="break-words text-sm font-semibold leading-snug text-[#2D1F23]">
                          {item.product_name}
                        </p>
                        {item.variant_label && (
                          <p className="mt-1 truncate text-xs text-[#AC9CA0]">{item.variant_label}</p>
                        )}
                      </div>

                      <div className="col-span-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:col-span-1 sm:flex sm:justify-end sm:gap-4">
                        <div className="flex w-fit items-center gap-3 rounded-[6px] border border-[#F0E4E8] px-3 py-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.variant_id, -1)}
                            className="touch-manipulation p-1 text-[#2D1F23] transition-colors hover:text-[#C15074]"
                            aria-label="Reducir cantidad"
                          >
                            <Minus size={13} strokeWidth={2} />
                          </button>
                          <span className="w-5 text-center text-sm font-medium text-[#2D1F23]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.variant_id, 1)}
                            className="touch-manipulation p-1 text-[#2D1F23] transition-colors hover:text-[#C15074]"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={13} strokeWidth={2} />
                          </button>
                        </div>

                        <span className="justify-self-end whitespace-nowrap text-sm font-bold text-[#2D1F23] sm:min-w-16 sm:text-right">
                          ${(item.unit_price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.product_id, item.variant_id)}
                          className="justify-self-end rounded-full p-2 text-[#D4A0B0] transition-colors hover:bg-[#FAF6F6] hover:text-[#C15074]"
                          aria-label={`Eliminar ${item.product_name}`}
                        >
                          <Trash2 size={17} strokeWidth={1.8} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-[#554246] transition-colors hover:text-[#C15074]"
              >
                ← Continuar Comprando
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-[#AC9CA0]">
                <ShieldCheck size={14} strokeWidth={1.8} className="shrink-0 text-[#C15074]" />
                <span>Compra 100% Segura</span>
              </div>
            </div>
          </section>

          <aside className="w-full rounded-[12px] border border-[#F0E4E8] bg-white p-5 shadow-[0_8px_24px_rgba(45,31,35,0.04)] sm:p-6 lg:sticky lg:top-28" aria-label="Resumen del pedido">
            <h2 className="mb-2 text-base font-semibold text-[#2D1F23]">
              Resumen del Pedido
            </h2>

            <div className="flex flex-col gap-3 border-b border-[#F0E4E8] pb-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#8A7A7E]">Subtotal</span>
                <span className="font-medium text-[#2D1F23]">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-4 text-sm font-bold text-[#2D1F23]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {items.length > 0 ? (
              <Link
                href="/checkout"
                id="checkout-btn"
                className="mt-6 flex w-full items-center justify-center rounded-[6px] bg-[#C15074] py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 hover:bg-[#9E3659] active:scale-[0.98]"
              >
                FINALIZAR COMPRA
              </Link>
            ) : (
              <button
                disabled
                className="mt-6 flex w-full cursor-not-allowed items-center justify-center rounded-[6px] bg-[#AC9CA0] py-4 text-xs font-bold uppercase tracking-widest text-white opacity-60"
              >
                CARRITO VACÍO
              </button>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
