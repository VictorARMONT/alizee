"use client";

import { motion } from "framer-motion";
import { formatMXN } from "@/data/pricing";

interface StickyFooterSummaryProps {
  total: number;
  ctaLabel?: string;
  onCta: () => void;
  /** muestra el total con animación al cambiar */
  disabled?: boolean;
}

export function StickyFooterSummary({
  total,
  ctaLabel = "Armar su regalo →",
  onCta,
  disabled,
}: StickyFooterSummaryProps) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="
        fixed bottom-0 inset-x-0 z-40
        border-t border-[var(--brand-border)]
        bg-[var(--brand-bg)]/95 backdrop-blur-md
        px-5 py-4
        flex items-center gap-4
      "
    >
      <div className="flex flex-col leading-tight flex-1 min-w-0">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
          Total
        </span>
        <motion.span
          key={total}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[22px] font-semibold tabular-nums text-[var(--brand-fg)]"
        >
          {formatMXN(total)}
        </motion.span>
      </div>
      <button
        type="button"
        onClick={onCta}
        disabled={disabled}
        className="
          min-h-[52px] rounded-full px-6
          bg-[var(--brand-primary)] text-[var(--brand-primary-fg)]
          text-[16px] font-medium
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:brightness-105 active:brightness-95
          transition-[filter]
          shrink-0
        "
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}
