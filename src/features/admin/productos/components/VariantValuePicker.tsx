"use client";
// RUTA (archivo nuevo): src/features/admin/productos/components/VariantValuePicker.tsx

import { useId, useState } from "react";
import { Palette } from "lucide-react";

type VariantValuePickerProps = {
  name?: string;
  formId?: string;
  defaultValue?: string;
  label?: string;
  required?: boolean;
};

const hexPattern = /^#[0-9A-Fa-f]{6}$/i;

export default function VariantValuePicker({ name = "value", formId, defaultValue = "", label = "Valor / Etiqueta Pública", required = false }: VariantValuePickerProps) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue);
  const isHex = hexPattern.test(value);
  // El <input type="color"> nativo siempre necesita un HEX válido de 6
  // dígitos para pintar el swatch, así que si el valor actual no es un color
  // (ej. "50ml" o "Talla M") el selector parte de un color neutro: elegir un
  // tono ahí simplemente sobrescribe el texto con el HEX elegido.
  const swatchSeed = isHex ? value : "#9E3659";

  return (
    <div>
      <span className="text-[15px] font-bold text-[#4B4E5A]">{label}</span>
      <div className="mt-3 flex items-stretch gap-3">
        <label
          htmlFor={inputId}
          className="relative flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[6px] border border-[#C8CEDB] shadow-inner"
          style={{ backgroundColor: isHex ? value : "#F1F2F4" }}
          title="Elegir color visualmente"
        >
          {!isHex ? <Palette size={18} strokeWidth={2} className="text-[#9AA3B2]" /> : null}
          <input
            id={inputId}
            type="color"
            value={swatchSeed}
            onChange={(event) => setValue(event.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Seleccionar color para el valor de la variante"
          />
        </label>
        <input
          name={name}
          form={formId}
          required={required}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ej. #9E3659, 50ml, Talla M"
          className="h-13 min-w-0 flex-1 rounded-[6px] border border-[#C8CEDB] bg-[#F8F9FB] px-5 text-[17px] outline-none focus:border-[#9E3659]"
        />
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-[#6B6063]">
        Haz clic en el cuadro para elegir un color visualmente (escribe el HEX automáticamente), o escribe a mano un valor sin color como &ldquo;50ml&rdquo; o &ldquo;Talla M&rdquo;.
      </p>
    </div>
  );
}
