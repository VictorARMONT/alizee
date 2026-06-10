"use client";

import { useEffect, useState } from "react";

/**
 * Fecha-tope de pedido. PLACEHOLDER hasta que ops confirme tiempos reales
 * de impresión 3D + ensamblaje + envío.
 *  [CONFIRMAR] — cambia este ISO y todo lo demás se ajusta solo.
 */
export const ORDER_DEADLINE_ISO = "2026-06-15T23:59:00-06:00"; // CDMX (UTC-6)

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function compute(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds, expired: false };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown({ onDark = false }: { onDark?: boolean }) {
  const target = new Date(ORDER_DEADLINE_ISO).getTime();
  const [t, setT] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setT(compute(target));
    const id = setInterval(() => setT(compute(target)), 1_000);
    return () => clearInterval(id);
  }, [target]);

  const mutedStyle = onDark
    ? { color: "rgba(255,255,255,0.7)" }
    : { color: "var(--brand-fg-muted)" };

  if (!t) {
    return (
      <span className="text-[10px] uppercase tracking-[0.22em]" style={mutedStyle}>
        Pedidos hasta 15 jun
      </span>
    );
  }

  if (t.expired) {
    return (
      <span className="text-[10px] uppercase tracking-[0.22em]" style={mutedStyle}>
        Edición cerrada
      </span>
    );
  }

  const numColor = onDark ? "#ffffff" : "#E91E8C";
  const sepColor = onDark ? "rgba(255,255,255,0.5)" : "#E91E8C";
  const borderStyle = onDark
    ? { border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.15)" }
    : { border: "1px solid var(--brand-border)", background: "var(--brand-surface)" };

  return (
    <div
      className="inline-flex flex-col items-center gap-1 rounded-[var(--radius-md)] px-4 py-2"
      style={borderStyle}
    >
      <span className="text-[9px] uppercase tracking-[0.22em]" style={mutedStyle}>
        Cierra en
      </span>
      <div className="flex items-end gap-2 tabular-nums">
        <ClockUnit value={t.days} label="días" numColor={numColor} />
        <Sep color={sepColor} />
        <ClockUnit value={t.hours} label="hrs" numColor={numColor} />
        <Sep color={sepColor} />
        <ClockUnit value={t.minutes} label="min" numColor={numColor} />
        <Sep color={sepColor} />
        <ClockUnit value={t.seconds} label="seg" numColor={numColor} />
      </div>
    </div>
  );
}

function ClockUnit({ value, label, numColor }: { value: number; label: string; numColor: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[22px] font-bold leading-none tabular-nums" style={{ color: numColor }}>
        {pad(value)}
      </span>
      <span className="text-[8px] uppercase tracking-[0.12em] leading-none" style={{ color: numColor, opacity: 0.6 }}>
        {label}
      </span>
    </div>
  );
}

function Sep({ color }: { color: string }) {
  return (
    <span className="text-[18px] font-bold pb-4" style={{ color }}>
      :
    </span>
  );
}
