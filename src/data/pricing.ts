/**
 * ALIZEE — Pricing del box y cross-sell (sección PADRE).
 *
 * Modelo:
 *   - 4 tiers de box. El tier seleccionado define el precio base.
 *   - La selección de ancla/complemento NO mueve el precio (es elegir variante).
 *   - Upgrades = aparte, opt-in, suman al total.
 *
 * Todos los precios en MXN.
 */

export interface BoxTier {
  id: string;
  name: string;
  priceMXN: number;
  tagline: string;
  includes: string[];
  highlight?: boolean;
}

export const BOX_TIERS: BoxTier[] = [
  {
    id: "esencial",
    name: "Esencial",
    priceMXN: 580,
    tagline: "Lo esencial, dicho con intención.",
    includes: [
      "Dossier de análisis — su lectura completa, lista para guardar.",
      "Un regalo secreto, curado solo para él.",
    ],
  },
  {
    id: "ritual",
    name: "Ritual",
    priceMXN: 890,
    tagline: "Cuando el objeto también carga significado.",
    includes: [
      "Dossier de análisis en papel y digital.",
      "Una pieza de arte hecha solo para él.",
      "Un regalo secreto.",
    ],
  },
  {
    id: "ceremonia",
    name: "Ceremonia",
    priceMXN: 1920,
    tagline: "El regalo que se vuelve un momento.",
    includes: [
      "Dossier de análisis en papel y digital.",
      "Una pieza de arte hecha solo para él.",
      "Un regalo secreto.",
    ],
    highlight: true,
  },
  {
    id: "legado",
    name: "Legado",
    priceMXN: 3950,
    tagline: "Lo que no se desempaca: se hereda.",
    includes: [
      "Dossier de análisis en papel y digital.",
      "Una pieza de arte hecha solo para él.",
      "Caja de madera con grabado a láser.",
      "Un regalo secreto — edición de lujo.",
    ],
  },
];

export const DEFAULT_TIER_IDX = 2; // Primario — tier héroe

export const BASE_BOX_PRICE_MXN = BOX_TIERS[DEFAULT_TIER_IDX].priceMXN;

export interface Upgrade {
  id: string;
  label: string;
  detail?: string;
  priceMXN: number;
  /** estado por defecto al cargar el cross-sell */
  defaultSelected?: boolean;
}

/**
 * Cross-sell estable (copy-padre.md + addendum). Precios:
 *  - grabado +250 [CONFIRMAR]
 *  - empaque premium +150 [CONFIRMAR]
 *  - vela extra [CONFIRMAR — usamos 200 como placeholder visible]
 */
export const UPGRADES: Upgrade[] = [
  {
    id: "grabado",
    label: "Grabado láser personalizado",
    detail: "Iniciales o frase corta sobre el ancla. Hasta 24 caracteres.",
    priceMXN: 250,
  },
  {
    id: "empaque",
    label: "Empaque premium en caja de madera",
    detail: "Caja de pino lacada con tapa imantada. Reusable.",
    priceMXN: 150,
  },
  {
    id: "velaExtra",
    label: "Vela de copal extra",
    detail: "Una segunda vela para el ritual mensual.",
    priceMXN: 200, // [CONFIRMAR]
  },
];

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
