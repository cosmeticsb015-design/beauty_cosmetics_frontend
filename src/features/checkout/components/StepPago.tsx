import { useEffect, useState } from "react";
import { Pencil, ShieldCheck, Truck } from "lucide-react";
import { CheckoutFormData } from "@/src/features/checkout/types";

interface Props {
  formData: CheckoutFormData;
  onEditStep: (step: number) => void;
}

export default function StepPago({ formData, onEditStep }: Props) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.items)) {
          setCartItems(parsed.items);
        }
      }
    } catch (e) {
      console.error("Error loading cart from localStorage", e);
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const TAX_RATE = 0.08;
  const taxes = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((subtotal + taxes).toFixed(2));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
      {/* Resumen de cliente */}
      <div className="bg-[#F9F7F8] rounded-[8px] p-6 relative">
        <button
          onClick={() => onEditStep(1)}
          className="absolute top-6 right-6 flex items-center gap-1.5 text-[#C15074] hover:text-[#9E3659] text-[11px] font-bold uppercase tracking-wider transition-colors"
        >
          <Pencil size={12} strokeWidth={2.5} /> Editar
        </button>
        <h2 className="text-base font-bold text-[#2D1F23] mb-4">Resumen de cliente</h2>
        <div className="flex flex-col gap-1.5 text-sm text-[#554246]">
          <p className="font-semibold text-[#2D1F23]">{formData.nombre}</p>
          <p>{formData.correo}</p>
          <p>{formData.telefono}</p>
        </div>
      </div>

      {/* Datos de entrega */}
      <div className="bg-[#F9F7F8] rounded-[8px] p-6 relative">
        <button
          onClick={() => onEditStep(2)}
          className="absolute top-6 right-6 flex items-center gap-1.5 text-[#C15074] hover:text-[#9E3659] text-[11px] font-bold uppercase tracking-wider transition-colors"
        >
          <Pencil size={12} strokeWidth={2.5} /> Editar
        </button>
        <h2 className="text-base font-bold text-[#2D1F23] mb-4">Datos de entrega</h2>
        <div className="flex flex-col gap-1.5 text-sm text-[#554246] mb-4">
          <p>{formData.direccion}</p>
          {formData.instrucciones && <p className="text-[#AC9CA0]">{formData.instrucciones}</p>}
          <p>
            {formData.ciudad}, {formData.codigoPostal}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#F0E4E8]/50 text-[#554246] px-3 py-1.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider">
          <Truck size={14} /> Envío Estándar (2-3 días hábiles)
        </div>
      </div>

      {/* Resumen de compra (Cargado de localStorage) */}
      <div className="bg-[#F9F7F8] rounded-[8px] p-6">
        <h2 className="text-base font-bold text-[#2D1F23] mb-4">Resumen de compra</h2>
        {cartItems.length === 0 ? (
          <p className="text-sm text-[#AC9CA0]">No hay productos en el carrito.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm text-[#554246] border-b border-[#F0E4E8] pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative shrink-0">
                    <div className="w-full h-full bg-[#FAF6F6] rounded-[6px] overflow-hidden border border-[#F0E4E8] flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px]">✨</span>
                      )}
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 bg-[#554246] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center z-10 shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D1F23]">{item.product_name}</p>
                    {item.variant_label && (
                      <p className="text-xs text-[#AC9CA0]">{item.variant_label}</p>
                    )}
                  </div>
                </div>
                <span className="font-bold text-[#2D1F23]">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-[#F0E4E8] flex justify-between items-center text-sm font-bold text-[#2D1F23]">
              <span>Total a pagar</span>
              <span className="text-base text-[#C15074]">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Método de Pago */}
      <div className="mt-4">
        <h2 className="text-lg font-bold text-[#2D1F23] mb-4">Método de Pago</h2>

        <div className="border border-[#C15074] rounded-[8px] p-5 flex gap-4 relative bg-white">
          <div className="pt-0.5">
            <div className="w-4 h-4 rounded-full border-4 border-[#C15074] bg-white flex items-center justify-center shadow-[0_0_0_1px_#C15074]" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-[#2D1F23] text-[15px]">Wompi</span>
                <span className="bg-[#F4F4F4] text-[#8A7A7E] text-[10px] px-2 py-0.5 rounded-[4px]">
                  Tarjetas, PSE, Nequi y más
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-[4px] text-[9px] font-bold tracking-widest uppercase">
                <ShieldCheck size={12} /> Pago Seguro
              </div>
            </div>
            <p className="text-[13px] text-[#554246] leading-relaxed max-w-[90%]">
              Serás redirigido a la pasarela de pagos segura de Wompi para completar tu transacción.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
