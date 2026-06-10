"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSunSign, SIGN_INFO } from "@/data/zodiac";
import { getKinMaya } from "@/data/birthProfile";
import { BOX_TIERS, formatMXN } from "@/data/pricing";
import { DrumDatePicker, DrumTimePicker } from "@/components/DrumPicker";

interface DateTimeInputProps {
  date: string | null;
  time: string | null;
  onDateChange: (iso: string | null) => void;
  onTimeChange: (t: string | null) => void;
  onSubmit: () => void;
  onSkip: () => void;
  skipLabel: string;
  requireTime?: boolean;
  tierName?: string;
}

export function DateTimeInput({
  date,
  time,
  onDateChange,
  onTimeChange,
  onSubmit,
  onSkip,
  skipLabel,
  requireTime = false,
  tierName,
}: DateTimeInputProps) {
  const [localDate, setLocalDate] = useState(date ?? "");
  const [localTime, setLocalTime] = useState(time ?? "");
  const [proMode, setProMode] = useState(requireTime);

  const hasDate = localDate !== "";
  const hasTime = localTime !== "";
  const canContinue = hasDate && (!proMode || !requireTime || hasTime);

  const today = new Date().toISOString().slice(0, 10);

  // Preview astral al tener fecha
  const sign    = hasDate ? getSunSign(localDate) : null;
  const signInfo = sign ? SIGN_INFO[sign] : null;
  const kinMaya  = hasDate ? getKinMaya(localDate) : null;

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

      {/* ── Preview astral (aparece al ingresar fecha) ── */}
      <AnimatePresence>
        {hasDate && (signInfo || kinMaya) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-4 flex flex-col gap-3"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-primary)]">
              Vista previa astral
            </p>
            <div className="grid grid-cols-2 gap-3">
              {signInfo && (
                <div className="flex items-center gap-3">
                  <span className="text-[26px] leading-none" style={{ color: "var(--brand-primary)" }}>
                    {signInfo.glyph}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{signInfo.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--brand-fg-muted)]">Signo solar</p>
                  </div>
                </div>
              )}
              {kinMaya && (
                <div className="flex items-center gap-3">
                  <span className="text-[26px] leading-none" style={{ color: "var(--brand-primary)" }}>
                    {kinMaya.glyph}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{kinMaya.sealName}</p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--brand-fg-muted)]">Kin {kinMaya.kin}</p>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle análisis completo ── */}
      <AnimatePresence>
        {hasDate && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-[var(--radius-md)] border bg-[var(--brand-surface)] px-4 py-3 flex items-center justify-between gap-4"
            style={{ borderColor: proMode ? "var(--brand-primary)" : "var(--brand-border)" }}
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-semibold text-[var(--brand-fg)]">
                  {BOX_TIERS.find((t) => t.id === "ceremonia")?.name ?? tierName ?? "Ceremonia"}
                </p>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(233,30,140,0.1)", color: "var(--brand-primary)" }}
                >
                  Análisis Avanzado
                </span>
                <span className="text-[12px] font-semibold tabular-nums" style={{ color: "var(--brand-primary)" }}>
                  {formatMXN(BOX_TIERS.find((t) => t.id === "ceremonia")?.priceMXN ?? 1920)}
                </span>
              </div>
              <p className="text-[11px] text-[var(--brand-fg-muted)]">
                Activa el análisis completo con la hora exacta de nacimiento
              </p>
            </div>
            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={proMode}
              onClick={() => setProMode(!proMode)}
              className="shrink-0 relative w-12 h-7 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
              style={{ background: proMode ? "var(--brand-primary)" : "var(--brand-border)" }}
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: proMode ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hora (solo en análisis avanzado) ── */}
      <AnimatePresence>
        {proMode && hasDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
              Hora de nacimiento
            </span>
            <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-surface)] py-2">
              <DrumTimePicker
                value={localTime || null}
                onChange={(t) => { setLocalTime(t); onTimeChange(t); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={!canContinue}
        onClick={onSubmit}
        style={canContinue ? {
          background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)",
        } : undefined}
        className={`
          w-full min-h-[56px] rounded-full text-base font-semibold
          transition-[filter,opacity] select-none
          ${canContinue
            ? "text-white hover:opacity-90 active:opacity-80"
            : "bg-[var(--brand-border)] text-[var(--brand-fg-muted)] opacity-50 cursor-not-allowed"
          }
        `}
      >
        {canContinue
          ? proMode ? "Activar análisis completo →" : "Continuar →"
          : proMode && requireTime ? "Ingresa la hora para continuar" : "Ingresa la fecha para continuar"
        }
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
