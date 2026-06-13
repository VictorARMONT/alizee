/**
 * ALIZEE — Store del funnel (zustand)
 *
 * Persistencia: sessionStorage (NO localStorage). Se borra al cerrar la pestaña.
 * Contiene PII (email, respuestas, fecha de nacimiento) → reset() limpia el
 * storage explícitamente para no dejar datos personales tras completar/abandonar.
 * CLAUDE.md §6: no usar storage para estado crítico de checkout sin avisar — la
 * dirección de entrega NO se persiste (vive en estado local del checkout).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QuestionId, ArchetypeKey } from "@/data/questions";
import { QUESTIONS, TOTAL_STEPS } from "@/data/questions";
import { scoreArchetype } from "@/funnel/score";
import { getSunSign, type SunSign } from "@/data/zodiac";
import type { ProductSlot } from "@/data/archetypes";
import { BOX_TIERS, DEFAULT_TIER_IDX } from "@/data/pricing";

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

  /** email capturado en checkout */
  email: string | null;

  /** aceptación de aviso de privacidad */
  privacyAccepted: boolean;

  /* --- acciones --- */
  setAnswer: (id: QuestionId, key: string) => void;
  setBirthDate: (iso: string | null) => void;
  setBirthTime: (t: string | null) => void;
  setEmail: (email: string) => void;
  setPrivacyAccepted: (accepted: boolean) => void;
  next: () => void;
  prev: () => void;

  setFlowStep: (s: FlowStep) => void;
  nextFlowStep: () => void;
  prevFlowStep: () => void;

  setAncla: (slot: ProductSlot) => void;
  setComplemento: (slot: ProductSlot) => void;
  setTierIdx: (i: number) => void;

  reset: () => void;

  /* --- selectores derivados --- */
  getArchetype: () => ArchetypeKey | null;
  getSunSign: () => SunSign | null;
  getRelationship: () => string | null;
  isDone: () => boolean;
  getTotal: () => number;
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
  email: null as string | null,
  privacyAccepted: false as boolean,
};

export const useFunnel = create<FunnelState>()(
  persist(
    (set, get) => ({
      ...initial,

  setAnswer: (id, key) =>
    set((s) => ({ answers: { ...s.answers, [id]: key } })),

  setBirthDate: (iso) => set({ birthDate: iso }),
  setBirthTime: (t) => set({ birthTime: t }),

  setEmail: (email) => set({ email }),

  setPrivacyAccepted: (accepted) => set({ privacyAccepted: accepted }),

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

  reset: () => {
    set({ ...initial });
    // Borra la PII persistida (email/respuestas/fecha) del sessionStorage.
    if (typeof window !== "undefined") {
      try { window.sessionStorage.removeItem("alizee-funnel"); } catch { /* noop */ }
    }
  },

  getArchetype: () => scoreArchetype(get().answers)?.winner ?? null,

  getSunSign: () => getSunSign(get().birthDate),

  getRelationship: () => get().answers.relationship ?? null,

  isDone: () => get().step >= TOTAL_STEPS,

  /** Total final (precios ya incluyen IVA) */
  getTotal: () => BOX_TIERS[get().selectedTierIdx].priceMXN,
    }),
    {
      name: "alizee-funnel",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          length: 0,
          clear: () => {},
          key: () => null,
        }
      ),
    }
  )
);

export function useCurrentQuestion() {
  const step = useFunnel((s) => s.step);
  if (step >= QUESTIONS.length) return null;
  return QUESTIONS[step];
}
