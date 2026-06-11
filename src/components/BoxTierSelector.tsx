"use client";

import { motion } from "framer-motion";
import { BOX_TIERS, formatMXN } from "@/data/pricing";

interface BoxTierSelectorProps {
  selectedIdx: number;
  onSelect: (idx: number) => void;
  archetypeName?: string;
}

export function BoxTierSelector({ selectedIdx, onSelect }: BoxTierSelectorProps) {
  return (
    <ul className="flex flex-col gap-3" role="radiogroup" aria-label="Nivel del box">
      {BOX_TIERS.map((tier, idx) => {
        const isSelected = idx === selectedIdx;
        return (
          <li key={tier.id}>
            <motion.button
              type="button"
              onClick={() => onSelect(idx)}
              whileTap={{ scale: 0.985 }}
              className="w-full rounded-[var(--radius-md)] border px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2 transition-shadow"
              style={{
                background: isSelected
                  ? "rgba(233,30,140,0.06)"
                  : "var(--brand-surface)",
                borderColor: isSelected
                  ? "var(--brand-primary)"
                  : tier.highlight
                  ? "rgba(233,30,140,0.35)"
                  : "var(--brand-border)",
                boxShadow: isSelected
                  ? "0 6px 28px -8px rgba(233,30,140,0.28)"
                  : tier.highlight
                  ? "0 2px 12px -4px rgba(233,30,140,0.12)"
                  : "none",
              }}
              aria-pressed={isSelected}
            >
              {/* Row superior: nombre + precio */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[17px] font-semibold leading-tight"
                    style={{ color: isSelected ? "var(--brand-primary)" : "var(--brand-fg)" }}
                  >
                    {tier.name}
                  </span>

                  {tier.highlight && (
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
                      style={{
                        background: isSelected
                          ? "rgba(233,30,140,0.18)"
                          : "rgba(233,30,140,0.10)",
                        color: "var(--brand-primary)",
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className="text-[18px] font-bold tabular-nums leading-tight"
                    style={{ color: isSelected ? "var(--brand-primary)" : "var(--brand-fg)" }}
                  >
                    {formatMXN(tier.priceMXN)}
                  </span>
                  <span className="text-[10px] text-[var(--brand-fg-muted)]">IVA incluido</span>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-[13px] text-[var(--brand-fg-muted)] mt-1 leading-snug">
                {tier.tagline}
              </p>

              {/* Includes */}
              <ul className="mt-3 flex flex-col gap-1.5">
                {tier.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[12px] leading-snug"
                    style={{ color: isSelected ? "var(--brand-fg)" : "var(--brand-fg-muted)" }}
                  >
                    <span
                      className="shrink-0 mt-[1px]"
                      style={{ color: isSelected ? "var(--brand-primary)" : "var(--brand-fg-muted)" }}
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Seleccionado badge */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t flex items-center gap-1.5" style={{ borderColor: "rgba(233,30,140,0.2)" }}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--brand-primary)" }}>
                    Elegido
                  </span>
                  <span style={{ color: "var(--brand-primary)" }}>✓</span>
                </div>
              )}
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
}
