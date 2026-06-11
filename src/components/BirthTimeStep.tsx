"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BOX_TIERS } from "@/data/pricing";
import { DrumTimePicker } from "@/components/DrumPicker";

/**
 * Paso 8: hora de nacimiento (opcional).
 * Afina el análisis astral; siempre se puede saltar para no frenar el funnel.
 */
interface BirthTimeStepProps {
  time: string | null;
  onTimeChange: (t: string | null) => void;
  selectedTierIdx: number;
  onSubmit: () => void;
  onSkip: () => void;
  skipLabel: string;
}

export function BirthTimeStep({
  time,
  onTimeChange,
  selectedTierIdx,
  onSubmit,
  onSkip,
  skipLabel,
}: BirthTimeStepProps) {
  const [localTime, setLocalTime] = useState(time ?? "");
  const hasTime = localTime !== "";

  const tier = BOX_TIERS[selectedTierIdx];
  const isAdvanced = tier?.id === "ceremonia" || tier?.id === "legado";

  return (
    <div className="flex flex-col gap-5">

      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
          Hora de nacimiento
        </span>
        <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface)] py-2">
          <DrumTimePicker
            value={localTime || null}
            onChange={(t) => { setLocalTime(t); onTimeChange(t); }}
          />
        </div>
      </div>

      {isAdvanced && (
        <p className="text-[12px] leading-relaxed text-[var(--brand-fg-muted)]">
          Tu paquete <span className="font-semibold" style={{ color: "var(--brand-primary)" }}>{tier.name}</span>{" "}
          incluye análisis avanzado: la hora exacta nos permite calcular su carta completa.
        </p>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={!hasTime}
        onClick={onSubmit}
        style={hasTime ? {
          background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)",
        } : undefined}
        className={`
          w-full min-h-[56px] rounded-full text-base font-semibold
          transition-[filter,opacity] select-none
          ${hasTime
            ? "text-white hover:opacity-90 active:opacity-80"
            : "bg-[var(--brand-border)] text-[var(--brand-fg-muted)] opacity-50 cursor-not-allowed"
          }
        `}
      >
        {hasTime ? "Continuar →" : "Selecciona la hora o salta este paso"}
      </motion.button>

      <button
        type="button"
        onClick={onSkip}
        className="text-sm text-[var(--brand-fg-muted)] underline underline-offset-4 decoration-[var(--brand-border)] hover:text-[var(--brand-fg)] transition-colors self-center"
      >
        {skipLabel}
      </button>
    </div>
  );
}
