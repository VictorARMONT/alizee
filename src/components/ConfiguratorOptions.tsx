"use client";

import { motion } from "framer-motion";
import type { ProductSlot } from "@/data/archetypes";
import { Icon } from "@/components/Icon";

interface ConfiguratorOptionsProps {
  slot: "ancla" | "complemento";
  options: ProductSlot[];
  selected: ProductSlot | null;
  onSelect: (slot: ProductSlot) => void;
}

export function ConfiguratorOptions({
  slot,
  options,
  selected,
  onSelect,
}: ConfiguratorOptionsProps) {
  const label = slot === "ancla" ? "Elige su ancla" : "Elige su complemento";
  const sub =
    slot === "ancla"
      ? "La pieza principal del regalo."
      : "El detalle que completa el box.";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--brand-primary)]">
          {label}
        </p>
        <p className="text-sm text-[var(--brand-fg-muted)] mt-1">{sub}</p>
      </div>

      <ul className="flex flex-col gap-3" role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const isSelected = selected?.sku === opt.sku && selected?.label === opt.label;
          return (
            <li key={`${opt.type}-${opt.label}`}>
              <motion.button
                type="button"
                onClick={() => onSelect(opt)}
                whileTap={{ scale: 0.98 }}
                initial={false}
                animate={{
                  backgroundColor: isSelected
                    ? "var(--brand-primary)"
                    : "var(--brand-surface)",
                  borderColor: isSelected
                    ? "var(--brand-primary)"
                    : "var(--brand-border)",
                  color: isSelected
                    ? "var(--brand-primary-fg)"
                    : "var(--brand-fg)",
                }}
                transition={{ duration: 0.18 }}
                className="
                  w-full min-h-[72px] rounded-[var(--radius-md)] border
                  px-5 py-4 flex items-center gap-4 text-left
                  focus-visible:outline-none
                "
                aria-pressed={isSelected}
              >
                <Icon
                  slot={opt.type as Parameters<typeof Icon>[0]["slot"]}
                  size={24}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] font-medium leading-tight">
                    {opt.label}
                  </p>
                  {opt.detail && (
                    <p
                      className="text-xs mt-1 leading-relaxed"
                      style={{
                        color: isSelected
                          ? "var(--brand-primary-fg)"
                          : "var(--brand-fg-muted)",
                        opacity: 0.85,
                      }}
                    >
                      {opt.detail}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <span className="shrink-0 text-lg">✓</span>
                )}
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
