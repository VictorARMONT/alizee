"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  /** paso actual, base 1 (1, 2, 3, ...) */
  current: number;
  /** total de pasos */
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full" aria-label={label ?? `Paso ${current} de ${total}`}>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)] mb-2">
        <span>{label ?? "Tu regalo"}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-[var(--brand-border)]"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <motion.div
          className="h-full rounded-full bg-[var(--brand-primary)]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        />
      </div>
    </div>
  );
}
