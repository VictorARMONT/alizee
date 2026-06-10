"use client";

import { getTotemProfile } from "@/data/totem";
import type { Answers } from "@/store/funnel";

interface TotemSectionProps {
  birthDate: string;
  answers: Answers;
  dominantPlanet?: string;
}

const LAYER_LABELS = ["Pedestal", "Base", "Cuerpo", "Frente", "Corona"] as const;

export function TotemSection({ birthDate, answers, dominantPlanet = "sol" }: TotemSectionProps) {
  const totem = getTotemProfile(birthDate, answers, dominantPlanet);

  const layers = [
    { key: "pedestal", data: totem.pedestal },
    { key: "base",     data: totem.base },
    { key: "cuerpo",   data: totem.cuerpo },
    { key: "frente",   data: totem.frente },
    { key: "corona",   data: totem.corona },
  ] as const;

  const stones = [
    { tier: "Mes de nacimiento", ...totem.stone.primary },
    { tier: "Signo solar",       ...totem.stone.secondary },
    { tier: "Intención",         ...totem.stone.intention },
  ];

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <p
          className="text-[11px] uppercase tracking-[0.24em] font-semibold"
          style={{ color: "var(--brand-primary)" }}
        >
          Tótem de identidad
        </p>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
          style={{ background: "rgba(249,115,22,0.1)", color: "#F97316" }}
        >
          Objeto 3D
        </span>
      </div>

      {/* Intro */}
      <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)]">
        Tu tótem es único — construido en 5 capas que reflejan quién eres en distintos sistemas de
        conocimiento. Se imprime en 3D y llega dentro de tu box.
      </p>

      {/* Capas — lista de arriba abajo (corona → pedestal) para lectura visual */}
      <div className="flex flex-col gap-2">
        {[...layers].reverse().map(({ key, data }, i) => {
          const layerLabel = LAYER_LABELS[layers.length - 1 - i];
          const isTop = i === 0;
          return (
            <div
              key={key}
              className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3"
              style={isTop ? { borderColor: "rgba(249,115,22,0.35)" } : undefined}
            >
              {/* Símbolo */}
              <span
                className="text-[20px] leading-none shrink-0 w-7 text-center mt-[1px]"
                style={{ color: "var(--brand-primary)" }}
              >
                {data.symbol}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)] shrink-0">
                    {layerLabel}
                  </span>
                  {data.animal && (
                    <span className="text-[12px] font-semibold text-[var(--brand-fg)] truncate">
                      {data.animal}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--brand-fg-muted)] leading-snug">{data.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Piedras */}
      <div className="flex flex-col gap-3 border-t border-[var(--brand-border)] pt-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
          Piedra acompañante · 3 capas
        </p>
        <div className="flex flex-col gap-2">
          {stones.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--brand-border)] shrink-0 mt-[1px]"
                style={{ color: "var(--brand-fg-muted)" }}
              >
                {s.tier}
              </span>
              <div>
                <span className="text-[13px] font-semibold text-[var(--brand-fg)]">{s.name}</span>
                <span className="text-[11px] text-[var(--brand-fg-muted)] ml-1">— {s.reason.split(". ").slice(1).join(". ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lugar de poder */}
      <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3">
        <span className="text-[14px] shrink-0" style={{ color: "var(--brand-primary)" }}>⊕</span>
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">
            Lugar de poder
          </p>
          <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{totem.sacredPlace.type}</p>
          <p className="text-[11px] text-[var(--brand-fg-muted)]">
            {totem.sacredPlace.examples.join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
