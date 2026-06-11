/**
 * Scoring de arquetipo.
 *
 * - 1 punto por opción de Q2-Q5 cuyo `archetype` coincide.
 * - Desempate: gana la respuesta de Q5/valores (TIEBREAKER_QUESTION_ID).
 * - Si no hay ninguna respuesta válida, devolvemos null.
 *
 * Pura, sin side-effects → fácil de testear y de mover si llega backend.
 */

import {
  QUESTIONS,
  TIEBREAKER_QUESTION_ID,
  type ArchetypeKey,
  type QuestionId,
} from "@/data/questions";
import { ARCHETYPE_ORDER } from "@/data/archetypes";

export type Answers = Partial<Record<QuestionId, string>>;

export interface ScoreResult {
  winner: ArchetypeKey;
  scores: Record<ArchetypeKey, number>;
  tiebreakerUsed: boolean;
}

function emptyScores(): Record<ArchetypeKey, number> {
  return { lider: 0, explorador: 0, creador: 0, sabio: 0 };
}

export function scoreArchetype(answers: Answers): ScoreResult | null {
  const scores = emptyScores();

  for (const q of QUESTIONS) {
    if (q.kind === "date" || q.kind === "time" || !q.options) continue;
    const picked = answers[q.id];
    if (!picked) continue;
    const opt = q.options.find((o) => o.key === picked);
    if (opt?.archetype) {
      scores[opt.archetype] += 1;
    }
  }

  const max = Math.max(...ARCHETYPE_ORDER.map((k) => scores[k]));
  if (max === 0) return null;

  const leaders = ARCHETYPE_ORDER.filter((k) => scores[k] === max);
  if (leaders.length === 1) {
    return { winner: leaders[0], scores, tiebreakerUsed: false };
  }

  // Desempate por Q5
  const tieAnswer = answers[TIEBREAKER_QUESTION_ID];
  const tieQuestion = QUESTIONS.find((q) => q.id === TIEBREAKER_QUESTION_ID);
  const tieOption = tieQuestion?.options?.find((o) => o.key === tieAnswer);
  if (tieOption?.archetype && leaders.includes(tieOption.archetype)) {
    return { winner: tieOption.archetype, scores, tiebreakerUsed: true };
  }

  // Si el desempate Q5 no resuelve (no respondida o no entre líderes), tomamos
  // el primero del orden canónico — determinístico, no aleatorio.
  return { winner: leaders[0], scores, tiebreakerUsed: true };
}
