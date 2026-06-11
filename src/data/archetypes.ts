/**
 * ALIZEE — Modelo de arquetipos (sección PADRE)
 * Copy y mapeo de productos: copy-padre.md + funnel-v2-addendum.md + decisiones de Victor.
 *
 * Regla operacional (fulfillment con ventana corta):
 *   - Lo FÍSICO se personaliza por arquetipo (4 variantes max).
 *   - Lo TEXTUAL/DIGITAL del dossier se personaliza por signo (12 variantes, gratis variar).
 *
 * Capas del box (ver funnel-v2-addendum.md sección 0):
 *   1. Contenido box  → ancla + complemento + piedra + vela + dossier (INCLUIDO en precio base $3,000).
 *   2. Detalle sorpresa → joyería chica / objeto pequeño, INCLUIDO, no seleccionable, por arquetipo.
 *   3. Pulsera post-venta → se compra y envía aparte según el análisis (piedra por arquetipo/nahual). Sin upgrades en el funnel.
 *
 * Todos los SKU están `[SKU]` hasta que Victor llene catálogo.
 * Vela: solo 2 variantes en lanzamiento (copal + palo santo). Mapeo abajo cambiable en 4 líneas.
 */

import type { ArchetypeKey } from "./questions";

export interface ProductSlot {
  /** familia del producto, no SKU */
  type:
    | "reloj"
    | "piel"
    | "fragancia"
    | "destilado"
    | "piedra"
    | "vela"
    | "dossier"
    | "sorpresa";
  label: string;
  /** descripción corta, para card en /armar */
  detail?: string;
  /** SKU a confirmar por Victor */
  sku: string;
}

export interface Archetype {
  key: ArchetypeKey;
  name: string;
  /** tagline corto bajo el nombre */
  tagline: string;
  /** una línea descriptiva del arquetipo */
  essence: string;
  /** copy para el dossier en la revelación (~2 líneas) */
  dossierLead: string;
  /** ancla = pieza principal — máx 2 opciones a elegir por el cliente */
  ancla: ProductSlot[];
  /** complemento secundario — máx 2 opciones */
  complemento: ProductSlot[];
  /** piedra/mineral asociado (incluido, no seleccionable) */
  piedra: ProductSlot;
  /** vela ritual por arquetipo (copal o palo santo) */
  vela: ProductSlot;
  /** detalle sorpresa: regalo dentro del regalo, no seleccionable */
  detalleSorpresa: ProductSlot;
}

/**
 * Constantes en TODOS los arquetipos (post v1 addendum: la vela ya NO es constante).
 * Solo queda el dossier impreso. La caja exterior y el sello 3D final son
 * elementos de packaging, no SKU separados — viven en copy de checkout/reveal.
 */
export const CONSTANTS: ProductSlot[] = [
  {
    type: "dossier",
    label: "Dossier de análisis impreso",
    detail: "Lectura de arquetipo + signo, lugares y rituales sugeridos.",
    sku: "[SKU]",
  },
];

const SKU = "[SKU]";

/**
 * Mapeo vela ↔ arquetipo (lanzamiento con solo 2 variantes).
 * Cambiar aquí si Victor decide otro mapping.
 */
const VELA_COPAL: ProductSlot = {
  type: "vela",
  label: "Vela de copal",
  detail: "Resina de copal mexicano. Protección y arraigo.",
  sku: SKU,
};
const VELA_PALO_SANTO: ProductSlot = {
  type: "vela",
  label: "Vela de palo santo",
  detail: "Madera de palo santo. Limpia y abre camino.",
  sku: SKU,
};

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  lider: {
    key: "lider",
    name: "El Líder",
    tagline: "El que guía",
    essence: "Legado, autoridad, lo que ha construido.",
    dossierLead:
      "Construye con autoridad y protege con presencia. Su regalo honra lo que ha levantado y le pide al mundo respeto por seguir levantando.",
    ancla: [
      { type: "reloj", label: "Reloj clásico / elegante", detail: "Línea sobria, peso, presencia.", sku: SKU },
      { type: "piel",  label: "Pieza de piel estructurada", detail: "Cinturón, portafolio o tarjetero.", sku: SKU },
    ],
    complemento: [
      { type: "fragancia", label: "Fragancia amaderada / ámbar", sku: SKU },
      { type: "destilado", label: "Destilado añejo / reserva",   sku: SKU },
    ],
    piedra: { type: "piedra", label: "Ojo de tigre o pirita", detail: "Autoridad, decisión.", sku: SKU },
    vela:   VELA_COPAL,
    detalleSorpresa: {
      type: "sorpresa",
      label: "Pieza chica de presencia", // [CONFIRMAR copy/objeto exacto]
      detail: "Mancuernilla, anillo de sello o alfiler de corbata. Curado a su lectura.",
      sku: SKU,
    },
  },

  explorador: {
    key: "explorador",
    name: "El Explorador",
    tagline: "El que descubre",
    essence: "Libertad, movimiento, lo que está por conocer.",
    dossierLead:
      "Se mueve para no apagarse. Su regalo es una excusa para seguir buscando — algo que aguante el viaje y le recuerde por qué salió.",
    ancla: [
      { type: "reloj", label: "Reloj de campo / deportivo", detail: "Resistente, listo para moverse.", sku: SKU },
      { type: "piel",  label: "Piel resistente para viaje",  detail: "Duffel, mochila o llavero robusto.", sku: SKU },
    ],
    complemento: [
      { type: "fragancia", label: "Fragancia fresca cítrica-amaderada", sku: SKU },
      { type: "destilado", label: "Mezcal joven",                       sku: SKU },
    ],
    piedra: { type: "piedra", label: "Turquesa o ágata", detail: "Protección en el camino.", sku: SKU },
    vela:   VELA_PALO_SANTO,
    detalleSorpresa: {
      type: "sorpresa",
      label: "Pieza de camino", // [CONFIRMAR]
      detail: "Pulsera de cuero, llavero pequeño o brújula chica.",
      sku: SKU,
    },
  },

  creador: {
    key: "creador",
    name: "El Inventor",
    tagline: "El que hace",
    essence: "Oficio, manos, detalle.",
    dossierLead:
      "Hace cosas y las hace bien. Su regalo es material y tiene oficio — una pieza para usar a diario y otra para sus rituales de taller.",
    ancla: [
      { type: "piel",  label: "Pieza de piel artesanal", detail: "Funda, estuche o mandil de cuero.", sku: SKU },
      { type: "reloj", label: "Reloj minimalista",       detail: "Líneas limpias, sin ruido.", sku: SKU },
    ],
    complemento: [
      { type: "fragancia", label: "Fragancia herbal / especiada",        sku: SKU },
      { type: "destilado", label: "Destilado artesanal de lote pequeño", sku: SKU },
    ],
    piedra: { type: "piedra", label: "Cuarzo o amatista", detail: "Claridad para hacer.", sku: SKU },
    vela:   VELA_PALO_SANTO,
    detalleSorpresa: {
      type: "sorpresa",
      label: "Objeto de oficio", // [CONFIRMAR]
      detail: "Mini-herramienta, regla de bronce o cuaderno-mini para el taller.",
      sku: SKU,
    },
  },

  sabio: {
    key: "sabio",
    name: "El Sabio",
    tagline: "El que acompaña",
    essence: "Calma, conocimiento, introspección.",
    dossierLead:
      "Sostiene desde la calma. Su regalo es íntimo: cosas que se usan despacio, en silencio, con un café cerca.",
    ancla: [
      { type: "piel",  label: "Cartera fina o funda de libreta de piel", detail: "Objeto cotidiano, bien hecho.", sku: SKU },
      { type: "reloj", label: "Reloj de líneas limpias",                 detail: "Lectura tranquila del tiempo.", sku: SKU },
    ],
    complemento: [
      { type: "fragancia", label: "Fragancia amaderada-incienso", sku: SKU },
      { type: "destilado", label: "Reposado suave",               sku: SKU },
    ],
    piedra: { type: "piedra", label: "Amatista o cuarzo blanco", detail: "Calma, claridad mental.", sku: SKU },
    vela:   VELA_COPAL,
    detalleSorpresa: {
      type: "sorpresa",
      label: "Pieza íntima", // [CONFIRMAR]
      detail: "Marcalibros de bronce, dije pequeño o piedra pulida extra.",
      sku: SKU,
    },
  },
};

export const ARCHETYPE_ORDER: ArchetypeKey[] = [
  "lider",
  "explorador",
  "creador",
  "sabio",
];
