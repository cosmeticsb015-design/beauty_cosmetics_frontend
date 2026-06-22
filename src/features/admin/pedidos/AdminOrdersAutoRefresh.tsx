"use client";

import { useEffect, useRef } from "react";

// Chequeo liviano cada 8s: solo pregunta si hubo un pago nuevo confirmado.
const POLL_INTERVAL_MS = 8000;

type Watermark = { lastPaidAt: string | null; paidCount: number };

type AdminOrdersAutoRefreshProps = {
  paused?: boolean;
  onNewPayment: () => void;
};

export default function AdminOrdersAutoRefresh({ paused = false, onNewPayment }: AdminOrdersAutoRefreshProps) {
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const onNewPaymentRef = useRef(onNewPayment);
  onNewPaymentRef.current = onNewPayment;

  const lastKnownRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const checkForNewPayments = async () => {
      if (pausedRef.current) return;
      if (document.visibilityState !== "visible") return;

      try {
        const response = await fetch("/admin/pedidos/watermark", { cache: "no-store" });
        if (!response.ok) return;

        const data: Watermark = await response.json();
        const currentKey = `${data.lastPaidAt ?? ""}:${data.paidCount}`;

        if (!initializedRef.current) {
          // Primera lectura: solo guarda la línea base, no dispara refresh.
          lastKnownRef.current = currentKey;
          initializedRef.current = true;
          return;
        }

        if (currentKey !== lastKnownRef.current) {
          lastKnownRef.current = currentKey;
          if (!cancelled) onNewPaymentRef.current();
        }
      } catch {
        // Un fallo de red puntual no debe interrumpir el panel.
      }
    };

    const interval = window.setInterval(checkForNewPayments, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return null;
}