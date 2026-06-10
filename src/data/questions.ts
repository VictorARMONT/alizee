/**
 * ALIZEE — Banco de preguntas del funnel (sección PADRE)
 *
 * 10 preguntas diseñadas sobre:
 *  - Big Five Personality Inventory (Costa & McCrae, 1992)
 *  - Tipología jungiana (Introversión/Extraversión, Thinking/Feeling)
 *  - Schwartz Basic Human Values
 *  - Observación conductual (executive coaching)
 *
 * Q1       relación    → kind: "single"    (¿para quién?)
 * Q2–Q4    arquetipo   → kind: "image"     (grid 2×2, proyección visual)
 * Q5–Q9    arquetipo   → kind: "single"    (conductual + valores)
 * Q10      nacimiento  → kind: "datetime"  (fecha + hora; hora req. en non-Lite)
 *
 * imageUrl en Q2-Q4: dejar vacío hasta que Victor entregue fotos.
 */

export type ArchetypeKey = "lider" | "explorador" | "creador" | "sabio";

export type QuestionId =
  | "relationship"
  | "proyeccion"
  | "espacio"
  | "decision"
  | "presion"
  | "valores"
  | "material"
  | "recarga"
  | "mascotas"
  | "describe"
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

const TOTAL = 11;

export const QUESTIONS: Question[] = [
  /* ── Q1: RELACIÓN ── */
  {
    id: "relationship",
    kind: "single",
    index: 1,
    total: TOTAL,
    kicker: "Paso 1 de 11",
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
    kicker: "Paso 2 de 11",
    prompt: "¿Cuál de estas imágenes lo describe mejor en su elemento?",
    options: [
      {
        key: "orden",     archetype: "lider",
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
        key: "oficio",    archetype: "creador",
        label: "Oficio y manos",
        caption: "Hábil, paciente, construye cosas reales",
        imageUrl: "/quiz/q2-creador.webp",
      },
      {
        key: "calma",     archetype: "sabio",
        label: "Calma y profundidad",
        caption: "Reflexivo, sereno, con criterio propio",
        imageUrl: "/quiz/q2-sabio.webp",
      },
    ],
  },

  /* ── Q3: ESPACIO IDEAL ── */
  {
    id: "espacio",
    kind: "image",
    index: 3,
    total: TOTAL,
    kicker: "Paso 3 de 11",
    prompt: "Su lugar favorito se parece más a…",
    options: [
      {
        key: "oficina",    archetype: "lider",
        label: "Una oficina con vista",
        caption: "Donde las decisiones toman forma",
        imageUrl: "/quiz/q3-lider.webp",
      },
      {
        key: "carretera",  archetype: "explorador",
        label: "Una carretera abierta",
        caption: "Sin plan fijo, con horizonte",
        imageUrl: "/quiz/q3-explorador.webp",
      },
      {
        key: "taller",     archetype: "creador",
        label: "Un taller propio",
        caption: "Donde construye algo con sus manos",
        imageUrl: "/quiz/q3-creador.webp",
      },
      {
        key: "rincon",     archetype: "sabio",
        label: "Un rincón silencioso",
        caption: "Café, libro, sin interrupciones",
        imageUrl: "/quiz/q3-sabio.webp",
      },
    ],
  },

  /* ── Q4: TOMA DE DECISIONES (Big Five: Conscientiousness + Extraversión) ── */
  {
    id: "decision",
    kind: "single",
    index: 4,
    total: TOTAL,
    kicker: "Paso 4 de 11",
    prompt: "Cuando tiene que tomar una decisión importante, ¿cómo la toma?",
    subtext: "Piensa en cómo actúa, no en cómo le gustaría actuar.",
    options: [
      { key: "rapido",    archetype: "lider",
        label: "Evalúa rápido y actúa — no necesita que todos estén de acuerdo" },
      { key: "instinto",  archetype: "explorador",
        label: "Confía en el instinto y se mueve aunque no tenga todo claro" },
      { key: "analiza",   archetype: "creador",
        label: "Analiza los detalles hasta tener algo concreto en la mano" },
      { key: "espera",    archetype: "sabio",
        label: "Espera. Observa más de lo que pregunta. Decide cuando ya es obvio" },
    ],
  },

  /* ── Q5: RESPUESTA AL ESTRÉS (Big Five: Neuroticism / Stability, muy diagnóstico) ── */
  {
    id: "presion",
    kind: "single",
    index: 5,
    total: TOTAL,
    kicker: "Paso 5 de 11",
    prompt: "Cuando algo sale mal, su primera reacción es…",
    options: [
      { key: "control",   archetype: "lider",
        label: "Tomar el control y resolver. El problema no lo paraliza, lo activa" },
      { key: "ruta",      archetype: "explorador",
        label: "Cambiar el plan. Siempre hay otra ruta" },
      { key: "reconstruir", archetype: "creador",
        label: "Entender qué falló y reconstruirlo mejor" },
      { key: "distancia", archetype: "sabio",
        label: "Alejarse para ver el problema claro antes de actuar" },
    ],
  },

  /* ── Q6: VALORES (Schwartz Basic Human Values) ── */
  {
    id: "valores",
    kind: "single",
    index: 6,
    total: TOTAL,
    kicker: "Paso 6 de 11",
    prompt: "¿Qué es lo que más valora en las personas que lo rodean?",
    options: [
      { key: "lealtad",      archetype: "lider",
        label: "Lealtad y cumplimiento de palabra" },
      { key: "energia",      archetype: "explorador",
        label: "Energía, apertura y disposición a moverse" },
      { key: "competencia",  archetype: "creador",
        label: "Competencia y atención al detalle" },
      { key: "profundidad",  archetype: "sabio",
        label: "Honestidad intelectual y profundidad" },
    ],
  },

  /* ── Q7: MATERIAL / TEXTURA (proyección simbólica) ── */
  {
    id: "material",
    kind: "image",
    index: 7,
    total: TOTAL,
    kicker: "Paso 7 de 11",
    prompt: "¿Con qué material lo describes?",
    options: [
      {
        key: "piel",   archetype: "lider",
        label: "Piel",
        caption: "Clásica, estructurada, con carácter",
        imageUrl: "/quiz/q7-lider.webp",
      },
      {
        key: "vidrio", archetype: "sabio",
        label: "Vidrio",
        caption: "Transparente, refinado, sin ruido",
        imageUrl: "/quiz/q7-sabio.webp",
      },
      {
        key: "metal",  archetype: "creador",
        label: "Metal",
        caption: "Fuerte, preciso, permanente",
        imageUrl: "/quiz/q7-creador.webp",
      },
      {
        key: "piedra", archetype: "explorador",
        label: "Piedra",
        caption: "Natural, rugosa, inamovible",
        imageUrl: "/quiz/q7-explorador.webp",
      },
    ],
  },

  /* ── Q8: RECARGA DE ENERGÍA (Introversión/Extraversión + Openness) ── */
  {
    id: "recarga",
    kind: "single",
    index: 8,
    total: TOTAL,
    kicker: "Paso 8 de 11",
    prompt: "Después de una semana intensa, ¿cómo se recupera?",
    options: [
      { key: "plan",    archetype: "lider",
        label: "Con un buen plan para la siguiente semana — el orden lo recarga" },
      { key: "viaje",   archetype: "explorador",
        label: "Moviéndose: un viaje corto, un lugar nuevo, aire fresco" },
      { key: "proyecto", archetype: "creador",
        label: "Trabajando en algo propio que no tenga deadline" },
      { key: "silencio", archetype: "sabio",
        label: "En silencio: música, lectura, sin agenda" },
    ],
  },

  /* ── Q9: MASCOTAS (proyección afectiva) ── */
  {
    id: "mascotas",
    kind: "single",
    index: 9,
    total: TOTAL,
    kicker: "Paso 9 de 11",
    prompt: "¿Le gustan los animales? ¿Tiene mascotas?",
    subtext: "Dice mucho de cómo se relaciona con el mundo.",
    options: [
      { key: "perrijo",  archetype: "lider",
        label: "🐕 Perrijo — leal, protector, presencia que se siente" },
      { key: "los-dos",  archetype: "explorador",
        label: "🐾 Los dos — abierto, no se cierra a nada" },
      { key: "michi",    archetype: "sabio",
        label: "🐱 Michi — independiente, observador, a su ritmo" },
      { key: "ninguno",  archetype: "creador",
        label: "◎ Ninguno — prefiere sus plantas, proyectos o el silencio" },
    ],
  },

  /* ── Q10: DESCRIPTOR — TIEBREAKER ── */
  {
    id: "describe",
    kind: "single",
    index: 10,
    total: TOTAL,
    kicker: "Paso 10 de 11",
    prompt: "Si tuvieras que describirlo en una palabra:",
    options: [
      { key: "determinado", archetype: "lider",
        label: "Determinado — actúa y protege" },
      { key: "curioso",     archetype: "explorador",
        label: "Inquieto — siempre en busca de algo" },
      { key: "habil",       archetype: "creador",
        label: "Minucioso — hace cosas que duran" },
      { key: "sereno",      archetype: "sabio",
        label: "Reflexivo — piensa antes de hablar" },
    ],
  },

  /* ── Q11: FECHA + HORA DE NACIMIENTO ── */
  {
    id: "fechaNacimiento",
    kind: "datetime",
    index: 11,
    total: TOTAL,
    kicker: "Paso 11 de 11",
    prompt: "¿Conoces su fecha y hora de nacimiento?",
    subtext: "Desbloquea el análisis astral completo de tu paquete.",
    skipLabel: "No la sé / Prefiero saltar",
  },
];

export const TOTAL_STEPS = TOTAL;
export const TIEBREAKER_QUESTION_ID: QuestionId = "describe";
