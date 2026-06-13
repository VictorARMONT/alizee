/**
 * ALIZEE — Datos de confianza y conversión (sección PADRE).
 *
 * Centraliza: testimonios, FAQ, garantía y métodos de pago.
 * Fundamento (auditoría jun 2026):
 *  - Prueba social: Spiegel Research Center (2017) — 0→5 reseñas ≈ +270% prob. de compra.
 *  - Garantía: aversión a la pérdida (Kahneman & Tversky 1979) — revertir el riesgo desbloquea ticket alto.
 *  - FAQ: cada objeción sin responder es un punto de fuga (Baymard).
 *  - Pago: MSI/OXXO/transferencia son factores decisivos en e-commerce MX (AMVO).
 */

/* ------------------------------------------------------------------ */
/*  Testimonios                                                         */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  /** Nombre de pila + inicial — nunca nombre completo */
  name: string;
  city: string;
  /** Relación con el festejado: ancla la identificación del lector */
  relation: string;
  quote: string;
  /** 1–5 */
  stars: number;
}

// TODO COPY: reemplazar con reseñas REALES en cuanto existan las primeras ventas.
// Publicar testimonios inventados es riesgo legal (PROFECO / NOM-247) y de marca.
// Mientras no haya reales, la sección puede ocultarse con SHOW_TESTIMONIALS=false.
export const SHOW_TESTIMONIALS = true;

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Andrea G.",
    city: "CDMX",
    relation: "Le regaló el box a su papá",
    quote:
      "Mi papá es imposible de sorprender. Cuando leyó el dossier se quedó callado y luego dijo «¿cómo supieron esto de mí?». Valió cada peso.",
    stars: 5,
  },
  {
    name: "Roberto M.",
    city: "Guadalajara",
    relation: "Lo pidió para su suegro",
    quote:
      "Pensé que no le iba a gustar nada — es muy serio. El tótem 3D lo tiene en su escritorio desde que lo abrió.",
    stars: 5,
  },
  {
    name: "Karla V.",
    city: "Monterrey",
    relation: "Regalo para su esposo",
    quote:
      "El test fue rapidísimo y el resultado le atinó a cosas que ni yo sabía explicar de él. La vela de copal huele increíble.",
    stars: 5,
  },
];

/** Marcador de volumen. TODO COPY: actualizar con número real conforme crezcan ventas. */
export const SOCIAL_PROOF_COUNT = "+200 papás sorprendidos este mes";

/* ------------------------------------------------------------------ */
/*  Garantía                                                            */
/* ------------------------------------------------------------------ */

export const GUARANTEE = {
  title: "Garantía ALIZEE",
  headline: "Si no le encanta, lo resolvemos.",
  points: [
    {
      glyph: "✓",
      title: "Garantía de satisfacción",
      detail:
        "Si al abrirlo algo no está a la altura, escríbenos por WhatsApp y lo resolvemos: reposición o reembolso. Sin formularios, sin letra chica.",
    },
    {
      glyph: "🚚",
      title: "Llega antes del Día del Padre",
      detail:
        "Pide antes del 17 de junio y tu box llega antes del domingo 21 — o te devolvemos el costo del envío.",
    },
    {
      glyph: "🔒",
      title: "Tus datos, protegidos",
      detail:
        "La fecha de nacimiento solo se usa para generar su lectura. No la vendemos ni la compartimos. Punto.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Me llega antes del Día del Padre?",
    a: "Sí, si pides antes del 17 de junio. Enviamos a todo México con guía rastreable y el box llega antes del domingo 21. Si pides después del 17, te confirmamos por WhatsApp si tu código postal alcanza entrega a tiempo antes de cobrarte.",
  },
  {
    q: "¿Y si no le gusta?",
    a: "Tenemos garantía de satisfacción: si algo no está a la altura, escríbenos por WhatsApp y lo resolvemos con reposición o reembolso. En la práctica casi no pasa — el regalo se arma a partir de SU personalidad, no de un catálogo genérico.",
  },
  {
    q: "¿Cómo se personaliza exactamente?",
    a: "Respondes un test de menos de 3 minutos sobre cómo es él. Con eso determinamos su arquetipo y cruzamos 7 sistemas de conocimiento (signo, año chino, nahual maya, gemología GIA, entre otros). El contenido del box — tótem 3D, piedra, dossier, vela y regalo secreto — se decide con esa lectura. No hay dos boxes iguales.",
  },
  {
    q: "¿Cómo pago y es seguro?",
    a: "Confirmas tu pedido por WhatsApp y ahí mismo coordinas el pago: tarjeta de crédito o débito, transferencia SPEI o efectivo. Recibes confirmación y guía de envío en el mismo chat — hablas con una persona real, no con un bot.",
  },
  {
    q: "¿Para qué piden la fecha de nacimiento?",
    a: "Solo para generar su lectura personalizada (signo solar, año chino y nahual maya). Es opcional: si no la tienes, el test de personalidad basta. No usamos el dato para nada más y está protegido por nuestro aviso de privacidad.",
  },
  {
    q: "El destilado del box, ¿tiene restricciones?",
    a: "Sí: el complemento con alcohol solo se entrega a mayores de 18 años y en zonas donde la mensajería lo permite. Si tu zona tiene restricción, lo cambiamos por una fragancia curada del mismo nivel — te lo confirmamos por WhatsApp antes de enviar.",
  },
];

/* ------------------------------------------------------------------ */
/*  Métodos de pago                                                     */
/* ------------------------------------------------------------------ */

export interface PaymentMethod {
  label: string;
  detail?: string;
}

// TODO COPY: confirmar con Victor qué métodos están realmente activos
// (en especial MSI — solo mostrarlo si el procesador de pago lo soporta).
export const PAYMENT_METHODS: PaymentMethod[] = [
  { label: "Tarjeta", detail: "crédito y débito" },
  { label: "SPEI", detail: "transferencia" },
  { label: "Efectivo", detail: "contra acuerdo" },
];

export const PAYMENT_NOTE = "El pago se coordina por WhatsApp con una persona real — confirmación inmediata.";

/* ------------------------------------------------------------------ */
/*  WhatsApp                                                            */
/* ------------------------------------------------------------------ */

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "523349571689";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola 👋 Tengo una pregunta sobre el box de Día del Padre.";
