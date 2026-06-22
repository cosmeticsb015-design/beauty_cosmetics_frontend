import { CheckoutFormData } from "@/src/features/checkout/types";

interface Props {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
}

export default function StepDatos({ formData, setFormData }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-medium text-[#2D1F23] mb-2">
        Información de Contacto
      </h1>
      <p className="text-sm text-[#AC9CA0] mb-8">
        Por favor, ingrese sus datos para continuar con la compra.
      </p>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="nombre" className="text-xs text-[#554246]">Nombre Completo</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej. Jane Doe"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="correo" className="text-xs text-[#554246]">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="telefono" className="text-xs text-[#554246]">Teléfono de contacto</label>
          <input
            id="telefono"
            type="tel"
            placeholder="Ej. +52 55 1234 5678"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
          />
        </div>
      </form>
    </div>
  );
}
