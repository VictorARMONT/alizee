"use client";

import { motion } from "framer-motion";
import { UPGRADES, formatMXN } from "@/data/pricing";
import { Icon } from "@/components/Icon";

interface CrossSellSlotProps {
  selected: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export function CrossSellSlot({ selected, onToggle }: CrossSellSlotProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--brand-primary)]">
          Añadir a su regalo
        </p>
        <p className="text-sm text-[var(--brand-fg-muted)] mt-1">
          Opcionales. Cada detalle suma al total.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {UPGRADES.map((u) => {
          const on = !!selected[u.id];
          return (
            <li key={u.id}>
              <motion.button
                type="button"
                onClick={() => onToggle(u.id)}
                whileTap={{ scale: 0.98 }}
                initial={false}
                animate={{
                  borderColor: on ? "var(--brand-primary)" : "var(--brand-border)",
                  backgroundColor: on ? "var(--brand-surface)" : "var(--brand-surface)",
                }}
                transition={{ duration: 0.16 }}
                className="
                  w-full min-h-[64px] rounded-[var(--radius-md)]
                  border px-5 py-4
                  flex items-center gap-4 text-left
                  focus-visible:outline-none
                "
                aria-pressed={on}
              >
                {/* Toggle circle */}
                <motion.div
                  animate={{
                    backgroundColor: on
                      ? "var(--brand-primary)"
                      : "transparent",
                    borderColor: on
                      ? "var(--brand-primary)"
                      : "var(--brand-border)",
                  }}
                  transition={{ duration: 0.16 }}
                  className="h-6 w-6 shrink-0 rounded-full border-2 grid place-items-center"
                >
                  {on && (
                    <span className="text-[10px] text-[var(--brand-primary-fg)] font-bold leading-none">
                      ✓
                    </span>
                  )}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p className="text-[17px] font-medium text-[var(--brand-fg)] leading-tight">
                    {u.label}
                  </p>
                  {u.detail && (
                    <p className="text-xs text-[var(--brand-fg-muted)] mt-0.5 leading-relaxed">
                      {u.detail}
                    </p>
                  )}
                </div>

                <span
                  className="shrink-0 text-[15px] font-medium tabular-nums"
                  style={{ color: on ? "var(--brand-primary)" : "var(--brand-fg-muted)" }}
                >
                  +{formatMXN(u.priceMXN)}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
