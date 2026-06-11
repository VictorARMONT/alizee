/**
 * ALIZEE — Banco de preguntas del funnel (sección PADRE)
 *
 * Q1  relación      → kind: "single"    (¿para quién?)
 * Q2  profesión     → kind: "single"    (¿a qué se dedica? — personaliza dossier)
 * Q3  proyección    → kind: "image"     (grid 2×2, proyección visual — arquetipo)
 * Q4  decision      → kind: "image"     (grid 2×2, lugar en su elemento — arquetipo)
 * Q5  presion       → kind: "single"    (Big Five: estabilidad emocional — arquetipo)
 * Q6  energia       → kind: "single"    (Big Five: extraversión — arquetipo)
 * Q7  apertura      → kind: "single"    (Big Five: apertura a la experiencia — arquetipo)
 * Q8  valores       → kind: "single"    (Schwartz; tiebreaker de arquetipo)
 * Q9  mascotas      → kind: "single"    (cross-sell: escultura 3D perro / altar)
 * Q10 sobreEl       → kind: "text"      (texto libre opcional — quien arma el box lo lee)
 * Q11 nacimiento    → kind: "date"      (opcional; muestra Signos + selección de paquete)
 *
 * El indicador "Paso X de Y" se calcula en QuizFlow desde index/TOTAL_STEPS
 * (no hardcodear en cada pregunta).
 */

import { PROFESIONES } from "@/data/profesion";

export type ArchetypeKey = "lider" | "explorador" | "creador" | "sabio";

export type QuestionId =
  | "relationship"
  | "profesion"
  | "proyeccion"
  | "decision"
  | "presion"
  | "energia"
  | "apertura"
  | "valores"
  | "mascotas"
  | "sobreEl"
  | "fechaNacimiento";

export interface Option {
  key: string;
  label: string;
  archetype?: ArchetypeKey;
  glyph?: string;
  imageUrl?: string;
  caption?: string;
}

export type QuestionKind = "single" | "image" | "date" | "time" | "text";

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
  placeholder?: string;
}

const TOTAL = 11;

export const QUESTIONS: Question[] = [
  /* ── Q1: RELACIÓN ── */
  {
    id: "relationship",
    kind: "single",
    index: 1,
    total: TOTAL,
    prompt: "¿Para quién es el regalo?",
    options: [
      { key: "papa",   label: "Mi papá",            glyph: "◆" },
      { key: "abuelo", label: "Mi abuelo",           glyph: "◈" },
      { key: "pareja", label: "Mi esposo o pareja",  glyph: "◉" },
      { key: "suegro", label: "Mi suegro",           glyph: "◊" },
      { key: "otra",   label: "Otra figura paterna", glyph: "✦" },
    ],
  },

  /* ── Q2: PROFESIÓN (concreta, baja fricción; personaliza dossier, no arquetipo) ── */
  {
    id: "profesion",
    kind: "single",
    index: 2,
    total: TOTAL,
    prompt: "¿A qué se dedica?",
    subtext: "Su profesión nos ayuda a que el regalo conecte con su mundo.",
    options: PROFESIONES.map((p) => ({
      key: p.key,
      label: p.label,
      glyph: p.emoji,
    })),
  },

  /* ── Q3: PROYECCIÓN VISUAL ── */
  {
    id: "proyeccion",
    kind: "image",
    index: 3,
    total: TOTAL,
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

  /* ── Q4: LUGAR EN SU ELEMENTO (proyección visual de entorno) ── */
  {
    id: "decision",
    kind: "image",
    index: 4,
    total: TOTAL,
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

  /* ── Q5: RESPUESTA AL ESTRÉS (Big Five: Estabilidad emocional / Neuroticism) ── */
  {
    id: "presion",
    kind: "single",
    index: 5,
    total: TOTAL,
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

  /* ── Q6: ENERGÍA SOCIAL (Big Five: Extraversión) ── */
  {
    id: "energia",
    kind: "single",
    index: 6,
    total: TOTAL,
    prompt: "En una reunión con gente, él suele…",
    options: [
      { key: "lidera",   archetype: "lider",
        label: "Llevar la conversación. La gente lo busca" },
      { key: "circula",  archetype: "explorador",
        label: "Moverse entre grupos, conociendo a todos" },
      { key: "afondo",   archetype: "creador",
        label: "Hablar a fondo con una o dos personas" },
      { key: "observa",  archetype: "sabio",
        label: "Observar y escuchar más de lo que habla" },
    ],
  },

  /* ── Q7: APERTURA A LA EXPERIENCIA (Big Five: Openness) ── */
  {
    id: "apertura",
    kind: "single",
    index: 7,
    total: TOTAL,
    prompt: "Frente a algo nuevo y desconocido, él…",
    options: [
      { key: "lanza",     archetype: "explorador",
        label: "Se lanza primero y pregunta después" },
      { key: "estudia",   archetype: "creador",
        label: "Lo estudia para entender cómo funciona" },
      { key: "evalua",    archetype: "lider",
        label: "Evalúa si vale la pena antes de entrar" },
      { key: "probado",   archetype: "sabio",
        label: "Prefiere lo probado; lo nuevo debe ganárselo" },
    ],
  },

  /* ── Q8: VALORES — TIEBREAKER (Schwartz Basic Human Values) ── */
  {
    id: "valores",
    kind: "single",
    index: 8,
    total: TOTAL,
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

  /* ── Q9: MASCOTAS — señal de cross-sell (sin peso en arquetipo) ── */
  {
    id: "mascotas",
    kind: "single",
    index: 9,
    total: TOTAL,
    prompt: "¿Tiene animales en casa?",
    subtext: "Nos ayuda a personalizar algunas piezas del box.",
    options: [
      { key: "perro",  glyph: "🐕", label: "Sí — tiene perro" },
      { key: "gato",   glyph: "🐱", label: "Sí — tiene gato (u otro)" },
      { key: "varios", glyph: "🐾", label: "Sí — le gustan todos" },
      { key: "no",     glyph: "🌿", label: "No, prefiere otras cosas" },
    ],
  },

  /* ── Q10: TEXTO LIBRE — quien arma el box lo lee (opcional) ── */
  {
    id: "sobreEl",
    kind: "text",
    index: 10,
    total: TOTAL,
    prompt: "¿Qué lo hace único?",
    subtext: "Una frase tuya sobre él nos ayuda a darle el toque final. Opcional.",
    placeholder: "Ej. Le encanta la pesca, siempre cuenta la misma historia, nunca se pierde un partido…",
    skipLabel: "Saltar este paso",
  },

  /* ── Q11: FECHA DE NACIMIENTO + PAQUETE (opcional) ── */
  {
    id: "fechaNacimiento",
    kind: "date",
    index: 11,
    total: TOTAL,
    prompt: "¿Conoces su fecha de nacimiento?",
    subtext: "Desbloquea sus signos y elige el paquete de su regalo.",
    skipLabel: "No la sé / Prefiero saltar",
  },

];

export const TOTAL_STEPS = TOTAL;
export const TIEBREAKER_QUESTION_ID: QuestionId = "valores";
