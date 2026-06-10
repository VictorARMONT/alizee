/**
 * ALIZEE — Afirmaciones personalizadas
 *
 * Híbrido PNL + psicomagia:
 *   - Estructura NLP: presente, primera persona, afirmativo
 *   - Tono psicomágico: metáfora, imagen, objeto ritual
 *
 * Generación determinista por: arquetipo + índice nahual + elemento solar
 * Resultado: 4 × 20 × 4 = 320 afirmaciones únicas (en la práctica única por persona)
 *
 * Línea 1 — Identidad (arquetipo, varía por nahual % 3)
 * Línea 2 — Misión (nahual)
 * Línea 3 — Permiso HD (tipo de Diseño Humano)
 * Ritual   — Instrucción para anclar con la vela de copal del box
 */

import type { ArchetypeKey } from "@/data/questions";
import type { ZodiacElement } from "@/data/totem";

export interface AffirmationProfile {
  lines: [string, string, string];
  ritual: string;
  printNote: string;
}

/* ── Línea 1: Identidad por arquetipo (3 variantes, selección por nahual % 3) ── */

const IDENTITY: Record<ArchetypeKey, [string, string, string]> = {
  lider: [
    "El fuego que llevo no pide permiso para arder.",
    "Construyo el camino mientras los demás buscan el mapa.",
    "Lo que protejo, permanece. Lo que inicio, transforma.",
  ],
  explorador: [
    "Mi casa es el movimiento. Donde hay horizonte, ahí comienzo.",
    "Soy el que llega a lugares que todavía no tienen nombre.",
    "La curiosidad que llevo es una brújula que nunca miente.",
  ],
  creador: [
    "Pienso con las manos. Lo que construyo no se olvida.",
    "Lo que hago con cuidado dura más que lo que hago con prisa.",
    "Cada cosa que toco lleva una parte de lo que soy.",
  ],
  sabio: [
    "El silencio que guardo tiene más respuestas que las preguntas que hago.",
    "Observo primero. Cuando hablo, ya sé lo que voy a decir.",
    "Mi profundidad no es distancia — es raíz.",
  ],
};

/* ── Línea 2: Misión por nahual (índice 0-19) ── */

const NAHUAL_MISSION: Record<number, string> = {
  0:  "El mundo que no se ve también me pertenece. Confío en lo que siento antes de lo que entiendo.",
  1:  "Llevo ideas que el mundo necesita pero todavía no sabe pedir.",
  2:  "Soy el amanecer que llega después de la noche más larga. Los umbrales no me detienen — los cruzo.",
  3:  "Lo que tejo no se rompe solo. Las redes que construyo sostienen más de lo que aparentan.",
  4:  "La energía que llevo es para crear, no para controlar. La transmito y se multiplica.",
  5:  "Lo que termina en mis manos no muere — se convierte en semilla de lo que sigue.",
  6:  "Guío sin imponerme. Con presencia basta.",
  7:  "Lo que planto crece. Mi abundancia no es accidente — es vocación que se practica.",
  8:  "Devuelvo al mundo lo que el mundo me da. En ese equilibrio vivo sin deuda.",
  9:  "Mi palabra es mi ley. Lo que prometo, lo sostengo.",
  10: "El hilo que tejo conecta lo que parecía separado. El tiempo se mueve en mis manos.",
  11: "Mi camino es mi enseñanza. Lo que vivo, lo transmito — aunque nunca lo diga.",
  12: "El hogar que construyo no se rompe. Soy raíz para los que me rodean.",
  13: "El poder que llevo es antiguo. Lo uso con intención, nunca con ego.",
  14: "Veo lo que otros no ven todavía. Mi visión no es fantasía — es avanzada.",
  15: "Lo que suelto me libera. El perdón que doy también es para mí.",
  16: "Pienso para todos, no solo para mí. Mi mente es un bien que comparto.",
  17: "Digo lo que otros no se atreven. La verdad que llevo cura cuando la entrego con amor.",
  18: "Sirvo porque quiero, no porque deba. El hogar que construyo para otros también es el mío.",
  19: "Nací para brillar — y también para honrar mi sombra. Los dos me hacen completo.",
};

/* ── Línea 3: Permiso de Diseño Humano por arquetipo ── */

const HD_PERMISSION: Record<ArchetypeKey, string> = {
  lider:
    "No necesito autorización para iniciar. Informar no es pedir permiso — es abrir el paso.",
  explorador:
    "Mi energía sabe antes de que mi mente decida. Cuando algo me jala, ya es una respuesta.",
  creador:
    "Cuando lo que hago me llena, no me agota. Esa diferencia lo es todo.",
  sabio:
    "Mi visión vale más cuando se pide. No la ofrezco gratis — la cuido hasta que alguien la invite.",
};

/* ── Ritual: ancla con la vela de copal por elemento ── */

const RITUAL_BY_ELEMENT: Record<ZodiacElement, string> = {
  fuego:
    "Enciende la vela. Mientras el copal arde, di estas palabras en voz alta — una vez es suficiente. El fuego las recibe.",
  tierra:
    "Enciende la vela con ambas manos. El copal ancla la intención en el cuerpo. Respira profundo antes de hablar.",
  aire:
    "Enciende la vela y deja que el humo suba. Las palabras viajan con él — no hace falta repetirlas.",
  agua:
    "Enciende la vela cerca del agua — un vaso es suficiente. Lo que dices frente al fuego y el agua, el cuerpo lo recuerda.",
};

/* ── Nota para el dossier impreso ── */

const PRINT_NOTES: Record<ArchetypeKey, string> = {
  lider:
    "Esta afirmación fue construida para ti a partir de tu análisis completo. No hay otra igual.",
  explorador:
    "Tu afirmación tiene tu huella — el mismo análisis en otra persona da una frase distinta.",
  creador:
    "Esta frase fue hecha con la misma atención con que tú haces las cosas. Es tuya.",
  sabio:
    "Estas palabras no son azar. Son el resultado de siete sistemas distintos que convergieron en ti.",
};

/* ── Función principal ── */

export function getAffirmations(
  archetypeKey: ArchetypeKey,
  nahualIndex: number,        // 0-19, del sealIndex de Kin Maya
  element: ZodiacElement,
): AffirmationProfile {
  const variant = nahualIndex % 3;
  const identity = IDENTITY[archetypeKey][variant];
  const mission  = NAHUAL_MISSION[nahualIndex] ?? NAHUAL_MISSION[0];
  const hd       = HD_PERMISSION[archetypeKey];
  const ritual   = RITUAL_BY_ELEMENT[element];
  const note     = PRINT_NOTES[archetypeKey];

  return {
    lines: [identity, mission, hd],
    ritual,
    printNote: note,
  };
}
