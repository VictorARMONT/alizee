"use client";

/**
 * Slot de ícono. Hoy = emoji/glyph. Cuando Victor entregue SVG,
 * reemplazar el body de cada case sin tocar los callers.
 */

export type IconSlot =
  | "reloj"
  | "piel"
  | "fragancia"
  | "destilado"
  | "piedra"
  | "vela"
  | "dossier"
  | "sorpresa"
  | "check"
  | "upgrade"
  | "regalo"
  | "sello";

interface IconProps {
  slot: IconSlot;
  className?: string;
  /** px (aplica a font-size si es emoji) */
  size?: number;
}

const GLYPHS: Record<IconSlot, string> = {
  reloj:     "⌚",
  piel:      "▭",
  fragancia: "✦",
  destilado: "◊",
  piedra:    "◉",
  vela:      "☉",
  dossier:   "❦",
  sorpresa:  "✶",
  check:     "✓",
  upgrade:   "＋",
  regalo:    "◈",
  sello:     "✺",
};

export function Icon({ slot, className = "", size }: IconProps) {
  return (
    <span
      aria-hidden
      className={className}
      style={size ? { fontSize: size } : undefined}
    >
      {GLYPHS[slot]}
    </span>
  );
}
