"use client";

import Link from "next/link";
import { Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const TAX_RATE = 0.08;

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  const taxes = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((subtotal).toFixed(2));

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-medium text-[#2D1F23] mb-10">
          Tu Carrito
        </h1>

        <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">

          {/* Left: Cart Items */}
          <div className="flex flex-col">
            {items.length === 0 ? (
              <div className="py-20 text-center text-[#AC9CA0]">
                <p className="text-base mb-4">Tu carrito está vacío.</p>
                <Link
                  href="/catalog"
                  className="text-sm font-semibold text-[#C15074] hover:underline"
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#F0E4E8]">
                {items.map((item) => {
                  const itemKey = `${item.product_id}-${item.variant_id || "none"}`;
                  return (
                    <div key={itemKey} className="flex items-center gap-5 py-6">

                      {/* Product thumbnail */}
                      <div
                        className="w-[64px] h-[64px] rounded-[6px] shrink-0 flex items-center justify-center overflow-hidden bg-[#FAF6F6]"
                        style={{ backgroundColor: item.bg || "#FAF6F6" }}
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-12 rounded bg-white/50 flex items-center justify-center text-xs text-[#C15074]/30">
                            ✨
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold tracking-widest text-[#C15074] uppercase mb-0.5">
                          {item.category || "CATÁLOGO"}
                        </p>
                        <p className="text-sm font-semibold text-[#2D1F23] leading-snug">
                          {item.product_name}
                        </p>
                        {item.variant_label && (
                          <p className="text-xs text-[#AC9CA0] mt-0.5">{item.variant_label}</p>
                        )}
                      </div>

                      {/* Qty counter */}
                      <div className="flex items-center gap-3 border border-[#F0E4E8] rounded-[4px] px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.variant_id, -1)}
                          className="text-[#2D1F23] hover:text-[#C15074] transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={13} strokeWidth={2} />
                        </button>
                        <span className="text-sm font-medium text-[#2D1F23] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.variant_id, 1)}
                          className="text-[#2D1F23] hover:text-[#C15074] transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={13} strokeWidth={2} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-[#2D1F23] w-16 text-right">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product_id, item.variant_id)}
                        className="text-[#D4A0B0] hover:text-[#C15074] transition-colors ml-1"
                        aria-label={`Eliminar ${item.product_name}`}
                      >
                        <Trash2 size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer row */}
            <div className="flex items-center justify-between mt-6 pt-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-[#554246] hover:text-[#C15074] transition-colors"
              >
                ← Continuar Comprando
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-[#AC9CA0]">
                <ShieldCheck size={14} strokeWidth={1.8} className="text-[#C15074]" />
                Compra 100% Segura
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white border border-[#F0E4E8] rounded-[12px] p-6 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-[#2D1F23] mb-2">
              Resumen del Pedido
            </h2>

            <div className="flex flex-col gap-3 text-sm border-b border-[#F0E4E8] pb-4">
              <div className="flex justify-between">
                <span className="text-[#8A7A7E]">Subtotal</span>
                <span className="font-medium text-[#2D1F23]">${subtotal.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-[#8A7A7E]">Envío</span>
                <span className="font-semibold text-green-600 text-xs">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A7A7E]">Impuestos</span>
                <span className="font-medium text-[#2D1F23]">${taxes.toFixed(2)}</span>
              </div> */}
            </div>

            <div className="flex justify-between text-sm font-bold text-[#2D1F23]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {items.length > 0 ? (
              <Link
                href="/checkout"
                id="checkout-btn"
                className="mt-4 w-full flex items-center justify-center bg-[#C15074] hover:bg-[#9E3659] active:scale-[0.98] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-[4px] transition-all duration-200"
              >
                FINALIZAR COMPRA
              </Link>
            ) : (
              <button
                disabled
                className="mt-4 w-full flex items-center justify-center bg-[#AC9CA0] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-[4px] cursor-not-allowed opacity-60"
              >
                CARRITO VACÍO
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
