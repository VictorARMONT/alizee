import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://alizee.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/",                     priority: 1.0, changeFrequency: "daily" },
    { path: "/quiz",                 priority: 0.9, changeFrequency: "weekly" },
    { path: "/joyeria",              priority: 0.7, changeFrequency: "weekly" },
    { path: "/bolsas",               priority: 0.7, changeFrequency: "weekly" },
    { path: "/aviso-de-privacidad",  priority: 0.3, changeFrequency: "yearly" },
    { path: "/terminos",             priority: 0.3, changeFrequency: "yearly" },
    { path: "/envios-y-devoluciones",priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
