"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PasswordFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
};

export default function PasswordField({
  name,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  required,
  maxLength = 256,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="block text-[14px] font-bold text-[#4B4E5A]">{label}</label>
      <div className="relative mt-2">
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-[6px] border border-[#C8CEDB] px-4 pr-12 outline-none focus:border-[#9E3659]"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7378] transition-colors hover:text-[#9E3659]"
        >
          {visible ? <EyeOff size={19} strokeWidth={1.8} /> : <Eye size={19} strokeWidth={1.8} />}
        </button>
      </div>
    </div>
  );
}