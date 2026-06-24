"use client";
// RUTA: src/features/admin/productos/components/VariantColorPicker.tsx

import { useId, useState } from "react";
import { Palette } from "lucide-react";

type VariantColorPickerProps = {
  initialColor?: string;
  name?: string;
  formId?: string;
};

const hexPattern = /^#[0-9A-Fa-f]{6}$/;

export default function VariantColorPicker({ initialColor = "#9E3659", name = "value", formId }: VariantColorPickerProps) {
  const inputId = useId();
  const [color, setColor] = useState(initialColor);
  const [draftColor, setDraftColor] = useState(initialColor.toUpperCase());

  const updateColor = (nextColor: string) => {
    const normalizedColor = nextColor.toUpperCase();
    setColor(normalizedColor);
    setDraftColor(normalizedColor);
  };

  return (
    <div>
      <span className="text-[15px] font-bold tracking-wide text-[#6B6063]">Color de la Variante</span>

      <div className="mt-3 grid gap-4 rounded-[10px] border border-[#E7BFC9] bg-[#FFFCFC] p-4 sm:grid-cols-[140px_1fr]">
        <label
          htmlFor={inputId}
          className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[8px] border border-[#E7BFC9] shadow-inner"
          style={{ backgroundColor: color }}
        >
          <input
            id={inputId}
            name={name}
            form={formId}
            type="color"
            value={color}
            onChange={(event) => updateColor(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span className="rounded-full bg-white/90 p-3 text-[#9E3659] shadow-sm">
            <Palette size={24} strokeWidth={2} />
          </span>
          <span className="mt-3 rounded-full bg-white/90 px-3 py-1 text-[12px] font-bold text-[#1F1F22] shadow-sm">
            Elegir color
          </span>
        </label>

        <div className="flex flex-col justify-center">
          <label htmlFor={`${inputId}-hex`} className="text-[13px] font-bold uppercase tracking-wide text-[#6B6063]">
            Valor HEX
          </label>
          <input
            id={`${inputId}-hex`}
            value={draftColor}
            onChange={(event) => {
              const nextValue = event.target.value.toUpperCase();
              setDraftColor(nextValue);
              if (hexPattern.test(nextValue)) setColor(nextValue);
            }}
            onBlur={() => {
              if (!hexPattern.test(draftColor)) setDraftColor(color);
            }}
            className="mt-2 h-12 rounded-[6px] border border-[#E7BFC9] bg-white px-4 text-[17px] font-semibold text-[#1F1F22] outline-none focus:border-[#9E3659]"
          />
          <p className="mt-3 text-[13px] leading-relaxed text-[#6B6063]">
            Usa el selector visual para elegir cualquier tono. El código se actualiza automáticamente para integrarlo con catálogo e inventario.
          </p>
        </div>
      </div>
    </div>
  );
}