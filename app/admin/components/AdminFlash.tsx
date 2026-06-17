export type AdminNotice = { type: "success" | "error"; message: string } | null;

export function noticeFromQuery(query: { saved?: string; error?: string; message?: string } = {}, fallbackSuccess = "Cambios guardados correctamente."): AdminNotice {
  const message = query.message ? decodeURIComponent(query.message) : "";
  if (query.error === "1") return { type: "error", message: message || "No se pudo completar la accion." };
  if (query.saved === "1") return { type: "success", message: message || fallbackSuccess };
  return null;
}

export default function AdminFlash({ notice }: { notice?: AdminNotice }) {
  if (!notice) return null;
  const tone = notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700";
  return <div className={`mb-6 rounded-[8px] border px-5 py-4 text-[15px] font-bold ${tone}`}>{notice.message}</div>;
}
