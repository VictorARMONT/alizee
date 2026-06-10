"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BOX_TIERS, formatMXN } from "@/data/pricing";

interface BoxTierSelectorProps {
  selectedIdx: number;
  onSelect: (idx: number) => void;
  archetypeName?: string;
}

export function BoxTierSelector({ selectedIdx, onSelect, archetypeName }: BoxTierSelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const selected = BOX_TIERS[selectedIdx];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--brand-primary)]">
          Su box
        </p>
        <p className="text-[13px] text-[var(--brand-fg-muted)] leading-snug">
          El mismo cariño en todos los niveles. Lo que cambia es la profundidad.
        </p>
      </div>

      {/* Tier seleccionado — siempre visible */}
      <div
        className="rounded-[var(--radius-md)] border px-5 py-4 flex items-center justify-between gap-4"
        style={{ borderColor: "var(--brand-primary)", background: "rgba(233,30,140,0.05)" }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[16px] font-semibold text-[var(--brand-fg)]">{selected.name}</p>
            {archetypeName && (
              <span className="text-[11px] text-[var(--brand-fg-muted)]">· {archetypeName}</span>
            )}
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(233,30,140,0.12)", color: "var(--brand-primary)" }}
            >
              Seleccionado
            </span>
          </div>
          <p className="text-[13px] text-[var(--brand-fg-muted)]">{selected.tagline}</p>
        </div>
        <span className="text-[var(--brand-primary)] text-lg shrink-0">✓</span>
      </div>

      {/* Botón para ver opciones */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="self-start text-[13px] font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--brand-fg-muted)" }}
        >
          Ver todas las opciones →
        </button>
      )}

      {/* Lista completa — aparece al expandir */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <ul className="flex flex-col gap-3 pt-1" role="radiogroup" aria-label="Nivel del box">
              {BOX_TIERS.map((tier, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <li key={tier.id}>
                    <motion.button
                      type="button"
                      onClick={() => { onSelect(idx); setExpanded(false); }}
                      whileTap={{ scale: 0.98 }}
                      initial={false}
                      animate={{
                        backgroundColor: isSelected ? "var(--brand-primary)" : "var(--brand-surface)",
                        borderColor: isSelected ? "var(--brand-primary)" : tier.highlight ? "var(--brand-primary)" : "var(--brand-border)",
                        color: isSelected ? "var(--brand-primary-fg)" : "var(--brand-fg)",
                      }}
                      transition={{ duration: 0.18 }}
                      className="w-full rounded-[var(--radius-md)] border px-5 py-4 flex items-start gap-4 text-left focus-visible:outline-none"
                      aria-pressed={isSelected}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className="text-[16px] font-semibold leading-tight">{tier.name}</p>
                            {tier.highlight && !isSelected && (
                              <span
                                className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(233,30,140,0.12)", color: "var(--brand-primary)" }}
                              >
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <p className="text-[17px] font-bold tabular-nums leading-tight">
                              {formatMXN(tier.priceMXN)}
                            </p>
                            <p className="text-[10px]" style={{ opacity: 0.6 }}>+ IVA</p>
                          </div>
                        </div>
                        <p className="text-[13px] mt-0.5 leading-snug" style={{ opacity: 0.75 }}>
                          {tier.tagline}
                        </p>
                        <ul className="mt-2 flex flex-col gap-1">
                          {tier.includes.map((item) => (
                            <li key={item} className="flex items-center gap-1.5 text-[12px]" style={{ opacity: 0.85 }}>
                              <span className="shrink-0">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {isSelected && <span className="shrink-0 text-lg mt-0.5">✓</span>}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
