import Link from "next/link";
import { ShieldAlert } from "lucide-react";

type AdminDataErrorProps = {
  title?: string;
  error: unknown;
  permissions?: string[];
};

export default function AdminDataError({
  title = "No se pudo cargar esta sección del panel",
  error,
  permissions = [],
}: AdminDataErrorProps) {
  const message = error instanceof Error ? error.message : "Error desconocido";

  return (
    <section className="mx-auto w-full max-w-[900px] px-4 py-12 md:px-8">
      <div className="rounded-[12px] border border-red-200 bg-white p-7 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-red-50 text-red-700">
            <ShieldAlert size={24} />
          </span>
          <div>
            <h2 className="text-[26px] font-bold text-[#1F1F22]">{title}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-[#6B6063]">
              Tu sesión ya existe, pero Strapi rechazó la consulta. Normalmente esto significa que el rol del usuario no tiene permisos para la colección o para relaciones pobladas.
            </p>
            <pre className="mt-4 max-h-[180px] overflow-auto rounded-[8px] bg-[#2D1F23] p-4 text-[12px] leading-relaxed text-white">
              {message}
            </pre>
            {permissions.length > 0 ? (
              <div className="mt-5 rounded-[8px] bg-[#FCEDF0] p-4">
                <p className="font-bold text-[#7D123B]">Permisos mínimos que debes activar en Strapi:</p>
                <ul className="mt-3 list-disc space-y-1 pl-6 text-[15px] text-[#554246]">
                  {permissions.map((permission) => (
                    <li key={permission}>{permission}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <Link href="/admin/login" className="mt-6 inline-flex rounded-[6px] bg-[#9E3659] px-5 py-3 text-[14px] font-bold text-white">
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
