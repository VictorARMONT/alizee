/**
 * ALIZEE — Banco de preguntas del funnel (sección PADRE)
 *
 * Q1  relación      → kind: "single"    (¿para quién?)
 * Q2  proyección    → kind: "image"     (grid 2×2, proyección visual)
 * Q3  decision      → kind: "single"    (conductual — Big Five)
 * Q4  presion       → kind: "single"    (estrés — Big Five, muy diagnóstico)
 * Q5  valores       → kind: "single"    (Schwartz; tiebreaker de arquetipo)
 * Q6  mascotas      → kind: "single"    (cross-sell: escultura 3D perro / altar)
 * Q7  nacimiento    → kind: "datetime"  (opcional; desbloquea análisis astral)
 */

export type ArchetypeKey = "lider" | "explorador" | "creador" | "sabio";

export type QuestionId =
  | "relationship"
  | "proyeccion"
  | "decision"
  | "presion"
  | "valores"
  | "mascotas"
  | "fechaNacimiento";

export interface Option {
  key: string;
  label: string;
  archetype?: ArchetypeKey;
  glyph?: string;
  imageUrl?: string;
  caption?: string;
}

export type QuestionKind = "single" | "image" | "date" | "datetime";

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

const TOTAL = 7;

export const QUESTIONS: Question[] = [
  /* ── Q1: RELACIÓN ── */
  {
    id: "relationship",
    kind: "single",
    index: 1,
    total: TOTAL,
    kicker: "Paso 1 de 7",
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
    kicker: "Paso 2 de 7",
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

  /* ── Q3: TOMA DE DECISIONES (Big Five: Conscientiousness + Extraversión) ── */
  {
    id: "decision",
    kind: "single",
    index: 3,
    total: TOTAL,
    kicker: "Paso 3 de 7",
    prompt: "Cuando tiene que tomar una decisión importante, ¿cómo la toma?",
    subtext: "Piensa en cómo actúa, no en cómo le gustaría actuar.",
    options: [
      { key: "rapido",      archetype: "lider",
        label: "Evalúa rápido y actúa — no necesita que todos estén de acuerdo" },
      { key: "instinto",    archetype: "explorador",
        label: "Confía en el instinto y se mueve aunque no tenga todo claro" },
      { key: "analiza",     archetype: "creador",
        label: "Analiza los detalles hasta tener algo concreto en la mano" },
      { key: "espera",      archetype: "sabio",
        label: "Espera. Observa más de lo que pregunta. Decide cuando ya es obvio" },
    ],
  },

  /* ── Q4: RESPUESTA AL ESTRÉS (Big Five: Neuroticism / Stability, muy diagnóstico) ── */
  {
    id: "presion",
    kind: "single",
    index: 4,
    total: TOTAL,
    kicker: "Paso 4 de 7",
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
    kicker: "Paso 5 de 7",
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
    kicker: "Paso 6 de 7",
    prompt: "¿Tiene animales en casa?",
    subtext: "Nos ayuda a personalizar algunas piezas del box.",
    options: [
      { key: "perro",  glyph: "🐕", label: "Sí — tiene perro" },
      { key: "gato",   glyph: "🐱", label: "Sí — tiene gato (u otro)" },
      { key: "varios", glyph: "🐾", label: "Sí — le gustan todos" },
      { key: "no",     glyph: "🌿", label: "No, prefiere otras cosas" },
    ],
  },

  /* ── Q7: FECHA + HORA DE NACIMIENTO (opcional) ── */
  {
    id: "fechaNacimiento",
    kind: "datetime",
    index: 7,
    total: TOTAL,
    kicker: "Paso 7 de 7",
    prompt: "¿Conoces su fecha y hora de nacimiento?",
    subtext: "Desbloquea el análisis astral completo de tu paquete.",
    skipLabel: "No la sé / Prefiero saltar",
  },
];

export const TOTAL_STEPS = TOTAL;
export const TIEBREAKER_QUESTION_ID: QuestionId = "valores";
