import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://alizee.mx";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /ficha lleva PII en la URL y es uso interno → nunca indexar.
      disallow: ["/ficha", "/gracias", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
