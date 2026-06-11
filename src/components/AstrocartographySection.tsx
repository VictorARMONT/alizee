"use client";

import { motion } from "framer-motion";
import { getAstrocartography, type AstroCategory, type AstrocartographyResult } from "@/lib/astrocartography";
import type { SunSign } from "@/data/zodiac";
import type { ArchetypeKey } from "@/data/questions";

interface Props {
  birthDate: string;
  birthTime: string;
  sunSign: SunSign | null;
  archetypeKey: ArchetypeKey;
}

const TRAVEL_STYLE: Record<ArchetypeKey, { style: string; seeks: string; avoidPrep: string[] }> = {
  lider: {
    style: "Viaja con propósito y estructura. Prefiere destinos donde algo importante pueda pasar.",
    seeks: "Reuniones clave, lugares de poder histórico, experiencias de liderazgo o reconocimiento.",
    avoidPrep: [
      "Si debes ir: define un objetivo concreto antes de llegar. Los lugares de tensión lo activan cuando tiene misión.",
      "Evita improvisar en estos destinos. El Líder necesita control del contexto para no desgastarse.",
      "Lleva rutinas que le anclen: desayuno fijo, hora de ejercicio, salida definida.",
    ],
  },
  explorador: {
    style: "Viajero natural. El viaje en sí es su estado ideal — no el destino, el movimiento.",
    seeks: "Lugares fuera del mapa turístico, experiencias locales auténticas, rutas sin definir.",
    avoidPrep: [
      "Si debes ir: ve sin expectativas fijas. Los lugares de tensión para el Explorador suelen ser los que te enseñan más si vas sin agenda.",
      "Lleva un diario. La tensión se convierte en aprendizaje cuando la procesas escribiendo.",
      "No vayas solo en primera visita a destinos complicados — el Explorador se pierde en ellos.",
    ],
  },
  creador: {
    style: "Viaja para crear, no para consumir. Necesita tiempo libre y espacio para producir.",
    seeks: "Talleres, estudios de artistas, lugares con artesanía local, tiempo para hacer algo con las manos.",
    avoidPrep: [
      "Si debes ir: lleva un proyecto contigo. El Inventor en contextos de alta presión produce mejor cuando tiene una obra entre manos.",
      "Busca el taller, el artesano, la cocina local — conéctate con quienes hacen cosas reales en ese lugar.",
      "Define claramente tu tiempo personal antes de llegar. Sin espacio creativo, se agota.",
    ],
  },
  sabio: {
    style: "Viajero selectivo y profundo. Prefiere un destino bien conocido a diez lugares superficiales.",
    seeks: "Bibliotecas, museos, cafés con historia, conversaciones profundas con locales.",
    avoidPrep: [
      "Si debes ir: investiga antes. El Sabio en territorios desconocidos sin preparación se siente expuesto.",
      "Lleva lectura relacionada con el lugar — historia, cultura, contexto. Eso lo convierte en experiencia en vez de estrés.",
      "Mantén tiempos de silencio y recarga. Sin ellos, el Sabio se satura rápido.",
    ],
  },
};

export function AstrocartographySection({ birthDate, birthTime, sunSign, archetypeKey }: Props) {
  const result: AstrocartographyResult = getAstrocartography(birthDate, birthTime, sunSign, archetypeKey);
  const travel = TRAVEL_STYLE[archetypeKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: "var(--brand-primary)" }}>
            Astrocartografía · Mapa de viaje
          </p>
          <p className="text-[13px] text-[var(--brand-fg-muted)] leading-snug">
            Lugares del mundo que amplifican tu energía — y los que la agotan
          </p>
        </div>
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-full"
          style={{ background: "rgba(233,30,140,0.12)", color: "var(--brand-primary)" }}
        >
          PRO
        </span>
      </div>

      {/* Estilo de viaje del arquetipo */}
      <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-4 py-3 flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">Cómo viaja</p>
        <p className="text-[13px] leading-relaxed text-[var(--brand-fg)]">{travel.style}</p>
        <p className="text-[12px] text-[var(--brand-fg-muted)] leading-snug">
          <span className="font-medium text-[var(--brand-fg)]">Busca: </span>{travel.seeks}
        </p>
      </div>

      {/* Planeta regente + ángulo */}
      <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-4 py-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[20px] leading-none" style={{ color: "var(--brand-primary)" }}>
            {result.rulingPlanetSymbol}
          </span>
          <p className="text-[14px] font-semibold text-[var(--brand-fg)]">
            {result.rulingPlanetName} — tu planeta guía
          </p>
        </div>
        <p className="text-[12px] text-[var(--brand-fg-muted)] leading-snug">
          {result.dominantAngleLabel}
        </p>
      </div>

      {/* Categorías favorables */}
      <div className="flex flex-col gap-3">
        <CategoryRow cat={result.estudiar} />
        <CategoryRow cat={result.trabajar} />
        <CategoryRow cat={result.romance} />
        <CategoryRow cat={result.pareja} />
        <CategoryRow cat={result.vivir} />
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--brand-border)]" />

      {/* Lugares que limitan + cómo prepararse */}
      <AvoidRow cat={result.evitar} prepTips={travel.avoidPrep} />

      {/* Footer note */}
      <p className="text-[10px] text-[var(--brand-fg-muted)] leading-relaxed border-t border-[var(--brand-border)] pt-4">
        Análisis basado en tu fecha y hora de nacimiento. Los lugares no determinan el destino — amplifican o atenúan energías que ya están en tu perfil.
      </p>
    </motion.div>
  );
}

/* ── Sub-componentes ── */

function CategoryRow({ cat }: { cat: AstroCategory }) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-4 py-3">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] leading-none" style={{ color: "var(--brand-primary)" }}>
            {cat.icon}
          </span>
          <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{cat.label}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px]" style={{ color: "var(--brand-primary)", opacity: 0.7 }}>
            {cat.planetSymbol}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--brand-fg-muted)]">
            {cat.planetName} {cat.angle}
          </span>
        </div>
      </div>

      {/* Headline */}
      <p className="text-[12px] italic text-[var(--brand-fg-muted)]">{cat.headline}</p>

      {/* Cities */}
      <div className="flex flex-wrap gap-2">
        {cat.places.map((p) => (
          <span
            key={p.city}
            className="inline-flex items-center gap-1 text-[12px] font-medium rounded-full px-2.5 py-1"
            style={{ background: "var(--brand-surface)", border: "1px solid var(--brand-border)", color: "var(--brand-fg)" }}
          >
            <span>{p.flag}</span>
            <span>{p.city}</span>
          </span>
        ))}
      </div>

      {/* Note */}
      <p className="text-[11px] text-[var(--brand-fg-muted)] leading-snug">{cat.note}</p>
    </div>
  );
}

function AvoidRow({ cat, prepTips }: { cat: AstroCategory; prepTips?: string[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-md)] px-4 py-3"
      style={{ background: "rgba(180,30,30,0.04)", border: "1px solid rgba(180,30,30,0.15)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[14px]" style={{ color: "#b91c1c" }}>{cat.icon}</span>
        <p className="text-[13px] font-semibold" style={{ color: "#b91c1c" }}>{cat.label}</p>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--brand-fg-muted)] ml-auto shrink-0">
          {cat.planetSymbol} {cat.planetName}
        </span>
      </div>
      <p className="text-[12px] italic text-[var(--brand-fg-muted)]">{cat.headline}</p>
      <div className="flex flex-wrap gap-2">
        {cat.places.map((p) => (
          <span
            key={p.city}
            className="inline-flex items-center gap-1 text-[12px] font-medium rounded-full px-2.5 py-1"
            style={{ background: "rgba(180,30,30,0.06)", border: "1px solid rgba(180,30,30,0.2)", color: "#7f1d1d" }}
          >
            <span>{p.flag}</span>
            <span>{p.city}</span>
          </span>
        ))}
      </div>
      <p className="text-[11px] leading-snug" style={{ color: "#9f1c1c", opacity: 0.8 }}>{cat.note}</p>
      {prepTips && prepTips.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t pt-2" style={{ borderColor: "rgba(180,30,30,0.2)" }}>
          <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#b91c1c" }}>
            Si debes ir — cómo prepararte
          </p>
          {prepTips.map((tip, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="shrink-0 text-[10px] mt-[3px]" style={{ color: "#b91c1c" }}>▸</span>
              <p className="text-[11px] leading-relaxed" style={{ color: "#7f1d1d" }}>{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
