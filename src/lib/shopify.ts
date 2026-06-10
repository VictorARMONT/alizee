/**
 * Fetch público de catálogo Shopify.
 * Shopify expone /collections/[handle]/products.json sin auth en la mayoría de tiendas.
 * Revalidación cada 5 minutos via Next.js cache.
 */

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  product_type: string;
  tags: string[];
  images: { src: string; alt: string | null }[];
  variants: {
    id: number;
    title: string;
    price: string;
    available: boolean;
  }[];
}

export interface ShopifyProductNormalized {
  id: number;
  title: string;
  handle: string;
  image: string;
  price: number;
  priceFormatted: string;
  available: boolean;
  type: string;
  storeUrl: string;
}

function normalize(p: ShopifyProduct, baseUrl: string): ShopifyProductNormalized {
  const variant = p.variants[0];
  const price = parseFloat(variant?.price ?? "0");
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    image: p.images[0]?.src ?? "",
    price,
    priceFormatted: `$${price.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    available: variant?.available ?? false,
    type: p.product_type,
    storeUrl: `${baseUrl}/products/${p.handle}`,
  };
}

const ALLOWED_STORES = ["https://www.niceonline.com"];

export async function fetchShopifyCollection(
  storeUrl: string,
  collectionHandle: string,
  limit = 12,
): Promise<ShopifyProductNormalized[]> {
  if (!ALLOWED_STORES.includes(storeUrl)) return [];
  const url = `${storeUrl}/collections/${collectionHandle}/products.json?limit=${limit}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) return [];
    const data = await res.json() as { products: ShopifyProduct[] };
    return (data.products ?? []).map((p) => normalize(p, storeUrl));
  } catch {
    return [];
  }
}
