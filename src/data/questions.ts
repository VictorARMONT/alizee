/**
 * ALIZEE — Banco de preguntas del funnel (sección PADRE)
 *
 * Q1  relación      → kind: "single"    (¿para quién?)
 * Q2  proyección    → kind: "image"     (grid 2×2, proyección visual)
 * Q3  decision      → kind: "image"     (grid 2×2, lugar en su elemento)
 * Q4  presion       → kind: "single"    (estrés — Big Five, muy diagnóstico)
 * Q5  valores       → kind: "single"    (Schwartz; tiebreaker de arquetipo)
 * Q6  mascotas      → kind: "single"    (cross-sell: escultura 3D perro / altar)
 * Q7  nacimiento    → kind: "date"      (opcional; muestra Signos + selección de paquete)
 * Q8  hora          → kind: "time"      (opcional; afina análisis avanzado)
 */

export type ArchetypeKey = "lider" | "explorador" | "creador" | "sabio";

export type QuestionId =
  | "relationship"
  | "proyeccion"
  | "decision"
  | "presion"
  | "valores"
  | "mascotas"
  | "fechaNacimiento"
  | "horaNacimiento";

export interface Option {
  key: string;
  label: string;
  archetype?: ArchetypeKey;
  glyph?: string;
  imageUrl?: string;
  caption?: string;
}

export type QuestionKind = "single" | "image" | "date" | "time";

export interface Question {
  id: QuestionId;
  kind: QuestionKind;
  index: number;
  total: number;
  prompt: string;
  kicker?: string;
  subtext?: string;
  options?: Option[];
  skipLabel?: string;
}

const TOTAL = 8;

export const QUESTIONS: Question[] = [
  /* ── Q1: RELACIÓN ── */
  {
    id: "relationship",
    kind: "single",
    index: 1,
    total: TOTAL,
    kicker: "Paso 1 de 8",
    prompt: "¿Para quién es el regalo?",
    options: [
      { key: "papa",   label: "Mi papá",            glyph: "◆" },
      { key: "abuelo", label: "Mi abuelo",           glyph: "◈" },
      { key: "pareja", label: "Mi esposo o pareja",  glyph: "◉" },
      { key: "suegro", label: "Mi suegro",           glyph: "◊" },
      { key: "otra",   label: "Otra figura paterna", glyph: "✦" },
    ],
  },

  /* ── Q2: PROYECCIÓN VISUAL ── */
  {
    id: "proyeccion",
    kind: "image",
    index: 2,
    total: TOTAL,
    kicker: "Paso 2 de 8",
    prompt: "¿Cuál de estas imágenes lo describe mejor en su elemento?",
    options: [
      {
        key: "orden",      archetype: "lider",
        label: "Orden y liderazgo",
        caption: "Clásico, decisivo, con presencia",
        imageUrl: "/quiz/q2-lider.webp",
      },
      {
        key: "movimiento", archetype: "explorador",
        label: "Movimiento y libertad",
        caption: "Curioso, sin mapa fijo, siempre en marcha",
        imageUrl: "/quiz/q2-explorador.webp",
      },
      {
        key: "oficio",     archetype: "creador",
        label: "Oficio y manos",
        caption: "Hábil, paciente, construye cosas reales",
        imageUrl: "/quiz/q2-creador.webp",
      },
      {
        key: "calma",      archetype: "sabio",
        label: "Calma y profundidad",
        caption: "Reflexivo, sereno, con criterio propio",
        imageUrl: "/quiz/q2-sabio.webp",
      },
    ],
  },

  /* ── Q3: LUGAR EN SU ELEMENTO (proyección visual de entorno) ── */
  {
    id: "decision",
    kind: "image",
    index: 3,
    total: TOTAL,
    kicker: "Paso 3 de 8",
    prompt: "¿En cuál de estos lugares se sentiría más en su elemento?",
    options: [
      {
        key: "oficina",    archetype: "lider",
        label: "Una oficina con vista",
        caption: "Altura, perspectiva, decisiones",
        imageUrl: "/quiz/q3-lider.webp",
      },
      {
        key: "carretera",  archetype: "explorador",
        label: "Una carretera abierta",
        caption: "Horizonte, movimiento, libertad",
        imageUrl: "/quiz/q3-explorador.webp",
      },
      {
        key: "taller",     archetype: "creador",
        label: "Un taller propio",
        caption: "Herramientas, oficio, manos",
        imageUrl: "/quiz/q3-creador.webp",
      },
      {
        key: "rincon",     archetype: "sabio",
        label: "Un rincón silencioso",
        caption: "Calma, lectura, profundidad",
        imageUrl: "/quiz/q3-sabio.webp",
      },
    ],
  },

  /* ── Q4: RESPUESTA AL ESTRÉS (Big Five: Neuroticism / Stability, muy diagnóstico) ── */
  {
    id: "presion",
    kind: "single",
    index: 4,
    total: TOTAL,
    kicker: "Paso 4 de 8",
    prompt: "Cuando algo sale mal, su primera reacción es…",
    options: [
      { key: "control",     archetype: "lider",
        label: "Tomar el control y resolver. El problema no lo paraliza, lo activa" },
      { key: "ruta",        archetype: "explorador",
        label: "Cambiar el plan. Siempre hay otra ruta" },
      { key: "reconstruir", archetype: "creador",
        label: "Entender qué falló y reconstruirlo mejor" },
      { key: "distancia",   archetype: "sabio",
        label: "Alejarse para ver el problema claro antes de actuar" },
    ],
  },

  /* ── Q5: VALORES — TIEBREAKER (Schwartz Basic Human Values) ── */
  {
    id: "valores",
    kind: "single",
    index: 5,
    total: TOTAL,
    kicker: "Paso 5 de 8",
    prompt: "¿Qué es lo que más valora en las personas que lo rodean?",
    options: [
      { key: "lealtad",     archetype: "lider",
        label: "Lealtad y cumplimiento de palabra" },
      { key: "energia",     archetype: "explorador",
        label: "Energía, apertura y disposición a moverse" },
      { key: "competencia", archetype: "creador",
        label: "Competencia y atención al detalle" },
      { key: "profundidad", archetype: "sabio",
        label: "Honestidad intelectual y profundidad" },
    ],
  },

  /* ── Q6: MASCOTAS — señal de cross-sell (sin peso en arquetipo) ── */
  {
    id: "mascotas",
    kind: "single",
    index: 6,
    total: TOTAL,
    kicker: "Paso 6 de 8",
    prompt: "¿Tiene animales en casa?",
    subtext: "Nos ayuda a personalizar algunas piezas del box.",
    options: [
      { key: "perro",  glyph: "🐕", label: "Sí — tiene perro" },
      { key: "gato",   glyph: "🐱", label: "Sí — tiene gato (u otro)" },
      { key: "varios", glyph: "🐾", label: "Sí — le gustan todos" },
      { key: "no",     glyph: "🌿", label: "No, prefiere otras cosas" },
    ],
  },

  /* ── Q7: FECHA DE NACIMIENTO + PAQUETE (opcional) ── */
  {
    id: "fechaNacimiento",
    kind: "date",
    index: 7,
    total: TOTAL,
    kicker: "Paso 7 de 8",
    prompt: "¿Conoces su fecha de nacimiento?",
    subtext: "Desbloquea sus signos y elige el paquete de su regalo.",
    skipLabel: "No la sé / Prefiero saltar",
  },

  /* ── Q8: HORA DE NACIMIENTO (opcional; afina análisis avanzado) ── */
  {
    id: "horaNacimiento",
    kind: "time",
    index: 8,
    total: TOTAL,
    kicker: "Paso 8 de 8",
    prompt: "¿A qué hora nació?",
    subtext: "La hora exacta afina su análisis astral. Si no la sabes, puedes saltar este paso.",
    skipLabel: "No sé la hora / Saltar",
  },

];

export const TOTAL_STEPS = TOTAL;
export const TIEBREAKER_QUESTION_ID: QuestionId = "valores";
