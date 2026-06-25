"use client";
// RUTA: src/features/admin/components/SubmitButton.tsx
// RUTA (archivo nuevo): src/features/admin/components/SubmitButton.tsx

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  // Ícono que se muestra cuando NO está enviando (ej. <Save size={17} />).
  // Mientras está enviando, ese ícono se reemplaza por un loader animado.
  icon?: ReactNode;
  // Texto que se muestra mientras se envía (por defecto "Guardando...").
  pendingText?: string;
};

/**
 * Reemplazo directo de un <button type="submit"> dentro de un <form
 * action={...}>. Debe ir DENTRO del <form> (como descendiente en el árbol de
 * React) para que useFormStatus pueda detectar su estado — no funciona si el
 * botón está afuera y solo asociado vía el atributo HTML form="algún-id".
 */
export default function SubmitButton({ children, icon, pendingText = "Guardando...", className, disabled, ...rest }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...rest}
      type={rest.type ?? "submit"}
      disabled={disabled || pending}
      aria-busy={pending}
      className={`${className ?? ""} ${pending ? "cursor-wait opacity-80" : ""}`.trim()}
    >
      {pending ? <Loader2 size={17} strokeWidth={2.2} className="animate-spin" /> : icon}
      {pending ? pendingText : children}
    </button>
  );
}