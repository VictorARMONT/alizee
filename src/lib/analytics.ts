/**
 * ALIZEE — Eventos de analytics (CLAUDE.md §8)
 *
 * Métricas que importan:
 *  1. Drop-off por paso (dónde se cae la gente).
 *  2. % que completa el análisis.
 *  3. Add-to-cart tras la revelación.
 *
 * Hoy: console.log en dev + stub de gtag/window.__analytics para conectar
 * cualquier proveedor (GA4, Mixpanel, Amplitude) sin tocar los callers.
 * En producción: reemplazar `dispatch` con el SDK del proveedor elegido.
 */

import type { ArchetypeKey } from "@/data/questions";

/* ------------------------------------------------------------------ */
/*  Definición de eventos (CLAUDE.md §8)                               */
/* ------------------------------------------------------------------ */

export type AnalyticsEvent =
  | { name: "StartQuiz" }
  | { name: "AnswerQuestion"; step: number; questionId: string; optionKey: string; archetype?: ArchetypeKey }
  | { name: "CompleteQuiz"; archetype: ArchetypeKey | null; hasBirthDate: boolean; relationship: string | null }
  | { name: "ViewRecommendation"; archetype: ArchetypeKey; hasSunSign: boolean }
  | { name: "ConfiguratorComplete"; archetype: ArchetypeKey; anclaLabel: string; complementoLabel: string }
  | { name: "AddToCart"; archetype: ArchetypeKey; total: number; upgrades: string[] }
  | { name: "InitiateCheckout"; archetype: ArchetypeKey; total: number; upgrades: string[] };

/* ------------------------------------------------------------------ */
/*  Dispatcher                                                          */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    /** Stub para proveedores de analytics (GA4, Mixpanel, etc.) */
    __analyticsDispatch?: (event: AnalyticsEvent) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function dispatch(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  // Dev: log completo
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", event.name, event);
  }

  // Proveedor externo (enchufar aquí cuando esté listo)
  if (typeof window.__analyticsDispatch === "function") {
    window.__analyticsDispatch(event);
    return;
  }

  // GA4 stub — funciona si cargas el script de gtag en layout.tsx
  if (typeof window.gtag === "function") {
    const { name, ...params } = event;
    window.gtag("event", name, params);
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers tipados para los callers                                    */
/* ------------------------------------------------------------------ */

export const analytics = {
  startQuiz() {
    dispatch({ name: "StartQuiz" });
  },

  answerQuestion(
    step: number,
    questionId: string,
    optionKey: string,
    archetype?: ArchetypeKey
  ) {
    dispatch({ name: "AnswerQuestion", step, questionId, optionKey, archetype });
  },

  completeQuiz(
    archetype: ArchetypeKey | null,
    hasBirthDate: boolean,
    relationship: string | null
  ) {
    dispatch({ name: "CompleteQuiz", archetype, hasBirthDate, relationship });
  },

  viewRecommendation(archetype: ArchetypeKey, hasSunSign: boolean) {
    dispatch({ name: "ViewRecommendation", archetype, hasSunSign });
  },

  configuratorComplete(
    archetype: ArchetypeKey,
    anclaLabel: string,
    complementoLabel: string
  ) {
    dispatch({ name: "ConfiguratorComplete", archetype, anclaLabel, complementoLabel });
  },

  addToCart(archetype: ArchetypeKey, total: number, upgrades: string[]) {
    dispatch({ name: "AddToCart", archetype, total, upgrades });
  },

  initiateCheckout(archetype: ArchetypeKey, total: number, upgrades: string[]) {
    dispatch({ name: "InitiateCheckout", archetype, total, upgrades });
  },
};
