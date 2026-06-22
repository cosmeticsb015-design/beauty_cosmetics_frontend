export type AdminNotice = { type: "success" | "error"; message: string } | null;

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function noticeFromQuery(
  query: { saved?: string; error?: string; message?: string } = {},
  fallbackSuccess = "Cambios guardados correctamente."
): AdminNotice {
  const message = query.message ? safeDecodeURIComponent(query.message) : "";

  if (query.error === "1") {
    return {
      type: "error",
      message: message || "No se pudo completar la accion.",
    };
  }

  if (query.saved === "1") {
    return {
      type: "success",
      message: message || fallbackSuccess,
    };
  }

  return null;
}