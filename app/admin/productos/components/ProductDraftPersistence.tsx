"use client";

import { useEffect } from "react";

const DRAFT_KEY = "bc_admin_new_product_draft";
const SKIP_TYPES = new Set(["file", "submit", "button", "reset"]);

export default function ProductDraftPersistence() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>('form[data-product-draft="true"]');
    if (!form) return;

    try {
      const rawDraft = sessionStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft) as Record<string, string | boolean>;
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input[name], textarea[name], select[name]").forEach((field) => {
          if (field instanceof HTMLInputElement && SKIP_TYPES.has(field.type)) return;
          const value = draft[field.name];
          if (typeof value === "undefined") return;
          if (field instanceof HTMLInputElement && field.type === "checkbox") field.checked = Boolean(value);
          else field.value = String(value);
        });
      }
    } catch {}

    const saveDraft = () => {
      const draft: Record<string, string | boolean> = {};
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input[name], textarea[name], select[name]").forEach((field) => {
        if (field instanceof HTMLInputElement && SKIP_TYPES.has(field.type)) return;
        draft[field.name] = field instanceof HTMLInputElement && field.type === "checkbox" ? field.checked : field.value;
      });
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    };

    form.addEventListener("input", saveDraft);
    form.addEventListener("change", saveDraft);
    return () => {
      form.removeEventListener("input", saveDraft);
      form.removeEventListener("change", saveDraft);
    };
  }, []);

  return null;
}
