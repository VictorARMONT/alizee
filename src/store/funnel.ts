/**
 * ALIZEE — Store del funnel (zustand)
 * Memoria session-only. Sin localStorage (CLAUDE.md sección 6).
 */

import { create } from "zustand";
import type { QuestionId, ArchetypeKey } from "@/data/questions";
import { QUESTIONS, TOTAL_STEPS } from "@/data/questions";
import { scoreArchetype } from "@/funnel/score";
import { getSunSign, type SunSign } from "@/data/zodiac";
import type { ProductSlot } from "@/data/archetypes";
import { BOX_TIERS, DEFAULT_TIER_IDX, UPGRADES } from "@/data/pricing";

export type Answers = Partial<Record<QuestionId, string>>;

export type FlowStep = "reveal" | "configurator" | "crosssell" | "checkout";

export const FLOW_STEPS: FlowStep[] = ["reveal", "configurator", "checkout"];

interface FunnelState {
  /** paso del quiz (0..5). TOTAL_STEPS = ya pasó todo el quiz → va a /armar */
  step: number;
  answers: Answers;
  birthDate: string | null;
  birthTime: string | null;

  /** sub-vista dentro de /armar */
  flowStep: FlowStep;

  /** selecciones del configurador */
  selectedAncla: ProductSlot | null;
  selectedComplemento: ProductSlot | null;

  /** tier de box seleccionado (índice en BOX_TIERS) */
  selectedTierIdx: number;

  /** upgrades: id → seleccionado */
  upgrades: Record<string, boolean>;

  /** email capturado en checkout */
  email: string | null;

  /* --- acciones --- */
  setAnswer: (id: QuestionId, key: string) => void;
  setBirthDate: (iso: string | null) => void;
  setBirthTime: (t: string | null) => void;
  setEmail: (email: string) => void;
  next: () => void;
  prev: () => void;

  setFlowStep: (s: FlowStep) => void;
  nextFlowStep: () => void;
  prevFlowStep: () => void;

  setAncla: (slot: ProductSlot) => void;
  setComplemento: (slot: ProductSlot) => void;
  setTierIdx: (i: number) => void;
  toggleUpgrade: (id: string) => void;

  reset: () => void;

  /* --- selectores derivados --- */
  getArchetype: () => ArchetypeKey | null;
  getSunSign: () => SunSign | null;
  getRelationship: () => string | null;
  isDone: () => boolean;
  getTotal: () => number;
  getUpgradesTotal: () => number;
}

const initial = {
  step: 0,
  answers: {} as Answers,
  birthDate: null as string | null,
  birthTime: null as string | null,
  flowStep: "reveal" as FlowStep,
  selectedAncla: null as ProductSlot | null,
  selectedComplemento: null as ProductSlot | null,
  selectedTierIdx: DEFAULT_TIER_IDX,
  upgrades: {} as Record<string, boolean>,
  email: null as string | null,
};

export const useFunnel = create<FunnelState>((set, get) => ({
  ...initial,

  setAnswer: (id, key) =>
    set((s) => ({ answers: { ...s.answers, [id]: key } })),

  setBirthDate: (iso) => set({ birthDate: iso }),
  setBirthTime: (t) => set({ birthTime: t }),

  setEmail: (email) => set({ email }),

  next: () => set((s) => ({ step: Math.min(TOTAL_STEPS, s.step + 1) })),
  prev: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

  setFlowStep: (s) => set({ flowStep: s }),

  nextFlowStep: () =>
    set((s) => {
      const idx = FLOW_STEPS.indexOf(s.flowStep);
      const next = FLOW_STEPS[Math.min(idx + 1, FLOW_STEPS.length - 1)];
      return { flowStep: next };
    }),

  prevFlowStep: () =>
    set((s) => {
      const idx = FLOW_STEPS.indexOf(s.flowStep);
      const prev = FLOW_STEPS[Math.max(idx - 1, 0)];
      return { flowStep: prev };
    }),

  setAncla: (slot) => set({ selectedAncla: slot }),
  setComplemento: (slot) => set({ selectedComplemento: slot }),

  setTierIdx: (i) => set({ selectedTierIdx: Math.max(0, Math.min(i, BOX_TIERS.length - 1)) }),

  toggleUpgrade: (id) =>
    set((s) => ({
      upgrades: { ...s.upgrades, [id]: !s.upgrades[id] },
    })),

  reset: () => set({ ...initial }),

  getArchetype: () => scoreArchetype(get().answers)?.winner ?? null,

  getSunSign: () => getSunSign(get().birthDate),

  getRelationship: () => get().answers.relationship ?? null,

  isDone: () => get().step >= TOTAL_STEPS,

  getUpgradesTotal: () => {
    const active = get().upgrades;
    return UPGRADES.filter((u) => active[u.id]).reduce(
      (sum, u) => sum + u.priceMXN,
      0
    );
  },

  getTotal: () => BOX_TIERS[get().selectedTierIdx].priceMXN + get().getUpgradesTotal(),
}));

export function useCurrentQuestion() {
  const step = useFunnel((s) => s.step);
  if (step >= QUESTIONS.length) return null;
  return QUESTIONS[step];
}
