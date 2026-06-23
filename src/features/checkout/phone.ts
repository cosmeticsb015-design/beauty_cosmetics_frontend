export function formatSalvadoranPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const localDigits = digits.startsWith("503") ? digits.slice(3) : digits;
  const trimmedLocal = localDigits.slice(0, 8);
  return ["503", trimmedLocal.slice(0, 4), trimmedLocal.slice(4)].filter(Boolean).join(" ");
}
