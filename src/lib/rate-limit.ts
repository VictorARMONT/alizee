/**
 * Rate limiting simple en memoria.
 * Para MVP. En producción: usar Redis o similar.
 */

type RateLimitKey = string;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<RateLimitKey, RateLimitEntry>();

// Limpiar cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Verifica si se ha excedido el límite de rate limit.
 * @param identifier IP, email, session, etc.
 * @param limit máximo de requests
 * @param windowMs ventana de tiempo en ms
 * @returns { allowed: boolean, remaining: number }
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000, // 1 minuto por defecto
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = identifier;

  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  const allowed = entry.count <= limit;

  return { allowed, remaining };
}
