"use client";

import type { Option, ArchetypeKey } from "@/data/questions";

const FILL_MS = 380;

const PLACEHOLDER_GRADIENTS: Record<ArchetypeKey, string> = {
  lider:      "linear-gradient(145deg, #3a2d1e 0%, #7a5c2c 60%, #a88040 100%)",
  explorador: "linear-gradient(145deg, #2d1e12 0%, #8b4513 60%, #c07040 100%)",
  creador:    "linear-gradient(145deg, #1e1a0e 0%, #6b5020 60%, #9a7835 100%)",
  sabio:      "linear-gradient(145deg, #0e1a2d 0%, #1e3a5a 60%, #2a5080 100%)",
};

const PLACEHOLDER_GLYPH: Record<ArchetypeKey, string> = {
  lider:      "◈",
  explorador: "◉",
  creador:    "◊",
  sabio:      "✦",
};

interface ImageOptionCardProps {
  option: Option;
  selected: boolean;
  blinking?: boolean;
  disabled?: boolean;
  onSelect: (key: string) => void;
}

export function ImageOptionCard({ option, selected, blinking, disabled, onSelect }: ImageOptionCardProps) {
  const archetype = option.archetype as ArchetypeKey | undefined;
  const gradient  = archetype ? PLACEHOLDER_GRADIENTS[archetype] : PLACEHOLDER_GRADIENTS.sabio;
  const glyph     = archetype ? PLACEHOLDER_GLYPH[archetype]     : "◈";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.key)}
      style={{ touchAction: "manipulation" }}
      className={[
        "relative flex flex-col overflow-hidden rounded-[var(--radius-md)]",
        "border text-left w-full select-none",
        "transition-[border-color] duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] focus-visible:outline-offset-2",
        blinking ? "az-option-blink" : "",
        selected
          ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]"
          : "border-[var(--brand-border)]",
      ].join(" ")}
      aria-pressed={selected}
    >
      {/* Imagen / placeholder */}
      <div
        className="w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden"
        style={{ background: option.imageUrl ? undefined : gradient }}
      >
        {option.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={option.imageUrl} alt={option.label} className="w-full h-full object-cover" />
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(255,255,255,.4) 28px,rgba(255,255,255,.4) 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(255,255,255,.4) 28px,rgba(255,255,255,.4) 29px)",
              }}
            />
            <span aria-hidden className="text-5xl opacity-40" style={{ color: "#faf8f3" }}>
              {glyph}
            </span>
          </>
        )}

        {selected && (
          <div className="absolute inset-0" style={{ background: "rgba(233,30,140,0.28)" }} />
        )}
      </div>

      {/* Label */}
      <div
        className="px-3 py-2.5 flex flex-col gap-0.5 transition-colors duration-150"
        style={{ background: selected ? "var(--brand-primary)" : "var(--brand-surface)" }}
      >
        <p
          className="text-[14px] font-semibold leading-tight"
          style={{ color: selected ? "#ffffff" : "var(--brand-fg)" }}
        >
          {option.label}
        </p>
        {option.caption && (
          <p
            className="text-[11px] leading-tight opacity-80"
            style={{ color: selected ? "rgba(255,255,255,0.85)" : "var(--brand-fg-muted)" }}
          >
            {option.caption}
          </p>
        )}
      </div>

      {/* Barra de carga */}
      {selected && (
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-full bg-[var(--brand-primary)] origin-left"
          style={{ animation: `fill-progress ${FILL_MS}ms linear forwards` }}
        />
      )}
    </button>
  );
}
