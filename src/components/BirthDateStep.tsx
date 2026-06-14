"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSunSign, SIGN_INFO } from "@/data/zodiac";
import { getKinMaya } from "@/data/birthProfile";
import { BOX_TIERS, formatMXN } from "@/data/pricing";
import { DrumDatePicker } from "@/components/DrumPicker";

/**
 * Paso 7: fecha de nacimiento + selección de paquete.
 * - Al ingresar fecha aparece la sección "Signos" (signo solar + kin maya)
 *   DENTRO del card del paquete Ritual (default), seleccionado por defecto
 *   y marcado en rosa.
 * - Ceremonia se ofrece como "Análisis avanzado + regalo personalizado" + IVA.
 * - Esencial y Legado quedan como opciones compactas.
 * (La hora ya no se pide; la astrocartografía usa solo la fecha.)
 */
interface BirthDateStepProps {
  date: string | null;
  onDateChange: (iso: string | null) => void;
  selectedTierIdx: number;
  onTierSelect: (idx: number) => void;
  onSubmit: () => void;
  onSkip: () => void;
  skipLabel: string;
}

/* Orden de despliegue: Ritual (héroe) → Ceremonia → Esencial → Legado */
const TIER_DISPLAY_ORDER = ["ritual", "ceremonia", "esencial", "legado"] as const;

export function BirthDateStep({
  date,
  onDateChange,
  selectedTierIdx,
  onTierSelect,
  onSubmit,
  onSkip,
  skipLabel,
}: BirthDateStepProps) {
  const [localDate, setLocalDate] = useState(date ?? "");

  const hasDate = localDate !== "";
  const sign     = hasDate ? getSunSign(localDate) : null;
  const signInfo = sign ? SIGN_INFO[sign] : null;
  const kinMaya  = hasDate ? getKinMaya(localDate) : null;

  const tierIdx = (id: string) => BOX_TIERS.findIndex((t) => t.id === id);

  const cardStyle = (selected: boolean) => ({
    borderColor: selected ? "var(--brand-primary)" : "var(--brand-border)",
    borderWidth: selected ? 2 : 1,
    background: selected ? "rgba(233,30,140,0.06)" : "var(--brand-surface)",
  });

  return (
    <div className="flex flex-col gap-5">

      {/* ── Fecha ── */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
          Fecha de nacimiento
        </span>
        <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface)] py-2">
          <DrumDatePicker
            value={localDate || null}
            onChange={(iso) => { setLocalDate(iso); onDateChange(iso); }}
            yearStart={1930}
            yearEnd={2005}
          />
        </div>
      </div>

      {/* ── Paquetes (aparecen al ingresar fecha) ── */}
      <AnimatePresence>
        {hasDate && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-3"
            role="radiogroup"
            aria-label="Elige el paquete"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
              Elige su paquete
            </p>

            {TIER_DISPLAY_ORDER.map((id) => {
              const idx = tierIdx(id);
              const tier = BOX_TIERS[idx];
              if (!tier) return null;
              const selected = selectedTierIdx === idx;

              /* ── RITUAL — card héroe con sección "Signos" ── */
              if (id === "ritual") {
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onTierSelect(idx)}
                    className="text-left rounded-[var(--radius-md)] border px-4 py-4 flex flex-col gap-3 transition-colors"
                    style={cardStyle(selected)}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold text-[var(--brand-fg)]">{tier.name}</p>
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(233,30,140,0.12)", color: "var(--brand-primary)" }}
                        >
                          Tu paquete
                        </span>
                      </div>
                      <span className="text-[15px] font-semibold tabular-nums" style={{ color: "var(--brand-primary)" }}>
                        {formatMXN(tier.priceMXN)} MXN <span className="text-[10px] font-normal text-[var(--brand-fg-muted)]">IVA incluido</span>
                      </span>
                    </div>

                    {/* ── Signos ── */}
                    <div className="rounded-[var(--radius-sm,8px)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3 flex flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--brand-primary)" }}>
                        Signos
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {signInfo && (
                          <div className="flex items-center gap-2">
                            <span className="text-[24px] leading-none" style={{ color: "var(--brand-primary)" }}>
                              {signInfo.glyph}
                            </span>
                            <div>
                              <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{signInfo.name}</p>
                              <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--brand-fg-muted)]">Signo solar</p>
                            </div>
                          </div>
                        )}
                        {signInfo && kinMaya && (
                          <span className="text-[20px] font-light text-[var(--brand-fg-muted)]" aria-hidden>+</span>
                        )}
                        {kinMaya && (
                          <div className="flex items-center gap-2">
                            <span className="text-[24px] leading-none" style={{ color: "var(--brand-primary)" }}>
                              {kinMaya.glyph}
                            </span>
                            <div>
                              <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{kinMaya.sealName}</p>
                              <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--brand-fg-muted)]">Nahual maya</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {kinMaya && (
                        <p className="text-[12px] text-[var(--brand-fg-muted)]">
                          Tono {kinMaya.tone} {kinMaya.toneName} ·{" "}
                          <span style={{
                            color: kinMaya.color === "rojo" ? "#c0392b"
                                 : kinMaya.color === "blanco" ? "#7a6552"
                                 : kinMaya.color === "azul" ? "#1a5276" : "#B45309"
                          }}>
                            {kinMaya.color.charAt(0).toUpperCase() + kinMaya.color.slice(1)}
                          </span>
                        </p>
                      )}
                    </div>

                    <p className="text-[12px] text-[var(--brand-fg-muted)]">{tier.tagline}</p>
                  </button>
                );
              }

              /* ── CEREMONIA — análisis avanzado + regalo personalizado ── */
              if (id === "ceremonia") {
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onTierSelect(idx)}
                    className="text-left rounded-[var(--radius-md)] border px-4 py-3 flex flex-col gap-1 transition-colors"
                    style={cardStyle(selected)}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-[15px] font-semibold text-[var(--brand-fg)]">{tier.name}</p>
                      <span className="text-[14px] font-semibold tabular-nums" style={{ color: "var(--brand-primary)" }}>
                        {formatMXN(tier.priceMXN)} MXN <span className="text-[10px] font-normal text-[var(--brand-fg-muted)]">IVA incluido</span>
                      </span>
                    </div>
                    <p className="text-[12px] font-medium" style={{ color: "var(--brand-primary)" }}>
                      Análisis avanzado + regalo personalizado
                    </p>
                    <p className="text-[12px] text-[var(--brand-fg-muted)]">{tier.tagline}</p>
                  </button>
                );
              }

              /* ── ESENCIAL / LEGADO — compactos ── */
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onTierSelect(idx)}
                  className="text-left rounded-[var(--radius-md)] border px-4 py-3 flex items-center justify-between gap-2 transition-colors"
                  style={cardStyle(selected)}
                >
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--brand-fg)]">{tier.name}</p>
                    <p className="text-[12px] text-[var(--brand-fg-muted)]">{tier.tagline}</p>
                  </div>
                  <span className="text-[14px] font-semibold tabular-nums shrink-0" style={{ color: "var(--brand-primary)" }}>
                    {formatMXN(tier.priceMXN)} MXN <span className="text-[10px] font-normal text-[var(--brand-fg-muted)]">IVA incluido</span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={!hasDate}
        onClick={onSubmit}
        style={hasDate ? {
          background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)",
        } : undefined}
        className={`
          w-full min-h-[56px] rounded-full text-base font-semibold
          transition-[filter,opacity] select-none
          ${hasDate
            ? "text-white hover:opacity-90 active:opacity-80"
            : "bg-[var(--brand-border)] text-[var(--brand-fg-muted)] opacity-50 cursor-not-allowed"
          }
        `}
      >
        {hasDate ? "Continuar →" : "Ingresa la fecha para continuar"}
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
