"use client";

import Link from "next/link";
import { CheckCircle, MapPin, Truck } from "lucide-react";

// Mock data
const orderItems = [
  {
    id: 1,
    category: "CUIDADO",
    name: "Glow Essence Vitamin C",
    qty: 1,
    price: 45.00,
    bg: "#F5F0EB",
  },
  {
    id: 2,
    category: "MAQUILLAJE",
    name: "Velvet Matte - Rose Noire",
    qty: 2,
    price: 56.00,
    bg: "#EAEAEA",
  }
];

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFD] pb-24">
      
      {/* ── Header ── */}
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#D4738F] rounded-[16px] flex items-center justify-center text-white mb-6 shadow-sm">
          <CheckCircle size={32} strokeWidth={2} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-medium text-[#C15074] mb-3">
          ¡Gracias por tu compra, Elena!
        </h1>
        <p className="text-[#8A7A7E] text-sm md:text-base mb-8">
          Tu pedido ha sido procesado con éxito y pronto estará en tus manos.
        </p>
        
        <div className="inline-flex items-center gap-2 bg-[#F0E4E8]/50 text-[#554246] px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase border border-[#F0E4E8]">
          <span>PEDIDO #BC-82934</span>
          <span className="text-[#D4738F]">•</span>
          <span>24 de Mayo, 2024</span>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          
          {/* Left Column: Products Summary */}
          <div className="w-full lg:w-[480px]">
            <h2 className="text-lg font-bold text-[#2D1F23] mb-6">Resumen de productos</h2>
            
            <div className="flex flex-col gap-4 mb-8">
              {orderItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-[8px] flex items-center gap-4 shadow-sm border border-[#F0E4E8]/60">
                  <div className="w-16 h-16 rounded-[4px] relative flex items-center justify-center shrink-0" style={{ backgroundColor: item.bg }}>
                     <div className="w-6 h-10 bg-white/60 rounded-[2px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-[#D4738F] uppercase mb-1">
                      {item.category}
                    </p>
                    <p className="text-[13px] font-bold text-[#2D1F23] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#AC9CA0] mt-0.5">Cantidad: {item.qty}</p>
                  </div>
                  <span className="text-[13px] font-bold text-[#2D1F23]">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-sm mb-6 px-2">
              <div className="flex justify-between items-center text-[#554246]">
                <span>Subtotal</span>
                <span>$101.00</span>
              </div>
              <div className="flex justify-between items-center text-[#554246]">
                <span>Envío</span>
                <span className="text-[#2E7D32] font-medium">Gratis</span>
              </div>
            </div>

            <div className="h-px bg-[#F0E4E8] mb-6 mx-2" />

            <div className="flex justify-between items-center px-2">
              <span className="text-xl font-bold text-[#2D1F23]">Total</span>
              <span className="text-2xl font-black text-[#2D1F23]">$101.00</span>
            </div>
          </div>

          {/* Right Column: Delivery Details */}
          <div className="w-full lg:w-[320px] flex flex-col gap-4 pt-[46px]">
            
            <div className="bg-[#F9F7F8] border border-[#F0E4E8] rounded-[8px] p-6 shadow-sm">
              <h3 className="text-[10px] font-bold tracking-[0.15em] text-[#8A7A7E] uppercase mb-4 pb-4 border-b border-[#F0E4E8]">
                DETALLES DE ENTREGA
              </h3>
              
              <div className="flex gap-3 mb-6">
                <MapPin size={16} className="text-[#C15074] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[13px] text-[#554246]">
                  <span className="font-bold text-[#2D1F23]">Dirección de envío</span>
                  <span>Calle de Velázquez, 45, 4ºB</span>
                  <span>28001 Madrid, España</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Truck size={16} className="text-[#C15074] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[13px] text-[#554246]">
                  <span className="font-bold text-[#2D1F23]">Método de envío</span>
                  <span>Premium Express (24-48h)</span>
                </div>
              </div>
            </div>

            <Link 
              href="/catalog" 
              className="w-full flex items-center justify-center bg-transparent border border-[#2D1F23] text-[#2D1F23] hover:bg-[#2D1F23] hover:text-white transition-colors duration-200 text-[11px] font-bold tracking-widest uppercase py-4 rounded-[4px] mt-2"
            >
              VOLVER A LA TIENDA
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
