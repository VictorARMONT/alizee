/**
 * Schema JSON-LD para productos (tiers).
 * Inserta en el <head> para SEO y rich snippets.
 */

import { BOX_TIERS } from "@/data/pricing";

export function ProductSchemaScript() {
  const schemas = BOX_TIERS.map((tier) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${tier.name} — El Regalo Perfecto`,
    description: tier.tagline || `Paquete ${tier.name} con análisis personalizado y tótem en 3D.`,
    image: "https://alizee.mx/misterybox.png",
    brand: {
      "@type": "Brand",
      name: "ALIZEE",
    },
    offers: {
      "@type": "Offer",
      price: String(tier.priceMXN), // precio final, IVA incluido
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
      url: `https://alizee.mx/#${tier.id}`,
    },
    // aggregateRating omitido a propósito: marcar reviews sin reseñas reales
    // arriesga acción manual de Google. Reintroducir cuando existan reseñas.
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué incluye cada paquete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada paquete incluye: análisis personalizado, tótem en 3D, dossier con recomendaciones, piedra mineral y vela de copal.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuándo llega antes del Día del Padre?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pedidos hasta el 17 de junio para entregar antes del 21 de junio en México.",
        },
      },
      {
        "@type": "Question",
        name: "¿Se usa mi información personal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Solo para personalizar el regalo. Se guarda 90 días, luego se elimina. Leer Aviso de Privacidad.",
        },
      },
    ],
  };

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={`product-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
