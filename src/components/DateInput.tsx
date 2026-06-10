"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DrumDatePicker } from "@/components/DrumPicker";

interface DateInputProps {
  /** valor ISO "YYYY-MM-DD" o null */
  value: string | null;
  onChange: (iso: string | null) => void;
  onSubmit: () => void;
  onSkip: () => void;
  skipLabel: string;
  /** label del CTA principal cuando hay fecha */
  submitLabel?: string;
}

/**
 * Native `<input type="date">` — en iOS/Android abre el picker del sistema.
 * No hace auto-avance: el usuario confirma o salta.
 */
export function DateInput({
  value,
  onChange,
  onSubmit,
  onSkip,
  skipLabel,
  submitLabel = "Incluir regalo personalizado",
}: DateInputProps) {
  const [local, setLocal] = useState(value ?? "");
  const hasValue = local !== "";

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
          Fecha de nacimiento
        </span>
        <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface)] py-2">
          <DrumDatePicker
            value={local || null}
            onChange={(iso) => { setLocal(iso); onChange(iso); }}
            yearStart={1930}
            yearEnd={2005}
          />
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={!hasValue}
        onClick={onSubmit}
        className="
          w-full min-h-[56px] rounded-full
          bg-[var(--brand-primary)] text-[var(--brand-primary-fg)]
          text-base font-medium
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-[filter]
          hover:brightness-105 active:brightness-95
        "
      >
        {submitLabel}
      </motion.button>

      <button
        type="button"
        onClick={onSkip}
        className="
          text-sm text-[var(--brand-fg-muted)]
          underline underline-offset-4 decoration-[var(--brand-border)]
          hover:text-[var(--brand-fg)] hover:decoration-[var(--brand-fg-muted)]
          transition-colors
          self-center
        "
      >
        {skipLabel}
      </button>
    </div>
  );
}
