"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ARCHETYPES } from "@/data/archetypes";
import { SIGN_INFO } from "@/data/zodiac";
import { getChineseZodiac, getKinMaya, getSeason, getCapsulaTiempo } from "@/data/birthProfile";
import { getGeneration } from "@/data/generational";
import { getNahual } from "@/data/cholqij";
import { AstrocartographySection } from "@/components/AstrocartographySection";
import { getAffirmations } from "@/lib/affirmations";
import { getArchetypeQuote } from "@/data/quotes";
import { getTotemProfile, SIGN_ELEMENTS } from "@/data/totem";
import { getProfesion } from "@/data/profesion";
import type { ArchetypeKey } from "@/data/questions";
import type { SunSign } from "@/data/zodiac";
import type { Answers } from "@/store/funnel";

const RELATIONSHIP_COPY: Record<string, string> = {
  papa:   "tu papá",
  abuelo: "tu abuelo",
  pareja: "tu esposo o pareja",
  suegro: "tu suegro",
  otra:   "una figura paterna",
};

/* ── Cómo es (descriptivo) ── */
const ARCHETYPE_INSIGHTS: Record<ArchetypeKey, string[]> = {
  lider: [
    "Toma decisiones con autoridad — no duda cuando hay que actuar.",
    "Su presencia organiza el espacio. Cuando él llega, el ambiente cambia.",
    "Construye para durar. Lo que hace, lo hace bien o no lo hace.",
  ],
  explorador: [
    "Necesita movimiento. La rutina lo apaga, el cambio lo enciende.",
    "Su curiosidad es su brújula — va hacia donde hay algo nuevo que entender.",
    "Colecciona experiencias, no cosas. El recuerdo del viaje vale más que el souvenir.",
  ],
  creador: [
    "Piensa con las manos. Necesita hacer algo para procesar lo que siente.",
    "El detalle importa. Nota cuando algo está bien hecho y cuando no.",
    "Su espacio refleja quién es — cuida lo que lo rodea.",
  ],
  sabio: [
    "Observa antes de hablar. Cuando dice algo, vale la pena escucharlo.",
    "Le toma tiempo abrirse, pero cuando lo hace, es para siempre.",
    "Recarga en silencio. Un café, un libro, sin agenda.",
  ],
};

const ARCHETYPE_ANIMALS: Record<ArchetypeKey, string> = {
  lider:      "Águila Real",
  explorador: "Lobo Gris",
  creador:    "Jaguar",
  sabio:      "Búho Cornudo",
};

const ARCHETYPE_GLYPHS: Record<ArchetypeKey, string> = {
  lider:      "♦",
  explorador: "✦",
  creador:    "✿",
  sabio:      "◎",
};

/* ── Eneagrama — eneatipo por arquetipo (no cálculo natal; el real sale de test
   psicológico, no de fecha). Mapeo 1:1 con los 4 arquetipos del funnel. ── */
const ENEAGRAMA: Record<ArchetypeKey, { num: number; name: string; trait: string }> = {
  lider:      { num: 8, name: "El Desafiador",    trait: "Protector y decidido. Toma el control y defiende a los suyos." },
  explorador: { num: 7, name: "El Entusiasta",    trait: "Busca experiencias y variedad. La rutina lo apaga, lo nuevo lo enciende." },
  creador:    { num: 4, name: "El Individualista", trait: "Sensible y auténtico. Crea desde lo que siente, no desde lo que conviene." },
  sabio:      { num: 5, name: "El Investigador",  trait: "Observador y profundo. Recarga en silencio, decide con información." },
};

/* ── Saju (사주) — elemento dominante por año de nacimiento ── */
const SAJU_ELEMENTS = [
  { glyph: "木", name: "Madera", korean: "목" },
  { glyph: "木", name: "Madera", korean: "목" },
  { glyph: "火", name: "Fuego",  korean: "화" },
  { glyph: "火", name: "Fuego",  korean: "화" },
  { glyph: "土", name: "Tierra", korean: "토" },
  { glyph: "土", name: "Tierra", korean: "토" },
  { glyph: "金", name: "Metal",  korean: "금" },
  { glyph: "金", name: "Metal",  korean: "금" },
  { glyph: "水", name: "Agua",   korean: "수" },
  { glyph: "水", name: "Agua",   korean: "수" },
] as const;

function getSajuElement(birthDate: string) {
  const year = new Date(birthDate).getFullYear();
  return SAJU_ELEMENTS[((year - 4) % 10 + 10) % 10];
}

/* ── Diseño Humano tipo por arquetipo ── */
const HD_TIPOS: Record<ArchetypeKey, { tipo: string; porcentaje: string; resumen: string }> = {
  lider:      { tipo: "Manifestador",        porcentaje: "9%",  resumen: "Inicia antes de que otros vean la oportunidad. Su energía moviliza a los demás — actúa, no espera permiso. Ahí está su poder." },
  explorador: { tipo: "Generador Manifesto", porcentaje: "33%", resumen: "Tiene energía de Generador y arranque de Manifestador. Responde y a la vez inicia. Versátil, difícil de encasillar, siempre en movimiento." },
  creador:    { tipo: "Generador",           porcentaje: "37%", resumen: "Energía sostenida para lo que le apasiona. Cuando hace lo que ama, no se agota. Opera mejor respondiendo que iniciando — eso lo hace imparable." },
  sabio:      { tipo: "Proyector",           porcentaje: "21%", resumen: "Su energía no es para producción constante, es para guiar. Ve lo que otros no ven. Funciona mejor por invitación que por iniciativa propia." },
};

const HD_GUIDANCE: Record<ArchetypeKey, {
  strategy: string;
  notSelf: string;
  signature: string;
  tips: string[];
}> = {
  lider: {
    strategy: "Informar antes de actuar — no pedir permiso, sino reducir resistencia",
    notSelf: "Enojo (señal de que espera aprobación que no necesita)",
    signature: "Paz interior — cuando actúa alineado, siente calma, no ansiedad",
    tips: [
      "Informa a quienes impactas antes de ejecutar. No es pedir permiso — es liberar el camino.",
      "Su energía es de arranque, no de mantenimiento. Inicia con fuerza, delega el seguimiento.",
      "El enojo crónico es diagnóstico: algo le impide actuar con la autonomía que necesita.",
      "Necesita más descanso del que cree — su impacto viene en ráfagas de alta energía.",
    ],
  },
  explorador: {
    strategy: "Esperar y responder — dejar que la vida le presente lo que pide su energía",
    notSelf: "Frustración (señal de que inició sin que algo genuino lo llamara primero)",
    signature: "Satisfacción — cuando trabaja en lo correcto, la energía fluye sin agotamiento",
    tips: [
      "No inicia desde la mente — espera que algo lo jale genuinamente antes de moverse.",
      "Su energía sabe antes que su cabeza. Las respuestas corporales (un sí que siente, no que piensa) son su brújula.",
      "La frustración crónica indica que está haciendo lo que 'debería', no lo que lo convoca.",
      "Su energía es abundante cuando está bien dirigida — cuando se siente pesada, es momento de ajustar dirección.",
    ],
  },
  creador: {
    strategy: "Esperar responder — su energía sostenida se activa cuando algo genuino la convoca",
    notSelf: "Frustración (hacer lo que 'conviene' en vez de lo que le apasiona)",
    signature: "Satisfacción profunda — el trabajo que ama no lo agota, lo recarga",
    tips: [
      "Antes de comprometerse, espera sentir un sí físico, no solo lógico.",
      "Su energía es la más sostenida del sistema — úsela en lo que ama, no en lo que conviene.",
      "Termina lo que tiene pendiente antes de empezar algo nuevo. El enfoque sostenido es su superpoder.",
      "El trabajo que le apasiona no lo agota. Si se agota, es señal de que algo está fuera de alineación.",
    ],
  },
  sabio: {
    strategy: "Esperar la invitación — su guía es más valiosa cuando se pide, no cuando se ofrece",
    notSelf: "Amargura (señal de que guía a quien no pidió su guía)",
    signature: "Éxito reconocido por otros — cuando llega donde es visto, la vida fluye sola",
    tips: [
      "No comparte su visión sin que se la pidan. El que espera la invitación tiene diez veces más impacto.",
      "La amargura aparece cuando guía a quien no pidió su guía. Es señal, no falla personal.",
      "Su energía no es para producción sostenida — descansa sin culpa. Eso no es pereza, es diseño.",
      "Cuando llega a donde es reconocido, la vida fluye. Si hay resistencia constante, preguntarse: ¿hubo invitación real?",
    ],
  },
};

/* ── Cómo opera (accionable / soft skills) ── */
const ARCHETYPE_ACTIONS: Record<ArchetypeKey, { icon: string; title: string; body: string }[]> = {
  lider: [
    { icon: "◆", title: "Toma de decisiones", body: "No requiere validación externa. Cuando la lógica y el instinto se alinean, actúa — y casi siempre tiene razón." },
    { icon: "◈", title: "Dinámica de entorno", body: "Organiza sin proponérselo. La gente se acomoda a su alrededor de forma natural. Se nota cuando no está." },
    { icon: "✦", title: "Estándar de calidad", body: "Prefiere no empezar algo si no lo puede hacer bien. Lo que construye, lo construye para que dure." },
  ],
  explorador: [
    { icon: "◆", title: "Toma de decisiones", body: "Necesita moverse para pensar. Las mejores ideas le llegan en tránsito, no detrás de un escritorio." },
    { icon: "◈", title: "Dinámica de entorno", body: "Activa a los que están cerca. Su energía contagia el movimiento y abre puertas donde otros no ven salida." },
    { icon: "✦", title: "Zona de flujo", body: "Ambientes nuevos, retos sin manual de instrucciones. El aburrimiento es su único enemigo real." },
  ],
  creador: [
    { icon: "◆", title: "Toma de decisiones", body: "Procesa haciendo. Necesita un prototipo, no una junta. Su claridad llega cuando sus manos están ocupadas." },
    { icon: "◈", title: "Dinámica de entorno", body: "El desorden creativo tiene su lógica. Solo él sabe dónde está todo — y funciona." },
    { icon: "✦", title: "Zona de flujo", body: "Trabajo en solitario, tiempo no interrumpido. Así es como produce su mejor versión." },
  ],
  sabio: [
    { icon: "◆", title: "Toma de decisiones", body: "Observa hasta que la respuesta es obvia. Raramente se equivoca — porque raramente se apresura." },
    { icon: "◈", title: "Dinámica de entorno", body: "El menos visible, el más indispensable. Cuando se va, el espacio pierde profundidad." },
    { icon: "✦", title: "Zona de flujo", body: "Silencio, profundidad, una sola cosa a la vez. Así convierte la información en sabiduría." },
  ],
};

interface DossierRevealProps {
  archetypeKey: ArchetypeKey;
  sign: SunSign | null;
  relationship: string | null;
  birthDate: string | null;
  birthTime: string | null;
  answers: Answers;
  onContinue: () => void;
}

export function DossierReveal({
  archetypeKey,
  sign,
  relationship,
  birthDate,
  birthTime,
  answers,
  onContinue,
}: DossierRevealProps) {
  const [quoteSeed] = useState(() => Math.floor(Math.random() * 250));
  const quote = getArchetypeQuote(archetypeKey, quoteSeed);

  const arch       = ARCHETYPES[archetypeKey];
  const hdTipo     = HD_TIPOS[archetypeKey];
  const signInfo   = sign ? SIGN_INFO[sign] : null;
  const chinese    = birthDate ? getChineseZodiac(birthDate)  : null;
  const sajuEl     = birthDate ? getSajuElement(birthDate)    : null;
  const kinMaya    = birthDate ? getKinMaya(birthDate)         : null;
  const nahual     = kinMaya  ? getNahual(kinMaya.sealIndex)  : null;
  const element    = sign ? SIGN_ELEMENTS[sign] : "fuego";
  const affirmation = kinMaya
    ? getAffirmations(archetypeKey, kinMaya.sealIndex, element)
    : getAffirmations(archetypeKey, 0, element);
  const generation   = birthDate ? getGeneration(birthDate)      : null;
  const season       = birthDate ? getSeason(birthDate)          : null;
  const capsula      = birthDate ? getCapsulaTiempo(birthDate)   : null;
  const totemProfile = birthDate ? getTotemProfile(birthDate, answers, "sol") : null;
  const profesion    = getProfesion(answers.profesion);

  const luckyNumbers = Array.from(
    new Set([
      ...(signInfo?.luckyNumbers ?? []),
      ...(chinese?.luckyNumbers  ?? []),
    ])
  ).sort((a, b) => a - b).slice(0, 6);

  return (
    <div className="flex flex-col gap-10">
      {/* Animación de desbloqueo */}
      <Reveal
        archetypeName={arch.name}
        archetypeTagline={arch.tagline}
        essence={arch.essence}
        quote={quote}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.7 }}
        className="flex flex-col gap-6"
      >

        {/* ── Fecha de nacimiento ── */}
        {birthDate && (
          <div className="flex items-center gap-2 self-start rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3 py-1.5">
            <span className="text-[12px]" style={{ color: "var(--brand-primary)" }}>◈</span>
            <span className="text-[12px] text-[var(--brand-fg-muted)]">
              {new Date(birthDate + "T12:00:00").toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* ══ CAPA 1: NÚCLEO DE IDENTIDAD ══ */}
        <DossierCard label="Núcleo de identidad" delay={0}>
          <p className="text-[19px] leading-relaxed text-[var(--brand-fg)]">
            {arch.dossierLead}
          </p>
          {relationship && (
            <p className="text-xs italic text-[var(--brand-fg-muted)] mt-1">
              Pensado para {RELATIONSHIP_COPY[relationship] ?? relationship}.
            </p>
          )}
          <div className="border-t border-[var(--brand-border)] pt-4 mt-2 flex flex-col gap-2.5">
            {ARCHETYPE_INSIGHTS[archetypeKey].map((insight, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="shrink-0 mt-[4px]" style={{ color: "var(--brand-primary)" }}>◆</span>
                <p className="text-[14px] leading-relaxed text-[var(--brand-fg-muted)]">{insight}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-2.5">
            <span className="text-[16px] shrink-0" style={{ color: "var(--brand-primary)" }}>◈</span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">Animal de poder</p>
              <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{ARCHETYPE_ANIMALS[archetypeKey]}</p>
            </div>
          </div>

          {/* Lente profesional — personaliza según a qué se dedica */}
          {profesion && (
            <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3">
              <span className="text-[18px] shrink-0 leading-none mt-0.5">{profesion.emoji}</span>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">
                  Su mundo · {profesion.label}
                </p>
                <p className="text-[13px] leading-relaxed text-[var(--brand-fg)]">{profesion.dossierLine}</p>
              </div>
            </div>
          )}
        </DossierCard>

        {/* ══ CAPA 2: MAPA DE SISTEMAS ══ */}
        <DossierCard label="Mapa de sistemas" delay={80}>
            <div className="grid grid-cols-2 gap-3">
              <NatalBadge glyph={ARCHETYPE_GLYPHS[archetypeKey]} label={arch.name} sublabel="Arquetipo" />
              {signInfo && (
                <NatalBadge glyph={signInfo.glyph} label={signInfo.name} sublabel="Signo solar" />
              )}
              {chinese && (
                <NatalBadge glyph={chinese.glyph} label={chinese.name} sublabel="Año chino" />
              )}
              {sajuEl && (
                <NatalBadge glyph={sajuEl.glyph} label={sajuEl.name} sublabel={`Saju · ${sajuEl.korean}`} />
              )}
            </div>

            {/* Eneagrama — eneatipo por arquetipo */}
            <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-4 py-3">
              <span
                className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-[17px] font-bold text-white tabular-nums"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #E91E8C 100%)" }}
              >
                {ENEAGRAMA[archetypeKey].num}
              </span>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <p className="text-[13px] font-semibold text-[var(--brand-fg)]">
                    Eneatipo {ENEAGRAMA[archetypeKey].num} · {ENEAGRAMA[archetypeKey].name}
                  </p>
                </div>
                <p className="text-[11px] leading-snug text-[var(--brand-fg-muted)]">
                  {ENEAGRAMA[archetypeKey].trait}
                </p>
              </div>
            </div>

            {signInfo && (
              <p className="text-[14px] leading-relaxed text-[var(--brand-fg-muted)] border-t border-[var(--brand-border)] pt-4">
                {signInfo.dossierBlurb}
              </p>
            )}

            {luckyNumbers.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
                  Números de la suerte
                </p>
                <div className="flex gap-2 flex-wrap">
                  {luckyNumbers.map((n) => (
                    <span
                      key={n}
                      className="h-8 w-8 rounded-full border border-[var(--brand-border)] flex items-center justify-center text-[13px] font-medium tabular-nums text-[var(--brand-fg)]"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Diseño Humano — guía por arquetipo (no cálculo natal) */}
            <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-4 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">Diseño Humano</p>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(233,30,140,0.06)", color: "var(--brand-fg-muted)" }}
                >
                  Lectura de arquetipo
                </span>
              </div>
              <p className="text-[11px] text-[var(--brand-fg-muted)] leading-snug border-l-2 pl-3" style={{ borderColor: "rgba(233,30,140,0.25)" }}>
                Basado en tu arquetipo — no en un cálculo de nacimiento exacto. Tu tipo HD real requiere fecha, hora y lugar.
              </p>
              <p className="text-[13px] leading-relaxed text-[var(--brand-fg)]">
                {hdTipo.resumen}
              </p>
              {/* Estrategia + Not-Self + Firma */}
              <div className="flex flex-col gap-2 border-t border-[var(--brand-border)] pt-3">
                {[
                  { label: "Estrategia", value: HD_GUIDANCE[archetypeKey].strategy },
                  { label: "Señal de alarma", value: HD_GUIDANCE[archetypeKey].notSelf },
                  { label: "Señal de alineación", value: HD_GUIDANCE[archetypeKey].signature },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">{item.label}</p>
                    <p className="text-[12px] leading-snug text-[var(--brand-fg)]">{item.value}</p>
                  </div>
                ))}
              </div>
              {/* Tips accionables */}
              <div className="flex flex-col gap-1.5 border-t border-[var(--brand-border)] pt-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">Cómo actuar</p>
                {HD_GUIDANCE[archetypeKey].tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="shrink-0 text-[10px] mt-[3px]" style={{ color: "var(--brand-primary)" }}>◆</span>
                    <p className="text-[12px] leading-relaxed text-[var(--brand-fg-muted)]">{tip}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[var(--brand-fg-muted)] leading-snug border-t border-[var(--brand-border)] pt-2">
                ⊕ Con hora y lugar exactos calculamos tu tipo HD real con mayor profundidad y detalle personal.
              </p>
            </div>

            {/* Piedras acompañantes */}
            {totemProfile ? (
              <div className="flex flex-col gap-3 border-t border-[var(--brand-border)] pt-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
                  Piedras acompañantes
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { tier: "Mes de nacimiento", ...totemProfile.stone.primary },
                    { tier: "Signo solar",       ...totemProfile.stone.secondary },
                    { tier: "Intención",         ...totemProfile.stone.intention },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--brand-border)] shrink-0 mt-[1px] text-[var(--brand-fg-muted)]">
                        {s.tier}
                      </span>
                      <div>
                        <span className="text-[13px] font-semibold text-[var(--brand-fg)]">{s.name}</span>
                        <span className="text-[11px] text-[var(--brand-fg-muted)] ml-1">— {s.reason}</span>
                        <p className="text-[10px] italic text-[var(--brand-fg-muted)] opacity-75 mt-0.5">{s.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3">
                  <span className="text-[14px] shrink-0" style={{ color: "var(--brand-primary)" }}>⊕</span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">Lugar de poder</p>
                    <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{totemProfile.sacredPlace.type}</p>
                    <p className="text-[11px] text-[var(--brand-fg-muted)]">
                      {totemProfile.sacredPlace.examples.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-[var(--brand-border)] pt-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">
                  Piedra del arquetipo
                </p>
                <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-2.5">
                  <span className="text-[14px] shrink-0" style={{ color: "var(--brand-primary)" }}>◈</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[var(--brand-fg)]">{arch.piedra.label}</p>
                    <p className="text-[11px] text-[var(--brand-fg-muted)]">Con fecha de nacimiento desbloqueamos las 3 capas.</p>
                  </div>
                </div>
              </div>
            )}
        </DossierCard>

        {/* ══ CAPA 3: NAHUAL / CHOLQ'IJ (solo si hay fecha) ══ */}
        {nahual && (
          <DossierCard label={`Nahual ${nahual.name} · Calendario Maya`} delay={60}>
            <div className="flex items-start gap-3">
              <span className="text-[32px] leading-none shrink-0">{nahual.symbol}</span>
              <div className="flex flex-col gap-1">
                <p className="text-[15px] font-semibold text-[var(--brand-fg)]">
                  {nahual.name} — {nahual.spanishName}
                </p>
                <p className="text-[13px] italic text-[var(--brand-fg-muted)] leading-snug">
                  {nahual.essence}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-[var(--brand-border)] pt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">Misión de vida</p>
              <p className="text-[13px] leading-relaxed text-[var(--brand-fg)]">{nahual.mision}</p>
            </div>
            <div className="flex flex-col gap-2 border-t border-[var(--brand-border)] pt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">Dones naturales</p>
              {nahual.gifts.map((g, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="shrink-0 text-[10px] mt-[3px]" style={{ color: "var(--brand-primary)" }}>◆</span>
                  <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)]">{g}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3 flex flex-col gap-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-fg-muted)]">Punto de crecimiento</p>
              <p className="text-[12px] leading-snug text-[var(--brand-fg)]">{nahual.shadow}</p>
            </div>
            <div className="flex flex-col gap-2 border-t border-[var(--brand-border)] pt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">Cómo vivir tu nahual</p>
              {nahual.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="shrink-0 text-[10px] mt-[3px]" style={{ color: "var(--brand-primary)" }}>✦</span>
                  <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)]">{tip}</p>
                </div>
              ))}
            </div>
          </DossierCard>
        )}

        {/* ══ CAPA 6: ASTROCARTOGRAFÍA + VIAJE (solo si hay fecha, PRO) ══ */}
        {birthDate && (
          <AstrocartographySection
            birthDate={birthDate}
            birthTime={birthTime ?? ""}
            sunSign={sign}
            archetypeKey={archetypeKey}
          />
        )}

        {/* ══ CAPA 5: CONTEXTO DE ÉPOCA (solo si hay fecha) ══ */}
        {(generation || season || capsula) && (
          <DossierCard label="Contexto de época" delay={60}>
            {(generation || season) && (
              <div className="grid grid-cols-2 gap-3">
                {generation && (
                  <div className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">Generación</p>
                    <p className="text-[14px] font-semibold text-[var(--brand-fg)]">{generation.name}</p>
                    <p className="text-[11px] text-[var(--brand-fg-muted)]">{generation.birthYears}</p>
                  </div>
                )}
                {season && (
                  <div className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3 py-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">Estación</p>
                    <p className="text-[14px] font-semibold text-[var(--brand-fg)]">
                      <span style={{ color: "var(--brand-primary)" }}>{season.glyph} </span>
                      {season.name}
                    </p>
                    <p className="text-[11px] text-[var(--brand-fg-muted)] leading-snug">{season.blurb}</p>
                  </div>
                )}
              </div>
            )}

            {generation && (
              <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)] border-t border-[var(--brand-border)] pt-4">
                {generation.blurb}
              </p>
            )}

            {capsula && (
              <div className="flex flex-col gap-3 border-t border-[var(--brand-border)] pt-4">
                <p className="text-[12px] font-semibold text-[var(--brand-fg)]">
                  Cápsula del tiempo — {capsula.era}
                </p>
                <ul className="flex flex-col gap-2">
                  <CapsulRow icon="♪" label="Música" value={capsula.musicaRef} />
                  <CapsulRow icon="◎" label="Cultura" value={capsula.culturaRef} />
                  <CapsulRow icon="◈" label="Tecnología" value={capsula.techRef} />
                </ul>
              </div>
            )}
          </DossierCard>
        )}

        {/* ══ CAPA 6: CÓMO OPERA EN EL MUNDO ══ */}
        <DossierCard label="Cómo opera en el mundo" delay={60}>
          <div className="flex flex-col gap-4">
            {ARCHETYPE_ACTIONS[archetypeKey].map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <span className="text-[16px] shrink-0 mt-[2px]" style={{ color: "var(--brand-primary)" }}>
                  {item.icon}
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--brand-fg)]">{item.title}</p>
                  <p className="text-[13px] leading-relaxed text-[var(--brand-fg-muted)] mt-0.5">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </DossierCard>

        {/* ══ AFIRMACIÓN PERSONAL ══ */}
        <div className="rounded-[var(--radius-lg)] overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(233,30,140,0.08) 100%)", border: "1px solid rgba(233,30,140,0.18)" }}
        >
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: "var(--brand-primary)" }}>
              Su afirmación
            </p>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(233,30,140,0.12)", color: "var(--brand-primary)" }}
            >
              Única · {nahual ? nahual.name : "Personal"}
            </span>
          </div>

          <div className="px-6 pb-5 flex flex-col gap-4">
            {/* Las 3 líneas — tratadas como poema */}
            <div className="flex flex-col gap-3 border-l-2 pl-4 mt-2" style={{ borderColor: "rgba(233,30,140,0.3)" }}>
              {affirmation.lines.map((line, i) => (
                <p
                  key={i}
                  className="leading-relaxed text-[var(--brand-fg)]"
                  style={{
                    fontSize: i === 0 ? "17px" : "14px",
                    fontStyle: i === 1 ? "italic" : "normal",
                    fontFamily: i <= 1 ? "var(--font-display, inherit)" : undefined,
                    opacity: i === 2 ? 0.8 : 1,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Ritual */}
            <div className="flex flex-col gap-1.5 border-t pt-4" style={{ borderColor: "rgba(233,30,140,0.15)" }}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">Ritual de activación</p>
              <p className="text-[12px] leading-relaxed text-[var(--brand-fg-muted)]">{affirmation.ritual}</p>
            </div>

            {/* Nota de impresión */}
            <p className="text-[10px] text-[var(--brand-fg-muted)] opacity-60 leading-snug">
              ◈ Esta afirmación aparece impresa en las versiones Ritual, Ceremonia y Legado.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <button
          type="button"
          onClick={onContinue}
          style={{
            touchAction: "manipulation",
            background: "linear-gradient(90deg, #F97316 0%, #E91E8C 100%)",
          }}
          className="w-full min-h-[56px] rounded-full text-white text-[18px] font-semibold select-none hover:opacity-90 active:opacity-80 transition-opacity active:scale-[0.99]"
        >
          Elige su regalo →
        </button>
      </motion.div>
    </div>
  );
}

/* ── Sub-componentes ── */

function DossierCard({
  label,
  children,
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <div className="rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 flex flex-col gap-4">
        <p className="text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: "var(--brand-primary)" }}>
          {label}
        </p>
        {children}
      </div>
    </ScrollReveal>
  );
}

function CapsulRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex gap-2 items-start text-[12px]">
      <span className="shrink-0 mt-[1px]" style={{ color: "var(--brand-primary)" }}>{icon}</span>
      <span className="font-medium text-[var(--brand-fg)] shrink-0 w-20">{label}</span>
      <span className="text-[var(--brand-fg-muted)] leading-snug">{value}</span>
    </li>
  );
}

function NatalBadge({ glyph, label, sublabel }: { glyph: string; label: string; sublabel: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--brand-border)] bg-[var(--brand-bg)] px-2 py-3 text-center">
      <span className="text-[22px] leading-none" style={{ color: "var(--brand-primary)" }}>{glyph}</span>
      <p className="text-[13px] font-semibold leading-tight text-[var(--brand-fg)]">{label}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--brand-fg-muted)]">{sublabel}</p>
    </div>
  );
}
