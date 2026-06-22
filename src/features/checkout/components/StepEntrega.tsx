import { Truck, Store } from "lucide-react";
import { CheckoutFormData, DeliveryMethod } from "@/src/features/checkout/types";

interface Props {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
}

export default function StepEntrega({
  formData,
  setFormData,
  deliveryMethod,
  setDeliveryMethod,
}: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-medium text-[#2D1F23] mb-8">
        Método de Entrega
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setDeliveryMethod("domicilio")}
          className={`flex flex-col items-center justify-center gap-2 py-6 rounded-[4px] border transition-all ${
            deliveryMethod === "domicilio"
              ? "border-[#C15074] bg-[#FCEDF0]/40 text-[#C15074]"
              : "border-[#F0E4E8] bg-white text-[#AC9CA0] hover:border-[#D4738F]"
          }`}
        >
          <Truck size={20} strokeWidth={2} />
          <span className="text-xs font-semibold">Envío a Domicilio</span>
        </button>
        <button
          onClick={() => setDeliveryMethod("sucursal")}
          className={`flex flex-col items-center justify-center gap-2 py-6 rounded-[4px] border transition-all ${
            deliveryMethod === "sucursal"
              ? "border-[#C15074] bg-[#FCEDF0]/40 text-[#C15074]"
              : "border-[#F0E4E8] bg-[#F9F7F8] text-[#AC9CA0] hover:border-[#D4738F]"
          }`}
        >
          <Store size={20} strokeWidth={2} />
          <span className="text-xs font-semibold">Recoger en Sucursal</span>
        </button>
      </div>

      {deliveryMethod === "domicilio" && (
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="direccion" className="text-xs text-[#554246]">Dirección de envío</label>
              <input
                id="direccion"
                type="text"
                placeholder="Ej. Calle Principal 123"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ciudad" className="text-xs text-[#554246]">Ciudad</label>
              <input
                id="ciudad"
                type="text"
                placeholder="Ej. Madrid"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="codigoPostal" className="text-xs text-[#554246]">Código Postal</label>
              <input
                id="codigoPostal"
                type="text"
                placeholder="Ej. 28001"
                value={formData.codigoPostal}
                onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="telefonoEntrega" className="text-xs text-[#554246]">Teléfono de contacto</label>
              <input
                id="telefonoEntrega"
                type="tel"
                placeholder="Ej. +34 600 000 000"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
              />
            </div>
          </div>


        </form>
      )}
    </div>
  );
}
