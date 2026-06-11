/**
 * ALIZEE — Pricing del box y cross-sell (sección PADRE).
 *
 * Modelo:
 *   - 4 tiers de box. El tier seleccionado define el precio total.
 *   - La selección de ancla/complemento NO mueve el precio (es elegir variante).
 *
 * Todos los precios en MXN, IVA incluido.
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
    priceMXN: 690, // precio marketing, IVA incluido (~595 neto)
    tagline: "Lo esencial, dicho con intención.",
    includes: [
      "Dossier de análisis — su lectura completa, lista para guardar.",
      "Un regalo secreto, curado solo para él.",
    ],
  },
  {
    id: "ritual",
    name: "Ritual",
    priceMXN: 1050, // precio marketing, IVA incluido (~905 neto)
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
    priceMXN: 2250, // precio marketing, IVA incluido (~1940 neto)
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
    priceMXN: 4590, // precio marketing, IVA incluido (~3957 neto)
    tagline: "Lo que no se desempaca: se hereda.",
    includes: [
      "Dossier de análisis en papel y digital.",
      "Una pieza de arte hecha solo para él.",
      "Caja de madera con grabado a láser.",
      "Un regalo secreto — edición de lujo.",
    ],
  },
];

export const DEFAULT_TIER_IDX = 1; // Ritual — paquete por defecto (paso 7 del quiz)

export const BASE_BOX_PRICE_MXN = BOX_TIERS[DEFAULT_TIER_IDX].priceMXN;

/**
 * IVA México. Los precios de tiers son FINALES (IVA incluido).
 * ivaIncluded() desglosa el IVA contenido en un precio final (para resumen/factura).
 */
export const IVA_RATE = 0.16;

export function ivaIncluded(finalAmount: number): number {
  return Math.round(finalAmount - finalAmount / (1 + IVA_RATE));
}

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
