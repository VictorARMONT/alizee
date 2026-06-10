"use client";

import type { Option } from "@/data/questions";

interface OptionCardProps {
  option: Option;
  selected: boolean;
  disabled?: boolean;
  onSelect: (key: string) => void;
}

export function OptionCard({ option, selected, disabled, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.key)}
      style={{
        touchAction: "manipulation",
        transition: "background-color 150ms, border-color 150ms, color 150ms, transform 300ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms",
      }}
      className={[
        "w-full min-h-[64px] rounded-[var(--radius-md)]",
        "border px-5 py-4",
        "flex items-center gap-4 text-left select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2",
        "active:scale-[0.98]",
        selected
          ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white shadow-[0_6px_24px_-8px_rgba(233,30,140,0.45)]"
          : "bg-[var(--brand-surface)] border-[var(--brand-border)] text-[var(--brand-fg)] hover:border-[var(--brand-primary)] hover:shadow-[0_4px_16px_-6px_rgba(233,30,140,0.25)]",
      ].join(" ")}
      aria-pressed={selected}
    >
      {option.glyph && (
        <span aria-hidden className="text-xl w-7 shrink-0 text-center">
          {option.glyph}
        </span>
      )}
      <span className="flex-1 text-[17px] font-medium leading-tight">
        {option.label}
      </span>
      {selected && (
        <span className="shrink-0 text-sm text-white">✓</span>
      )}
    </button>
  );
}
