/**
 * ALIZEE — Profesión / ocupación del festejado.
 *
 * Pregunta concreta y de baja fricción (no esotérica). No pesa en el arquetipo;
 * personaliza el DOSSIER con una lectura "lente profesional".
 *
 * Fase 2: mapear profesión → pieza física del box (material/objeto por oficio).
 */

export type ProfesionKey =
  | "negocios"
  | "oficio"
  | "salud"
  | "educacion"
  | "campo"
  | "transporte"
  | "creativo"
  | "otro";

export interface Profesion {
  key: ProfesionKey;
  emoji: string;
  label: string;
  /** Línea para el dossier — cómo su trabajo se relaciona con el regalo. */
  dossierLine: string;
}

export const PROFESIONES: Profesion[] = [
  {
    key: "negocios",
    emoji: "💼",
    label: "Negocios / liderazgo",
    dossierLine:
      "Su día se va en decidir. El descanso real le rinde más que otra hora frente a la pantalla — el regalo se lo recuerda.",
  },
  {
    key: "oficio",
    emoji: "🔧",
    label: "Oficio / técnico",
    dossierLine:
      "Trabaja con las manos y arregla lo que otros no pueden. Un objeto bien hecho le habla en su idioma.",
  },
  {
    key: "salud",
    emoji: "⚕️",
    label: "Salud / cuidado",
    dossierLine:
      "Cuida a otros todo el día. Pocas veces recibe algo pensado para él — este regalo invierte esa balanza.",
  },
  {
    key: "educacion",
    emoji: "📚",
    label: "Educación / academia",
    dossierLine:
      "Vive transmitiendo lo que sabe. Un detalle con significado y contexto le resuena más que un objeto vacío.",
  },
  {
    key: "campo",
    emoji: "🌾",
    label: "Campo / aire libre",
    dossierLine:
      "Su lugar está afuera, con la tierra. Lo natural y duradero le importa más que lo nuevo.",
  },
  {
    key: "transporte",
    emoji: "🚗",
    label: "Transporte / ruta",
    dossierLine:
      "Pasa horas en movimiento. Un objeto que lo acompañe en el camino tiene sentido para él.",
  },
  {
    key: "creativo",
    emoji: "🎨",
    label: "Arte / creativo",
    dossierLine:
      "Crea para vivir. Aprecia el detalle y el oficio en lo que recibe — nota cuando algo está bien hecho.",
  },
  {
    key: "otro",
    emoji: "✦",
    label: "Otra / jubilado",
    dossierLine:
      "Su historia no cabe en una sola etiqueta. El regalo habla de quién es, no de lo que hace.",
  },
];

const BY_KEY: Record<string, Profesion> = Object.fromEntries(
  PROFESIONES.map((p) => [p.key, p]),
);

export function getProfesion(key: string | null | undefined): Profesion | null {
  if (!key) return null;
  return BY_KEY[key] ?? null;
}
